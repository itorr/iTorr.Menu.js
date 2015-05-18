#Menu 右键菜单库

![](http://ww4.sinaimg.cn/large/4764ae2ajw1es4ov0jrqcg20qc0enabo)

　　这是一个 JavaScript 的右键菜单类，通过它我们可以快速实现右键菜单。曾用于 [偷揉电台](http://itorr.sinaapp.com/fm) 等项目中，为方便今后使用、抽象成类以开源~

>Menu 依托于 iTorr.js


##你好，世界
如何快速添加右键菜单到网页中？


```html
<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="../imenu.css">

<h1>你好，世界</h1>

<script src="../itorr.m.js"></script><!-- iTorr.js 函数库 -->
<script src="../itorr.menu.js"></script><!--  Menu 类 -->
<script>
$.Menu.reg($('h1'),[ //右键菜单列表
	{
		text:'我是右键菜单第一项', //右键菜单文字内容
		func:function(){ //回调函数
			alert('回调成功');
		}
	}
]);
</script>
```
Menu 类依托于 iTorr.js 运行，需要绑定菜单时 可通过 `$.Menu` 或 `iTorr.Menu` 进行调用。

 >PS: 为保证代码的适应性，可通过匿名函数限定作用域实现 `$` 兼容
```javascript
~function($){
	$.Menu.reg($('h1'),[ //右键菜单列表
		{
			text:'我是右键菜单第一项', //右键菜单文字内容
			func:function(){ //回调函数
				alert('回调成功');
			}
		}
	]);
}(iTorr);
```

##实现原理
 　　Menu 通过委托点击事件到 `document.body` 上实现，判断绑定时会从被点击元素依次向上查找，遇到符合注册时 `dom` 参数时，即停止查找并显示菜单。**因此更内部的元素会优先被查找。** 


##注册菜单


在 `iTorr.Menu` 中，接受 **DOM 节点** 与 **CSS 表达式** 两种注册右键菜单方式。

 **DOM 节点注册法** 仅在指引的 DOM 上展示右键菜单；**CSS 表达式注册法** 会在所有匹配规则的节点上展示右键菜单、无论注册时是否存在。两种方式性能差别不大，请根据具体情况选择适合的注册方式。

两种注册方式均为统一入口 `$.Menu.reg` 

```javascript
$.Menu.reg(dom,menu,config);
```
`dom` **HTMLElement/String** 为注册的 DOM 节点，或者能匹配到相应 DOM 的 CSS 表达式
`menu` **Array** 为菜单列表项 
`config` **Object** 为注册参数


*推荐的注册方式如下:*
```javascript
$.Menu.reg(
	document.body, //注册的 DOM 节点，或者能匹配到相应 DOM 的 CSS 表达式
	[ //菜单列表 数组
		{ //普通的菜单项
			text:'删除', //右键菜单文字内容
			key:'Del', //快捷键提示 （不参与绑定，仅用来提示快捷键）
			func: function(dom){ //绑定回调函数： 参数1->响应回调的 DOM 节点
				dom.del();
			}
		},
		{ //分割线
			type:'hr'
		},
		/*......更多*/
	],
	{//注册参数
		open:function(dom){//菜单被打开时的回调函数： 参数1->响应回调的 DOM 节点
			console.log('菜单开启:',dom)
		},
		close:function(dom){//菜单被关闭时的回调函数： 参数1->响应回调的 DOM 节点
			console.log('菜单关闭:',dom)
		}	
	}
);
```

但 Menu 是个开放的类库，你可以用各种喜欢的方式使用
```javascript
$.Menu.reg($('h1'),[{
	text:'我是右键菜单第一项', //右键菜单文字内容
	func:function(){ //回调函数
		alert('回调成功');
	}
}],{
	open:function(dom){
		console.log('打开了菜单',dom);
	}
});
```
或者
```javascript
$.Menu.reg($('h1'),{
	menu:[{
		text:'我是右键菜单第一项', //右键菜单文字内容
		func:function(){ //回调函数
			alert('回调成功');
		}
	}],
	open:function(dom){
		console.log('打开了菜单',dom);
	}
});
```
以及
```javascript
$.Menu.reg({
	dom:$('h1'),
	menu:[{
		text:'我是右键菜单第一项', //右键菜单文字内容
		func:function(){ //回调函数
			alert('回调成功');
		}
	}],
	open:function(dom){
		console.log('打开了菜单',dom);
	}
});
```
甚至 链式语法
```javascript
$.Menu.reg($('h1'),[{
	text:'我是大标题'
	//无 func 的情况 点击即消失，没有回调函数~
}]).reg('p',[{ //在所有 p 标签上注册
	text:'我是 P 标签', //右键菜单文字内容
	func:function(dom){ //回调函数
		alert('回调成功',dom);
	}
}]);
```


##委托形式注册右键菜单
　　上面展示了很多 DOM 绑定的情况，但为了应多更复杂的任务，更少的耦合以及更优雅的实现，我们可以在 DOM 尚未出现提前通过委托的形式实现右键菜单注册。`iTorr.Menu` 的委托依靠 `CSS 表达式`语法，在符合表达式的情况下 即可展示菜单。
　　
　　委托形式和 DOM 形式在使用上几乎无差别，`参数1` 替换成 CSS 表达式即可
```javascript
$.Menu.reg('span',[{
		text:'我是 Span 标签'
}]);
```
这样在遇到的所有 `span` 标签上展示右键菜单。

##取消注册
　　当不需要某个右键菜单时，我们可以取消右键菜单注册
　　
*DOM 注册的情况*
```javascript
$.Menu.del($('h1'));
```
*CSS 表达式注册的情况*
```javascript
$.Menu.del('span');
```


##多级菜单（140517）

添加多级菜单支持，格式如下

```javascript
$.Menu.reg('span',[{
	text:'我是大标题'
	child:[{
		text:'我是子菜单'
	},{
		text:'我是子菜单2',
		func:function(){
			alert('子菜单回调');
		}
	},{
		text:'我是子菜单3',
		child:[{
		text:'我还有子菜单~'
		}]
	}]
}])
```
