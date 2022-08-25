## 一口气写了一个博客生成器
### 200行代码，应该还有大量冗余，欢迎指正

### 创建文章
```bash
npm run new '文章标题' '分类（不写则取 package.json config.defCategory）'
```

### 生成网站
```
npm run gen
```

### 启动本地服务
```
npm run serve
```

### 核心模板
模板目录下的核心文件 `index.htm` `arc.htm` `list.htm` `page.htm` 

### 标签
- {$include:header.htm end/}  引入文件
- {$websiteTitle:end/}  网站标题
- {$title:end/}  栏目或者文章标题
- {$date:end/}  时间
- {$thumb:end/} 缩略图
- {$arcBody:end/} 文章内容
- {$arcPre:end/}  上一篇
- {$arcNext:end/} 下一篇
- {$list:end/}  文章列表
- {$pageNum:end/} 页码
