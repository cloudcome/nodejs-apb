/*!
 * abc
 * @author ydr.me
 * 2014-08-27 11:33
 */

define(function (require, exports, module) {
    console.log('load ./b/c');
    require('./f/g.js');
    require('./f/h.js');
    module.exports = './b/c';
});