/*!
 * sea-config
 * @author ydr.me
 * @create 2014年9月25日19:23:05
 */

'use strict';

var node = document.getElementById('seajsnode');
var main = node.getAttribute('data-main');
seajs.config({
    base: '/example/src/static/js/app/'
}).use(main);