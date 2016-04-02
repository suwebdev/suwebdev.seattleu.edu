$(document).on('ready', function(){

    // verifyFieldMatch(20,21);


    // $("select").live('change',function(event){
    //      $('select:hidden').val('');
    //        });

    // base2.DOM.Element.addEventListener(document.forms[0],'submit',function(){
    //     $('input[type=submit]').attr('disabled', 'disabled');
    // });

    // wFORMS.behaviors.validation.onFail = function() {
    //   $('#tfa_0 input[type=submit]').removeAttr("disabled", "disabled");
    // }

    /*
     * Helper script for iframe-published FormAssembly.com forms.
     * Auto-resize iframe to fit content.
     */
    (function() {

        /*
         * a backwards compatible implementation of postMessage
         * by Josh Fraser (joshfraser.com)
         * released under the Apache 2.0 license.
         *
         * this code was adapted from Ben Alman's jQuery postMessage code found at:
         * http://benalman.com/projects/jquery-postmessage-plugin/
         *
         * other inspiration was taken from Luke Shepard's code for Facebook Connect:
         * http://github.com/facebook/connect-js/blob/master/src/core/xd.js
         */
        var XD = function(){

            var interval_id,
            last_hash,
            cache_bust = 1,
            attached_callback,
            window = this;

            return {
                postMessage : function(message, target_url, target) {

                    if (!target_url) {
                        return;
                    }

                    target = target || parent;  // default to parent

                    if (window['postMessage']) {
                        // the browser supports window.postMessage, so call it with a targetOrigin
                        // set appropriately, based on the target_url parameter.
                        target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

                    } else if (target_url) {
                        // the browser does not support window.postMessage, so set the location
                        // of the target to target_url#message. A bit ugly, but it works! A cache
                        // bust parameter is added to ensure that repeat messages trigger the callback.
                        target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
                    }
                },

                receiveMessage : function(callback, source_origin) {

                    // browser supports window.postMessage
                    if (window['postMessage']) {
                        // bind the callback to the actual event associated with window.postMessage
                        if (callback) {
                            attached_callback = function(e) {
                                if ((typeof source_origin === 'string' && e.origin !== source_origin)
                                || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                                    return !1;
                                }
                                callback(e);
                            };
                        }
                        if (window['addEventListener']) {
                            window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                        } else {
                            window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                        }
                    } else {
                        // a polling loop is started & callback is called whenever the location.hash changes
                        interval_id && clearInterval(interval_id);
                        interval_id = null;

                        if (callback) {
                            interval_id = setInterval(function(){
                                var hash = document.location.hash,
                                re = /^#?\d+&/;
                                if (hash !== last_hash && re.test(hash)) {
                                    last_hash = hash;
                                    callback({data: hash.replace(re, '')});
                                }
                            }, 100);
                        }
                    }
                }
            };
        }();

        if ( window.self !== window.top ) {
            // runs on hosted page (inside iframe), compute height and pass it on to parent window.
            var parentURL = null;
            // get hostURL from hidden form field, or URL parameter
            try {
                var parentURL = decodeURIComponent(window.location.search.split('hostURL=')[1].split("&")[0]);
            } catch(e) {
                // hostURL not set. By convention, look for input with class 'calc-HOSTURL'
                var fields = document.getElementsByTagName('input');
                for(var i=0;i<fields.length;i++) {
                    if(fields[i].className && fields[i].className.indexOf('calc-HOSTURL')!=-1) {
                        var parentURL = fields[i].value;
                        break;
                    }
                }
            }

            if(parentURL) {
                var height = 0;
                // monitor content size changes
                var monitor = function() {
                    var content = document.getElementById('tfaContent');
                    if(content) {
                        var newheight = content.scrollHeight + content.offsetTop;
                    } else {
                         var newheight = document.body.scrollHeight;
                    }
                    if(newheight != height) {
                        height  = newheight;
                        var msg = height+","+window.location.href.replace(/^https?:/,'');
                        XD.postMessage(msg, parentURL);
                    }
                    window.setTimeout(function() { monitor(); },500);
                };
                monitor();

                // rewrite links to preserve hostURL parameter.
                var links = document.links;
                for(var i=0; i<links.length; i++) {
                    if(!links[i].target) {
                        var sep = (links[i].href.indexOf('?')!=-1)?'&':'?';
                        links[i].href = links[i].href + sep +'hostURL=' + parentURL;
                    }
                }

                // rewrite links to preserve hostURL parameter.
                var forms = document.forms;
                for(var i=0; i<forms.length;i++) {
                    if(forms[i].action) {
                        var sep = (forms[i].action.indexOf('?')!=-1)?'&':'?';
                        forms[i].action = forms[i].action + sep +'hostURL=' + parentURL;
                    }
                }
                // This forces the outer page back to the top when inner iframe has been submitted
                try {
                   var onPass = wFORMS.behaviors.validation.onPass;

                   wFORMS.behaviors.validation.onPass = function(){
                       var msg = "submitted"+","+window.location.href.replace(/^https?:/,'');
                       XD.postMessage(msg, parentURL);

                       if(typeof(onPass) == 'function') {
                           onPass();
            }
                   }
                } catch(e) {
                    // wForms was not loaded (no form)
                }
            }

        } else {
            // runs on parent page.

            // find FormAssembly iframe and set hostURL parameter.
            try {
                var iframes = document.querySelectorAll('iframe');
                for(var i=0;i<iframes.length;i++) {
                    if(iframes[i].src.indexOf(/hostURL=/)===-1) {
                        // preserve any other parameter.
                        var url  = iframes[i].src;
                        var hash = "";
                        if(url.indexOf('#')!==-1) {
                            hash = "#" + (url.split('#')[1]);
                            url  = url.split('#')[0];
                        }
                        var sep = (url.indexOf("?")===-1)?"?":"&";
                        iframes[i].src = url + sep + "hostURL=" + encodeURIComponent(window.location.href) + hash;
                    }
                }
            } catch(e) {
                // iframe not found or unexpected error.
            }


            // runs on parent page, receive height parameter, and set iframe height.
            XD.receiveMessage(function(event) {
                try {
                       var input = event.data.split(',');
                       var data = input[0];
                       var source = input[1];

                    // find the origin of the message
                    var iframes = document.querySelectorAll('iframe');

                    for(var i=0;i<iframes.length;i++) {

                        if(source == iframes[i].src.replace(/^https?:/,'')) {

                                 if (!isNaN(data)){
                                     iframes[i].height = parseInt(data);
                        }
                                 else if (data == "submitted"){
                                     // will scroll to top of iframe
                                     var iframeTop = iframes[i].offsetTop;
                                     window.scroll(window.scollX,iframeTop)
                    }
                            }
                        }
                }  catch(e) {
                    // unexpected message.
                }
            });
        }
    })();
})