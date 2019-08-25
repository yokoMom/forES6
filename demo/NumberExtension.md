# 数值的扩展

## 二进制(binary)和八进制(octonary)表示法

ES6 提供了二进制和八进制数值的新的写法，分别用前缀 0b（或0B）和 0o（或0O）表示。

从 ES5 开始，在严格模式之中，八进制就不再允许使用前缀 0 表示，ES6 进一步明确，要使用前缀 0o 表示。

如果要将 0b 和 0o 前缀的字符串数值转为十进制，要使用 Number() 方法。

```
0b111110111 === 503; // true
Number(0o767); // 503
```

## Number.isFinite(), Number.isNaN()

ES6 在 Number 对象上，新提供了 Number.isFinite() 和 Number.isNaN() 两个方法。

Number.isFinite() —— 用来检查一个数值是否为有限的（finite），即不是 Infinity。

注意，如果参数类型不是数值，Number.isFinite() 一律返回 false。

```
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
```

Number.isNaN() —— 用来检查一个值是否为 NaN。

如果参数类型不是 NaN，Number.isNaN() 一律返回 false。

```
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true
```

它们与传统的全局方法 isFinite() 和 isNaN() 的区别在于，传统方法先调用 Number() 将非数值的值转为数值，再进行判断。
而这两个新方法只对数值有效，Number.isFinite() 对于非数值一律返回 false, Number.isNaN() 只有对于 NaN 才返回 true，非 NaN 一律返回 false。

```
typeof(NaN); // 'number'

isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false

isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
```

## Number.parseInt(), Number.parseFloat()

ES6 将全局方法 parseInt() 和 parseFloat()，移植到 Number 对象上面，行为完全保持不变。

这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。

```
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true
```

## Number.isInteger()

Number.isInteger() 用来判断一个数值是否为整数。

JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

如果参数不是数值，Number.isInteger() 返回 false。

注意，由于 JavaScript 采用 IEEE 754 标准，数值存储为 64 位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第 54 位及后面的位就会被丢弃，这种情况下，Number.isInteger() 可能会误判。

类似的情况还有，如果一个数值的绝对值小于 Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger() 也会误判。

总之，如果对数据精度的要求较高，不建议使用 Number.isInteger() 判断一个数值是否为整数。

```
Number.isInteger(25); // true
Number.isInteger(25.0); // true

Number.isInteger(25.1); // true

Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false

// 这个小数的精度达到了小数点后 16 个十进制位，转成二进制位超过了 53 个二进制位，导致最后的那个 2 被丢弃了。
Number.isInteger(3.0000000000000002) // true

// 5E-325 由于值太小，会被自动转为 0，因此返回 true。
Number.isInteger(5E-324) // false
Number.isInteger(5E-325) // true
```

## Number.EPSILON

ES6 在 Number 对象上面，新增一个极小的常量 Number.EPSILON。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。

对于 64 位浮点数来说，大于 1 的最小浮点数相当于二进制的 1.00..001，小数点后面有连续 51 个零。这个值减去 1 之后，就等于 2 的 -52 次方。

```
Number.EPSILON === Math.pow(2, -52); // true
Number.EPSILON; // 2.220446049250313e-16
Number.EPSILON.toFixed(20); // "0.00000000000000022204"
```

Number.EPSILON 实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。

引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不精确的。

```
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 - 0.3; // 5.551115123125783e-17
5.551115123125783e-17.toFixed(20); // '0.00000000000000005551'
```

上面代码解释了，为什么比较 0.1 + 0.2 与 0.3 得到的结果是 false。

```
0.1 + 0.2 === 0.3; // false
```

Number.EPSILON 可以用来设置“能够接受的误差范围”。比如，误差范围设为 2 的 -50 次方（即 Number.EPSILON * Math.pow(2, 2)），即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。

```
5.551115123125783e-17 < Number.EPSILON * Math.pow(2, 2); // true
```

因此，Number.EPSILON 的实质是一个可以接受的最小误差范围。

```
// 下面的代码为浮点数运算，部署了一个误差检查函数。
function withinErrorMargin (left, right) {
    return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```

## 安全整数和 Number.isSafeInteger()

JavaScript 能够准确表示的整数范围在 -2^53 到 2^53 之间（不含两个端点），超过这个范围，无法精确表示这个值。

ES6 引入了 Number.MAX_SAFE_INTEGER 和 Number.MIN_SAFE_INTEGER 这两个常量，用来表示这个范围的上下限。

```
Math.pow(2, 53) // 9007199254740992

9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992

Math.pow(2, 53) === Math.pow(2, 53) + 1; // true
```

Number.isSafeInteger() 则是用来判断一个整数是否落在这个范围之内。

```
// 这个函数的实现很简单，就是跟安全整数的两个边界值比较一下。
Number.isSafeInteger = function (n) {
    return (typeof n === 'number' &&
        Math.round(n) === n &&
        Number.MIN_SAFE_INTEGER <= n &&
        n <= Number.MAX_SAFE_INTEGER);
}

Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false

Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
```

实际使用这个函数时，需要注意。验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值。

```
Number.isSafeInteger(9007199254740993); // false
Number.isSafeInteger(990); // true
Number.isSafeInteger(9007199254740993 - 990); // true

9007199254740993 - 990
// 返回结果 9007199254740002
// 正确答案应该是 9007199254740003
```

所以，如果只验证运算结果是否为安全整数，很可能得到错误结果。下面的函数可以同时验证两个运算数和运算结果。

```
function trusty (left, right, result) {
    if (
        Number.isSafeInteger(left) &&
        Number.isSafeInteger(right) &&
        Number.isSafeInteger(result)
    ) {
        return result;
    }
    throw new RangeError('Operation cannot be trusted!');
}

trusty(9007199254740993, 990, 9007199254740993 - 990); // RangeError: Operation cannot be trusted!
trusty(1, 2, 3); // 3
```

## Math 对象的扩展

ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。

### Math.trunc() —— 用于去除一个数的小数部分，返回整数部分。

对于非数值，Math.trunc() 内部使用 Number() 方法将其先转为数值。

对于空值和无法截取整数的值，返回 NaN。

```
// 对于没有部署这个方法的环境，可以用下面的代码模拟。

Math.trunc = Math.trunc || function(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
};
```

### Math.sign() —— 判断一个数到底是正数、负数、还是零。

对于非数值，会先将其转换为数值。对于那些无法转为数值的值，会返回 NaN。

它会返回五种值:
- 参数为正数，返回 +1；
- 参数为负数，返回 -1；
- 参数为 0，返回 0；
- 参数为 -0，返回 -0;
- 其他值，返回 NaN。

```
// 对于没有部署这个方法的环境，可以用下面的代码模拟。

Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};
```

### Math.cbrt() —— 计算一个数的立方根。

对于非数值，Math.cbrt() 方法内部也是先使用 Number() 方法将其转为数值。

```
// 对于没有部署这个方法的环境，可以用下面的代码模拟。

Math.cbrt = Math.cbrt || function(x) {
    var y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
};
```

### Math.clz32() —— 将参数转为 32 位无符号整数的形式，然后返回这个 32 位值里面有多少个前导 0。

clz32 这个函数名就来自”count leading zero bits in 32-bit binary representation of a number“（计算一个数的 32 位二进制形式的前导 0 的个数）的缩写。

对于小数，Math.clz32() 方法只考虑整数部分。

对于空值或其他类型的值，Math.clz32() 方法会将它们先转为数值，然后再计算。

### Math.imul() —— 返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。

### Math.fround() —— 返回一个数的 32位 单精度浮点数形式。

### Math.hypot() —— 返回所有参数的平方和的平方根。

如果参数不是数值，Math.hypot() 方法会将其转为数值。只要有一个参数无法转为数值，就会返回 NaN。

### 对数方法

- Math.expm1(x) —— 返回 ex - 1，即 Math.exp(x) - 1。
- Math.log1p(x) —— 返回 1 + x 的自然对数，即 Math.log(1 + x)。如果 x 小于 -1，返回 NaN。
- Math.log10(x) —— 返回以 10 为底的 x 的对数。如果 x 小于 0，则返回 NaN。
- Math.log2(x) —— 返回以 2 为底的 x 的对数。如果 x 小于 0，则返回 NaN。

### 双曲函数方法

ES6 新增了 6 个双曲函数方法。

- Math.sinh(x) —— 返回 x 的双曲正弦（hyperbolic sine）
- Math.cosh(x) —— 返回 x 的双曲余弦（hyperbolic cosine）
- Math.tanh(x) —— 返回 x 的双曲正切（hyperbolic tangent）
- Math.asinh(x) —— 返回 x 的反双曲正弦（inverse hyperbolic sine）
- Math.acosh(x) —— 返回 x 的反双曲余弦（inverse hyperbolic cosine）
- Math.atanh(x) —— 返回 x 的反双曲正切（inverse hyperbolic tangent）

## 指数运算符

ES2016 新增了一个指数运算符（**）。