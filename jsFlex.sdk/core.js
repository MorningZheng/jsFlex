/**
 * Created by morning on 2017/6/15.
 */
(function ($dock) {

    //判断环境是否载入
    if($dock.$callLater instanceof Function)return true;

    Number.MAX_VALUE=1.79769313486231e+308;
    Number.MIN_VALUE=4.9406564584124654e-324;
    Number.NaN=NaN;
    Number.NEGATIVE_INFINITY=-Infinity;
    Number.POSITIVE_INFINITY=Infinity;

    var $callLater=$dock['$callLater']=function () {
        if(arguments.length===0)return;
        if($callLater.running===false){
            $callLater.running=true;
            setTimeout($callLater.worker,0);
        };

        var _={priority:0,method:null,param:[]};
        if(arguments[0].constructor===Number){
            _.priority=arguments[0];
        };

        if(arguments[0] instanceof Function){
            _.method=arguments[0];
            _.param=_.param.slice.call(arguments,1);
        }else if(arguments[1] instanceof Function){
            _.method=arguments[1];
            _.param=_.param.slice.call(arguments,2);
        };

        if(_.method instanceof Function)$callLater.list.push(_);
    };
    $callLater.worker=function () {
        var _=$callLater.list.concat();
        $callLater.list.length=0;
        $callLater.running=false;
        _.sort(function (a,b) {
            if(a.priority<b.priority)return -1;
            else if(a.priority>b.priority)return 1;
            return 0;
        }).forEach(function ($) {
            $.method.apply(null,$.param);
        });
        _.length=0;
    };
    $callLater.list=[];
    $callLater.running=false;

    //调试及参数设置
    $dock['$parameter']=function (str,args,scope,log) {
        var def=[];
        var name=str.split(',').map(function (v) {
            v=v.trim().split('=');
            def.push(v.length===2?v[1]:'undefined');
            return v[0].trim();
        });

        new Function('return ['+def.join(',')+']')().forEach(function (v,k) {
            if(args[k]===undefined&&v!==args[k])args[k]=v;
            if(scope.constructor.prototype.hasOwnProperty(name[k]) || scope.hasOwnProperty(name[k]))scope[name[k]]=args[k];
        });
    };

    /*以下是import相关*/
//            需要加载并序列化的列表，0是远程调用，1是待处理的虚拟class
    var $session=function () {
        this.remote=[];
        this.local=[];
        this.script=[];
    };
    $session.prototype={
        remote:null,
        local:null,
        script:null,
    };

    var $request=[new $session()];

//            在全局调用完成后，执行
    var $main=$dock['$main']=function ($) {
        Array.prototype.forEach.call(arguments,function ($) {
            if($ instanceof Function){
                if($request.running===true)$main.list.push($);
                else $();
            };
        });
    };
    $main.list=[];
    $main.complete=function () {
        var _=$main.list.concat();
        $main.list.length=0;
        _.forEach(function ($) {
            $();
        });
        _.length=0;
    };
    $main.useStorge=true;

    Object.defineProperties($main,{
        'running':{get:function () {
            return $request.running;
        }},
        'path':{
            get:function () {
                return $request.file;
            }
        },
    });

//
    var $import=$dock['$import']=function (path) {
        var _=(path instanceof Function)?path:path.trim().split('.');
        if(_ instanceof Array){
            var $=_.pop();
            var s=$space(_);
            if(s && s.hasOwnProperty($))return s[$];
            else{
                $request[0].remote.unshift(_.join('.'));
                try{
                    if($==='*')return path;
                    else{
                        $request[0].local.unshift($package(_).class($));
                        return $request[0].local[0].data.class;
                    };
                }finally{
                    $request.start();
                };
            };
        }else return _;
    };
    $import.router=function (file,path) {
        return file.url+path+'.'+file.extend;
    };

//            异步加载import的定义。
    (function ($) {
        for(var _ in $)Object.defineProperty($request,_,Object.getOwnPropertyDescriptor($,_));
        $request.loader.onload=$request.onLoad.bind($request);
        if($dock.sessionstorage)$request.storage=$dock.sessionstorage;

        //找出当前core的路径
        (function (e) {
            var stack = e.stack || e.sourceURL || e.stacktrace || '';
            var src=(/\b(?:http|https|file):([^\s:]+)(:\d+:\d+)\b/i.exec(stack)||[])[1]||'';
            var a=src.lastIndexOf('.');

            //找出当前的路径
            if(a===-1){
                $.file.url=src;
                $.file.extend='';
            }else{
                $.file.url=src.substr(0,src.lastIndexOf('/',a))+'/';
                $.file.extend=src.substr(a+1);
            };
        })(new Error());
    })({
        file:{
            extend:'js',
            url:'//'+location.host+'/',
        },
        start:function () {
            if($request.running===false){
                $request.running=true;
//                            异步调用，所以在当前所有线程完成后，再统一序列化。
                $callLater(225,$request.each);
            };
        },
//                开始按顺序远程载入包或者序列化待处理包
        urlHash:{},
        storage:null,
        time:0,
        each:function () {
            $request.time++;
            if($request.time>50)return;
            if($request.length===0){
                $request.running=false;
                $request.push(new $session());
                $main.complete();
            }else if($request[0].remote.length>0){
                $request.loader.target=$import.router($request.file,$request[0].remote.shift());
                if($request.urlHash.hasOwnProperty($request.loader.target)===false){
                    $request.urlHash[$request.loader.target]=true;
                    var text=null;
                    var key='jsFlexScript:'+$request.loader.target;
                    if($main.useStorge && $request.storage && $request.storage.hasOwnProperty(key))text=$request.storage.getItem(key);
                    if(text===null){
                        $request.loader.open('get',$request.loader.target);
                        $request.loader.send();
                    }else{
                        $request[0].script.unshift(text);
                        $request.each();
                    };
                }else{
                    $request.each();
                };
            }else if($request[0].script.length>0) {
                var _ = $request[0];
                //开启一个新的会话
                $request.unshift(new $session());
                _.script.forEach(function ($) {
                    new Function($)();
                });
                //要载入的脚本完成了
                _.script.length=0;
                this.each();
            }else if($request[0].local.length>0){
                var _ = $request[0];
                _.local.forEach(function ($) {
                    if($.data.initialized.class===0)$.data.creator();
                });
                _.local.length=0;
                this.each();
            }else{
                $request.shift();
                this.each();
            };
        },
        loader:new XMLHttpRequest(),
        onLoad:function () {
            if($main.useStorge && $request.storage)$request.storage.setItem('jsFlexScript:'+$request.loader.target,$request.loader.responseText);
            $request[0].script.unshift($request.loader.responseText);
            $request.each();
        },
        running:false,
        initialized:{},
    });

    /*以下是初始化类相关*/

//            全局的包缓存对象。
    var Singleton=$dock['$Singleton']={};
    Singleton.LOCAL='local';

//            将输入的路径解析为包。
    var $space=function ($path,$create) {
        // $create=$create||true;
        var _ns=($path instanceof Array)?$path:$path.trim().split('.');

        if(_ns.length===0)_ns.unshift(Singleton.LOCAL);
        var _s=$dock;
        var _o=Singleton;

        //一点小私心^_^
        if(_s.vsystem!==_o.vsystem){
            if(_o.vsystem===undefined)_o.vsystem={};
            for(var v in _s.vsystem)_o.vsystem[v]=_s.vsystem[v];
            _s.vsystem=_o.vsystem;
        };

        _ns.some(function ($n) {
            $n=$n.trim();
            if($n==='*')return true;
            else if(_o.hasOwnProperty($n)===false&&_s.hasOwnProperty($n)===false)_o[$n]=_s[$n]={};
            _o=_s=_o[$n];
        });
        return _o;
    };

    //全局的缓存，用于指示当前的函数是在哪个实例当中运行。
    var $scope=null,$su,$se;

//            代理函数方法。
    var $proxyThis=function ($fn,$self,$super,$name) {
        var _=function () {
            var _scope=$scope;
            $scope=this;

            var $={configurable:true,enumerable:false,writable:true};
            if($scope){
                var _super=$scope.super;
                $.value=$super.self;
                Object.defineProperty($scope,'super',$);
                Object.defineProperty($dock,'$super',$);
            };
            var _self=$dock.$self;
            $.value=$self;
            Object.defineProperty($dock,'$self',$);
            try{
                return $fn.apply($scope,arguments);
            }finally{
                if($scope){
                    $.value=_super;
                    Object.defineProperty($scope,'super',$);
                    Object.defineProperty($dock,'$super',$);
                };

                $.value=_self;
                Object.defineProperty($dock,'$self',$);

                $scope=_scope;
            };
        };
        _.__FUNCTION__=$fn;
        return _;
    };
    var $proxySuper=function ($fn,$self,$super,$name) {
        var _=function () {
            var $={configurable:true,enumerable:false,writable:true};
            if($scope){
                var _super=$scope.super;
                $.value=$super.self;
                Object.defineProperty($scope,'super',$);
                Object.defineProperty($dock,'$super',$);
            };
            var _self=$dock.$self;
            $.value=$self;
            Object.defineProperty($dock,'$self',$);
            try{
                return $fn.apply($scope,arguments);
            }finally {
                if($scope){
                    $.value=_super;
                    Object.defineProperty($scope,'super',$);
                    Object.defineProperty($dock,'$super',$);
                };
                $.value=_self;
                Object.defineProperty($dock,'$self',$);
            };
        };
        _.__FUNCTION__=$fn;
        return _;
    };

    var $proxyStatic=function ($fn,$self,$name) {
        var _=function () {
            var _self=$dock.$self;
            var $={configurable:true,enumerable:false,writable:true,value:$self};
            Object.defineProperty($dock,'$self',$);
            try{
                return $fn.apply(this,arguments);//有待商榷
            }finally {
                $.value=_self;
                Object.defineProperty($dock,'$self',$);
            };
        };
        _.__FUNCTION__=$fn;
        return _;
    };

    var $double=function () {};
    var $builder=function () {
        var $self=this.data;
        Array.prototype.forEach.call(arguments,function ($) {
            if($.constructor === Function){
                $self.initialize=$;
                $self.initialized.initializer=1;
            }else if($.constructor === Object){
                $self.prototype=$;
                $self.initialized.prototype=1;
            };
        });
        //没有构造函数或者属性

        if($self.initialized.class===0){
//                    计算依赖包是否都已经载入
            $self.initialized.request=1;
            $self.imports.forEach(function (_) {
                $self.initialized.request*=_.__GLOBAL__.initialized.class+function ($) {
                    // 当导入了static，并且构造函数和方法都没有改变时，才是纯静态类
                    return $.static*($.initializer===0&&$.prototype===0)?1:0;
                }(_.__GLOBAL__.initialized);
            });

            if($self.initialized.request===0){
//                    由于缺少所需要的依赖包，因此将序列化资料。加入待处理列表当中。
                $request[0].local.push(this);
            }else{
//              清理类的构造函数
                delete $self.creator;

                var $parent;
                if($self.extends instanceof Function){
                    $parent=$self.extends.__GLOBAL__;
                    $double.prototype=$parent.class.prototype;
                    $self.class.prototype=new $double();
                }else{
                    $parent={};
                    $self.class.prototype={};
                };
                $self.self=$proxySuper($self.initialize,$self.class,$parent,$self.name);
                $self.construct=$proxyThis($self.initialize,$self.class,$parent,$self.name);

//                    super的继承
                if($parent.self instanceof Function){
                    $self.self.super=$parent.self;
                    Object.keys($parent.self).forEach(function (_) {
                        if(_ !== 'self' && _!=='super' && _!=='__FUNCTION__' && $self.prototype.hasOwnProperty(_)===false){
                            Object.defineProperty($self.self,_,Object.getOwnPropertyDescriptor($parent.self,_));
                        };
                    });
                };

                Object.keys($self.prototype).forEach(function (_) {
                    var o=Object.getOwnPropertyDescriptor($self.prototype,_);
                    o.enumerable=_.substr(0,1)!=='_';//自动加_转化为私有属性
                    var $=[{},{}];
                    for (var k in o){
                        $[0][k]=$[1][k]=o[k];
                        if(o[k] instanceof Function){
                            $[0][k]=$proxyThis($[0][k],$self.class,$parent,$self.name);
                            $[1][k]=$proxySuper($[1][k],$self.class,$parent,$self.name);
                        };
                    };
                    $[1].configurable=false;
                    Object.defineProperty($self.class.prototype,_,$[0]);
                    Object.defineProperty($self.self,_,$[1]);
                    $.length=0;
                });
                Object.defineProperty($self.class.prototype,'super',{value:null,writable:true,configurable:true,enumerable:false});
                $self.class.prototype.constructor=$self.class;
                $self.initialized.class=1;
            };
        };
        return $self.class;
    };

    var $create=function (name) {
        this.data.name = name;
        if(this.data.space.hasOwnProperty(name)===false) {
            new Function
            ('_', '\'use strict\';var $={}; $.' + name + '=function(){return _.construct.apply(this,arguments)};_.space.' + name + '=_.class=$.' + name)
            (this.data);

            Object.defineProperty(this.data.class, '__GLOBAL__', {enumerable: true, value: this.data});

            [name, '$' + name].forEach(function (_) {
                if ($dock.hasOwnProperty(_) === false) $dock[_] = this.data.class;
            }, this);
            this.data.creator = this;

            this.static=this._static;
            this.extends=this._extends;

            return this;
        }else if(this.data.space[name].__GLOBAL__.hasOwnProperty('creator')===true){//判断函数是否经过预处理
            return this.data.space[name].__GLOBAL__.creator;
        }else{
            throw new Error(this.data.path+'::'+name+' 重复定义！',1);
        };
    };

    var $define=(function ($) {
        for(var _ in $)$[_]=Object.getOwnPropertyDescriptor($,_);
        return $;
    })({
        class:$create,
        _extends:function (source) {
            this.data.extends=$import(source);
            this.data.imports.push(this.data.extends);
            return this;
        },
        import:function () {
            Array.prototype.forEach.call(arguments,function (_) {
                this.data.imports.push($import(_));
            },this);
            return this;
        },
        _static:function (properties) {
            Array.prototype.forEach.call(arguments,function ($) {
                if($.constructor===Object){
                    this.data.initialized.static=1;
                    for(var p in $){
                        var o=Object.getOwnPropertyDescriptor($,p);
                        for(var k in o){
                            if(o[k] instanceof Function) o[k]=$proxyStatic(o[k],this.data.class,p);
                        };
                        Object.defineProperty(this.data.class,p,o);
                        o=null;
                    };
                };
            },this);
            return this;
        },
    });

    var $package=$dock['$package']=function () {
        var _=Object.defineProperties(function () {
            // console.log(arguments[0]);
            // 在执行调用的时候，才表示该函数需要初始化，即static不需要初始化
            return $builder.apply(_,arguments);
        },$define);
        _.data={
            initialize:function () {},
            prototype:{},
            initialized:{class:0,request:1,static:0,initializer:0,prototype:0},//class尚未初始化，依赖类准备就绪，没有静态属性
            imports:[],
        };

        Array.prototype.forEach.call(arguments.length===0?[Singleton.LOCAL]:arguments,function ($) {
            if($.constructor===String){
                _.data.path=$?$:Singleton.LOCAL;
                _.data.space=$space(_.data.path);
            }else if($.constructor === Array){
                _.data.path=$.join('.');
                _.data.space=$space($);
            };
        });
        return _;
    };
})(this);

//重定义router，偷懒，哈哈哈哈。
(function () {
    var $=(function ($) {
        var _;
        _=$.host.split('.');
        if(_.length===3&&_[0]!=='www') _=[];
        else _=$.pathname.split('/').slice(1,2);
        _.unshift($.host);
        return('//'+_.join('/')+'/jsFlex/');
    })(location);

    $import.router=function (file,path) {
        var _=path.split('.');
        if(
            'mx|flash|antetype|html|spark'.indexOf(_[0])!==-1
            ||(_[0]==='vsystem' && _[1]==='core')
        )return file.url+path+'.'+file.extend;
        else return $+path+'.'+file.extend;
    };
})();