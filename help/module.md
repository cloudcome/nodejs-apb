# 如何写模块及模块依赖

## 模块开头
必须使用`define`包裹，示例：
```
define(function (require, exports, module) {
    // ...
});
```

## 模块依赖
必须使用相对路径，路径再长也没关系，都会在构建之后被压缩成单个字符，
因此，模块别名、路径别名这些东西都没用。示例：
```
var lib = require('../libs/lib.js');
```