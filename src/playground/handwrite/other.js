//********************************************
// 实现一个链式调用
// let chain = new Chain()
// chain.work().sleep(6).work().sleep(3)
// chain.work()
// chain.sleep(3)
// chain.work()
//需要结果是
// work
// 等待6ms
// work
// 等待3ms
// work
// 等待3ms
// work
class Chain {
  constructor() {
    this.queue = [];
    this.state = 0;
  }

  async run() {
    if (!this.queue.length || this.state === 1) return;
    const time = this.queue.shift();
    if (time > 0) {
      this.state = 1;
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    } else {
      console.log("work");
    }
    this.state = 0;
    this.run();
  }

  sleep(num) {
    this.queue.push(num * 1000);
    this.run();
    return this;
  }

  work() {
    this.queue.push(0);
    this.run();
    return this;
  }
}

let chain = new Chain();
chain.work().sleep(6).work().sleep(3);
chain.work();
chain.sleep(3);
chain.work();

//********************************************
// 异步任务并发调度
// 给你一组异步任务，需要x个一起执行，执行完一个去执行下一个
// 最后返回一个数组，有异常直接抛出异常
function fn(list, max) {
  const len = list.length;
  let running = 0;
  let res = [];

  function run(resolve, reject) {
    if (res.length >= len) resolve(res);

    if (!list.length || running >= max) return;
    const fnc = list.shift();
    running++;
    fnc().then((val) => {
      console.log(val, new Date());
      res.push(val);
      running--;
      run(resolve, reject);
    });
    run(resolve, reject);
  }

  return new Promise((resolve, reject) => {
    run(resolve, reject);
  });
}
console.log(new Date());

let arr = [5, 3, 3, 2];
arr = arr.map((num, index) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // console.log('index', index);
        resolve(num, index);
      }, num * 1000);
    });
  };
});

fn(arr, 2).then((val) => {
  console.log("val", val);
});

//******************************************************************************************************************
// JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善代码中Scheduler类，使得以下程序能正确输出。
// class Scheduler {
//   constructor () {
//   }
//   add(promiseCreator) {
//   }
//   start () {
//   }
// }
// const timeout = (time) => new Promise(resolve => {
//   setTimeout(resolve, time)
// })
// const scheduler = new Scheduler();
// const addTask = (time, order) => {
//   scheduler.add(() => timeout(time)).then(() => console.log(time, 'time, order', order))
// }
// addTask(1000, '1')
// addTask(500, '2')
// addTask(300, '3')
// addTask(400, '4')
// output: 2 3 1 4
// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4

class Scheduler {
  constructor() {
    this.queue = [];
    this.max = 2;
    this.current = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
    function run(resolve, reject) {
      if (this.current > this.max) return;
      this.current++;
      const fn = this.queue.shift();
      fn().then(
        (val) => {
          resolve();
          run();
        },
        (err) => {
          reject(err);
        }
      );
    }

    return new Promise((resolve, reject) => {
      run(resolve, reject);
    });
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler
    .add(() => timeout(time))
    .then(() => console.log(time, "time, order", order));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

//**************** 实现并发的调度器 ****************************

//支持并发的调度器， 最多允许2两任务进行处理
const scheduler = new Scheduler(2);
scheduler.addTask(1, "1"); // 1s后输出’1'
scheduler.addTask(2, "2"); // 2s后输出’2'
scheduler.addTask(1, "3"); // 2s后输出’3'
scheduler.addTask(1, "4"); // 3s后输出’4'
scheduler.start();

class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.number = 0;
    this.queue = [];
  }
  addTask(timeout, str) {
    this.queue.push([timeout, str]);
  }
  start() {
    if (this.number < this.limit && this.queue.length) {
      var [timeout, str] = this.queue.shift();
      this.number++;
      setTimeout(() => {
        console.log(str);
        this.number--;
        this.start();
      }, timeout * 1000);
      this.start();
    }
  }
}
