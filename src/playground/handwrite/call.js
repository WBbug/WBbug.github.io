// console.log()
const obj = { name: 'david' };
function callName(option) {
  console.log(this.name, 'atr', option);
}
// callName()
// callName.call(obj);

//**************** call ********************
// 实现方法：
//         1.新建 symbol，作为对象 key
//         2.将方法存为 key 的 value
//         3.执行完毕后删除属性
function _call(context, fn, ...arg) {
  context = context || window;

  const functionKey = Symbol();

  context[functionKey] = fn;

  const res = context[functionKey](...arg);

  delete context[functionKey];
  return res;
}
// _call(obj,callName)
// Function.prototype._call = function(context,...arg){
//   context = context || window;

//   const functionKey = Symbol();

//   context[functionKey] = this;

//   const res = context[functionKey](...arg);

//   delete context[functionKey];
//   return res;

// }






//**************** apply ********************
function _apply(context, fn, arg) {
  context = context || window;

  const functionKey = Symbol();

  context[functionKey] = fn;

  // const res = arg?.length?context[functionKey](...arg):context[functionKey]();
  const res = arg?.length
    ? context[functionKey](...arg)
    : context[functionKey]();

  delete context[functionKey];
  return res;
}
_apply(obj, callName);






//**************** bind ********************

function myBind(context, fn, ...arg) {
  context = context || {}; // 处理边界条件
  const symbolKey = Symbol();
  context[symbolKey] = fn;
  return function () {
    // 返回一个函数
    context[symbolKey](arg);
    delete context[symbolKey];
  };
}
