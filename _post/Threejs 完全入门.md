<!-- 1661746029223 -->
<!-- Threejs 完全入门 -->
<!-- Threejs 完全入门关键概念和技术总结 -->
<!--  -->
<!-- Tech -->

> 做了很久的 web3D 开发，也封装了一个比较好用的库，虽然没有达到自己要求的正式版本，但也经过了几次迭代，这其中学到了很多，这里做一次比较全面的总结。
## 基本概念

![](https://wangyesheji.cn/images/pic/threejs-1.jpg)

* [Object3d](https://threejs.org/docs/index.html#api/zh/core/Object3D)： 所有空间对象都是 threejs 的 Object3d 对象，继承了该构造函数（基类）的属性和方法 
* [渲染器](https://threejs.org/docs/#api/zh/renderers/WebGLRenderer)：它是Three.js的主要对象，场景(Scene)和摄像机(Camera)都需要传入渲染器(Renderer)中，通过它将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上
* [场景](https://threejs.org/docs/index.html#api/zh/scenes/Scene)：它就相当于一个大容器，我们需要展示的所有物体都要放入场景。在场景中子对象的位置和方向总是相对于父对象而言的，比如我移动了父对象的位置，子对象也会一起移动。
* [摄像机](https://threejs.org/docs/index.html#api/zh/cameras/Camera)：它与其他对象不同的是，它不一定要在场景图中才能起作用，它可以和场景同级。相同的是，摄像机(Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向。  
    Three.js内置几种摄像机：
    * `PerspectiveCamera` 透视相机，这一投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。
    * `CubeCamera` 立方相机，这一投影模式显示的景象是在一个立方范围内的。
	* `OrthographicCamera` 正交相机，在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。
* [几何体](https://threejs.org/docs/#api/zh/geometries/BoxGeometry)：就是球体、立方体、平面、狗、猫、人、树、建筑等物体的顶点信息。  
	Three.js内置了许多基本几何体：
    * `CubeGeometry` 立方体
	* `PlaneGeometry` 平面
	* `SphereGeometry` 球体
	* `CylinderGeometry` 圆柱体
	* `TorusGeometry` 圆环面
	* `TubeGeometry` 管道缓冲几何体
* [材质](https://threejs.org/docs/#api/zh/materials/Material)：和几何体同时使用，表示几何体不同面的颜色，和光亮程度。  
	Three.js内置了许多材质:
    * `MeshBasicMaterial` 基础网格材质，不受光照的影响。
	* `MeshDistanceMaterial` 通过点光源实现阴影的材质。
	* `MeshNormalMaterial` 一种把法向量映射到RGB颜色的材质。
* [灯光](https://threejs.org/docs/index.html?q=light#api/zh/lights/Light)：和材质配合使用，通过不同的光源来修改颜色，添加阴影等。  
	* `AmbientLight` 环境光，会均匀的照亮场景中的所有物体。
	* `DirectionalLight` 平行光，是沿着特定方向发射的光。
	* `HemisphereLight` 半球光，光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。不可以投射阴影。
	* `PointLight` 点光源，从一个点向各个方向发射的光源。可以投射阴影。
* [纹理](https://threejs.org/docs/#api/zh/textures/Texture)：创建一个纹理贴图，将其应用到一个表面，或者作为反射/折射贴图。可以多个纹理同时在一个材质上使用。
* [网格](https://threejs.org/docs/#api/zh/objects/Mesh)：需要传入几何体和材质组合为一个带有位置和方向的特殊几何体。
	> three.js中几何体是不能直接渲染的。在three.js有一种类型物体，这种类型放入场景中才能直接渲染图形。网格（Mesh）是这种类型中的一种。

* [控制器](https://threejs.org/docs/index.html#examples/zh/controls/DragControls)：