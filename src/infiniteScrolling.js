let startShading = 4500;
let endShading = 40000;

chrome.storage.sync.get({
    YThome: false,
    YTscrolling: false,
    YTrecommendation: false,
    FBhome: false,
    FBscrolling: false,
    FBrecommendation: false,
}, function (items) {
    if(items.YTscrolling) {
        document.body.addEventListener("yt-navigate-finish", function(event) {
            $("#content").css('background-color', '#f9f9f9');  
        });
        $(window).scroll(function(e){
            let s = $("body, html").scrollTop();
            if(s>startShading && s<endShading)
                $("#content").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');
        });
    }    
    if(items.FBscrolling) {
        $(window).scroll(function(e){
            let s = $("body, html").scrollTop();
            
            if(s>startShading && s<endShading)
                $(".bp9cbjyn.j83agx80.cbu4d94t.discj3wi.k4urcfbm").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');
                $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');
                $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.g5gj957u.rj1gh0hx.buofh1pr.hpfvmrgz.i1fnvgqd.ll8tlv6m.owycx6da.btwxx1t3.ho3ac9xt.dp1hu0rb.msh19ytf").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');
                $("#watch_feed").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');    
        });
    }   
});
