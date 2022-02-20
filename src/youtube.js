let searchBar = undefined;
let audioSearch = undefined;

chrome.storage.sync.get(['start_study', 'version'], function(result) {
    let startStudy = result['start_study'];
    let testVersion = result['version'];
	if(startStudy === undefined){
		startStudy = dayjs();
		chrome.storage.sync.set({'start_study': startStudy.format("MM/DD/YYYY")});
	} else {
		startStudy = dayjs(startStudy);
	}	
    let studyWeek = getStudyWeek(startStudy);
    //testVersion = 2;
    //studyWeek = 2;
    console.log("StudyWeek: " + studyWeek);
    if((studyWeek == 1 && testVersion == 1) || (studyWeek == 2 && testVersion == 2)) {
        bindListener(undefined, studyWeek);
        if(window.location.href === "https://www.youtube.com/") {
            buildCustomHome();
        }
        clearVideoPlayer();
    } else if(studyWeek == 3) {
        chrome.storage.sync.get(['removalsurvey'], function(result) {
			let promptRemovalSurvey = result['removalsurvey'];
			if(promptRemovalSurvey === undefined){
				promptRemovalSurvey = {'visualize':true, 'attempts':0}
			}
			if(promptRemovalSurvey.visualize && promptRemovalSurvey.attempts < 5){

				if (window.confirm("Ciao, il test è concluso, grazie di aver partecipato! Ti chiedo gentilmente di compilare il seguente sondaggio di uscita. Clicca OK per accedere al sondaggio.")) 
				{
					chrome.runtime.sendMessage("finalSurvey");
                    chrome.storage.sync.set({'removalsurvey': {visualize: true, attempts: promptRemovalSurvey.attempts + 1}});
				} else {
					chrome.storage.sync.set({'removalsurvey': {visualize: true, attempts: promptRemovalSurvey.attempts + 2}});
				};
			} 
		});

        /*
        chrome.storage.sync.get({
            YThome: false,
            YTscrolling: false,
            YTrecommendation: false,
        }, function (items) {
            bindListener(items, studyWeek);
            if(items.YTrecommendation) {
                clearVideoPlayer();
            }
            if(items.YThome) {
                if(window.location.href === "https://www.youtube.com/") {
                    buildCustomHome();
                }
                buildCustomHome();
            }
        });
        */
    }
});

let buildCustomHome = () => {
    let leftItemBar = document.getElementById("items"); //Item bar
    //searchBar = document.getElementById("search"); //Search bar
    searchBar = $("ytd-searchbox")[0];
    audioSearch = document.getElementById("voice-search-button") //Button audio search
    let home = document.querySelector("ytd-browse.ytd-page-manager[page-subtype='home']");
    if(leftItemBar) {
        leftItemBar.parentElement.remove();
    }
    if(home) {
        home.innerHTML = "";
        let mySearchBar = document.createElement("div");
        mySearchBar.className = "flex-container";
        mySearchBar.id = "mySearchBar"
        mySearchBar.append(searchBar);
        mySearchBar.append(audioSearch);
        home.append(mySearchBar);
        let myDiv = document.createElement("div");
        myDiv.className = "flex-container";
        myDiv.innerHTML = `<div class="homeSquare" onclick="location.href='/feed/subscriptions';" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; height: 35px; margin-left: 32px; text-align: center; opacity: 0.7;"><path d="M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z" ></path></svg>
        <h3 class="YTbuttonsText">Subscriptions</h3>
        </div>
        <div class="homeSquare" onclick="location.href='/feed/explore';" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; height: 35px; margin-left: 32px; text-align: center; opacity: 0.7;"><path d="M11.23 13.08c-.29-.21-.48-.51-.54-.86-.06-.35.02-.71.23-.99.21-.29.51-.48.86-.54.35-.06.7.02.99.23.29.21.48.51.54.86.06.35-.02.71-.23.99a1.327 1.327 0 01-1.08.56c-.28 0-.55-.08-.77-.25zM22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zm-3.97-6.03L9.8 9.8l-3.83 8.23 8.23-3.83 3.83-8.23z" ></path></svg>
        <h3 class="YTbuttonsText">Explore</h3>
        </div>
        <div class="homeSquare" onclick="location.href='/playlist?list=WL';" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; height: 35px; margin-left: 32px; text-align: center; opacity: 0.7;"><path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z" ></path></svg>
        <h3 class="YTbuttonsText">Watch later</h3>
        </div>`;
        home.append(myDiv);
    }
    
    let leftMenu = document.getElementById("guide-inner-content");
    if(leftMenu != undefined) {
        leftMenu.remove();
    }

    let hamburger = document.getElementById("guide-button");
    if(hamburger != undefined) {
        hamburger.remove();
    }
}

let clearVideoPlayer = () => {
    let columns = document.getElementById("columns");
    if(columns) {
        let secondary = columns.children[1];
        if(secondary) {
            secondary.remove();
        }
    }   
}

let bindListener = (items, studyWeek) => {
    document.body.addEventListener("yt-navigate-finish", function(event) {
        if(studyWeek < 3) {
            clearVideoPlayer();
            if(window.location.href === "https://www.youtube.com/") {
                buildCustomHome();
            }
            bindListener(items);
        } else {
            if(items.YTrecommendation) {
                clearVideoPlayer();
            }
            if(items.YThome) {
                if(window.location.href === "https://www.youtube.com/") {
                    buildCustomHome();
                } else {
                    document.getElementById("center").append(searchBar);
                    document.getElementById("center").append(audioSearch);
                }
            }
        }
    });
}

document.addEventListener('scroll', ()=>{
	chrome.runtime.sendMessage("scrollEvent");
}, { passive: true });

document.addEventListener('click', ()=>{
	chrome.runtime.sendMessage("clickEvent");
});

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