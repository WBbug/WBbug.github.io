const fn = new Function();
  
const res = instance(fn, Function);

console.log(res);

const myInstance = ()=>{
  
}



function instance(obj, constructor) {
    if (typeof constructor !== 'function') {
      throw new TypeError("Right-hand side of 'instanceof' is not an object");
    }
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
      return false;
    }
    let proto = Object.getPrototypeOf(obj);
    while (proto) {
      if (proto === constructor.prototype) {
        return true;
      }
      proto = Object.getPrototypeOf(proto);
    }
    return false;
  }
  
