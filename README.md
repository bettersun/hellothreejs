# Three.js 入门小技巧

### 官方网站

官方文档：
https://threejs.org/docs/index.html
可进入后切换到中文文档。
官方文档中API已相对完整。
场景中需要的灯光、几何体、材质等都有相关说明。

官方示例：
https://threejs.org/examples/

### 坐标系

简单可理解为：X轴向右，Y轴向上，Z轴向外。
坐标原点为 (X, Y, Z) : (0, 0, 0)

http://www.mamicode.com/info-detail-2104493.html

### 位置

所有物体的默认位置都是坐标原点 (0, 0, 0);

### 旋转

旋转的值是弧度
> 角度 = 弧度 * 2 * PI

0.25 * 2 * PI ： 即旋转1/4圈（90度）

### 材质

> MeshBasicMaterial：对光照无感，给几何体一种简单的颜色或显示线框。
MeshLambertMaterial：这种材质对光照有反应，用于创建暗淡的不发光的物体。
MeshPhongMaterial：这种材质对光照也有反应，用于创建金属类明亮的物体。
参考： https://www.cnblogs.com/xulei1992/p/5737138.html

### 运行示例
1. 在目录下用NodeJS安装anywhere。  

```
npm i -g anywhere
```
或者
```
yarn add global anywhere
```

2. 在目录下运行anywhere。  

```
anywhere
```

### 小技巧

1 场景最好添加一个参照平面，如地面，桌面之类的平面。
  其它物体以此平面为参照添加或调整。
  平面的Y轴不一定要在坐标原点的Y轴。
2 物体的组合在坐标原点组合好，再移动位置。
  物体间的位置使用相对位置计算好。
3 需要旋转的物体，如果也需要改变位置的话，先旋转再改变位置调整起来会比较直观。
4 使用ThreeBSP.js组合物体，会以参与计算的第一个物体的坐标位置作为整个物体的坐标位置。
5 同一颜色或同一材质的部分可合并成一个物体。
6 同一物体可由不同物体多种形式组合，可权衡采用计算最少、调整最少的组合。
