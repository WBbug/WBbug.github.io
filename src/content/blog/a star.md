---
title: A star
pubDatetime: 2023-11-25
tags:
  - JavaScript
  - algorithm
description:
  "Introduce a star algorithm"
---

# 简介

 a 星算法主要用于寻找最短路径，它是迪杰斯特拉/迪克斯特拉（Dijkstra）算法的优化版本，下面一步一步简单介绍一下。

# BFS

Breadth First Search  广度优先搜索算法，从某点出发，向四周遍历

## 优化-提前结束

当到达目的地时，直接结束，不必计算后续内容

# Dijkstra

​	给每个点添加权重，遍历时计算到当前位置的花费，如果小，就把当前路径记录下来。

# A*

​	在进行比较时添加上启发函数，启发式函数可以计算最短路径，也可以通过计算其他值达到其他用途。

# 总结

​	Dijkstra 算法可以很好地找到最短路径，但它会浪费时间探索没有希望的方向。贪婪最佳优先搜索朝有希望的方向探索，但它可能找不到最短路径。 A* 算法同时使用距起点的实际距离和距目标的估计距离。

参考：

- https://www.redblobgames.com/pathfinding/a-star/introduction.html
