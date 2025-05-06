class EventEmitter{
    constructor(){
        this._events = {};
    }
  // 监听事件
    on(eventName, callback){
        if(this._events[eventName]){
            if(this.eventName !== "newListener"){
                this.emit("newListener", eventName)
            }
        }
        const callbacks = this._events[eventName] || [];
        callbacks.push(callback);
        this._events[eventName] = callbacks
    }
  // 执行事件
  
    emit(eventName, ...args){
        const callbacks = this._events[eventName] || [];
        callbacks.forEach(cb => cb(...args))
    }
  
  // 执行一次事件
    once(eventName, callback){
        const one = (...args)=>{
            callback(...args)
            this.off(eventName, one)
        }
        one.initialCallback = callback;
        this.on(eventName, one)
    }
  // 取消订阅事件
  
     off(eventName, callback){
        const callbacks = this._events[eventName] || []
        const newCallbacks = callbacks.filter(fn => fn != callback && fn.initialCallback != callback /* 用于once后，取消once的取消订阅 */)
        this._events[eventName] = newCallbacks;
    }
  }
  
  
  const e = new EventEmitter()
  function fn(){}
  function fn2(){}
  e.once('event', fn)
  e.off('event', fn)
  // e.emit('event')
  
  
  console.log(e)