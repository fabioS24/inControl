let startShading = 4500;
let endShading = 50000;

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
    const theme =  (document.getElementsByTagName('html')[0].getAttribute('dark') === ''  || document.getElementsByTagName('html')[0].classList.contains('__fb-dark-mode')) ? 'dark' : 'light'
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
                const feed = $('[role="feed"]')[0]
                if(feed) {
                    for (let i =0; i<feed.children.length; i++) {
                        $('[role="feed"]')[0].children[i].style.background =  `rgba(${baseColor}, ${(s-startShading)/endShading})`
                    }
                }

                document.querySelectorAll('[role="main"]')[0].style.background =  `rgba(${baseColor}, ${(s-startShading)/endShading})`
                $(".x1ye3gou xwib8y2 xn6708d x1y1aw1k").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x1jx94hy.x12nagc").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x1pg5gke.x1iyjqo2.xdt5ytf.x78zum5").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x78zum5.xdt5ytf.x1iyjqo2.xdj266r.xq8finb.xat24cr.x16n37ib.x1l90r2v").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x6s0dn4.x78zum5.xdt5ytf.xwib8y2.xh8yej3").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x9f619.x1n2onr6.x1ja2u2z.x2lah0s.x1qjc9v5.x78zum5.x1q0g3np.xl56j7k.x8hhl5t.x9otpla.x1n0m28w.x1wsgfga.xp7jhwk").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x9f619.x1n2onr6.x1ja2u2z.x78zum5.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.xqmdsaz.x1xfsgkm.x1w9j1nh.x1mtsufr").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
                $(".x9f619.x1n2onr6.x1ja2u2z.x2bj2ny.x1qpq9i9.xdney7k.xu5ydu1.xt3gfkd.xh8yej3.x6ikm8r.x10wlt62.xquyuld").css('background-color', `rgba(${baseColor}, ${(s-startShading)/endShading})`);
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
