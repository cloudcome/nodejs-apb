/**
 * 滚动的文字
 * @author ydr.me
 */


define(function (require, exports, module){
    var $ = require('../libs/zepto.js');
    var defaults = {
        interval: 50
    };

    module.exports = function(selector, settings){
        var scrollwords = new Scrollwords(selector, settings);
        scrollwords._init();
    };

    function Scrollwords(selector, settings){
        var the = this;
        the.$scrollwords = $(selector);
        the.options = $.extend({}, defaults, settings);
        the.timeid = 0;
        the.marginLeft = 0;
    }

    Scrollwords.prototype = {
        constructor: Scrollwords,
        _init: function(){
            var the = this;
            var $scrollwords = the.$scrollwords;
            var $inner;
            var wrapWidth = $scrollwords.width();
            var contentWidth;

            $scrollwords.wrapInner('<div/>');
            $inner = $scrollwords.children();
            $inner.css('position', 'absolute');
            contentWidth = $inner.width();
            $inner.css('position', 'relative');

            if(contentWidth <= wrapWidth){
                return the;
            }

            the.wrapWidth = wrapWidth;
            the.contentWidth = contentWidth;
            the.$inner = $inner;
            the._play();
        },
        _play: function(){
            var the = this;
            var $inner = the.$inner;
            var options = the.options;

            // if(the.timeid){
            //     clearInterval(the.timeid);
            // }

            the.timeid = setInterval(function(){
                the.marginLeft-=1;
                if(the.marginLeft < -the.contentWidth){
                    the.marginLeft = the.wrapWidth;
                }

                $inner.css('marginLeft', the.marginLeft);
            }, options.interval);
        }
    };
});