/*!
 * 1
 * @author ydr.me
 * 2014-08-26 11:03
 */

define(function (require) {
    console.log('app 1');
    require('./1.css');
    var a = require('./a.js');
    console.log('app 2');
    console.log(a);
    document.write('<h1>依赖解析成功。</h1>');
});

