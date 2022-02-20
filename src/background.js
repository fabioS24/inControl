const SETTINGS_INTERVAL_CHECK_DEFAULT = 1000;
const SETTINGS_INTERVAL_UPLOAD_DEFAULT = 10000;
let sessionsToUpload = [];
let userSessions = [];

chrome.action.setBadgeText({text: 'OFF'});
chrome.action.setBadgeBackgroundColor({color: '#737373'});

try {
    chrome.runtime.onMessage.addListener((msg, sender, resp) => {
        if(msg.command === "fetch") {
            chrome.storage.sync.get(['sessions'], (result) => {
                console.log(result, "sessioni")
                userSessions = result.sessions
                resp({type: "result", status: "success", data: userSessions, request: msg});
            })
            return true;
        }
        //throw new Error('Invalid message: ' + msg)
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
    'timestampStart': undefined,
    'timestampEnd': undefined,
    'userId': undefined, 
    'clicks': 0,
    'duration': 0,
    'scrolls': 0,
    'ongoing': false,
    'YThome': undefined,
    'YTscrolling': undefined,
    'YTrecommendation': undefined,
    'FBhome': undefined,
    'FBscrolling': undefined,
};

function initializeSession(userId, startStudy, site){
    chrome.storage.sync.get(['YThome', 'YTscrolling', 'YTrecommendation', 'FBhome', 'FBscrolling'], function(result) {
        lastSession = {
            'site': site,
            'timestampStart': new Date().getTime(),
            'timestampEnd': undefined,
            'userId': userId, 
            'clicks': 0,
            'duration': 0,
            'scrolls': 0,
            'ongoing': true,
            'YThome': result['YThome'],
            'YTscrolling': result['YTscrolling'],
            'YTrecommendation': result['YTrecommendation'],
            'FBhome': result['FBhome'],
            'FBscrolling': result['FBscrolling'],
        };

        chrome.action.setBadgeText({text: 'ON'});
        chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
    });
}

function resetSession(userId){
    lastSession = {
        'site': undefined,
        'timestampStart': undefined,
        'timestampEnd': undefined,
        'userId': userId, 
        'clicks': 0,
        'duration': 0,
        'scrolls': 0,
        'ongoing': false,
        'YThome': undefined,
        'YTscrolling': undefined,
        'YTrecommendation': undefined,
        'FBhome': undefined,
        'FBscrolling': undefined,
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

function scrollInSession(){
    lastSession['scrolls'] += 1;
}

function clickInSession(){
    lastSession['clicks'] += 1;
}

chrome.storage.sync.get('userid', function(items) {
    var userid = items.userid;
    if (userid) {
        trackTimeSpent(userid);
        uploadSessions(userid);
    } else {
        userid = getRandomToken();
        chrome.storage.sync.set({userid: userid, YThome: false, YTrecommendation: false, YTscrolling: false, FBhome: false, FBscrolling: false}, function() {
            console.log("New userID: " + userid);
            trackTimeSpent(userid);
            uploadSessions(userid);
        });
    }
    
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request == "scrollEvent"){
              scrollInSession();
            } else if (request == "clickEvent"){
              clickInSession();
            } else {
                //throw new Error('Invalid message: ' + request)
            }
        }
    );
});

function trackTimeSpent(userId){
    console.log("Tracking activated!");
    setInterval(()=>{
        chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
            if (currentWindow && currentWindow.focused) {
                var activeTab = currentWindow.tabs.find(t => t.active === true);
                if (activeTab !== undefined && extractHostname(activeTab.url).includes("youtube")) {
                    if(lastSession.ongoing && lastSession['site'] === "facebook") {     //Required when passing from YT to FB
                        lastSession.timestampEnd = new Date().getTime();
                        sessionsToUpload.push(lastSession);
                        resetSession(userId);
                    }
                    if(!lastSession.ongoing){
                        initializeSession(userId, undefined, "youtube");
                    }
                    lastSession['duration'] = lastSession['duration'] + 1;

                } else if(activeTab !== undefined && extractHostname(activeTab.url).includes("facebook")) {
                    if(lastSession.ongoing && lastSession['site'] === "youtube") {      //Required when passing from FB to YT
                        lastSession.timestampEnd = new Date().getTime();
                        sessionsToUpload.push(lastSession);
                        resetSession(userId);
                    }
                    if(!lastSession.ongoing){
                        initializeSession(userId, undefined, "facebook");
                    }
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

function uploadSessions() {
    setInterval(()=>{
        console.log(sessionsToUpload, "Nuove sessioni registrate, ancora da caricare")
        console.log(userSessions, "Sessioni già salvate")
        if(sessionsToUpload.length > 0) {
            chrome.storage.sync.get(['sessions'], (result) => {
                userSessions = result.sessions
                const newUserSessions = userSessions.concat(sessionsToUpload)
                chrome.storage.sync.set({sessions: newUserSessions}, function() {
                    console.log(userSessions, 'Nuove sessioni salvate')
                    sessionsToUpload = []
                    });  
            })            
        }

    }, SETTINGS_INTERVAL_UPLOAD_DEFAULT);
}

//Needed to resolve the automatic pause of the background script
let lifeline;
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
