# 构建参数配置

所有的路径配置都是参考`apb.json`的，请注意。`apb.json`可以使用`apb json`自动生成。
假设，当前的项目目录是这样的（详见 example）：
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

## src
构建原始文件，支持通配符。
示例中构建配置的`src`为：`./static/js/app/**/*.js`


## base
模块出口的基础路径，与`sea-config.js`的`base`类似。
示例中构建配置的`base`为：`./static/js/apps/`


## dest
构建目标路径，构建结束过后的文件会放在这个路径下，包含构建后的模块、加载器配置，以及原样复制的文件。
默认构建配置`dest`为：`../dest/`


## sea-config.js
加载器配置文件路径，`apb`会对这个文件进行修改和压缩，因此需要它。
示例中构建配置的`sea-config.js`为：`./static/js/sea-config.js`


## copyFiles
原样复制的文件、文件夹，支持通配符。
默认构建配置`dest`为：`./**/*.*`

