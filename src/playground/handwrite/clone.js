// 浅拷贝
function shallowCopy(obj) {
    if (typeof obj !== 'object') return obj;
    const newObj = obj instanceof Array ? [] : {};
  
    for (let key in obj) {
      newObj[key] = obj[key];
    }
    return newObj;
  }
  
  // 深拷贝
  
  function deepClone(obj) {
    if (typeof obj !== 'object') return obj;
    let newObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
      if (typeof obj[key] !== 'object') {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deepClone(obj[key]);
      }
    }
    return newObj;
  }
  
  function deepCopy(obj) {
    const map = new Map(); //防止循环引用情况
    function helper() {
      if (typeof obj !== 'object') return obj;
      if (map.has(obj)) {
        return map.get(obj);
      }
      let newObj = obj instanceof Array ? [] : {};
      map.set(obj, newObj);
      for (let key in obj) {
        newObj[key] = typeof obj === 'object' ? deepCopy(obj[key]) : obj[key];
      }
      return newObj;
    }
    return helper();
  }
  
  // Object.prototype.sharedProp = 'shared';
  const object = {
    a: 'ssss',
  };
  const newObj = shallowCopy(object);
  // console.log(object)
  // console.log(newObj);
  