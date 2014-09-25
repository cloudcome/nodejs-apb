/*!
 * test
 * @author ydr.me
 * @create 2014-09-25 17:38
 */

'use strict';

process.stdin.setEncoding('utf8');

console.log('请输入你想要知道的事情。');

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write('data: ' + chunk);
    }
});

process.stdin.on('end', function() {
    process.stdout.write('end');
});