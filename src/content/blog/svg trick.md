---
title: Svg tricks
pubDatetime: 2024-01-17
tags:
  - svg
description:
  "some tricks used in plait"
---

## 优化

- 只修改属性，防止页面发生重排
- 使用 transform 进行位移，统一移动，不用每次修改 d
- 使用defs，把多次使用的图形放到 defs 中进行复用，再通过 use 标签进行使用
- 使用 requestAnimationFrame ，每一帧之前完成操作，优化页面速度



## 技巧

### 剪裁

#### <clipPath>

```html
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <clipPath id="myClip" clipPathUnits="objectBoundingBox">
    <circle cx=".5" cy=".5" r=".5" />
  </clipPath>

  <!-- 左上：应用自定义的剪切路径 -->
  <rect
    x="1"
    y="1"
    width="8"
    height="8"
    stroke="green"
    clip-path="url(#myClip)" />
</svg>
```

- clipPath：定义显示区域
- 使用时使用 clip-path 属性加上id

#### <mask>

```
<svg viewBox="-10 -10 120 120">
  <mask id="myMask">
    <!-- 白色像素下的所有内容都将可见 -->
    <rect x="0" y="0" width="100" height="100" fill="white" />
    <!-- 黑色像素下的所有内容都将不可见 -->
    <path
      d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z"
      fill="black" />
  </mask>

  <!-- 应用此蒙版后，我们在圆圈中“打”一个心形孔 -->
  <circle cx="50" cy="50" r="50" mask="url(#myMask)" />
</svg>
```

- mask：定义遮罩，和裁剪内容
- 使用 mask 属性，应用先前定义的 mask id

