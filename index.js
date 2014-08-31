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
var CWD = process.cwd();
var cmdArgs = process.argv.slice(2);
var cmdArg0 = cmdArgs[0];
var cmdArg1 = cmdArgs[1];
var pkg = require('./package.json');

switch ((cmdArg0||'').toLowerCase()) {
    case '-v':
    case 'version':
        log('version', pkg.version, 'success');
        break;

    case '-b':
    case 'build':
        build(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
        break;

    case '-h':
    case 'help':
    default:
        var str = [];
        log(true, 'apb -h', 'help', 'success');
        log(true, 'apb help', 'help', 'success');
        log(true, 'apb -v', 'version', 'success');
        log(true, 'apb version', 'version', 'success');
        log(true, 'apb -b [path]', 'build in Current Working Directory OR Path option', 'warning');
        log(true, 'apb build [path]', 'build in Current Working Directory OR Path option', 'warning');
        break;
}
