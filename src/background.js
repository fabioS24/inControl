const SETTINGS_INTERVAL_CHECK_DEFAULT = 1000;
const SETTINGS_INTERVAL_UPLOAD_DEFAULT = 10000;
let db = undefined;
let statsSessions = [];

chrome.action.setBadgeText({text: 'OFF'});
chrome.action.setBadgeBackgroundColor({color: '#737373'});

try {
    self.importScripts('firebase/firebase-app.js', 'firebase/firebase-firestore.js', 'firebase/firebase-analytics.js', 'firebase/firebase-database.js', 'dayjs.min.js')

    var firebaseConfig = {
        apiKey: "AIzaSyBAxgpX5SWjN2EgQ4olSopATeYWgNg3EmY",
        authDomain: "dwextension.firebaseapp.com",
        projectId: "dwextension",
        storageBucket: "dwextension.appspot.com",
        messagingSenderId: "914088129559",
        appId: "1:914088129559:web:628f714ce68e8baae31852",
        databaseURL: "https://dwextension-default-rtdb.europe-west1.firebasedatabase.app/",
        measurementId: "G-W073HWKQ28"
      };
    
    firebase.initializeApp(firebaseConfig);
    if(firebase.analytics.isSupported() === true)  {
        firebase.analytics();
    }

    // Initialize Firebase
    db = firebase.database();

    chrome.runtime.onMessage.addListener((msg, sender, resp) => {
        if(msg.command === "fetch") {
            db.ref("users/" + msg.data.userId + "/sessions/").on('value', (snapshot) => {
                const data = snapshot.val();
                statsSessions = [];
                if(snapshot.toJSON() != undefined) {
                    statsSessions = json2array(snapshot.toJSON());
                }
                
                resp({type: "result", status: "success", data: statsSessions, request: msg});
                //Errors:
                //resp({type: "result", status: "error", data: "No data found!", request: msg});
            });
            return true;
        } else if(msg.command === "fetchAll") {
            db.ref("users/").on('value', (snapshot) => {
                const data = snapshot.val();
                let mystatsSessions = [];
                if(snapshot.toJSON() != undefined) {
                    mystatsSessions = json2array(snapshot.toJSON());
                }
                
                resp({type: "result", status: "success", data: mystatsSessions, request: msg});
                //Errors:
                //resp({type: "result", status: "error", data: "No data found!", request: msg});
            });
            return true;
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

let sessions = [];
let lastSession = {
    'site': undefined,
    'week' : undefined,
    'testVersion': undefined,
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
    chrome.storage.sync.get(['start_study', 'version', 'YThome', 'YTscrolling', 'YTrecommendation', 'FBhome', 'FBscrolling'], function(result) {
        let startStudy = result['start_study'];
        if(startStudy === undefined){
            startStudy = dayjs();
            chrome.storage.sync.set({'start_study': startStudy.format("MM/DD/YYYY")});
        } else {
            startStudy = dayjs(startStudy);
        }	
        let studyWeek = getStudyWeek(startStudy);
        lastSession = {
            'site': site,
            'week' : studyWeek,
            'testVersion': result['version'],
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
        'week' : undefined,
        'testVersion': undefined,
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

let setTestVersion = () => {
    db.ref("settings/").once("value", (snapshot) => {
        const data = snapshot.val();
        let version = undefined;
        if(data.tester1 <= data.tester2) {
            version = 1;
            db.ref("settings/").set({tester1: data.tester1 + 1, tester2: data.tester2});
        } else {
            version = 2;
            db.ref("settings/").set({tester1: data.tester1, tester2: data.tester2 + 1});
        }
        chrome.storage.sync.set({version: version}, function() {
            console.log("Test version saved: " + version);
          });
    });
    
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
            setTestVersion();
        });
    }
    
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request == "scrollEvent"){
              scrollInSession();
            } else if (request == "clickEvent"){
              clickInSession();
            } else if (request == "finalSurvey") {
                chrome.tabs.create({
                    url: "https://docs.google.com/forms/d/e/1FAIpQLSf3bDeuIBlcqq1a84rYq5e7YyqV_yWksGegNYG365sLGioavQ/viewform?usp=sf_link",
                    active: true
                });
            }
        }
    );
});

function trackTimeSpent(userId){
    console.log("Tracking attivato!");
    setInterval(()=>{
        chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
            if (currentWindow && currentWindow.focused) {
                var activeTab = currentWindow.tabs.find(t => t.active === true);
                if (activeTab !== undefined && extractHostname(activeTab.url).includes("youtube")) {
                    if(lastSession.ongoing && lastSession['site'] === "facebook") {     //Required when passing from YT to FB
                        lastSession.timestampEnd = new Date().getTime();
                        sessions.push(lastSession);
                        resetSession(userId);
                    }
                    if(!lastSession.ongoing){
                        initializeSession(userId, undefined, "youtube");
                    }
                    lastSession['duration'] = lastSession['duration'] + 1;

                } else if(activeTab !== undefined && extractHostname(activeTab.url).includes("facebook")) {
                    if(lastSession.ongoing && lastSession['site'] === "youtube") {      //Required when passing from FB to YT
                        lastSession.timestampEnd = new Date().getTime();
                        sessions.push(lastSession);
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
                        sessions.push(lastSession);
                        resetSession(userId);
                    }
                }
            } else {
                if(lastSession.ongoing){
                    //stop the last session, if needed
                    lastSession.timestampEnd = new Date().getTime();
                    sessions.push(lastSession);  
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

function uploadSessions(userId) {
    setInterval(()=>{
        let i=0;
        if(sessions.length > 0) {
            for(let session of sessions) {
                // Get a key for a new session.
                var newPostKey = db.ref("users/" + userId + "/").child('sessions').push().key;

                var updates = {};
                updates['/users/' + userId + '/' + 'sessions/' + newPostKey] = session;
                db.ref().update(updates);
                sessions.shift();
            }
        }

    }, SETTINGS_INTERVAL_UPLOAD_DEFAULT);
}

let getStudyWeek = (start) => {
    let now = dayjs();
    if(now.diff(start, 'day') <= 7) {
        //First week, normal use without restrictions
        return 0;
    } else if(now.diff(start, 'day') > 7 && now.diff(start, 'day') <= 14) {
        //Second week, home redesign and recommendation activated
        return 1;
    } else if(now.diff(start, 'day') > 14 && now.diff(start, 'day') <= 21) {
        //Second week, infinite scrolling activated
        return 2;
    } else {
        //Third week, home redesign, recommendation and infinite scrolling activated
        return 3;
    }
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
