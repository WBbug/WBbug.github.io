---
title: Canvas 
pubDatetime: 2025-5
tags:
  - JavaScript
  - others
description:
  "canvas 常用 api 和一些 tips"
---

# Canvas 介绍

[mdn](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/canvas)

```
Canvas 是 HTML5 提供的一个强大的绘图 API，允许开发者通过 JavaScript 在网页上绘制图形、动画和进行图像处理。
```

# 使用

```
可以把 canvas 想象成是一个画布，然后利用各种api在上面进行绘制。
```

### 1.创建 canvas

```html
<canvas id="myCanvas" width="500" height="300">
</canvas>
```

### 2.获取 canvas 上下文

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d'); // 获取 2D 绘图上下文
```

### 基本绘图操作

canvas 左上角为起始点

#### 绘制矩形

```javascript
// 填充矩形
ctx.fillStyle = 'red'; // 设置填充颜色
ctx.fillRect(10, 10, 100, 50); // (x, y, width, height)

// 描边矩形
ctx.strokeStyle = 'blue'; // 设置描边颜色
ctx.lineWidth = 3; // 设置线宽
ctx.strokeRect(150, 10, 100, 50);
```

#### 绘制路径

```javascript
ctx.beginPath(); // 开始新路径
ctx.moveTo(50, 50); // 移动画笔到起点
ctx.lineTo(150, 50); // 画线到
ctx.lineTo(100, 150); // 画线到
ctx.closePath(); // 闭合路径
ctx.fillStyle = 'green';
ctx.fill(); // 填充路径
ctx.stroke(); // 描边路径
```

#### 画圆

```javascript
ctx.beginPath();
ctx.arc(200, 200, 50, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
ctx.fillStyle = 'purple';
ctx.fill();
```

### 图像操作

#### 画图

```javascript
const img = new Image();
img.src = 'image.jpg';
img.onload = function() {
  ctx.drawImage(img, 0, 0); // 在(0,0)处绘制原尺寸图像
  ctx.drawImage(img, 0, 0, 100, 100); // 在(0,0)处绘制缩放为100x100的图像
};
```

#### 剪裁图像

```javascript
// 从源图像(10,10)位置裁剪50x50区域，绘制到画布(0,0)处缩放为100x100
ctx.drawImage(img, 10, 10, 50, 50, 0, 0, 100, 100);
```

# 大型图像性能优化

1. **分层渲染**：使用多个重叠的canvas元素，将静态内容和动态内容分开
2. **避免频繁状态改变**：将相同状态的绘制操作集中在一起，防止多次绘制
3. **离屏canvas**：用于**预渲染**复杂图形
   
   ```
   const offscreenCanvas = document.createElement('canvas');
   const offscreenCtx = offscreenCanvas.getContext('2d');
   // 在离屏canvas上预渲染
   ctx.drawImage(offscreenCanvas, 0, 0); // 绘制到主canvas
   ```
4. **合理使用requestAnimationFrame**：避免不必要的重绘

