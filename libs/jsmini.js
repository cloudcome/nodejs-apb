/*!
 * build-jsmini
 * @author ydr.me
 * @create 2014-09-25 21:31
 */

'use strict';

var uglifyJS = require('uglify-js');
var jsmin = require('jsmin').jsmin;
var jsmin2 = require('jsmin2');
var yuicompressor = require('yuicompressor');
//var parser = uglifyJS.parser;
//var uglify = uglifyJS.uglify;
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
    unused: false,
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


module.exports = function (data, callback) {
//    var ast = uglifyJS.parse(data);
//
//    ast.figure_out_scope();
//
//    var compressor = uglifyJS.Compressor(compressorOptions);
//
//    ast = ast.transform(compressor);
//    ast.figure_out_scope();
//    ast.compute_char_frequency();
//    ast.mangle_names();
//    data = ast.print_to_string();

    // http://blog.csdn.net/larrywangsun/article/details/28093489
//    data = uglifyJS.minify(data, {
//        fromString: true,
//        // 混淆压缩
//        mangle: true
//    });


//    data = jsmin2(data).code;


    yuicompressor.compress(data, {
        //Compressor Options:
        charset: 'utf8',
        type: 'js',
        nomunge: true,
        'line-break': -1
    }, function(err, data, extra) {
        callback(err,  data);
    });

};

