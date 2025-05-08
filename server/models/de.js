const s = "4 1 2 6 7 9";
const e = `4
1 2
6 7
9`;

let a1 = s.split(" ");
let a2 = e.split("\n").map((line) => line.split(" "));
a2 = a2.flat();
console.log(JSON.stringify(a1) === JSON.stringify(a2));

const statercode = {
  java: "kdjdkd",
  javascript: "djdjdj",
};
const lang = "javascript";

console.log(statercode[lang]);
