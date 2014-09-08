/**
 * 实现最简单的banner
 * 不扩展原型
 * @author ydr.me
 */
define(function(require, exports, module) {
    var $ = require('../libs/zepto.js');
    var defaults = {
        interval: 3000
    };

    require('../libs/zepto-events.js');

    module.exports = function(selector, settings) {
        var banner = new Banner(selector, settings);
        banner._init();
    };

    function Banner(selector, settings) {
        var the = this;
        the.$banner = $(selector);
        the.options = $.extend({}, defaults, settings);
        the.timeid = 0;
        the.current = 0;
    }

    Banner.prototype = {
        constructor: Banner,
        _init: function() {
            var the = this;
            var $banner = the.$banner;
            var options = the.options;
            var $children = $banner.children();
            var length = $children.length;
            var nav = '<ul class="banner-nav">';

            if (length < 2) {
                return the;
            }

            $children.wrapAll('<div/>');
            the.length = length;

            while (length--) {
                nav += '<li></li>';
            }

            nav += '</ul>';

            the.$navs = $(nav).appendTo($banner).children();
            the.$children = $children;
            the.$navs.eq(0).addClass('active');
            $children.eq(0).siblings().hide();
            $banner.show();
            the._play();
            $banner.on('touchstart', function() {
                the._pause();
            }).on('touchend touchcancel', function() {
                the._play();
            });
        },
        _play: function() {
            var the = this;
            var $children = the.$children;
            var $navs = the.$navs;
            var options = the.options;

            if (the.timeid) {
                clearInterval(the.timeid);
            }

            the.timeid = setInterval(function() {
                the.current++;
                if (the.current === the.length) {
                    the.current = 0;
                }

                $navs.eq(the.current).addClass('active').siblings().removeClass('active');
                $children.eq(the.current).show().siblings().hide();
            }, options.interval);
        },
        _pause: function() {
            var the = this;

            if (the.timeid) {
                clearInterval(the.timeid);
            }
            the.timeid = 0;
        }
    };
});