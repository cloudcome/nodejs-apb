/*!
 * build-init
 * @author ydr.me
 * 2014-08-31 11:18
 */

'use strict';

var log = require('./build-log.js');
var util = require('./build-util.js');
var fs = require('fs-extra');
var path = require('path');
var jsonFileName = 'apb.json';


// * `md5Param` 默认为`v`，即`?v=123456`
// * `md5Length` 文件后缀md5长度，默认为6，如初始文件为`app.js`，build之后为`app.js?v=md5Length`
// * `src` 原始文件数组，不能使用通配符
// * `dest` 目标文件夹
// * `sea-config.js` seajs的配置文件路径
// * `copyFiles` 需要原样复制的文件，支持通配符
module.exports = function (srcPath) {
    var CONFIG;

    try {
        CONFIG = fs.readJSONFileSync(path.join(srcPath, jsonFileName));
    } catch (err) {
        log('init', err.message, 'error');
        return process.exit(-1);
    }

    if (!CONFIG.src) {
        log('init', '`' + jsonFileName + '` require `src` param.', 'error');
        return process.exit(-1);
    }

    if (!CONFIG.dest) {
        log('init', '`' + jsonFileName + '` require `dest` param.', 'error');
        return  process.exit(-1);
    }

    if (!CONFIG['sea-config.js']) {
        log('init', '`' + jsonFileName + '` require `sea-config.js` param.', 'error');
        return process.exit(-1);
    }

    if (!Array.isArray(CONFIG.src)) {
        CONFIG.src = [CONFIG.src];
    }

    CONFIG._private = {};
    CONFIG._private.md5Param = CONFIG.md5Param || 'v';
    CONFIG._private.md5String = util.md5(Date.now()).slice(0, CONFIG.md5Length || 6);

    return CONFIG;
};