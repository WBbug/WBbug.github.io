const PENDING = "pending";
const FULLFILLED = "fullfilled";
const REJECTED = "rejected";

function isObject(argument) {
  return (
    argument && (typeof argument === "function" || typeof argument === "object")
  );
}

class MyPromise {
  constructor(excutor) {
    this.result = null;
    this.state = PENDING;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      excutor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (result) => {
    if (this.state === PENDING) {
      this.state = FULLFILLED;
      this.result = result;
      this.onFulfilledCallbacks.forEach((fn) => {
        fn(result);
      });
    }
  };

  reject = (error) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.result = error;
      this.onRejectedCallbacks.forEach((fn) => {
        fn(error);
      });
    }
  };

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = (result) => result;
    }
    if (typeof onRejected !== "function") {
      onRejected = (reason) => {
        throw reason;
      };
    }

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilledReaction);
        this.onFulfilledCallbacks.push(onRejectedReaction);
      }

      if (this.state === FULLFILLED) {
        onFulfilledReaction();
      }

      if (this.state === REJECTED) {
        onRejectedReaction();
      }

      const onFulfilledReaction = () => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.result);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      const onRejectedReaction = () => {
        setTimeout(() => {
          try {
            let x = onRejected(this.result);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
    });
    return promise2;
  }

  static resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      throw new TypeError("Chaining cycle detected for promise");
    } else if (x instanceof MyPromise) {
      x.then((y) => {
        resolvePromise(promise, y, resolve, reject);
      }, reject);
    } else if (
      x !== null &&
      (typeof x === "object" || typeof x === "function")
    ) {
      try {
        const then = x.then;
      } catch (e) {
        return reject(e);
      }

      if (typeof then === "function") {
        let called = false;

        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              resolvePromise(promise, y, resolve, reject);
            },
            (z) => {
              if (called) return;
              called = true;
              reject(z);
            }
          );
        } catch (err) {
          if (called) return;
          called = true;
          reject(err);
        }
      }
    } else {
      resolve(x);
    }
  }
}

// const promise = new Promise((resolve, reject) => {});

// const myPromise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('123');
//   });
// }).then((res)=>{
//   console.log(res)
// })

//**************** propmiseall ********************
function promiseAll(promises) {
  const length = promises.length;
  const res = Array(length).fill(0);
  let count = 0;

  return new Promise((resolve, reject) => {
    for (let index = 0; index < length; index++) {
      const promise = promises[index];
      Promise.resolve(promise)
        .then((value) => {
          res[index] = value;
          count++;
          if (count === length) {
            resolve(res);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    }
  });
}

function promiseA() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("A");
      resolve("A");
    }, 3000);
  });
}
// 方法promiseB，返回一个Promise对象
function promiseB() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("B");
      resolve("B");
    }, 1000);
  });
}

// 按照A, B的顺序添加到promise数组中
// promiseAll([promiseA(), promiseB()]).then((resolve) => {
//   console.log(resolve);
// });

//**************** promiserace ********************

function promiseRace(promises) {
  //判断参数是否是可迭代对象
  if (!promises[Symbol.iterator]) {
    throw new Error("promiseIterator must be an iterator!");
  }
  return new Promise((resolve, reject) => {
    //循环promises
    for (let promise of promises) {
      Promise.resolve(promise).then(
        (value) => {
          resolve(value);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}
