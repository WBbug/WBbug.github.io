---
title: vue3 design
pubDatetime: 2024-01-20
tags:
  - Vue
  - book
description:
  "vue design read note"
---

# 第 1 章 权衡的艺术
## 命令式和声明式
###### 命令式关注过程
```javascript
const div = document.querySelector('#app') // 获取 div
div.innerText = 'hello world' // 设置文本内容
div.addEventListener('click', () => { alert('ok') }) // 绑定点击事
件
```
###### 声明式关注结果
```html
<div @click="() => alert('ok')">hello world</div>
```
我们提供的是一个“结果”，至于如何实现这个“结果”，我们并不关心，这就像我们在告诉 Vue.js：“嘿，Vue.js，看到没，我要的就是一个div，文本内容是 hello world，它有个事件绑定，你帮我搞定吧。”至于实现该“结果”的过程，则是由 Vue.js 帮我们完成的。换句话说，Vue.js 帮我们封装了过程。因此，我们能够猜到 Vue.js 的内部实现一定是命令式的，而暴露给用户的却更加声明式。
###### 声明式代码的性能 不优于命令式代码的性能
如果我们把直接修改的性能消耗定义为 A，把找出差异的性能消
耗定义为 B，那么有：

- 命令式代码的更新性能消耗 = A
- 声明式代码的更新性能消耗 = B + A
## 1.3 虚拟 DOM 的性能到底如何
前面讲到声明式代码的更新性能消耗 = 找出差异的性能消耗+ 直接修改的性能消耗，因此，如果我们能够最小化找出差异的性能消耗，就可以让声明式代码的性能无限接近命令式代码的性能。而所谓的虚拟 DOM，就是为了最小化找出差异这一步的性能消耗而出现的。
### innerHtml 与 虚拟 DOM 性能比较
#### 创建时的比较：
innerHTML 创建页面的性能：**HTML 字符串拼接的计算量 + innerHTML 的 DOM计算量**虚拟 DOM 创建页面的性能：**创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。**可以看到，无论是纯 JavaScript 层面的计算，还是 DOM 层面的计算，其实两者**差距不大。**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700120748617-aed0b618-9095-49d2-8e68-7e20751ee1ed.png#averageHue=%23f5f5f5&clientId=u523e3aed-a27f-4&from=paste&height=297&id=ua3697ee3&originHeight=594&originWidth=1506&originalType=binary&ratio=2&rotation=0&showTitle=false&size=142117&status=done&style=none&taskId=u07571a82-8e81-44ac-bbbe-2dddbe76bc1&title=&width=753)
#### 更新时的比较
使用 innerHTML 更新页面的过程是**重新构建 HTML 字符串，再重新设置 DOM 元素的 innerHTML 属性**。而重新设置innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新的 DOM 元素。
虚拟 DOM 是如何更新页面的。它需要**重新创建 JavaScript 对象（虚拟 DOM 树），然后比较新旧虚拟 DOM，找到变化的元素并更新它**。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700120800147-3bbe8c1f-71c6-418c-a2aa-2e58a97ebfcd.png#averageHue=%23f5f5f5&clientId=u523e3aed-a27f-4&from=paste&height=234&id=ud7b21d4a&originHeight=594&originWidth=1500&originalType=binary&ratio=2&rotation=0&showTitle=false&size=131450&status=done&style=none&taskId=u8159cce7-640c-4401-b7db-97f347118a5&title=&width=591)
#### 
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1695805872655-87c55f16-5263-4c6c-bfb1-9c294097daa3.png#averageHue=%23f3f3f3&clientId=ubb8bddb5-c647-4&from=paste&height=260&id=lQaZb&originHeight=520&originWidth=1598&originalType=binary&ratio=2&rotation=0&showTitle=false&size=123727&status=done&style=none&taskId=u6882cb36-e75b-4cff-86a7-0c3a33fb83c&title=&width=799)
## 1.4 运行时和编译时
当设计一个框架的时候，我们有三种选择：纯运行时的、运行时 +编译时的或纯编译时的。
### 纯运行时
为 Render 函数提供了一个树型结构的数据对象。这里面不涉及任何额外的步骤，用户也不需要学习额外的知识。但是有一天，你的用户抱怨说：“手写树型结构的数据对象太麻烦了，而且不直观，能不能支持用类似于 HTML 标签的方式描述树型结构的数据对象呢？”你看了看现在的 Render 函数，然后回答：“抱歉，暂不支持。”实际上，我们刚刚编写的框架就是一个纯运行时的框架
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700121104213-0f4b0173-cc71-4654-9c66-52843bd2e508.png#averageHue=%23f9f9f9&clientId=u523e3aed-a27f-4&from=paste&height=215&id=ue79df2f2&originHeight=430&originWidth=1512&originalType=binary&ratio=2&rotation=0&showTitle=false&size=71646&status=done&style=none&taskId=ua0655a0e-d78b-42be-b3c5-f89250b7f5e&title=&width=756)
### 运行时 +编译时
有 compailer 函数，能把 HTML 字符串编译成树型结构的数据对象，再调用 render 函数
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700121075687-14771070-9588-4a30-a521-44a6547d7a70.png#averageHue=%23f9f8f8&clientId=u523e3aed-a27f-4&from=paste&height=236&id=u8709cf8e&originHeight=472&originWidth=1550&originalType=binary&ratio=2&rotation=0&showTitle=false&size=112974&status=done&style=none&taskId=ue8e1c915-14a2-40ae-9692-5e7895b09e8&title=&width=775)
### 纯编译时
直接编译成命令式代码
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700121165264-7a109a83-58cf-4668-9a6d-f834e2c9dec0.png#averageHue=%23f5f5f5&clientId=u523e3aed-a27f-4&from=paste&height=284&id=ua4f1e559&originHeight=568&originWidth=1162&originalType=binary&ratio=2&rotation=0&showTitle=false&size=110054&status=done&style=none&taskId=uc48802aa-c6ba-44e0-9a7f-40c5a6e344f&title=&width=581)
### 区别
首先是**纯运行时**的框架。由于它没有编译的过程，因此我们没办法分析用户提供的内容，但是如果加入编译步骤，可能就大不一样了，我们可以分析用户提供的内容，看看哪些内容未来可能会改变，哪些内容永远不会改变，这样我们就可以在编译的时候提取这些信息，然后将其传递给 Render 函数，Render 函数得到这些信息之后，就可以做进一步的优化了。
**纯编译时**，它也可以分析用户提供的内容。由于不需要任何运行时，而是直接编译成可执行的 JavaScript 代码，因此性能可能会更好，但是这种做法有损灵活性，即用户提供的内容必须编译后才能用。
# 第 2 章 框架设计的核心要素

- 所以在框架设计和开发过程中，提供友好的警告信息至关重要。如果这一点做得不好，那么很可能会经常收到用户的抱怨。
## 2.3 框架要做到良好的 Tree-Shaking

## 2.5 特性开关

- 在设计框架时，框架会给用户提供诸多特性（或功能），例如我们提供 A、B、C 三个特性给用户，同时还提供了 a、b、c 三个对应的特性开关，用户可以通过设置 a、b、c 为 true 或 false 来代表开启或关闭对应的特性，这将会带来很多益处。
   - 对于用户关闭的特性，我们可以利用 Tree-Shaking 机制让其不包含在最终的资源中。
   - 该机制为框架设计带来了灵活性，可以通过特性开关任意为框架添加新的特性，而不用担心资源体积变大。同时，当框架升级时，我们也可以通过特性开关来支持遗留 API，这样新用户可以选择不使用遗留 API，从而使最终打包的资源体积最小化。
# 第 4 章 响应系统的作用与实现
## 4.1 响应式数据与副作用函数
副作用函数指的是会产生副作用的函数
```javascript
function effect() {
  document.body.innerText = 'hello vue3'
}
```
当 effect 函数执行时，它会设置 body 的文本内容，但除了effect 函数之外的任何函数都可以读取或设置 body 的文本内容。也就是说，effect 函数的执行会直接或间接影响其他函数的执行，这时我们说 effect 函数产生了副作用。第 5 章 非原始值的响应式方案。副作用很容易产生，例如一个函数修改了全局变量，这其实也是一个副作用
```javascript
function effect() {
  // effect 函数的执行会读取 obj.text
  document.body.innerText = obj.text
}
```
当值变化后，副作用函数自动重新执行，如果能实现这个目标，那么对象 obj 就是响应式数据。
## 4.2 响应式数据的基本实现
拦截数据的读取和设置
当读取时，将函数放到桶里，当重新赋值的时候再执行桶里的函数

## 4.3 设计一个完善的响应系统
上一节了解基本概念，没有封装成函数无法对其他属性实现响应式
响应式有三个内容

- 被操作（读取）的代理对象 obj；
- 被操作（读取）的字段名 text；
- 使用 effect 函数注册的副作用函数 effectFn。

target: 原始对象；key：对象字段；effectFn：副作用函数 建立如下关系
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696952440096-7ab3242d-0fd4-4896-87a6-066800777683.png#averageHue=%23ececec&clientId=u23b91018-e4a4-4&from=paste&height=375&id=u2c9e967d&originHeight=734&originWidth=860&originalType=binary&ratio=2&rotation=0&showTitle=false&size=107169&status=done&style=none&taskId=u8aeaa6b0-a5d5-49d0-ae70-0c9f0599ade&title=&width=439)
其中Set 数据结构所存储的副作用函数集合称为 key 的**依赖集合**
使用 weakMap 有利于垃圾回收，防止内存溢出

## 4.4 分支切换与 cleanup
```javascript
const obj = new Proxy(data, { /* ... */ })

effect(function effectFn() {
  document.body.innerText = obj.ok ? obj.text : 'not'
})
```
当字段 obj.ok 的值发生变化时，代码执行的分支会跟着变化，这就是所谓的**分支切换。**
分支切换可能会产生遗留的副作用函数。拿上面这段代码来说，字段 obj.ok 的初始值为 true，这时会读取字段 obj.text 的值，会建立下面的关系
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696952737602-f8c5f03d-43da-4cf8-a217-0de1cb862395.png#averageHue=%23e9e9e9&clientId=u23b91018-e4a4-4&from=paste&height=228&id=u62a856c5&originHeight=456&originWidth=1170&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93627&status=done&style=none&taskId=u3894b8b9-c5d4-4707-b0a1-8a4e909801f&title=&width=585)
**问题**
可以看到，副作用函数 effectFn 分别被字段 data.ok 和字段data.text 所对应的依赖集合收集。当字段 obj.ok 的值修改为false，并触发副作用函数重新执行后，由于此时字段 obj.text 不会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集。
不进行处理就会导致不必要的函数（text的effectFn）执行。
**解决思路**
解决这个问题的思路很简单，每次副作用函数执行时，我们可以先把它从所有与之关联的依赖集合中删除，当副作用函数执行完毕后，会重新建立联系，但在新的联系中不会包含遗留的副作用函数
## 4.5 嵌套的 effect 与 effect 栈
effect 是可以发生嵌套的
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697035237349-d6b7cd0c-41e0-439c-bf77-8823278f5376.png#averageHue=%23f8f7f7&clientId=ufce13deb-9f2d-4&from=paste&height=119&id=u7bbd334d&originHeight=238&originWidth=1364&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29126&status=done&style=none&taskId=u2aba2b62-d0d4-4f30-8776-ab6aa3a7048&title=&width=682)
同一时刻 activeEffect 所存储的副作用函数只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆盖 activeEffect 的值，并且永远不会恢复到原来的值。
所以需要一个副作用函数栈 effectStack，在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作用函数。这样就能做到一个响应式数据只会收集直接读取其值的副作用函数，而不会出现互相影响的情况
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697035654208-687ee4cc-db5b-4b8f-a345-37c7a4861cad.png#averageHue=%23f9f8f7&clientId=ufce13deb-9f2d-4&from=paste&height=486&id=uefbd3b2c&originHeight=972&originWidth=1360&originalType=binary&ratio=2&rotation=0&showTitle=false&size=273376&status=done&style=none&taskId=u0022a6f6-e4ab-49d5-86af-4890cec7713&title=&width=680)
## 4.6 避免无限递归循环
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697035902498-9c1ead89-6039-43cc-8b09-d0a5f2f80307.png#averageHue=%23f8f8f8&clientId=ufce13deb-9f2d-4&from=paste&height=118&id=u47e1e328&originHeight=236&originWidth=1360&originalType=binary&ratio=2&rotation=0&showTitle=false&size=25548&status=done&style=none&taskId=ue90ccc02-1bbb-42ad-9bc3-1fe99b097ea&title=&width=680)
首先读取 obj.foo 的值，这会触发 track 操作，将当前副作用函数收集到“桶”中，接着将其加 1 后再赋值给 obj.foo，此时会触发 trigger 操作，即把“桶”中的副作用函数取出并执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行。这样会导致无限递归地调用自己，于是就产生了栈溢出。
## 4.7 调度执行
所谓可调度，指的是当 trigger 动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式。
用户在调用 effect 函数注册副作用函数时，可以传递第二个参数 options。它是一个对象，其中允许指定scheduler 调度函数，同时在 effect 函数内部我们需要把options 选项挂载到对应的副作用函数上：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696954626251-d6ae703f-6bfa-48f7-8788-06d336b9026d.png#averageHue=%23faf9f7&clientId=u23b91018-e4a4-4&from=paste&height=339&id=uf2357d00&originHeight=784&originWidth=1276&originalType=binary&ratio=2&rotation=0&showTitle=false&size=230722&status=done&style=none&taskId=u426740cd-7e3a-4b31-9143-51c300b2a1f&title=&width=552)
有了调度函数，我们在 trigger 函数中触发副作用函数重新执行时，就可以直接调用用户传递的调度器函数，从而把控制权交给用户
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696954644265-f57968aa-36d7-4196-b8aa-9bb381673a40.png#averageHue=%23fbf9f8&clientId=u23b91018-e4a4-4&from=paste&height=383&id=uf2fcdaa7&originHeight=766&originWidth=1282&originalType=binary&ratio=2&rotation=0&showTitle=false&size=194800&status=done&style=none&taskId=u980309a0-572d-4263-86f4-71a4ec89e77&title=&width=641)
## 4.8 计算属性 computed 与 lazy
lazy 的实现
在执行effect 函数时，进行判断options 中的lazy属性，如果 lazy 为false 才执行函数
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697033704689-590304e5-bca2-479c-be94-17d841ff8d52.png#averageHue=%23faf9f8&clientId=ufce13deb-9f2d-4&from=paste&height=391&id=u335bc236&originHeight=782&originWidth=1360&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156637&status=done&style=none&taskId=u1366f135-fc39-4f0b-84f6-bb602163bd1&title=&width=680)
不过现在我们实现的计算属性只做到了懒计算，无法对结果进行缓存，如果重复执行的话函数会被多次调用
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697033926757-2a226ca4-2fc9-49f9-a2b5-4142e92445b9.png#averageHue=%23fbfafa&clientId=ufce13deb-9f2d-4&from=paste&height=487&id=u51e599f4&originHeight=974&originWidth=1338&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197468&status=done&style=none&taskId=ufca15d88-640d-4f1e-8f82-6610706c67b&title=&width=669)
新增了两个变量 value 和 dirty，其中 value 用来缓存上一次计算的值，而 dirty 是一个标识，代表是否需要重新计算。当我们通过 sumRes.value 访问值时，只有当 dirty 为 true 时才会调用 effectFn 重新计算值，否则直接使用上一次缓存在 value 中的值。这样无论我们访问多少次 sumRes.value，都只会在第一次访问时进行真正的计算，后续访问都会直接读取缓存的 value 值。
不过修改 obj.foo或 obj.bar 的值，再访问 sumRes.value 会发现访问到的值没有发生变化，这是因为计算过后dirty一直为 false 了
我们为 effect 添加了 scheduler 调度器函数，它会在 getter函数中所依赖的响应式数据变化时执行，这样我们在 scheduler 函数内将 dirty 重置为 true，当下一次访问 sumRes.value 时，就会重新调用 effectFn 计算值，这样就能够得到预期的结果了。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697034168432-550d0a69-db01-40f5-a12b-829b83f02d73.png#averageHue=%23fbfbfb&clientId=ufce13deb-9f2d-4&from=paste&height=500&id=u0e275ce2&originHeight=1000&originWidth=1422&originalType=binary&ratio=2&rotation=0&showTitle=false&size=215176&status=done&style=none&taskId=u39330d0e-9eaa-4b08-bf6b-611055eed7f&title=&width=711)
但还有一个缺陷，它体现在当我们在另外一个 effect 中读取计算属性的值时
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697034238307-5112b9fa-28a7-4601-9900-ea7ad23a08e6.png#averageHue=%23f9f9f8&clientId=ufce13deb-9f2d-4&from=paste&height=207&id=u15c5a132&originHeight=414&originWidth=1348&originalType=binary&ratio=2&rotation=0&showTitle=false&size=76001&status=done&style=none&taskId=ue4c47eec-d8f0-46dc-b4f9-d3c85c262d8&title=&width=674)
如以上代码所示，sumRes 是一个计算属性，并且在另一个effect 的副作用函数中读取了 sumRes.value 的值。如果此时修改obj.foo 的值，我们期望副作用函数重新执行，就像我们在 Vue.js 的模板中读取计算属性值的时候，一旦计算属性发生变化就会触发重新渲染一样。但是如果尝试运行上面这段代码，会发现修改 obj.foo 的值并不会触发副作用函数的渲染，因此我们说这是一个缺陷。
分析问题的原因，我们发现，从本质上看这就是一个典型的effect 嵌套。一个计算属性内部拥有自己的 effect，并且它是懒执行的，只有当真正读取计算属性的值时才会执行。对于计算属性的getter 函数来说，它里面访问的响应式数据只会把 computed 内部的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时，就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响应式数据收集。解决办法很简单。当读取计算属性的值时，我们可以手动调用track 函数进行追踪；当计算属性依赖的响应式数据发生变化时，我们可以手动调用 trigger 函数触发响应：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697034414857-5dfd9441-9a95-4903-ab34-597e2c6dcad2.png#averageHue=%23fbfbfb&clientId=ufce13deb-9f2d-4&from=paste&height=454&id=ubc5f9514&originHeight=1104&originWidth=1400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=193644&status=done&style=none&taskId=u87ceff2a-fe3f-41b8-b04a-91f238bf231&title=&width=576)
## 4.9 watch 的实现原理
所谓 watch，其本质就是观测一个响应式数据，当数据发生变化时通知并执行相应的回调函数
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697117388298-7fdf12c7-2abc-4b7c-9209-ec67fa6614c5.png#averageHue=%23fafaf9&clientId=u0c126cbb-59cb-4&from=paste&height=528&id=ucb3c2449&originHeight=1056&originWidth=1290&originalType=binary&ratio=2&rotation=0&showTitle=false&size=368854&status=done&style=none&taskId=ub4025740-5d08-4537-84ea-f9ada82d3e4&title=&width=645)
在 watch 内部的 effect 中调用 traverse函数进行递归的读取操作，代替硬编码的方式，这样就能读取一个对象上的任意属性，从而当任意属性发生变化时都能够触发回调函数执行。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697117942291-1cf49cdf-bf39-4a6b-bf43-865ce73a9f74.png#averageHue=%23fafaf9&clientId=u0c126cbb-59cb-4&from=paste&height=583&id=u73a50afb&originHeight=1166&originWidth=1396&originalType=binary&ratio=2&rotation=0&showTitle=false&size=416902&status=done&style=none&taskId=u7d23e163-bb7e-40e5-b236-5fe4c3373f0&title=&width=698)
使用 lazy 选项创建了一个懒执行的 effect。注意上面代码中最下面的部分，我们手动调用effectFn 函数得到的返回值就是旧值，即第一次执行得到的值。当变化发生并触发 scheduler 调度函数执行时，会重新调用effectFn 函数并得到新值，这样我们就拿到了旧值与新值，接着将它们作为参数传递给回调函数 cb 就可以了。最后一件非常重要的事情是，不要忘记使用新值更新旧值：oldValue = newValue，否则在下一次变更发生时会得到错误的旧值。
## 4.10 立即执行的 watch 与回调执行时机
默认情况下，一个 watch 的回调只会在响应式数据发生变化时才执行，在 Vue.js 中可以通过选项参数 immediate 来指定回调是否需要立即执行。
仔细思考就会发现，回调函数的立即执行与后续执行本质上没有任何差别，所以我们可以把 scheduler 调度函数封装为一个通用函数，分别在初始化和变更时执行它，如以下代码所示
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697118195333-ec8ff13d-59f5-4c53-82b4-b393e0b5e3dc.png#averageHue=%23fbfbfa&clientId=u0c126cbb-59cb-4&from=paste&height=632&id=ub3a0ba96&originHeight=1264&originWidth=1382&originalType=binary&ratio=2&rotation=0&showTitle=false&size=340170&status=done&style=none&taskId=ub4158694-5429-4a81-beee-6e12895a175&title=&width=691)
## 4.11 过期的副作用
第一次修改 obj 对象的某个字段值，这会导致回调函数执行，同时发送了第一次请求 A。随着时间的推移，在请求 A 的结果返回之前，我们对 obj 对象的某个字段值进行了第二次修改，这会导致发送第二次请求 B。此时请求 A 和请求 B 都在进行中，那么哪一个请求会先返回结果呢？我们不确定，如果请求B 先于请求 A 返回结果，就会导致最终 finalData 中存储的是 A 请求的结果，但由于请求 B 是后发送的，因此我们认为请求 B 返回的数据才是“最新”的，而请求 A 则应该被视为“过期”的，所以我们希望变量finalData 存储的值应该是由请求 B 返回的结果，而非请求 A 返回的结果。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697118358800-a2ce4adc-9498-4f2b-b93d-885efe1bf280.png#averageHue=%23efefef&clientId=u0c126cbb-59cb-4&from=paste&height=378&id=u2de103a3&originHeight=756&originWidth=1238&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113272&status=done&style=none&taskId=ue3c07c9c-1e6f-49fc-baa3-c99c2752380&title=&width=619)
在 Vue.js 中，watch 函数的回调函数接收第三个参数onInvalidate，它是一个函数，类似于事件监听器，我们可以使用onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行
onInvalidate 的原理其实很简单，在 watch 内部每次检测到变更后，在副作用函数重新执行之前，会先调用我们通过 onInvalidate 函数注册的过期回调，仅此而已
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697119670805-203697cc-7364-4eb6-94ab-8397e044dbe3.png#averageHue=%23fbfbfa&clientId=u0c126cbb-59cb-4&from=paste&height=687&id=u88524914&originHeight=1186&originWidth=820&originalType=binary&ratio=2&rotation=0&showTitle=false&size=244475&status=done&style=none&taskId=ud486e1ee-c1cd-44e8-bcf5-b935ffef3d8&title=&width=475)
# 第 5 章 非原始值的响应式方案
实际上，实现响应式数据要比想象中难很多，并不是像上一章讲述的那样，单纯地拦截 get/set 操作即可。举例来说，如何拦截for...in 循环？track 函数如何追踪拦截到的 for...in 循环？类似的问题还有很多。
## 5.1 理解 Proxy 和 Reflect
代理指的是什么呢？所谓**代理**，指的是对一个对象基本语义的代理。它允许我们**拦截并重新定义**对一个对象的基本操作。
类似这种读取、设置属性值的操作，就属于基本语义的操作，即**基本操作。**既然是基本操作，那么它就可以使用 Proxy 拦截
```javascript
obj.fn()
```
**复合操作**：是由两个基本语义组成的。第一个基本语义是 get，即先通过 get 操作得到 obj.fn 属性。第二个基本语义是函数调用，即通过 get 得到 obj.fn 的值后再调用它，也就是我们上面说到的 apply。
**问题：**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697294831728-f01849d1-e04b-4b23-bda0-8abeba1058ce.png#averageHue=%23faf9f9&clientId=u5dd3883c-e3fb-4&from=paste&height=178&id=u152b0826&originHeight=356&originWidth=1534&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41876&status=done&style=none&taskId=u9c0e2703-e9dc-4d18-ad7d-372845cbea9&title=&width=767)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697294858924-0c533d5f-ceea-4074-81a0-3393bcc42903.png#averageHue=%23f7f7f7&clientId=u5dd3883c-e3fb-4&from=paste&height=108&id=u9eb7167c&originHeight=216&originWidth=1548&originalType=binary&ratio=2&rotation=0&showTitle=false&size=29278&status=done&style=none&taskId=u26d49de3-9a3f-4538-81ba-87adc78def6&title=&width=774)
对 obj.bar 生成响应式时，理想状态下 foo 变化也会触发 bar 的变化，但是不行
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697294912175-d1c34cb9-4742-46a6-830d-e2f7aa36365f.png#averageHue=%23f9f9f8&clientId=u5dd3883c-e3fb-4&from=paste&height=181&id=uecb4e431&originHeight=362&originWidth=1218&originalType=binary&ratio=2&rotation=0&showTitle=false&size=121804&status=done&style=none&taskId=u79f465a6-3f4c-4338-b252-a9a480170f7&title=&width=609)
通过 target[key] 返回属性值。其中target 是原始对象 obj，而 key 就是字符串 'bar'，所以target[key] 相当于 obj.bar。bar 函数中 this 指向的其实是原始对象 obj。所以导致错误
这时 Reflect.get 函数就派上用场了。

## 5.2 JavaScript 对象及 Proxy 的工作原理
**多态性**:不同类型的对象可能部署了相同的内部方法，却具有不同的逻辑。
#### 常规对象与异质对象
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696054827136-c14bbe44-ca29-4f95-a4db-2ef6567da067.png#averageHue=%23ede9ce&clientId=uce41d90f-d095-4&from=paste&height=244&id=ud3a1008d&originHeight=1098&originWidth=1264&originalType=binary&ratio=2&rotation=0&showTitle=false&size=314277&status=done&style=none&taskId=u8246be76-9554-4be2-ad25-dd3b0c9ea38&title=&width=281)

- 对于表 5-1 列出的对象必要的内部方法，必须使用 ECMA 规范 10.1.x 节给出的定义实现；
- 对于内部方法 [[Call]]，必须使用 ECMA 规范 10.2.1 节给出的定义实现；
- 对于内部方法 [[Construct]]，必须使用 ECMA 规范 10.2.2 节给出的定义实现。
```html
 const p = new Proxy(obj, {/* ... */})
 p:代理对象
 obj:被代理对象
```
创建代理对象时指定的拦截函数，实际上是用来自定义代理对象本身的内部方法和行为的，而不是用来指定被代理对象的内部方法和行为的。
## 5.3 如何代理 Object
前面我们使用 get 拦截函数去拦截对属性的读取操作。但在响应系统中，“读取”是一个很宽泛的概念，例如使用 in 操作符检查对象上是否具有给定的 key 也属于“读取”操作.
### 访问方式
下面列出了对一个普通对象的所有可能的读取操作。

- 访问属性：obj.foo。
- 判断对象或原型上是否存在给定的 key：key in obj。
- 使用 for...in 循环遍历对象：for (const key in obj){}
- 删除属性操作的代理
### 第一种 访问属性：obj.foo
就是对应之前写的方式
### 第二种 对于 in 操作符
in 操作符的运算结果是通过调用一个叫作 HasProperty 的抽象方法得到的。HasProperty 抽象方法的返回值是通过调用对象的内部方法 [[HasProperty]] 得到的。而[[HasProperty]] 内部方法可以在表 5-3 中找到，它对应的拦截函数名叫 has，因此我们可以通过 has 拦截函数实现对 in 操作符的代理
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697295586202-fdec3aef-4d61-4470-8ebb-b547acc0358c.png#averageHue=%23f9f8f8&clientId=u81765763-cf10-4&from=paste&height=190&id=uffd97f37&originHeight=380&originWidth=1520&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66811&status=done&style=none&taskId=udce62357-16bd-4fb8-a94a-f4fe5674a65&title=&width=760)
### 第三种 for...in 循环
源码中使用 Reflect.ownKeys(obj) 来获取只属于对象自身拥有的键。
所以，我们可以使用 ownKeys 拦截函数来拦截 Reflect.ownKeys 操作：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697295833661-de30c212-8066-498d-a7de-5333c0a9a631.png#averageHue=%23f9f8f8&clientId=u81765763-cf10-4&from=paste&height=251&id=ud78bd66c&originHeight=502&originWidth=1522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109574&status=done&style=none&taskId=ufad6fc58-b68b-4d5c-9b0b-cd8e2850f79&title=&width=761)
**ITERATE_KEY 作用**：在 set/get 中，我们可以得到具体操作的 key，但是在 ownKeys 中，我们只能拿到目标对象 target。这也很符合直觉，因为在读写属性值时，总是能够明确地知道当前正在操作哪一个属性，所以只需要在该属性与副作用函数之间建立联系即可。而 ownKeys 用来获取一个对象的所有属于自己的键值，这个操作明显不与任何具体的键进行绑定，因此我们只能够构造唯一的 key 作为标识，即 ITERATE_KEY。
触发时机：当添加属性时，我们将那些与 ITERATE_KEY 相关联的副作用函数也取出来执行就可以了
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697299184016-1b2cf8ce-d49c-4017-9316-9c198c4e45e8.png#averageHue=%23f9f8f7&clientId=u6701f733-96e8-4&from=paste&height=670&id=ube636606&originHeight=1340&originWidth=1538&originalType=binary&ratio=2&rotation=0&showTitle=false&size=342781&status=done&style=none&taskId=u52d3eece-9da5-4331-a349-7394f26b875&title=&width=769)
**问题**：当修改obj属性值的时候还会触发 for in 的副作用函数，这样会造成不必要的性能开销
而无论是添加新属性，还是修改已有的属性值，其基本语义都是 [[Set]]，我们都是通过 set 拦截函数来实现拦截的所以要想解决上述问题，当设置属性操作发生时，就需要我们在set 拦截函数内能够区分操作的类型，到底是添加新属性还是设置已有属性。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697299451019-751adf6e-b0ba-4c7a-b012-93b3b6e8d3dc.png#averageHue=%23f9f8f8&clientId=u6701f733-96e8-4&from=paste&height=411&id=ub4adc93d&originHeight=822&originWidth=1534&originalType=binary&ratio=2&rotation=0&showTitle=false&size=203844&status=done&style=none&taskId=u9c2a8e1a-bf5d-48d8-86df-883a6e90cac&title=&width=767)
我们优先使用Object.prototype.hasOwnProperty 检查当前操作的属性是否已经存在于目标对象上，如果存在，则说明当前操作类型为 'SET'，即修改属性值；否则认为当前操作类型为 'ADD'，即添加新属性。最后，我们把类型结果 type 作为第三个参数传递给 trigger 函数。
在 trigger 函数内就可以通过类型 type 来区分当前的操作类型，并且只有当操作类型 type 为 'ADD' 时，才会触发与ITERATE_KEY 相关联的副作用函数重新执行，这样就避免了不必要的性能损耗
### 删除属性操作的代理
delete 操作符的行为依赖[[Delete]] 内部方法。接着查看表 5-3 可知，该内部方法可以使用deleteProperty 拦截
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697296067319-ca890051-8d78-41a0-ad05-80b2f9734afe.png#averageHue=%23f9f8f7&clientId=u81765763-cf10-4&from=paste&height=253&id=u33260818&originHeight=764&originWidth=1518&originalType=binary&ratio=2&rotation=0&showTitle=false&size=197473&status=done&style=none&taskId=uc85acfa9-3f81-4d2c-8e25-77766c31f49&title=&width=503)
## 5.4 合理地触发响应
当值没有发生变化时，应该不需要触发响应，同时需要考虑 NaN 情况
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697299591910-4dc5ccb4-2115-44b9-999f-37eeeabe0a14.png#averageHue=%23f9f8f8&clientId=u6701f733-96e8-4&from=paste&height=401&id=u49a057c6&originHeight=802&originWidth=1522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=182401&status=done&style=none&taskId=u3aaa9f9a-78b1-471f-a10b-5a3646b9eec&title=&width=761)
使用 reactive 对 new Proxy 进行封装
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697299699456-97d36c57-29d5-480b-964f-a0db7978c065.png#averageHue=%23f9f8f8&clientId=u6701f733-96e8-4&from=paste&height=298&id=u655d6e87&originHeight=596&originWidth=1526&originalType=binary&ratio=2&rotation=0&showTitle=false&size=151078&status=done&style=none&taskId=u43a4a2d3-b6a4-46b5-a8c3-a573370024c&title=&width=763)从代码中可以看出，child 本身并没有 bar 属性，因此当访问 child.bar 时，值是从原型上继承而来的。但无论如何，既然 child 是响应式数据，那么它与副作用函数之间就会建立联系，因此当我们执行 child.bar = 2时，期望副作用函数会重新执行。但现在**执行了两次**，这会造成不必要的更新。
**出现两次的原因**：从 ecma 中发现获得对象属性时，如果对象自身不存在该属性，那么会获取对象的原型，并调用原型的 [[Get]] 方法得到最终结果。
由于child 代理的对象 obj 自身没有 bar 属性，因此会获取对象 obj 的原型，也就是 parent 对象，所以最终得到的实际上是 parent.bar的值。parent 本身也是响应式数据，因此在副作用函数中访问 parent.bar 的值时，会导致副作用函数被收集，从而也建立响应联系。
所以即 child.bar 和 parent.bar 都与副作用函数建立了响应联系。
在设置属性值的时候如果设置的属性不存在于对象上，那么会取得其原型，并调用原型的 [[Set]] 方法，也就是 parent 的 [[Set]] 内部方法。
虽然我们操作的是 child.bar，但这也会导致parent 代理对象的 set 拦截函数被执行。当 parent 代理对象的 set 拦截函数执行时，就会触发副作用函数重新执行，这就是为什么修改 child.bar的值会导致副作用函数重新执行两次。
**两次的解决**：在set 拦截函数内区分这两次更新就可以了。只需要判断 receiver 是否是 target 的代理对象即可。只有当 receiver 是target 的代理对象时才触发更新，这样就能够屏蔽由原型引起的更新了。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697341590351-fd11925e-d106-4056-bf03-8b715a41d07d.png#averageHue=%23faf9f9&clientId=u47f1c897-6eec-4&from=paste&height=343&id=u1b30a5d4&originHeight=686&originWidth=1540&originalType=binary&ratio=2&rotation=0&showTitle=false&size=139454&status=done&style=none&taskId=uf431bec7-c198-4379-bdd9-a35cb8343bb&title=&width=770)
## 5.5 浅响应与深响应
实际上，我们目前所实现的 reactive 是浅响应的。
所谓浅响应，指的是只有对象的第一层属性是响应的
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697361844584-a6fb69b1-c000-413b-beb9-ba745f4f6154.png#averageHue=%23fbfafa&clientId=u47f1c897-6eec-4&from=paste&height=481&id=u641ce615&originHeight=962&originWidth=1144&originalType=binary&ratio=2&rotation=0&showTitle=false&size=314206&status=done&style=none&taskId=ued7b6add-e796-4222-949c-095b2f62b07&title=&width=572)
## 5.6 只读和浅只读
只读本质上也是对数据对象的代理，我们同样可以使用createReactive 函数来实现。
## 5.7 代理数组
的数组就是一个异质对象，这是因为数组对象的 [[DefineOwnProperty]] 内部方法与常规对象不同。
对数组元素或属性的“读取”操作：

- 通过索引访问数组元素值：arr[0]。
- 访问数组的长度：arr.length。
- 把数组作为对象，使用 for...in 循环遍历。
- 使用 for...of 迭代遍历数组。
- 数组的原型方法，如concat/join/every/some/find/findIndex/includes等，以及其他所有不改变原数组的原型方法。
### 5.7.1 数组的索引与 length
通常情况下数组是和对象一样，但是通过索引设置数组的元素值与设置对象的属性值仍然存在根本上的不同，这是因为数组对象部署的内部方法[[DefineOwnProperty]] 不同于常规对象。内部方法 [[Set]] 其实依赖于 [[DefineOwnProperty]]，到了这里就体现出了差异。
如果**设置的索引值大于数组当前的长度，那么要更新数组的 length 属性**。所以当通过索引设置元素值 时，可能会隐式地修改 length 的属性值。因此在触发响应时，也应该触发与 length 属性相关联的副作用函数重新执行。

反过来，其实**修改数组的 length 属性也会隐式地影响数组元素**
### 5.7.2 遍历数组
**for...in**，修改length会影响遍历
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697342429596-5699c564-f507-4682-9d18-f09e44c7cff5.png#averageHue=%23f9f8f8&clientId=u47f1c897-6eec-4&from=paste&height=323&id=u768659c7&originHeight=646&originWidth=1530&originalType=binary&ratio=2&rotation=0&showTitle=false&size=156019&status=done&style=none&taskId=ub68843ee-6bbb-4d54-967c-210239827b4&title=&width=765)
for...of ，for...of 是用来遍历可迭代对象（iterable object）的
ES2015 为 JavaScript 定义了**迭代协议（iterationprotocol）**，它不是新的语法，而是一种协议。具体来说，一个对象能否被迭代，取决于该对象或者该对象的原型是否实现了 @@iterator
这里的 @@[name] 标志在 ECMAScript 规范里用来代指JavaScript **内建的 symbols 值**，例如 @@iterator 指的就是Symbol.iterator 这个值。如果一个对象实现了 Symbol.iterator 方法，那么这个对象就是可以迭代的。
迭代数组时，只需要在副作用函数与数组的长度和索引之间建立响应联系，就能够实现响应式的 for...of 迭代。
在不增加任何代码的情况下，我们也能够让数组的迭代器方法正确地工作
### 5.7.3 数组的查找方法
includes 方法并不总是按照预期工作，查找基本数据类型没问题，引用数据类型就有问题。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697342817684-d43d3d3f-a649-4b07-8fac-ae68c4292732.png#averageHue=%23f8f7f7&clientId=u47f1c897-6eec-4&from=paste&height=135&id=u2bebae5e&originHeight=270&originWidth=1542&originalType=binary&ratio=2&rotation=0&showTitle=false&size=41883&status=done&style=none&taskId=uaeb226ad-4ef5-460b-a9f2-4b9b8e04c36&title=&width=771)
这是因为每次调用reactive 函数时都会创建一个新的代理对象
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697358525615-692e7e9b-db41-4c8d-bfa6-05c7b0984074.png#averageHue=%23f7f6f5&clientId=u47f1c897-6eec-4&from=paste&height=129&id=uf047841e&originHeight=258&originWidth=1530&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63812&status=done&style=none&taskId=ue6be04b8-b48d-4b57-ab05-dde53446ec7&title=&width=765)
我们可以定义 reactiveMap，用来存储原始对象到代理对象的映射。每次调用 reactive 函数创建代理对象之前，优先检查是否已经存在相应的代理对象，如果存在，则直接返回已有的代理对象，这样就避免了为同一个原始对象多次创建代理对象的问题。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697358594159-1b68bc01-792f-4c75-898b-45527ee660f4.png#averageHue=%23f9f9f8&clientId=u47f1c897-6eec-4&from=paste&height=327&id=ued16f78d&originHeight=654&originWidth=1226&originalType=binary&ratio=2&rotation=0&showTitle=false&size=313919&status=done&style=none&taskId=u21e32b0b-e3d8-4a4e-823e-6e4cda3e564&title=&width=613)
### 5.7.4 隐式修改数组长度的原型方法
本节中我们讲解如何处理那些会隐式修改数组长度的方法，主要指的是数组的栈方法，例如 push/pop/shift/unshift。
**push**: 当调用数组的 push 方法向数组中添加元素时，既会读取数组的 length 属性值，也会设置数组的 length属性值。这会导致两个独立的副作用函数互相影响。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697358864532-0b5c04e3-a87c-48c5-8422-533f3f918659.png#averageHue=%23fafaf9&clientId=u47f1c897-6eec-4&from=paste&height=256&id=uf86b730f&originHeight=512&originWidth=1538&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86417&status=done&style=none&taskId=ub4705534-a22e-4d57-8f7f-12e5e026f7f&title=&width=769)

- 第一个副作用函数执行。在该函数内，调用 arr.push 方法向数组中添加了一个元素。我们知道，调用数组的 push 方法会间接读取数组的 length 属性。所以，当第一个副作用函数执行完毕后，会与 length 属性建立响应联系。
- 接着，第二个副作用函数执行。同样，它也会与 length 属性建立响应联系。但不要忘记，调用 arr.push 方法不仅会间接读取数组的 length 属性，还会间接设置 length 属性的值。
- 第二个函数内的 arr.push 方法的调用设置了数组的 length 属性值。于是，响应系统尝试把与 length 属性相关联的副作用函数全部取出并执行，其中就包括第一个副作用函数。问题就出在这里，可以发现，第二个副作用函数还未执行完毕，就要再次执行第一个副作用函数了。
- 第一个副作用函数再次执行。同样，这会间接设置数组的 length属性。于是，响应系统又要尝试把所有与 length 属性相关联的副作用函数取出并执行，其中就包含第二个副作用函数。
- 如此循环往复，最终导致调用栈溢出。

问题的原因是 push 方法的调用会间接读取 length 属性。所以，只要我们“屏蔽”对 length 属性的读取，从而避免在它与副作用函数之间建立响应联系，问题就迎刃而解了。这个思路是正确的，因为数组的 push 方法在语义上是修改操作，而非读取操作，所以避免建立响应联系并不会产生其他副作用。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697359081400-313f9bb3-3532-4f42-9e0f-3503a3febe7b.png#averageHue=%23f9f8f7&clientId=u47f1c897-6eec-4&from=paste&height=337&id=u2743917a&originHeight=674&originWidth=1236&originalType=binary&ratio=2&rotation=0&showTitle=false&size=337649&status=done&style=none&taskId=uf5de97ef-1a14-4e05-94fc-78a787be274&title=&width=618)
我们定义了一个标记变量 shouldTrack，它是一个布尔值，代表是否允许追踪。接着，我们重写了数组的 push 方法，利用了前文介绍的 arrayInstrumentations 对象。重写后的push 方法保留了默认行为，只不过在执行默认行为之前，先将标记变量 shouldTrack 的值设置为 false，即禁止追踪。当 push 方法的默认行为执行完毕后，再将标记变量 shouldTrack 的值还原为true，代表允许追踪。最后，我们还需要修改 track 函数，进行判断
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697359116451-f42443ff-5353-4cbb-ae39-357265a32a6d.png#averageHue=%23f8f7f7&clientId=u47f1c897-6eec-4&from=paste&height=161&id=u19dfc7a6&originHeight=322&originWidth=1542&originalType=binary&ratio=2&rotation=0&showTitle=false&size=67004&status=done&style=none&taskId=uad460c58-f570-47f5-b76b-38ca1579e03&title=&width=771)
当标记变量 shouldTrack 的值为 false 时，即禁止追踪时，track 函数会直接返回。这样，当 push 方法间接读取length 属性值时，由于此时是禁止追踪的状态，所以 length 属性与副作用函数之间不会建立响应联系。5.8 代理 Set 和 Map
## 5.8 代理 Set 和 Map
Set 类型的原型属性和方法如下。

- size：返回集合中元素的数量。
- add(value)：向集合中添加给定的值。
- clear()：清空集合。
- delete(value)：从集合中删除给定的值。
- has(value)：判断集合中是否存在给定的值。
- keys()：返回一个迭代器对象。可用于 for...of 循环，迭代器对象产生的值为集合中的元素值。values()：对于 Set 集合类型来说，keys() 与 values() 等价。
- entries()：返回一个迭代器对象。迭代过程中为集合中的每一个元素产生一个数组值 [value, value]。
- forEach(callback[, thisArg])：forEach 函数会遍历集合中的所有元素，并对每一个元素调用 callback 函数。forEach 函数接收可选的第二个参数 thisArg，用于指定callback 函数执行时的 this 值。

Map 类型的原型属性和方法如下。

- size：返回 Map 数据中的键值对数量。
- clear()：清空 Map。
- delete(key)：删除指定 key 的键值对。
- has(key)：判断 Map 中是否存在指定 key 的键值对。
- get(key)：读取指定 key 对应的值。
- set(key, value)：为 Map 设置新的键值对。
- keys()：返回一个迭代器对象。迭代过程中会产生键值对的 key值。
- values()：返回一个迭代器对象。迭代过程中会产生键值对的value 值。
- entries()：返回一个迭代器对象。迭代过程中会产生由 [key,value] 组成的数组值。
- forEach(callback[, thisArg])：forEach 函数会遍历Map 数据的所有键值对，并对每一个键值对调用 callback 函数。forEach 函数接收可选的第二个参数 thisArg，用于指定callback 函数执行时的 this 值。
### 5.8.1 如何代理 Set 和 Map
.size 报错，因为需要获取对象中的 [[SetData]] 属性，但是代理对象不存在着个内部槽，为了修复这个问题，我们需要修正访问器属性的 getter 函数执行时的 this 指向
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1697360558049-e898f6e6-ae5a-41a7-ac44-744cee4c9574.png#averageHue=%23f9f8f8&clientId=u47f1c897-6eec-4&from=paste&height=343&id=u68167fa7&originHeight=686&originWidth=1528&originalType=binary&ratio=2&rotation=0&showTitle=false&size=174011&status=done&style=none&taskId=u23a7b20b-993a-4716-af8e-a1c5ab4a4e4&title=&width=764)
我们在创建代理对象时增加了 get 拦截函数。然后检查读取的属性名称是不是 size，如果是，则在调用Reflect.get 函数时指定第三个参数为原始 Set 对象，这样访问器属性 size 的 getter 函数在执行时，其 this 指向的就是原始 Set对象而非代理对象了。由于原始 Set 对象上存在 [[SetData]] 内部槽，因此程序得以正确运行。

### 5.8.2 建立响应联系



### 5.8.3 避免污染原始数据
# 第 7 章 渲染器的设计
## 7.1 渲染器与响应系统的结合
这就是响应系统和渲染器之间的关系。我们利用响应系统的能力，自动调用渲染器完成页面的渲染和更新。这个过程与渲染器的具体实现无关，在上面给出的渲染器的实现中，仅仅设置了元素的innerHTML 内容。
## 7.2 渲染器的基本概念
我们通常使用英文 renderer 来表达“渲染器”。千万不要把 renderer和 render 弄混了，前者代表渲染器，而后者是动词，表示“渲染”。
渲染器把虚拟 DOM 节点渲染为真实 DOM 节点的过程叫作挂载，通常用英文 mount 来表达。
这里的“挂载点”其实就是一个DOM 元素，渲染器会把该 DOM 元素作为容器元素，并把内容渲染到其中。我们通常用英文 container 来表达容器。
渲染器的内容非常广泛，而用来把 vnode 渲染为真实 DOM 的 render 函数只是其中一部分。实际上，在 Vue.js 3 中，甚至连创建应用的 createApp 函数也是渲染器的一部分。
## 7.3 自定义渲染器
本节我们将以浏览器作为渲染的目标平台，编写一个渲染器，在这个过程中，看看哪些内容是可以抽象的，然后通过抽象，将浏览器特定的 API 抽离，这样就可以使得渲染器的核心不依赖于浏览器。在此基础上，我们再为那些被抽离的 API提供可配置的接口，即可实现渲染器的跨平台能力。
# 第 8 章 挂载与更新
## 8.1 挂载子节点和元素的属性
vnode.children 为字符串时，渲染成文本子节点，也可以数组，渲染成子节点
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698654677025-ee2940c7-bb72-4625-96cb-28ba5fc3c042.png#averageHue=%23fafafa&clientId=u62d91dab-ca11-4&from=paste&height=241&id=uca3963c1&originHeight=482&originWidth=1518&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58079&status=done&style=none&taskId=ua7d1c8ea-47fc-4d36-972d-0cac9472a96&title=&width=759)
先检查了 vnode.props 字段是否存在，如果存在则遍历它，并调用 setAttribute 函数将属性设置到元素上。除了使用 setAttribute 也可以直接设置属性
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698654763222-28cba94b-1649-4a1d-adf9-066e76985f73.png#averageHue=%23faf9f9&clientId=u62d91dab-ca11-4&from=paste&height=324&id=ud4b8f9c5&originHeight=648&originWidth=1528&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113612&status=done&style=none&taskId=ua90e549d-e1c4-4ec7-9ffa-4c37dbe5e83&title=&width=764)
## 8.2 HTML Attributes 与 DOM Properties
```javascript
 <input id="my-input" type="text" value="foo" />
```
HTML Attributes 指的就是定义在 HTML 标签上的属性，这里指的
就是 id="my-input"、type="text" 和 value="foo"。
HTML Attributes的作用是设置与之对应的 DOM Properties 的初始值。一旦值改变，那么 DOM Properties始终存储着当前值，而通过 getAttribute 函数得到的仍然是初始值。
当浏览器解析这段 HTML 代码后，会创建一个与之相符的 DOM 元素对象，我们可以通过 JavaScript 代码来读取该 DOM 对象。
这个 DOM 对象会包含很多**属性（properties）**  
## 8.3 正确地设置元素属性
### 处理 disable
问题：
```javascript
 <button :disabled="false">Button</button>
```
本意是不禁止 button ，但是编译虚拟节点并挂在后会将 disable 设置会 false，对于按钮来说只要 disabled 属性存在，按钮就会被禁用。与本意不一致。
所以需要特殊处理
```javascript
// 获取该 DOM Properties 的类型
 const type = typeof el[key]
 const value = vnode.props[key]
 // 如果是布尔类型，并且 value 是空字符串，则将值矫正为 true
 if (type === 'boolean' && value === '') {
 el[key] = true
 } else {
 el[key] = value
 }
```
### 处理只读
有一些 DOM Properties 是只读的，因此我们只能够通过 setAttribute 函数来设置它。
## 8.4 class 的处理
我们知道，在浏览器中为一个元素设置 class 有三种方式，即使用setAttribute、el.className 或 el.classList。那么哪一种方法的性能更好呢？
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698655713564-1c698c9c-2e01-4624-81ab-f2e5565139a9.png#averageHue=%23fbfbfb&clientId=u62d91dab-ca11-4&from=paste&height=166&id=ud7ddb9d6&originHeight=524&originWidth=1522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109266&status=done&style=none&taskId=u385809aa-f509-48f1-a399-a35726944c8&title=&width=483)
## 8.5 卸载操作
卸载操作发生在更新阶段，更新指的是，在初次挂载完成之后，后续渲染会触发更新
当 vnode 为 null，并且容器元素的container._vnode 属性存在时，我们直接通过 innerHTML 清空容器。但这么做是不严谨的，原因有三点。

- 容器的内容可能是由某个或多个组件渲染的，当卸载操作发生时，应该正确地调用这些组件的 beforeUnmount、unmounted等生命周期函数。
- 即使内容不是由组件渲染的，有的元素存在自定义指令，我们应该在卸载操作发生时正确执行对应的指令钩子函数。
- 使用 innerHTML 清空容器元素内容的另一个缺陷是，它不会移除绑定在 DOM 元素上的事件处理函数。

正确的卸载方式是，根据 vnode 对象获取与其相关联的真实DOM 元素，然后使用原生 DOM 操作方法将该 DOM 元素移除。为此，我们需要在 vnode 与真实 DOM 元素之间建立联系，修改mountElement 函数.
unmount 函数接收一个虚拟节点作为参数，并将该虚拟节点对应的真实 DOM 元素从父元素中移除。
## 8.6 区分 vnode 的类型
当新旧节点为不同标签时，例如 p => imput 先将 p 元素卸载，再将 input 元素挂载到容器中。
在真正执行更新操作之前，我们优先检查新旧 vnode 所描述的内容是否相同，如果不同，则直接调用 unmount函数将旧 vnode 卸载。这里需要注意的是，卸载完成后，我们应该将参数 n1 的值重置为 null，这样才能保证后续挂载操作正确执行。
对于不同类型的 vnode，我们需要提供不同的挂载或打补丁的处理方式。
## 8.7 事件的处理
在虚拟节点中描述事件：事件可以视作一种特殊的属性，因此我们可以约定，在 vnode.props 对象中，凡是以字符串 on 开头的属性都视作事件。
将事件添加到 DOM 元素上：只需要在 patchProps 中调用 addEventListener 函数来绑定事件即可
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698677657296-00ff32dd-aaaa-4045-9204-3ff36ce0cb7e.png#averageHue=%23f9f8f7&clientId=u89514b37-b358-4&from=paste&height=508&id=uf410773b&originHeight=1016&originWidth=2070&originalType=binary&ratio=2&rotation=0&showTitle=false&size=728044&status=done&style=none&taskId=u235535c9-966b-4ebb-a049-c820348a3ab&title=&width=1035)
还有一种性能更优的方式来完成事件更新。在绑定事件时，我们可以绑定一个伪造的事件处理函数 invoker，然后把真正的事件处理函数设置为 invoker.value属性的值。这样当更新事件的时候，我们将不再需要调用removeEventListener 函数来移除上一次绑定的事件，只需要更新invoker.value 的值即可
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698677855823-94131b38-2766-4164-bed2-70d405387a07.png#averageHue=%23faf9f8&clientId=u89514b37-b358-4&from=paste&height=546&id=ud3f8cfec&originHeight=1092&originWidth=1114&originalType=binary&ratio=2&rotation=0&showTitle=false&size=529307&status=done&style=none&taskId=ua10e6632-e2b3-4873-af73-c0eeec0dba6&title=&width=557)
事件绑定主要分为两个步骤。

- 先从 el._vei 中读取对应的 invoker，如果 invoker 不存在，则将伪造的 invoker 作为事件处理函数，并将它缓存到el._vei 属性中。
- 把真正的事件处理函数赋值给 invoker.value 属性，然后把伪造的 invoker 函数作为事件处理函数绑定到元素上。可以看到，当事件触发时，实际上执行的是伪造的事件处理函数，在其内部间接执行了真正的事件处理函数 invoker.value(e)。

一个元素不仅可以绑定多种类型的事件，并且一个事件可以有多个执行函数，所以需要重新设计数据结构。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698678074565-d103baec-5585-44e8-80f7-b36d1b9dcf2c.png#averageHue=%23fbfafa&clientId=u89514b37-b358-4&from=paste&height=354&id=u7640b2f3&originHeight=806&originWidth=1534&originalType=binary&ratio=2&rotation=0&showTitle=false&size=133365&status=done&style=none&taskId=u28263f90-6766-4d7d-9018-1403ee3dddc&title=&width=674)
使用一个数组来描述事件，数组中的每个元素都是一个独立的事件处理函数，并且这些事件处理函数都能够正确地绑定到对应元素上。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698678014048-9ce8e4d9-7291-462f-9609-231dae6f1c0e.png#averageHue=%23faf9f9&clientId=u89514b37-b358-4&from=paste&height=655&id=u37e19d99&originHeight=1310&originWidth=1420&originalType=binary&ratio=2&rotation=0&showTitle=false&size=295444&status=done&style=none&taskId=uce0fbd3e-22c6-4e9c-b18d-a3b1e0c36a0&title=&width=710)
## 8.8 事件冒泡与更新时机问题
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698681054476-b10542d7-3284-4c28-84f9-358426c61a0f.png#averageHue=%23fbfbfb&clientId=u89514b37-b358-4&from=paste&height=518&id=u6c25765d&originHeight=1282&originWidth=1564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200194&status=done&style=none&taskId=u2705132c-361b-425e-97e9-06bd30f3c10&title=&width=632)
当点击 p 元素时，绑定到它身上的 click 事件处理函数会执行，于是 bol.value 的值被改为 true。接下来的一步非常关键，由于bol 是一个响应式数据，所以当它的值发生变化时，会触发副作用函数重新执行。由于此时的 bol.value 已经变成了 true，所以在更新阶段，渲染器会为父级 div 元素绑定 click 事件处理函数。当更新完成之后，点击事件才从 p 元素冒泡到父级 div 元素。由于此时 div 元素已经绑定了 click 事件的处理函数，因此就导致父级 div 元素的 click 事件的事件处理函数也被执行
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698681091595-214dc2cc-2472-4cdb-99ea-37e6ec27a953.png#averageHue=%23e5e5e5&clientId=u89514b37-b358-4&from=paste&height=329&id=ub28216b5&originHeight=1072&originWidth=1240&originalType=binary&ratio=2&rotation=0&showTitle=false&size=167062&status=done&style=none&taskId=u3688393f-4cb4-4add-ac92-d06f072f637&title=&width=380)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698681106694-34b787c9-8b6a-4fb0-892f-cd110b1ebff0.png#averageHue=%23e5e5e5&clientId=u89514b37-b358-4&from=paste&height=345&id=u22401f30&originHeight=1040&originWidth=1320&originalType=binary&ratio=2&rotation=0&showTitle=false&size=195169&status=done&style=none&taskId=u03ccf669-2840-48d5-8098-48eb1a1fe71&title=&width=438)
由图 8-4 可以发现，事件触发的时间要早于事件处理函数被绑定的时间。这意味着当一个事件触发时，目标元素上还没有绑定相关的事件处理函数，我们可以根据这个特点来解决问题：屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698681309126-06fb6949-62c7-48c4-8e2a-1d714d390c25.png#averageHue=%23faf9f8&clientId=u89514b37-b358-4&from=paste&height=632&id=u49b852fb&originHeight=1264&originWidth=1208&originalType=binary&ratio=2&rotation=0&showTitle=false&size=586293&status=done&style=none&taskId=u35024f6a-a24d-4b9c-8cfe-2f1223c8cb5&title=&width=604)
首先，我们为伪造的事件处理函数添加了 invoker.attached 属性，用来存储事件处理函数被绑定的时间。然后，在 invoker 执行的时候，通过事件对象的 e.timeStamp 获取事件发生的时间。最后，比较两者，如果事件处理函数被绑定的时间晚于事件发生的时间，则不执行该事件处理函数
## 8.9 更新子节点
对于一个元素来说，它的子节点无非有以下三种情况。

- 没有子节点，此时 vnode.children 的值为 null。
- 具有文本子节点，此时 vnode.children 的值为字符串，代表文本的内容。
- 其他情况，无论是单个元素子节点，还是多个子节点（可能是文本和元素的混合），都可以用数组来表示。
## 8.11 Fragment
```html
<List>
  <Item></Item>
</List>

<!-- list.vue -->
<template>
  <ul>
    <slot/>
  </ul>
</template>

<!-- item.vue -->
<template>
 <li></li>
 <li></li>
 <li></li>  
</template>

```
在 vue2 中不允许使用多根节点，vue3 中就允许，主要使用了 Fragment 。与文本节点和注释节点类似，片段也没有所谓的标签名称，因此我们也需要为片段创建唯一标识，即 Fragment。
# 第 9 章 简单 Diff 算法
## 9.1 减少 DOM 操作的性能开销
新旧节点数量相同时，对比
新节点数量大于旧节点数量时，进行 mount
新节点数量小于旧节点数量时，进行 unmount


## 9.2 DOM 复用与 key 的作用
使用key
有 key 的话情况则不同，我们根据子节点的 key 属性，能够明确知道新子节点在旧子节点中的位置，这样就可以进行相应的 DOM 移动操作了。
对于key 相同的dom可以进行复用
## 9.3 找到需要移动的元素
当新旧两组子节点的节点顺序不变时，就不需要额外的移动操作，所以取反则需要移动
用该节点在旧 children 中的索引 j 与 lastIndex 进行比较，如果 j 小于lastIndex，说明当前 oldVNode 对应的真实 DOM 需要移动，否则说明不需要移动。
## 9.4 如何移动元素
如果条件 j < lastIndex 成立，则说明当前 newVNode 所对应的真实 DOM 需要移动。根据前文的分析可知，我们需要获取当前 newVNode 节点的前一个虚拟节点，即newChildren[i - 1]，然后使用 insert 函数完成节点的移动，将节点移动到前一个节点对应的真实 DOM 后面。
## 删除元素
当基本的更新结束时，我们需要遍历旧的一组子节点，然后去新的一组子节点中寻找具有相同 key 值的节点。如果找不到，则说明应该删除该节点。
# 第 10 章 双端 Diff 算法
## 双端比较的原理
双端 Diff 算法是一种同时对新旧两组子节点的两个端点进行比较的算法。因此，我们需要四个索引值，分别指向新旧两组子节点的端点
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696671331507-9ad925e0-3277-49a1-a753-29f68e0e7fc2.png#averageHue=%23eeeeee&clientId=ub8c1a985-abc8-4&from=paste&height=187&id=ue9c991cd&originHeight=690&originWidth=1444&originalType=binary&ratio=2&rotation=0&showTitle=false&size=140815&status=done&style=none&taskId=ueaba24a7-afc0-48ee-bf20-b3f57104342&title=&width=391)
双端比较的步骤
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696671419610-267bce52-52ce-4bc4-b3d5-d17df89212a7.png#averageHue=%23ededed&clientId=ub8c1a985-abc8-4&from=paste&height=224&id=u61294226&originHeight=778&originWidth=1570&originalType=binary&ratio=2&rotation=0&showTitle=false&size=176137&status=done&style=none&taskId=u9278b1b8-df0a-4afb-a05c-939c87dac1c&title=&width=453)
在双端比较中，每一轮比较都分为四个步骤，如图 10-5 中的连线所示。

- 第一步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的第一个子节点 p-4，看看它们是否相同。由于两者的key 值不同，因此不相同，不可复用，于是什么都不做。
- 第二步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的最后一个子节点 p-3，看看它们是否相同。由于两者的 key 值不同，因此不相同，不可复用，于是什么都不做。
- 第三步：比较旧的一组子节点中的第一个子节点 p-1 与新的一组子节点中的最后一个子节点 p-3，看看它们是否相同。由于两者的 key 值不同，因此不相同，不可复用，于是什么都不做。
- 第四步：比较旧的一组子节点中的最后一个子节点 p-4 与新的一组子节点中的第一个子节点 p-4。由于它们的 key 值相同，因此可以进行 DOM 复用。

第四步命中后，说明需要把 oldEndIdx 放到第一个，我们只需要以头部元素oldStartVNode.el 作为锚点，将尾部元素 oldEndVNode.el 移动到锚点前面即可。
在这一步 DOM 的移动操作完成后，接下来是比较关键的步骤，即更新索引值。由于第四步中涉及的两个索引分别是 oldEndIdx 和newStartIdx，所以我们需要更新两者的值，让它们各自朝正确的方向前进一步，并指向下一个节点。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696671975268-b803ce27-5320-4974-8800-eaa7b0c480ae.png#averageHue=%23f2f2f2&clientId=ub8c1a985-abc8-4&from=paste&height=294&id=ub4eb71f8&originHeight=1008&originWidth=1840&originalType=binary&ratio=2&rotation=0&showTitle=false&size=269466&status=done&style=none&taskId=u08b2ab63-9ee2-4fb2-af5c-3cb5219bf4d&title=&width=536)
第二步命中后，说明尾部可以复用，由于两者都处于尾部，因此不需要对真实 DOM 进行移动操作，只需要打补丁即可。
修改完成如下图
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696672095707-853a5dfb-000a-4f24-a869-d5f7aa8f0271.png#averageHue=%23f2f2f2&clientId=ub8c1a985-abc8-4&from=paste&height=339&id=u59ec6bce&originHeight=944&originWidth=1772&originalType=binary&ratio=2&rotation=0&showTitle=false&size=258348&status=done&style=none&taskId=u956f484f-696e-4fbf-adf9-81161754369&title=&width=636)
第三步命中后，说明需要把 oldStartIdx 放到 oldEndIdx 后面
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696672380063-34c66034-ca72-4560-9ade-4fb667ed9d69.png#averageHue=%23f3f3f3&clientId=ub8c1a985-abc8-4&from=paste&height=274&id=u78b3cc74&originHeight=980&originWidth=1770&originalType=binary&ratio=2&rotation=0&showTitle=false&size=265531&status=done&style=none&taskId=ubbdb3e5d-a9d7-48b6-9c01-fb1bfe6e929&title=&width=494)
第一步命中，因此不需要移动，只需要调用 patch 函数进行打补丁即可。更新后如图所示
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696672425421-72154382-36fb-461f-8add-862459e7dd0c.png#averageHue=%23f4f4f4&clientId=ub8c1a985-abc8-4&from=paste&height=418&id=u1d322a23&originHeight=836&originWidth=1788&originalType=binary&ratio=2&rotation=0&showTitle=false&size=196280&status=done&style=none&taskId=uec780b57-66e8-4724-91b8-391eb66f6e8&title=&width=894)
索引newStartIdx 和索引 oldStartIdx 的值都小于 newEndIdx 和oldEndIdx，所以循环终止，双端 Diff 算法执行完毕。
## 双端比较的优势
## 非理想状况的处理方式
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696672741880-02468c04-89b1-4330-bb52-021014cda8c7.png#averageHue=%23efefef&clientId=ub8c1a985-abc8-4&from=paste&height=217&id=u51aa1c4e&originHeight=922&originWidth=1856&originalType=binary&ratio=2&rotation=0&showTitle=false&size=215120&status=done&style=none&taskId=ub82358a7-e811-4624-9d25-cd1356b808d&title=&width=437)

在四个步骤的比较过程中，都无法找到可复用的节点，应该怎么办呢？

- 我们遍历旧的一组子节点，尝试在其中寻找与新的一组子节点的头部节点具有相同 key 值的节点，并将该节点在旧的一组子节点中的索引存储到变量 idxInOld 中。

找到后以现在的头部节点对应的真实 DOM 节点oldStartVNode.el 作为锚点参数来完成节点的移动操作。


## 10.4 添加新元素
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696673034034-915bc342-a9ff-4103-8a5f-15f384003b43.png#averageHue=%23eeeeee&clientId=ub8c1a985-abc8-4&from=paste&height=195&id=u3da922bf&originHeight=690&originWidth=1642&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172497&status=done&style=none&taskId=ud8a6761b-ed80-4d71-96bd-6360efeed87&title=&width=463)
对于理想情况和非理想状况都不管用，在旧的一组子节点中根本就没有 p-4 节点，则说明是新增
又由于 newStartVNode 节点是头部节点，因此我们应该将其作为新的头部节点进行挂载。所以，在调用 patch 函数挂载节点时，我们使用 oldStartVNode.el 作为锚点。
**另一种情况**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696673263583-abb99e9d-29f5-45ce-972b-ad5a6a72264c.png#averageHue=%23f6f6f6&clientId=ub8c1a985-abc8-4&from=paste&height=355&id=u89daac51&originHeight=922&originWidth=1678&originalType=binary&ratio=2&rotation=0&showTitle=false&size=177519&status=done&style=none&taskId=u27af56f1-8eec-4d70-b824-0dc3be4a373&title=&width=646)
如果条件 oldEndIdx <oldStartIdx && newStartIdx <= newEndIdx 成立，说明新的一组子节点中有遗留的节点需要作为新节点挂载。哪些节点是新节点呢？索引值位于 newStartIdx 和 newEndIdx 这个区间内的节点都是新节点。于是我们开启一个 for 循环来遍历这个区间内的节点并逐一挂载。挂载时的锚点仍然使用当前的头部节点oldStartVNode.el，这样就完成了对新增元素的处理。


## 10.5 移除不存在的元素
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696673383138-dc07841e-3dfa-45c0-866f-0bef74a1ff89.png#averageHue=%23f2f2f2&clientId=ub8c1a985-abc8-4&from=paste&height=183&id=u891e69cb&originHeight=588&originWidth=1632&originalType=binary&ratio=2&rotation=0&showTitle=false&size=139518&status=done&style=none&taskId=uc13ce598-6d65-4b51-9616-d8ca93c5d3e&title=&width=508)
如果满足 newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx索引值位于 oldStartIdx 和 oldEndIdx 这个区间内的节点都应该被卸载。
# 第 11 章 快速 Diff 算法
## 11.1 相同的前置元素和后置元素
不同于简单 Diff 算法和双端 Diff 算法，快速 Diff 算法包含预处理步骤，这其实是借鉴了纯文本 Diff 算法的思路。在纯文本 Diff 算法中，存在对两段文本进行预处理的过程。快速DIff就借鉴了这种思路
**增加节点的情况**
首先所有相同的前置节点，并调用 patch 函数进行打补丁，直到遇到 key 值不同的节点为止。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696673949488-2dd32a0d-3442-43cf-a2e3-58bd781001d4.png#averageHue=%23f6f6f6&clientId=ub8c1a985-abc8-4&from=paste&height=306&id=u27f62901&originHeight=790&originWidth=1210&originalType=binary&ratio=2&rotation=0&showTitle=false&size=163882&status=done&style=none&taskId=u20a71c31-7a11-4655-9ad5-395cbff4066&title=&width=468)
接下来，我们需要处理相同的后置节点。由于新旧两组子节点的数量可能不同，所以我们需要两个索引 newEnd 和 oldEnd，分别指向新旧两组子节点中的最后一个节点，再开启一个 while 循环，并从后向前遍历这两组子节点，直到遇到 key 值不同的节点为止，
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696674065388-f0fd5483-46a5-4ed9-946f-602887f955e1.png#averageHue=%23f7f7f7&clientId=ub8c1a985-abc8-4&from=paste&height=294&id=ubde6d475&originHeight=716&originWidth=1214&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138596&status=done&style=none&taskId=ub794209d-225c-416b-a215-466dedb349e&title=&width=499)
满足如下条件则判断，为新增节点

- 条件一 oldEnd < j 成立：说明在预处理过程中，所有旧子节点都处理完毕了。
- 条件二 newEnd >= j 成立：说明在预处理过后，在新的一组子节点中，仍然有未被处理的节点，而这些遗留的节点将被视作新 增节点。

首先计算锚点的索引值（即 anchorIndex） 为 newEnd + 1。如果小于新的一组子节点的数量，则说明锚点元素在新的一组子节点中，所以直接使用newChildren[anchorIndex].el 作为锚点元素；否则说明索引newEnd 对应的节点已经是尾部节点了，这时无须提供锚点元素。有了锚点元素之后，我们开启了一个 while 循环，用来遍历索引 j 和索引newEnd 之间的节点，并调用 patch 函数挂载它们。
**删除节点的情况**
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696674399170-d5ca3b94-41da-47e9-9a56-4b09fe6f68ae.png#averageHue=%23f5f5f5&clientId=ub8c1a985-abc8-4&from=paste&height=245&id=ud795b738&originHeight=658&originWidth=1344&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109474&status=done&style=none&taskId=u70b0c76b-a68f-4df9-a4ff-adb394eb753&title=&width=501)
预处理后的节点
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696674434577-51fead18-9eb0-48be-bcdc-560428e5e8aa.png#averageHue=%23f7f7f7&clientId=ub8c1a985-abc8-4&from=paste&height=244&id=uc9656a25&originHeight=646&originWidth=1238&originalType=binary&ratio=2&rotation=0&showTitle=false&size=118126&status=done&style=none&taskId=u8142e004-7a77-4583-a336-7a1cbdcf23f&title=&width=467)
满足条件 j > newEnd && j <= oldEnd 时，需要卸载，j 到 oldEnd 之间的元素
## 11.2 判断是否需要进行 DOM 移动操作
其实无论是简单 Diff 算法，还是双端 Diff 算法，抑或本章介绍的快速 Diff 算法，它们都遵循同样的处理规则：

- 判断是否有节点需要移动，以及应该如何移动；
- 找出那些需要被添加或移除的节点。

预处理后，当上述删除，新增的条件都不满足是则说明需要进行移动
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696674722640-39eea47a-9f45-4677-9b90-d65755052263.png#averageHue=%23f4f4f4&clientId=ub8c1a985-abc8-4&from=paste&height=428&id=u0136e138&originHeight=856&originWidth=1668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172883&status=done&style=none&taskId=u17d4a3a0-d2bb-4c7b-bb71-c439fe864cd&title=&width=834)
首先创建一个source数组，用来存储新的一组子节点中的节点在旧的一组子节点 中的位置索引，后面将会使用它计算出一个最长递增子列，并用 于辅助完成 DOM 移动的操作
接下来我们应该思考的是，如何判断节点是否需要移动。实际上，快速 Diff 算法判断节点是否需要移动的方法与简单 Diff 算法类似，
我们新增了两个变量 moved 和 pos。前者的初始值为 false，代表是否需要移动节点，后者的初始值为 0，代表遍历旧的一组子节点的过程中遇到的最大索引值 k。我们在讲解简单Diff 算法时曾提到，如果在遍历过程中遇到的索引值呈现递增趋势，则说明不需要移动节点，反之则需要。所以在第二个 for 循环内，我们通过比较变量 k 与变量 pos 的值来判断是否需要移动节点。除此之外，我们还需要一个数量标识，代表已经更新过的节点数 量。我们知道，已经更新过的节点数量应该小于新的一组子节点中需要更新的节点数量。一旦前者超过后者，则说明有多余的节点，我们应该将它们卸载。
```javascript
 // 省略部分代码
 } else if (j > newEnd && j <= oldEnd) {
 // 省略部分代码
 } else {
 // 构造 source 数组
 const count = newEnd - j + 1
 const source = new Array(count)
 source.fill(-1)

 const oldStart = j
 const newStart = j
 let moved = false
 let pos = 0
 const keyIndex = {}
 for(let i = newStart; i <= newEnd; i++) {
 keyIndex[newChildren[i].key] = i
 }
 // 新增 patched 变量，代表更新过的节点数量
 let patched = 0
 for(let i = oldStart; i <= oldEnd; i++) {
 oldVNode = oldChildren[i]
 // 如果更新过的节点数量小于等于需要更新的节点数量，则执行更新
 if (patched <= count) {
 const k = keyIndex[oldVNode.key]
 if (typeof k !== 'undefined') {
 newVNode = newChildren[k]
 patch(oldVNode, newVNode, container)
 // 每更新一个节点，都将 patched 变量 +1
 patched++
 source[k - newStart] = i
 if (k < pos) {
 moved = true
 } else {
 pos = k
 }
 } else {
 // 没找到
 unmount(oldVNode)
 }
 } else {
 // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的节点
 unmount(oldVNode)
 }
 }
 }
```
我们增加了 patched 变量，其初始值为 0，代表更新过的节点数量。接着，在第二个 for 循环中增加了判断patched <= count，如果此条件成立，则正常执行更新，并且每次更新后都让变量 patched 自增；否则说明剩余的节点都是多余的，于是调用 unmount 函数将它们卸载。

## 11.3 如何移动元素
**第一步**
为了进行 DOM 移动操作，我们首先要根据 source 数组计算出它的最长递增子序列。取得子序列的index数组seq
取得子序列的目的：
子序列 seq 的值为 [0, 1]，它的含义是：在新的一组子节点中，重新 编号后索引值为 0 和 1 的这两个节点在更新前后顺序没有发生变化。换句话说，重新编号后，索引值为 0 和 1 的节点不需要移动。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696688397422-32076292-cc44-492e-bc74-fd14150dbb2e.png#averageHue=%23f5f5f5&clientId=udbc43cd6-d857-4&from=paste&height=241&id=u3709166a&originHeight=670&originWidth=1504&originalType=binary&ratio=2&rotation=0&showTitle=false&size=146206&status=done&style=none&taskId=u1c068bfc-59e1-43f0-b2d0-ed836ca9ec8&title=&width=540)
**第二步**
为了完成节点的移动，我们还需要创建两个索引值 i 和 s：

- 用索引 i 指向新的一组子节点中的最后一个节点；
- 用索引 s 指向最长递增子序列中的最后一个元素。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1696688427686-2a1966a8-8ac2-43ab-8dcc-3dc8ea83ffe3.png#averageHue=%23f8f8f8&clientId=udbc43cd6-d857-4&from=paste&height=349&id=ufc2d1ac3&originHeight=876&originWidth=1364&originalType=binary&ratio=2&rotation=0&showTitle=false&size=152698&status=done&style=none&taskId=ue6fcd369-b6f0-4aca-b572-518380506ce&title=&width=543)
判断条件 i !== seq[s]，如果节点的索引i 不等于 seq[s] 的值，则说明该节点对应的真实 DOM 需要移动，否则说明当前访问的节点不需要移动，但这时变量 s 需要按照图 11-24 中箭头的方向移动，即让变量 s 递减。
如果 source[i] 的值为 -1，则说明索引为 i 的节点是全新的节点，于是我们调用 patch 函数将其挂载到容器中。这里需要注意的是，由于索引 i 是重新编号后的，因此为了得到真实索引值，我们需要计算表达式 i + newStart 的值。
接着，进行下一轮 for 循环，步骤如下。

- 第一步：source[i] 是否等于 -1？很明显，此时索引 i 的值为2，source[2] 的值等于 1，因此节点 p-2 不是全新的节点，不需要挂载它，进行下一步的判断。
- 第二步：i !== seq[s] 是否成立？此时索引 i 的值为 2，索引s 的值为 1。因此 2 !== seq[1] 成立，节点 p-2 所对应的真实DOM 需要移动。
# 第 12 章 组件的实现原理
## 12.1 渲染组件
根据 type 判断分别进行渲染
```javascript
if (typeof type === 'string') {
  // 作为普通元素处理
} else if (type === Text) {
  // 作为文本节点处理
} else if (type === Fragment) {
  // 作为片段处理
} else if (typeof type === 'object') {
  // vnode.type 的值是选项对象，作为组件来处理
  if (!n1) {
    // 挂载组件
    mountComponent(n2, container, anchor)
  } else {
    // 更新组件
    patchComponent(n1, n2, anchor)
  }
}
```
获取组件中的 render 参数，使用 render 函数进行渲染
```javascript
function mountComponent(vnode, container, anchor) {
  // 通过 vnode 获取组件的选项对象，即 vnode.type
  const componentOptions = vnode.type
  // 获取组件的渲染函数 render
  const { render } = componentOptions
  // 执行渲染函数，获取组件要渲染的内容，即 render 函数返回的虚拟 DOM
  const subTree = render()
  // 最后调用 patch 函数来挂载组件所描述的内容，即 subTree
  patch(null, subTree, container, anchor)
}
```
## 12.2 组件状态与自更新
下面的代码实现了组件自身状态的初始化：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1698681971653-c12eff83-ff34-498a-9ba9-092fbdac8565.png#averageHue=%23f7f6f5&clientId=u89514b37-b358-4&from=paste&height=246&id=u40bb4f12&originHeight=492&originWidth=1312&originalType=binary&ratio=2&rotation=0&showTitle=false&size=335404&status=done&style=none&taskId=u7917b58f-a3e6-4857-a8a5-31788b897b2&title=&width=656)
实现组件自身状态的初始化需要两个步骤：

- 通过组件的选项对象取得 data 函数并执行，然后调用reactive 函数将 data 函数返回的状态包装为响应式数据；
- 在调用 render 函数时，将其 this 的指向设置为响应式数据state，同时将 state 作为 render 函数的第一个参数传递。

如果多次修改响应式数据的值，将会导致渲染函数执行多次，这实际上是没有必要的。所以需要一个调度器，当副作用函数需要重新执行时，我们不会立即执行它，而是将它缓冲到一个微任务队列中，等到执行栈清空后，再将它从微任务队列中取出并执行。
## 12.3 组件实例与组件的生命周期
组件实例本质上就是一个状态集合（或一个对象），它维护着组件运行过程中的所有信息，例如注册到组件的生命周期函数、组件渲染的子树（subTree）、组件是否已经被挂载、组件自身的状态（data），等等。
```javascript
function mountComponent(vnode, container, anchor) {
 const componentOptions = vnode.type
 // 从组件选项对象中取得组件的生命周期函数
 const { render, data, beforeCreate, created, beforeMount,
mounted, beforeUpdate, updated } = componentOptions

 // 在这里调用 beforeCreate 钩子
 beforeCreate && beforeCreate()

 const state = reactive(data())

 const instance = {
 state,
 isMounted: false,
 subTree: null
}
 vnode.component = instance

 // 在这里调用 created 钩子
 created && created.call(state)

 effect(() => {
 const subTree = render.call(state, state)
 if (!instance.isMounted) {
 // 在这里调用 beforeMount 钩子
 beforeMount && beforeMount.call(state)
 patch(null, subTree, container, anchor)
 instance.isMounted = true
 // 在这里调用 mounted 钩子
 mounted && mounted.call(state)
 } else {
 // 在这里调用 beforeUpdate 钩子
 beforeUpdate && beforeUpdate.call(state)
 patch(instance.subTree, subTree, container, anchor)
 // 在这里调用 updated 钩子
 updated && updated.call(state)
 }
 instance.subTree = subTree
 }, { scheduler: queueJob })
 }
```
在上面这段代码中，我们首先从组件的选项对象中取得注册到组件上的生命周期函数，然后在合适的时机调用它们，这其实就是组件生命周期的实现原理。但实际上，由于可能存在多个同样的组件生命周期钩子，例如来自 mixins 中的生命周期钩子函数，因此我们通常需要将组件生命周期钩子序列化为一个数组，但核心原理不变。

## 12.4 props 与组件的被动更新
对于一个组件来说，有两部分关于 props 的内容我们需要关心：

- 为组件传递的 props 数据，即组件的 vnode.props 对象；
- 组件选项对象中定义的 props 选项，即 MyComponent.props对象。

我们将组件选项中定义的MyComponent.props 对象和为组件传递的 vnode.props 对象相结合，最终解析出组件在渲染时需要使用的 props 和 attrs 数据。这里需要注意两点。

- 在 Vue.js 3 中，没有定义在 MyComponent.props 选项中的props 数据将存储到 attrs 对象中。
- 上述实现中没有包含默认值、类型校验等内容的处理。实际上，这些内容也都是围绕 MyComponent.props 以及 vnode.props 这两个对象展开的，实现起来并不复杂。


关于 props 数据变化的问题，props 本质上是父组件的数据，当 props 发生变化时，会触发父组件重新渲染。
我们把由父组件自更新所引起的子组件更新叫作子组件的被动更新。当子组件发生被动更新时，我们需要做的是：

- 检测子组件是否真的需要更新，因为子组件的 props 可能是不变的；
- 如果需要更新，则更新子组件的 props、slots 等内容。

上面是组件被动更新的最小实现，有两点需要注意：

- 需要将组件实例添加到新的组件 vnode 对象上，即n2.component = n1.component，否则下次更新时将无法取得组件实例；
- instance.props 对象本身是浅响应的（即shallowReactive）。因此，在更新组件的 props 时，只需要设置 instance.props 对象下的属性值即可触发组件重新渲染。

实际上，要完善地实现 Vue.js 中的 props 机制，需要编写大量边界代码。但本质上来说，其原理都是根据组件的props 选项定义以及为组件传递的 props 数据来处理的。

## 12.5 setup 函数的作用与实现
在组件的整个生命周期中，setup 函数只会在被挂载时执行一次，它的返回值可以有两种情况。
(1) 返回一个函数，该函数将作为组件的 render 函数：
这种方式常用于组件不是以模板来表达其渲染内容的情况。如果组件以模板来表达其渲染的内容，那么 setup 函数不可以再返回函数，否则会与模板编译生成的渲染函数产生冲突。
(2) 返回一个对象，该对象中包含的数据将暴露给模板使用
另外，setup 函数接收两个参数。第一个参数是 props 数据对象，第二个参数也是一个对象，通常称为 setupContext
## 12.6 组件事件与 emit 的实现

## 12.7 插槽的工作原理与实现
可以看到，组件模板中的插槽内容会被编译为插槽函数，而插槽函数的返回值就是具体的插槽内容。组件 MyComponent 的模板则会被编译为如下渲染函数：
可以看到，渲染插槽内容的过程，就是调用插槽函数并渲染由其返回的内容的过程。这与 React 中 render props 的概念非常相似。
在运行时的实现上，插槽则依赖于 setupContext 中的 slots对象
# 第 13 章 异步组件与函数式组件
# 第 14 章 内建组件和模块
## 14.1 KeepAlive 组件的实现原理
首先，KeepAlive 组件的实现需要渲染器层面的支持。这是因为被KeepAlive 的组件在卸载时，我们不能真的将其卸载，否则就无法维持组件的当前状态了。正确的做法是，将被 KeepAlive 的组件从原容器搬运到另外一个隐藏的容器中，实现“假卸载”。当被搬运到隐藏容器中的组件需要再次被“挂载”时，我们也不能执行真正的挂载逻辑，而应该把该组件从隐藏容器中再搬运到原容器。这个过程对应到组件的生命周期，其实就是 activated 和 deactivated。
首先，KeepAlive 组件本身并不会渲染额外的内容，它的渲染函数最终只返回需要被 KeepAlive 的组件，我们把这个需要被 KeepAlive 的组件称为“**内部组件**”。

### 14.1.2 include 和 exclude
们根据用户指定的 include 和 exclude 正则，对“内部组件”的名称进行匹配，并根据匹配结果判断是否要对“内部组件”进行缓存。在此基础上，我们可以任意扩充匹配能力。例如，可以将include 和 exclude 设计成多种类型值，允许用户指定字符串或函数，从而提供更加灵活的匹配机制。另外，在做匹配时，也可以不限于“内部组件”的名称，我们甚至可以让用户自行指定匹配要素。但无论如何，其原理都是不变的。
### 14.1.3 缓存管理
当缓存不存在的时候，总是会设置新的缓存。这会导致缓存不断增加，极端情况下会占用大量内存。
## 
# 第 15 章 编译器核心技术概览
## 15.1 模板 DSL 的编译器
编译器其实只是一段程序，它用来将“一种语言 A”翻译成“另外一种语言 B”。其中，语言 A 通常叫作**源代码**（source code），语言 B 通常叫作**目标代码**（object code 或 target code）。编译器将源代码翻译为目标代码的过程叫作**编译**（compile）。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700204994621-6b86b30e-c1b2-4fcf-b196-1bbe93433510.png#averageHue=%23eeeeee&clientId=u3aa86125-c0ed-4&from=paste&height=190&id=ua35b946f&originHeight=380&originWidth=1564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80843&status=done&style=none&taskId=ud3d805a2-a12b-4a99-8875-fb43229ce02&title=&width=782)
对于 Vue.js 模板编译器来说，源代码就是组件的模板，而目标代码是能够在浏览器平台上运行的 JavaScript代码，或其他拥有 JavaScript 运行时的平台代码
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700207227564-4b8c32be-f904-4e9a-8565-2c85138808a3.png#averageHue=%23ececec&clientId=u3aa86125-c0ed-4&from=paste&height=320&id=uf144f750&originHeight=774&originWidth=1114&originalType=binary&ratio=2&rotation=0&showTitle=false&size=103413&status=done&style=none&taskId=u3584808d-f61e-4864-903d-4922c003f35&title=&width=460)
可以看到，Vue.js 模板编译器的目标代码其实就是渲染函数。详细而言，Vue.js 模板编译器会首先对模板进行**词法分析和语法分析**，**得到模板 AST**。接着，将**模板 AST 转换（transform）成 JavaScript AST**。最后，根据 **JavaScript AST 生成 JavaScript 代码**，即渲染函数代码。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700207283065-82a21684-6ae8-4a72-a903-b2e8b349512a.png#averageHue=%23e9e9e9&clientId=u3aa86125-c0ed-4&from=paste&height=157&id=u2f8c8cd8&originHeight=434&originWidth=1550&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81169&status=done&style=none&taskId=ub173b70f-982f-4b4a-89d1-8baf19d67af&title=&width=561)
AST 是 **abstract syntax tree** 的首字母缩写，即抽象语法树。所谓模板 AST，其实就是用来描述模板的抽象语法树。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700207345922-779a7ab0-8072-49fd-8ada-c7d891d3e05d.png#averageHue=%23f8f7f7&clientId=u3aa86125-c0ed-4&from=paste&height=115&id=u6e794b77&originHeight=230&originWidth=1522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=31447&status=done&style=none&taskId=ue4ea4160-be85-470c-b6f7-40acb273290&title=&width=761)
上述模板会转化为
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700207392943-661b58d3-2b9a-4d1e-9dc2-e9681c4010c4.png#averageHue=%23fcfbfb&clientId=u3aa86125-c0ed-4&from=paste&height=613&id=u0117f024&originHeight=1226&originWidth=1392&originalType=binary&ratio=2&rotation=0&showTitle=false&size=324507&status=done&style=none&taskId=u492402c9-1978-4740-96be-9322b1851ef&title=&width=696)
可以看到，AST 其实就是一个具有层级结构的对象。模板 AST 具有与模板同构的嵌套结构。每一棵 AST 都有一个逻辑上的根节点，其类型为 Root。模板中真正的根节点则作为 Root 节点的 children 存在。观察上面的 AST，我们可以得出如下结论。

- 不同类型的节点是通过节点的 type 属性进行区分的。例如标签 节点的 type 值为 'Element'。
-  标签节点的子节点存储在其 children 数组中。 
- 标签节点的属性节点和指令节点会存储在 props 数组中。 
- 不同类型的节点会使用不同的对象属性进行描述。例如指令节点 拥有 name 属性，用来表达指令的名称，而表达式节点拥有 content 属性，用来描述表达式的内容。

我们可以通过封装 parse 函数来完成对模板的词法分析和语法分 析，得到模板 AST
有了模板 AST 后，我们就可以对其进行语义分析，并对模板 AST 进行转换了。什么是语义分析呢？
举几个例子。 

- 检查 v-else 指令是否存在相符的 v-if 指令。 
- 分析属性值是否是静态的，是否是常量等。 
- 插槽是否会引用上层作用域的变量。

得到模板 AST 后，以封装 transform 函数来完成模板 AST 到 JavaScript AST 的转换工作
有了 JavaScript AST 后，我们就可以根据它生成渲染函数了，这一 步可以通过封装 generate 函数来完成
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700207526371-1288951c-6e01-47aa-b410-dff97866bd44.png#averageHue=%23dedede&clientId=u3aa86125-c0ed-4&from=paste&height=224&id=u05d03746&originHeight=448&originWidth=1520&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78045&status=done&style=none&taskId=ue6fc8af3-6610-41d4-af92-693a7f5442c&title=&width=760)
## 15.2 parser 的实现原理与状态机
有限状态自动机：所谓“有限状态”，就是指有限个状态，而“自动机”意味着随着字符的输入，解析器会自动地在不同状态间迁移。
根据状态机可以获取标签信息
## 15.3 构造 AST
根据 Token 列表构建 AST 的过程，其实就是对 Token 列表进行扫 描的过程。从第一个 Token 开始，顺序地扫描整个 Token 列表，直到 列表中的所有 Token 处理完毕。在这个过程中，我们需要维护一个栈 elementStack，这个栈将用于维护元素间的父子关系。每遇到一个 开始标签节点，我们就构造一个 Element 类型的 AST 节点，并将其 压入栈中。类似地，每当遇到一个结束标签节点，我们就将当前栈顶 的节点弹出。这样，栈顶的节点将始终充当父节点的角色。扫描过程 中遇到的所有节点，都会作为当前栈顶节点的子节点，并添加到栈顶 节点的 children 属性下。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25583223/1700208180336-97f1817f-a5d4-49a9-9b97-b4eafecaa018.png#averageHue=%23f3f3f3&clientId=u3aa86125-c0ed-4&from=paste&height=301&id=uffda50d3&originHeight=812&originWidth=1486&originalType=binary&ratio=2&rotation=0&showTitle=false&size=130633&status=done&style=none&taskId=u574b75d0-a0e5-47ee-8326-9d311cea142&title=&width=550)
## 15.4 AST 的转换与插件化架构
### 15.4.1 节点的访问
因为 AST 是树形结构，所以可以使用深度优先遍历进行遍历树结构
### 15.4.2 转换上下文与节点操作
添加 context 对象，设置 ast 转换时的上下文

- currentNode：用来存储当前正在转换的节点。 
- childIndex：用来存储当前节点在父节点的 children 中的位 置索引。
- parent：用来存储当前转换节点的父节点。
### 15.4.3 进入与退出
在转换 AST 节点的过程中，往往需要根据其子节点的情况来决定 如何对当前节点进行转换。这就要求父节点的转换操作必须等待其所 有子节点全部转换完毕后再执行。
## 15.5 将模板 AST 转为 JavaScript AST
为什么要将模板 AST 转换为 JavaScript AST 呢？原因我们已经多 次提到：我们需要将模板编译为渲染函数。而渲染函数是由 JavaScript 代码来描述的，因此，我们需要将模板 AST 转换为用于描述渲染函数 的 JavaScript AST。
JavaScript AST 是 JavaScript 代码的描述。所以，本质上我们需要设计一些数据结构来描述渲染函数的代码
首先，我们观察上面这段渲染函数的代码。它是一个函数声明， 所以我们首先要描述 JavaScript 中的函数声明语句。一个函数声明语句 由以下几部分组成。 

- id：函数名称，它是一个标识符 Identifier。
-  params：函数的参数，它是一个数组。 
- body：函数体，由于函数体可以包含多个语句，因此它也是一个 数组。
## 15.6 代码生成
代码生 成本质上是字符串拼接的艺术。我们需要访问 JavaScript AST 中的节 点，为每一种类型的节点生成相符的 JavaScript 代码
