// 获取地理位置信息
define(function(require){
    var $ = require('../libs/zepto.js');
    var $location = $('#location');
    var $locationCity = $('#location-city');
    var baiduMapApi = 'http://api.map.baidu.com/geocoder/v2/?ak=x68sdm676DVnN18yGCbfh8Ql&output=json&pois=0&callback=?';
    
    require('../libs/zepto.ajax.js');

    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(function(position) {
            $.ajax({
                dataType: 'jsonp',
                url: baiduMapApi,
                data: {
                    location: position.coords.latitude + ',' + position.coords.longitude
                },
                success: function(json){
                    if(json && !json.status && json.result && json.result.addressComponent && json.result.addressComponent.city){
                        $locationCity.html(json.result.addressComponent.city);
                    }
                },
                error: function(){
                    $locationCity.html('定位失败');
                }
            });
        }, function(err) {
            $locationCity.html('定位失败');
        }, {
            // 是否启用高精度请求，将开启GPS设备
            enableHighAccuracy: true,
            // 超时，1000ms
            timeout: 1000,
            // 有效期，60*60*1000ms
            maximumAge: 3600000
        });
    }
});