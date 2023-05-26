<!-- 1685082304914 -->
<!-- mongoDB 初学 -->
<!-- mongoDB 初学 的前言 -->
<!--  -->
<!-- Tech -->

## 1 连接数据库

```js
// 第一步
const mongoose = require('mongoose');

// 第二步连接数据库
mongoose.connect('mongodb://root:123456@localhost/nest_cms', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('连接错误');
        return;
    }
    console.log('mongodb连接成功');
});

module.exports = mongoose;
```

## 2 使用 schema 定义

> 定义

```js
const mongoose = require('./db');

const UserSchema = mongoose.Schema({
    name: String,
    age: Number,
    status: { // 默认参数
        type: Number,
        default: 1,
    }
})

module.exports=mongoose.model('User',UserSchema,'user');
```

> 使用

```js
const UserModel = require('./model/user');

var user = new UserModel({
    name: '李四',
    age: 20
});
user.save((err) => {
    if (err) {
        console.log('保存数据错误')
    }
    console.log('保存数据成功');
});
```

```js
[ { status: 1,
    _id: 5e0fdb9d6e124d1f3096d9f3,
    name: '张三',
    age: 20,
    __v: 0 },
  { status: 1, // 默认插入的是1
    _id: 5e0fdbca98ff701f9006afcd,
    name: '李四',
    age: 20,
    __v: 0 } ]

```

## 3 使用预定义模型修饰

> mongoose中内置的预定义修饰符主要有

* lowercase
* uppercase
* trim

> 在schema中使用

```js
const mongoose = require('./db');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    age: Number,
    message1: {
        type: String,
        lowercase: true,
    },
    message2: {
        type: String,
        uppercase: true,
    },
    status: {
        type: Number,
        default: 1,
    }
})

module.exports=mongoose.model('User',UserSchema,'user');

```

## 4 mogoose中预定义的set和get修饰符

> 定义schema

```js
const mongoose = require('./db');

const NewSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    author: String,
    avatar: {
        type: String,
        set(url) {
            if (!url) {
                return '';
            }
            if (url.indexOf('http://') !=0 && url.indexOf('https://') !=0) {
                url = 'http://' + url;
            }
            return url;
        }
    }
})

module.exports = mongoose.model('New', NewSchema, 'new');

```

> 插入一条数据

```js
const NewModel = require('./model/new');

const news = new NewModel({
    title: '文章一',
    author: '张三',
    avatar: 'xx.png'
})

news.save();

```

> 查询结果

```js
{
    "_id" : ObjectId("5e0fe0b971428227107241c1"),
    "title" : "文章一",
    "author" : "张三",
    "avatar" : "http://xx.png",
    "__v" : 0
}

```

## 5 mongodb中的索引

1、索引的作用

>索引是对数据库表中一列或多列的值进行排序的一种结构，可以让我们查询数据库变得更快。MongoDB 的索引几乎与传统的关系型数据库一模一样，这其中也包括一些基本的查询优化技巧。

2、创建索引
```js
db.user.ensureIndex({字段:1}) // 普通索引
```
3、获取索引
```js
db.user.getIndexes()
```
4、删除索引
```js
db.user.dropIndex({字段:1})
```
5、复合索引
```js
// 数字 1 表示 username 键的索引按升序存储，-1 表示 age 键的索引按照降序方式存储
db.user.ensureIndex({"username":1, "age":-1})

```
6、唯一索引
```js
db.user.ensureIndex({"userid":1},{"unique":true})
```

## 6 mongoose中的schema创建索引

```js
const mongoose = require('./db');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true, // 创建唯一索引
    },
    age: Number,
    message1: {
        type: String,
        lowercase: true,
    },
    message2: {
        type: String,
        uppercase: true,
    },
    status: {
        type: Number,
        default: 1,
    }
})

module.exports=mongoose.model('User',UserSchema,'user');

```
## 7 时间的使用

> 定义schema中使用timestamps属性

```js
var mongoose = require('./db.js');

var UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  mobile: Number,
  status: {
    type: Number,
    default: 1
  }
}, {
  //设置时间戳
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema, 'user');

```

> 创建数据

```js
const UserModel = require('./model/user');

const user = new UserModel({
  name: '王五',
  age: 20,
  mobile: 100,
  status: 0
});

user.save();
```

> 查询出创建后的数据

```js
{
    "_id" : ObjectId("5e12a7f6c63086a54eed0a47"),
    "status" : 0,
    "name" : "王五",
    "age" : 20,
    "mobile" : 100,
    "createdAt" : ISODate("2020-01-06T03:22:30.336Z"), // 与系统默认时间相差8小时
    "updatedAt" : ISODate("2020-01-06T03:22:30.336Z"),
    "__v" : 0
}
```

> 修改createdAt和updatedAt显示

```js
var mongoose = require('./db.js');


var UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  mobile: Number,
  status: {
    type: Number,
    default: 1
  }
}, {
  //设置时间戳
  timestamps: {
    createdAt: 'created_at',
    updatedAt: "updated_at"
  }
});

module.exports = mongoose.model('User', UserSchema, 'user');
```

> 创建出来的数据

```js
{
    "_id" : ObjectId("5e12ac19a1b9cfab59fbd913"),
    "status" : 0,
    "name" : "马六",
    "age" : 20,
    "mobile" : 100,
    "created_at" : ISODate("2020-01-06T03:40:09.560Z"),
    "updated_at" : ISODate("2020-01-06T03:40:09.560Z"),
    "__v" : 0
}
```

> 修改数据

```js
UserModel.updateOne({ _id: '5e12ac19a1b9cfab59fbd913' }, { name: '王小二' }, (err, docs) => {
  if (err) {
    console.log('修改数据错误', err);
    return;
  }
  console.log(docs)
})
```

> 修改后的数据

```js
{
    "_id" : ObjectId("5e12ac19a1b9cfab59fbd913"),
    "status" : 0,
    "name" : "王小二",
    "age" : 20,
    "mobile" : 100,
    "created_at" : ISODate("2020-01-06T03:40:09.560Z"),
    "updated_at" : ISODate("2020-01-06T03:42:51.022Z"),
    "__v" : 0
}
```
## 插件的使用

> 搜索插件

https://plugins.mongoosejs.io/

> 自定义插件

```js
// 定义一个插件
const lastModified = (schema, option) => {
  schema.add({ updated_at: Date });
  schema.pre('updateOne', (next) => {
    this.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    next();
  })
}

// 使用插入
UserSchema.plugin(lastModified);
```