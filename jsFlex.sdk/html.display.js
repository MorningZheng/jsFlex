/**
 * Created by morning on 2017/6/15.
 */
$package('html.display')
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
            this.super();
            this.attributes={class:[]};
            if(element instanceof HTMLElement)this.htmlElementInstance=element;
            var a=this.attributes.class;
            var _=this.constructor;
            this.attributes['jsflex-component']=_.__GLOBAL__.path+'::'+_.__GLOBAL__.name;
            while(_!==html.display.FlexSprite){
                a.push(_.__GLOBAL__.name);
                _=_.__GLOBAL__.extends;
            };
        },
        {
            _htmlElementInstance:null,
            set htmlElementInstance(element){
                if(element!==this._htmlElementInstance){
                    this._htmlElementInstance=element;
                    if(element.flexElementInstance!==this)element.flexElementInstance=this;
                };
            },
            get htmlElementInstance(){
                return this._htmlElementInstance;
            },

            _children:null,
            get children(){
                if(this._children===null){
                    this._children=[];
                    Array.prototype.forEach.call(this.htmlChildren,function (_) {
                        this._children.push(_.flexElementInstance);
                    },this);
                };
                return this._children;
            },

            addElementAt:function (element,index) {
                var _=(element instanceof html.display.FlexSprite)?element.htmlElementInstance:element;

                if(this.initialized===true){
                    index=index>-1&&index<this.numElements?index:this.numElements-1;
                    this.htmlElementInstance.insertBefore(_,this.htmlChildren[index]);
                    if(element instanceof html.display.FlexSprite)element.elementAdded(this,index);
                }else{
                    index=index>-1&&index<this.mxmlChildren.length?index:this.mxmlChildren.length-1;
                    this.mxmlChildren.splice(index,0,element);
                };

                if(_.id && element.id!==_.id)element.id=_.id;

                this._children=null;
                return this.super.addElementAt(element,index);
            },

            getElementAt:function (index) {
                var _=this.htmlChildren[index];
                return _===undefined?null:(_.hasOwnProperty('flexElementInstance')?_.flexElementInstance:_);
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
                var _=element instanceof html.display.FlexSprite?element.htmlElementInstance:element;
                if(_.id!==undefined){
                    delete this[_.id];
                    if(this.owner)this.owner[_.id]=this[_.id];
                };
                this.htmlElementInstance.removeChild(_);
                this._children=null;
                return this.super.removeElement(element);
            },

            get numElements(){
                return this.htmlChildren===null?0:this.htmlChildren.length;
            },
            get htmlChildren(){
                return this.htmlElementInstance.children;
            },
            attributes:null,
            get class(){
                return this.attributes.class;
            },
            set class(newVal){
                this.attributes.class=newVal;
            },

            commitProperties:function () {
                if(this._initialized===false)this._initialized=true;
                if(this.mxmlChildren instanceof Array){
                    this.mxmlChildren.forEach(function (_) {
                        if(_.initialized===false)_.commitProperties();
                        this.addElementAt(_,-1);
                    },this);
                };
                this.mxmlChildren.length=0;
                var e=this.htmlElementInstance;
                var a=this.attributes;
                Object.keys(this.attributes).forEach(function (k) {
                    var _=(a[k] instanceof Array)?a[k].join(' '):a[k].trim();
                    if(_) e.setAttribute(k,_);
                });
                e=a=null;

                this.super.commitProperties();
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

        }
    );