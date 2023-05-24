---
title: HTML & CSS复习
tags:
  - 前端
  - HTML
categories: HTML
keywords: '前端,面试,HTML'
description: HTMLJS复习记录
top_img: 设置false不显示顶部图片
sticky: 数值越大越靠前
cover: 首页封面
comments: false评论
abbrlink: d9795d88
date: 2023-05-23 15:21:13
updated: 2023-05-23 15:21:13
---

JS复习记录

<!-- more -->



# HTML

## 1. 语义化

1. 语义化，指对文本内容的结构化（内容语义化），选择合乎语义的标签（代码语义化）。

2. 语义化标签：`header`、`nav`、`main`、`article`、`section`、`aside`、`footer`等。

3. 优点：

   - 代码结构清晰，易于阅读，有利于维护
   - 方便其他设备解析（如：屏幕阅读器）
   - 有利于搜索引擎优化（SEO），搜索引擎爬虫会根据不同的标签来赋予不同的权重

   

## 2. script 标签中属性 async 和 defer 的区别？

- `script` 会阻碍 HTML 解析，只有下载好并执行完脚本才会继续解析 HTML
- `async script`：解析 HTML 的过程中会进行脚本的异步下载，下载成功后立马执行，因此有可能会阻断 HTML 的解析。多个脚本的执行顺序无法保证。
- `defer script`：也是异步下载脚步，加载完成后，如果此时 HTML 还没有解析完，浏览器不会暂停解析去执行 JS 代码，而是等待 HTML 解析完毕再执行 JS 代码，如果存在多个 `defer script `标签，浏览器（IE9及以下除外）会保证它们按照在 HTML 中出现的顺序执行，不会破坏 JS 脚本之间的依赖关系。



## 3. DOCTYPE 的作用是什么？

`<!DOCTYE>` 声明一般位于文档的第一行，它的作用主要是告诉浏览器以什么样的模式来解析文档。一般指定了之后会以“标准模式”进行文档解析，否则就以“兼容模式”进行解析。

- 在`标准模式`下，浏览器的解析规则都是按照最新的标准进行解析的。
- 而在`兼容模式`下，浏览器会以向后兼容的方式来模拟老式浏览器的行为，以保证一些老的网站能正常访问。

## 4. SGML、HTML、XML 和 XHTML的区别

- `SGML` 是标准通用标记语言，是一种定义电子文档结构和描述其内容的国际标准语言，是所有电子文档标记语言的起源。
- `HTML` 是超文本标记语言，主要是用于规定怎样显示网页。
- `XML` 是可扩展标记语言，是未来网页语言的发展方向，XML 和 HTML 的最大区别就在于 XML 的标签是可以自己创建的，数量无限多，而 HTML 的标签都是固定的而且数量有限。
- `XHTML` 也是现在基本上所有网页都在用的标记语言，他其实和 HTML 没什么本质的区别，标签都一样，用法也都一样，就是比 HTML 更严格，比如标签必须都用小写，标签都必须有闭合标签等。



## 5. HTML5 有哪些新特性、移除了哪些元素？

HTML5 现在已经不是 SGML 的子集，主要是关于图像、位置、存储、多任务等功能的增加。

新增的：

- 绘图 `canvas`
- 用于媒介回放的 `video` 和 `audio` 元素
- 本地离线存储 `localStorage` 、`sessionStorage`
- 语义化更好的内容元素，如：`header`、`article`、`nav`、`section`、`footer`等
- 表单控件 `calendar`、`date`、`time`、`email`、`url`、`search` 等
- 新的技术 `webworker`、`websocket`
- 新的文档属性 `document.visibilityState`

移除的：

- 纯表现的元素：`basefont`、`big`、`center`、`s`、`tt`、`u`
- 对可用性产生负面影响的元素：`frame`、`frameset`、`noframes`





## 6. 对浏览器内核的理解

主要分为两部分：渲染引擎和JS引擎。

- `渲染引擎`：其职责就是渲染，即在浏览器窗口中显示所请求的内容。默认情况下，渲染引擎可以显示 HTML、 XML 文档及图片，它也可以借助一些浏览器扩展插件显示其他类型数据，如：使用PDF阅读器插件可以显示 PDF 格式。
- `JS引擎`：解析和执行 JavaScript 来实现网页的动态效果。

最开始渲染引擎和JS引擎并没有区分的很明显，后来JS引擎越来越独立，内核就倾向于只指渲染引擎了



## 7. 什么是文档的预解析？

当执行 JavaScript 脚本时，另一个线程解析剩下的文档，并加载后面需要通过网络加载的资源。这种方式可以使资源并行加载，从而使整体速度更快。

需要注意的是，预解析并不改变DOM树，它将这个工作交给主解析过程，自己只解析外部资源的引用，比如：外部脚本、样式及图片。



## 8. 浏览器的渲染原理

简记： 生成DOM树 --> 生成CSS规则树 --> 构建渲染树 --> 布局 --> 绘制

1. 首先解析收到的文档，根据文档定义构建一颗 `DOM 树`，DOM 树是由 DOM 元素及属性节点组成的。
2. 然后对 CSS 进行解析，生成一颗 `CSS 规则树`。
3. 根据 DOM 树和 CSS 规则树构建`渲染树`。渲染树的节点被称为渲染对象，它是一个包含有颜色等属性的矩形。渲染对象和 DOM 元素相对应，但这种关系不是一对一的，不可见的 DOM 元素不会插入渲染树。还有一些 DOM 元素对应几个可见对象，它们一般是一些具有复杂结构的元素，无法用一个矩形来描述。
4. 当渲染对象被创建并添加到树中，它们没有位置和大小，所以当浏览器生成渲染树以后，就会根据渲染树来进行`布局`（也可以叫做回流）。这一阶段浏览器要做的是计算出各个节点在页面中确切位置和大小。通常这一行为也被称为自动重排。
5. 布局阶段结束后是`绘制`阶段，遍历渲染树并调用渲染对象的 paint 方法将它们的内容显示到屏幕上。值得注意的是，这个过程是逐步完成的，为了更好的用户体验，渲染引擎会尽早的将内容呈现到屏幕上，并不会等到所有 HMTL 内容都解析完之后再去构建和布局渲染树，它是解析完一部分内容就显示一部分内容，同时，可能还通过网络下载其余内容。



## 9. 什么是回流和重绘？

1.概念：

- `回流`：当 DOM 的变化影响了元素的几何信息，浏览器需要重新计算元素的几何属性，将其安放在界面中的正确位置，这个过程叫做回流（也可以叫做重排）。表现为重新生成布局，重新排列元素。
- `重绘`：当一个元素的外观发生改变，重新把元素外观绘制出来的过程，叫做重绘。表现为某些元素的外观被改变。

2.常见引起回流和重绘的属性和方法：

任何会改变元素几何信息（元素的位置和尺寸大小）的操作都会触发回流。

- 添加或删除可见的 DOM 元素
- 元素尺寸改变--边距、填充、宽度、高度
- 浏览器尺寸改变-- resize 事件发生时
- 计算 offsetWidth 和 offsetHeight 属性
- 设置 style 属性的值
- 修改网页默认字体

**回流必定会发生重绘，重绘不一定会引发回流。**

**回流所需的成本比重绘高得多**

建议阅读文章：[你真的了解回流和重绘吗](https://juejin.cn/post/6844903779700047885)



## 10. 如何减少回流？

- 使用 transform 代替 top
- 不要把节点的属性值放在一个循环里，当成循环里的变量
- 不要使用 table 布局，可能很小的一个改动会造成整个 table 的重新布局
- 把 DOM 离线后修改。如：使用 documentFragment 对象在内存里操作 DOM
- 不要一条一条的修改样式，可以预先定义好 class，然后修改 DOM 的 className
- 使用 absolute 或 fixed 使元素脱离文档流



## 11. sessionStorage，localStorage 和 cookie 的区别

1. 共同点：都是保存在浏览器端，且同源的
2. 区别:

- cookie 始终在同源的 http 请求中携带（即使不需要），即 cookie 在浏览器和服务器之间来回传递；而 sessionStorage 和 localStorage 不会自动把数据发送到服务器，仅在本地保存。cookie 还有路径（path）的概念，可以限制 cookie 只属于某个路径下。
- 存储大小限制不同。cookie 不能超过 4K，因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如：会话标识。sessionStorage 和 localStorage 虽然也有存储大小限制，但比 cookie 大得多，可以达到 5M 或更大。
- 数据有效期不同。sessionStorage 仅在当前浏览器窗口关闭之前有效；localStorage 始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie 只在设置的 cookie 过期时间之前有效。
- 作用域不同。sessionStorage 不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 和 cookie 在所有同源窗口中都是共享的。



## 12. iframe 有哪些优缺点？

优点：

1. iframe 能原封不动的把嵌入的网页展现出来。
2. 如果有多个网页引用 iframe，只需修改 iframe 的内容，就可以实现调用每一个页面的更改，方便快捷。

缺点：

1. iframe 会阻塞主页面的 onload 事件。
2. iframe 和主页面共享链接池，而浏览器对相同域的链接有限制，所以会影响页面的并行加载。
3. 不利于 SEO，代码复杂，无法一下被搜索引擎索引到。
4. iframe 框架页面会增加服务器的 http 请求，对于大型网站不可取。
5. 很多移动设备无法完全显示框架，设备兼容性差。

注意：通过动态给 iframe 添加 src 属性值，可解决前两个问题。



## 13. 什么是 canvas，基本用法是什么？

canvas 元素是 HTML5 的一部分，允许脚步语言动态渲染位图像。canvas 由一个可控制区域 HTML 代码中的属性定义决定高度和宽度。JavaScript 代码可以访问该区域，通过一套完整的绘图功能类似于其他通用二维的 API，从而生成动态的图形。

1. 创建 canvas 标签

```arduino
arduino
复制代码<canvas id="myCanvas" width="150" height="150">该浏览器不支持canvas</canvas>
```

1. 渲染上下文

```ini
ini复制代码var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
```

代码第一行通过使用 `document.getElementById()` 方法获取 `<canvas>` 元素对应的 DOM 对象，然后可以通过使用它的 `getContext()` 方法来绘制上下文。 创建 canvas 标签时可以在标签内写上不支持的提示信息；也可以通过 `getContext()` 方法判读是否支持编程。

```ini
ini复制代码var canvas = document.getElementById('myCanvas');
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  // other code
} else {
  // 不支持 canvas 的其他代码
}
```

用途：

canvas 可用于游戏和图表（echarts.js、heightchart.js 都是基于 canvas 来绘图）制作。

# CSS

## 1. css3 有哪些新特性？

- rgba 和 透明度
- background-image、background-origin、background-size、background-repeat
- word-wrap: break-word（对长的不可分割的单词换行）
- 文字阴影 text-shadow
- font-face属性，定义自己的字体
- border-radius
- 边框图片 border-image
- 盒阴影 box-shadow
- 媒体查询：定义多套 css，当浏览器尺寸发生变化时采用不同的属性

## 2. style 标签写在 body 后与 body 前有什么区别？

1. 写在 body 标签前有利于浏览器逐步渲染： resources downloading --> cssDOM + DOM --> Render Tree --> layout --> paint
2. 写在 body 标签后： 由于浏览器以逐行方式对 HTML 文档进行解析，当解析到写在尾部的样式表（外联或写在 style 标签）会导致浏览器停止之前的渲染，等待加载且解析样式完成后重新渲染；在 windows 的 IE 下可能出现样式失效导致的页面闪烁问题。

## 3. CSS选择器及优先级

1. 选择器
   - id选择器(#myid)
   - 类选择器(.myclass)
   - 属性选择器(a[rel="external"])
   - 伪类选择器(a:hover, li:nth-child)
   - 标签选择器(div, h1, p)
   - 伪元素选择器(p::first-line)
   - 相邻选择器（h1 + p）
   - 子选择器(ul > li)
   - 后代选择器(li a)
   - 通配符选择器(*)
2. 优先级
   - `!important`
   - 内联样式（1000）
   - ID选择器（0100）
   - 类选择器 / 属性选择器 / 伪类选择器（0010）
   - 标签选择器 / 伪元素选择器（0001）
   - 关系选择器 / 通配符选择器（0000）

带 !important 标记的样式属性优先级最高；样式表的来源相同时：`!important > 行内样式> ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性`

## 4. rgba() 和 opacity 设置透明度的区别是什么？

rgba() 和 opacity 都能实现透明效果，但最大的不同是 opacity 作用于元素，以及元素内的所有内容的透明度；而 rgba() 只作用于元素的颜色或其背景色，设置 rgba() 透明的元素的子元素不会继承透明效果。

## 5. 浏览器是如何解析 css 选择器的？

`从右向左解析的。`若从左向右匹配，发现不符合规则，需要回溯，会损失很多性能。若从右向左匹配，先找到所有的最后节点，对于每一个节点，向上寻找其父节点直到查找至根元素或满足条件的匹配规则，则结束这个分支的遍历。

在 css 解析完毕后，需将解析结果 css 规则树和 DOM Tree 一起进行分析建立一颗 Render Tree，最终用来进行绘图。

## 6. display: none 和 visibility: hidden 两者的区别

1. display: none 隐藏后不占用文档流；而 visibility: hidden 会占用文档流。
2. visibility 具有继承性，给父元素设置 "visibility: hidden"，子元素也会继承该属性，但如果重新给子元素设置 "visibility: visible"，则子元素又会显示出来。
3. visibility: hidden 不会影响计数器的计数，虽然隐藏了，但计数器依然运行着。
4. 在 css3 中 transition 支持 visibility 属性，但不支持 display。因为 transition 可以延迟执行，因此配合 visibility 使用纯 css 延时显示效果可以提高用户体验。
5. display: none 会引起回流（重排）和重绘；visibility: hidden 会引起重绘。



## 7. 简述 transform，transition，animation 的作用

1. `transform`：描述了元素的静态样式，本身不会呈现动画效果，可以对元素进行旋转 rotate、扭曲 skew、缩放 scale 和移动 translate 以及矩阵变形 matrix。`transition` 和 `animation` 两者都能实现动画效果。`transform` 常配合`transition` 和 `animation` 使用。
2. `transition`：样式过渡，从一种效果逐渐改变为另一种效果，它是一个合写属性。transition: transition-property  transition-duration  transition-timing-function  transition-delay 从左到右，依次是：过渡效果的css属性名称、过渡效果花费时间、速度曲线、过渡开始的延迟时间  `transition` 通常和 hover 等事件配合使用，需要由事件来触发过渡。
3. `animation`：动画，有 `@keyframes` 来描述每一帧的样式。

区别：

- `transform` 仅描述元素的静态样式，常配合`transition` 和 `animation` 使用。
- `transition` 通常和 hover 等事件配合使用；`animation` 是自发的，立即播放。
- `animation` 可以设置循环次数。
- `animation` 可以设置每一帧的样式和时间，`transition` 只能设置头尾。
- `transition` 可以与 js 配合使用， js 设定要变化的样式，`transition` 负责动画效果。



## 8. line-height 如何继承？

- 父元素的 `line-height` 是具体数值，则子元素 `line-height` 继承该值。
- 父元素的 `line-height` 是比例值，如'2'，则子元素 `line-height` 继承该比例。
- 父元素的 `line-height` 是百分比，则子元素 `line-height` 继承的是父元素的 font-size * 百分比 计算出来的值。

## 9. 如何让 chrome 支持 10px 的文字？

1. font-size: 12px; -webkit-transform: scale(0.84);
2. font-size: 20px; -webkit-transform: scale(0.5);

## 10. position 属性的值有哪些？

1. `static`：默认定位。元素出现在正常的文档流中（忽略top，bottom，left，right 或 z-index声明）
2. `relative`：相对定位。如果对一个元素进行相对定位，将出现在它所在的位置上。然后，可以通过设置垂直或水平位置，使其“相对于”它的起点进行移动。使用相对定位时，无论是否移动，元素仍然占据原来的空间；移动元素会导致其覆盖其他元素。
3. `absolute`：绝对定位。元素的位置相对于最近的已定位的父元素，如果元素没有已定位的父元素，则相对于根元素（即 html 元素）定位。绝对定位的元素会脱离文档流，不占据空间，会与其他元素重叠。
4. `fixed`：固定定位。元素的位置相对于浏览器窗口是固定位置，即使窗口滚动它也不会移动。固定定位的元素会脱离文档流，不占据空间，会与其他元素重叠。
5. `sticky`：粘性定位。粘性定位可以被认为是相对定位和固定定位的混合，元素在跨越特定阈值前为相对定位，之后为固定定位。top，right，buttom，left，必须指定这四个阈值中的一个，才可以使粘性定位生效，否则行为与其相对定位相同。
6. `inherit`：规定应该从父元素继承 position 属性的值。

## 11. css 盒模型？

- `标准盒模型`，width 指 content 部分的宽度，总宽度 = width + border(左右) + padding（左右）+ margin（左右）；高度同理。
- `怪异盒模型（IE盒模型）`，width 指 content + border（左右） + padding（左右）三部分的宽度，因此，总宽度 = width + margin（左右）；高度同理。

## 12. box-sizing 属性

1. `content-box`，对应标准盒模型。
2. `border-box`，IE盒模型。
3. `inherit`，继承父元素的 box-sizing 值。

## 13. BFC（块级格式上下文）

1. 概念： BFC（Block Formatting Context），块级格式上下文。BFC 是 css 布局的一个概念，是一个独立的渲染区域，规定了内部 box 如何布局，且这个区域内的子元素不会影响到外面的元素。
2. 布局规则：

- 内部的 box 会在垂直方向一个接一个的放置
- box 垂直方向的距离由 margin 决定，同一个 BFC 相邻的 box 的 margin 会发生重叠
- 每个 box 的 margin 左边，与包含块的左 border 相接触（对于从左往右的格式化，否则相反）
- BFC 的区域不会与 float box 重叠
- BFC 是一个独立容器，容器内的子元素不会影响到外面的元素
- 计算 BFC 高度时，浮动元素也参与计算高度

1. 如何创建 BFC ？

- 根元素，即 html 元素
- float 值不为 none
- position 值为 absolute 或 fixed
- display 的值为 inline-block、tabl-cell、table-caption
- overflow 的值不为 visible

1. BFC 的使用场景

- 去除边距重叠问题
- 清除浮动（让父元素的高度包含子浮动元素）
- 阻止元素被浮动元素覆盖



## 14. 让一个元素水平/垂直居中

1. 水平居中

- 行内元素：`text-align: center;`
- 对于确定宽度的块级元素
  - width 和 margin 实现： `mragin: 0 auto;`
  - 绝对定位和 margin-left 实现： `margin-left: (父width - 子 width)/2；`(前提是父元素相对定位)
- 对于宽度未知的块级元素
  - table 标签配合 margin 左右 auto 实现
  - inline-block 实现：`display: inline-block; text-align: center;`
  - 绝对定位和 transform 实现， translateX 可以移动本身元素的50%
  - flex 布局 `justify-content: center`

1. 垂直居中

- 纯文字类，设置 line-height 等于 height
- 子绝父相，子元素通过 margin 实现自适应居中
- 子绝父相，通过位移 transform 实现
- flex 布局，`align-items: center;`
- table 布局，父级通过转换为表格形式，子级设置 vertical-align 实现

## 15. flex 布局

flex 布局，是一种弹性盒布局模型，给子元素提供了空间分布和对齐能力，由`container`（容器）及`item`（项目）组成。该布局模型提供了一种更加高效的方式来对容器中的项目进行布局、对齐和分配空间。适用于在不同尺寸的屏幕中创建可自动扩展和收缩布局，通常可用于`水平/垂直居中`，`两栏`、`三栏布局`等的场景里。

其中`flex`属性是`flex-grow`，`flex-shrink`和`flex-basis`的简写，默认值为`0 1 auto`。**该属性有两个快捷值：`auto (1 1 auto)` 和 `none (0 0 auto)`。**

- `flex-grow`：定义项目的放大比例，默认值为 0，即如果存在剩余空间，也不放大。如果所有项目的`flex-grow`属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。
- `flex-shrink`：项目的缩小比例，默认为 1，即如果空间不足，项目将缩小。如果所有项目的`flex-shrink`属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为 0，其他项目都为 1，则空间不足时，前者不缩小。
- `flex-basis`：定义了在分配多余空间之前，项目占据的主轴空间。浏览器会根据该属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。当设置为 0 的是，会根据内容撑开。也可以设为跟`width`或`height`属性一样的值（比如 350px），则项目将占据固定空间。

`flex`常用的属性值：

- flex: 1 --> flex: 1 1 0%
- flex: 2 --> flex: 2 1 0%
- flex: auto --> flex: 1 1 auto
- flex: none --> flex: 0 0 auto【常用于固定尺寸不伸缩】



## 16. 清除浮动

1. 直接把 

   ```
   <div style="clear: both;"></div>
   ```

   作为最后一个子标签

   - 优点：通俗易懂，容易掌握；
   - 缺点：会添加较多无意义的空标签，有违结构与表现的分离，在后期维护中将是噩梦

2. .clearfix { overflow: hidden; zoom: 1; }

   - 优点：不存在结构和语义化问题，代码量极少
   - 缺点：内容增多时容易造成不自动换行，导致内容被隐藏掉，无法显示需要溢出的元素

3. 建立伪类选择器



![image.png](https://raw.githubusercontent.com/why862555625/images/main/images/98e2353e3275475095bd26ecedfa32e9%7Etplv-k3u1fbpfcp-zoom-in-crop-mark%3A1512%3A0%3A0%3A0.awebp)



## 17. css 中优雅降级和渐进增强有什么区别？

优雅降级和渐进增强是随着 css3 流出来的一个概念。由于低级浏览器不支持 css3， 但 css3 的效果又很优秀不忍放弃，所以在高级浏览器中使用 css3 ，而在低级浏览器只保证最基本的功能。二者最关键的区别是它们所侧重的内容，以及这种不同所造成的工作流程的差异。

- `优雅降级`：一开始就构建完整的功能，然后针对浏览器测试和修复。
- `渐进增强`：一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能以达到更好的体验。

## 18. img 的 alt 和 title 的异同？实现图片懒加载的原理？

- `alt`是图片加载失败时显示在网页上的替代文字；`title`是鼠标放在图片上面时显示的文字，是对图片的进一步描述和说明。
- `alt`是 img 的必要属性；`title`不是。
- 对于网站 SEO 优先来说，搜索引擎对图片意思的判断，主要是靠`alt`属性，所以在图片`alt`属性中以简要文字说明，同时包含关键字，也是页面优化的一部分。

`懒加载原理`：先设置图片的 `data-set` 属性值（也可以是其他任意的，只要不发生 http 请求就可以，作用是为了存取值）为图片路径，由于不是 `src` 属性，故不会发生 http 请求。然后计算出页面的 scrollTop 的高度和浏览器的高度之和，如果图片距页面顶端距离小于前两者之和，说明图片要显示出来了，这时将 `data-set` 属性替换为 `src` 属性即可。

## 19. css sprites （雪碧图/精灵图）

css sprites 就是把网页中一些小图片整合到一张图片文件中，再利用 css 的 background-image、background-repeat、background-position 的组合进行背景定位。

优点： 减少图片体积；减少 http 请求次数

缺点：维护比较麻烦；不能随便改变大小，会失真模糊

## 20. 什么是字体图标？

字体图标简单的说，就是一种特殊的字体，通过这种字体，显示给用户的就像一个个图片一样。字体图标最大的好处，在于它不会变形和加载速度快。字体图标可以像文字一样，随意通过 css 来控制它的大小和颜色，非常方便。

## 21. 主流浏览器内核私有属性 css 前缀？

- mozilla(firefox、flock等): -moz
- webkit 内核(safari、chrome等): -webkit
- opera 内核(opera浏览器): -o
- trident 内核(ie 浏览器): -ms





