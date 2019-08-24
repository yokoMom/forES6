# 字符串的扩展

## 1. 字符的 Unicode 表示法

ES6 加强了对 Unicode 的支持，允许采用 \uxxxx 形式表示一个字符，其中 xxxx 表示字符的 Unicode 码点。

但是，这种表示法只限于码点在 \u0000~\uFFFF 之间的字符。超出这个范围的字符，必须用两个双字节的形式表示。

ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。

```
let a = "\u0061"; // "a"

"\uD842\uDFB7" // "𠮷"

// 下面代码表示，如果直接在 \u 后面跟上超过 0xFFFF 的数值（比如\u20BB7），JavaScript 会理解成 \u20BB+7 。由于 \u20BB 是一个不可打印字符，所以只会显示一个空格，后面跟着一个7。
"\u20BB7" // " 7"

"\u{20BB7}" // "𠮷"

// 大括号表示法与四字节的 UTF-16 编码是等价的。
'\u{1F680}' === '\uD83D\uDE80'; // true
```

有了这种表示法之后，JavaScript 共有 6 种方法可以表示一个字符。   ================  excuse me？？？？

```
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```



## 2. 字符串的遍历器接口

ES6 为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被 for...of 循环遍历。

```
for (let codePoint of 'foo') {
    console.log(codePoint)
}
// "f"
// "o"
// "o"
```

除了遍历字符串，这个遍历器最大的优点是可以识别大于 0xFFFF 的码点，传统的 for 循环无法识别这样的码点。

## 3.直接输入 U+2028 和 U+2029

JavaScript 字符串允许直接输入字符，以及输入字符的转义形式。举例来说，“中”的 Unicode 码点是 U+4e2d，你可以直接在字符串里面输入这个汉字，也可以输入它的转义形式\u4e2d，两者是等价的。

但是，JavaScript 规定有5个字符，不能在字符串里面直接使用，只能使用转义形式。
- U+005C：反斜杠（reverse solidus) —— '\\'
- U+000D：回车（carriage return） —— '\r'
- U+2028：行分隔符（line separator） —— ' '
- U+2029：段分隔符（paragraph separator） —— ' '  
- U+000A：换行符（line feed） —— '\n'  

举例来说，字符串里面不能直接包含反斜杠，一定要转义写成\\或者\u005c。

这个规定本身没有问题，麻烦在于 JSON 格式允许字符串里面直接使用 U+2028（行分隔符）和 U+2029（段分隔符）。这样一来，服务器输出的 JSON 被JSON.parse解析，就有可能直接报错。

```
const json = '"\u2028"';
JSON.parse(json); // 可能报错
```

JSON 格式已经冻结（RFC 7159），没法修改了。为了消除这个报错，ES2019 允许 JavaScript 字符串直接输入 U+2028（行分隔符）和 U+2029（段分隔符）。

```
const PS = eval("'\u2029'");
```

根据这个提案，上面的代码不会报错。

注意，模板字符串现在就允许直接输入这两个字符。另外，正则表达式依然不允许直接输入这两个字符，这是没有问题的，因为 JSON 本来就不允许直接包含正则表达式。

## 4.JSON.stringify() 的改造 

根据标准，JSON 数据必须是 UTF-8 编码。但是，现在的 JSON.stringify() 方法有可能返回不符合 UTF-8 标准的字符串。

具体来说，UTF-8 标准规定，0xD800 到 0xDFFF 之间的码点，不能单独使用，必须配对使用。
比如，\uD834\uDF06 是两个码点，但是必须放在一起配对使用，代表字符𝌆。这是为了表示码点大于 0xFFFF 的字符的一种变通方法。单独使用 \uD834 和 \uDFO6 这两个码点是不合法的，或者颠倒顺序也不行，因为 \uDF06\uD834 并没有对应的字符。

JSON.stringify() 的问题在于，它可能返回 0xD800 到 0xDFFF 之间的单个码点。

```
JSON.stringify('\u{D834}') // "\u{D834}"
```

为了确保返回的是合法的 UTF-8 字符，ES2019 改变了 JSON.stringify() 的行为。如果遇到 0xD800 到 0xDFFF 之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理。

```
JSON.stringify('\u{D834}') // ""\\uD834""
JSON.stringify('\uDF06\uD834') // ""\\udf06\\ud834""
```

## 5. 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。

如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

模板字符串中嵌入变量，需要将变量名写在```${}```之中。大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性。

模板字符串之中还能调用函数。

由于模板字符串的大括号内部，就是执行 JavaScript 代码，因此如果大括号内部是一个字符串，将会原样输出。最终，如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的 toString 方法。

模板字符串甚至还能嵌套。

```
// 普通字符串
 let a = `In JavaScript '\n' is a line-feed.`;
 a // 'In JavaScript \'\n\' is a line-feed.'

// 多行字符串 - 真实的展示为两行
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
console.log(`Hello ${name}, how are you ${time}?`); // Hello Bob, how are you today?

let x = 1;
let y = 2;
console.log(`${x} + ${y} = ${x + y}`); // "1 + 2 = 3"
```

所有模板字符串的空格和换行，都是被保留的。如果你不想要这个换行，可以使用 trim() 消除它。

```
// 仅消除 <ul> 前面的而已...
$('#list').html(`
<ul>
  <li>first</li>
  <li>second</li>
</ul>
`.trim());
```

如果需要引用模板字符串本身，在需要时执行，可以写成函数。

```
// 将模板字符串写成了一个函数的返回值。执行这个函数，就相当于执行这个模板字符串了。
let func = (name) => `Hello ${name}!`;
func('Jack') // "Hello Jack!"
```

## 6. 标签模板

模板字符串的功能，不仅仅是上面这些。它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能（tagged template）。

标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。

```
alert`123`;
// 等同于
alert(123);
```

如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数。

第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分，也就是说，变量替换只发生在数组的第一个成员与第二个成员之间、第二个成员与第三个成员之间，以此类推。

```
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);

// 第一个参数：['Hello ', ' world ', '']
// 第二个参数: 15
// 第三个参数：50
```

#### “标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。

```
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}
```

#### 标签模板的另一个应用，就是多语言转换（国际化处理）。


## 7. 模板字符串的限制

虽然标签模板里面，可以内嵌其他语言。但是，模板字符串默认会将字符串转义，导致无法嵌入其他语言。

为了解决这个问题，ES2018 放松了对标签模板里面的字符串转义的限制。如果遇到不合法的字符串转义，就返回 undefined，而不是报错，并且从 raw 属性上面可以得到原始字符串。

## 8. 字符串的新增方法

### String.fromCodePoint()

ES5 提供 String.fromCharCode() 方法，用于从 Unicode 码点返回对应字符，但是这个方法不能识别码点大于 0xFFFF 的字符。

ES6 提供了 String.fromCodePoint() 方法，可以识别大于 0xFFFF 的字符，弥补了 String.fromCharCode() 方法的不足。

如果 String.fromCodePoint 方法有多个参数，则它们会被合并成一个字符串返回。

```
// String.fromCharCode() 不能识别大于 0xFFFF 的码点，所以 0x20BB7 就发生了溢出，最高位 2 被舍弃了，最后返回码点 U+0BB7 对应的字符，而不是码点 U+20BB7 对应的字符。
String.fromCharCode(0x20BB7) // "ஷ"
String.fromCodePoint(0x20BB7) // "𠮷"

String.fromCodePoint(0x78, 0x1f680, 0x79) // 'x🚀y'
```

### String.raw()

该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。

如果原字符串的斜杠已经转义，那么String.raw()会进行再次转义。

```
String.raw`Hi\n${2+3}!`; // 返回 "Hi\\n5!"

String.raw`Hi\\n`; // 返回 "Hi\\\\n"
```

String.raw() 方法可以作为处理模板字符串的基本方法，它会将所有变量替换，而且对斜杠进行转义，方便下一步作为字符串来使用。 ????

String.raw() 方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有 raw 属性的对象，且 raw 属性的值应该是一个数组。 ?????

```
String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'

// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);
```

作为函数，String.raw() 的代码实现基本如下。【所以，为啥上面是转义了斜杠？？？？】

```
String.raw = function (strings, ...values) {
    let output = '';
    let index;
    for (index = 0; index < values.length; index++) {
        output += strings.raw[index] + values[index];
    }

    output += strings.raw[index]
    return output;
}
```


### 实例方法：codePointAt()

JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。

```
var s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是0x20BB7，UTF-16 编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。对于这种4个字节的字符，JavaScript 不能正确处理，字符串长度会误判为2，而且charAt()方法无法读取整个字符，charCodeAt()方法只能分别返回前两个字节和后两个字节的值。

ES6 提供了 codePointAt()方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。

codePointAt() 方法返回的是码点的十进制值，如果想要十六进制的值，可以使用 toString() 方法转换一下。

```
let s = '𠮷a';
console.log(s.charAt(0)); // �
console.log(s.charAt(1)); // �
console.log(s.charAt(2)); // a
console.log(s.charCodeAt(0)); // 55362
console.log(s.charCodeAt(1)); // 57271
console.log(s.charCodeAt(2)); // 97
console.log(s.codePointAt(0)); // 134071
console.log(s.codePointAt(1)); // 57271
console.log(s.codePointAt(2)); // 97
console.log(s.codePointAt(0).toString(16)); // "20bb7"
console.log(s.codePointAt(1).toString(16)); // "dfb7"
console.log(s.codePointAt(2).toString(16)); // "61"
```

总之，codePointAt() 方法会正确返回 32 位的 UTF-16 字符的码点。对于那些两个字节储存的常规字符，它的返回结果与 charCodeAt() 方法相同。

你可能注意到了，codePointAt()方法的参数，仍然是不正确的。比如，上面代码中，字符 a 在字符串s的正确位置序号应该是 1，但是必须向 codePointAt() 方法传入 2。解决这个问题的一个办法是使用 for...of 循环，因为它会正确识别 32 位的 UTF-16 字符。

```
let s = '𠮷a';
for (let ch of s) {
    console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61
```

codePointAt() 方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

```
function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
}
  
console.log(is32Bit("𠮷")); // true
console.log(is32Bit("a")); // false
```

### 实例方法：normalize()

许多欧洲语言有语调符号和重音符号。为了表示它们，Unicode 提供了两种方法。一种是直接提供带重音符号的字符，比如Ǒ（\u01D1）。另一种是提供合成符号（combining character），即原字符与重音符号的合成，两个字符合成一个字符，比如O（\u004F）和ˇ（\u030C）合成Ǒ（\u004F\u030C）。

这两种表示方法，在视觉和语义上都等价，但是 JavaScript 不能识别。

```
// JavaScript 将合成字符视为两个字符，导致两种表示方法不相等。
'\u01D1'==='\u004F\u030C' //false

'\u01D1'.length // 1
'\u004F\u030C'.length // 2
```

ES6 提供字符串实例的 normalize() 方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

normalize() 方法可以接受一个参数来指定 normalize 的方式，参数的四个可选值如下。
- NFC，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
- NFD，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。
- NFKC，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，normalize方法不能识别中文。）
- NFKD，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。

```
'\u01D1'.normalize() === '\u004F\u030C'.normalize(); // true

'\u004F\u030C'.normalize('NFC').length; // 1
'\u004F\u030C'.normalize('NFD').length; // 2
```

不过，normalize 方法目前不能识别三个或三个以上字符的合成。这种情况下，还是只能使用正则表达式，通过 Unicode 编号区间判断。

### 实例方法：includes(), startsWith(), endsWith() 

传统上，JavaScript 只有 indexOf 方法，可以用来确定一个字符串是否包含在另一个字符串中。

ES6 又提供了三种新方法。

- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

这三个方法都支持第二个参数，表示开始搜索的位置。

### 实例方法：repeat()

repeat 方法返回一个新字符串，表示将原字符串重复 n 次。

参数如果是小数，会被取整；如果是负数或者 Infinity，会报错。

但是，如果参数是 0 到 -1 之间的小数，则等同于 0，这是因为会先进行取整运算。0 到 -1 之间的小数，取整以后等于 -0，repeat 视同为 0。

参数 NaN 等同于 0。

如果 repeat 的参数是字符串，则会先转换成数字。

```
'x'.repeat(3); // "xxx"

'na'.repeat(2.9); // "nana"

'na'.repeat(Infinity); // RangeError
'na'.repeat(-1); // RangeError

'na'.repeat(-0.9); // ""

'na'.repeat(NaN); // ""

'na'.repeat('na'); // ""
'na'.repeat('3'); // "nanana"
```

### 实例方法：padStart()、padEnd()

ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart() 用于头部补全，padEnd() 用于尾部补全。

padStart() 和 padEnd() 一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。如果省略第二个参数，默认使用空格补全长度。

如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。

如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。

```
'x'.padStart(5, 'ab') // 'ababx'
'x'.padEnd(4, 'ab') // 'xaba'
```

padStart() 的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。

```
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```

另一个用途是提示字符串格式。

```
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

### 实例方法：trimStart()、trimEnd()

ES2019 对字符串实例新增了 trimStart() 和 trimEnd() 这两个方法。它们的行为与 trim() 一致，trimStart() 消除字符串头部的空格，trimEnd() 消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。

除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

浏览器还部署了额外的两个方法，trimLeft() 是 trimStart() 的别名，trimRight() 是 trimEnd() 的别名。

```
const s = '  abc  ';

s.trim(); // "abc"
s.trimStart(); // "abc  "
s.trimEnd();   // "  abc"
```

### 实例方法：matchAll()

matchAll() 方法返回一个正则表达式在当前字符串的所有匹配，详见《正则的扩展》的一章。