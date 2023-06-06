---
title: vela快应用框架
tags:
  - quickjs
  - devtools
categories: C
keywords: 'quickjs ts c++'
description: quickjs对接devtools
top_img: 设置false不显示顶部图片
sticky: 100
cover: "https://raw.githubusercontent.com/why862555625/images/main/images/17.png"
comments: true评论
abbrlink: d9795d89
date: 2023-04-25 15:27:56
updated: 2023-04-25 15:27:56
---



Vela上快应用框架的一些实现原理和编程实践

<!-- more -->

# 快应用框架构成

一个简单的图用来描述快应用框架的模块构成，主要由Native（C++）部分和JS部分（framework.js）构成。

![48c4d276-9d71-439a-a720-7f268da27d85](https://raw.githubusercontent.com/why862555625/images/main/images/48c4d276-9d71-439a-a720-7f268da27d85.svg)

在框架的C++代码中，最核心的两大组件就是 quickjs和libuv，分别提供JS运行环境和异步消息循环机制。框架还用到了一些其他的C/C++库如libcurl作为http客户端，rapidjson提供json解析能力等。

下面给出项目目录结构：

```
.
├── bin                                     # 生成目录
│   ├── app                                 # 测试应用
│   ├── apps.json                           # 应用配置文件
│   ├── font                                # 应用字体资源
│   ├── quickapp
│   └── vapp                                # 项目生成的可执行文件
├── build                                   # cmake构建目录
├── CMakeLists.txt
├── deps                                    # 依赖项目录
│   ├── curl                                # 多协议文件传输库
│   ├── ext                                 # 扩展，主要是lvgl非标准扩展
│   ├── FFmpeg                              # 音视频编解码库
│   ├── freetype2                           # 字体渲染库
│   ├── libuv                               # 跨平台事件驱动的消息循环库
│   ├── littlefs                            # lvgl相关
│   ├── lv_conf.h
│   ├── lv_drivers
│   ├── lv_drv_conf.h
│   ├── lv_ffmpeg_interface
│   ├── lv_fs_interface
│   ├── lvgl                                # lvgl 嵌入式gui库
│   ├── lv_lib_freetype                     # lvgl的freetype库
│   ├── lv_lib_png                          # lvgl的png解码库
│   ├── quickjs                             # 嵌入式JS引擎
│   ├── rapidjson                           # Json库
│   ├── tools                               # 工具目录，目前存放了Ffmpeg编译脚本
│   ├── unqlite                             # no sql数据库
│   ├── uvws                                # 基于libuv实现的websocket库
│   ├── wasm3                               # web assembely支持库
│   └── yoga                                # yoga排版引擎
├── Kconfig                                 # 供vela使用的kconfg配置
├── Make.defs
├── Makefile                                # vela makefile
├── README.md                               # 本文件
├── src                                     # 源码
│   ├── aiotjs.h
│   ├── ajs_vm.cpp
│   ├── ....
│   ├── framework                           # 框架源码
│   ├── gui                                 # GUI相关代码，包含lvgl渲染器实现
│   ├── jse                                 # JS Environment JS环境相关
│   └── Kconfig
├── tests                                   # 测试
│   ├── gui
│   ├── helpers
│   ├── run.js
│   ├── ... 
│   ├── test-feature-vibrator.js
│   ├── wasi
│   └── wasm
└── toolchain                               # 交叉编译相关
    └── cross-m32.cmake                     # linux 32位构建
```



# 框架启动流程分析

![6ca169bc-84af-4252-9758-54c853feefef](https://raw.githubusercontent.com/why862555625/images/main/images/6ca169bc-84af-4252-9758-54c853feefef.svg)

框架的整个启动和执行流程较为复杂，里面涉及到了JS和C++的互调用。

启动流程以C++的入口函数为入口点，会初始化quickjs，创建app，启动子线程并加载Native module和内置JS框架代码。

然后流程转交到JS，由JS通过调用初始化时注册的Native函数来完成整个快应用的加载。



# VDOM渲染流程分析



VDOM的创建和渲染出于性能考虑，放在了C++层实现，整个VDOM的创建由Native通过执行template上的渲染函数来创建。

```js
((module) => {
    module.exports = function (vm) {
      const _vm_ = vm || this
      return aiot.__ce__("div", {
        "classList": [
          "page",
          "home-page"
        ]
      }, [
        aiot.__ci__({
          shown: function () { return _vm_.status !== 0 }
        },
          function () {
            return aiot.__ce__("text", {
              "classList": [
                "text-time"
              ],
              "value": function () { return _vm_.$t("a.b") }
            })
          }),
        aiot.__ci__({
          shown: function () { return _vm_.status === 0 }
        },
          function () {
            return aiot.__ce__("div", {
              "classList": [
                "body",
                "launch-panel"
              ]
            }, [
              aiot.__ce__("image", {
                "src": "/Common/logo.png",
                "classList": [
                  "logo"
                ]
              }),
              aiot.__ce__("text", {
                "classList": [
                  "app-name"
                ],
                "value": "航旅纵横"
              })
            ])
          }),
        aiot.__ci__({...}),
        aiot.__ci__({...}),
        ....
      ])
    }
    /***/
}),
```

Template本身是一个嵌套结构，它被翻译成了对aiot.__ce__, aiot__cf__, aiot.__ci__等函数的嵌套调用，嵌套调用的过程就是在Native层完成整个dom树构建的过程。

我们来看__cf__对应的C++源码，它用于创建一个逻辑循环节点：



```c++
DomEntity* dom_create_for_fragment(jse_context_ref ctx, jse_value_t options, jse_value_t func) {
    AIOTJS_LOG_DEBUG("dom_create_for_fragment ==================== ");


   ....

    //创建DomForFragment节点
    DomForFragment *frag = new DomForFragment();
    page->addDomEntity(frag);
    
    ...

    // 保存JS端传入的表达式和render函数
    jse_value_t exp = jse_get_object_property(ctx, options, "exp");
    frag->setExpress(jse_dup_value(ctx, exp));
    frag->setRenderFunction(jse_dup_value(ctx, func));
    jse_free_value(ctx, exp);

    //设置key或者$idx
    ...

    //创建effect函数
    jse_value_t eff = create_effect(ctx, dom_update_for_fragment, 0);
    AIOTJS_LOG_DEBUG("AddEffect for %d", frag->uid());
    //调用framework的effectWrap函数将effect函数传递给JS层保存
    frag->addEffect(ctx, dom_effect(ctx, eff, frag->uid(), 0));
    jse_free_value(ctx, eff);
    ...
    
    // 返回创建好的frag vdom节点
    return frag;
}
```

dom_update_for_fragment是C++端的节点更新函数，它最终会触发节点的render函数更新子节点：



```c++
bool DomForFragment::render(jse_context_ref ctx) {
    // 递归构造
    jse_value_t exp_obj = jse_call(ctx, exp_, JSE_UNDEFINED, 0, {});
    jse_value_t expValue = JSE_UNDEFINED;
    const char* str_tid = nullptr;

    // 调用JS端的求值函数获取for循环对应的list对象 expValue
    expValue = get_from_js_expression();
    
    ....

    //遍历数组
    jse_size_t len = jse_get_array_length(ctx, expValue);
    for(jse_size_t i = 0; i < len; i++) {
        //为每个element分别调用render函数
        jse_value_t idx = jse_uint(ctx, i);
        jse_value_t args[] = {
            idx,
            item
        };
        jse_value_t res = jse_call(ctx, render_, JSE_UNDEFINED, 2, args);
        if (jse_is_number(res)) {
            unsigned int cid = jse_to_uint_def(ctx, res, 0);
            DomEntity* ent = p->entity(cid);
            AIOTJS_CHECK_NE(ent, nullptr);
            ent->setDiffOperationType(DomEntityDiffOperationType::Add);
            addChild(ent);
            if(!jse_is_undefined(tid_value)) {
                jse_value_t v_tid = jse_dup_value(ctx, tid_value);
                ent->setTid(v_tid);
            }
        } else if (jse_is_array(ctx, res)) {
            jse_size_t childlen = jse_get_array_length(ctx, res);
            for(size_t j=0; j<childlen; j++) {
                unsigned int cid = jse_get_array_idx_uint(ctx, res, j, 0);
                DomEntity* ent = p->entity(cid);
                AIOTJS_CHECK_NE(ent, nullptr);
                ent->setDiffOperationType(DomEntityDiffOperationType::Add);
                addChild(ent);
            }
        }
        jse_free_value(ctx, res);
        jse_free_value(ctx, idx);
    }
    jse_free_value(ctx, item);

    jse_free_value(ctx, expValue);
    AIOTJS_LOG_DEBUG("DomForFragment::build finished - <%u>", uid());
    // 只有初始化的时候返回true表示需要flush，其它情况下延迟flush
    return isBindingEffect();
}
```
# 框架线程模型

框架采用多线程模式，主要有如下两类线程：

- 主线程：负责渲染，只有一个
- 应用线程：负责执行JS代码，响应数据变更并更新vdom

主线程和应用线程各启动一个uv loop进行消息处理，这两个线程通过libuv进行异步通信，主要有如下几种场景：

1. 应用线程退出后异步通知主线程退出
2. 应用线程更新vdom后异步通知主线程刷新ui
3. 系统消息（如应用后台，应用退出等）由主线程发出，通过libuv转到应用线程执行

# 渲染流程分析

## 渲染流程图



![33f7e704-ec72-4782-b8ff-1e58df0bef2d](https://raw.githubusercontent.com/why862555625/images/main/images/33f7e704-ec72-4782-b8ff-1e58df0bef2d.svg)



## 渲染流程



![6e8b9b04-5afd-47aa-9263-d3a379c1ac5b](https://raw.githubusercontent.com/why862555625/images/main/images/6e8b9b04-5afd-47aa-9263-d3a379c1ac5b.svg)



# 框架核心部分介绍

## 核心类图

![a8dc8b49-a594-454c-9309-164e3269c5e9](https://raw.githubusercontent.com/why862555625/images/main/images/a8dc8b49-a594-454c-9309-164e3269c5e9.svg)

解释：

1. Framework是内部使用的框架类表示，FrameworkExt从Framework继承并添加了对vela系统的消息集成，在vela中使用FrameworkExt表示唯一的框架实例
2. FrameworkExt中会维护多个app实例，框架支持多应用切换
3. 每个app实例包含一个JS运行上下文环境和相关的libuv句柄，它们封装在RuntimeContxt中，作为Application的成员变量保存，即一个Application对象唯一对应一个js运行上下文。
4. 一个Applicatoin对象可以拥有多个Page对象，一个Page对象表示一个可显示的页面，实际是一颗vdom树
5. Page对象的继承关系较为复杂，框架支持自定义组件，从逻辑上讲，一个Component包含一颗vdom子树，它可以被任意组合来形成最终的完整vdom树。Page是最顶层的Component组件，唯一。从继承关系上讲，DomDocument这一层应该去掉，在添加子组件支持后它的语义已被Component取代，这层抽象当前代码中没有意义但仍然存在。











































