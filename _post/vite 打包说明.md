<!-- 1683514198710 -->
<!-- vite 打包说明 -->
<!-- vite 打包说明 的前言 -->
<!--  -->
<!-- Tech -->

最近因为招到一个帮手，所以把一直落下的组件整理工作重拾起来，这次准备整理出来一套完全符合公司业务的功能套件，包含以下几个：

* 前后端统一的（根据数据库字段实例模型字典生成）快速实现增删改查的组件，设计 Form 和 Table
* 符合时序数据库的自定义统计的前后端统一组件（用代码配置实现 BI，后端实现计算和聚合，没有用到 Grphql）
* 3D 库，对已经迭代过两次的基于 Threejs 封装的 3D 数字孪生场景开发库进行重构
* 算子与任务模块，实现与上述的自定义统计组件一体的算子定义（可以配合 Python，自定义统计可以根据数据内容得出相关的微分方程或者预测曲线公式），关联、任务调度设置功能
* WebRTC 本地视频解码组件优化，这个组件实现了 web 界面的低延时 RTSP 流播放

目标现在明确了，需要用 vite 进行组件打包甚至上传到 npm 包管理平台的需求，经过仔细阅读 vite 文档，把相关方法记录在此。


### 配置 Vite

根据需求得知我需要配置集中打包模式：App（文档），增删改查组件、3D 库、BI 组件、算子与任务模块、WebRTC 模块。可以这样做，再 `package.json` 如此配置：
```json
{
  "scripts": {
    ...
    "build:lib": "set BUILD_MODE=lib&& vite build",
  },
}
```

> 这里要注意一下，`BUILD_MODE=lib&& vite build` 不要图好看写成 `BUILD_MODE=lib && vite build` 把 lib 和 && 空格开，这样就会导致 `process.env.BUILD_MODE === 'lib '`

然后再 `vite.config.js` 里面做判断，对不同的打包要求进行不同的配置，大概如下所示：

```js
if( process.env.BUILD_MODE === 'lib' ){
    config.build = {
      // 这个库打包输出的目录，可以和其他的区分开
      outDir: "lib_name", 
      lib: {
        //指定组件编译入口文件
        entry: path.resolve(__dirname, "./src/package/index.js"),
        // 打包后生成的全局变量名称 
        name: "lib_name",   
        // 打包的 js 文件名
        fileName: "lib_name",  
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ["vue"],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: "Vue",
          }
        },
      }
    }
  }
```

如果还需要 publish 到 npm 平台，就需要配置一下两个地方：`package.json` 里面根下配置 
```json
{
...
// 指定你在 import 'lib_name' 索引的文件
"main": "lib_name/lib_name.js",
}
```
因为只有一个配置，所以如果要推动到 npm 只能是一个库一个 main 说明，如果你想全部都推上去，用一个 main 可以把其他的库都挂在 `./src/package/index.js` 里面输出，具体这样写：

```js
import Table from "./table.vue";
import Form from "./form.vue";

import lib2 from "./lib2.js";
import lib3 from "./lib3.js";

const component = [Table,  Form ];

const install = App => {
	component.forEach((item) => {
		App.component(item.name, item);
	});
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}

export default {
	install,
	Table,
	Form,
  lib2,
  lib3
};
```

好了，至此一个 vite 打包的较为详细的步骤就完成了，可以开心的写代码啦~~~