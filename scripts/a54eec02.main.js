$(document).on("ready",function(){"use strict";if($('a[data-toggle="scrollcontrol"]').on("click",function(a){a.preventDefault();var b=this.hash,c=$(b),d=c.offset().top-100;$("html, body").stop().animate({scrollTop:d},900,"swing",function(){window.location.hash=b})}),window.location.hash){var a=window.location.hash,b=$(a),c=b.offset().top-100;$("html, body").stop().animate({scrollTop:c},900,"swing",function(){window.location.hash=a})}});