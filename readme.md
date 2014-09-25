#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs



# 安装
```
npm install -g apb
```



# 使用
* 全部参数忽略大小写
* `apb version` 输出版本信息
* `apb help` 输出帮助信息
* `apb init` 对话框生成配置文件 下个版本支持
* `apb build [dir]` 在指定目录（如果为空，默认为当前工作目录）下执行构建工作
* 更多示例可以参考`example`文件夹下的东西




# 亮点
**模块ID压缩**
除了入口模块文件会增加Query字符，其他依赖模块都会被压缩，如：
`define('path/to/abc/def.js')`  =>
`define('path/to/abc/def.js?v=123abc')`

**路径压缩**
`require('path/to/abc/def.js');` =>
`require('1')`
  
**依赖压缩**
`define('2', ['path/to/abc/def.js'])`  =>
`define('2', ['1'])`
  
**简单**
所有模块都在本地，支持JS、CSS文件的require，自动包裹样式文件。

**构建生成依赖地图**
生成`abc.js` 和 `abc.map.json`



# 加载器配置
这些配置，在加载器加载的时候会根据这些别名去匹配它的完整路径。

* 支持`paths`，可以设置短名，比如`/path/to/` => `libs`
* 支持`base`，这个是URL的base，默认是'./'，这个会在`apb`构建之后加在起始模块的名称前面

其他涉及路径的配置都不会被`apb`支持，因此在引用模块的时候多加注意。



# 构建配置
文件名为`apb.json`，构建过程是**以该文件所在的路径为基准**的。

* `md5Param` 默认为`v`，即`?v=123abc` 建议省略
* `md5Length` 文件后缀md5长度，默认为6，如初始文件为`app.js`，build之后为`app.js?v=123abc` 建议省略
* `src` 原始文件，支持通配符和数组
* `dest` 目标文件夹
* `sea-config.js` seajs的配置文件路径
* `copyFiles` 需要原样复制的文件，支持通配符和数组



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
示例如下：
```js
/*!
 * sea-config
 * @author ydr.me
 * 2014-08-27 13:43
 */

'use strict';

var node = document.getElementById('seajsnode');
// 这一行特别重要，构建工具会在这一行添加后缀，以防止缓存
// 原始：     var main = node.getAttribute('data-main');
// 构建之后：  var main = node.getAttribute('data-main')+'?v=abc123';
var main = node.getAttribute('data-main');
seajs.config({
    base: './',
    alias:{
       'abc': './'
    }
}).use(main);
```


# Version
## v0.0.10
* 更新了部分语句描述
* 修复了多次依赖构建重复的BUG
* 优化了构建流程
* 增加了构建配置选项

## v0.0.5
* 修复了linux下全局命令不可用的BUG
* 更新了readme

## v0.0.1
* 初始

