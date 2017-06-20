# jsFlex

---

##### jsFlex是一个思路来源于Apache Flex（原Adobe Flex），试图做到以下几个目标：

1. 通过实现class和package机制，增强web前端项目管理的机制，简化js开发流程，降低项目门槛。
1. 允许使用mxml标签式编程。
1. 模拟Flex SDK的大部分API，包括Binding。


##### 现在已经实现的以下几个功能。


1. 定义类
2. 全自动化import，并实现JIT
3. MXML标签编程
4. 实现了super（使用this.super进行调用）

**定义class的例子**


```
$package(路径名 String)
        .import(
            类1 String
            类2 String``
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

##### 更详细的例子，详见demo.html。