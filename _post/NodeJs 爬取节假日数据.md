<!-- 1661651988063 -->
<!-- NodeJs 爬取节假日数据 -->
<!-- 工作需要，就尝试做了个 Nodejs 爬取假日的东西，很简单 -->
<!--  -->
<!-- Tech -->

>爬取地址： https://fangjia.51240.com/2020__fangjia/ 
### 爬取格式

2019年节日放假安排查询
节日	| 放假时间	| 调休上班日期|	放假天数
-|:-|:-|:-
元旦	|12月30日~1月1日	|12月29日（周六）上班|3天
春节	|2月4日(除夕）~2月10日|	2月2日（周六）、2月3日（周日）上班|7天
清明节|4月5日~4月7日|	与周末连休|	3天
劳动节|5月1日~5月4日	|4月28日（星期日）、5月5日（星期日）上班|4天
端午节|6月7日~6月9日	|与周末连休|3天
国庆节|10月1日~10月7日|	9月29日（周日）、10月12日（周六）上班|7天
中秋节|9月13日~9月15日|	与周末连休|3天

### 使用
安装：
```bash
npm install
```
启动：
```bash 
node index.js
```
爬取： 

浏览器访问：`127.0.0.1/get/{year}`

爬取后，访问结果会持久化在 '/views/holidays/{year}.json'，可直接通过 `127.0.0.1/{year}.json` 访问

返回结果：
```
{
  year: {year},
  holidays: {
    01: {
      01: 1,
      02: 2
    }
    ……
  }
}
```

### 代码说明

#### 技术栈

* request
* express
* cheerio
* iconv

#### 爬取
```js
app.get('/get/:year', (req, res) => {
  let { year } = req.params
  // 这是爬取地址，替换的话请保证格式和上面的一致
  request.get(`https://fangjia.51240.com/${year}__fangjia/`, (err, response, body) => {
    if(err) return res.json({ err })
    return res.json( { 
      year,
      holiday: operation(body, year) 
    })
  })
})
```

git：[https://gitee.com/sk88/get_holiday](https://gitee.com/sk88/get_holiday)