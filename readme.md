#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs


# install
```
npm i -g apb
```

# USAGE
```
apb -v 
cd your directory
apb
```

# 编码规范
* 只支持require本地文件，文件后缀不可省略
* 目前只支持require脚本文件
* 需要在源目录新建`apb.json`

# apb.json
**以下路径配置都是参考`apb.json`的。**

* `md5Param` 默认为`v`，即`?v=123456`
* `md5Length` 文件后缀md5长度，默认为6，如初始文件为`app.js`，build之后为`app.js?v=123abc`
* `src` 原始文件数组，不能使用通配符
* `dest` 目标文件夹
* `sea-config.js` seajs的配置文件路径
* `copyFiles` 需要原样复制的文件，支持通配符和数组

# sea-config.js
```js
/*!
 * sea-config
 * @author ydr.me
 * 2014-08-27 13:43
 */

'use strict';

var node = document.getElementById('seajsnode');
var main = node.getAttribute('data-main');
seajs.config({
    base: './'
}).use(main);
```