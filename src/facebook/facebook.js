let postForm = undefined;
let topBarIcons = undefined;
let center = undefined;
let myBody = undefined;
let secondSection = undefined;
let rightMenu = undefined;
let buttonsGroup = undefined;
let myAdv = undefined;
let studyWeek = undefined;

chrome.storage.sync.get({
    FBhome: false,
    FBscrolling: false,
}, function (items) {
    if(items.FBhome) {
        if(window.location.href === "https://www.facebook.com/") {
            initializeHome();
        } else {
            window.setTimeout(removeTopBarButtons, 2000);
        }
    }
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
    $("body").css('background-color', '#f2f2f2');    
    $("#watch_feed").css('background-color', '#f2f2f2'); 
    $(".bp9cbjyn.j83agx80.cbu4d94t.discj3wi.k4urcfbm").css('background-color', '#f2f2f2');
    $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb").css('background-color', '#f2f2f2');
    $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.g5gj957u.rj1gh0hx.buofh1pr.hpfvmrgz.i1fnvgqd.ll8tlv6m.owycx6da.btwxx1t3.ho3ac9xt.dp1hu0rb.msh19ytf").css('background-color', '#f2f2f2');
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    $("body").css('background-color', '#18191b');    
    $("#watch_feed").css('background-color', '#18191b'); 
    $(".bp9cbjyn.j83agx80.cbu4d94t.discj3wi.k4urcfbm").css('background-color', '#18191b');
    $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb").css('background-color', '#18191b');
    $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.g5gj957u.rj1gh0hx.buofh1pr.hpfvmrgz.i1fnvgqd.ll8tlv6m.owycx6da.btwxx1t3.ho3ac9xt.dp1hu0rb.msh19ytf").css('background-color', '#18191b');
});

let removeTopBarButtons = () => {
    let topBarIcons = document.getElementsByClassName("thodolrn ojvp67qx taijpn5t buofh1pr j83agx80 aovydwv3 bqdfd6uv");
    if(topBarIcons) {
        let homeButton = topBarIcons[0].children[0];
        topBarIcons[0].innerHTML = "";
        topBarIcons[0].append(homeButton);
    }
}

let buildBody = () => {
    $("body").css('display', 'block');
    let fabButton = document.getElementsByClassName("lfi1tu6t cypi58rs pmk7jnqg tmrshh9y m7zwrmfr");
    if(fabButton != undefined && fabButton.length === 1) {
        fabButton[0].remove();
    }
    if(myAdv) {
        myAdv.innerHTML = "";
    }
    topBarIcons[0].innerHTML = "";
    myBody.innerHTML = "";
    let myContainer = document.createElement("div");
    myContainer.role = "main";
    myContainer.className = "myContainer";
    if(postForm != undefined) {
        myContainer.append(postForm);
    }
    myContainer.append(buttonsGroup);
    myBody.append(myContainer);
    myBody.append(rightMenu);
}

let initializeHome = () => {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    topBarIcons = document.getElementsByClassName("thodolrn ojvp67qx taijpn5t buofh1pr j83agx80 aovydwv3 bqdfd6uv");
    center = document.getElementsByClassName("rq0escxv l9j0dhe7 du4w35lb j83agx80 g5gj957u pmt1y7k9 buofh1pr hpfvmrgz taijpn5t gs1a9yip owycx6da btwxx1t3 f7vcsfb0 fjf4s8hc b6rwyo50 oyrvap6t");
    myBody = document.getElementsByClassName("rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t gs1a9yip owycx6da btwxx1t3 dp1hu0rb p01isnhg");
    myBody = myBody[0];
    if(center[0] != undefined) {
        secondSection = center[0].children[0].children[0].children[0];
        //secondSection = center[0].children[0].children[0].children[1];
        if(secondSection) {
            if(secondSection.children[0].children.length === 6) {
                postForm = secondSection.children[0].children[4];    
            } else {
                postForm = secondSection.children[0].children[2];    
            }
            if($(".rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs").length > 6) {
                postForm = $(".rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs")[1];    
            } else {
                postForm = $(".rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs")[0];
            }
        }
    }

    buttonsGroup = document.createElement("div");
    buttonsGroup.className = "flex-container";
    buttonsGroup.innerHTML = `<div class="homeSquare-${theme}" onclick="location.href='/friends';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M10.5 4.5c-2.272 0-2.75 1.768-2.75 3.25C7.75 9.542 8.983 11 10.5 11s2.75-1.458 2.75-3.25c0-1.482-.478-3.25-2.75-3.25zm0 8c-2.344 0-4.25-2.131-4.25-4.75C6.25 4.776 7.839 3 10.5 3s4.25 1.776 4.25 4.75c0 2.619-1.906 4.75-4.25 4.75zm9.5-6c-1.41 0-2.125.841-2.125 2.5 0 1.378.953 2.5 2.125 2.5 1.172 0 2.125-1.122 2.125-2.5 0-1.659-.715-2.5-2.125-2.5zm0 6.5c-1.999 0-3.625-1.794-3.625-4 0-2.467 1.389-4 3.625-4 2.236 0 3.625 1.533 3.625 4 0 2.206-1.626 4-3.625 4zm4.622 8a.887.887 0 00.878-.894c0-2.54-2.043-4.606-4.555-4.606h-1.86c-.643 0-1.265.148-1.844.413a6.226 6.226 0 011.76 4.336V21h5.621zm-7.122.562v-1.313a4.755 4.755 0 00-4.749-4.749H8.25A4.755 4.755 0 003.5 20.249v1.313c0 .518.421.938.937.938h12.125c.517 0 .938-.42.938-.938zM20.945 14C24.285 14 27 16.739 27 20.106a2.388 2.388 0 01-2.378 2.394h-5.81a2.44 2.44 0 01-2.25 1.5H4.437A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.25 14h4.501a6.2 6.2 0 013.218.902A5.932 5.932 0 0119.084 14h1.861z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Friends</h3>
    </div>
    <div class="homeSquare-${theme}" onclick="location.href='/groups/feed/';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Groups</h3>
    </div>
    <div class="homeSquare-${theme}" onclick="location.href='/watch';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M8.75 25.25C8.336 25.25 8 24.914 8 24.5 8 24.086 8.336 23.75 8.75 23.75L19.25 23.75C19.664 23.75 20 24.086 20 24.5 20 24.914 19.664 25.25 19.25 25.25L8.75 25.25ZM17.163 12.846 12.055 15.923C11.591 16.202 11 15.869 11 15.327L11 9.172C11 8.631 11.591 8.297 12.055 8.576L17.163 11.654C17.612 11.924 17.612 12.575 17.163 12.846ZM21.75 20.25C22.992 20.25 24 19.242 24 18L24 6.5C24 5.258 22.992 4.25 21.75 4.25L6.25 4.25C5.008 4.25 4 5.258 4 6.5L4 18C4 19.242 5.008 20.25 6.25 20.25L21.75 20.25ZM21.75 21.75 6.25 21.75C4.179 21.75 2.5 20.071 2.5 18L2.5 6.5C2.5 4.429 4.179 2.75 6.25 2.75L21.75 2.75C23.821 2.75 25.5 4.429 25.5 6.5L25.5 18C25.5 20.071 23.821 21.75 21.75 21.75Z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Watch</h3>
    </div>`;

    rightMenu = document.getElementsByClassName("rq0escxv lpgh02oy du4w35lb o387gat7 qbu88020 pad24vr5 rirtxc74 dp1hu0rb fer614ym ni8dbmo4 stjgntxs be9z9djy hlyrhctz");
    rightMenu = rightMenu[0];
    myAdv = undefined;
    if(rightMenu != undefined) {
        myAdv = rightMenu.children[0].children[0].children[0].children[1].children[0];
    }

    if(myBody != undefined) {
        window.setTimeout(buildBody, 2000);
    }
}

let rebuildHome = () => {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    $("body").css('display', 'block');
    topBarIcons = document.getElementsByClassName("thodolrn ojvp67qx taijpn5t buofh1pr j83agx80 aovydwv3 bqdfd6uv");
    center = document.getElementsByClassName("rq0escxv l9j0dhe7 du4w35lb j83agx80 g5gj957u pmt1y7k9 buofh1pr hpfvmrgz taijpn5t gs1a9yip owycx6da btwxx1t3 f7vcsfb0 fjf4s8hc b6rwyo50 oyrvap6t");
    myBody = document.getElementsByClassName("rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t gs1a9yip owycx6da btwxx1t3 dp1hu0rb p01isnhg");
    myBody = myBody[0];

    if(center[0] != undefined) {
        secondSection = center[0].children[0].children[0].children[2];
        
        if(secondSection) {
            //postForm = secondSection.children[0].children[2];
            postForm = $(".rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs")[0];
        }
    }
    
    buttonsGroup = document.createElement("div");
    buttonsGroup.className = "flex-container";
    buttonsGroup.innerHTML = `<div class="homeSquare-${theme}" onclick="location.href='/friends';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M10.5 4.5c-2.272 0-2.75 1.768-2.75 3.25C7.75 9.542 8.983 11 10.5 11s2.75-1.458 2.75-3.25c0-1.482-.478-3.25-2.75-3.25zm0 8c-2.344 0-4.25-2.131-4.25-4.75C6.25 4.776 7.839 3 10.5 3s4.25 1.776 4.25 4.75c0 2.619-1.906 4.75-4.25 4.75zm9.5-6c-1.41 0-2.125.841-2.125 2.5 0 1.378.953 2.5 2.125 2.5 1.172 0 2.125-1.122 2.125-2.5 0-1.659-.715-2.5-2.125-2.5zm0 6.5c-1.999 0-3.625-1.794-3.625-4 0-2.467 1.389-4 3.625-4 2.236 0 3.625 1.533 3.625 4 0 2.206-1.626 4-3.625 4zm4.622 8a.887.887 0 00.878-.894c0-2.54-2.043-4.606-4.555-4.606h-1.86c-.643 0-1.265.148-1.844.413a6.226 6.226 0 011.76 4.336V21h5.621zm-7.122.562v-1.313a4.755 4.755 0 00-4.749-4.749H8.25A4.755 4.755 0 003.5 20.249v1.313c0 .518.421.938.937.938h12.125c.517 0 .938-.42.938-.938zM20.945 14C24.285 14 27 16.739 27 20.106a2.388 2.388 0 01-2.378 2.394h-5.81a2.44 2.44 0 01-2.25 1.5H4.437A2.44 2.44 0 012 21.562v-1.313A6.256 6.256 0 018.25 14h4.501a6.2 6.2 0 013.218.902A5.932 5.932 0 0119.084 14h1.861z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Friends</h3>
    </div>
    <div class="homeSquare-${theme}" onclick="location.href='/groups/feed/';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M25.5 14C25.5 7.649 20.351 2.5 14 2.5 7.649 2.5 2.5 7.649 2.5 14 2.5 20.351 7.649 25.5 14 25.5 20.351 25.5 25.5 20.351 25.5 14ZM27 14C27 21.18 21.18 27 14 27 6.82 27 1 21.18 1 14 1 6.82 6.82 1 14 1 21.18 1 27 6.82 27 14ZM7.479 14 7.631 14C7.933 14 8.102 14.338 7.934 14.591 7.334 15.491 6.983 16.568 6.983 17.724L6.983 18.221C6.983 18.342 6.99 18.461 7.004 18.578 7.03 18.802 6.862 19 6.637 19L6.123 19C5.228 19 4.5 18.25 4.5 17.327 4.5 15.492 5.727 14 7.479 14ZM20.521 14C22.274 14 23.5 15.492 23.5 17.327 23.5 18.25 22.772 19 21.878 19L21.364 19C21.139 19 20.97 18.802 20.997 18.578 21.01 18.461 21.017 18.342 21.017 18.221L21.017 17.724C21.017 16.568 20.667 15.491 20.067 14.591 19.899 14.338 20.067 14 20.369 14L20.521 14ZM8.25 13C7.147 13 6.25 11.991 6.25 10.75 6.25 9.384 7.035 8.5 8.25 8.5 9.465 8.5 10.25 9.384 10.25 10.75 10.25 11.991 9.353 13 8.25 13ZM19.75 13C18.647 13 17.75 11.991 17.75 10.75 17.75 9.384 18.535 8.5 19.75 8.5 20.965 8.5 21.75 9.384 21.75 10.75 21.75 11.991 20.853 13 19.75 13ZM15.172 13.5C17.558 13.5 19.5 15.395 19.5 17.724L19.5 18.221C19.5 19.202 18.683 20 17.677 20L10.323 20C9.317 20 8.5 19.202 8.5 18.221L8.5 17.724C8.5 15.395 10.441 13.5 12.828 13.5L15.172 13.5ZM16.75 9C16.75 10.655 15.517 12 14 12 12.484 12 11.25 10.655 11.25 9 11.25 7.15 12.304 6 14 6 15.697 6 16.75 7.15 16.75 9Z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Groups</h3>
    </div>
    <div class="homeSquare-${theme}" onclick="location.href='/watch';" style="cursor: pointer;">
    <svg viewBox="0 0 28 28" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4 em6zcovv" height="28" width="28" style="margin-left: 36px;"><path d="M8.75 25.25C8.336 25.25 8 24.914 8 24.5 8 24.086 8.336 23.75 8.75 23.75L19.25 23.75C19.664 23.75 20 24.086 20 24.5 20 24.914 19.664 25.25 19.25 25.25L8.75 25.25ZM17.163 12.846 12.055 15.923C11.591 16.202 11 15.869 11 15.327L11 9.172C11 8.631 11.591 8.297 12.055 8.576L17.163 11.654C17.612 11.924 17.612 12.575 17.163 12.846ZM21.75 20.25C22.992 20.25 24 19.242 24 18L24 6.5C24 5.258 22.992 4.25 21.75 4.25L6.25 4.25C5.008 4.25 4 5.258 4 6.5L4 18C4 19.242 5.008 20.25 6.25 20.25L21.75 20.25ZM21.75 21.75 6.25 21.75C4.179 21.75 2.5 20.071 2.5 18L2.5 6.5C2.5 4.429 4.179 2.75 6.25 2.75L21.75 2.75C23.821 2.75 25.5 4.429 25.5 6.5L25.5 18C25.5 20.071 23.821 21.75 21.75 21.75Z"></path></svg>
    <h3 class="FBbuttonsText" ${theme === 'light' ? '' : 'style="color: white;"'}>Watch</h3>
    </div>`;
    
    rightMenu = document.getElementsByClassName("rq0escxv lpgh02oy du4w35lb o387gat7 qbu88020 pad24vr5 rirtxc74 dp1hu0rb fer614ym ni8dbmo4 stjgntxs be9z9djy hlyrhctz");
    rightMenu = rightMenu[0];
    myAdv = undefined;
    if(rightMenu != undefined) {
        myAdv = rightMenu.children[0].children[0].children[0].children[1].children[0];
    }

    if(myBody != undefined) {
        window.setTimeout(buildBody, 500);
    }
}

var oldURL = "";
var currentURL = window.location.href;
function checkURLchange(currentURL){
    if(currentURL != oldURL){
        chrome.storage.sync.get({
            FBhome: false,
            FBscrolling: false,
            version: 0,
        }, function (items) {
            if(currentURL === "https://www.facebook.com/" && items.FBhome) {
                window.setTimeout(rebuildHome, 1250);
            }
            oldURL = currentURL;
        });
    }

    oldURL = window.location.href;
    setTimeout(function() {
        checkURLchange(window.location.href);
    }, 1000);
}

checkURLchange();

document.addEventListener('scroll', ()=>{
	chrome.runtime.sendMessage({command: "scrollEvent"});
}, { passive: true });

document.addEventListener('click', ()=>{
	chrome.runtime.sendMessage({command: "clickEvent"});
});
