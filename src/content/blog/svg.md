---
title: Svg introduce
pubDatetime: 2024-01-05
tags:
  - svg
description:
  "Introduce svg"
---



# 介绍

​	[SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG) 是一种 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML) 语言，类似 [XHTML](https://developer.mozilla.org/zh-CN/docs/Glossary/XHTML)，可以用来绘制矢量图形，例如下面展示的图形。SVG 可以通过定义必要的线和形状来创建一个图形，也可以修改已有的位图，或者将这两种方式结合起来创建图形。图形和其组成部分可以形变（be transformed）、合成、或者通过滤镜完全改变外观。

# 基本属性

- width：画布的宽度

- height：画布的高度
- viewBox：内容区域大小，会把区域的大小放到svg定义的宽高中进行放大缩小。



# 常用标签与属性

## 矩形

```html
<rect x="10" y="10" rx="10" ry="10" width="30" height="30"/>
```

- x,y：定义左上角位置

- width：矩形宽度

- height：矩形高度

- rx：x方向的圆角半径

- ry：y方向的圆角半径

## 圆形

```html
<circle cx="25" cy="75" r="20"/>
```

- cx：中心点 x 的位置
- cy：中心点 y 的位置
- r：半径
## 椭圆

```html
<ellipse cx="75" cy="75" rx="20" ry="5"/>
```

- rx：x方向半径

- ry：y方向半径

## 路径

```html
<path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
```

- d：根据属性进行绘制路径
- fill：填充
- stroke：线条颜色
- stroke-width：线条宽度

### d

路径是一个强大的功能，d 属性中有各种关键字母可以来绘制不同的线条，可以绘制万物。后面讲介绍一下不同的命令

#### 直线命令

- M x y：将画笔移动到 x y 的位置（当m为小写时，会移动相对的距离，后续不再赘述）
- L x y : 从之前的点连接到 x y 的位置
- H x y : 水平移动（Horizon）
- V x y : 垂直方向移动（Vertical）
- Z：是否闭合

#### 曲线命令

##### 贝塞尔曲线

- C x1 y1, x2 y2, x y：以上一个点为起点，x1 y1 x2 y2为控制点，xy为终点绘制三次[贝塞尔曲线](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)。
- Q x1 y1 x y:以上一个点为起点，x1 y1 为控制点，xy为终点绘制二次贝塞尔曲线

##### 弧形

- A rx ry x-axis-rotation large-arc-flag sweep-flag x y：

  - rx ry：椭圆半径
  - xy：椭圆中心
  - x-axis-rotation：x 轴的旋转角度
  - large-arc-flag sweep-flag ：只能为0或者1，代表不同的可能

  [![image9a2fbb1e19e7bc52.png](https://img.picgo.net/2024/01/17/image9a2fbb1e19e7bc52.png)](https://www.picgo.net/image/Soyoif



参考：

- https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial
