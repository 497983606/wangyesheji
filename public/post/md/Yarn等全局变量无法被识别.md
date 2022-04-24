<!-- 1650785116286 -->
<!-- Yarn 等全局变量无法被识别 -->
<!-- Yarn 等全局变量无法被识别 的前言 -->
<!-- Yarn 等全局变量无法被识别 的缩略图url -->

```js
无法加载文件 C:\Users\***\AppData\Roaming\npm\yarn.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/ 
?LinkID=135170 中的 about_Execution_Policies。
```

需要使用“管理员身份”启动 powershell 然后执行以下命令
```js
set-ExecutionPolicy RemoteSigned
```
设置远程签名的执行策略
