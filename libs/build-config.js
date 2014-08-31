/*!
 * build-config
 * @author ydr.me
 * 2014-08-31 13:14
 */

'use strict';

var fs = require('fs-extra');
var path = require('path');
var util = require('./build-util.js');
var log = require('./build-log.js');


/**
 * 构建配置文件
 * @param {String} srcPath
 * @param {String} destPath
 * @param {Object} CONFIG
 * @param {Function} callback
 */
module.exports = function buildConfig(srcPath, destPath, CONFIG, callback) {
    var name = path.basename(CONFIG['sea-config.js']);
    var file = path.join(srcPath, CONFIG['sea-config.js']);

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            log('read', 'config file ERROR: ' + err.message, 'error');
            process.exit(-1);
            return callback(err);
        }

        data = data.replace('(\'data-main\');', '(\'data-main\')+\'?' +
            CONFIG._private.md5Param + '=' + CONFIG._private.md5String + '\';');

        var destFile = path.join(destPath, name);
        fs.outputFile(destFile, data, function (err) {
            if (err) {
                log('write', 'config file ERROR: ' + err.message, 'error');
                process.exit(-1);
                return callback(err);
            }

            log('write', destFile, 'success');
            callback();
        });
    });
};