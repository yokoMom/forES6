[URL](http://es6.ruanyifeng.com/#docs/intro)

# Babel 转码器

Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。
```
$ npm install --save-dev @babel/core
```

## 配置文件 .babelIrc

Babel 的配置文件是.babelrc，存放在项目的根目录下。使用 Babel 的第一步，就是配置这个文件。

```
{
    "presets": [
    ],
    "plugins": []
}

// presets字段设定转码规则，官方提供以下的规则集，你可以根据需要安装。
//// 最新转码规则
$ npm install --save-dev @babel/preset-env

//// react 转码规则
$ npm install --save-dev @babel/preset-react

{
    "presets": [
        "@babel/env",
        "@babel/preset-react"
    ],
    "plugins": []
}
```

## 命令行转码

命令行工具：
```
$ npm install --save-dev @babel/cli
```

基本用法：
```
// 转码结果输出到标准输出
$ npx babel example.js

// 转码结果写入一个文件
// --out-file 或 -o 参数指定输出文件
$ npx babel example.js --out-file compiled.js
// 或者
$ npx babel example.js -o compiled.js

// 整个目录转码
// --out-dir 或 -d 参数指定输出目录
$ npx babel src --out-dir lib
// 或者
$ npx babel src -d lib

// -s 参数生成source map文件
$ npx babel src -d lib -s
```

## babel-node

@babel/node模块的babel-node命令，提供一个支持 ES6 的 REPL 环境。它支持 Node 的 REPL 环境的所有功能，而且可以直接运行 ES6 代码。

```
$ npm install --save-dev @babel/node
```

然后，执行 babel-node 就进入 REPL 环境。

```
$ npx babel-node

$ npx babel-node xx.js
```

## @babel/register 模块

@babel/register模块改写require命令，为它加上一个钩子。此后，每当使用require加载.js、.jsx、.es和.es6后缀名的文件，就会先用 Babel 进行转码。

```
$ npm install --save-dev @babel/register
```

```
// 使用时，必须首先加载@babel/register。
// index.js
require('@babel/register');
require('./es6.js');

// 然后，就不需要手动对index.js转码了。
$ node index.js
2

// 需要注意的是，@babel/register只会对require命令加载的文件转码，而不会对当前文件转码。另外，由于它是实时转码，所以只适合在开发环境使用。
```

## babel API

## @babel/polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

举例来说，ES6 在Array对象上新增了Array.from方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

```
$ npm install --save-dev @babel/polyfill
```

然后，在脚本头部，加入如下一行代码。
```
import '@babel/polyfill';
// 或者
require('@babel/polyfill');
```