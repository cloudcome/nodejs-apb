/*!
 * build-index
 * @author ydr.me
 * 2014-08-31 15:06
 */

'use strict';
var howdo = require('howdo');
var fs = require('fs-extra');
var path = require('path');
var init = require('./build-init.js');
var log = require('./build-log.js');
var buildModule = require('./build-module.js');
var buildConfig = require('./build-config.js');
var buildCopy = require('./build-copy.js');


module.exports = function (srcPath) {
    var CONFIG = init(srcPath);
    var t1 = Date.now();
    var buildFiles = [];
    var requiresCount = 0;
    var destPath = path.join(srcPath, CONFIG.dest);

//    log('welcome', 'AMD Package Builder', 'rainbow');
    CONFIG.src.forEach(function (srcName) {
        var buildFile = path.join(srcPath, srcName);
        log('prebuild', buildFile, 'warning');
        buildFiles.push({
            name: srcName,
            file: buildFile
        });
    });


    howdo
//        // 1. 删除 dest 目录
//        .task(function (next) {
//            fs.remove(destPath, function (err) {
//                if (err) {
//                    log('remove', 'ERROR: ' + err.message, 'error');
//                    return process.exit(-1);
//                }
//
//                log('remove', destPath);
//                next(null);
//            });
//        })
        // 2. 构建
        .task(function (next) {
            howdo.each(buildFiles, function (index, info, done) {
                var build = new buildModule(info.name, info.file, CONFIG);
                build.output(destPath, function (err, count) {
                    if (count) {
                        requiresCount += count;
                    }
                    done(err);
                });
            }).together(next);
        })
        // 3. 配置文件
        .task(function (next) {
            buildConfig(srcPath, destPath, CONFIG, next);
        })
        // 4. 复制文件
        .task(function (next) {
            buildCopy(srcPath, destPath, CONFIG.copyFiles, next);
        })
        // follow
        .follow(function (err) {
            var t2 = Date.now();

            if (err) {
                log('build', 'end error, past ' + (t2 - t1) + ' ms', 'error');
                return process.exit(-1);
            }

            log('build', 'end success, build ' + buildFiles.length +
                ' files, require ' + requiresCount +
                ' files, past ' + (t2 - t1) + ' ms', 'success');
        });
}