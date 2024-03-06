---
title: Angular data
pubDatetime: 2023-11-22
tags:
  - Angular
description:
  "how angular reactive work,ngZone"
---

# 什么是变化检测？

在 Angular 中数据响应式的实现就是对于数据的变化检测。在状态发生变化后，更新视图，这种将视图和我们的数据同步的的机制就叫变化检测。

# Angular 如何执行变化检测

在 angular 中只要发生异步操作，就认为数据可能发生了变化这时候就会执行变化检测。那么他是如何执行的呢？它主要使用了Zone.js

## Zone.js

Zone.js 提供了一种称为 区域（Zone） 的机制，用于封装和拦截浏览器中的异步活动、它还提供异步生命周期的钩子 和 统一的异步错误处理机制。

Zone.js 是通过 Monkey Patching（猴子补丁）的方式来对浏览器中的常见方法和元素进行拦截，例如 setTimeout 和 HTMLElement.prototype.onclick 。Angular 在启动时会利用 zone.js 修补了几个低级浏览器 API，从而实现异步事件的捕获，并在捕获时间后调用了变化检测。

## NgZone

Zone.js 提供了一个全局区域，可以被 fork 和扩展以进一步封装/隔离异步行为，Angular 通过创建一个fork并使用自己的行为扩展它，通常来说， 在 Angular中，每个 Task 都会在 Angular 的 Zone 中运行，这个 Zone 被称为  NgZone 。一个 Angular 中只存在一个 Angular Zone，而变更检测只会由运行于这个  NgZone  中的异步操作触发。

简单的理解就是：Angular 通过 Zone.js 创建了一个自己的区域并称之为 NgZone，Angular 应用中所有的异步操作都运行在这个区域中。

## 变化检测是如何工作的？

在 Angular 中组件化是其中的一个核心，组件之间的嵌套会生成一个组件树，在组件生成的过程中 angular 会为每个组件生成一个变化检测器 changeDetector 用来记录组件的数据变化状态，由于一个 Component 会对应一个 changeDetector ，所以 changeDetector 同样也是一个树状结构的组织。

### 我们在创建一个 Angular 应用 后，Angular 会同时创建一个  ApplicationRef  的实例，这个实例代表的就是我们当前创建的这个 Angular 应用的实例。 ApplicationRef 创建的同时，会订阅 ngZone 中的  onMicrotaskEmpty  事件，在所有的微任务完成后调用所有的视图的  detectChanges()  来执行变化检测。 

[![image38b5d63098473a5d.md.png](https://img.picgo.net/2024/03/06/image38b5d63098473a5d.md.png)](https://www.picgo.net/image/image.SbRygk)

## 单项数据流

​	每次触发变化检测，都会从根组件开始，沿着整棵组件树从上到下的执行每个组件的变更检测，默认情况下，直到最后一个叶子 Component 组件完成变更检测达到稳定状态。在这个过程中，一但父组件完成变更检测以后，在下一次事件触发变更检测之前，它的子孙组件都不允许去更改父组件的变化检测相关属性状态的，这就是单向数据流。

## 变化检测策略

通过 changeDetection可以设置组件的变化检测策略（ChangeDetectionStrategy），总共有两种

- default
- onPush

### default

默认情况下，Angular 使用 ChangeDetectionStrategy.Default 变更检测策略，每次事件触发变化检测（如用户事件、计时器、XHR、promise 等）时，此默认策略都会从上到下检查组件树中的每个组件。这种对组件的依赖关系不做任何假设的保守检查方式称为**脏检查，**这种策略在我们应用组件过多时会对我们的应用产生性能的影响。

### onPush

设置为 OnPush 策略后，Angular 每次触发变化检测后会跳过该组件和该组件的所以子组件变化检测策略跳过组件树的一部分。

在  OnPush  策略下，只有以下这几种情况才会触发组件的变化检测：

- 输入值（@Input）更改
- 当前组件或子组件之一触发了事件
- 手动触发变化检测
  - detectChanges():  它会触发当前组件和子组件的变化检测
  - markForCheck()：它不会触发变化检测，但是会把当前的OnPush组件和所以的父组件为OnPush的组件 标记为需要检测状态，在当前或者下一个变化检测周期进行检测
  - ApplicationRef.tick(): 它会根据组件的变化检测策略，触发整个应用程序的更改检测
- 使用 async 管道后，observable 值发生了变化