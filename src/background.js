const SETTINGS_INTERVAL_CHECK_DEFAULT = 1000;
const SETTINGS_INTERVAL_UPLOAD_DEFAULT = 10000;
const savedSessions = new Map();
let sessionsToUpload = [];
const supportedWebsites = ['youtube', 'facebook']

chrome.action.setBadgeText({text: 'OFF'});
chrome.action.setBadgeBackgroundColor({color: '#737373'});

//Needed to resolve the automatic pause of the background script
let lifeline;

async function keepAlive() {
    if (lifeline) return;
    for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        });
        chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
        return;
      } catch (e) {}
    }
    chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
  }
  
  async function retryOnTabUpdate(tabId, info, tab) {
    if (info.url && /^(file|https?):/.test(info.url)) {
      keepAlive();
    }
  }
  
keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

try {
    self.importScripts('./lib/dayjs.min.js', './lib/moment.min.js')

    chrome.runtime.onMessage.addListener((msg, _, resp) => {
        switch(msg.command) {
            case 'fetch': 
                chrome.storage.sync.get(null, (result) => {
                    const userSessions = result
                    delete userSessions.FBhome
                    delete userSessions.FBscrolling
                    delete userSessions.YThome
                    delete userSessions.YTrecommendation
                    delete userSessions.YTscrolling
                    delete userSessions.userid
                    resp({type: "result", status: "success", data: Object.values(userSessions), request: msg});
                })
                return true;
            case 'scrollEvent':
                lastSession['scrolls'] += 1
                break
            case 'clickEvent':
                lastSession['clicks'] += 1
                break
            default: 
                throw new Error('Invalid message: ' + msg.command)
        }
    });

} catch(err) {
    console.log(err);
}

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

let lastSession = {
    'site': undefined,
    'date': undefined,
    'calendarWeek': undefined,
    'timestampStart': undefined,
    'timestampEnd': undefined,
    'userId': undefined, 
    'clicks': 0,
    'duration': 0,
    'scrolls': 0,
    'ongoing': false
};

function initializeSession(userId, site){
    const timestampStart = new Date().getTime()
    lastSession = {
        'site': site,
        'date': dayjs(timestampStart).format("YYYY/MM/DD"),
        'calendarWeek': moment(timestampStart).format("YYYY") + "-" + moment(timestampStart).format("W"),
        'timestampStart': timestampStart,
        'timestampEnd': undefined,
        'userId': userId, 
        'clicks': 0,
        'duration': 0,
        'scrolls': 0,
        'ongoing': true,
    }    
    chrome.action.setBadgeText({text: 'ON'});
    chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
}

function resetSession(userId){
    lastSession = {
        'site': undefined,
        'date': undefined,
        'calendarWeek': undefined,
        'timestampStart': undefined,
        'timestampEnd': undefined,
        'userId': userId, 
        'clicks': 0,
        'duration': 0,
        'scrolls': 0,
        'ongoing': false
    };
    chrome.action.setBadgeText({text: 'OFF'});
    chrome.action.setBadgeBackgroundColor({color: '#737373'});
}


function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

chrome.storage.sync.get('userid', function(items) {
    var userid = items.userid;
    if (userid) {
        trackTimeSpent(userid);
        updateStats()
    } else {
        userid = getRandomToken();
        chrome.storage.sync.set({userid: userid, YThome: true, YTrecommendation: true, YTscrolling: true, FBhome: true, FBscrolling: true}, function() {
            trackTimeSpent(userid);
            updateStats()
        });
    }
});

function trackTimeSpent(userId){
    setInterval(()=>{
        chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
            if (currentWindow && currentWindow.focused) {
                const activeTab = currentWindow.tabs.find(t => t.active === true);
                const currentUrl = extractHostname(activeTab.url)
                const currentSite = supportedWebsites.filter((site) => currentUrl.includes(site))[0] ?? 'unsupported site'
                if(activeTab !== undefined && supportedWebsites.filter((site) => currentSite.includes(site)).length > 0) {
                    if(lastSession.ongoing && lastSession['site'] !== currentSite && supportedWebsites.filter((site) => currentSite.includes(site)).length > 0) {     //Required when passing from a supported site to another
                        lastSession.timestampEnd = new Date().getTime();
                        sessionsToUpload.push(lastSession);
                        resetSession(userId);
                    }
                    if(!lastSession.ongoing){
                        initializeSession(userId, currentSite);
                    } else if(lastSession['duration'] < 30) {       // A session ended after 30 seconds, so even if the user closes the browser, only the last 30-second session is lost
                        lastSession['duration'] = lastSession['duration'] + 1;
                    } else {
                        //stop the last session, if needed
                        if(lastSession.ongoing){
                            lastSession.timestampEnd = new Date().getTime();
                            sessionsToUpload.push(lastSession);
                            resetSession(userId);
                        }    
                    }
                } else {
                    //stop the last session, if needed
                    if(lastSession.ongoing){
                        lastSession.timestampEnd = new Date().getTime();
                        sessionsToUpload.push(lastSession);
                        resetSession(userId);
                    }
                }
            } else {
                if(lastSession.ongoing){
                    //stop the last session, if needed
                    lastSession.timestampEnd = new Date().getTime();
                    sessionsToUpload.push(lastSession);  
                    resetSession(userId);
                }
            }
        });
    }, SETTINGS_INTERVAL_CHECK_DEFAULT);
}

function extractHostname(url){
    var hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function updateStats() {
    setInterval(()=>{
        if(sessionsToUpload.length > 0) {
            sessionsToUpload.forEach(async (session) => {
                const key= session.date + "-" + session.site
                if(!savedSessions.get(key)) {
                    const result = await chrome.storage.sync.get([key])
                    if(!result[key]) {
                        const newDaySession = {
                            date: session.date,
                            calendarWeek: session.calendarWeek,
                            site: session.site,
                            clicks: session.clicks,
                            duration: session.duration,
                            scrolls: session.scrolls
                        }
                        await chrome.storage.sync.set({[key]: newDaySession})
                        savedSessions.set(key, newDaySession)
                    } else {
                        const currentDigest = result[key]
                        currentDigest.scrolls += session.scrolls
                        currentDigest.duration += session.duration
                        currentDigest.clicks += session.clicks
                        await chrome.storage.sync.set({[key]: currentDigest})
                        savedSessions.set(key, currentDigest)
                    }
      
                } else {    
                    const currentDigest = savedSessions.get(key)
                    currentDigest.scrolls += session.scrolls
                    currentDigest.duration += session.duration
                    currentDigest.clicks += session.clicks
                    await chrome.storage.sync.set({[key]: currentDigest})
                    savedSessions.set(key, currentDigest)
                }
            })
            sessionsToUpload = []
        }

    }, SETTINGS_INTERVAL_UPLOAD_DEFAULT);
}
