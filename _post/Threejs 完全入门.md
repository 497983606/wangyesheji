<!-- 1661746029223 -->
<!-- Threejs 完全入门 -->
<!-- Threejs 完全入门关键概念和技术总结 -->
<!--  -->
<!-- Tech -->

> 做了很久的 web3D 开发，也封装了一个比较好用的库，虽然没有达到自己要求的正式版本，但也经过了几次迭代，这其中学到了很多，这里做一次比较全面的入门总结。

## 什么是 Threejs

Threejs 是对 webGL 的封装，使其变得更加符合面向对象编程的语义，并且易于 Jacascript 开发者的理解，而 webGL 是对 openGL 的 web 移植，openGL 使用汇编作为编程语言，webGL 中的一个非常核心的 `Shader` 是使用 glsl 来编写。

三维世界的基本对象是由点、线、三角形组成（三角网格），然后形状需要被放置在场景中（scene），然后场景中需要有灯光，还要设置视角相机（camera），如果视角需要通过鼠标控制运动，则还需要加上控制器。在 Threejs 中这些统一通过 renderer 逐帧渲染。

## 基本概念

<center> <img src=https://wangyesheji.cn/images/pic/threejs-1.jpg /> </center>

* [Object3d](https://threejs.org/docs/index.html#api/zh/core/Object3D)： 所有空间对象都是 threejs 的 Object3d 对象，继承了该构造函数（基类）的属性和方法 
* [渲染器 renderer](https://threejs.org/docs/#api/zh/renderers/WebGLRenderer)：它是Three.js的主要对象，场景(Scene)和摄像机(Camera)都需要传入渲染器(Renderer)中，通过它将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上
* [场景 Scene](https://threejs.org/docs/index.html#api/zh/scenes/Scene)：它就相当于一个大容器，我们需要展示的所有物体都要放入场景。在场景中子对象的位置和方向总是相对于父对象而言的，比如我移动了父对象的位置，子对象也会一起移动。
* [摄像机 camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera)：它与其他对象不同的是，它不一定要在场景图中才能起作用，它可以和场景同级。相同的是，摄像机(Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向。  
    Three.js内置几种摄像机：
    * `PerspectiveCamera` 透视相机，这一投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。
    * `CubeCamera` 立方相机，这一投影模式显示的景象是在一个立方范围内的。
	* `OrthographicCamera` 正交相机，在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。
* [几何体 geometry](https://threejs.org/docs/#api/zh/geometries/BoxGeometry)：就是球体、立方体、平面、狗、猫、人、树、建筑等物体的顶点信息。  
	Three.js内置了许多基本几何体：
    * `CubeGeometry` 立方体
	* `PlaneGeometry` 平面
	* `SphereGeometry` 球体
	* `CylinderGeometry` 圆柱体
	* `TorusGeometry` 圆环面
	* `TubeGeometry` 管道缓冲几何体
* [材质 material](https://threejs.org/docs/#api/zh/materials/Material)：和几何体同时使用，表示几何体不同面的颜色，和光亮程度。  
	Three.js内置了许多材质:
    * `MeshBasicMaterial` 基础网格材质，不受光照的影响。
	* `MeshDistanceMaterial` 通过点光源实现阴影的材质。
	* `MeshNormalMaterial` 一种把法向量映射到RGB颜色的材质。
* [灯光 light](https://threejs.org/docs/index.html?q=light#api/zh/lights/Light)：和材质配合使用，通过不同的光源来修改颜色，添加阴影等。  
	* `AmbientLight` 环境光，会均匀的照亮场景中的所有物体。
	* `DirectionalLight` 平行光，是沿着特定方向发射的光。
	* `HemisphereLight` 半球光，光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。不可以投射阴影。
	* `PointLight` 点光源，从一个点向各个方向发射的光源。可以投射阴影。
* [纹理 texture](https://threejs.org/docs/#api/zh/textures/Texture)：创建一个纹理贴图，将其应用到一个表面，或者作为反射/折射贴图。可以多个纹理同时在一个材质上使用。
* [网格 Mesh](https://threejs.org/docs/#api/zh/objects/Mesh)：需要传入几何体和材质组合为一个带有位置和方向的特殊几何体。
	> three.js中几何体是不能直接渲染的。在three.js有一种类型物体，这种类型放入场景中才能直接渲染图形。网格（Mesh）是这种类型中的一种。

* [控制器 controls](https://threejs.org/docs/index.html#examples/zh/controls/DragControls)：通过控制器可以改变与其关联的相机的位置和观察目标（position，target=lookAt）。

## 常见功能说明

常用的相机是 `PerspectiveCamera`，常用的控制器是`OrbitControls`.

### 相机

初始化一个 PerspectiveCamera 相机代码如下：
```js
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0, 10000)
    camera.name = 'mainCamera'
    camera.position.set(0,0,20)
    camera.up.set( 0,1,0 )
    camera.lookAt( 0,0,0 )
```

* lookAt：如上图所示，默认的 Threejs 坐标系是`笛卡尔坐标系`，也就是 Y 轴朝上，Z 轴像屏幕法线方向，X 轴横向向右，但需要知道相机是如何观察的，上图中有一个笑脸是正常看向 (0,0,0) 点的，也就是相机的 lookAt 为 (0,0,0)，当场景中存在控制器接管 camera ，如使用 OrbitControls 控制器，那此属性和 target 相等。
* position：相机的 position 和 lookAt 属性决定了从哪里看向哪里
* up：上图中有一个笑脸是横向的，也就是顺着 Z 轴躺着看的效果，那么也就是 Z 轴朝上，则这个时候需要设置相机的 up.set(0,0,1)，这三个参数是个向量值，最大为 1，如果某两个设置为 1 那么就是以这两个的轴的分量为向上去观察场景（scene）

### 控制器

大部分控制器就是作用相机的 position 和 lookAt 实现交互的，但有的如 `DragControls` 不是。

### 几何体
Threejs 自带了很多集合图，如 球、长方体、平面、圆平面、棱柱/锥、闭合形状…，还有对几何形状的操纵，如挤压拉伸、打孔、贝塞尔形状合并等，可以使用这些基本的几何形状创造出各种形状。


### 外部模型

Threejs 可以通过插件加载外部模型，并且转换为 Threejs Mesh 对象，通常包含多个 Mash。Threejs 支持比较好的是 fbx 和 glb 格式的模型，一般我们使用开源的 [blender](https://www.blender.org/) 去建模和压缩，以减少其三角面数量，提升加载速度。

### 换肤

每个 Mesh 都是由 geometry（几何体） 和 Material（材质）组成，我们可以动态改变任何参数，只需要在修改后执行一下 renderer ，但修改 geometry（几何体）后需要根据特定情况执行 mesh.update.updateMatrixWorld()，Threejs 的贴图非常强大，很多炫酷的东西都是通过贴图实现的，如扩散的圆圈，只要没有扫描效果都不需要用到着色器，贴图就可以搞定。

### 组

多个集合体还可以形成组，因为 Mesh 对象的旋转操作只能围绕其原型，所以很多时候我们使用将其放入组的特定位置，然后旋转组的方式改变其旋转中心。注意旋转的参数是 弧度（欧拉角），如我们要旋转 90° 那么实际上这个数字是：90 / 180 * Math.PI

### 动画
[Tween](https://tweenjs.github.io/tween.js/)，[GSAP](https://greensock.com/) 可以[补间](https://baike.baidu.com/item/%E8%A1%A5%E9%97%B4%E5%8A%A8%E7%94%BB)操作 `某个对象` 的 `某个属性` 在 `某段时间` 内按照 `某个滑动曲线` 运行，并且支持循环运动等。另外也可以逐帧改变某个属性去操作，注意使用 Clock 构造函数，保持不同帧率下相同运动大小。

### 天空

Threejs 的天空一般时使用六面无缝拼接的天空图片组成，将其作为 scene 的六个内面的贴图（scene 实际上是一个长方体），但也提供了其他实现，如 [./jsm/objects/Sky.js](https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html) 实现了真是天空和太阳的组合，但性能开销也较大。同样的也有海洋水面。

### 镜面地板

Threejs 有一个 [/jsm/objects/Reflector](https://github.com/mrdoob/three.js/blob/master/examples/webgl_mirror.html) 来将一个平面改为一个镜面，需要注意的是 clearColor 不能为透明。

### 大地坐标系（墨卡托、经纬度）
直接将坐标数值应用在 Threejs 世界中（不需要展示球体，如果使用球体场景请移步 [cesium](https://cesium.com/platform/cesiumjs/) 当然你也可以使用 [mapbox](https://www.mapbox.com/) ），请记得将 camera.up 设置为 (0,0,1)的 Z 轴朝上的视角模式

### 地形展示（刨面、等高线）
首先需要下载地形数据，一般为 DEM 数据的一个 tif 图片，使用 [geotiff](https://www.npmjs.com/package/geotiff) 加载后即可得到一个从左往右从上往下扫描的搞成数据组，然后建立一个同等大小的平面，将其三角网格数量设置为与 tif 长宽一致（各减去 1 ，是因为间隔数总比点数少一个），然后便利高程点数组去修改平面三元数组中的高程数据。如下代码示例：
```js
const rawTiff = await GeoTIFF.fromUrl( './dem.tif' );
const tifImage = await rawTiff.getImage();
// Our initial plane geometry
const geometry = new THREE.PlaneGeometry( w, h, tifImage.getWidth() - 1, tifImage.getHeight() - 1);
// Read image pixel values that each pixel corresponding a height
const data = await tifImage.readRasters({ interleave: true });
// Fill z values of the geometry
const posAttr = geometry.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
    posAttr.array[3 * i + 2] = data[i];
    if(data[i] > maxHeight) maxHeight = data[i]
    if(data[i] < minHeight) minHeight = data[i]
}

```


### 大量点绘制（雨点、雪花）
如果需要大量绘制不同大小、不同颜色、材质的点图形，则需要用到着色器，需要手动构建一个顶点存储的三元数组，然后构建一个存储颜色的三元数组（rgb）一起一个存储尺寸的数组，代码如下所示：
```js
points // [x,y,z,x,y,z,x,y,z,x,y,z]
let positions = new Float32Array( points )

colors // [r,g,b,r,g,b,r,g,b,r,g,b]
let colors = new Array( colors )

let size = [1,2,5,1,2,5]

geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geom.setAttribute('ca', new THREE.Float32BufferAttribute(colors, 3))
geom.setAttribute('size', new THREE.Float32BufferAttribute( sizes, 1 ))

// 着色器材质使用

const material = new THREE.ShaderMaterial( {
 // 顶点着色器输出点的尺寸、位置
 vertexShader:  ` 
  attribute float size;  ## 获取当前点的 size 
  attribute vec3 ca;	 ## 获取当前点的 color
  varying vec3 vColor;   ## 声明一个变量
  void main( void ) {
    vColor = ca;         ## 存储当前 color 数据到刚才的变量
    vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );   ## 存储顶点位置，为坐标系作用的视角窗口作用的 4 元对象（x,y,z,w）
    gl_Position = mvPosition;  
    gl_PointSize = size; ## 设置顶点尺寸
  }`,
 // 片源着色器输出片段颜色、材质等
 fragmentShader:`
  uniform vec3 color;   ## 获得 uv 颜色，本次未设置则为 0,0,0
  varying vec3 vColor;  ## 获得上面存储的变量
  void main() {
    vec4 color = vec4( vColor, 1.0 );  ## 转换为颜色 4 元对象（rgba）
    gl_FragColor = color; ## 设置颜色
  }`,
})

```


### 性能优化

* 材质共用
* 及时销毁网格对象，包含材质和几何体
* 减少网格面
* 合并对象和材质
* 巧妙使用着色器
* 动态加载对象
* 改造 renderer 时机
