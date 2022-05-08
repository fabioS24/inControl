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
  }, function(){
      statusInd = document.getElementById("status");
      statusInd.style.display = 'block'
      setTimeout(function () {
        statusInd.style.display = 'none'
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

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("options-save").addEventListener('click', function(){
  save_options();
});

document.getElementById("statsButton").addEventListener('click', function(){
  openOptionsPage();
});

let openOptionsPage = () => {
  chrome.runtime.openOptionsPage()
}