/*!
 * build-apb.js
 * @author ydr.me
 * @create 2014-09-25 19:28
 */

'use strict';


require('colors');
var fs = require('fs-extra');
var path = require('path');
var log = require('./build-log.js');
var template = fs.readFileSync(path.join(__dirname, './apb.json.template'), 'utf-8');
var regSrc = /{{src}}/g;
var regDest = /{{dest}}/g;
var regSeaConfig = /{{seaConfig}}/g;
var regCopyFile = /{{copyFile}}/g;
var regClean = /[\r\n\t\v"']/g;
var regSpace = /\s+/g;
var step = 0;


module.exports = function (basedir) {
    console.log('');
    console.log('apb, AMD Package Builder for seajs'.cyan);
    console.log('欢迎使用 apb.json 生成工具，该文件会在配置结束后自动覆盖生成。'.red);
    console.log('以下操作留空回车表示同意默认配置。'.yellow);
    log('dir', basedir);
    log('warning', '如果上述目录不正确，请按`ctrl+C`退出后重新指定。', 'warning');

    var writeFile = path.join(basedir, './apb.json');

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function () {
        var chunk = process.stdin.read();

        switch (step) {
            case 0:
                log('1/4', '请输入构建的【原始目录或文件】，默认为空，多个起始目录或文件使用空格分开：', 'info');
                break;

            case 1:
                template = template.replace(regSrc, _clean(chunk, !0) || '');
                log('2/4', '请输入构建的【目标目录】，默认为`../dest/`：', 'info');
                break;

            case 2:
                template = template.replace(regDest, _clean(chunk) || '../dest/');
                log('3/4', '请输入构建的【sea-config.js目录】，默认为`./static/js/sea-config.js`：', 'info');
                break;

            case 3:
                template = template.replace(regSeaConfig, _clean(chunk) || './static/js/sea-config.js');
                log('4/4', '请输入构建的需要【原样复制的目录或文件】，默认为`./**/*.*`：', 'info');
                break;

            case 4:
                template = template.replace(regCopyFile, _clean(chunk, !0) || '"./**/*.*"');

                fs.outputFile(writeFile, template, 'utf-8', function (err) {
                    if (err) {
                        log('write', writeFile, 'error');
                        return process.exit();
                        ;
                    }

                    log('write', writeFile, 'success');
                    process.exit();
                });


                break;
        }

        step++;
    });

    process.stdin.on('end', function () {
        process.stdout.write('end');
    });
};


/**
 * 清理用户输入
 * @param chunk
 * @returns {string|Array}
 * @private
 */
function _clean(chunk, isToArray) {
    var ret = '';

    chunk = chunk.replace(regClean, '').trim();

    if (!isToArray) {
        return chunk;
    }

    chunk.split(regSpace).forEach(function (item, index) {
        if (index > 0) {
            ret += ',';
        }

        ret += '"' + item + '"';
    });

    return ret === '""' ? '' : ret;
}
