# 加载器配置文件

`apb`不完全支持sea的完整配置，主要原因是保持`apb`构建工具的小巧、简单和易用，过多的配置会增加复杂度。
仅支持以下几个配置项目：


## base
入口模块的起始基准路径。
在编写项目的路径的时候，强烈建议使用绝对路径。

比如你的项目是这样的：

- static
	- js
		- libs
			- lib.js
		- app
			- app.js
		- sea.js
		- sea-config.js
	- css
- app.html

app.html 使用了 app.js 作为入口文件，app.js 依赖了 lib.js，页面上的JS可以这么写
```
<script src="/static/js/sea.js" id="seajsnode" data-main="app.js"></script>
<script src="/static/js/sea-config.js"></script>
```

以上注意点：
* `sea.js`标签的`id`属性必须写，且必须为`seajsnode`。
* `sea.js`标签的`data-main`属性必须写，这里的属性名和配置的`base`构成了完整的路径。
  如，填写`app.js`，它的完整路径就是`base + app.js` => `/static/js/app/app.js`。
  配置`base`项的路径是参考引用`seajs`的页面的，因此如果你的页面是有多层的，那么得写绝对路径。
* `sea-config.js`标签必须放在`sea.js`后面。

`sea-config.js`这么写（这个配置文件也可以用构建工具`apb sea`自动生成）：
```
/*!
 * sea-config
 * @author ydr.me
 * @create 2014年9月25日17:18:51
 */

'use strict';

var node = document.getElementById('seajsnode');

// 这一行特别重要，构建工具会在这一行添加后缀
// 原始：     var main = node.getAttribute('data-main');
// 构建之后：  var main = node.getAttribute('data-main') + '?v=abc123';
var main = node.getAttribute('data-main');

seajs.config({
	// 这个base是参考页面的
    base: '/static/js/app/'
}).use(main);
```
