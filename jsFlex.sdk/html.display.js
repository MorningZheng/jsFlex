/**
 * Created by morning on 2017/6/15.
 */
(function () {
    var PATH='html.display';
    var $UIDUtil=$import('mx.utils.UIDUtil');
    var $Event=$import('flash.events.Event');


    var $globle={
        elements:{},
        includeIn:{},
    };


    $package(PATH)
        .class('FlexSprite')
        .extends('mx.core.UIComponent')
        .static(
            {
                create:function (tagName) {
                    return document.createElement(tagName);
                }
            }
        )(
            function (element) {
                $super();
                this.attributes={class:[]};
                if(element instanceof HTMLElement)this.htmlElementInstance=element;
                // var a=this.attributes.class;

                var _=this.constructor.__GLOBAL__;
                //兼容性写法
                if(_){
                    this.attributes['jsflex-component']=(_.path instanceof Array)?_.package.join('.')+'::'+_.name:_.path+'::'+_.name;
                    this.attributes.class.push(_.name);
                    _=null;
                };
            },
            {
                _htmlElementInstance:null,
                set htmlElementInstance(element){
                    if(element!==this._htmlElementInstance){
                        this._htmlElementInstance=element;
                        if(element.hasAttribute('uid')===false)element.setAttribute('mx_uid',$UIDUtil.createUID());
                        if(element.flexElementInstance!==this)element.flexElementInstance=this;
                    };
                },
                get UID(){
                    return this.htmlElementInstance?this.htmlElementInstance.getAttribute('mx_uid'):null;
                },
                get htmlElementInstance(){
                    return this._htmlElementInstance;
                },

                set id(newVal){
                    if(newVal) this.attributes.id=newVal;
                    else delete this.attributes.id;
                },
                get id(){
                    return this.attributes.id
                },

                _childrenChanged:true,
                _children:null,
                get children(){
                    return Array.prototype.map.call(this.htmlChildren,function (_) {
                            return _.flexElementInstance;
                        }).concat($this.mxmlChildren);
                },

                addElementAt:function (element,index) {
                    if($this._childrenChanged===false)$this._childrenChanged=true;

                    var _=(element instanceof html.display.FlexSprite)?element.htmlElementInstance:element;
                    this._children=null;
                    if(this.initialized===true){

                        index=index<0?-1:index<this.numElements?index:-1;
                        if(index===-1){
                            index=this.numElements;
                            this.htmlElementInstance.appendChild(_);
                        }else{
                            this.htmlElementInstance.insertBefore(_,this.htmlChildren[index]);
                        };

                        if(element instanceof html.display.FlexSprite)element.elementAdded(this,index);
                        // console.log(this)
                        return $super.addElementAt(element,index);
                    }else{
                        if(this.mxmlChildren.length){
                            index=index>-1&&index<this.mxmlChildren.length?index:this.mxmlChildren.length;
                            this.mxmlChildren.splice(index,0,element);
                        }else{
                            this.mxmlChildren.push(element);
                        };
                        return element;
                    };
                },

                getElementAt:function (index) {
                    if(this.initialized===true){
                        var _=this.htmlChildren[index];

                        return _===undefined?null:(_.hasOwnProperty('flexElementInstance')?_.flexElementInstance:_);
                    }else{
                        return this.mxmlChildren[index];
                    };
                },
                getElementIndex:function (element) {
                    var _=0;
                    if(element instanceof html.display.FlexSprite){
                        for(;_<this.numElements;_++){
                            if(this.children[_].flexElementInstance===element)return _;
                        };
                    }else{
                        for(;_<this.numElements;_++){
                            if(this.htmlChildren[_]===element)return _;
                        };
                    };
                    return -1;
                },

                removeElement:function (element) {
                    if($this._childrenChanged===false)$this._childrenChanged=true;

                    var _=element instanceof html.display.FlexSprite?element.htmlElementInstance:element;
                    if(_.id!==undefined){
                        delete this[_.id];
                        if(this.owner)this.owner[_.id]=this[_.id];
                    };
                    this.htmlElementInstance.removeChild(_);
                    this._children=null;
                    return $super.removeElement(element);
                },

                get numElements(){
                    return this.htmlChildren===null?0:this.htmlChildren.length;
                },
                get htmlChildren(){
                    return this.htmlElementInstance?this.htmlElementInstance.children:[];
                },
                _attributes:undefined,
                get attributes(){
                    if(this._attributes===undefined)this._attributes={};
                    return this._attributes;
                },
                set attributes(nv){
                    if(nv!==this._attributes)this._attributes=nv;
                },
                get class(){
                    return this.attributes.class;
                },
                set class(newVal){
                    this.attributes.class=newVal;
                },
                // get style(){
                //     return this.htmlElementInstance?this.htmlElementInstance.style:undefined;
                // },

                commitProperties:function () {
                    if(this.initialized===false){
                        this.initialized=true;
                        $this._childrenChanged=true;
                        if(this.mxmlChildren instanceof Array){
                            this.mxmlChildren.forEach(function (_) {
                                if(_.parent!==this)_.parent=this;
                                if(_.initialized===false){
                                    _.commitProperties();
                                };
                                this.addElementAt(_,-1);
                            },this);
                            this.mxmlChildren.length=0;
                        };

                        if(this.attributes){
                            var e=this.htmlElementInstance,a=this.attributes;
                            Object.keys(this.attributes).forEach(function (k) {
                                if(a[k]){
                                    var _=(a[k] instanceof Array)?a[k].join(' '):a[k].trim();
                                    if(_!==e.getAttribute(k)) e.setAttribute(k,_);
                                };
                            });
                            e=a=null;
                        };

                        $super.commitProperties();
                    // }else{
                    //    不知道有没有用
                        // $this.children.forEach(function (_) {
                        //     if(_.hasOwnProperty('commitProperties')){
                        //         _.commitProperties();
                        //     };
                        // });
                    };

                },
                _isShow:true,
                get isShow(){
                    return this._isShow;
                },
                set isShow(newValue){
                    if(newValue!==this._isShow){
                        this._isShow=newValue;
                        this.attributes.class=this.attributes.class.filter(function (v) {
                            return v!==(newValue===true?'HideThis':'ActiveThis');
                        });
                        this.attributes.class.push(newValue===false?'HideThis':'ActiveThis');
                        if(this.initialized===true)this.commitProperties();
                    }
                },
                // _includeInLayout:true,
                get includeInLayout(){
                    return this.htmlElementInstance.style.display===''?true:false;
                },
                set includeInLayout(newVal){
                    newVal=newVal===true?'':'none';
                    if(this.htmlElementInstance.style.display!==newVal)this.htmlElementInstance.style.display=newVal;
                },
                // _visible:true,
                get visible(){
                    return this.htmlElementInstance.style.visibility==='visible'?true:false;
                },
                set visible(newVal){
                    newVal=newVal===true?'visible':'hidden';
                    if(this.htmlElementInstance.style.visibility!==newVal)this.htmlElementInstance.style.visibility=newVal;
                },

                _includeIn:null,
                get includeIn(){
                    return this._includeIn;
                },
                set includeIn(value){
                    if(this._includeIn!==value){
                        var _=$globle.includeIn;
                        //清理缓存
                        if(this._includeIn){
                            if(_.hasOwnProperty(this.includeIn)&&_[this.includeIn].hasOwnProperty(this.UID))delete _[value][this.UID];
                        };

                        this._includeIn=value;
                        //使用UID的原因是，避免内存没法回收
                        if(value){
                            if(_.hasOwnProperty(value)===false)_[value]={};
                            if(_[value].hasOwnProperty(this.UID)===false)_[value][this.UID]=true;
                        };
                        _=null;
                    };
                },

                get systemManager(){
                    return $globle;
                },

                dispatchEvent:function (event) {
                    // $super.dispatchEvent(event);
                    event._target=event._currentTarget=this.htmlElementInstance;//兼容性调整，保证每个浏览器底下均一致
                    if(this.htmlElementInstance)this.htmlElementInstance.dispatchEvent(event instanceof $Event?event.__HTML_EVENT__:event);
                    return true;
                },
                addEventListener:function (type, listener, useCapture, priority, useWeakReference) {
                    // $super.addEventListener(type, listener, useCapture, priority, useWeakReference);
                    this.htmlElementInstance.addEventListener(type,listener,useCapture);

                },
                removeEventListener:function (type, listener, useCapture) {
                    // $super.removeEventListener(type, listener, useCapture);
                    this.htmlElementInstance.removeEventListener(type,listener);
                },
                setFocus:function () {
                    if(this.htmlElementInstance)this.htmlElementInstance.focus();
                },

            }
        );
})();