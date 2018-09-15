# PersonalSite

尝试做一个我的个人网站，可能会使用一部分vue（雾）

## 学习到的新东西

### html 部分

[利用@media screen实现网页布局的自适应](https://blog.csdn.net/inuyasha1121/article/details/50777116)

顶部导航栏(head navigation bar)使用\<ul>标签实现而不是使用\<div>标签(是因为\<div>的样式设计过于繁琐？)

### css 部分

设置顶部导航栏(head navigation bar)固定在页面头

``` html
.head-bar {
    position:fixed;
    top:0;
}
```

当设置`float:right;`时，里面的元素需要按照相反的顺序从上往下写。

当设置为`display:block;`之后，`animation`才会被触发。(?)

设置`animation-fill-mode:forwards`之后能保留动画效果。

`transition: property time;`property属性可以选择填写all，这样可以使所有变化属性拥有动画。

### javascript 部分

页面的DOM文件树加载完成后可用`$(document).ready(function () {});`
页面的所有文件加载完成后可用`window.onload = function () {};`

### 其他

[vscode好用的插件](https://segmentfault.com/a/1190000011779959)

inline-block is ignored due to the float. If 'float' has a value other than 'none', the box is floated and 'display' is treated as 'block'

vue元素绑定mouseover,mouseenter,mouseout,mouseleave事件时触发机制非常的奇怪，这里我的解决方案是换成处理click

在切换背景图时，在图片的src后加入随机数即可重新加载图片，如`$('#backupBG')[0].src = $('#backupBG')[0].src + "?" + Math.random();`