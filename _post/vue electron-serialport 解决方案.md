<!-- 1616093040000 -->
<!-- vue electron-serialport 解决方案 -->
<!-- 工作中有使用到 electron 与硬件进行串口通信，所以调研了一下，好多次了，各个版本变化还是比较大的，这里记录一下一种可行的操作 -->
<!--  -->
<!-- Tech -->
# 安装 electron 

正常使用 cli 安装 vue，然后使用
``` bash
vue add electron-builder
```
命令为 cli 安装插件，这个时候这个插件就会在目录下创建一堆文件并且改变文件夹

然后在项目根目录下创建 `.npmrc`文件，在里面粘贴，原因可参见这篇文章：` https://segmentfault.com/q/1010000007594059 `
``` bash
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
electron_mirror=http://npm.taobao.org/mirrors/electron/
```
然后 install 推荐使用 yarn
# serialport 支持
如果项目中有用到 serialport （各版本差异比较大，注意api），在`vue.config.js` 里面增加
```js
...
pluginOptions: {
  electronBuilder: {
    externals: ['serialport'],
...
```

PS：一个比较完整的打包配置

```js
electronBuilder: {
  // List native deps here if they don't work
  externals: ['serialport'],
  nodeModulesPath: ['../../node_modules', './node_modules'],
  builderOptions: {
        appId: "com.oceanx.app",
        productName: "LagrangeSingle", //项目名，也是生成的安装文件名
        copyright: "------", //版权信息
        directories: {
                output: "./dist_electron", //输出文件路径
        },
        // 不被打包的文件夹（根目录下，引用时使用 path.join(!isDevelopment ? __dirname : __static , '../文件夹名称'）
        extraResources: ['./live_video', './sensor_file'],
        nsis: {
                "oneClick": false,
                "allowToChangeInstallationDirectory": true
        },
        win: {
                //win相关配置
                icon: "./icons/icon.ico", //图标，当前图标在根目录下，注意这里有两个坑
                target: [
                        {
                                target: "nsis", //利用nsis制作安装程序
                                arch: [
                                        "x64", //64位
                                ],
                        },
                ],
        },
    },
},
```
