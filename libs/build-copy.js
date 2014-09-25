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
var regSequenceSep = new RegExp(path.sep === '\\' ? '\\\\\\\\' : '\\/\\/', 'g');


/**
 * 复制文件
 * @param {String} srcPath  起始路径
 * @param {String} destPath 终点路径
 * @param {String/Array} files    匹配文件，支持通配符
 * @param callback
 */
module.exports = function copy(srcPath, destPath, files, callback) {
    if (!Array.isArray(files)) {
        files = [files];
    }


    howdo.each(files, function (index, file, next) {
        var srcGlob = path.join(srcPath, file);

        glob(srcGlob, function (err, ps) {
            if (err) {
                log('glob', srcGlob, 'error');
                console.log(err);
                return process.exit(-1);
            }

            howdo.each(ps, function (index, src, next) {
                src = util.toSystemPath(src);

                var srcName = path.relative(srcPath, src);

                if(srcName === '' || srcName==='apb.json'){
                    return next();
                }

                var dest = path.join(destPath, srcName);

                log('copy', src);

                fs.copy(src, dest, function (err) {
                    if (err) {
                        log('write', dest, 'error');
                        console.log(err);
                        return process.exit(-1);
                    }

                    log('write', dest, 'success');
                    next();
                });
            }).follow(next);
        });
    }).follow(callback);
};