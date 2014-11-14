## 墙裂推荐，此模块略微有BUG，最新的项目请访问以下链接
### 模块化加载器 - <https://github.com/cloudcome/coolie>
### 模块化构建工具 - <https://github.com/cloudcome/nodejs-coolie>

#apb [![NPM version](https://img.shields.io/npm/v/apb.svg?style=flat)](https://npmjs.org/package/apb)
AMD Package Builder for seajs


## 安装
```
npm install -g apb
```



## 使用
* `apb help` 输出帮助信息
* `apb version` 输出版本号
* `apb sea [dir]` 在指定目录覆盖生成`sea-config.js`
* `apb json [dir]` 在指定目录覆盖生成`apb.json`
* `apb build [dir]` 在指定目录执行构建操作




## 亮点
**模块ID压缩**：
`/path/to/abc/def/index.js` => `1`

**清晰明了**
每一步操作都有完整的输入和输出

**并行流程**
依赖`howdo`来进行完善的并行操作

**简单**：
所有模块都在本地，支持JS、CSS文件的require，自动包裹样式文件。


## 帮助
- [1个推荐的目录结构](https://github.com/cloudcome/nodejs-apb/blob/master/help/recommend-dir.md)
- [apb.json 如何配置](https://github.com/cloudcome/nodejs-apb/blob/master/help/apb.json.md)
- [sea-config.js 如何写](https://github.com/cloudcome/nodejs-apb/blob/master/help/sea-config.js.md)
- [如何写模块及模块依赖](https://github.com/cloudcome/nodejs-apb/blob/master/help/module.md)


# Version
## v0.0.16
* 修复提取依赖的BUG

## v0.0.13
* 增加生成`apb.json`
* 增加生成`sea-config.json`
* 完善构建过程
* 修复 BUG#1

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

