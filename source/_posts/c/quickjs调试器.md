---
title: quickjs调试工具
tags:
  - 前端
  - C
categories: C
keywords: '前端,面试,C'
description: quickjs调试工具
top_img: 设置false不显示顶部图片
sticky: 101
cover: "https://raw.githubusercontent.com/why862555625/images/main/images/18.jpg"
comments: false评论
abbrlink: d9795d10
date: 2023-05-23 15:21:13
updated: 2023-05-23 15:21:13
---



vela系统quickjs对接devtools

<!-- more -->

## vela快应用调试功能概览
[cdp协议]: https://chromedevtools.github.io/devtools-protocol/tot/Overlay/#event-highlightNode

![image-20230525102147522](https://raw.githubusercontent.com/why862555625/images/main/image-20230525102147522.png)

# vela debug调试功能

debug调试功能图

![image-20230525111407415](https://raw.githubusercontent.com/why862555625/images/main/image-20230525111407415.png)

vela debug调试功能实现大致分为4个步骤：

1. **连接时将所有的源码发送给devtools。**
2. **在devtools 的source功能中打断点、将请求发送给下层cdp.**
3. **cdp计算断点具体在字节码中的位置、并记录。**
4. **在引擎执行字节码时判断有无命中断点。**

下面具体说明这四个步骤：

## 1. 连接时将所有的源码发送给devtools

在调用loadApplication时会将app的路径保存在APP类中，也就是app的rpk的最外层路径。在监听到devtool连接时，会将rpk包中的所js文件发送给devtools，devtools会将这些js文件拼接成上图中的source文件。

## 2. 在devtools 的source功能中打断点、将请求发送给下层cdp

当打开source文件上打断点、devtools会将断点的文件名、行号发送到下层cdp.

## 3. cdp计算断点具体在字节码中的位置、并记录。

- 断点功能的输入实际上是文件名和断点行信息，第一步我们需要利用这个信息，找到模块，进而首先找到目标函数。
  - quickjs在真实加载module的时候都会调用JS_EvalInternal。我们可以在这个函数里面监听并记录已经加载完的模块。

- 每个函数对象上都记录了自身的起始行，通过pc2line table可以计算得到结束行，进而和传入的行号进行范围匹配计算。
  - 函数和字节码的映射规则：
    - 如果一行源码对应的字节码较短，就将前4位存源码的行数，后四位存字节码对应的行数
    - 如果一个源码对应的字节码较长，就先存入一个0值（解析pc2line_buf的时候遇到0值会自动将下一个当做128  int来解析），后面补一个128的int，这个int的高位用来存源码行数、低位存字节码的行数。

**计算结束行函数：**

```c++
#define PC2LINE_BASE     (-1)
#define PC2LINE_RANGE    5
#define PC2LINE_OP_FIRST 1
#define PC2LINE_DIFF_PC_MAX ((255 - PC2LINE_OP_FIRST) / PC2LINE_RANGE)
static int caculate_function_last_line(JSFunctionBytecode* b) {
    unsigned int op;
    int ret, v;
    FunctionBytecodeDebugInfo* debug = js_debugger_get_bytecode_debug_info(b);
    int line_num = debug->line_num, new_line_num;
    uint8_t *p = debug->pc2line_buf;
    uint8_t *p_end = p + debug->pc2line_len;
    int succ = 1;

    // scan line by line
    while (p < p_end) {
        op = *p++;
        if (op == 0) {
            uint32_t val;
            ret = get_leb128(&val, p, p_end);
            if (ret < 0) {
                succ = 0;
                break;
            }
            // pc += val;
            p += ret;
            ret = get_sleb128(&v, p, p_end);
            if (ret < 0) {
                succ = 0;
                break;
            }
            p += ret;
            new_line_num = line_num + v;
        } else {
            op -= PC2LINE_OP_FIRST;
            new_line_num = line_num + (op % PC2LINE_RANGE) + PC2LINE_BASE;
        }
        line_num = new_line_num;
    }
    return succ ? line_num : 0;
}

STATIC int get_leb128(uint32_t *pval, const uint8_t *buf,
                      const uint8_t *buf_end)
{
    const uint8_t *ptr = buf;
    uint32_t v, a, i;
    v = 0;
    for(i = 0; i < 5; i++) {
        if (unlikely(ptr >= buf_end))
            break;
        a = *ptr++;
        v |= (a & 0x7f) << (i * 7);
        if (!(a & 0x80)) {
            *pval = v;
            return ptr - buf;
        }
    }
    *pval = 0;
    return -1;
}
STATIC int get_sleb128(int32_t *pval, const uint8_t *buf,
                       const uint8_t *buf_end)
{
    int ret;
    uint32_t val;
    ret = get_leb128(&val, buf, buf_end);
    if (ret < 0) {
        *pval = 0;
        return -1;
    }
    *pval = (val >> 1) ^ -(val & 1);
    return ret;
}
```

**源码表和字节码表对应规则：**

```c++

static void compute_pc2line_info(JSFunctionDef *s)
{
    if (!(s->js_mode & JS_MODE_STRIP) && s->line_number_slots) {
        int last_line_num = s->line_num;
        uint32_t last_pc = 0;
        int i;

        js_dbuf_init(s->ctx, &s->pc2line);
        for (i = 0; i < s->line_number_count; i++) {
            uint32_t pc = s->line_number_slots[i].pc;
            int line_num = s->line_number_slots[i].line_num;
            int diff_pc, diff_line;

            if (line_num < 0)
                continue;

            diff_pc = pc - last_pc;
            diff_line = line_num - last_line_num;
            if (diff_line == 0 || diff_pc < 0)
                continue;

            if (diff_line >= PC2LINE_BASE &&
                diff_line < PC2LINE_BASE + PC2LINE_RANGE &&
                diff_pc <= PC2LINE_DIFF_PC_MAX) {
                dbuf_putc(&s->pc2line, (diff_line - PC2LINE_BASE) +
                          diff_pc * PC2LINE_RANGE + PC2LINE_OP_FIRST);
            } else {
                /* longer encoding */
                dbuf_putc(&s->pc2line, 0);
                dbuf_put_leb128(&s->pc2line, diff_pc);
                dbuf_put_sleb128(&s->pc2line, diff_line);
            }
            last_pc = pc;
            last_line_num = line_num;
        }
    }
}
```



- 需要注意匹配到的函数可能只是外层函数，具体的断点偏移计算时要考虑递归子函数。

  - 基于pc2line table计算断点在函数字节码中的偏移位置，计算时如果目出现计算出来的行号比目标行号大的情况 `end_line_num>cur_line_num>targe_num`，说明断点落在了子函数中，需要递归，直到最终找到或全部失败。

  

  ![image-20230525125207891](https://raw.githubusercontent.com/why862555625/images/main/image-20230525125207891.png)

- 断点断到、将pause消息和目前上下文的变量信息和调用栈发送给devtools。

  - runtime上面保留了当前栈的信息JSStackFrame，JSStackFrame上面保存了栈上的变量、参数、函数信息；并且JSStackFrame可以通过prev_frame向上查找栈信息。这样遍历下来就可以完整的得到栈上的变量和调用栈。

  

**JSRuntime和JSStackFrame的数据结构**

```C++

struct JSRuntime {
    JSMallocFunctions mf;
    JSMallocState malloc_state;
    const char *rt_info;

    int atom_hash_size; /* power of two */
    int atom_count;
    int atom_size;
    int atom_count_resize; /* resize hash table at this count */
    uint32_t *atom_hash;
    JSAtomStruct **atom_array;
    int atom_free_index; /* 0 = none */

    int class_count;    /* size of class_array */
    JSClass *class_array;

    struct list_head context_list; /* list of JSContext.link */
    /* list of JSGCObjectHeader.link. List of allocated GC objects (used
       by the garbage collector) */
    struct list_head gc_obj_list;
    /* list of JSGCObjectHeader.link. Used during JS_FreeValueRT() */
    struct list_head gc_zero_ref_count_list;
    struct list_head tmp_obj_list; /* used during GC */
    JSGCPhaseEnum gc_phase : 8;
    size_t malloc_gc_threshold;
#ifdef DUMP_LEAKS
    struct list_head string_list; /* list of JSString.link */
#endif
    /* stack limitation */
    uintptr_t stack_size; /* in bytes, 0 if no limit */
    uintptr_t stack_top;
    uintptr_t stack_limit; /* lower stack limit */

    JSValue current_exception;
    /* true if inside an out of memory error, to avoid recursing */
    BOOL in_out_of_memory : 8;

    struct JSStackFrame *current_stack_frame;  // current stack info

    JSInterruptHandler *interrupt_handler;
    void *interrupt_opaque;

    JSHostPromiseRejectionTracker *host_promise_rejection_tracker;
    void *host_promise_rejection_tracker_opaque;

    struct list_head job_list; /* list of JSJobEntry.link */

    JSModuleNormalizeFunc *module_normalize_func;
    JSModuleLoaderFunc *module_loader_func;
    void *module_loader_opaque;

    BOOL can_block : 8; /* TRUE if Atomics.wait can block */
    /* used to allocate, free and clone SharedArrayBuffers */
    JSSharedArrayBufferFunctions sab_funcs;

    /* Shape hash table */
    int shape_hash_bits;
    int shape_hash_size;
    int shape_hash_count; /* number of hashed shapes */
    JSShape **shape_hash;
#ifdef CONFIG_BIGNUM
    bf_context_t bf_ctx;
    JSNumericOperations bigint_ops;
    JSNumericOperations bigfloat_ops;
    JSNumericOperations bigdecimal_ops;
    uint32_t operator_count;
#endif
    void *user_opaque;
#ifdef CONFIG_INTERPRETERS_QUICKJS_DEBUG
    struct JSDebuggerInfo debugger_info;
    struct DumpMemoryInfo dump_memory_info;
#endif
    JSOutOfMemoryTracker* oom_tracker;
#ifdef CONFIG_MEMORY_LEAK_TRACK
    int isStartMemoryDump;
    vector* newObjVector;
    JSContext* currentCtx;
    char* pageStatus;
#endif
};

typedef struct JSStackFrame {
    struct JSStackFrame *prev_frame; /* NULL if first stack frame */
    JSValue cur_func; /* current function, JS_UNDEFINED if the frame is detached */
    JSValue *arg_buf; /* arguments */
    JSValue *var_buf; /* variables */
    struct list_head var_ref_list; /* list of JSVarRef.link */
    const uint8_t *cur_pc; /* only used in bytecode functions : PC of the
                        instruction after the call */
    int arg_count;
    int js_mode; /* 0 or JS_MODE_MATH for C functions */
    /* only used in generators. Current stack pointer value. NULL if
       the function is running. */
    JSValue *cur_sp;
} JSStackFrame;

```

**函数数据结构：**

![](https://raw.githubusercontent.com/why862555625/images/main/image-20230525144252998.png)

**查找目标函数流程：**

![](https://raw.githubusercontent.com/why862555625/images/main/image-20230525124949165.png)



## 4. 在引擎执行字节码时判断有无命中断点。

命中断点有两个设计思路：

**第一种：**

直接修改字节码、插入debugger指令和nop\需要额外注意在命中后和取消时将字节码恢复、否则会出现问题。

![image-20230525161322186](https://raw.githubusercontent.com/why862555625/images/main/image-20230525161322186.png)

**第二种：**

分配一块和字节码相同长度的数组、在相同的便宜位置写入1、作为断点标志、方便命中检查。

![image-20230525161507336](https://raw.githubusercontent.com/why862555625/images/main/image-20230525161507336.png)

断点命中的核心思路实在引擎解释执行字节码的时候插入堆断点命中的检查、命中断电后停止执行（不在继续解释下一条指令）。

这里选择重定义字节码的case定义、如果开启了调试功能、则每次解释执行字节码都会插入对js_debugger_check函数执行、他负责检查每一步执行是否命中断点。检查方法很简单、检查当前pc是否落在了断点的范围内（依赖设置断点）

```c++
#ifdef CONFIG_INTERPRETERS_QUICKJS_DEBUG
#define CASE(op)        case op: js_debugger_check(ctx, pc); stub_ ## op
#else
#define CASE(op)        case op: stub_ ## op
#endif
```

**执行字节码：**

![image-20230525170447952](https://raw.githubusercontent.com/why862555625/images/main/image-20230525170447952.png)

js_debugger_check 中暂停的主要逻辑是一个`while(ture)`循环，然后每次执行libuv_run_once()推一次主循环的句柄，用来判断服务端是否放开断点。



# memory 功能



memory功能大概可以概述为三个部分：

1. 接受devtools  memory dump的请求之后，开始遍历引擎的堆内存链表（v8是使用图结构来表示的堆内存、quickjs是使用链表表示的）。
2. 将quickjs中的链表内存转化为图结构内存。（devtools snapshot需要图结构）
3. 将图结构转化为snapshot发送给devtools、devtools进行解析并显示。

## 1. 理解引擎的堆内存结构

quickjs的runtime中的gc_obj_list保存了引擎中的所有堆对象的JSGCObjectHeader.遍历gc_obj_list就可以得到所有的堆对象信息

```c++

struct JSGCObjectHeader {
    int ref_count; /* must come first, 32-bit */
    JSGCObjectTypeEnum gc_obj_type : 4;
    uint8_t mark : 4; /* used by the GC */
    uint8_t dummy1; /* not used by the GC */
    uint16_t dummy2; /* not used by the GC */
    struct list_head link;
    int64_t id;
};
```



![image-20230525171354456](https://raw.githubusercontent.com/why862555625/images/main/image-20230525171354456.png)



## 2. 理解snapshot文件格式

- V8 HeapSnapshot文件整体采用JSON格式存储。
- 存储时采用Meta + 内容的方式，Meta里描述了各个字段的含义，各个节点的数量等。
- 内存dump信息按照点集和边集的形式存储。点集存储节点信息，边集存储对象之间的链接关系。
- 字符串是单独存储的，节点中使用时采用下标引用的方式以节约内存。



![image-20230525172031289](https://raw.githubusercontent.com/why862555625/images/main/image-20230525172031289.png)





## 3.堆对象处理：从链表到图

Quickjs中GC对象是通过链表保存的，但HeapSnapshot中是按照图结构保存的，所以需要有一个从链表构建对象图的过程，我生成了一个代理结构，额外记录了对象间的链接关系。

如果不这样做，就需要修改quickjs的GC list结构，这样改动会很大。



![image-20230525172159734](https://raw.githubusercontent.com/why862555625/images/main/image-20230525172159734.png)

## 4. Proxy图的构建算法

![image-20230525172302551](https://raw.githubusercontent.com/why862555625/images/main/image-20230525172302551.png)















