// for (let codePoint of 'foo') {
//     console.log(codePoint)
// }
// // "f"
// // "o"
// // "o"

// 字符串 text 只有一个字符，但是 for 循环会认为它包含两个字符（都不可打印），而 for...of 循环会正确识别出这一个字符。
// let text = String.fromCodePoint(0x20BB7);

// for (let i = 0; i < text.length; i++) {
//     console.log(text[i]);
// }
// // " "
// // " "

// for (let i of text) {
//     console.log(i);
// }
// // "𠮷"


// let a = `In JavaScript this is
// not legal.`
// console.log(a);

// let a = `
// string text line 1
// string text line 2`.trim();
// console.log(a);

// // 字符串中嵌入变量
// let name = "Bob", time = "today";
// console.log(`Hello ${name}, how are you ${time}?`);

// let x = 1;
// let y = 2;

// console.log(`${x} + ${y} = ${x + y}`);

// function fn() {
//     return "Hello World";
// }
// console.log(`foo ${fn()} bar`); // foo Hello World bar

// let a = 5;
// let b = 10;

// console.log`Hello ${ a + b } world ${ a * b }`;
// 等同于
// tag(['Hello ', ' world ', ''], 15, 50);

// let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

// function SaferHTML(templateData) {
//     let s = templateData[0];
//     for (let i = 1; i < arguments.length; i++) {
//         let arg = String(arguments[i]);

//         // Escape special characters in the substitution.
//         s += arg.replace(/&/g, "&amp;")
//                 .replace(/</g, "&lt;")
//                 .replace(/>/g, "&gt;");

//         // Don't escape special characters in the template.
//         s += templateData[i];
//     }
//     return s;
// }

// var s = "王";

// console.log(s.length); // 1
// console.log(s.charAt(0)); // 王
// console.log(s.charAt(1)); // ''
// console.log(s.charCodeAt(0)); // 29579
// console.log(s.charCodeAt(1)); // NaN
// console.log(s.codePointAt(0)); // 29579
// console.log(s.codePointAt(1)); // undefined

// let s = '𠮷a';
// console.log(s.charAt(0)); // �
// console.log(s.charAt(1)); // �
// console.log(s.charAt(2)); // a
// console.log(s.charCodeAt(0)); // 55362
// console.log(s.charCodeAt(1)); // 57271
// console.log(s.charCodeAt(2)); // 97
// console.log(s.codePointAt(0)); // 134071
// console.log(s.codePointAt(1)); // 57271
// console.log(s.codePointAt(2)); // 97
// console.log(s.codePointAt(0).toString(16)); // "20bb7"
// console.log(s.codePointAt(1).toString(16)); // "dfb7"
// console.log(s.codePointAt(2).toString(16)); // "61"

// let s = '𠮷a';
// for (let ch of s) {
//     console.log(ch.codePointAt(0).toString(16));
// }
// // 20bb7
// // 61

// function is32Bit(c) {
//     return c.codePointAt(0) > 0xFFFF;
// }
  
// console.log(is32Bit("𠮷")); // true
// console.log(is32Bit("a")); // false

// let s = 'Hello world!';
// console.log(s.startsWith('world', 6)); // true
// console.log(s.endsWith('Hello', 5)); // true
// console.log(s.includes('Hello', 6)); // false

// console.log('x'.repeat(3)); // "xxx"
// console.log('na'.repeat(2.9)); // "nana"
// console.log('na'.repeat(Infinity)); // RangeError
// console.log('na'.repeat(-1)); // RangeError
// console.log('na'.repeat(-0.9)); // ""
// console.log('na'.repeat(NaN)); // ""
// console.log('na'.repeat('na')); // ""
// console.log('na'.repeat('3')); // "nanana"

console.log('x'.padStart(5, 'ab')); // 'ababx'
console.log('x'.padEnd(4, 'ab')); // 'xaba'