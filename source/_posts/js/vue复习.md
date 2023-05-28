---
title: vue复习
tags:
  - vue
  - JS
categories: JS
keywords: vue复习
description: vue复习
top_img: 设置false不显示顶部图片
sticky: 数值越大越靠前
cover: "https://raw.githubusercontent.com/why862555625/images/main/images/15.jpg"
comments: false评论
abbrlink: c9a941a3
date: 2023-05-26 15:38:34
updated: 2023-05-26 15:38:34
---



vue复习

<!-- more -->

### MVVM模型？

MVVM，是`Model-View-ViewModel`的简写，其本质是`MVC`模型的升级版。其中 `Model` 代表数据模型，`View` 代表看到的页面，`ViewModel`是`View`和`Model`之间的桥梁，数据会绑定到`ViewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`ViewModel`层更新数据。以前是通过操作`DOM`来更新视图，现在是`数据驱动视图`。

### Vue的生命周期

Vue 的生命周期可以分为8个阶段：创建前后、挂载前后、更新前后、销毁前后，以及一些特殊场景的生命周期。Vue 3 中还新增了是3个用于调试和服务端渲染的场景。

| Vue 2中的生命周期钩子 | Vue 3选项式API的生命周期选项 | Vue 3 组合API中生命周期钩子 | 描述                                                   |
| --------------------- | ---------------------------- | --------------------------- | ------------------------------------------------------ |
| `beforeCreate`        | `beforeCreate`               | `setup()`                   | 创建前，此时`data`和 `methods`的数据都还没有初始化     |
| `created`             | `created`                    | `setup()`                   | 创建后，`data`中有值，尚未挂载，可以进行一些`Ajax`请求 |
| `beforeMount`         | `beforeMount`                | `onBeforeMount`             | 挂载前，会找到虚拟`DOM`，编译成`Render`                |
| `mounted`             | `mounted`                    | `onMounted`                 | 挂载后，`DOM`已创建，可用于获取访问数据和`DOM`元素     |
| `beforeUpdate`        | `beforeUpdate`               | `onBeforeUpdate`            | 更新前，可用于获取更新前各种状态                       |
| `updated`             | `updated`                    | `onUpdated`                 | 更新后，所有状态已是最新                               |
| `beforeDestroy`       | `beforeUnmount`              | `onBeforeUnmount`           | 销毁前，可用于一些定时器或订阅的取消                   |
| `destroyed`           | `unmounted`                  | `onUnmounted`               | 销毁后，可用于一些定时器或订阅的取消                   |
| `activated`           | `activated`                  | `onActivated`               | `keep-alive`缓存的组件激活时                           |
| `deactivated`         | `deactivated`                | `onDeactivated`             | `keep-alive`缓存的组件停用时                           |
| `errorCaptured`       | `errorCaptured`              | `onErrorCaptured`           | 捕获一个来自子孙组件的错误时调用                       |
| —                     | `renderTracked`              | `onRenderTracked`           | 调试钩子，响应式依赖被收集时调用                       |
| —                     | `renderTriggered`            | `onRenderTriggered`         | 调试钩子，响应式依赖被触发时调用                       |
| —                     | `serverPrefetch`             | `onServerPrefetch`          | 组件实例在服务器上被渲染前调用                         |

**关于Vue 3中的生命周期建议阅读官方文档!!!!**

[组合式 API：生命周期钩子--官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vuejs.org%2Fapi%2Fcomposition-api-lifecycle.html)
[选项式 API：生命周期选项--官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vuejs.org%2Fapi%2Foptions-lifecycle.html)

**父子组件的生命周期：**

- `加载渲染阶段`：父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted
- `更新阶段`：父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated
- `销毁阶段`：父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

### Vue.$nextTick

**在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。**

`nextTick` 是 Vue 提供的一个全局 API，由于 Vue 的异步更新策略，导致我们对数据修改后不会直接体现在 DOM 上，此时如果想要立即获取更新后的 DOM 状态，就需要借助该方法。

Vue 在更新 DOM 时是异步执行的。当数据发生变化，Vue 将开启一个异步更新队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 `watcher` 被多次触发，只会被推入队列一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。`nextTick`方法会在队列中加入一个回调函数，确保该函数在前面的 DOM 操作完成后才调用。

使用场景：

1. 如果想要在修改数据后立刻得到更新后的`DOM`结构，可以使用`Vue.nextTick()`
2. 在`created`生命周期中进行`DOM`操作

### Vue 实例挂载过程中发生了什么？

挂载过程指的是 `app.mount()`过程，这是一个初始化过程，整体上做了两件事情：`初始化`和`建立更新机制`。

初始化会创建组件实例、初始化组件状态、创建各种响应式数据。

建立更新机制这一步会立即执行一次组件的更新函数，这会首次执行组件渲染函数并执行`patch`将`vnode` 转换为 `dom`； 同时首次执行渲染函数会创建它内部响应式数据和组件更新函数之间的依赖关系，这使得以后数据发生变化时会执行对应的更新函数。

### Vue 的模版编译原理

Vue 中有个独特的编译器模块，称为`compiler`，它的主要作用是将用户编写的`template`编译为js中可执行的`render`函数。
 在Vue 中，编译器会先对`template`进行解析，这一步称为`parse`，结束之后得到一个JS对象，称之为`抽象语法树AST`；然后是对`AST`进行深加工的转换过程，这一步称为`transform`，最后将前面得到的`AST`生成JS代码，也就是`render`函数。

### Vue 的响应式原理

1. Vue 2 中的数据响应式会根据数据类型做不同的处理。如果是对象，则通过

   ```
   Object.defineProperty(obj,key,descriptor)
   ```

   拦截对象属性访问，当数据被访问或改变时，感知并作出反应；如果是数组，则通过覆盖数组原型的方法，扩展它的7个变更方法（push、pop、shift、unshift、splice、sort、reverse），使这些方法可以额外的做更新通知，从而做出响应。

   缺点：

   - 初始化时的递归遍历会造成性能损失；
   - 通知更新过程需要维护大量 `dep` 实例和 `watcher` 实例，额外占用内存较多；
   - 新增或删除对象属性无法拦截，需要通过 `Vue.set` 及 `delete` 这样的 API 才能生效；
   - 对于`ES6`中新产生的`Map`、`Set`这些数据结构不支持。

2. Vue 3 中利用`ES6`的`Proxy`机制代理需要响应化的数据。可以同时支持对象和数组，动态属性增、删都可以拦截，新增数据结构均支持，对象嵌套属性运行时递归，用到时才代理，也不需要维护特别多的依赖关系，性能取得很大进步。

### 虚拟DOM

1. 概念：
    虚拟DOM，顾名思义就是虚拟的DOM对象，它本身就是一个JS对象，只不过是通过不同的属性去描述一个视图结构。
2. 虚拟DOM的好处：
    (1) 性能提升
    直接操作DOM是有限制的，一个真实元素上有很多属性，如果直接对其进行操作，同时会对很多额外的属性内容进行了操作，这是没有必要的。如果将这些操作转移到JS对象上，就会简单很多。另外，操作DOM的代价是比较昂贵的，频繁的操作DOM容易引起页面的重绘和回流。如果通过抽象VNode进行中间处理，可以有效减少直接操作DOM次数，从而减少页面的重绘和回流。
    (2) 方便跨平台实现
    同一VNode节点可以渲染成不同平台上对应的内容，比如：渲染在浏览器是DOM元素节点，渲染在Native（iOS、Android）变为对应的控件。Vue 3 中允许开发者基于VNode实现自定义渲染器（renderer），以便于针对不同平台进行渲染。
3. 结构：
    没有统一的标准，一般包括`tag`、`props`、`children`三项。
    `tag`：必选。就是标签，也可以是组件，或者函数。
    `props`：非必选。就是这个标签上的属性和方法。
    `children`：非必选。就是这个标签的内容或者子节点。如果是文本节点就是字符串；如果有子节点就是数组。换句话说，如果判断`children`是字符串的话，就表示一定是文本节点，这个节点肯定没有子元素。

### diff 算法

由于目前`Vue3`对于性能的优化做了很多的处理，所以其在更新时并不会对所有的节点都进行`diff`更新。目前会进行`diff`更新的有以下两种情况：

- `v-for`容器节点
- 自写的`render()`函数

还有一种特殊情况会进行无`diff`的按序更新，这种更新是全替换模式，非常耗时：

- 无`key`值的`v-for`语句，此时会打上`UNKEYED_FRAGMENT`标记

注意，`Vue3`没有主动提供片段这个功能，仅会在出现以下写法时会生成片段：

- 一个组件有多个根节点，会生成一个片段包裹，此时其为稳定片段(`STABLE_FRAGMENT`)
- `v-for`语句，会生成一个片段包裹
- `v-if`语句，有多个子节点或不为单个文本节点，会生成一个片段包裹(`STABLE_FRAGMENT`)

> 本文上述论点都是基于浏览器环境，非*NodeJS*环境(*SSR*)。文中提供的代码进行了**适当的简化**。

在我们使用`template`的情况下，更新基本上会通过`block`进行更新——即节点自更新

#### diff 更新

##### VUE2

![image-20230528150909234](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528150909234.png)



![image-20230528150936549](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528150936549.png)



![image-20230528151019742](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151019742.png)



![image-20230528151119230](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151119230.png)

第一次对比后结果

![image-20230528151309763](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151309763.png)

第二次

![image-20230528151400771](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151400771.png)

第三次

![image-20230528151428703](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151428703.png)

最后整理

![image-20230528151504941](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528151504941.png)

##### VUE3

`diff`更新调用的内部的`patchKeyedChildren`方法，其大致流程分为三步：

1. 对比新旧节点头部相同指针的节点，相同则进行`diff`，不同则跳转下一步。
2. 对比新旧节点尾部指针指向节点，相同则进行`diff`，不同则跳转下一步。
3. 此时剩余新旧节点，可能存在乱序、已移除或新增的情况，进行特殊处理来更新。

下面是函数最开始做的初始化，其中`c1/c2`分别代表新旧节点的子节点数组；`i`表示两个新旧节点指向同步的指针，它们是同步的；`e1/e2`分别代表指向两个子节点数组尾部的指针：

```js
let i = 0
const l2 = c2.length

// 变更前节点的尾下标
let e1 = c1.length - 1 // prev ending index

// 变更后节点的尾下标
let e2 = l2 - 1 // next ending index
```

其中`patch()`函数用于对节点进行更新，`isSameVNodeType()`函数用于判断两个节点是否具有相同的类型，此时其需要满足类型一样且`key`值相等。

> 这里的类型指，例如组件，则其为组件的配置对象，元素则为元素的标记。



#### 1. 对比头部等位指针节点

首先其会从头部指针开始，对比新旧节点是否相同：

```js
js复制代码// 1. sync from start
// 1. 从开始位置同步
// (a b) c
// (a b) d e
while (i <= e1 && i <= e2) {
  const n1 = c1[i]
  const n2 = c2[i]

  // 节点没有发生变更时，进行patch
  if (isSameVNodeType(n1, n2)) {
    patch(n1, n2)
    // 不同节点时，立刻结束
  } else {
    break
  }
  i++
}
```

注释中给出了一个例子，即如果存在下图的新旧队列：

![image-20230527224906472](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527224906472.png)

由于此时两个指针的`VNode`相同，那么可以复用则直接进行`patch()`更新。之后指针向右移动一位，对比两个数组下标为 `1` 的位置：

![image-20230527225018797](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527225018797.png)

同样的，节点相同，进行更新然后指针向后移动：

![image-20230527225137121](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527225137121.png)



此时两个节点不一样了，那么本次头部对比到此结束。到此我们排除了头部位置可复用的节点，接下来那么肯定是排除尾部位置的可复用节点。

### 2. 对比尾部等位指针节点

尾部的可复用节点检查方法与头部一样，唯一一点不同的是，它们有各自的指针分别指向子节点数组尾部。所以此时要使用两个指针`e1/e2`。

以此时要使用两个指针`e1/e2`。

```js
js复制代码// 2. sync from end
// 2. 从尾部位置开始查找
// a (b c)
// d e (b c)
while (i <= e1 && i <= e2) {
  const n1 = c1[e1]
  const n2 = c2[e2]
  if (isSameVNodeType(n1, n2)) {
    patch(n1, n2)
  } else {
    break
  }
  e1--
  e2--
}
```

还是按注释中的例子放图：

![image-20230527225256542](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527225256542.png)

当前指针指向节点相同，节点可复用，直接更新，同时指针向前一起移动：

![image-20230527225417598](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527225417598.png)

当前指针指向节点相同，节点可复用，直接更新，同时指针向前一起移动：

![](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527225513256.png)



此时，两个指针指向节点不再相同，停止此处的对比。

------

经过前两步的处理，新旧队列已经进一步缩短了，此时剩下的节点就可能存在下面三种情况：

- 有新增的节点
- 有节点被删除了
- 相同的节点，但是移动了位置

在实际的场景中，那么就只能存在下面三种剩余情况：

- 仅有新增的节点(此时一定`i > e1`)
- 仅进行了节点删除(此时一定`i > e2`)
- 乱序的，一定有移动的节点，其中可能包含新增或有删除的节点(此时一定有`i <= e2`且`i <= e1`)

`Vue`按处理的简易程度，`Vue`先对前两种情况进行了单独的处理，再对三种混有的情况进行了处理。

#### 3.1 处理新增的节点的单独情况

判断新增的节点是以旧队列为基准，那么此时的情况是这样的：

![image-20230527230120660](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527230120660.png)



或新增的节点在首部：

![image-20230527230226562](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527230226562.png)



此时会存在这样的情况`e1 < i`且`e2 >= i`，那么我们只需要更新`e1 => i`间的节点即可，于是有了这些代码：

```js
// 3. common sequence + mount
// 3. 有新增的节点时
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i <= e2) {
  if (i > e1) {
    //  当前节点后面的节点
    const nextPos = e2 + 1

    // 我们要以这个节点为锚点在其之前添加元素，没有则添加到父节点最后
    const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor
    while (i <= e2) {
      patch(null, c2[i])
      i++
    }
  }
}
```

#### 3.2 处理删除节点的单独情况

如果没有存在仅有新增节点的情况，那么其会判断是否是仅进行删除节点的情况，此时可能出现下图的两种情况：

删除节点在尾部：

![](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527230416959.png)



删除节点在尾部：

![image-20230527230458558](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527230458558.png)



此时`i > e2`，那么我们只需要将旧节点数组中`i => e1`之间的所有节点删除即可(下面的`else if`语句承接上面)：

```js
js复制代码// 4. common sequence + unmount
// 4. 节点移除
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
else if (i > e2) {
  while (i <= e1) {
    // 移除原节点
    unmount(c1[i])
    i++
  }
}
```

#### 3.3 乱序，但一定有移动的节点的情况

最后一种情况就是比较复杂的情况，此时`Vue`做的处理是，先查看旧节点序列在变为新节点序列后，旧节点序列中是否有些节点还是按现在的顺序排列的(可以间断)，此时只对其余变更的节点进行操作，就能进行最小幅度的`DOM`操作了。

> 此时相对于求旧节点的最长递增序列，这里你可以会想到为什么不求最小编辑距离，因为最小编辑距离的时间复杂度在大多数情况下比它高

##### 3.3.1 建立新节点 key 与其下标的映射

首先，`Vue`先将新节点数组进行遍历，将它们有`key`值的节点与其在新节点数组中的下标建立映射，存储在`keyToNewIndexMap`中，方便在复用时查找：

```js
const s1 = i // prev starting index
const s2 = i // next starting index

// 5.1 build key:index map for newChildren
// 5.1 生成一个key map
const keyToNewIndexMap = new Map()

// 遍历新节点，乱序的部分，将这些具有key的节点存入map
for (i = s2; i <= e2; i++) {
  const nextChild = c2[i]
  if (nextChild.key != null) {
    keyToNewIndexMap.set(nextChild.key, i)
  }
}
```

##### 3.3.2 移除新节点队列中不存在的旧节点并更新复用节点

之后，遍历旧节点数组，通过刚刚建立的`Map`，如果当前旧节点在新节点数组中已经不存在了，那么说明要移除了。

整个过程比较复杂，因为要预先做处理，为后续是否需要移动节点做准备：

```js
// 5.2 loop through old children left to be patched and try to patch
// matching nodes & remove nodes that are no longer present
// 5.2 遍历旧节点，patch匹配的节点，移除不再在节点
let j

// 当前处理过的节点数
let patched = 0

// 需要patch的节点数
const toBePatched = e2 - s2 + 1

// 是否需要移动节点
let moved = false

// used to track whether any node has moved
// 记录节点是否已经移动
let maxNewIndexSoFar = 0

// works as Map<newIndex, oldIndex>
// Note that oldIndex is offset by +1
// and oldIndex = 0 is a special value indicating the new node has
// no corresponding old node.
// 注意旧下标的值都会+1，因为0表示没有对应的旧节点
// used for determining longest stable subsequence
// 新下标与旧下标的map
// 这里的新下标以s2位置为0下标，而旧下标为旧下标值 +１
const newIndexToOldIndexMap = new Array(toBePatched)

// 初始化值为0
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
```

这里我说明下三个变量，首先是`newIndexToOldIndexMap`，其用来记录节点的新坐标到旧坐标的映射(当然是节点可复用的情况下)。为了后续计算最长递增子序列，所以其新坐标以`s2`为起点，长度为当前需要处理的节点总数，并且其存入的旧节点下标要在原值的基础上`+ 1`(因为`0`表示当前节点没有对应的旧节点)。举个例子，有如下图一样的更新序列：

![image-20230527230956800](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230527230956800.png)

那么节点`e`存入`newIndexToOldIndexMap`后为：

```js
// 展示，不是赋值语句
newIndexToOldIndexMap = [4, 0, 0, 0]
```

其余全部节点存入后为：

```js
// 展示，不是赋值语句
newIndexToOldIndexMap = [4, 3, 2, 0]
```

`moved`变量则是表示是否有节点需要移动，其判定要基于`maxNewIndexSoFar`的值。

`maxNewIndexSoFar`表示当前可复用节点距离`s2`(即第一个乱序节点的最远距离)。如果有对应可以复用的节点，那么在每次迭代处理节点时，如果当前节点所处位置距离`s2`距离超过`maxNewIndexSoFar`，那么`maxNewIndexSoFar`会更新为当前节点在新队列中的下标；当其小于`maxNewIndexSoFar`时，就会标记`moved = true`。

```js
// 判断是否需要移动当前节点，想象一下，如果每个节点都按序递增，
// 那么每次都会进入该if语句
if (newIndex >= maxNewIndexSoFar) {
  // 当前节点未移动，更新下标
  maxNewIndexSoFar = newIndex

  // 如果进入该else语句说明有节点之前节点交叉了
} else {
  moved = true
}
```

想象一下，如果节点在新旧序列中，都是按照相同的顺序递增，那么`maxNewIndexSoFar`也会一直递增，即每次迭代`newIndex >= maxNewIndexSoFar`，那么就不需要移动节点；但是如果某次迭代，`newIndex < maxNewIndexSoFar`，那么说明当前节点由之前靠后的位置移动了现在靠前的位置。

就拿刚刚乱序的图举例，第一次迭代`c`节点的`newIndex = 4`，则`maxNewIndexSoFar = 4`；第二次迭代`d`节点时，其`newIndex = 3`，此时`newIndex < maxNewIndexSoFar`，说明`c/d`节点之间的位置在新旧发生了交叉，所以我们至少需要移动它们其中一个节点。

理解了这个道理，现在我们可以正式看看这段代码了。由于要卸载节点，那么本次遍历要以`s1 <-> e1`之间的节点为基准进行遍历，整体遍历代码如下：

```js
// 遍历旧节点
for (i = s1; i <= e1; i++) {
  // 当前下标的旧节点
  const prevChild = c1[i]

  // 当前patch的节点数超过新节点中要patch的总数时，执行unmount操作
  // 直接进行卸载操作，因为多余的节点不需要了
  if (patched >= toBePatched) {
    // all new children have been patched so this can only be a removal
    unmount(prevChild)
    continue
  }

  // 尝试寻找是否有对应的新节点
  let newIndex

  // 旧节点具有key时，获取相同key值节点所处的下标
  if (prevChild.key != null) {
    newIndex = keyToNewIndexMap.get(prevChild.key)

    // 没有key时则找相同类型的节点是否存在
  } else {
    // key-less node, try to locate a key-less node of the same type
    // 当前查找范围为新节点中需要patch的节点之间
    for (j = s2; j <= e2; j++) {
      if (
        // 0表示对应下标下当前还未有节点(注意当前是以s2为0下标基准)
        // 这里确认当前新下标位置未有对应的旧下标，防止是已在map中的节点

        newIndexToOldIndexMap[j - s2] === 0 &&
        isSameVNodeType(prevChild, c2[j])
      ) {
        newIndex = j
        break
      }
    }
  }

  // 没找到对应节点时说明该节点已经不存在了，直接进行unmount
  if (newIndex === undefined) {
    unmount(prevChild)

    // 找到时进行位置移动操作，并patch
  } else {
    // 将旧节点位置下标+1后存入，新节点以s2为起点，即0坐标
    newIndexToOldIndexMap[newIndex - s2] = i + 1

    // 判断是否需要移动当前节点，想象一下，如果每个节点都按序递增，
    // 那么每次都会进入该if语句
    if (newIndex >= maxNewIndexSoFar) {
      // 当前节点未移动，更新下标
      maxNewIndexSoFar = newIndex

      // 如果进入该else语句说明有节点之前节点交叉了
    } else {
      moved = true
    }

    // patch该节点
    patch(prevChild, c2[newIndex])
    patched++
  }
}
```

首先当当前可复用的节点复用时，会使`patched`值`+1`，当复用的节点超过乱序的新节点长度时，那么其余的节点肯定是要卸载的节点(因为新节点序列都处理完毕了)：

```js
if (patched >= toBePatched) {
    // all new children have been patched so this can only be a removal
    unmount(prevChild)
    continue
  }
```

之后，`Vue`尝试寻找一下当前旧节点是否被复用，即它被移动到了新节点序列的其他位置。首先如果当前节点有`key`值，那么其会尝试直接从刚刚的`keyToNewIndexMap`中查找；如果没有找到，那么其会遍历当前所有的新节点序列，依次对比是否与当前节点相同，在复合同类型节点时对其进行复用。

```js
// 尝试寻找是否有对应的新节点
let newIndex

// 旧节点具有 key 时，获取相同 key 值节点所处的下标
if (prevChild.key != null) {
  newIndex = keyToNewIndexMap.get(prevChild.key)

  // 没有key时则找相同类型的节点是否存在
} else {
  // key-less node, try to locate a key-less node of the same type
  // 当前查找范围为新节点中需要 patch 的节点之间
  for (j = s2; j <= e2; j++) {
    if (
      // 0 表示对应下标下当前还未有节点(注意当前是以 s2 为 0 下标基准)
      // 这里确认当前新下标位置未有对应的旧下标，防止是已在 map 中的节点
      newIndexToOldIndexMap[j - s2] === 0 &&
      isSameVNodeType(prevChild, c2[j])
    ) {
      newIndex = j
      break
    }
  }
}
```

在直接通过类型查找复用节点时，其存在一个`newIndexToOldIndexMap[j - s2] === 0`条件，它表示当前新节点下标未有对应的旧节点(`0`表示没有，在之后的代码中，如果查找到对应的`newIndex`，其会存入`newIndexToOldIndexMap`中)。这样可以防止新旧节点被重复复用或已被处理再次被处理。

到此，对于旧节点的`newIndex`是否被查找到就会出现两种情况了：

1. 没有，说明当前节点已删除了，移除该`DOM`节点
2. 有，复用，**更新节点属性**

```js
// 没找到对应节点时说明该节点已经不存在了，直接进行unmount
if (newIndex === undefined) {
  unmount(prevChild)

  // 找到时进行位置移动操作，并patch
} else {
  // 将旧节点位置下标+1后存入，新节点以s2为起点，即0坐标
  newIndexToOldIndexMap[newIndex - s2] = i + 1

  // 判断是否需要移动当前节点，想象一下，如果每个节点都按序递增，
  // 那么每次都会进入该if语句
  if (newIndex >= maxNewIndexSoFar) {
    // 当前节点未移动，更新下标
    maxNewIndexSoFar = newIndex

    // 如果进入该else语句说明有节点之前节点交叉了
  } else {
    moved = true
  }

  // patch该节点
  patch(prevChild, c2[newIndex])
  patched++
}
```

在复用的情况下，有我们刚刚提到的[计算节点交叉(是否需要移动)](#332-移除新节点队列中不存在的旧节点并更新复用节点)的场景：

```js
// 判断是否需要移动当前节点，想象一下，如果每个节点都按序递增，
// 那么每次都会进入该if语句
if (newIndex >= maxNewIndexSoFar) {
  // 当前节点未移动，更新下标
  maxNewIndexSoFar = newIndex

  // 如果进入该else语句说明有节点之前节点交叉了
} else {
  moved = true
}
```

这里就不赘述了。

> 注意，这里对复用的节点进行了`patch()`更新，那么后面就只用进行移动即可，而不需要更新了。

#### 3.3.3 处理新增节点与移动的节点

到此为止，就只有新增节点与移动节点的情况没有处理了。

首先其会需要移动节点时(`moved = true`)根据刚刚创建的`newIndexToOldIndexMap`生成一个最长递增的新节点序列`increasingNewIndexSequence`。

```js
js复制代码// 5.3 move and mount
// 5.3 移动与mount
// generate longest stable subsequence only when nodes have moved
// 有节点需要移动，生成长期稳定的子序列，仅对移动过的节点处理
const increasingNewIndexSequence = moved
  ? // 获取最长递增子序列的下标数组
    getSequence(newIndexToOldIndexMap)
  : EMPTY_ARR
```

那么这个序列的作用是什么？它就是用来**辅助移动节点**，而且是在最小次数下移动节点。由于`newIndexToOldIndexMap`是根据新旧节点之间的映射创建的，其**下标天然代表乱序的新节点数组的顺序**，而且其对应下标中存储的元素也代表该新节点复用的旧节点的下标，那么这里我们就可以看到两个序列：

1. 新节点下标组成的序列(**递增**的，因为我们以它为基准创建的数组)
2. `newIndexToOldIndexMap`中旧节点下标组成的序列，可能递增也可能乱序

> 关于如何求[最长递增子序列](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLongest_increasing_subsequence)，请单独自行学习，这里就不说明了。

此时倘若旧节点下标组成的序列**也**呈现递增趋势，那么我们便可以操作那些非递增的节点来达到变更为新节点序列的目的。并且这个递增的序列越长，那么我们要操作(移动)的节点就越少。比如下图的情况：

![image-20230528124733993](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528124733993.png)

从图中观察，我们可以清楚的看到`c/d`两个节点在前后都保持了递增的关系，那么此时我们只需要移动`e`节点与创建`h`节点即可。

此时其`newIndexToOldIndexMap`为：

```js
js复制代码newIndexToOldIndexMap = [4, 2, 3, 0]

// 该数组返回的是对应的元素在newIndexToOldIndexMap的下标
// 而并非实际的旧节点下标
increasingNewIndexSequence = [1, 2]
```

可以看到`2、3`节点与新节点的下标的**递增关系保持一致**，其最长递增子序列(`increasingNewIndexSequence`)为`[1, 2]`，此时我们只需要操作`4/0`两个节点即可。

> `increasingNewIndexSequence`返回的结果为对应的元素在 `newIndexToOldIndexMap`的下标而并非实际的旧节点下标

明白了这个现在我们来看其具体处理的代码：

```js
// 获取递增序列的尾坐标
j = increasingNewIndexSequence.length - 1

// looping backwards so that we can use last patched node as anchor
// 向后循环，这样我们可以用上一个patch过了的节点做锚点
for (i = toBePatched - 1; i >= 0; i--) {
  // 当前要处理的新节点下标及其节点
  const nextIndex = s2 + i
  const nextChild = c2[nextIndex]

  // 获取其后一个节点，如果没有则获取其父节点
  const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor

  // 如果当前新旧节点Map中未找到当前位置新节点的旧节点信息，
  // 说明是新增节点
  if (newIndexToOldIndexMap[i] === 0) {
    // mount new
    patch(null, nextChild)

    // moved说明有节点需要移动，通过塑造一个递增序列，处于递增序列的节点就可以
    // 不进行移动，只移动其余节点，这样就减少了节点的移动
  } else if (moved) {
    // 如果存在以下情况则移动：
    // 1. 没有稳定的子序列
    // 2. 当前节点不在这个稳定的子序列中
    // move if:
    // There is no stable subsequence (e.g. a reverse)
    // OR current node is not among the stable sequence
    if (j < 0 || i !== increasingNewIndexSequence[j]) {
      move(nextChild, container, anchor)
    } else {
      j--
    }
  }
}
```

本次遍历以新节点的乱序序列(`s2 <-> e2`)为基准，逆向进行遍历。逆向的原因是因为其在新增节点或更新节点时，可以以后面已经操作过的节点为锚点进行更新(想象一下`Node.insertBefore()/Node.appendChild()`的参数)。

每次遍历会出现三种情况：

- 当前节点未有对应的旧节点下标，则说明是新增节点
- 该节点需要移动，进行移动
- 该节点与旧节点序列都保持递增顺序，直接跳过即可(实际反应在代码里面就是没做任何处理)

> 情况`2`与`3`在完整的迭代中是互斥的，两者不会同时出现在整个迭代流程中。

第一种情况，比较简单，这里就不解释了：

```js
// 如果当前新旧节点Map中未找到当前位置新节点的旧节点信息，
// 说明是新增节点
if (newIndexToOldIndexMap[i] === 0) {
  // mount new
  patch(null, nextChild
}
```

第二种情况要判定`moved = true`，它的原理[之前我们已经解释过了](#332-移除新节点队列中不存在的旧节点并更新复用节点)。这里我们要关注的是它的函数体。根据我们刚刚对递增子序列的理解，那么其应该会在以下情况移动或不移动节点：

- 当前节点处于最长递增子序列中 —— 跳过
- 当前节点不存在最长递增子序列中 —— 移动
  - 递增序列已经没有需要跳过的节点了但任存在节点需要更新(实际和不存在的情况一样)
  - 当前节点不存在最长递增子序列

```js
// 如果存在以下情况则移动：
// 1. 没有稳定的子序列(实际和情况2一致，反序时会返回任意一个节点作为最长序列)
// 2. 当前节点不在这个稳定的子序列中
// move if:
// There is no stable subsequence (e.g. a reverse)
// OR current node is not among the stable sequence
if (j < 0 || i !== increasingNewIndexSequence[j]) {
  // 将当前节点移动到锚点节点前或容器节点最后(没有锚点时)
  move(nextChild, container, anchor)
} else {
  j--
}
```

![image-20230528124834143](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528124834143.png)

在第二次更新中，发现`d`节点存在于单调增序列中，所以本次更新可以跳过：

![image-20230528124910205](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528124910205.png)

同理`c`节点也一样，这里就不放图了，处理完`c`节点后此时为这样

![image-20230528124931580](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528124931580.png)

此时`e`节点可复用，则将其移动到新`c`节点前即可。

到此为止，上图的`diff`就结束了。

对于第三种情况，由于复用的节点在前后都保持了递增的关系，所以此时我们不需要再重复对节点进行处理，所以遇到复用的节点时直接跳过即可：

![image-20230528125006064](https://raw.githubusercontent.com/why862555625/images/main/images/image-20230528125006064.png)

到此为止全部节点的更新就已经完毕了。

### 为什么组件中的 data 是一个函数？

在 new Vue() 中，可以是函数也可以是对象，因为根实例只有一个，不会产生数据污染。

在组件中，data 必须为函数，目的是为了防止多个组件实例对象之间共用一个 data，产生数据污染；而采用函数的形式，initData 时会将其作为工厂函数都会返回全新的 data 对象。

### Vue 中组件间的通信方式？

1. 父子组件通信：

   父向子传递数据是通过`props`，子向父是通过`$emit`触发事件；通过父链/子链也可以通信（`$parent`/`$children`）；`ref`也可以访问组件实例；`provide`/`inject`；`$attrs`/`$listeners`。

2. 兄弟组件通信：

   全局事件总线`EventBus`、`Vuex`。

3. 跨层级组件通信：

   全局事件总线`EventBus`、`Vuex`、`provide`/`inject`。

### v-show 和 v-if 的区别？

1. 控制手段不同。`v-show`是通过给元素添加 css 属性`display: none`，但元素仍然存在；而`v-if`控制元素显示或隐藏是将元素整个添加或删除。
2. 编译过程不同。`v-if`切换有一个局部编译/卸载的过程，切换过程中合适的销毁和重建内部的事件监听和子组件；`v-show`只是简单的基于 css 切换。
3. 编译条件不同。`v-if`是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建，渲染条件为假时，并不做操作，直到为真才渲染。
4. 触发生命周期不同。`v-show`由 false 变为 true 的时候不会触发组件的生命周期；`v-if`由 false 变为 true 的时候，触发组件的`beforeCreate`、`created`、`beforeMount`、`mounted`钩子，由 true 变为 false 的时候触发组件的`beforeDestory`、`destoryed`钩子。
5. 性能消耗不同。`v-if`有更高的切换消耗；`v-show`有更高的初始渲染消耗。

使用场景：
 如果需要非常频繁地切换，则使用`v-show`较好，如：手风琴菜单，tab 页签等； 如果在运行时条件很少改变，则使用`v-if`较好，如：用户登录之后，根据权限不同来显示不同的内容。

### computed 和 watch 的区别？

- `computed`计算属性，依赖其它属性计算值，内部任一依赖项的变化都会重新执行该函数，计算属性有缓存，多次重复使用计算属性时会从缓存中获取返回值，计算属性必须要有`return`关键词。
- `watch`侦听到某一数据的变化从而触发函数。当数据为对象类型时，对象中的属性值变化时需要使用深度侦听`deep`属性，也可在页面第一次加载时使用立即侦听`immdiate`属性。

运用场景：
 计算属性一般用在模板渲染中，某个值是依赖其它响应对象甚至是计算属性而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。

### v-if 和 v-for 为什么不建议放在一起使用？

Vue 2 中，`v-for`的优先级比`v-if`高，这意味着`v-if`将分别重复运行于每一个`v-for`循环中。如果要遍历的数组很大，而真正要展示的数据很少时，将造成很大的性能浪费。

Vue 3 中，则完全相反，`v-if`的优先级高于`v-for`，所以`v-if`执行时，它调用的变量还不存在，会导致异常。

通常有两种情况导致要这样做：

- 为了过滤列表中的项目，比如：`v-for = "user in users" v-if = "user.active"`。这种情况，可以定义一个计算属性，让其返回过滤后的列表即可。
- 为了避免渲染本该被隐藏的列表，比如`v-for = "user in users"  v-if = "showUsersFlag"`。这种情况，可以将`v-if`移至容器元素上或在外面包一层`template`即可。

### Vue 2中的set方法？

[`set`是Vue 2中的一个全局API](https://link.juejin.cn?target=https%3A%2F%2Fv2.cn.vuejs.org%2Fv2%2Fapi%2F%23Vue-set)。可手动添加响应式数据，解决数据变化视图未更新问题。当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，会发现页面并没有更新。这是因为`Object.defineProperty()`的限制，监听不到数据变化，可通过`this.$set(数组或对象，数组下标或对象的属性名，更新后的值)`解决。

### keep-alive 是什么？

- 作用：实现组件缓存，保持组件的状态，避免反复渲染导致的性能问题。
- 工作原理：Vue.js 内部将 DOM 节点，抽象成了一个个的 VNode 节点，`keep-alive`组件的缓存也是基于 VNode 节点的。它将满足条件的组件在 cache 对象中缓存起来，重新渲染的时候再将 VNode 节点从 cache 对象中取出并渲染。
- 可以设置以下属性：
   ① `include`：字符串或正则，只有名称匹配的组件会被缓存。
   ② `exclude`：字符串或正则，任何名称匹配的组件都不会被缓存。
   ③ `max`：数字，最多可以缓存多少组件实例。
   匹配首先检查组件的`name`选项，如果`name`选项不可用，则匹配它的局部注册名称（父组件 components选项的键值），匿名组件不能被匹配。

如果同时使用了`include`、`exclude`，那么`exclude`的优先级高于`include`。

设置了`keep-alive`缓存的组件，会多出两个生命周期钩子：`activated`、`deactivated`。
 首次进入组件时：beforeCreate --> created --> beforeMount --> mounted --> activated --> beforeUpdate --> updated --> deactivated
 再次进入组件时：activated --> beforeUpdate --> updated --> deactivated

### mixin

`mixin`（混入）， 它提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。

使用场景： 不同组件中经常会用到一些相同或相似的代码，这些代码的功能相对独立。可以通过mixin 将相同或相似的代码提出来。

缺点：

1. 变量来源不明确
2. 多 mixin 可能会造成命名冲突（解决方式：Vue 3的组合API）
3. mixin 和组件出现多对多的关系，使项目复杂度变高。

### 插槽

`slot`插槽，一般在组件内部使用，封装组件时，在组件内部不确定该位置是以何种形式的元素展示时，可以通过`slot`占据这个位置，该位置的元素需要父组件以内容形式传递过来。`slot`分为：

- `默认插槽`：子组件用`<slot>`标签来确定渲染的位置，标签里面可以放`DOM`结构作为后备内容，当父组件在使用的时候，可以直接在子组件的标签内写入内容，该部分内容将插入子组件的`<slot>`标签位置。如果父组件使用的时候没有往插槽传入内容，后备内容就会显示在页面。
- `具名插槽`：子组件用`name`属性来表示插槽的名字，没有指定`name`的插槽，会有隐含的名称叫做 `default`。父组件中在使用时在默认插槽的基础上通过`v-slot`指令指定元素需要放在哪个插槽中，`v-slot`值为子组件插槽`name`属性值。使用`v-slot`指令指定元素放在哪个插槽中，必须配合`<template>`元素，且一个`<template>`元素只能对应一个预留的插槽，即不能多个`<template>` 元素都使用`v-slot`指令指定相同的插槽。`v-slot`的简写是`#`，例如`v-slot:header`可以简写为`#header`。
- 作用域插槽：子组件在<slot>标签上绑定props数据，以将子组件数据传给父组件使用。父组件获取插槽绑定 props 数据的方法：
  1. scope="接收的变量名"：`<template scope="接收的变量名">`
  2. slot-scope="接收的变量名"：`<template slot-scope="接收的变量名">`
  3. v-slot:插槽名="接收的变量名"：`<template v-slot:插槽名="接收的变量名">`

### Vue 中的修饰符有哪些？

在Vue 中，修饰符处理了许多 DOM 事件的细节，让我们不再需要花大量的时间去处理这些烦恼的事情，而能有更多的精力专注于程序的逻辑处理。Vue中修饰符分为以下几种：

1. 表单修饰符
    `lazy` 填完信息，光标离开标签的时候，才会将值赋予给value，也就是在`change`事件之后再进行信息同步。
    `number` 自动将用户输入值转化为数值类型，但如果这个值无法被`parseFloat`解析，则会返回原来的值。
    `trim` 自动过滤用户输入的首尾空格，而中间的空格不会被过滤。

2. 事件修饰符
    `stop` 阻止了事件冒泡，相当于调用了`event.stopPropagation`方法。
    `prevent` 阻止了事件的默认行为，相当于调用了`event.preventDefault`方法。
    `self` 只当在 `event.target` 是当前元素自身时触发处理函数。
    `once` 绑定了事件以后只能触发一次，第二次就不会触发。
    `capture` 使用事件捕获模式，即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理。
    `passive` 告诉浏览器你不想阻止事件的默认行为。
    `native` 让组件变成像`html`内置标签那样监听根元素的原生事件，否则组件上使用 `v-on` 只会监听自定义事件。

3. 鼠标按键修饰符
    `left` 左键点击。
    `right` 右键点击。
    `middle` 中键点击。

4. 键值修饰符

   键盘修饰符是用来修饰键盘事件（onkeyup，onkeydown）的，有如下：keyCode

   存在很多，但vue为我们提供了别名，分为以下两种：

   - 普通键（enter、tab、delete、space、esc、up...）
   - 系统修饰键（ctrl、alt、meta、shift...）

### 对 SPA 的理解？

1. 概念：
    `SPA（Single-page  application）`，即单页面应用，它是一种网络应用程序或网站的模型，通过动态重写当前页面来与用户交互，这种方法避免了页面之间切换时打断用户体验。在`SPA`中，所有必要的代码（HTML、JavaScript 和 CSS）都通过单个页面的加载而检索，或者根据需要（通常是响应用户操作）动态装载适当的资源并添加到页面。页面在任何时间点都不会重新加载，也不会将控制转移到其他页面。举个例子，就像一个杯子，上午装的是牛奶，中午装的是咖啡，下午装的是茶，变得始终是内容，杯子始终不变。

2. `SPA`与`MPA`的区别：
    `MPA（Muti-page application）`，即多页面应用。在`MPA`中，每个页面都是一个主页面，都是独立的，每当访问一个页面时，都需要重新加载 Html、CSS、JS 文件，公共文件则根据需求按需加载。

   |                 | SPA                       | MPA                                 |
   | --------------- | ------------------------- | ----------------------------------- |
   | 组成            | 一个主页面和多个页面片段  | 多个主页面                          |
   | url模式         | hash模式                  | history模式                         |
   | SEO搜索引擎优化 | 难实现，可使用SSR方式改善 | 容易实现                            |
   | 数据传递        | 容易                      | 通过url、cookie、localStorage等传递 |
   | 页面切换        | 速度快，用户体验良好      | 切换加载资源，速度慢，用户体验差    |
   | 维护成本        | 相对容易                  | 相对复杂                            |

3. `SPA`的优缺点：
    优点：

   - 具有桌面应用的即时性、网站的可移植性和可访问性
   - 用户体验好、快，内容的改变不需要重新加载整个页面
   - 良好的前后端分离，分工更明确

   缺点：

   - 不利于搜索引擎的抓取
   - 首次渲染速度相对较慢

### 双向绑定？

1. 概念：
    Vue 中双向绑定是一个指令`v-model`，可以绑定一个响应式数据到视图，同时视图的变化能改变该值。`v-model`是语法糖，默认情况下相当于`:value`和`@input`，使用`v-model`可以减少大量繁琐的事件处理代码，提高开发效率。
2. 使用：
    通常在表单项上使用`v-model`，还可以在自定义组件上使用，表示某个值的输入和输出控制。
3. 原理：
    `v-model`是一个指令，双向绑定实际上是Vue 的编译器完成的，通过输出包含`v-model`模版的组件渲染函数，实际上还是`value`属性的绑定及`input`事件监听，事件回调函数中会做相应变量的更新操作。

### 子组件是否可以直接改变父组件的数据？

1. 所有的`prop`都遵循着单项绑定原则，`props`因父组件的更新而变化，自然地将新状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。
    另外，每次父组件更新后，所有的子组件中的`props`都会被更新为最新值，这就意味着不应该子组件中去修改一个`prop`，若这么做了，Vue 会在控制台上抛出警告。
2. 实际开发过程中通常有两个场景导致要修改prop：
   - `prop`被用于传入初始值，而子组件想在之后将其作为一个局部数据属性。这种情况下，最好是新定义一个局部数据属性，从`props`获取初始值即可。
   - 需要对传入的`prop`值做进一步转换。最好是基于该`prop`值定义一个计算属性。
3. 实践中，如果确实要更改父组件属性，应`emit`一个事件让父组件变更。当对象或数组作为`props`被传入时，虽然子组件无法更改`props`绑定，但仍然**可以**更改对象或数组内部的值。这是因为JS的对象和数组是按引用传递，而对于 Vue 来说，禁止这样的改动虽然可能，但是有很大的性能损耗，比较得不偿失。

### router 和 route 的区别？

1. `$router`是VueRouter的实例对象，是一个全局的路由对象，包含了所有路由的对象和属性。
2. `$route`是一个跳转的路由对象，可以认为是当前组件的路由管理，指当前激活的路由对象，包含当前url解析得到的数据，可以从对象里获取一些数据，如：name，path，params，query等。



### vue-router 的路由传参方式？

1. 声明式导航 `router-link`：

```js
<router-link :to="'/users?userId:1'"></router-link>
<router-link :to="{ name: 'users', params: { userId: 1 } }"></router-link>
<router-link :to="{ path: '/users', query: { userId: 1 } }"></router-link>
```

1. 编程式导航 router-push：

   - 通过`params`传参

   ```js
   this.$router.push({
       name: 'users',
       params: {
           userId: 1
       }
   });
   // 路由配置
   {
       path: '/users',
       name: 'users',
       component: User
   }
   // 跳转后获取路由参数
   this.$route.params.userId // 为 1
   ```

   - 通过`query`传参

   ```php
   this.$router.push({
       path: '/users',
       query: {
           userId: 1
       } 
   });
   // 路由配置
   {
       path: '/users',
       name: 'users',
       component: User
   }
   // 跳转后获取路由参数
   this.$route.query.userId
   ```

   - 动态路由

   ```js
   this.$router.push('/users/${userId}');
   // 路由配置
   {
       path: '/users/:userId',
       name: 'users',
       component: User
   }
   // 跳转后获取路由参数
   this.$route.params.userId
   ```



### Vue Router中的常用路由模式和原理？

1. hash 模式：

- `location.hash`的值就是url中 `#` 后面的东西。它的特点在于：hash虽然出现url中，但不会被包含在HTTP请求中，对后端完全没有影响，因此改变hash不会重新加载页面。
- 可以为hash的改变添加监听事件`window.addEventListener("hashchange", funcRef, false)`，每一次改变`hash (window.location.hash)`，都会在浏览器的访问历史中增加一个记录，利用hash的以上特点，就可以实现**前端路由更新视图但不重新请求页面**的功能了。
   特点：兼容性好但是不美观

1. history 模式：
    利用 HTML5 History Interface 中新增的`pushState()`和`replaceState()`方法。
    这两个方法应用于浏览器的历史记录栈，在当前已有的`back`、`forward`、`go` 的基础上(使用`popState()`方法)，他们提供了对历史记录进行修改的功能。
    这两个方法有个共同点：当调用他们修改浏览器历史记录栈后，虽然当前url改变了，但浏览器不会刷新页面，这就为单页面应用前端路由“更新视图但不重新请求页面”提供了基础
    特点：虽然美观，但是刷新会出现 404 需要后端进行配置。

### 动态路由？

很多时候，我们需要将给定匹配模式的路由映射到同一个组件，这种情况就需要定义动态路由。例如，我们有一个 User组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用`动态路径参数（dynamic segment）`来达到这个效果：`{path: '/user/:id', compenent: User}`，其中`:id`就是动态路径参数。

### 对Vuex的理解？

1. 概念：
    Vuex 是 Vue 专用的状态管理库，它以全局方式集中管理应用的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
2. 解决的问题：
    Vuex 主要解决的问题是多组件之间状态共享。利用各种通信方式，虽然也能够实现状态共享，但是往往需要在多个组件之间保持状态的一致性，这种模式很容易出问题，也会使程序逻辑变得复杂。Vuex 通过把组件的共享状态抽取出来，以全局单例模式管理，这样任何组件都能用一致的方式获取和修改状态，响应式的数据也能够保证简洁的单向流动，使代码变得更具结构化且易于维护。
3. 什么时候用:
    Vuex 并非是必须的，它能够管理状态，但同时也带来更多的概念和框架。如果我们不打算开发大型单页应用或应用里没有大量全局的状态需要维护，完全没有使用Vuex的必要，一个简单的 store 模式就够了。反之，Vuex将是自然而然的选择。
4. 用法：
    Vuex 将全局状态放入`state`对象中，它本身是一颗状态树，组件中使用`store`实例的`state`访问这些状态；然后用配套的`mutation`方法修改这些状态，并且只能用`mutation`修改状态，在组件中调用`commit`方法提交`mutation`；如果应用中有异步操作或复杂逻辑组合，需要编写`action`，执行结束如果有状态修改仍需提交`mutation`，组件中通过`dispatch`派发`action`。最后是模块化，通过`modules`选项组织拆分出去的各个子模块，在访问状态（state）时需注意添加子模块的名称，如果子模块有设置`namespace`，那么提交`mutation`和派发`action`时还需要额外的命名空间前缀。

### 页面刷新后Vuex 状态丢失怎么解决？

Vuex 只是在内存中保存状态，刷新后就会丢失，如果要持久化就需要保存起来。

`localStorage`就很合适，提交`mutation`的时候同时存入`localStorage`，在`store`中把值取出来作为`state`的初始值即可。

也可以使用第三方插件，推荐使用`vuex-persist`插件，它是为 Vuex 持久化储存而生的一个插件，不需要你手动存取`storage`，而是直接将状态保存至 `cookie` 或者 `localStorage`中。

### 关于 Vue SSR 的理解？

`SSR`即`服务端渲染（Server Side Render）`，就是将 Vue 在客户端把标签渲染成 html 的工作放在服务端完成，然后再把 html 直接返回给客户端。

- 优点：
   有着更好的 SEO，并且首屏加载速度更快。
- 缺点：
   开发条件会受限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。服务器会有更大的负载需求。

### 了解哪些 Vue 的性能优化方法？

- 路由懒加载。有效拆分应用大小，访问时才异步加载。
- `keep-alive`缓存页面。避免重复创建组件实例，且能保留缓存组件状态。
- `v-for`遍历避免同时使用`v-if`。实际上在 Vue 3 中已经是一个错误用法了。
- 长列表性能优化，可采用虚拟列表。
- `v-once`。不再变化的数据使用`v-once`。
- 事件销毁。组件销毁后把全局变量和定时器销毁。
- 图片懒加载。
- 第三方插件按需引入。
- 子组件分割。较重的状态组件适合拆分。
- 服务端渲染。

















