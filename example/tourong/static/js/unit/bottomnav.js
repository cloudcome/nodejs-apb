/**
 * 底部导航
 * @author ydr.me
 */

define(function (require){
    var $ = require('../libs/zepto.js');
    var $bottomnav = $('#bottomnav');

    require('../libs/zepto-events.js');
    require('../libs/zepto-touch.js');
    $bottomnav.on('tap', '.more a', function(){
        var $subnav = $(this).next('ul');

        if($subnav.css('display') === 'none'){
            $subnav.css('display', 'block');
        }else{
            $subnav.css('display', 'none');
        }
    });
});