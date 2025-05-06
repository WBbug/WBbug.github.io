let inputNormal = document.getElementById('normal');

function ajax(content) {
  console.log('ajax request ' + content ,+new Date(),this)
}



​const ​throttleAjax = throttleSet(ajax,1000)
// ​const ​throttleAjax = myDebounce(ajax,1000)

inputNormal.addEventListener('keyup', function (e) {
​   throttleAjax(e.target.value)
})


// debounce
function debounce(fun, delay) {
  let id
  return function () {
    const context = this
      clearTimeout(id)
      id = setTimeout(function () {
          fun.call(context, arguments)
      }, delay)
  }
}



//throttle
function throttle(fun, delay) {
  let last, deferTimer
  return function () {
      let that = this;
      let _args = arguments;
      let now = +new Date();
      if (last && now < last + delay) {
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
              last = now;
              fun.apply(that, _args);
          }, delay)
      } else {
          last = now;
          fun.apply(that, _args);
      }
  }
}

//throttle-settimeout
function throttleSet(func, wait) {
  var timeout;

  return function() {
      context = this;
      args = arguments;
      if (!timeout) {
          timeout = setTimeout(function(){
              timeout = null;
              func.apply(context, args)
          }, wait)
      }

  }
}

//throttle-data
function throttleData(func, limit) { 
  //上次执行时间 
  let previous = 0; 
  return function() { 
      //当前时间 
      let now = Date.now(); 

      let context = this; 
      let args = arguments; 
      
      // 若当前时间-上次执行时间大于时间限制
      if (now - previous > limit) { 
          func.apply(context, args); 
          previous = now; 
      } 
  } 
} 



