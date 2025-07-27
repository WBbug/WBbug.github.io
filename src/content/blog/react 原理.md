---
title: react 原理
pubDatetime: 2025-05-02
tags:
  - react
  - javascript
description:
  "react 原理，从创建到更新"
---

## 前置知识

​	fiber ： 一种结构，双向链表对象。

​	Q:为什么要有这种结构？

​	A: 在之前更新是递归更新，当组件较多时，一次更新要把所有组件都执行一遍才行，又因为js单线程，当时没有停止的操作，所以会造成页面卡顿等情况，所以有了这种结构

​	Q:为什么有了这种结构就能减少卡顿？

​	A: 我们可以提前计算好更新花费的时间，当会阻塞渲染时，记录后面要更新的组件，因为是双向链表，记录一个就能获取全局的状态信息，当画面绘制完继续之前的更新，这样就不会造成画面卡顿。

## 初始化阶段	

​	~~从水下第一个生命的萌芽开始~~

- **初始化阶段** createRoot 创建根节点，并添加事件委托

  - createContainer

  - 创建 FiberRoot 作为 root，再创建一个 rootFiber（ fiber 节点） 付给 root.current

  - 然后通过 listenToAllSupportedEvents 进行事件的注册，这样就不用在每个组件中进行注册了

- createRoot工作做完后，调用root.render实则是调用updateContainer

  - updateContainer会通过FiberRoot获取HostRootFiber，再通过HostRootFiber获取优先级，通过优先级和当前时间创建一个update，并把编译好的App根节点赋予update.payload表示要更新的节点，然后调用enqueueUpdate初始化HostRootFiber的updatequeue，updatequeue是一个环状的链表

  - scheduleUpdateOnFiber -》ensureRootIsScheduled 这里面会进行调度更新 scheduledHostCallback

## 预**渲染阶段** 

- 调用之前的 callback performConcurrentWorkOnRoot 进行并发更新
- 其中的 renderRootSync-》prepareFreshStack  createWorkInProgress 会创建新的树 

## 渲染阶段

- performConcurrentWorkOnRoot-》renderRootConcurrent-》workLoopConcurrent -〉performUnitOfWork

- performUnitOfWork 处理当前的 fiber 节点 并返回下一个要处理的节点
- beginWork 函数从上到下处理组件，创建或更新 Fiber 节点（diff 也在这个阶段）

- 对于不同类型的组件，`**beginWork**` 会调用不同的处理函数：
- 对于函数组件：调用函数并处理 hooks
- 对于类组件：创建实例并调用生命周期方法
- 对于宿主组件（如 DOM 元素）：处理子元素

- 执行完毕后会调用completeUnitOfWork 会创建或更新实际的 DOM
- performConcurrentWorkOnRoot-》finishConcurrentRender-〉commitRoot 进入提交阶段

## commit 阶段

- 变更前

- commitBeforeMutationEffects 调用生命周期方法

- 变更

- 在这个阶段，React 会将实际的 DOM 更新应用到宿主环境： ReactFiberWorkLoop.js:3559-3575
- 对于不同类型的 Fiber 节点，React 会执行不同的变更操作： ReactFiberCommitWork.js:2057-2108

- 变更后 布局阶段

- 在这个阶段，React 会执行需要在 DOM 变更之后立即进行的操作，例如调用 `**componentDidMount**` 和 `**componentDidUpdate**` 生命周期方法：

- 提交后 处理副任务

## Hooks

### useEffect

- 初始化是在执行组件函数时（beginWork），会调用 mountEffect

  - 挂在 memoizedState 上

  - 把effect 相关数据，函数，依赖挂在到当前运行的 fiber 的 updateQueue 中，updateQueue是一个环形链表，最新的会被挂到最后

- 更新阶段会重新执行函数组件，并且调用 updateEffect

  - 会比较依赖数组是否变化：

  - 如果依赖数组没有变化，则跳过创建新的 Effect

  - 如果依赖数组变化，则创建新的 Effect 并标记需要执行（此时不会执行）

- 在提交，执行阶段，React 会遍历组件的 updateQueue.lastEffect 链表

  - 对于每个 Effect，如果它有 PassiveEffect 标志，则会在提交后异步执行

  - 执行时会调用 Effect 的 create 函数，并保存返回的清理函数

- 调度时机是 commit 之后

### useState

- 创建 memoizedState 挂到 fiber 上

- 这时会创建一个 queue，挂到hook上

  - queue: 存储状态更新的队列（如 `useState` 的 `setState` 触发的更新）。当调用 `setState` 时，新的更新会被添加到 `queue.pending` 中，等待后续处理。

  - `**pending**`：一个环形链表，存储当前未处理的更新。

  - `**interleaved**`：在并发模式下，存储被打断的更新。

  - `**lanes**`：用于优先级调度，表示更新的优先级。

  - `**lastRenderedState**`：上一次渲染时使用的状态。

- 更新阶段

  - 调用dispatch 方法

  - 创建一个 update 对象
  - 判断当前是否在更新中，是的话就回把任务加入队列
  - 若更新队列为空，尝试提前计算下一个状态。若提前计算的状态与当前状态相同，则直接返回，避免重新渲染。
  - 若是结果不同，就回把更新加入队列进行更新 enqueueConcurrentHookUpdate-》**scheduleUpdateOnFiber**
  - 当 React 开始处理这个更新时，它会执行 `**processUpdateQueue**` 函数来处理更新队列中的所有更新
  - seState 的更新，React 会使用 `**basicStateReducer**` 来计算新状态