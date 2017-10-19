/**
 * Created by zc on 2017/10/8.
 */
(function () {

    $package('mx.collections')
        .class('Grouping')(
            function () {
                this.fields=[];
                this.label='GroupLabel';
            },
            {
                compareFunction:null,
                defaultCompareFunction:function (a,b,fields) {
                    var r=0;
                    fields.some(function (f) {
                        if(f.sortCompareFunction instanceof Function)r=f.sortCompareFunction(a,b);
                        else{
                            var fn=f.labelFunction||f.defaultLabelFunction;
                            r=fn(a,f)-fn(b,f);
                        };

                        r*=f.sortDescending?-1:1;
                        return r!==0;
                    });
                    return r;
                },
                fields:null,
                groupingObjectFunction:null,
                defaultGroupingObjectFunction:function (label) {return {};},
                _label:undefined,
                labels:undefined,
                set label(newVal){
                    if(this._label!==newVal){
                        this._label=newVal;
                        this.labels=[newVal];
                    };
                },
                get label(){
                    return this._label;
                },
            }
        );

    $package('mx.collections')
        .class('GroupingField')(
            function (name, caseInsensitive, descending, numeric) {
                $parameter('name="", caseInsensitive=false, descending=false, numeric=false',arguments,this,new Error());
                this.summaries=[];
            },
            {
                caseInsensitive:false,
                compareFunction:null,
                descending:false,
                groupingFunction:null,
                defaultGroupingFunction:function (item, field) {
                    return (function ($) {
                        return $===undefined?'undefined':$===null?'':$.toString();
                    })(item[field.name]);
                },
                groupingObjectFunction:null,
                defaultGroupingObjectFunction:function (label) {
                    var o={};
                    o[this.name]=label;
                    return o;
                },
                name:undefined,
                numeric:false,
                summaries:undefined,
            }
        );

    $package('mx.collections')
        .class('SummaryRow')(
            function () {
                this.fields=[];
            },
            {
                fields:null,
                summaryObjectFunction:null,
                summaryPlacement:'group',
            }
        );

    $package('mx.collections')
        .class('SummaryField2')(
            function (dataField, summaryOperation) {
                $parameter('dataField = null, summaryOperation = "SUM"',arguments,this,new Error());
            },
            {
                dataField:null,
                valueFunction:undefined,
                defaultValueFunction:function (item,field) {
                    return item[field.dataField];
                },
                _label:undefined,
                get label(){
                    return this._label===undefined?this.dataField:this._label;
                },
                set label(newVal){
                    if(newVal!==this._label)this._label=newVal;
                },
                _summaryOperation:undefined,
                get summaryOperation(){
                    return this._summaryOperation;
                },
                set summaryOperation(newVal){
                    if(newVal.constructor===String)newVal=newVal.toUpperCase();
                    if(newVal!==this._summaryOperation)this._summaryOperation=newVal;
                },
            }
        );

    $package('mx.collections')
        .class('DefaultSummaryCalculator')(
            {
                summaryCalculationBegin:function (field) {
                    var dataField = field.dataField;
                    var newObj = {};
                    switch (field.summaryOperation)
                    {
                        case "SUM": newObj[dataField] = 0;
                            break;
                        case "MIN": newObj[dataField] = Number.MAX_VALUE;
                            break;
                        case "MAX": newObj[dataField] = -Number.MAX_VALUE;
                            break;
                        case "COUNT": newObj[dataField] = [];
                            newObj[dataField + "Counter"] = 0;
                            break;
                        case "AVG": newObj[dataField] = 0;
                            newObj[dataField + "Count"] = 0;
                            break;
                    }
                    return newObj;
                },
                calculateSummary:function (data, field, rowData) {

                    var dataField = field.dataField;
//                            var value = rowData[dataField];
                    var value = (field.valueFunction||field.defaultValueFunction)(rowData,field);
                    if (typeof(value) == "xml")
                        value = Number(value.toString());

                    switch (field.summaryOperation)
                    {
                        case "SUM":
                            if (!data.hasOwnProperty(dataField)) data[dataField] = value ;
                            else data[dataField] += value;
                            break;
                        case "MIN":
                            if (!data.hasOwnProperty(dataField)) data[dataField] = value;
                            else data[dataField] =  data[dataField] < value ? data[dataField] : value;
                            break;
                        case "MAX":
                            if (!data.hasOwnProperty(dataField)) data[dataField] = value;
                            else data[dataField] =  data[dataField] > value ? data[dataField] : value;
                            break;
                        case "COUNT":
                            if (!data.hasOwnProperty(dataField)) {
                                data[dataField] = [rowData[dataField]];
                                data[dataField + "Counter"] = 1;
                            } else {
                                data[dataField].push(rowData[dataField]);
                                data[dataField + "Counter"] = data[dataField + "Counter"] + 1;
                            };
                            break;
                        case "AVG":
                            if (!data.hasOwnProperty(dataField)) {
                                data[dataField] = value;
                                data[dataField + "Count"] = 1;
                            } else {
                                data[dataField] += value;
                                data[dataField + "Count"] = data[dataField + "Count"] + 1;
                            };
                            break;
                    }
                },
                returnSummary:function (data, field) {
                    var summary = 0;
                    var dataField = field.dataField;
                    switch (field.summaryOperation)
                    {
                        case "SUM":
                        case "MIN":
                        case "MAX": summary = data[dataField];
                            break;
                        case "COUNT": 	summary = data[dataField + "Counter"];
                            break;
                        case "AVG": summary = data[dataField]/data[dataField + "Count"];
                            break;
                    }

                    return summary;
                },

                summaryOfSummaryCalculationBegin:function(value, field){
                    var newObj = {};
                    for (var p in value){
                        newObj[p] = value[p];
                    }
                    return newObj;
                },
                calculateSummaryOfSummary:function(oldValue, newValue, field){
                    var p;
                    switch (field.summaryOperation) {
                        case "AVG":
                        case "SUM": for (p in newValue) {
                            oldValue[p] += newValue[p];
                        }
                            break;
                        case "MIN": for (p in newValue) {
                            oldValue[p] = oldValue[p] < newValue[p] ? oldValue[p] : newValue[p];
                        }
                            break;
                        case "MAX": for (p in newValue) {
                            oldValue[p] = oldValue[p] > newValue[p] ? oldValue[p] : newValue[p];
                        }
                            break;
                        case "COUNT": 	for (p in newValue) {
                            if (oldValue[p] instanceof Array)
                            oldValue[p] = oldValue[p].concat(newValue[p]);
                        else
                            oldValue[p] += newValue[p];
                        }
                            break;
                    }
                },

                returnSummaryOfSummary:function(oldValue, field){
                    var summary = 0;
                    var dataField = field.dataField;
                    switch (field.summaryOperation)
                    {
                        case "SUM":
                        case "MIN":
                        case "MAX": summary = oldValue[dataField];
                            break;
                        case "COUNT":   summary = oldValue[dataField + "Counter"];
                            break;
                        case "AVG": summary = oldValue[dataField]/oldValue[dataField + "Count"];
                            break;
                    }

                    return summary;
                },
            }
        );

    $package('mx.collections')
        .import(
            Grouping=$import('mx.collections.Grouping'),
            UIDUtil=$import('mx.utils.UIDUtil')
        )
        .class('GroupingCollection')(
            function () {

            },
            {
                childrenField:'children',
                /*指定应用于源数据的 Grouping 实例。*/
                _grouping:null,
                get grouping(){
                    if((this._grouping instanceof Grouping)===false)this._grouping=new Grouping();
                    return this._grouping;
                },
                set grouping(nv){
                    if(nv!==this._grouping){
                        this._grouping=nv;
                        this.refresh(false,true);
                    };
                },
                /*[覆盖] 包含要分组的平面数据的源集合。*/
                _source:null,
//                        缓冲
                _cache:undefined,
                get source(){
                    return this._cache===undefined?this._source:this._cache;
                },
                set source(newVal){
                    if(this._source!==newVal){
                        this._source=newVal;
                        this.refresh(false,true);
                    };
                },
                get length(){
                    if(this.source)return this.source.length;
                    else return -1;
                },
                /*定义任意根级别数据摘要的 SummaryRow 实例数组。*/
                _summaries:null,
                get summaries(){
                    if((this.grouping instanceof Grouping)===false)this.grouping=new Grouping();
                    return this._summaries;
                },
                set summaries(nv){
                    if(nv!==this.summaries){
                        this._summaries=nv;
                        this.refresh(false,true);
                    };
                },
                /*如果异步执行刷新，请取消刷新操作并停止构建组。*/
                cancelRefresh:function () {

                },
                /*[覆盖] 如果已设置分组属性，则返回 super.source；如果未设置，则返回引用 super.source 的 ICollectionView 实例。*/
                getRoot:function () {
                    return this._cache===undefined?this._source:$this._dic[''];
                },
                /*对该集合应用分组。*/
                refresh:function (async, dispatchCollectionEvents) {
                    $parameter('async = false, dispatchCollectionEvents = false',arguments,this,new Error());
                    async=arguments[0];
                    dispatchCollectionEvents=arguments[1];

                    if(this.grouping instanceof Grouping && this.source) this.buildGroups(this.source);



                    return true;
                },
                buildGroups:function (source) {
                    this._cache=undefined;
//                            this._itemExpanded={};
                    this._dic={};

                    var l=[];
                    var summary=this.grouping.fields.map(function (gf,k) {
                        gf.index=k;
                        l.push([]);
                        return [
                            gf,
                            gf.summaries.map(function (sr,k){
                                sr.index=k;
                                return [
                                    sr,
                                    sr.fields.map(function (sf,k){
                                        sf.index=k;
                                        return [sf,new (sf.summaryOperation.constructor===String?mx.collections.DefaultSummaryCalculator:sf.summaryOperation)()];
                                    })
                                ];
                            })
                        ];
                    });

                    var m={r:null,d:{},c:[],};
                    var o;
                    $this.each(source,function (v) {
                        o=m;
                        summary.forEach(function (gf,k) {
                            var _name=(gf[0].groupingFunction||gf[0].defaultGroupingFunction)(v,gf[0]);
                            if(o.d.hasOwnProperty(_name)===false){
                                //begin
                                o=o.d[_name]={
                                    n:_name,
                                    p:o.r,//parent
                                    d:{},//dictionary
                                    c:[],//children
                                    a:o.c,//array
                                    g:gf[0],
                                    r:$this.uid((gf[0].groupingObjectFunction||gf[0].defaultGroupingObjectFunction).call(gf[0],_name),o,k),
                                    w:$this.summary2worker(gf[1]),
                                };
                                l[k].push(o);

//                                        复制字段内容
                                $this.grouping.labels.forEach(function (n) {
                                    o.r[n]=_name;
                                },this);
                            }else o=o.d[_name];

//                                    允许每个层级都做不同的计算
//                            summary
                            o.w.forEach(function (sf) {
                                sf[1].calculateSummary(sf[2],sf[0],v);
                            });
                        });
                        o.c.push($this.uid.call($this,v,o,summary.length));
                    });

                    l.forEach(function (_) {
                        _.forEach(function (_) {
                            //begin
                            _.w.forEach(function (sf) {
                                //summary
                                _.r[sf[0].label]=sf[1].returnSummary(sf[2],sf[0]);
                            });

                            // return
                            //延迟排序
                            _.r[this.childrenField]=_.c;
                            _.a.push(_.r);
                            this.clean(_);
                        },this);
                    },this);
                    l.length=0;

//                            执行排序
//                     this._cache=$this.doCompare(m.c);
                    $this._dic['']={};
                    $this._dic[''][this.childrenField]=(this._cache=m.c);
                    this.clean(m);

                    return true;
                },
                _dic:undefined,
                uid:function (obj,$,d) {
                    obj.mx_uid=UIDUtil.createUID();
                    this._dic[obj.mx_uid]={
                        data:obj,
                        parent:$.r,
                        deep:d,
                        expanded:false,
                    };
                    return obj;
                },
                each:function (d,fn) {
                    Object.keys(d).forEach(function (t) {
                        fn.call(this,d[t],t);
                    },this);
                },
                clean:function (_) {
                    Object.keys(_).forEach(function (t) {
                        delete _[t];
                    });
                },
                summary2worker:function (groupFields) {
                    var _=[];
                    groupFields.forEach(function (sr) {
                        sr[1].forEach(function (sf) {
                            _.push(sf.concat(sf[1].summaryCalculationBegin(sf[0])));
                        });
                    });
                    return _;
                },


                doCompare:function (array,fields) {
                    if(fields instanceof Array){
                        //V8的sort有问题，这里不使用

                        //预分组
                        var $={l:[],d:{}};
                        array.forEach(function (n) {
                            var d=$this.getDeep(n);
                            var p=$this.getParent(n);
                            var i=p===null?'':p.mx_uid;
                            if($.d.hasOwnProperty(i)===false){
                                if($.l[d]===undefined)$.l[d]=[];
                                $.l[d].push($.d[i]={i:i,c:[]});
                            };
                            $.d[i].c.push(n);
                        });

                        //分组排序
                        var o={};
                        array.length=0;
                        $.l.forEach(function (l) {
                            l.forEach(function (g) {
                                g.c.sort(function (a,b) {
                                    return ($this.grouping.compareFunction||$this.grouping.defaultCompareFunction)(a,b,fields);
                                }).forEach(function (v,k) {
                                    if(v.hasOwnProperty('mx_uid')===false)v.mx_uid=UIDUtil.createUID();
                                    o[v.mx_uid]={val:v,key:k};
                                });

                                if(g.i==='')array.push.apply(array,g.c);
                                else{
                                    g.c.splice(0,0,array.indexOf(o[g.i].val)+1,0);
                                    array.splice.apply(array,g.c);
                                };
                                delete g.c,g.i;
                            });
                        });
                        o=null;
                    };

                    return array;
                },

                hasExpand:function (node,value) {
                    if(arguments.length===1)return this._dic[node.mx_uid].expanded;
                    else this._dic[node.mx_uid].expanded=value;
                },

//                        应该放到grid里面，这里暂时放这里
//                        _itemExpanded:null,
                openNode:function (node) {
                    if($this.hasChildren(node)===true){

                        if($this.hasExpand(node)===false){
                            $this.hasExpand(node,true);

                            //合成列表
                            var $=$this.getOpenNodeView(node);
                            $.unshift($this._cache.indexOf(node)+1,0);
                            $this._cache.splice.apply($this._cache,$);

                            return true;
                        };
                    }else return false;
                },
//                        查找曾经打开的节点
                getOpenNodeView:function (node) {
                    var $=this.getChildren(node).concat();
                    var _=[];
                    if($ instanceof Array){
                        $.forEach(function ($) {
                            _.push($);
                            if($this.hasExpand($)===true){
                                // console.log($this.getOpenNodeView($));
                                _.push.apply(_,$this.getOpenNodeView($));
                            };
                        });
                    };
                    return _;
                },

                closeNode:function(node) {
                    if($this.hasExpand(node)===true){
                        var d=$this.getDeep(node);
                        var s=$this.source.indexOf(node)+1;
                        var t;
                        for(var i=s;i<$this.source.length;i++){
                            t=$this.source[i];
                            do{
                                t=$this.getParent(t);
                                // console.log(t,$this.getDeep(t),d);
                                if(!t)break;//root 退出
                            }while ($this.getDeep(t)>d);

                            if(t!==node)break;
                        };

                        $this.source.splice(s,i-s);
                        this.hasExpand(node,false);
                        return true;
                    }else return false;
                },
                /*返回节点的父项。顶级节点的父项为 null。*/
                getParent:function (node) {
                    if(!node)return node;
                    else if(this._dic===undefined) return undefined;
                    else return this._dic[node.mx_uid].parent;
                },
                hasChildren:function (node) {
                    var c=this.getChildren(node);
                    if(c instanceof Array){
                        return c.length!==0;
                    }else return false;
                },
                getChildren:function (node){
                    return  this.hasOwnProperty('childrenField')?undefined:node[this.childrenField];
                },
                getDeep:function(node){
                    if(!node)return -1;
                    else if(this._dic.hasOwnProperty(node.mx_uid)===true)return this._dic[node.mx_uid].deep;
                    else return -1;
                },
            }
        );
})();
