(function ($dock) {
    //判断环境是否载入
    if($dock.$callLater instanceof Function)return true;

    Number.MAX_VALUE=1.79769313486231e+308;
    Number.MIN_VALUE=4.9406564584124654e-324;
    Number.NaN=NaN;
    Number.NEGATIVE_INFINITY=-Infinity;
    Number.POSITIVE_INFINITY=Infinity;

    (function () {
        'use strict';

        var $callLater=$dock['$callLater']=(function () {
            var $worker=function () {
                var _=$list.concat();
                $list.length=0;
                $running=false;
                _.sort(function (a,b) {
                    if(a.priority<b.priority)return -1;
                    else if(a.priority>b.priority)return 1;
                    return 0;
                }).forEach(function ($) {
                    $.method.apply($,$.param);
                });
                _.length=0;
            };
            var $list=[];
            var $running=false;

            return function () {
                if(arguments.length===0)return;
                if($running===false){
                    $running=true;
                    setTimeout($worker,0);
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

                if(_.method instanceof Function)$list.push(_);
            };
        })();

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


        var $main=$dock['$main']=(function () {
            var $list=[];
            var $running=false;
            var $ready=false;

            //在当前桢全部执行完成后，再允许加载。
            setTimeout(function () {
                $ready=true;
            },0);

            var $start=function () {
                while($list.length>0){
                    ($list.shift())();
                };
                $running=false;
            };

            return function ($) {
                Array.prototype.forEach.call(arguments,function ($) {
                    if($ instanceof Function)$list.push($);
                });
                if($running===false && $ready===true && $import.running!==true) $start($running=true);//$import异步加载结束后会自动执行，所以这里过滤掉
            }
        })();

//            全局的包缓存对象。
        var Singleton=$dock['$Singleton']={LOCAL:'local'};

//                获取命名空间
        var $path=function (str) {
            return str.split('.').reduce(function ($,_) {
                _=_.trim();
                if(_)$.push(_);
                return $;
            },[]);
        };

        var $space=function (a) {
            if(!a)return undefined;
            else if(a.constructor===Array){
                var o=Singleton;
                a.slice(0,-1).forEach(function ($) {
                    if(o.hasOwnProperty($)===false)o[$]={};
                    o=o[$];
                });

                //指针
                if($dock.hasOwnProperty(a[0])===false)$dock[a[0]]=Singleton[a[0]];

                return [o,o[a.slice(-1)]];
            }else return a;
        };

        var $import=$dock['$import']=(function () {
            var $list=[];
            var $file=[];
            var $page=undefined;

            var $start=function (file) {
                if($list.hasOwnProperty(file)===false){
                    $list[file]=true;
                    $list.push(file);
                    if($import.running!==true){
                        $import.running=true;
                        $load();
                    };
                };
            };
            var $share=$dock.sessionStorage;

            var $load=(function () {
                //以下是符合IE的写法
                var x;
                var stateChange=function (e) {
                    if(x.readyState===4){
                        if(x.status===200){
//                                当前页面的请求只做一次，减少请求，需要想想，可能有瑕疵
                            if($share)$share.setItem('jsFlexScript:'+$page,x.responseText);
                            $file.unshift(x.responseText);
                            x.abort();
                            $load();
                        };
                    };
                };

                var $get=function (file) {
                    if($share&&$import.useStorage===true&&$share.hasOwnProperty('jsFlexScript:'+file)){
                        $file.push($share.getItem('jsFlexScript:'+file));
                        $load();
                    }else{
                        $page=file;

                        x=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
                        x.onreadystatechange=stateChange;
                        x.open('get',$page);
                        x.send();
                    };
                };

                return function () {
                    if($list.length===0){
                        $import.running=false;
                        $file.concat().forEach(function ($) {
                            (new Function($))();
                        });
                        $file.length=0;
//                                完成，回调
                        $callLater($main);
                    }else $get($list.pop());
                };
            })();

            return function (path) {
                if(!path) return;
                else if(path instanceof Function)return path;
                else if(path.constructor===String){
                    path=$path(path);
                    if(path.slice(-1)[0]==='*')return $start($import.router($import.file,path.slice(0,-1)));
                    else{
                        var o=Singleton;
                        path.some(function(v,k){
                            o=o[v];
                            return o instanceof Function||o===undefined;
                        });

                        if(o instanceof Function)return o;
                        else if(o===undefined){
                            $start($import.router($import.file,path.slice(0,-1)));
                            return $package(path.slice(0,-1)).class(path.slice(-1)[0]);
                        }else return ;
                    };
                };
            };
        })();
        (function (_) {
            Object.keys(_).forEach(function (t) {
                $import[t]=_[t];
            });
        })({
            router:function (file,path) {
                return file.url+path+'.'+file.extend;
            },
            file:{ extend:'js', url:'//'+location.host+'/',},
            useStorage:false,
        });

        var $package=$dock['$package']=(function () {
            var $jsFlex={version:'0.0.3',jsFlex:true};

            var $counter=-1000000000000000;

//                初始化函数
            var $initializer=function (global,silence) {
//                    初始化类的继承等等
                if(global.initialized!==1){
//                            这里再初始化函数
                    global.initialized=1;

//                        生产代理函数
                    var $super=undefined;
                    var path=global.package.join('.')+'::'+global.name;
                    var fn=(new Function('var $={"package:'+path+'":function(){}};return $["package:'+path+'"];'))();
                    if(global.extends instanceof Function){
                        $initializer(global.extends.__GLOBAL__,true);
                        fn.prototype=global.extends.__GLOBAL__.creator.prototype;
                        fn.prototype.constructor=fn;
                        $super=global.extends.__GLOBAL__.constructor;
                    }else fn.prototype=$jsFlex; // 所有对象继承至jsFlex

                    global.creator.prototype=new fn();
                    global.creator.prototype.constructor=global.creator;

                    global.constructor=$handler(global.initializer,$super,global.factory);
                    global.constructor.super=$super;

                    global.proxy={};
                    if(global.property)Object.keys(global.property).forEach(function (k) {
                        global.proxy[k]=$proxy(global,k,$super);
                    });
                    Object.defineProperties(global.creator.prototype,global.proxy);

                    if(global.extends instanceof Function){
                        Object.keys(global.extends.__GLOBAL__.proxy).forEach(function (k) {
                            if(global.proxy.hasOwnProperty(k)===false)global.proxy[k]=global.extends.__GLOBAL__.proxy[k];
                        });
                    };
                    Object.defineProperties(global.constructor,global.proxy);

//                            修正intanceof的作用，因为instance是由嵌套在factory中的create产生。
                    global.factory.prototype=global.creator.prototype;
                };
//                    减小开销
                if(silence!==true){
                    $counter+=1;
                    var _=new global.creator();
                    _.__NUM__=$counter;
                    return _;
                };
            };

            var $proxy=function (global,key,$super) {
                var des=Object.getOwnPropertyDescriptor(global.property,key);
                $keys.forEach(function (k) {
                    if(des[k] instanceof Function)des[k]=$handler(des[k],$super,global.factory);
                });
                return des;
            };

            var $handler=function (fn,su,se) {
                var $=function () {
                    //一定要这么写
                    var isi= this!==undefined&&this['jsFlex']===true;
                    try{
                        if(isi===true){
                            var _this=$dock['$this'];$dock['$this']=this;
                        };
                        var _super=$dock['$super'];$dock['$super']=su;
                        var _self=$dock['$self'];$dock['$self']=se;

                        return fn.apply($dock['$this'],arguments);
                    }finally {
                        $dock['$super']=_super;
                        $dock['$self']=_self;

                        if(isi===true)$dock['$this']=_this;
                    };

                };
                $.toString=function () {
                    return fn.toString();
                };
                return $;
            };

            var $keys=['get','set','value'];

            var _global=function (path) {
                this.package=path;
            };
            _global.prototype={
                initializer:function () {},
                factory:undefined,
                creator:undefined,
                initialized:-1,
            };

            return function (path) {
                var $global=new _global(path?path.constructor===String?$path(path):path:[Singleton.LOCAL]);
                $global.factory=function () {
//                        强制使用new进行实例化
                    if(this===undefined || this === $dock){//IE兼容性
                        if($global.initialized===-1){
                            Array.prototype.forEach.call(arguments,function ($) {
                                if($.constructor===Function)$global.initializer=$;
                                else if($.constructor===Object)$global.property=$;
                            });
                            $global.initialized=0;
                        };
                        return $global.factory;
                    }else{
                        var $=$initializer($global);
                        $global.constructor.apply($,arguments)
                        return $;
                    };
                };
                $global.factory.__GLOBAL__=$global;
                $global.factory.toString=function () {
                    return '[class]';
                };

                {
                    $global.factory.class=function (name) {
                        name=$global.name=name.trim();
                        $global.path=$global.package.concat(name);

                        var space=$space($global.path);
                        if(!space[1]){
                            $global.creator=(new Function('var $={"[class '+name+']":function(){}};return $["[class '+name+']"];'))();
                            $global.creator.__JSFLEX__=$jsFlex;

                            $global.name=name;
                            $global.factory.__GLOBAL__=$global.creator.__GLOBAL__=$global;
                            space[0][name]=$global.factory;
                            $global.factory.toString=new Function('return "class ['+$global.package.join('.')+'::'+name+']";');
                        }else{
//                                尚未初始化时，复制属性
                            if(space[1].__GLOBAL__.initialized===-1){
                                Object.keys($global).forEach(function (k) {
                                    if(this[k]===undefined && $global[k]!==undefined)this[k]=$global[k];
                                },space[1].__GLOBAL__);
                            };
//                                    从新引用
                            $global.factory.__GLOBAL__=$global=space[1].__GLOBAL__;
                        };

                        ['$'+name,name].forEach(function($){
                            if($dock[$]===undefined) $dock[$]=$global.factory;
                        });

                        return $global.factory;
                    };
                    $global.factory.extends=function (path) {
                        $global.extends=$import(path);
                        return $global.factory;
                    };
                    $global.factory.import=function () {
                        return $global.factory;
                    };
                    $global.factory.static=function () {
                        Array.prototype.forEach.call(arguments,function ($) {
//                            记录
                            if($ && $.constructor===Object){
                                Object.keys($).forEach(function (k) {
                                    Object.defineProperty($global.factory,k,Object.getOwnPropertyDescriptor($,k));
                                },$global.static);
                            };
                        });
                        return $global.factory;
                    };

                };

                return $global.factory;
            };
        })();

        $callLater($main);
    })();

    (function () {
        var $=(function ($) {
            var _;
            _=$.host.split('.');
            if(_.length===3&&_[0]!=='www') _=[];
            else _=$.pathname.split('/').slice(1,2);
            _.unshift($.host);
            return('//'+_.join('/')+'/jsFlex/');
        })(location);

        $import.file.url='//'+location.host+'/vsystem.server.20160816/plugins/jsFlex.sdk/';

        $import.router=function (file,path) {
            return ((
                'mx|flash|antetype|html|spark'.indexOf(path[0])!==-1
                ||(path[0]==='vsystem' && path[1]==='core')
            )?file.url:$)+path.join('.')+'.'+file.extend;
        };
    })();
})(window||global);