/*!
 * build-module
 * @author ydr.me
 * 2014-08-31 11:06
 */

'use strict';

var path = require('path');
//var howdo = require('howdo');
var fs = require('fs-extra');
var minifyCSS = require('clean-css');
var uglifyJS = require('uglify-js');
var util = require('./build-util.js');
var log = require('./build-log.js');
var regComment = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var regRequire = /require\(["'](.*?)["']\)/g;
var regDefine = /define\s*\(\s*function\s*\(/;
var compressorOptions = {
    // 连续单语句，逗号分开
    // 如： alert(1);alert(2); => alert(1),alert(2)
    sequences: false,
    // 重写属性
    // 如：foo['bar'] => foo.bar
    properties: false,
    // 删除无意义代码
    dead_code: false,
    // 移除`debugger;`
    drop_debugger: true,
    // 使用以下不安全的压缩
    unsafe: false,
    //
    unsafe_comps: false,
    // 压缩if表达式
    conditionals: false,
    // 压缩条件表达式
    comparisons: false,
    // 压缩常数表达式
    evaluate: false,
    // 压缩布尔值
    booleans: true,
    // 压缩循环
    loops: false,
    // 移除未使用变量
    unused: true,
    // 函数声明提前
    hoist_funs: true,
    // 变量声明提前
    hoist_vars: true,
    // 压缩 if return if continue
    if_return: false,
    // 合并连续变量省略
    join_vars: true,
    // 小范围连续变量压缩
    cascade: false,
    // 不显示警告语句
    warnings: false,
    side_effects: true,
    pure_getters: true,
    pure_funcs: null,
    negate_iife: true,
    // 全局变量
    global_defs: {}
};

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
    var buildLog = '/*apb ' + Date.now() + '*/\n';
    var buffer = new Buffer(buildLog, 'utf8');

    this.srcName = srcName;
    this.srcFile = srcFile;

    // 模块内容的buffer列表
    this.bufferList = [];

    // 依赖文件的ID表
    this.requiresIdMap = {};

    // 依赖ID
    this.requireId = 0;

    this.CONFIG = CONFIG;

    this.bufferList.push(buffer);
}


BuildModule.prototype.output = function (destPath, callback) {
    var the = this;
    log('build', the.srcFile, 'warning');
    the._deepRequires();
    var data = Buffer.concat(this.bufferList).toString();
    var destFile = path.join(destPath, this.srcName);
    fs.outputFile(destFile, data, function (err) {
        if (err) {
            console.log(err);
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
            the.srcName + '?' + CONFIG._private.md5Param + '=' + CONFIG._private.md5String :
            // 依赖文件
            the.requiresIdMap[file]) +
        '\', ' +
        (deps ? '[' + deps + '],' : '') +
        'function (');


    // 3. 混淆压缩
    // http://lisperator.net/uglifyjs/mangle
    var ast = uglifyJS.parse(data);
    ast.figure_out_scope();
    var compressor = uglifyJS.Compressor(compressorOptions);
    ast = ast.transform(compressor);
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names();
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
                    '")});\n';

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
            log('read', srcFile, 'error');
            console.log(err);
            process.exit(-1);
        }
    }

    return allRquires;
};


module.exports = BuildModule;
