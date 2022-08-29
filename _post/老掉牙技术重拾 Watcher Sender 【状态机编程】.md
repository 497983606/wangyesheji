<!-- 1451069040000 -->
<!-- 老掉牙技术重拾 Watcher Sender 【状态机编程】 -->
<!-- 最近在研究状态编程的思想，不想歪打正着碰到了js实现dataMap，然后引申发现这个玩意可以做到类vue bus的效果，这里记录一下发布出来，希望对一些研究全局状态监控和数据双向绑定的同学有所帮助吧，下面具体在研究数据双向绑定的原理 -->
<!--  -->
<!-- Tech -->
### 写在前面
>最近在研究状态编程的思想，不想歪打正着碰到了js实现dataMap，然后引申发现这个玩意可以做到类vue bus的效果，这里记录一下发布出来，希望对一些研究全局状态监控和数据双向绑定的同学有所帮助吧，下面具体在研究数据双向绑定的原理。

## 首先实现一个dataMap
分析一下，dataMap都需要什么功能，（之前有一篇文章咱们是说过es6新增对象map和set，mao和这个有点像，但map是一个二位数据 链接>>）下面列举一下：

* 增、删、改、查，这个删要可以指定key去删除。
* 既然自己搞那就搞点原生不具备的东西，方便使用提高性能。mapData具备判断是否为空、遍历（类原生高阶函数map方法）、获取键值数组、更加方便的获取mapData长度。
来看一下dataMap的结构图：
![](https://i.loli.net/2019/01/03/5c2d5eda9b878.png)

来实现一下：
```js
//先给原生数组加一个remove()方法
Array.prototype.remove = function(s) {
	for (var i = 0; i < this.length; i++) {
		if (s == this[i])
			this.splice(i, 1);
	}
}
```
具体实现以下dataMap这个构造函数
```js
var DataMap = function(){
    /** 存放key */
    this.keys = new Array();
	/** 存放数据 */
    this.data = new Object();
    /**
	 * 插入数据
	 * @param {String} key
	 * @param {Object} value
	 */
	this.put = function(key, value) {
		if(this.data[key] == null){
			this.keys.push(key);
		}
		this.data[key] = value;
    };
    /**
	 * 获取某键对应的值
	 * @param {String} key
	 * @return {Object} value
	 */
	this.get = function(key) {
		return this.data[key];
    };
    /**
	 * 删除一个键值对
	 * @param {String} key
	 */
	this.remove = function(key) {
		this.keys.remove(key);
		this.data[key] = null;
	};
    /**
	 * 遍历Map,执行处理函数
	 *
	 * @param {Function} 回调函数 function(key,value,index){..}
	 */
	this.each = function(fn){
		if(typeof fn != 'function'){
			return;
		}
		var len = this.keys.length;
		for(var i=0;i<len;i++){
			var k = this.keys[i];
			fn(k,this.data[k],i);
		}
    };
    /**
	 * 获取键值数组(类似Java的entrySet())
	 * @return 键值对象{key,value}的数组
	 */
	this.entrys = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for (var i = 0; i < len; i++) {
			entrys[i] = {
				key : this.keys[i],
				value : this.data[i]
			};
		}
		return entrys;
	};
    /**
	 * 判断Map是否为空
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
    };
    /**
	 * 获取键值对数量
	 */
	this.size = function(){
		return this.keys.length;
	};
};
```
这个mapData完事，下来在说说用这个来做watcher和sender，同样的来看张流程图分析一下原理：
![](https://i.loli.net/2019/01/03/5c2d6dec36359.png)

上代码：
```js
var eventController = (function() {
    var instantiated;  //实例化标识符

    function init() {
        /*这里定义单例代码*/
        var eventContainer = new DataMap();

        return {
            registerEvent: function(event, operator) {
                if (typeof operator != "function") {
                    return;
                }

                var listenerList = eventContainer.get(event);
                if (listenerList == null) {
                    listenerList = new Array();
                    eventContainer.put(event, listenerList);
                }

                listenerList.push(operator);
            },

            wireEvent: function(event, param) {
                var listenerList = eventContainer.get(event);
                if (listenerList == null) {
                    return;
                }

                for (var i = 0; i < listenerList.length; i++) {
                    listenerList[i](param);
                }
            },

            publicProperty: 'test'
        };
    }

    return {
        //避免重新生成DataMap实例
        getInstance: function() {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    };
})();

var sender = function(event, param) {
    eventController.getInstance().wireEvent(event, param);
}

var watcher = function(event, operator) {
    eventController.getInstance().registerEvent(event, operator);
}
```
如果你很熟悉vuebus的使用那么这个也很好理解，请看使用方法：
```js
function event(e){
    alert(e)
}
watcher('everyString',event)
//在其他页面执行sender的时候event会执行

sender('everyString','111')  //alert(111)
```
完事，有没有get到新技能。