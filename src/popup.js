let save_options = () => {
  YThome = document.getElementById('YThome').checked;
  YTscrolling = document.getElementById('YTscrolling').checked;
  YTrecommendation = document.getElementById('YTrecommendation').checked;
  FBhome = document.getElementById('FBhome').checked;
  FBscrolling = document.getElementById('FBscrolling').checked;

  chrome.storage.sync.set({
      YThome: YThome,
      YTscrolling: YTscrolling,
      YTrecommendation: YTrecommendation,
      FBhome: FBhome,
      FBscrolling: FBscrolling,
  }, function(){    //Callback da chiamare quando avviene il salvataggio delle impostazioni, in questo caso si visualizza un messaggio all'utente
      statusInd = document.getElementById("status");
      statusInd.innerText = 'Options saved! Reload for them to take effect';
      setTimeout(function () {
          statusInd.innerText = '';
      }, 2500);
  });
}

let restore_options = () => {
  chrome.storage.sync.get({
      YThome: false,
      YTscrolling: false,
      YTrecommendation: false,
      FBhome: false,
      FBscrolling: false,
  }, function (items) {
      document.getElementById('YThome').checked = items.YThome;
      document.getElementById('YTscrolling').checked = items.YTscrolling;
      document.getElementById('YTrecommendation').checked = items.YTrecommendation;
      document.getElementById('FBhome').checked = items.FBhome;
      document.getElementById('FBscrolling').checked = items.FBscrolling;
  });
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

chrome.storage.sync.get(['start_study', 'version'], function(result) {
  let startStudy = result['start_study'];
  let testVersion = result['version'];
  if(startStudy === undefined){
    startStudy = dayjs();
    chrome.storage.sync.set({'start_study': startStudy.format("MM/DD/YYYY")});
  } else {
    startStudy = dayjs(startStudy);
  }	
  document.getElementById("surveyButton").style.display = "none";
  let studyWeek = getStudyWeek(startStudy);
  //testVersion = 1;
  //studyWeek = 3;
  console.log("StudyWeek: " + studyWeek);
  if(studyWeek == 0) {
    document.getElementById("test-feedback").innerText = "Test week 1: no restriction, YouTube and Facebook as you have always seen them.";
    document.getElementById("myContainer").style.display = "none";
  } else if(studyWeek == 1 && testVersion == 1) {
    document.getElementById("test-feedback").innerText = "Test week 2: home redesign activated for YouTube and Facebook, moreover recommended videos near the video player of YouTube have been removed.";
    document.getElementById("myContainer").style.display = "none";
  } else if(studyWeek == 1 && testVersion == 2) {
    document.getElementById("test-feedback").innerText = "Test week 2: infinite scrolling limited, the window will become darker as you scroll.";
    document.getElementById("myContainer").style.display = "none";
  } else if(studyWeek == 2 && testVersion == 2) {
    document.getElementById("test-feedback").innerText = "Test week 3: home redesign activated for YouTube and Facebook, moreover recommended videos near the video player of YouTube have been removed.";
    document.getElementById("myContainer").style.display = "none";
  } else if(studyWeek == 2 && testVersion == 1) {
    document.getElementById("test-feedback").innerText = "Test week 3: infinite scrolling limited, the window will become darker as you scroll.";
    document.getElementById("myContainer").style.display = "none";
  } else if(studyWeek > 2) {
    document.getElementById("surveyButton").style.display = "block";
    document.getElementById("test-feedback").innerText = "Test completed, thank you for participating! If you have not already done so I ask you to fill out the following exit survey.";
    document.getElementById("surveyButton").addEventListener('click', function(){
      openSurvey();
    });
    document.getElementById("myContainer").style.display = "none";
  } else {
    document.getElementById("myContainer").style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("options-save").addEventListener('click', function(){
  save_options();
});

document.getElementById("statsButton").addEventListener('click', function(){
  openOptionsPage();
});

let openSurvey = () => {
  chrome.runtime.sendMessage("finalSurvey");
}

let openOptionsPage = () => {
  chrome.runtime.openOptionsPage()
}