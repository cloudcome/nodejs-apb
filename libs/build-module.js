/*!
 * build-module
 * @author ydr.me
 * 2014-08-31 11:06
 */

'use strict';

var path = require('path');
//var howdo = require('howdo');
var fs = require('fs-extra');
var cssmini = require('./cssmini.js');
var jsmini = require('./jsmini.js');
var util = require('./build-util.js');
var log = require('./build-log.js');
var regComment = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var regRequire = /require\(["'](.*?)["']\)/g;
var regDefine = /define\s*\(\s*function\s*\(/;


/**
 * 构建模块
 * @param {String} srcName 入口模块名称
 * @param {String} srcFile 入口模块绝对路径
 * @param {Object} CONFIG
 * @constructor
 */
function BuildModule(srcName, srcFile, CONFIG) {
    this.srcName = srcName;
    this.srcFile = srcFile;

    // 模块内容的buffer列表
    this.bufferList = [];

    // 依赖文件的ID表
    this.requiresIdMap = {};

    // 依赖ID
    this.requireId = 0;

    this.CONFIG = CONFIG;
}


BuildModule.prototype.output = function (destPath, callback) {
    var the = this;
    var buildLog = '/*apb ' + Date.now() + '*/\n';
    var buffer = new Buffer(buildLog, 'utf8');

    log('build', the.srcFile, 'warning');
    the._deepRequires(function () {
        the.bufferList.push(buffer);

        var data = Buffer.concat(the.bufferList).toString();
        var destFile = path.join(destPath, the.srcName);

        fs.outputFile(destFile, data, function (err) {
            if (err) {
                console.log(err);
                return process.exit(-1);
            }

            log('write', destFile, 'success');
            callback(null, the.requireId);
        });
    });
};


/**
 * 解析当前文件的依赖信息
 * @param {String} name 当前文件名
 * @param {String} file 当前文件绝对路径
 * @param {String} data 文件内容
 * @returns {Array}
 * @private
 */
BuildModule.prototype._parseRequires = function _parseRequires(name, file, data, callback) {
    var the = this;
    var CONFIG = the.CONFIG;
    // 正则结果
    var ret;
    // 依赖的列表
    var requires = [];
    // 依赖的绝对路径
    var requireFile;
    // 原始与绝对的对应关系
    var sourceMap = {};
    var requireIds = [];
    var basePath = path.dirname(file);

    data = data.replace(regComment, '');

    while ((ret = regRequire.exec(data)) !== null) {
        requireFile = path.join(basePath, ret[1]);

        if (the.requiresIdMap[requireFile]) {
            sourceMap[ret[0]] = the.requiresIdMap[requireFile];
        } else {
            the.requiresIdMap[requireFile] = ++the.requireId;
            sourceMap[ret[0]] = the.requireId;
            requireIds.push(the.requireId);
            requires.push(requireFile);
        }
    }

    // 1. 替换 require
    for (var i in sourceMap) {
        if (sourceMap.hasOwnProperty(i)) {
            data = data.replace(i, 'require("' + sourceMap[i] + '")');
        }
    }

    // 2. 替换 define
    var deps = util.arrayToString(requireIds);
    data = data.replace(regDefine, 'define(\'' +
        (name === the.srcName ?
            // 入口文件
            path.relative(CONFIG.base, the.srcName) + '?v=' + CONFIG._private.md5String :
            // 依赖文件
            the.requiresIdMap[file]) +
        '\', ' +
        (deps ? '[' + deps + '],' : '') +
        'function (');


    // 3. 混淆压缩
    jsmini(data, function (err, data) {
        if (err) {
            log('jsmini', file, 'error');
            console.log(err);
            process.exit(-1);

            return;
        }

        // 4. 保存
        var buffer = new Buffer(data, 'utf8');
        the.bufferList.push(buffer);

        callback(null, requires);
    });


//    // 3. 混淆压缩
//    try{
//        data = jsmini(data);
//    }catch(err){
//        log('jsmini', file, 'error');
//        console.log(err);
//        process.exit(-1);
//    }
//
//    // 4. 保存
//    var buffer = new Buffer(data, 'utf8');
//    the.bufferList.push(buffer);
//
//    return  requires;
};


/**
 * 获取入口文件的深度依赖，
 * 顺便把依赖替换全部都做完，
 * 防止同一个文件被读取2次
 * @private
 */
BuildModule.prototype._deepRequires = function _deepRequires(callback) {
    var the = this;
    var allRquires = [];

    _loop(the.srcName, the.srcFile);


    function _loop(srcName, srcFile) {
        var data;
        var isCSSFile = path.extname(srcFile).toLowerCase() === '.css';

        try {
            // 1. 获取文件内容
            data = fs.readFileSync(srcFile, 'utf8');
        } catch (err) {
            log('read', srcFile, 'error');
            console.log(err);
            process.exit(-1);
        }

        // 当前文件是样式文件
        if (isCSSFile) {
            // 2. 压缩
            try {
                data = cssmini(data);
            } catch (err) {
                log('cssmini', srcFile, 'error');
                console.log(err);
                process.exit(-1);
            }


            // 3. seajs.importStyle 包裹成JS文件
            data = 'define("' + the.requiresIdMap[srcFile] + '",function(){seajs.importStyle("' +
                data.replace(/\\/mg, '\\\\').replace(/"/mg, '\\"') +
                '")});\n';

            // 4. 存入 buffer 列表
            var buffer = new Buffer(data, 'utf8');
            the.bufferList.push(buffer);
        }
        // 当前文件是脚本文件
        else {
            the._parseRequires(srcName, srcFile, data, function (err, requires) {
                if (requires.length) {
                    requires.forEach(function (requireFile) {
                        allRquires.push(requireFile);
                        log('require', requireFile);
                        _loop(path.basename(requireFile), requireFile);
                    });
                } else {
                    callback(null, allRquires);
                }
            });
        }
    }
};


module.exports = BuildModule;
