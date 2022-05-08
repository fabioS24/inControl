let searchBar = undefined;
let audioSearch = undefined;

chrome.storage.sync.get({
    YThome: false,
    YTscrolling: false,
    YTrecommendation: false,
}, function (items) {
    bindListener(items);
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
        const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
        home.innerHTML = "";
        let mySearchBar = document.createElement("div");
        mySearchBar.className = "flex-container";
        mySearchBar.id = "mySearchBar"
        mySearchBar.append(searchBar);
        mySearchBar.append(audioSearch);
        home.append(mySearchBar);
        let myDiv = document.createElement("div");
        myDiv.className = "flex-container";
        myDiv.innerHTML = `<div class="homeSquare-${theme}" onclick="location.href='/feed/subscriptions';" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; height: 35px; margin-left: 32px; text-align: center; opacity: 0.7;"><path d="M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z" ></path></svg>
        <h3 class="YTbuttonsText">Subscriptions</h3>
        </div>
        <div class="homeSquare-${theme}" onclick="location.href='/feed/explore';" style="cursor: pointer;">
        <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; height: 35px; margin-left: 32px; text-align: center; opacity: 0.7;"><path d="M11.23 13.08c-.29-.21-.48-.51-.54-.86-.06-.35.02-.71.23-.99.21-.29.51-.48.86-.54.35-.06.7.02.99.23.29.21.48.51.54.86.06.35-.02.71-.23.99a1.327 1.327 0 01-1.08.56c-.28 0-.55-.08-.77-.25zM22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zm-3.97-6.03L9.8 9.8l-3.83 8.23 8.23-3.83 3.83-8.23z" ></path></svg>
        <h3 class="YTbuttonsText">Explore</h3>
        </div>
        <div class="homeSquare-${theme}" onclick="location.href='/playlist?list=WL';" style="cursor: pointer;">
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
    let related = document.getElementById("related");
    if(related) {
        related.remove();
    } 
}

let bindListener = (items) => {
    document.body.addEventListener("yt-navigate-finish", function(event) {
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
    });
}

document.addEventListener('scroll', ()=>{
	chrome.runtime.sendMessage({command: "scrollEvent"});
}, { passive: true });

document.addEventListener('click', ()=>{
	chrome.runtime.sendMessage({command: "clickEvent"});
});
