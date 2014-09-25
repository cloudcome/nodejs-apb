/*!
 * build-index
 * @author ydr.me
 * 2014-08-31 11:15
 */

'use strict';

var path = require('path');
require('colors');
var log = require('./libs/build-log.js');
var build = require('./libs/build-index.js');
var sea = require('./libs/build-sea-config.js');
var json = require('./libs/build-apb.js');
var CWD = process.cwd();
var cmdArgs = process.argv.slice(2);
var cmdArg0 = cmdArgs[0];
var cmdArg1 = cmdArgs[1];
var pkg = require('./package.json');

switch ((cmdArg0||'').toLowerCase()) {
    case 'version':
        log('version', pkg.version, 'success');
        break;

    case 'sea':
        sea(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
        break;

    case 'json':
        json(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
        break;

    case 'build':
        build(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
        break;

    case 'help':
    default:
        log(true, 'apb help', '输出帮助信息', 'success');
        log(true, 'apb version', '输出版本号', 'success');
        log(true, 'apb sea [path]', '在指定目录覆盖生成`sea-config.js`', 'success');
        log(true, 'apb json [path]', '在指定目录覆盖生成`apb.json`', 'success');
        log(true, 'apb build [path]', '在指定目录执行构建操作', 'success');
        break;
}
