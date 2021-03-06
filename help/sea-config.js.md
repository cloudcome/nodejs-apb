# 加载器配置文件

`apb`不完全支持sea的完整配置，主要原因是保持`apb`构建工具的小巧、简单和易用，过多的配置会增加复杂度。
`apb`不会支持sea中关于路径映射的配置，包括但不限于`alias`、`paths`、`vars`等，这些配置都是对路径进行简化的。
而在开发模块过程中，只需要写好相对路径即可，路径再长，也会在构建之后被压缩成1个字符，因此上述路径映射都不再需要。


## base
入口模块的起始基准路径。
在编写项目的路径的时候，强烈建议使用绝对路径。

比如你的项目是这样的（详见示例）：

```
- html
	- index.html
	- user
		- index.html
- static
	- js
		- app
			- index.js
			- user
				- index.js
		- libs
			- lib.js
		- sea.js
		- sea-config.js
- apb.json
```

- `html/index.html`使用了`index.js`作为入口文件，`index.js`依赖了`lib.js`，页面上的JS可以这么写
  ```
  <script src="./static/js/sea.js" id="seajsnode" data-main="index.js"></script>
  <script src="./static/js/sea-config.js"></script>
  ```
- `html/user/index.html`使用了`user/index.js`作为入口文件，`user/index.js`依赖了`lib.js`，页面上的JS可以这么写
  ```
  <script src="./static/js/sea.js" id="seajsnode" data-main="user/index.js"></script>
  <script src="./static/js/sea-config.js"></script>
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
