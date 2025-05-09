function gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 'result1';
  
        case 2:
          _context.next = 4;
          return 'result2';
  
        case 4:
          _context.next = 6;
          return 'result3';
  
        case 6:
        case "end":
          return _context.stop();
      }
    }
  }
  
  // 低配版context  
  var context = {
    next:0,
    prev: 0,
    done: false,
    stop: function stop () {
      this.done = true
    }
  }
  
  // 低配版invoke
  let gen = function() {
    return {
      next: function() {
        value = context.done ? undefined: gen$(context)
        done = context.done
        return {
          value,
          done
        }
      }
    }
  } 
  
  // 测试使用
  var g = gen() 
  g.next()  // {value: "result1", done: false}
  g.next()  // {value: "result2", done: false}
  g.next()  // {value: "result3", done: false}
  g.next()  // {value: undefined, done: true}
  console.log(2)