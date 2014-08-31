#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs

![2](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/2014-08-31_155604.png)


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


# FEATURES
## 模块ID压缩
  除了入口模块文件会增加Query字符，其他依赖模块都会被压缩，如：
  
  `define('path/to/abc/def.js')`  =>
  `define('1')`

## 路径压缩
`require('path/to/abc/def.js');` =>
`require('1')`
  
## 依赖压缩
`define('1', ['path/to/abc/def.js'])`  =>
`define('1', ['2'])`
  
## 简单
所有模块都在本地，支持JS、CSS文件的require，自动包裹样式文件。

## 配置
需要在源目录新建`apb.json`



# apb.json
**以下路径配置都是参考`apb.json`的。**

* `md5Param` 默认为`v`，即`?v=123456`
* `md5Length` 文件后缀md5长度，默认为6，如初始文件为`app.js`，build之后为`app.js?v=123abc`
* `src` 原始文件数组，不能使用通配符
* `dest` 目标文件夹
* `sea-config.js` seajs的配置文件路径
* `copyFiles` 需要原样复制的文件，支持通配符和数组

**示例**
```js
{
    "md5Length": 6,
    "src": ["app.js", "app2.js"],
    "dest": "../dest/",
    "sea-config.js": "./sea-config.js",
    "copyFiles": ["**/*.html", "./sea.js"]
}
```


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