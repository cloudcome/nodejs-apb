/*!
 * lib
 * @author ydr.me
 * 2014-08-26 11:15
 */


define(function (require, exports, module) {
    console.log('load ./a');
    require('./b/c.js');
    require('./b/d.js');
    require('./b/e.js');
    module.exports = './a';
});