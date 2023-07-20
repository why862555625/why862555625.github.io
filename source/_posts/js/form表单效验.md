---
title: form表单效验
tags:
  - JS

categories: 前端
keywords: "hexo,butterfly,主題,doc,教程,文檔"
description: 描述 Butterfly安裝文檔-快速開始
top_img: "https://raw.githubusercontent.com/why862555625/images/main/images/444.jpg"
sticky: 数值越大越靠前
cover: "https://raw.githubusercontent.com/why862555625/images/main/images/444.jpg"
comments: false评论
date: 2023-07-20 08:31:35
updated: 2023-07-20 08:31:35
---

element form 表单效验和原理

<!-- more -->

## Element 的表单校验

> 我们尝试通过一个案例对 Element 的表单校验进行一下补充

### 实现表单基本结构

**创建项目**

```bash
$ vue create login
```

> 选择 babel / eslint

**安装 Element**

开发时依赖 ： 开发环境所需要的依赖 -> devDependencies

运行时依赖: 项目上线依然需要的依赖 -> dependencies

```bash
$ npm i element-ui
```

**在 main.js 中对 ElementUI 进行注册**

```js
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
```

接下来,利用 Element 组件完成如图的效果

![image-20230720083444058](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230720083444058.png)

代码如下

```vue
<template>
  <div id="app">
    <!-- 卡片组件 -->
    <el-card class="login-card">
      <!-- 登录表单 -->
      <el-form style="margin-top: 50px">
        <el-form-item>
          <el-input placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  background-color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  width: 440px;
  height: 300px;
}
</style>
```

### 表单校验的先决条件

接下来，完成表单的校验规则如下几个先决条件

![image-20230720083513340](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230720083513340.png)

**model 属性** (表单数据对象)

```js
  data () {
    // 定义表单数据对象
    return {
      loginForm: {
        mobile: '',
        password: ''
      }
    }
  }
```

**绑定 model**

```vue
<el-form style="margin-top:40px" :model="loginForm" >
```

**rules 规则** 先定义空规则，后续再详解

```js
loginRules: {}
<el-form style="margin-top: 50px" :model="loginForm" :rules="loginRules">
```

**设置 prop 属性**

> 校验谁写谁的字段

```vue
<el-form-item prop="mobile">
   ...
<el-form-item prop="password">
   ...
```

**给 input 绑定字段属性**

```vue
<el-input v-model="loginForm.mobile"></el-input>
<el-input v-model="loginForm.password"></el-input>
```

### 表单校验规则

此时，先决条件已经完成，要完成表单的校验，需要编写规则

> ElementUI 的表单校验规则来自第三方校验规则参见 [async-validator](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyiminghe%2Fasync-validator)

我们介绍几个基本使用的规则

| 规则      | 说明                                                                         |
| --------- | ---------------------------------------------------------------------------- |
| required  | 如果为 true，表示该字段为必填                                                |
| message   | 当不满足设置的规则时的提示信息                                               |
| pattern   | 正则表达式，通过正则验证值                                                   |
| min       | 当值为字符串时，min 表示字符串的最小长度，当值为数字时，min 表示数字的最小值 |
| max       | 当值为字符串时，max 表示字符串的最大长度，当值为数字时，max 表示数字的最大值 |
| trigger   | 校验的触发方式，change（值改变） / blur （失去焦点）两种，                   |
| validator | 如果配置型的校验规则不满足你的需求，你可以通过自定义函数来完成校验           |

校验规则的格式

**_{ key(字段名): value(校验规则) => [{}] }_**

根据以上的规则，针对当前表单完成如下要求

**手机号** 1.必填 2.手机号格式校验 3. 失去焦点校验

**密码** 1.必填 2.6-16 位长度 3. 失去焦点校验

**规则如下**

```js
loginRules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码应为6-16位的长度",
            trigger: "blur",
          },
        ],
	}
```

### 自定义校验规则

> 自定义校验规则怎么用

**`validator`\*\*是一个函数, 其中有三个参数 (\*\*`rule`**(当前规则),`value`(当前值),**`callback`**(回调函数))

```js
var func = function (rule, value, callback) {
  // 根据value进行进行校验
  // 如果一切ok
  // 直接执行callback
  callback(); // 一切ok 请继续
  // 如果不ok
  callback(new Error("错误信息"));
};
```

根据以上要求，增加手机号第三位必须是 9 的校验规则

如下

```js
// 自定义校验函数
const checkMobile = function (rule, value, callback) {
    value.charAt(2) === '9' ? callback() : callback(new Error('第三位手机号必须是9'))
}

 mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkMobile
   }],
```

### 手动校验的实现

> 最后一个问题，如果我们直接点登陆按钮，没有离开焦点，那该怎么校验 ？

此时我们需要用到手动完整校验 [案例](https://link.juejin.cn?target=https%3A%2F%2Felement.eleme.cn%2F%23%2Fzh-CN%2Fcomponent%2Fform)

form 表单提供了一份 API 方法，我们可以对表单进行完整和部分校验

| 方法名        | 说明                                                                                                                                                                 | 参数                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| validate      | 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise | Function(callback: Function(boolean, object))                              |
| validateField | 对部分表单字段进行校验的方法                                                                                                                                         | Function(props: array \| string, callback: Function(errorMessage: string)) |
| resetFields   | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                                                                                           | —                                                                          |
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果                                                             | Function(props: array \| string)                                           |

这些方法是 el-form 的 API，需要获取 el-form 的实例，才可以调用

**采用 ref 进行调用**

```vue
<el-form ref="loginForm" style="margin-top:40px" :model="loginForm" :rules="loginRules">
```

**调用校验方法**

```js
login () {
    // 获取el-form的实例
    this.$refs.loginForm.validate(function (isOK) {
        if (isOK) {
            // 说明校验通过
            // 调用登录接口
        }
    }) // 校验整个表单
}
```

# element 原理

# 一、async-validator

​ 在介绍表单校验之前，我们需要先了解 async-validator。

​ [async-validator](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fasync-validator)是一个异步校验的功能库，可以根据传入的规则和数据输出校验结果。

​ 目前大多数组件库(包括 element-ui)内部都是引入 async-validator 完成数据校验的，即表单中的每一项都是用 async-validator 来进行校验的。

​ 看一下 async-validator 的基本使用方法

```javascript
import asyncValidator from 'async-validator'

var descriptor = {
  name: {
    type: "string",
    required: true,
    validator: (rule, value, callback) => {
      if (value === "Ezrel") {
        //
        callback();
      } else {
        callback(new Error("Wrong name"));
      }
    }
  }
};

var validator = new asyncValidator(descriptor);

// callback USAGE
validator.validate(
  { name: "Jinx" },
  { firstFields: true },// 串行校验，遇到错误就停止校验
  (errors, fields) => {
    if (errors) {
      // validation failed, errors is an array of all errors
      // fields is an object keyed by field name with an array of
      // errors per field
      console.log("validate error =>", errors);
    } else {
      // validation passed
      console.log("validate success!");
    }
  }
);
}
```

​ 这里如果不是很清楚也没关系，只需要知道 async-validator 的用处就是传入值和规则，会返回校验的结果即可，不影响后续的阅读。

（值得注意的是，async-validator 在 web 和 node 端的使用略有差异，这里我们关注的是 web 端的使用）

# 二、表单项 Form-item

​ 整个表单的校验其实是其所包含的每个表单项校验的结果集合，因此先看一下每个表单项是如何校验的。

## 2.1 表单项校验规则

​ getRules 方法用于获取当前表单项的校验规则，我们看一下代码

```kotlin
// element-ui\packages\form\src\form-item.vue

getRules() {
  let formRules = this.form.rules; // 整个表单的rules属性
  const selfRules = this.rules; // 当前表单项的rules属性
  const requiredRule = this.required !== undefined ? { required: !!this.required } : []; // 当前表单项的required属性

  const prop = getPropByPath(formRules, this.prop || '');
  formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];// 根据当期表单项的prop属性，从整个表单的rules中获取对应的规则

  return [].concat(selfRules || formRules || []).concat(requiredRule);// 校验规则组合
},
```

​ 从以上代码中可以分析出几点：

​ 1、表单项自身的 rules 规则优先级高于整个表单上的 rules 规则（selfRules || formRules || []）；

​ 2、如果表单项自身没有 rules 规则，则从表单的 rules 规则中取 prop 属性对应的规则（说明 prop 属性在表单校验中是非常重要，如果没有给表单项传递 prop 属性，则无法从表单的规则中拿到对应表单项的规则；实际上表单项校验时的值也是通过 prop 属性从表单的 model 属性中读取的）；

​ 3、表单项上的 required 属性与 rules 中的 required 具有同等效果。

## 2.2 trigger 属性

​ 在 rules 中我们可以设置 trigger 属性，trigger 表示校验的触发条件，可以设置的值为'change'、'blur、数组，也可以不设置 trigger 属性。

​ trigger 属性在 async-validator 中是不存在的，这个属性是 element-ui 添加的。

```kotlin
// element-ui\packages\form\src\form-item.vue

addValidateEvents() {
  const rules = this.getRules();

  if (rules.length || this.required !== undefined) {
    // 监听blur和change事件
    this.$on('el.form.blur', this.onFieldBlur);
    this.$on('el.form.change', this.onFieldChange);
  }
},
onFieldBlur() {
  // 触发blur校验
  this.validate('blur');
},
onFieldChange() {
  if (this.validateDisabled) {
    this.validateDisabled = false;
    return;
  }
  // 触发change校验
  this.validate('change');
},
```

​ el.form.blur 和 el.form.change 是在 input/select 等组件中 dispatch 出来的

## 2.3 过滤 trigger 后的规则

​ 既然设置了 trigger 属性，那么在校验时应该要过滤对应 trigger 的规则，用过滤后的规则进行校验。

```javascript
// element-ui\packages\form\src\form-item.vue

getFilteredRule(trigger) {
  // 获取当前表单项的规则
  const rules = this.getRules();

  return rules.filter(rule => {
    // 规则中未设置trigger或者当前的trigger为''时，规则会被用于校验
    if (!rule.trigger || trigger === '') return true;
    if (Array.isArray(rule.trigger)) {
      // 规则中的trigger是数组的情况,需要包含当前的trigger
      return rule.trigger.indexOf(trigger) > -1;
    } else {
      // 规则中的trigger与当前trigger完全匹配
      return rule.trigger === trigger;
    }
  }).map(rule => objectAssign({}, rule));
}
```

​ 从以上代码可以分析出：

1. 规则中没有设置 trigger，规则会被选取
2. 当前查询的 trigger 为''时，规则会被选取
3. 规则中设置了 trigger，且当前查询的 trigger 不为''时，需要规则中的 trigger 包含当前 trigger 或者与之完全一致才会被选取。

## 2.4 表单项校验的值 filedValue

​ 上面分析了获得校验规则的代码，接下里是获取参与校验的值

```javascript
// element-ui\packages\form\src\form-item.vue

fieldValue() {
  // form表单的model属性
  const model = this.form.model;
  // 如果表单没有model属性或者表单项没有prop属性，则返回undefined
  if (!model || !this.prop) { return; }

  let path = this.prop;
  if (path.indexOf(':') !== -1) {
    path = path.replace(/:/, '.');
  }
	// 根据prop从model中读取值
  return getPropByPath(model, path, true).v;
}
```

​ 从代码中可以分析出：

1. 表单 form 必须有 model 属性，如果没有 model 属性，参与校验的值就会是 undefined;
2. 表单项 form-item 必须有 prop 属性（这一点在获取校验规则时一致）,如果没有 prop 属性，参与校验的值就会是 undefined;
3. 参与校验的值是读取表单 model 中 prop 对应的值

## 2.5 表单项校验 validate

​ 经过以上步骤，已经获取到表单项对应的规则以及参与校验的值，接下来就是进行校验

```kotlin
// element-ui\packages\form\src\form-item.vue

validate(trigger, callback = noop) {
  this.validateDisabled = false;
  // 拿到表单项的校验规则(过滤trigger之后的)
  const rules = this.getFilteredRule(trigger);
  // 如果没有匹配的校验规则，直接返回
  if ((!rules || rules.length === 0) && this.required === undefined) {
    callback();
    return true;
  }

  this.validateState = 'validating';

  const descriptor = {};
  // 删除掉校验规则中的trigger属性，因为async-validator不需要
  if (rules && rules.length > 0) {
    rules.forEach(rule => {
      delete rule.trigger;
    });
  }
  descriptor[this.prop] = rules;

  const validator = new AsyncValidator(descriptor);
  const model = {};

  // 参与校验的值
  model[this.prop] = this.fieldValue;

  validator.validate(model,
  	{ firstFields: true }, // 规则串行校验，遇到错误则停止
  	(errors, invalidFields) => { // 回调，校验完成后执行
      this.validateState = !errors ? 'success' : 'error';
      this.validateMessage = errors ? errors[0].message : '';

      callback(this.validateMessage, invalidFields);
    	// 任一表单项校验时发射validate事件
      this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
  });
},
```

​ 表单项的 validate 方法很清晰，就是获取表单项的规则，然后构造 async-validator 进行校验，在校验完成的回调中处理表单项的校验状态、执行传入的 callback、发射 validate 事件。

# 三、表单 Form

​ 第二部分中我们弄清楚了表单项是如何进行校验的，这一部分我们分析一下 Form 是如何组织表单项进行校验的。

## 3.1 fields 数组

​ form 作为父组件，其中可以包含任意多个 form-item 组件，因此就有必要维护一个数据结构表示其所包含的 form-item，在代码中使用的是 fileds 数组

```kotlin
// element-ui\packages\form\src\form-item.vue
mounted() {
  if (this.prop) {
    // 向'ElForm'组件发布‘el.form.addField’消息
    this.dispatch('ElForm', 'el.form.addField', [this]);
    ......
  }
},
beforeDestroy() {
  // 向'ElForm'组件发布‘el.form.removeField’消息
  this.dispatch('ElForm', 'el.form.removeField', [this]);
}

// element-ui\packages\form\src\form.vue
created() {
  // 监听el.form.addField事件，填充fields数组
  this.$on('el.form.addField', (field) => {
    if (field) {
      this.fields.push(field);
    }
  });
  // 监听el.form.removeField事件，删除fields数组中对应的field
  this.$on('el.form.removeField', (field) => {
    if (field.prop) {
      this.fields.splice(this.fields.indexOf(field), 1);
    }
  });
}
```

​ 在 form-item 挂载时向 form 父组件发布 el.form.addField 消息，form 组件接受消息后，将该 form-item 实例加入到 fileds 数组中。反之，在 form-item 销毁发送 el.form.removeFileld 消息，form 组件接受消息后在 fields 中将该 form-item 实例删除。这样就维护了一个 form-item 的实例数组。

## 3.2 表单校验 validate

​ 上一步中已经维护了表单中的表单项的数组，那么对所有表单项进行校验就很简单了，我们来看代码

```ini
// element-ui\packages\form\src\form.vue
validate(callback) {
  // 没有model直接返回
  if (!this.model) {
    console.warn('[Element Warn][Form]model is required for validate to work!');
    return;
  }

  let promise;

  if (typeof callback !== 'function' && window.Promise) {
    promise = new window.Promise((resolve, reject) => {
      callback = function(valid) {
        valid ? resolve(valid) : reject(valid);
      };
    });
  }

  let valid = true;
  let count = 0;
  // 如果没有表单项，无需校验，直接返回true
  if (this.fields.length === 0 && callback) {
    callback(true);
  }
  let invalidFields = {};
  // 对每一个表单项，调用表单项自身的validate方法进行校验
  this.fields.forEach(field => {
    field.validate('', (message, field) => {
      if (message) {
        // 有一个表单项校验失败，valid置未false
        valid = false;
      }
      // 记录校验失败的表单项
      invalidFields = objectAssign({}, invalidFields, field);
      if (typeof callback === 'function' && ++count === this.fields.length) {
        // 完成最后一个表单项的校验后，调用callback
        callback(valid, invalidFields);
      }
    });
  });

  if (promise) {
    // 如果没有传入callback,则返回的是一个promise对象
    return promise;
  }
}
```

​ 从代码中可以看出，表单的校验确实就是依次执行表单项的校验，最后将校验结果组合后传入 callback 中执行。
