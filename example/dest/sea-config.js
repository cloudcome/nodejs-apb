/*!
 * sea-config
 * @author ydr.me
 * 2014-08-27 13:43
 */

'use strict';

var node = document.getElementById('seajsnode');
var main = node.getAttribute('data-main')+'?v=18c7bd';
seajs.config({
    base: './'
}).use(main);