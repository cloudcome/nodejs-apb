/*!
 * build-copy
 * @author ydr.me
 * 2014-08-31 13:33
 */

'use strict';

var howdo = require('howdo');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var log = require('./build-log.js');
var util = require('./build-util.js');



/**
 * 复制文件
 * @param {String} srcPath  起始路径
 * @param {String} destPath 终点路径
 * @param {String} files    匹配文件，支持通配符
 * @param callback
 */
module.exports = function copy(srcPath, destPath, files, callback) {
    if(!Array.isArray(files)){
        files = [files];
    }

    howdo.each(files, function(index, file, done){
        glob(path.join(srcPath, file), function (err, ps) {
            if (err) {
                log('copy', 'copy ERROR: ' + err.message, 'error');
                return callback(err);
            }

            howdo.each(ps, function (index, src, done) {
                src = util.fixPath(src);

                var dest = src.replace(srcPath, destPath);

                log('copy', src);
                fs.copy(src, dest, function (err) {
                    if(err){
                        log('write', 'ERROR: ' + err.message);
                        return process.exit(-1);
                    }

                    log('write', dest, 'success');
                    done();
                });
            }).together(done);
        });
    }).together(callback);
};