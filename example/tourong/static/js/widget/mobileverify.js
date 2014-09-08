/**
 * 发送手机验证码
 * @author ydr.me
 */

define(function(require, exports, module) {
    var $ = require('../libs/zepto.js');
    var defaults = {
        // 间隔60s
        timeout: 60000
    };
    var reg = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
    var api = '/test.api';

    require('../libs/zepto-events.js');
    module.exports = function(selector, settings) {
        var mobileverfiy = new Mobileverfiy(selector, settings);
        mobileverfiy._init();
    };


    function Mobileverfiy(selector, settings) {
        var the = this;

        the.$selector = $(selector);
        the.options = $.extend({}, defaults, settings);
        the.timeid = 0;
        the.remain = Math.ceil(the.options.timeout / 1000);
        the.remainClone = the.remain;
    }

    Mobileverfiy.prototype = {
        constructor: Mobileverfiy,
        _init: function() {
            var the = this;
            var $selector = the.$selector;
            var options = the.options;
            var $mobile = $($selector.data('mobile'));
            var $input = $('input', $selector);
            var $button = $('button', $selector);
            the.buttonHtml = $button.html();

            $button.on('click', function() {
                if (the.timeid) {
                    return;
                }

                var mobile = $mobile.val();

                if (reg.test(mobile)) {
                    $button.prop('disabled', !0).html('正在发送……');
                    $.ajax({
                        url: api,
                        type: 'post',
                        dataType: 'json',
                        data: {
                            mobile: mobile
                        },
                        success: function(json) {
                            if (json.code > 0) {
                                $button.text('倒计时' + the.remain + '秒');
                                the.timeid = setInterval(function() {
                                    the.remain--;
                                    if (the.remain) {
                                        $button.text('倒计时' + the.remain + '秒');
                                    } else {
                                        $button.html(the.buttonHtml).prop('disabled', !1);
                                        clearInterval(the.timeid);
                                        the.timeid = 0;
                                        the.remain = the.remainClone;
                                    }
                                }, 1000);
                            } else {
                                $button.html(the.buttonHtml).prop('disabled', !1);
                                alert(json.message);
                            }
                        },
                        error: function() {
                            $button.html(the.buttonHtml).prop('disabled', !1);
                            alert('短信验证码发送失败，请稍后再试');
                        }
                    });
                } else {
                    alert('手机号码格式不正确');
                    $mobile.focus();
                }
            });
        }
    };
});