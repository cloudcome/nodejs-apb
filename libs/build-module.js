/*!
 * build-module
 * @author ydr.me
 * 2014-08-31 11:06
 */

'use strict';

var path = require('path');
var howdo = require('howdo');
var fs = require('fs-extra');
var minifyCSS = require('clean-css');
var uglifyJS = require('uglify-js');
var util = require('./build-util.js');
var log = require('./build-log.js');
var regComment = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var regRequire = /require\(["'](.*?)["']\)/g;
var regDefine = /define\s*\(\s*function\s*\(/;
var compressorOptions = {
    sequences: true,  // join consecutive statemets with the “comma operator”
    properties: true,  // optimize property access: a["foo"] → a.foo
    dead_code: true,  // discard unreachable code
    drop_debugger: true,  // discard “debugger” statements
    unsafe: false, // some unsafe optimizations (see below)
    conditionals: true,  // optimize if-s and conditional expressions
    comparisons: true,  // optimize comparisons
    evaluate: true,  // evaluate constant expressions
    booleans: true,  // optimize boolean expressions
    loops: true,  // optimize loops
    unused: true,  // drop unused variables/functions
    hoist_funs: true,  // hoist function declarations
    hoist_vars: false, // hoist variable declarations
    if_return: true,  // optimize if-s followed by return/continue
    join_vars: true,  // join var declarations
    cascade: true,  // try to cascade `right` into `left` in sequences
    side_effects: true,  // drop side-effect-free statements
    warnings: true,  // warn about potentially dangerous optimizations/code
    global_defs: {}     // global definitions
};
//keepSpecialComments - * for keeping all (default), 1 for keeping first one only, 0 for removing all
//keepBreaks - whether to keep line breaks (default is false)
//benchmark - turns on benchmarking mode measuring time spent on cleaning up (run npm run bench to see example)
//root - path to resolve absolute @import rules and rebase relative URLs
//relativeTo - path to resolve relative @import rules and URLs
//target - path to a folder or an output file to which rebase all URLs
//processImport - whether to process @import rules
//    noRebase - whether to skip URLs rebasing
//noAdvanced - set to true to disable advanced optimizations - selector & property merging, reduction, etc.
//    roundingPrecision - Rounding precision, defaults to 2.
//compatibility - Force compatibility mode to ie7 or ie8. Defaults to not set.
//    debug - set to true to get minification statistics under stats property (see test/custom-test.js for examples)
var minifyCSSOptions = {
    keepSpecialComments: 0,
    keepBreaks: false
};

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
    log('build', the.srcFile);
    the._deepRequires();
    var data = Buffer.concat(this.bufferList).toString();
    var destFile = path.join(destPath, this.srcName);
    fs.outputFile(destFile, data, function (err) {
        if (err) {
            log('build', 'error: ' + err.message, 'error');
            return process.exit(-1);
        }

        log('write', destFile, 'success');
        callback(null, the.requireId);
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
BuildModule.prototype._parseRequires = function _parseRequires(name, file, data) {
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
        the.requiresIdMap[requireFile] = ++the.requireId;
        sourceMap[ret[0]] = the.requireId;
        requireIds.push(the.requireId);
        requires.push(requireFile);
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
            the.srcName + '?' + CONFIG._private.md5Param + '=' + CONFIG._private.md5String :
            the.requiresIdMap[file]) +
        '\', ' +
        (deps ? '[' + deps + '],' : '') +
        'function (');


    // 3. 混淆压缩
    var ast = uglifyJS.parse(data);
    ast.figure_out_scope();
    var compressor = uglifyJS.Compressor(compressorOptions);
    ast = ast.transform(compressor);
    data = ast.print_to_string();

    // 4. 保存
    var buffer = new Buffer(data, 'utf8');
    the.bufferList.push(buffer);

    return  requires;
};


/**
 * 获取入口文件的深度依赖，
 * 顺便把依赖替换全部都做完，
 * 防止同一个文件被读取2次
 * @private
 */
BuildModule.prototype._deepRequires = function _deepRequires() {
    var the = this;
    var allRquires = [];

    _loop(the.srcName, the.srcFile);

    function _loop(srcName, srcFile) {
        var data;
        var requires;
        var isCSSFile = path.extname(srcFile).toLowerCase() === '.css';

        try {
            // 1. 获取文件内容
            data = fs.readFileSync(srcFile, 'utf8');

            // 当前文件是样式文件
            if (isCSSFile) {
                // 2. 压缩
                data = new minifyCSS(minifyCSSOptions).minify(data);

                // 3. seajs.importStyle 包裹成JS文件
                data = 'define("' + the.requiresIdMap[srcFile] + '",function(){seajs.importStyle("' +
                    data.replace(/\\/mg, '\\\\').replace(/"/mg, '\\"') +
                    '")});';

                // 4. 存入 buffer 列表
                var buffer = new Buffer(data, 'utf8');
                the.bufferList.push(buffer);
            }
            // 当前文件是脚本文件
            else {
                requires = the._parseRequires(srcName, srcFile, data);
                if (requires.length) {
                    requires.forEach(function (requireFile) {
                        allRquires.push(requireFile);
                        log('require', requireFile);
                        _loop(path.basename(requireFile), requireFile);
                    });
                }
            }
        } catch (err) {
            log('read', 'read file ERROR: ' + srcFile, 'error');
        }
    }

    return allRquires;
};


module.exports = BuildModule;
