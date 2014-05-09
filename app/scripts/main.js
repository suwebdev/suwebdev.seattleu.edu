$(document).on('ready', function() {
    // correct overscroll on anchors
    'use strict';
      $('a[data-toggle="scrollcontrol"]').on('click',function (e) {
            e.preventDefault();
            var target = this.hash;
            var targetJq = $(target);
            var scrollVal = targetJq.offset().top - 100;
            $('html, body').stop().animate({
                'scrollTop': scrollVal
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        });
      // scroll on page refresh/load to anchors
      if (window.location.hash) {
        var target = window.location.hash;
        var targetJq = $(target);
        var scrollVal = targetJq.offset().top - 100;
        $('html, body').stop().animate({
            'scrollTop': scrollVal
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
      }
});
