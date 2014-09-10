#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs

# install
```
npm i -g apb
```

# USAGE
* 全部参数忽略大小写
* `apb version` = `apb -v` 输出版本信息
* `apb help` = `apb -h` 输出帮助信息
* `apb build [dir]` = `apb -b [dir]` 在指定目录下执行构建工作
* 更多示例可以参考`example`文件夹下的东西




# FEATURES
* **模块ID压缩**
  
  除了入口模块文件会增加Query字符，其他依赖模块都会被压缩，如：
  
  `define('path/to/abc/def.js')`  =>
  `define('path/to/abc/def.js?v=123abc')`

* **路径压缩**
  `require('path/to/abc/def.js');` =>
  `require('1')`
  
* **依赖压缩**

  `define('2', ['path/to/abc/def.js'])`  =>
  `define('2', ['1'])`
  
* **简单**

  所有模块都在本地，支持JS、CSS文件的require，自动包裹样式文件。

* **配置**

  需要在源目录新建`apb.json`



# apb.json
* `prefix` 入口模块的前缀，默认为`./`
* `md5Param` 默认为`v`，即`?v=123abc`
* `md5Length` 文件后缀md5长度，默认为6，如初始文件为`app.js`，build之后为`app.js?v=123abc`
* `src` 原始文件，支持通配符和数组，相对于`app.json`
* `dest` 目标文件夹，相对于`app.json`
* `sea-config.js` seajs的配置文件路径，相对于`app.json`
* `copyFiles` 需要原样复制的文件，支持通配符和数组，相对于`app.json`



**示例**
```js
{
    "prefix": "./",
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


# Version
## v0.0.8
* 更新了部分语句描述
* 修复了多次依赖构建重复的BUG
* 优化了构建流程
* 增加了构建配置选项

## v0.0.5
* 修复了linux下全局命令不可用的BUG
* 更新了readme

## v0.0.1
* 初始

