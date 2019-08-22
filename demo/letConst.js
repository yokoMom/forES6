require('@babel/register');

// // ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。
// {
//     let a = 1;
//     var b = 2;
//     console.log(a);
// }
// // console.log(a); // ReferenceError: a is not defined
// console.log(b); // 2


// // for循环的计数器，就很合适使用let命令。
// for (let i = 0; i < 10; i++) {
//     console.log(i);
// }
// // console.log(i); // ReferenceError: i is not defined


//// var 循环
// var a = [];
// for (var i = 0; i < 10; i++) {
//     a[i] = function () {
//         console.log(i);
//     };
// }
// a[6](); // 10
//// let 循环
// var a = [];
// for (let i = 0; i < 10; i++) {
//     a[i] = function () {
//         console.log(i);
//     };
// }
// a[6](); // 6
//// let 循环2
// // for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
// // 下面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。
// for (let i = 0; i < 3; i++) {
//     let i = 'abc';
//     console.log(i);
// }
// // abc
// // abc
// // abc


// // let 不存在变量提升
// // let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。
// // var 的情况
// console.log(foo); // 输出 undefined
// var foo = 2;
//// let 的情况
// console.log(bar); // 报错 ReferenceError
// let bar = 2;


// 暂时性死区 temporal dead zone, TDZ
// 只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
// var tmp = 123;
// if (true) {
//     tmp = 'abc'; // ReferenceError
//     let tmp;
// }
// 死区流程图
// if (true) {
//     TDZ开始
//     tmp = 'abc'; // ReferenceError
//     console.log(tmp); // ReferenceError
  
//     let tmp; // TDZ结束
//     console.log(tmp); // undefined
  
//     tmp = 123;
//     console.log(tmp); // 123
// }


// // “暂时性死区”也意味着typeof不再是一个百分之百安全的操作。
// // 下面代码中，变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。
// // 因此，typeof运行时就会抛出一个ReferenceError。
// typeof x; // ReferenceError
// let x;
// // 作为比较，如果一个变量根本没有被声明，使用typeof反而不会报错。
// typeof y; // "undefined"


//// 块级作用域
// function f1() {
//     let n = 5;
//     if (true) {
//         let n = 10;
//     }
//     console.log(n); // 5
// }
// f1();

//// ES6 允许块级作用域的任意嵌套。
// {{{{
//     {let insane = 'Hello World'}
//     console.log(insane); // 报错
// }}}};

//// IIFE 写法
// (function () {
//     var tmp = '';
//     console.log('...');
// }());
//// 块级作用域写法
// {
//     var tmp = '';
//     console.log('...');
// }

// 函数声明
// function fo() { console.log('I am outside!'); }
// (function () {
//     if (false) {
//         // 重复声明一次函数f
//         function fo() { console.log('I am inside!'); }
//     }
//     fo();
// }());

// 块级作用域内部的函数声明语句，建议不要使用
// {
//     let a = 'secret';
//     function f() {
//         return a;
//     }
// }
// // 块级作用域内部，优先使用函数表达式
// {
//     let a = 'secret';
//     let f = function () {
//         return a;
//     };
// }

//// 第一种写法，报错
//// 没有大括号，所以不存在块级作用域，而 let 只能出现在当前作用域的顶层，所以报错。
// if (true) let x = 1;
//// 第二种写法，不报错
// if (true) {
//   let x = 1;
// }

// 函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层。
// // 不报错
// 'use strict';
// if (true) {
//     function f() {}
// }
//// 报错
//// In strict mode code, functions can only be declared at top level or inside a block
// 'use strict';
// if (true)
//     function f() {}


// const PI = 3.1415;
// console.log(PI); // 3.1415
// PI = 3; // Error: "PI" is read-only

// const foo; // SyntaxError: Missing initializer in const declaration

// if (true) {
//     const MAX = 5;
// }  
// MAX // Uncaught ReferenceError: MAX is not defined

// if (true) {
//     console.log(MIN); // ReferenceError
//     const MIN = 5;
// }

// var message = "Hello!";
// let age = 25;
// // 以下两行都会报错
// const message = "Goodbye!";
// const age = 30;

// const foo = {};
// // 为 foo 添加一个属性，可以成功
// foo.prop = 123;
// foo.prop // 123
// // 将 foo 指向另一个对象，就会报错
//// foo = {}; // TypeError: "foo" is read-only

// const a = [];
// a.push('Hello'); // 可执行
// a.length = 0;    // 可执行
//// a = ['Dave'];    // Error: "a" is read-only

// const foo = Object.freeze({});
// // 常规模式时，下面一行不起作用；
// // 严格模式时，该行会报错
// foo.prop = 123; // TypeError: Cannot add property prop, object is not extensible

// var constantize = (obj) => {
//     Object.freeze(obj);
//     Object.keys(obj).forEach( (key, i) => {
//         if ( typeof obj[key] === 'object' ) {
//             constantize( obj[key] );
//         }
//     });
// };

// // ES5
// window.a = 1;
// a; // 1
// a = 2;
// window.a; // 2


// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
// var a = 1;
// console.log(window.a); // 1
// let b = 1;
// window.b // undefined  // ReferenceError: window is not defined 😂