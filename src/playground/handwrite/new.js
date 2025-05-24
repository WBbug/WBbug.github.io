//new 的过程
// 生成的对象可以访问构造函数的属性
// 生成的对象可以访问构造函数原型上的属性
// 如果fn返回一个对象则直接返回这个对象

// function myNew() {
//   var obj = new Object()
//   let Constructor = [].shift.call(arguments);
//   obj.__proto__ = Constructor.prototype;
//   var ret = Constructor.apply(obj, arguments);
//   return typeof ret === 'object' ? ret : obj;
// };

function myNew(fn, ...arg) {
  const obj = {};
  obj.__proto__ = fn.prototype;
  const res = fn.apply(obj, arg);
  return typeof res === "object" ? res : obj;
}

function myNew(fn, ...arg) {
  if (typeof fn !== "function") return;
  const obj = {};
  obj.__proto__ = Object.getPrototypeOf(fn);
  res = fn.apply(obj, arg);
  return typeof res === "object" ? res : obj;
}

function Parent(name) {
  this.name = name;
}

const p = myNew(Parent, "alice");
// const p = new Parent('21')

console.log(p);
