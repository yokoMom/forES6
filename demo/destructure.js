// // 下面是一些使用嵌套数组进行解构的例子:
// let [foo, [[bar], baz]] = [1, [[2], 3]];
// foo; // 1
// bar; // 2
// baz; // 3

// let [ , , third] = ["foo", "bar", "baz"];
// third; // "baz"

// let [x, , y] = [1, 2, 3];
// x; // 1
// y; // 3

// let [head, ...tail] = [1, 2, 3, 4];
// head; // 1
// tail; // [2, 3, 4]

// let [x, y, ...z] = ['a'];
// x; // "a"
// y; // undefined
// z; // []


// // 下面两种情况都属于解构不成功，foo 的值都会等于 undefined。
// let [foo] = [];
// let [bar, foo] = [1];


// // 不完全解构
// let [x, y] = [1, 2, 3];
// x; // 1
// y; // 2

// let [a, [b], d] = [1, [2, 3], 4];
// a; // 1
// b; // 2
// d; // 4


// // 指定默认值
// let [foo = true] = [];
// foo; // true

// let [x, y = 'b'] = ['a']; // x='a', y='b'
// let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

// let [x = 1] = [undefined];
// x; // 1

// let [x = 1] = [];
// x; // 1

// let [x = 1] = [null];
// x; // null

// // 默认值，表达式惰性求值
// function f() {
//     console.log('aaa');
// }
  
// let [x = f()] = [1];
// x;

// 默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
// let [x = 1, y = x] = [];     // x=1; y=1
// let [x = 1, y = x] = [2];    // x=2; y=2
// let [x = 1, y = x] = [1, 2]; // x=1; y=2
// let [x = y, y = 1] = [];     // ReferenceError: y is not defined    ============= ????


// 对象的解构赋值
// let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
// foo // "aaa"
// bar // "bbb"

// let { baz } = { foo: 'aaa', bar: 'bbb' };
// baz // undefined

// const { log } = console;
// log('hello') // hello

// let obj = {
//     p: [
//         'Hello',
//         { y: 'World' }
//     ]
// };

// let { p: [x, { y }] } = obj;
// console.log(x); // "Hello"
// console.log(y); // "World"

// let { p, p: [x, { y }] } = obj;
// p // ["Hello", {y: "World"}]

// const node = {
//     loc: {
//         start: {
//             line: 1,
//             column: 5
//         }
//     }
// };
  
// let { loc, loc: { start }, loc: { start: { line: wyj }} } = node;
// console.log(loc); // { start: { line: 1, column: 5 } }
// console.log(start); // { line: 1, column: 5 }
// console.log(wyj); // 1

// var {x, y = 5} = {x: 1};
// x // 1
// y // 5

// // 错误的写法
// let x;
// {x} = {x: 1};
// // SyntaxError: syntax error

// // 正确的写法
// let x;
// ({x} = {x: 1});

// let {} = {x:1};

// function move({x = 0, y = 0} = {}) {
//     return [x, y];
// }
// console.log(move({x: 3, y: 8})); // [3, 8]
// console.log(move({x: 3})); // [3, 0]
// console.log(move({})); // [0, 0]
// console.log(move()); // [0, 0]

// function move({x, y} = { x: 0, y: 0 }) {
//     return [x, y];
// }
// console.log(move({x: 3, y: 8})); // [3, 8]
// console.log(move({x: 3})); // [3, undefined]
// console.log(move({})); // [undefined, undefined]
// console.log(move()); // [0, 0]
