let startShading = 4500;
let endShading = 40000;

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
    $("#content").css('background-color', '#f9f9f9');  
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    $("#content").css('background-color', '#181818');  
});

chrome.storage.sync.get({
    YTscrolling: false,
    FBscrolling: false,
}, function (items) {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    if(items.YTscrolling) {
        document.body.addEventListener("yt-navigate-finish", function(event) {
            $("#content").css('background-color', theme === 'light' ? '#f9f9f9' : '#181818');  
        });
        $(window).scroll(function(e){
            let s = $("body, html").scrollTop();
            if(s>startShading && s<endShading) {
                if(theme === 'light') {
                    $("#content").css('background-color', 'rgba(0, 0, 0, ' + (s-startShading)/endShading + ')');
                } else {
                    $("#content").css('background-color', 'rgba(255, 255, 255, ' + (s-startShading)/endShading + ')');
                }
            }
        });
    }    
    if(items.FBscrolling) {
        const baseColor = theme === 'light' ? '0,0,0' : '255,255,255'
        $(window).scroll(function(e){
            let s = $("body, html").scrollTop();
            
            if(s>startShading && s<endShading) {
                $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.g5gj957u.rj1gh0hx.buofh1pr.hpfvmrgz.i1fnvgqd.ll8tlv6m.owycx6da.btwxx1t3.ho3ac9xt.dp1hu0rb.msh19ytf").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.io0zqebd.m5lcvass.fbipl8qg.nwvqtn77.k4urcfbm.ni8dbmo4.stjgntxs.sbcfpzgs").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".cwj9ozl2.tvmbv18p").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".bp9cbjyn.j83agx80.cbu4d94t.discj3wi.k4urcfbm").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $("#watch_feed").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
            }
        });
    }   
});
