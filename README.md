# jsFlex

---

##### jsFlex是一个思路来源于Apache Flex（原Adobe Flex），试图做到以下几个目标：

1. 通过实现class和package机制，增强web前端项目管理的能力，简化js开发流程，降低项目门槛。
1. 允许使用mxml标签式编程。
1. 模拟Flex SDK的大部分API，包括Binding。


##### 现在已经实现的以下几个功能。


1. 类的实现。
2. 全自动化import，并JIT。
3. MXML标签编程。
4. 实现了super（使用this.super进行调用）。
5. 纯粹前端实现，完全不依赖后端提供的支撑。

**定义class的例子**


```
$package(路径名 String)
        .import(
            类1 String
            类2 String
            ... etc
        )
        .extends(父类 Class Or String)
        .class(定义的类名 String)(
            //构造函数
            function () {
                //调用父方法
                this.super();
            },
            //定义类方法
            {
                方法1:function(){
                    //do something
                },
                方法2:function(){
                    //do something
                },
                ... etc
            }
        );
```

#### 注意：
1. addEventListener、setTimeout时，请使用Function.bind(this)绑定上下文。
2. 如果你打算只使用class支持，那么只用引入如下代码：
###### browser：
```
<script type="text/javascript" charset="UTF-8" src="jsFlex.sdk/core.js"></script>
```
###### nodejs：

```
require('jsFlex.sdk/core.js');
```
3. 启用mxml支持，需要：

```
$import('mx.utils.flex')
```

并做请求完成后的相应：

```
$main(function () {
    mx.utils.flex.local();
    mx.utils.router.boot(function () {
        //do something...
    });
});

```
mxml的编程，现在仅适用于browser，在nodejs上的支持，请等待稍后的版本。


##### 更详细的例子，详见demo.html。
##### jsFlex.sdk不仅仅包括了class polyfill，更多的是对flex控件的实现。
