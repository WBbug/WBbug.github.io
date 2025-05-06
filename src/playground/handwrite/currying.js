function currying(fn) {
    if (typeof fn !== 'function') throw TypeError('fn is not an function');
    let neededArgsLength = fn.length;
  
    return function nest(...args) {
      if (args.length >= neededArgsLength) {
        return fn(...args);
      } else {
        return (...restArgs) => {
          return nest(...args, ...restArgs);
        };
      }
    }
  }
  //********************************************
  
  function myCurrying(fn) {
    if (typeof fn !== 'function') return;
    const argLength = fn.length;
  
    return function helper(...arg) {
      if (arg.length >= argLength.length) {
        return fn(...arg);
      } else {
        return (...restArg) => {
          return helper(...arg, ...restArg);
        };
      }
    }
  
     ;
  }
  //********************************************
  
  function curry(fn) {
    // 保存预置参数
    const presetArgs = [].slice.call(arguments, 1)
    // 返回一个新函数
    function curried () {
      // 新函数调用时会继续传参
      const restArgs = [].slice.call(arguments)
      const allArgs = [...presetArgs, ...restArgs]
      return curry.call(null, fn, ...allArgs)
    }
    // 重写toString
    curried.toString = function() {
      return fn.apply(null, presetArgs)
    }
    return curried;
  }
  
  
  let sum = (a, b, c) => {
    return a + b + c;
  };
  
  let _sum = currying(sum);
  
  console.log();
  