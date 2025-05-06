// 原型链继承
// function Parent(){
//   this.name = 'david'
// }

// Parent.prototype.callName = function(){
//   console.log(this.name)
// }

// function Child(){
// }

// Child.prototype = new Parent()
// Child.prototype.constructor = Child

// const child1 = new Child()
// child1.callName()

// 借用构造函数(经典继承)
// function Parent(){
//   this.name = 'david'
// }

// function Child(){
//     Parent.call(this)
// }

// const child = new Child()

// console.log(child)

//组合继承

function Parent(){
    this.name = 'david'
  }
  
  function Child(){
    Parent.call(this);
  }
  
  Child.prototype  =  new Parent()
  Child.prototype.constructor = Child
  
  //**************** 组合寄生式继承 ********************
  
  
  function Parent(){
    this.name = 'david'
  }
  
  function Child(arg){
    Parent.call(this, arg);
  }
  
  Child.prototype = Object.create(Parent.prototype)
  Child.prototype.constructor = Child
  
  