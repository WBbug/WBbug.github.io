// 扁平化数组
//************************ reduce *********************************
function myReduceFlat(arr, deep = 0) {
    if (deep <= 0) return arr;
    return arr.reduce((res, cur) => {
      return res.concat(Array.isArray(cur) ? myReduceFlat(cur, deep - 1) : cur);
    }, []);
  }
  
  //************************ concat *********************************
  function myConcatFlat(arr, deep) {
    const result = []; // 缓存递归结果
    // 开始递归
    (function flat(arr, depth) {
      // forEach 会自动去除数组空位
      arr.forEach((item) => {
        // 控制递归深度
        if (Array.isArray(item) && depth > 0) {
          // 递归数组
          flat(item, depth - 1)
        } else {
          // 缓存元素
          result.push(item)
        }
      })
    })(arr, depth)
    // 返回递归结果
    return result;
  }
  
  const forFlat = (arr = [], depth = 1) => {
    const result = [];
    (function flat(arr, depth) {
      for (let item of arr) {
        if (Array.isArray(item) && depth > 0) {
          flat(item, depth - 1)
        } else {
          // 去除空元素，添加非 undefined 元素
          item !== void 0 && result.push(item);
        }
      }
    })(arr, depth)
    return result;
  }
  
  //************************ example *********************************
  
  const arr1 = [
    123,
    123,
    [123, [123, [123, 1, [23232332], 23, 123, 123], 123123]],
    12333,
    4231,
    12323,
  ];
  
  // console.log(arr1.flat(Infinity))
  console.log(myReduceFlat(arr1, Infinity));
  