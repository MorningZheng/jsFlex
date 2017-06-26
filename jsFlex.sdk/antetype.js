/**
 * Created by morning on 2017/6/15.
 */
(function ($dock) {

    ['$page','$view'].forEach(function (_) {
        var $=document.createElement('link');
        $.setAttribute('href',$main.path.url+_+'.css');
        $.setAttribute('rel','stylesheet');
        $.setAttribute('type','text/css');
        document.head.appendChild($);
        $=null;
    });

    var PATH='antetype';

    var $c=function ($tagName) {
        $tagName=$tagName.toLowerCase();
        var _=document.createElement($tagName);
        if($tagName==='button'||$tagName==='label')_.setAttribute('htmlElement','true');
        return _;
    };

    $package(PATH)
        .class('Group')
        .extends('html.display.FlexSprite')
        (
            function () {
                this.super();
                this.htmlElementInstance=$c('div');
            }
        );
    var $P=$dock[PATH];

    $package(PATH)
        .class('Line')
        .extends('html.display.FlexSprite')
        (
            function () {
                this.super();
                this.htmlElementInstance=$c('div');
            }
        );

    $package(PATH)
        .class('Space')
        .extends('html.display.FlexSprite')
        (
            function () {
                this.super();
                this.htmlElementInstance=$c('div');
            }
        );


    $package(PATH)
        .class('Label')
        .extends('html.display.FlexSprite')
        (
            function () {
                this.super();
                this.htmlElementInstance=$c('span');
            },
            {
                get text(){
                    return this.htmlElementInstance.innerText;
                },
                set text(newVal){
                    if(this.htmlElementInstance.innerText!==newVal){
                        this.htmlElementInstance.innerText=newVal;
                    }
                }
            }
        );

    $package(PATH)
        .class('Application')
        .extends($P.Group)
        (
            function ($title) {
                this.super();
                this.attributes.namespace='['+location.host+location.pathname+']';
                if($title!==undefined) this.title=$title;
                // this.owner=this.document=this;
            },{
                get title(){
                    return this._title;
                },
                set title($newValue){
                    if($newValue !== this._title){
                        this._title=$newValue;
                        if(document.title!==this._title){
                            document.title=this._title;
                        };
                    };
                },
                get owner(){
                    return this;
                },
                get document(){
                    return this;
                },
            }
        );

    $package(PATH)
        .class('Button')
        .extends('html.display.FlexSprite')
        (
            function (newLabel) {
                this.super();
                this.htmlElementInstance=$c('Button');
                if(newLabel!==undefined)this.label=newLabel;
            },{
                _label:'',
                get label(){
                    return this._label;
                },
                set label(newValue){
                    if(this._label!==newValue){
                        this._label=newValue;
                        this.htmlElementInstance.innerText = newValue;
                    };
                }
            }
        );

    $package(PATH)
        .import(
            PropertyChangeEvent=$import('flash.events.PropertyChangeEvent'),
            PropertyChangeEventKind=$import('flash.events.PropertyChangeEventKind')
        )
        .class('TextInput')
        .extends('html.display.FlexSprite')(
            function () {
                this.super();
                this.htmlElementInstance=$c('input');
                this.addEventListener('input',this.onInputHandler.bind(this));
            },
            {
                _text:null,
                get text(){
                    return this._text;
                },
                set text(newVal){
                    if(newVal!==this.htmlElementInstance.value){
                        var e=new PropertyChangeEvent(
                            PropertyChangeEvent.PROPERTY_CHANGE,true,true,
                            PropertyChangeEventKind.UPDATE,'text',this._text,newVal,this
                        );
                        this._text=this.htmlElementInstance.value=newVal;
                        this.dispatchEvent(e);
                    };
                },
                get prompt(){
                    return this.htmlElementInstance.placeholder;
                },
                set prompt(newVal){
                    if(this.htmlElementInstance.placeholder !== newVal)this.htmlElementInstance.placeholder=newVal;
                },
                onInputHandler:function(){
                    var e=new PropertyChangeEvent(
                        PropertyChangeEvent.PROPERTY_CHANGE,true,true,
                        PropertyChangeEventKind.UPDATE,'text',this._text,this.htmlElementInstance.value,this
                    );
                    this._text=this.htmlElementInstance.value;
                    this.dispatchEvent(e);
                },
                get checked(){
                    return this.htmlElementInstance.hasAttribute('checked');
                },
                set checked(newVal){
                    if(newVal!==this.checked){
                        newVal?this.htmlElementInstance.setAttribute('checked',''):this.htmlElementInstance.removeAttribute('checked');
                    };
                },
            }
        );

    $package(PATH)
        .class('LinkButton').extends($P.Button)(
            function (newLabel) {
                this.super(newLabel);
            }
        );

    [
        'HeaderNavigation','FooterNavigation',
        'HGroup','VGroup','TileGroup','FlowGroup'
    ].forEach(function (v) {
        $package(PATH)
            .class(v).extends($P.Group)
            (
                function () {
                    this.super();
                }
            );
    });

    $package(PATH)
        .class('ViewStack').extends($P.Group)(
            function () {
                this.super();
            },
            {
                _currentView:'',
                get currentView(){
                    return this._currentView;
                },
                set currentView(newVal){
                    if(this._currentView!==newVal){
                        this._currentView=newVal;
                        this.refresh();
                    }
                },
                refresh:function () {
                    this.children.forEach(function (_) {
                        _.isShow=_===this[this.currentView];
                    },this);
                },
            }
        );

    $package(PATH)
        .class('ViewContent').extends($P.Group)(
            function () {
                this.super();
            }
        );

    $package(PATH)
        .class('BorderContainer').extends($P.Group)(
            function () {
                this.super();
                //BorderContainer
            }
        );

    $package(PATH)
        .import(
            VGroup=$import(PATH+'.VGroup')
        )
        .class('FormContainer').extends($P.BorderContainer)(
            function () {
                this.super();
                [this.container=new VGroup()].forEach(function ($) {
                    this.super.addElement($);
                },this);
            },
            {
                container:null,
                addElementAt:function (element,index) {
                    return this.container.addElement(element);
                },
            }
        );

    $package(PATH)
        .import(
            VGroup=$import(PATH+'.VGroup')
        )
        .class('FormLine').extends($P.VGroup)(
            function () {
                this.super();
                [
                    this.labelDisplay=new Label(),
                    this.container=new VGroup(),
                    this.errorDisplay=new Label()
                ].forEach(function ($) {
                    this.super.addElement($);
                },this);
                this.errorDisplay.class.push('ErrorTip');
            },
            {
                container:null,
                labelDisplay:null,
                errorDisplay:null,
                get label(){
                    return this.labelDisplay.text;
                },
                set label(newVal){
                    this.labelDisplay.text=newVal;
                },
                addElement:function (element) {
                    return this.container.addElement(element);
                },
            }
        );


    $package(PATH)
        .class('TextContainer').extends($P.BorderContainer)(
            function () {
                this.super();
                [this.container=new VGroup()].forEach(function ($) {
                    this.super.addElement($);
                },this);
            },
            {
                container:null,
                addElement:function (element) {
                    return this.container.addElement(element);
                },
            }
        );

    $package(PATH)
        .class('PopUp').extends($P.Group)(
            function () {
                this.super();
                this.super.addElement(new BorderContainer());
                [
                    this.container=new Group(),
                    this.closeButton=new Group()
                ].forEach(function ($) {
                    this.mxmlChildren[0].addElement($);
                },this);
                this.container.class='ContentContainer';

                this.closeButton.class='Close';
                this.closeButton.addEventListener('click',this.close.bind(this));
            },
            {
                container:null,
                closeButton:null,
                addElement:function (element) {
                    return this.container.addElement(element);
                },
                close:function () {
                    if(this.isShow===true){
                        this.isShow=false;
                        this.dispatchEvent(new $Request('closed',true,true,false));
                    };
                },
                open:function () {
                    if(this.isShow===false){
                        this.isShow=true;
                        this.dispatchEvent(new $Request('opened',true,true,true));
                    };
                },
            }
        );

    $package(PATH)
        .import(
            PropertyChangeEvent=$import('flash.events.PropertyChangeEvent')
        )
        .class('HGroupCheck').extends($P.HGroup)(
            function () {
                this.super();
                this.uid=UIDUtil.createUID();

                var $=new FlexSprite(FlexSprite.create('span'));
                $.class.push('CheckBox');
                $.addEventListener('click',function (event) {
                    if(this.input.checked!=this._selected){
                        this.input.checked=this._selected;
                    };
                }.bind(this));

                var _=new FlexSprite(FlexSprite.create('label'));
                _.attributes.for='$'+this.uid;

                $.addElement(this.input=new $P.TextInput);
                this.input.attributes.type='checkbox';
                this.input.attributes.id=_.attributes.for;
                $.addElement(_);

                this.addElement($);
                this.addElement(this.labelDisplay=new $P.Label);
            },
            {
                uid:-1,
                labelDisplay:null,
                input:null,
                _selected:false,
                get label(){
                    return this.labelDisplay.text;
                },
                set label(newVal){
                    if(newVal !== this.labelDisplay.text)this.labelDisplay.text=newVal;
                },
                get selected(){
                    return this._selected;
                },
                set selected(newVal){
                    try{
                        newVal=JSON.parse(newVal);
                        newVal=Boolean(newVal);
                    }catch(e){};
                    if(this._selected!==newVal){
                        this._selected=newVal;
                        var e=new PropertyChangeEvent('selectedChange',false,this._selected,newVal);
                        if(this.input.checked!=this._selected)this.input.checked=this._selected;
                        this.dispatchEvent(e);
                    };
                },
                get owner(){
                    return this;
                },
            }
        );

    $package(PATH)
        .class('CheckBox').extends($P.HGroupCheck)(
            function () {
                this.super();
                this.class.shift();
            }
        )

    /**
     * $package定一个包路径
     */
    $package(
        PATH,//PATH是一个常量，等于“antetype”
        zc=$import('html.display.FlexSprite')//引入html.display.FlexSprite，并将它重命名为zc
    )
        .class('Declarations').extends(zc)

        (
            /**
             * 构造函数
             */
            function () {
                this.super();
                this.htmlElementInstance=zc.create('div');
                this.visible=false;
                this.includeInLayout=false;
            }
        )

    $package(PATH)
        .class('FormItem')
        .extends($P.VGroup)
        (
            function () {
                this.super();
                [
                    this.container=new $P.HGroup(),
                    this.labelDisplay=new $P.Label(),
                    this.errorDisplay=new $P.Label(),
                    this.lineDisplay=new $P.Line()
                ].forEach(function ($) {
                    this.super.addElement($);
                },this);
                this.container.class.push('FormItem');
                this.errorDisplay.class='ErrorTip';
                this.lineDisplay.attributes.style='display:none';
            },
            {
                container:null,
                labelDisplay:null,
                errorDisplay:null,
                lineDisplay:null,
                addElement:function (element) {
                    return this.container.addElement(element);
                },
                get showLine(){
                    return this.lineDisplay.isShow;
                },
                set showLine(newVal){
                    if(newVal!==this.lineDisplay.isShow){
                        this.lineDisplay.isShow=newVal;
                    };
                },
            }
        );

})(this);
