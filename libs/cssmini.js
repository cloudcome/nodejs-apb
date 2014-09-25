/*!
 * build-cssmini
 * @author ydr.me
 * @create 2014-09-25 21:33
 */

'use strict';

var minifyCSS = require('clean-css');
var minifyCSSOptions = {
    keepSpecialComments: 0,
    keepBreaks: false
};


module.exports = function (data) {
    return new minifyCSS(minifyCSSOptions).minify(data);
};