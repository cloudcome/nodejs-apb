define("app.js?v=18c7bd",["1","2"],function(require){console.log("app 1"),require("1");var a=require("2");console.log("app 2"),console.log(a),document.write("<h1>依赖解析成功。</h1>")});define("1",function(){seajs.importStyle("@charset \"utf-8\";body{background:#eee}")});define("2",["3","4","5"],function(require,exports,module){console.log("load ./a"),require("3"),require("4"),require("5"),module.exports="./a"});define("3",["6","7"],function(require,exports,module){console.log("load ./b/c"),require("6"),require("7"),module.exports="./b/c"});define("6",function(require,exports,module){console.log("load ./b/f/g"),module.exports="./b/f/g"});define("7",function(require,exports,module){console.log("load ./b/f/h"),module.exports="./b/f/h"});define("4",function(require,exports,module){console.log("load ./b/d"),module.exports="./b/d"});define("5",function(require,exports,module){console.log("load ./b/e"),module.exports="./b/e"});