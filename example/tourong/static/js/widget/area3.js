/**
 * 省市区3级联动
 */

define(function(require, exports, module) {
    var $ = require('../libs/zepto.js');
    var data = require('../data/area3.js');
    var defaults = {
        province: '',
        city: '',
        area: '',
        defaultProvince: '北京',
        defaultCity: '东城区',
        defaultArea: ''
    };

    require('../libs/zepto-events.js');
    module.exports = function(selector) {
        var selected = ($(selector).data('selected') || ',,').split(',');
        var settings = {
            province: selected[0],
            city: selected[1],
            area: selected[2]
        };
        var area3 = new Area3(selector, settings);
        area3._init();
    };

    function Area3(selector, settings) {
        var the = this;
        the.$area3 = $(selector);
        the.options = $.extend({}, defaults, settings);
        var $selects = $('select', the.$area3);
        the.$select0 = $selects.eq(0);
        the.$select1 = $selects.eq(1);
        the.$select2 = $selects.eq(2);
        the.province = the.options.province || defaults.defaultProvince;
        the.city = the.options.city || defaults.defaultCity;
        the.area = the.options.area || defaults.defaultArea;
    }


    Area3.prototype = {
        constructor: Area3,
        _init: function() {
            var the = this;
            var $area3 = the.$area3;
            var $select0 = the.$select0;
            var $select1 = the.$select1;
            var $select2 = the.$select2;
            var provinces = the._getProvinces();
            var citys = the._getCitysByProvince(the.province);
            var areas = the._getAreasByProvinceAndCity(the.province, the.city);

            the._render($select0, provinces, the.province);
            the._render($select1, citys, the.city);
            the._render($select2, areas, the.area);

            $select0.change(function() {
                the.province = $(this).val();
                var citys = the._getCitysByProvince(the.province);
                the.city = citys[0];
                var areas = the._getAreasByProvinceAndCity(the.province, the.city);
                the._render($select1, citys, the.city);
                the._render($select2, areas, the.area);
            });

            $select1.change(function() {
                the.city = $(this).val();
                var areas = the._getAreasByProvinceAndCity(the.province, the.city);
                the._render($select2, areas, the.area);
            });
        },
        _render: function($select, data, selected) {
            var options = '';
            
            $.each(data, function(index, text) {
                options += '<option value="' + text + '"' +
                    (text === selected ? ' selected' : '') +
                    '>' + text + '</option>';
            });

            $select.html(options).trigger('change').prop('disabled', !options);

            if ($select.parent().hasClass('u-select')) {
                $select.parent()[(options ? 'remove' : 'add') + 'Class']('disabled');
            }
        },
        _getProvinces: function() {
            var ret = [];

            $.each(data, function(index, ps) {
                ret.push(ps.p);
            });

            return ret;
        },
        _getCitysByProvince: function(province) {
            var temp = [];
            var ret = [];
            var the = this;

            $.each(data, function(index, ps) {
                if (ps.p === province) {
                    temp = ps.c || [];
                    return !1;
                }
            });

            $.each(temp, function(index, cs) {
                ret.push(cs.n);
            });

            return ret;
        },
        _getAreasByProvinceAndCity: function(province, city) {
            // var citys = this._getCitysByProvince(province);
            var citysTemp = [];
            var areasTemp = [];
            // var cityRet  = [];
            var areaRet = [];

            // if(citys.length === 0){
            //     return [];
            // }

            $.each(data, function(index, ps) {
                if (ps.p === province) {
                    citysTemp = ps.c || [];
                    return !1;
                }
            });

            $.each(citysTemp, function(index, cs) {
                if (cs.n === city) {
                    areasTemp = cs.a || [];
                    return !1;
                }
            });

            $.each(areasTemp, function(index, as) {
                areaRet.push(as.s);
            });

            return areaRet;
        },
    };
});