---
title: 前端工程化
tags:
  - 前端
categories: 面试
keywords: 前端工程化
description: 前端工程化
top_img: 'https://raw.githubusercontent.com/why862555625/images/main/images/00.jpg'
sticky: 数值越大越靠前
cover: 'https://raw.githubusercontent.com/why862555625/images/main/images/00.jpg'
comments: false评论
abbrlink: 7db00131
date: 2023-05-26 15:59:17
updated: 2023-05-26 15:59:17
---
前端工程化
<!-- more -->



## Q1. 面试官：请说说常见的loader

- `sass-loader`：将SCSS/SASS代码转换成CSS
- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀，加上兼容的浏览器厂商前缀
- `css-loader`：处理样式之间互相引用的逻辑, 加载 CSS，支持模块化、压缩、文件导入等特性
- `style-loader`：将 css-loader 解析后的内容挂载到 html 页面当中
- `file-loader`：可以指定要复制和放置资源文件的位置，以及使用版本哈希命名以获得更好的缓存，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。
- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码，减少HTTP请求
- `image-loader`：加载并且压缩图片文件
- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试
- `json-loader` 加载 JSON 文件（默认包含）
- `babel-loader`：把 ES6 转换成 ES5
- `ts-loader`: 将 TypeScript 转换成 JavaScript
- `tslint-loader`：通过 TSLint检查 TypeScript 代码
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码
- `mocha-loader`：加载 Mocha 测试用例的代码
- `coverjs-loader`：计算测试的覆盖率
- `vue-loader`：将 Vue 组件转换为 JavaScript 模块
- `i18n-loader`: 国际化
- `awesome-typescript-loader`：将 TypeScript 转换成 JavaScript，性能优于 ts-loader

> loader 的执行顺序要注意！css 相关的loader 要按照下图来写。因为 loader 的执行顺序是从后往前、从下往上。 所以我们要用 `saas-loader` 来处理 sass 文件, 再把它交给 `postcss-loader` 加上浏览器厂商前缀。然后通过 `css-loader` 处理样式之间的引用逻辑。最后通过 `style-loader` 将它挂在到 html上

![image-20230611211119358](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211119358.png)

## Q2. 面试官：请说说常见的 plugins

1. `html-webpack-plugin`：在 dist 下生成 html 文件。简化 HTML 文件创建 (依赖于 html-loader)
2. `clean-webpack-plugin`: 目录清理。把 dist 删除再生成打包结果
3. `copy-webpack-plugin` 因为 public 文件下的资源是固定的，直接拷贝到编译后的文件夹引入使用就可以，例如 favicon.ico
4. `open-browser-webpack-plugin` 启动webpack之后，自动打开浏览器
5. `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载
6. `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度
7. `HappyPack Plugin`: 开启多进程打包，提升打包速度
8. `webpack-bundle-analyzer`: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
9. `Dllplugin`: 动态链接库，将项目中依赖的三方模块抽离出来，单独打包
10. `DllReferencePlugin`: 配合 Dllplugin，通过 manifest.json 映射到相关的依赖上去
11. `vue-skeleton-webpack-plugin`: vue 项目实现骨架屏

## Q3. 面试官：loaders 跟 plugin 的区别

**1、概念不一样。**

`Loader` 本质就是一个函数。对函数中接收到的内容进行转换，返回转换后的结果。Loader 的作用是让 webpack 拥有加载和解析非 JavaScript 文件的能力！ 因为 Webpack 只认识 JavaScript，所以需要对其他类型的资源进行转译的**预处理**工作。Loader 可以理解为「翻译官」。比如常见的 **json-loader**, **ts-loader**等。

`Plugin` 就是插件，插件可以扩展 Webpack 的功能，让 Webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

**2、配置方式不一样**

`Loader` 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object. `Plugin` 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

**3、运行时机不一样**

`Loader` 运行在打包文件之前（loader为在模块加载时的预处理文件）。`plugins` 在整个编译周期都起作用

## Q4. 面试官：babel-loader、babel/preset-env、babel-polyfill、babel-transform-runtime 什么区别

- **babel-loader** 把babel跟webpack连接上。相当于是桥梁。实际上还不能把es6转成es5

- **babel/preset-env** 预设，能把let语句等翻译成es5（但是promise、generator等语法不行）

- **babel-polyfill** 才真正的支持Promise等语法

  *@babel-polyfill包 = corejs包 + regenerator包*

> **corejs** 少了 **generator**语法， 但支持其它es6甚至更高版本的 js. 

> **regenerator** 支持 generator. 补充了corejs!

- **babel-transform-runtime** 为代码提供了一个沙盒环境，所以不会像 **babel-polyfill**一样污染全局变量，因此适用于开发组件库。注意：**babel-polyfill**会污染全局变量。在开发业务代码的时候，无需考虑该问题。

## Q5. 面试官：webpack 如何优化构建体积跟速度

### 1. Tree Shaking（优化体积、降低构建速度）

Tree Shaking 把源代码里没用到的代码，不打包。（减少包体积，加快速度） 可以这么配置

```arduino
optimization: { // 优化项
   // sideEffects和usedExports是两种不同的优化方式。
   usedExports: true, // 识别无用代码 未使用的导出内容不会被生成 usedExports 依赖于 terser 去检测语句中的副作用。
   // sideEffects: true,  // 开启副作用标识功能 sideEffects更为有效是因为它允许跳过整个模块/文件和整个文件子树。
 },
```

> 注意： **tree Shaking** 只支持 ES Module，不支持 Commonjs
>
> vue 脚手架搭建的项目，默认已经给你配置好了 tree Shaking
>
> 了解更多，请看看这篇文章 [webpack配置-tree shaking](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F417686391)

### 2. 使用懒加载

![image-20230611211511770](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211511770.png)

### 3. 代码分割（优化构建速度）

`代码分割` 分成  **js代码分割** 跟 **css代码分割**。

**js代码分割（两种实现方式）**

- 使用entry配置手动分离

  ![image-20230611211558746](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211558746.png)

- 使用 webpack 的 splitChunks 去自动分割（splitChunks 替代了 CommonsChunkPlugin 插件）

  ![image-20230611211621905](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211621905.png)

**css代码分割**

没配置 css代码分割的话，css 代码会打包到 js 里去（css in js）. 我们并不希望 css 混入到 js 里，而是希望 css 作为外链单独应用，所以我们要做代码分割！

这时候就可以用 `mini-css-extract-plugin`（生产环境用就好。开发环境 css in js 没什么大问题。反而能减少 webpack 工作量，还能提高构建速度。所以配置在 webpack.prod.js 就好）

![image-20230611211707693](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211707693.png)

### 4. file-loader

file-loader 可以指定要复制和放置资源文件的位置，以及使用版本哈希命名以获得更好的缓存（hash值是根据文件内容算出来的，所以文件内容不变，hash值不变，浏览器就可以用缓存的内容。）。

### 5. url-loader

url-loader 文件大于该阈值交给file-loader去处理，小于阈值转成 base64，减少 HTTP 请求数

### 6. DllPlugin

什么是`DllPlugin`呢 ？

如果你使用vue技术栈来开发，你改动了一行业务代码这势必不会影响vue源码，但是你构建的时候发现了所有的代码都被重新构建了，这显然是不合理的，而 DllPlugin 就是解决这个问题的。让我们将第三方库这种无论我们怎么改业务代码构建结果都不会发生改变的模块单独拆出来构建，下次只要不改变第三方库就直接引用现成的构建结果就可以了

那我们要怎么使用呢？ 主要有两步

1. 通过 DllPlugin 打包出动态链接库
2. 用 DllReferencePlugin 在主构建中引入动态链接库就可以了

更多内容可以看看这篇文章 [webpack优化——Dllplugin](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Friddle1981%2Farticle%2Fdetails%2F114345250)

### 7. externals（利用cdn, 优化体积、优化构建速度）

**常用库替换成cdn文件**

externals 是常用优化手段。构建时，将依赖文件相关从 node_modules 导入改为外部链接引用(即：通过 script 标签，以 CDN 的方式加载)

你可以把常见的 libs 以 CDN 的方式导入，像 vue，react，jquery 等，他们的官方都提供了可靠的 CDN 服务。

我们需要在vue.config.js里定义键值对。key就是我们引入的包的名字。value就是我们引入的包挂载在全局用的变量名。

![image-20230611211904082](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211904082.png)

**常用ui库的css文件替换成cdn文件**

除了js库外，我们还可以将element ui的css通过cdn的方式引入。

![image-20230611211918155](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211918155.png)

### 8. babel-loader 优化

babel-loader 帮助我们把 es6转换为es5。但是我们仍需要对 babel-loader 进行两点优化。

一、设置 babel-loader 编译过程中需要解析的路径，以及排除 node_modules 相关依赖；**include**、 **exclude** 二者选其一

二：加上 **cacheDirectory** 开启缓存。

![image-20230611211944102](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611211944102.png)

### 9. ignorePlugin 跟 noParse

**ignorePlugin**
 `ignorePlugin` 忽略某些模块下的某个文件夹。
 例如 moment 这个包挺大的，里头包含了很多国家的国际化方面的东西。但是我们在实际项目中，一般中文就够了。

![image-20230611212005701](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611212005701.png)

**noParse**

`noParse` 不去做解析。忽略掉

![image-20230611212019409](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611212019409.png)

**ignorePlugin 跟 noParse 的区别**

- **ignorePlugin** 是忽略掉，最终生成的代码也不会包括该代码
- **noParse** 是不做打包，但是最后打包后的文件是包含该代码的

### 10. 开启多进程

1. **多进程打包**：`happypack plugins` ，它将尽可能利用硬件资源，多线程方式来编译代码。
2. **多进程压缩**：`webpack-parallel-uglify-plugin` 这个插件能让我们开启多进程来压缩 js 代码（生产环境配置就好了。开发环境会加大开销）

讲了这么多是不是快晕啦。

别怕，附上思维导图总结（妈妈再也不用担心我记不住了😄）

![image-20230611212120443](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230611212120443.png)

## Q6. 说一下 Webpack 的热更新原理吧

`Webpack` 的热更新又称热替换（`Hot Module Replacement`），缩写为 `HMR`。 可以做到无需完全刷新整个页面的同时，保留页面状态并且更新模块。提到热更新我们不得不知道另一个概念——WDS。`webpack-dev-server(WDS)`是一个基于express的web server，server内部调用webpack，这样的好处是提供了热加载和热替换的功能

热更新的核心就是客户端从服务端拉取更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起Ajax请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起jsonp请求获取该chunk的增量更新。

## Q7. 面试官：Webpack proxy 为什么能解决跨域

> 背景：在开发阶段， `webpack-dev-server` 会启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在 `localhost`的一个端口上，而后端服务又是运行在另外一个地址上
>
> 所以在开发阶段中，由于浏览器同源策略的原因，当本地访问后端就会出现跨域请求的问题

通过设置`webpack proxy`实现代理请求后，相当于浏览器与服务端中添加一个代理者

当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/928dca390f3440d0a6ebf0bccd01b386~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**这是因为：** 在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据。而服务器与服务器之间请求数据不会存在跨域行为（因为跨域行为是浏览器安全策略限制）

## Q8. 面试官：手写一个Loader来瞧瞧

**一个简单的`style-loader`**

```ini
// 作用：将css内容，通过style标签插入到页面中
// source为要处理的css源文件
function loader(source) {
  let style = `
    let style = document.createElement('style');
    style.setAttribute("type", "text/css");
    style.innerHTML = ${source};
    document.head.appendChild(style)`;
  return style;
}
module.exports = loader;
```

**最后，在 vue 项目中使用自定义 loader**

1）在`vue.config.js`引入该 loader

```
const MyStyleLoader = require('./style-loader')
```

2）在`configureWebpack`中添加配置

```css
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          // 对main.css文件使用MyStyleLoader处理
          test: /main.css/,
          loader: MyStyleLoader
        }
      ]
    }
  }
};
```

3）项目重新编译
 `main.css`样式已加载到页面中

## Q9. 面试官：手写一个Plugin插件

Plugin 的组成部分

1）Plugin 的本质是一个 `node 模块`，这个模块导出一个 JavaScript 类

2）它的原型上需要定义一个`apply` 的方法

3）通过`compiler`获取 webpack 内部的钩子，获取 webpack 打包过程中的各个阶段

钩子分为同步和异步的钩子，异步钩子必须执行对应的回调

4）通过`compilation`操作 webpack 内部实例特定数据

5）功能完成后，执行 webpack 提供的 cb 回调

```javascript
// 自定义一个名为MyPlugin插件，该插件在打包完成后，在控制台输出"打包已完成"
class MyPlugin {
  // 原型上需要定义apply 的方法
  apply(compiler) {
    // 通过compiler获取webpack内部的钩子
    compiler.hooks.done.tap("My Plugin", (compilation, cb) => {
      console.log("打包已完成");
      // 分为同步和异步的钩子，异步钩子必须执行对应的回调
      cb();
    });
  }
}
module.exports = MyPlugin;
```

**最后， 在 vue 项目中使用自定义插件**

1）在`vue.config.js`引入该插件

```js
const MyPlugin = require('./MyPlugin.js')
```

2）在`configureWebpack`的 plugins 列表中注册该插件

```ini
module.exports = {
  configureWebpack: {
    plugins: [new MyPlugin()]
  }
};
```

3）执行项目的打包命令
 当项目打包成功后，会在控制台输出：`打包已完成`









































