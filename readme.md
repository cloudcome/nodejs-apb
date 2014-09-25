#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs



## 安装
```
npm install -g apb
```



## 使用
* 全部参数忽略大小写
* `apb version` 输出版本信息
* `apb help` 输出帮助信息
* `apb init` 对话框生成配置文件 下个版本支持
* `apb build [dir]` 在指定目录（如果为空，默认为当前工作目录）下执行构建工作
* 更多示例可以参考`example`文件夹下的东西




## 亮点
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



## 帮助
- [1个推荐的目录结构](https://github.com/cloudcome/nodejs-apb/blob/master/help/recommend-dir.md)
- [apb.json 如何配置](https://github.com/cloudcome/nodejs-apb/blob/master/help/apb.json.md)
- [sea-config.js 如何写](https://github.com/cloudcome/nodejs-apb/blob/master/help/sea-config.js.md)



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

