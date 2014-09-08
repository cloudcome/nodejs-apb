/*!
 * build-util
 * @author ydr.me
 * 2014-08-31 11:16
 */

'use strict';

//var howdo = require('howdo');
var crypto = require('crypto');
var path = require('path');
//var fs = require('fs-extra');
var log = require('./build-log.js');


// md5
module.exports.md5 = function md5(string) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(String(string));
    return md5sum.digest('hex');
};


// 修复path，与系统相同
module.exports.toSystemPath = function toSystemPath(p) {
    if (path.sep === '\\') {
        return p.replace(/\//g, '\\');
    }

    return p;
};


// 转换路径为 URL 路径格式
module.exports.toURLPath = function (p) {
    if (path.sep === '\\') {
        return p.replace(/\\/g, '/');
    }

    return p;
};


// [1, 2, 3] => '1', '2', '3'
module.exports.arrayToString = function arrayToString(array) {
    var string = '';

    array.forEach(function (item) {
        if (string) {
            string += ',';
        }
        string += '\'' + item + '\'';
    });

    return string;
};


module.exports.dateTime = function () {
    var d = new Date();
    var _fixNumber = function (num) {
        return num < 10 ? '0' + num : num;
    }

    return [
        d.getFullYear(),
        '-',
        _fixNumber(d.getMonth() + 1),
        '-',
        _fixNumber(d.getDate()),
        ' ',
        _fixNumber(d.getHours()),
        ':',
        _fixNumber(d.getMinutes()),
        ':',
        _fixNumber(d.getSeconds())
    ].join('');
};