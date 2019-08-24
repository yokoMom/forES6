# 变量的解构赋值

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。

## 1. 数组的解构赋值

### 基本用法

```
// 以前，为变量赋值，只能直接指定值。
let a = 1;
let b = 2;
let c = 3;

// ES6 允许写成下面这样。
// 上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值。
let [a, b, c] = [1, 2, 3];
```

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。

如果解构不成功，变量的值就等于 undefined。

另一种情况是不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功。


如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错。

对于 Set 结构，也可以使用数组的解构赋值。事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```
// 报错
// 下面的语句都会报错，因为等号右边的值，要么转为对象以后不具备 Iterator 接口（前五个表达式），要么本身就不具备 Iterator 接口（最后一个表达式）。
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// 正确
let [foo] = 'a';  
foo; // a

// Set 结构
let [x, y, z] = new Set(['a', 'b', 'c']);
x; // "a"

// fibs 是一个 Generator 函数（参见《Generator 函数》一章），原生具有 Iterator 接口。解构赋值会依次从这个接口获取值。
function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth; // 5
```

### 默认值

解构赋值允许指定默认值。

注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效。

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

```
let [x = 1] = [undefined];
console.log(x); // 1

let [x = 1] = [];
console.log(x); // 1

let [x = 1] = [null];
console.log(x); // null
```

## 2. 对象的解构赋值

解构不仅可以用于数组，还可以用于对象。

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

如果解构失败，变量的值等于undefined。

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。

与数组一样，解构也可以用于嵌套结构的对象。

```
const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};
  
let { loc, loc: { start }, loc: { start: { line: wyj }} } = node;
console.log(loc); // { start: { line: 1, column: 5 } }
console.log(start); // { line: 1, column: 5 }
console.log(wyj); // 1
```

### 默认值

对象的解构也可以指定默认值。

默认值生效的条件是，对象的属性值严格等于 undefined。

### 原理

如果变量名与属性名不一致，必须写成下面这样。

```
let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

这实际上说明，对象的解构赋值是下面形式的简写（参见《对象的扩展》一章）。
也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。
真正被赋值的是属性值，而不是属性名。

```
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

### 注意：

1. 如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错。

```
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

上面代码中，等号左边对象的 foo 属性，对应一个子对象。该子对象的 bar 属性，解构时会报错。原因很简单，因为 foo 这时等于 undefined，再取子属性就会报错。

2. 对象的解构赋值可以取到继承的属性。

```
// 对象 obj1 的原型对象是 obj2。foo 属性不是 obj1 自身的属性，而是继承自 obj2 的属性，解构赋值可以取到这个属性。
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // "bar"
```

3. 如果要将一个已经声明的变量用于解构赋值，必须非常小心。

```
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error


// 正确的写法
let x;
({x} = {x: 1});
```

上面代码的写法会报错，因为 JavaScript 引擎会将 {x} 理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

4. 解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式。

```
// 这些表达式虽然毫无意义，但是语法是合法的，可以执行。
({} = [true, false]); // [true, false]
({} = 'abc'); // 'abc'
({} = []); // []
```

5. 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。

```
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

上面代码对数组进行对象解构。数组 arr 的 0 键对应的值是 1，[arr.length - 1] 就是 2 键，对应的值是 3。方括号这种写法，属于“属性名表达式”。（参见《对象的扩展》一章）。

## 3. 字符串的解构赋值

字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。

类似数组的对象都有一个 length 属性，因此还可以对这个属性解构赋值。

```
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
```

## 4. 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

```
// 数值和布尔值的包装对象都有 toString 属性，因此变量 s 都能取到值。
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

## 6. undefined 和 null 无法解构赋值

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错。

```
let { prop: x } = undefined; // TypeError: Cannot read property 'prop' of undefined
let { prop: y } = null; // TypeError: Cannot read property 'prop' of null
```

## 7. 函数参数的解构赋值

函数的参数也可以使用解构赋值。

函数参数的解构也可以使用默认值。undefined 就会触发函数参数的默认值。

下面代码中，函数 add 的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量 x 和 y。对于函数内部的代码来说，它们能感受到的参数就是 x 和 y。

```
// 函数 move 的参数是一个对象，通过对这个对象进行解构，得到变量 x 和 y 的值。如果解构失败，x 和 y 等于默认值。
function move({x = 0, y = 0} = {}) {
    return [x, y];
}
console.log(move({x: 3, y: 8})); // [3, 8]
console.log(move({x: 3})); // [3, 0]
console.log(move({})); // [0, 0]
console.log(move()); // [0, 0]

// 为函数 move 的参数指定默认值，而不是为变量 x 和 y 指定默认值，完全未传参数，才会使用该默认值，所以会得到与前一种写法不同的结果。
function move({x, y} = { x: 0, y: 0 }) {
    return [x, y];
}
console.log(move({x: 3, y: 8})); // [3, 8]
console.log(move({x: 3})); // [3, undefined]
console.log(move({})); // [undefined, undefined]
console.log(move()); // [0, 0]
```

## 8. 圆括号问题

解构赋值虽然很方便，但是解析起来并不容易。对于编译器来说，一个式子到底是模式，还是表达式，没有办法从一开始就知道，必须解析到（或解析不到）等号才能知道。

由此带来的问题是，如果模式中出现圆括号怎么处理。ES6 的规则是，只要有可能导致解构的歧义，就不得使用圆括号。

但是，这条规则实际上不那么容易辨别，处理起来相当麻烦。因此，建议只要有可能，就不要在模式中放置圆括号。

### 不能使用圆括号的情况

- （1）变量声明语句
- （2）函数参数 - 函数参数也属于变量声明，因此不能带有圆括号。
- （3）赋值语句的模式

### 可以使用圆括号的情况

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。

```
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
```

上面三行语句都可以正确执行，因为首先它们都是赋值语句，而不是声明语句；其次它们的圆括号都不属于模式的一部分。第一行语句中，模式是取数组的第一个成员，跟圆括号无关；第二行语句中，模式是p，而不是d；第三行语句与第一行语句的性质一致。

## 9. 变量解构赋值的用途

###（1）交换变量的值

```
// 下面代码交换变量 x 和 y 的值，这样的写法不仅简洁，而且易读，语义非常清晰。
let x = 1;
let y = 2;

[x, y] = [y, x];
```

###（2）从函数返回多个值

函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回。有了解构赋值，取出这些值就非常方便。

```
// 返回一个数组
function example() {
    return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
    return {
        foo: 1,
        bar: 2
    };
}
let { foo, bar } = example();
```

###（3）函数参数的定义

解构赋值可以方便地将一组参数与变量名对应起来。

```
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

// 这跟定义函数的参数定义为数组和对象貌似没啥区别啊...使用的时候，些许方便？
```

###（4）函数参数的默认值

指定参数的默认值，就避免了在函数体内部再写 ```var foo = config.foo || 'default foo';``` 这样的语句。

```
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

###（5）提取 JSON 数据

解构赋值对提取 JSON 对象中的数据，尤其有用。

```
// 下面代码可以快速提取 JSON 数据的值。
let jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number); // 42, "OK", [867, 5309]
```

###（6）遍历 Map 结构

任何部署了 Iterator 接口的对象，都可以用 for...of 循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便。

```
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```

如果只想获取键名，或者只想获取键值，可以写成下面这样。

```
// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

###（7）输入模块的指定方法

加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。

```
const { SourceMapConsumer, SourceNode } = require("source-map");
```


