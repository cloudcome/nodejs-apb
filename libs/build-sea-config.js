/*!
 * build-sea-config
 * @author ydr.me
 * 2014-09-25 17:23
 */

'use strict';

require('colors');
var fs = require('fs-extra');
var path = require('path');
var log = require('./build-log.js');
var template = fs.readFileSync(path.join(__dirname, './sea-config.js.template'), 'utf-8');
var regDatetime = /{{datetime}}/g;
var regSeajsId = /{{seajsId}}/g;
var regBase = /{{base}}/g;
var regClean = /[\r\n\t\v"']/g;
var step = 0;


module.exports = function(basedir){
    log('apb', 'AMD Package Builder for seajs'.cyan);
    log('welcome', '欢迎使用 sea-config.js 生成工具，该文件会在配置结束后自动覆盖生成。'.red);
    log('tips', '以下操作留空回车表示同意默认配置。'.yellow);
    log('write path', basedir, 'danger');
    log('warning', '如果上述目录不正确，请按`ctrl+C`退出后重新指定。', 'warning');

    var writeFile = path.join(basedir, './sea-config.js');

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function () {
        var chunk = process.stdin.read();

        switch (step) {
            case 0:
                log('1/2', '请输入seajs的引用ID，默认为`seajsnode`：', 'info');
                break;

            case 1:
                template = template.replace(regSeajsId, _clean(chunk) || 'seajsnode');
                log('2/2', '请输入seajs的入口标识属性，默认为`data-main`：', 'info');
                break;

            case 2:
                template = template.replace(regBase, _clean(chunk) || './').replace(regDatetime, Date.now());

                fs.outputFile(writeFile, template, 'utf-8', function(err){
                    if(err){
                        log('write', writeFile, 'error');
                        return process.exit();;
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
 * @returns {string}
 * @private
 */
function _clean(chunk) {
    return chunk.replace(regClean, '').trim();
}

