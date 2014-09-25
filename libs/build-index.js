/*!
 * build-index
 * @author ydr.me
 * 2014-08-31 15:06
 */

'use strict';
var howdo = require('howdo');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var init = require('./build-init.js');
var log = require('./build-log.js');
var buildModule = require('./build-module.js');
var buildConfig = require('./build-config.js');
var buildCopy = require('./build-copy.js');
var util = require('./build-util.js');


module.exports = function (srcPath) {
    var CONFIG = init(srcPath);
    var t1 = Date.now();
    var buildFiles = [];
    var requiresCount = 0;
    var destPath = path.join(srcPath, CONFIG.dest);



//    log('welcome', 'AMD Package Builder', 'rainbow');


    howdo
        // 0. 解析出要构建的文件数组
        .task(function (next) {
            if (!Array.isArray(CONFIG.src)) {
                CONFIG.src = [CONFIG.src];
            }

            // './static/js/*.js'
            // '*.js'

            howdo.each(CONFIG.src, function (index, p, next) {
                var buildGlob = path.join(srcPath, p);
                log('glob', buildGlob);
                glob(buildGlob, function (err, files) {
                    if (err) {
                        log('glob', p);
                        console.log(err);
                        return process.exit(-1);
                    }

                    files.forEach(function (file) {
                        buildFiles.push({
                            name: util.toURLPath(path.relative(srcPath, file)),
                            file: util.toSystemPath(file)
                        });
                    });

                    next();
                });
            }).follow(next);
        })
        // 1. 清空 dest 目录
        .task(function (next) {
//            fs.remove(destPath, function (err) {
//                if (err) {
//                    log('remove', destPath, 'error');
//                    console.log(err);
//                    return process.exit(-1);
//                }
//
//                log('remove', destPath, 'success');
//                next(null);
//            });
            fs.readdir(destPath, function (err, path) {
                howdo.each(path, function (index, p, done) {
                    var removePath = destPath + p;
                    fs.remove(removePath, function (err) {
                        if (err) {
                            log('remove', removePath, 'error');
                            console.log(err);
                            return process.exit(-1);
                        }

                        log('remove', removePath, 'success');
                        done(null);
                    })
                }).together(next);
            });
        })
        // 2. 复制文件
        .task(function (next) {
            buildCopy(srcPath, destPath, CONFIG.copyFiles, next);
        })
        // 3. 构建
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
        // 4. 配置文件
        .task(function (next) {
            buildConfig(srcPath, destPath, CONFIG, next);
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