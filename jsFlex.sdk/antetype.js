/**
 * Created by morning on 2017/6/15.
 */
(function ($dock) {

    ['antetype'].forEach(function (_) {
        var $=document.createElement('link');
        $.setAttribute('href',$import.file.url+_+'.css');
        $.setAttribute('rel','stylesheet');
        $.setAttribute('type','text/css');
        document.head.appendChild($);
        $=null;
    });

    var PATH='antetype';

    var $class=function (name) {
        return $package(PATH).class(name);
    };

    var $PropertyChangeEvent=$import('flash.events.PropertyChangeEvent');
    var $PropertyChangeEventKind=$import('flash.events.PropertyChangeEventKind');
    var $Event=$import('flash.events.Event');
    var $IndexChangeEvent=$import('spark.events.IndexChangeEvent');
    var $FlexEvent=$import('flash.events.FlexEvent');

    var $c=function ($tagName) {
        $tagName=$tagName.toLowerCase();
        var _=document.createElement($tagName);
        if($tagName==='button'||$tagName==='label')_.setAttribute('htmlElement','true');
        return _;
    };

    var Globle=$package(PATH)
        .class('Globle')
        .static({
            topApplications:[],
            _topApplication:null,
            set topApplication(value){
                if(Globle._topApplication!==value){
                    Globle._topApplication=value;
                    Globle.topApplications.push(value);
                };
            },
            get topApplication(){
                return Globle._topApplication;
            }
        })();
    var $p=$dock[PATH];

    $package(PATH)
        .class('Group')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.htmlElementInstance=$c('div');
            }
        );


    $package(PATH)
        .class('Line')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.htmlElementInstance=$c('div');
            }
        );

    $package(PATH)
        .class('Image')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.htmlElementInstance=$c('img');
            }
        );

    $package(PATH)
        .class('Space')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.htmlElementInstance=$c('div');
            }
        );


    $package(PATH)
        .class('Label')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
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
        .extends($p.Group)
        (
            function ($title) {
                $super();
                this.attributes.namespace='['+location.host+location.pathname+']';
                if($title!==undefined) this.title=$title;
                Globle.topApplication=this;
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
                $super();
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
        .class('TextInput')
        .extends('html.display.FlexSprite')(
            function () {
                $super();
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
                        var e=new $PropertyChangeEvent(
                            $PropertyChangeEvent.PROPERTY_CHANGE,true,true,
                            $PropertyChangeEventKind.UPDATE,'text',this._text,newVal,this
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
                    var e=new $PropertyChangeEvent(
                        $PropertyChangeEvent.PROPERTY_CHANGE,true,true,
                        $PropertyChangeEventKind.UPDATE,'text',this._text,this.htmlElementInstance.value,this
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
                selectedAll:function () {
                    this.htmlElementInstance.select();
                },
            }
        );

    $package(PATH)
        .class('LinkButton').extends($p.Button)(
            function (newLabel) {
                $super(newLabel);
            }
        );

    [
        'HeaderNavigation','FooterNavigation',
        'HGroup','VGroup','TileGroup','FlowGroup'
    ].forEach(function (v) {
        $package(PATH)
            .class(v).extends($p.Group)
            (
                function () {
                    $super();
                }
            );
    });

    $package(PATH)
        .class('ViewStack')
        .extends($p.Group)(
            function () {
                $super();
                this.viewChangeHandler=this.viewChangeHandler.bind(this);
            },
            {
                _currentViewChange:false,
                _currentView:'',
                get currentView(){
                    return this._currentView;
                },
                set currentView(newVal){
                    if(this._currentView!==newVal){
                        this._currentView=newVal;
                        this._currentViewChange=true;
                        if(this.initialized)this.refresh();
                    }
                },
                refresh:function () {
                    if(this._currentViewChange===false)return;
                    this._currentViewChange=false;
                    Globle.topApplications.forEach(this.viewChangeHandler);

                    var e=null;
                    for(var n=0;n<this.numElements;n++){
                        e=this.getElementAt(n);
                    };
                    e=null;

                    for(var v in this.views){
                        this.views[v].isShow=v===this.currentView;
                    };
                },
                viewChangeHandler:function (a) {
                    var c=this.systemManager.includeIn;
                    for(var v in c){
                        for(var m in c[v]){
                            var e=a.htmlElementInstance.querySelector('[mx_uid="'+m+'"]');
                            if(e)e.flexElementInstance.visible=e.flexElementInstance.includeInLayout=(v===this.currentView);
                        };
                    };
                },
                commitProperties:function () {
                    $super.commitProperties();
                    this.refresh();
                },
                _views:null,
                get views(){
                    if(this._views===null)this._views={};
                    return this._views;
                },
            }
        );

    $package(PATH)
        .class('ViewContent')
        .extends($p.Group)(
            function () {
                $super();
                this.isShow=false;
            },
            {
                elementAdded: function (element, index) {
                    $super.elementAdded(element, index);
                    if('views' in element && element.views[this.id]!==this)element.views[this.id]=this;
                },
                elementRemoved: function (element, index) {
                    $super.elementAdded(element, index);
                    if('views' in element && element.views[this.id]!==this)delete element.views[this.id];
                },
            }
        );

    $package(PATH)
        .class('BorderContainer').extends($p.Group)(
            function () {
                $super();
                //BorderContainer
            }
        );

    $package(PATH)
        .import(
            VGroup=$import(PATH+'.VGroup')
        )
        .class('FormContainer').extends($p.BorderContainer)(
            function () {
                $super();
                [this.container=new VGroup()].forEach(function ($) {
                    $super.addElement($);
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
        .class('FormLine').extends($p.VGroup)(
            function () {
                $super();
                [
                    this.labelDisplay=new Label(),
                    this.container=new VGroup(),
                    this.errorDisplay=new Label()
                ].forEach(function ($) {
                    $super.addElement($);
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
        .class('TextContainer').extends($p.BorderContainer)(
            function () {
                $super();
                // [this.container=new VGroup()].forEach(function ($) {
                //     $super.addElement($);
                // },this);
            },
            {
                // container:null,
                // addElement:function (element) {
                //     return this.container.addElement(element);
                // },
            }
        );

    $package(PATH)
        .class('PopUp').extends($p.Group)(
            function () {
                $super();
                $super.addElement(new BorderContainer());
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
        .class('HGroupCheck').extends($p.HGroup)(
            function () {
                $super();
                this.uid=UIDUtil.createUID();
                this.class.push('CheckBox');

                var $=new FlexSprite(FlexSprite.create('span'));
                // $.class.push('CheckBox');
                $.addEventListener('click',function (event) {
                    //过滤2次监听
                    if(event.target===this.input.htmlElementInstance){
                        var $=!this._selected;
                        if(this.input.checked!==$)this.selected=$;
                    };
                }.bind(this));

                var _=new FlexSprite(FlexSprite.create('label'));
                _.attributes.for='$'+this.uid;

                $.addElement(this.input=new $p.TextInput);
                this.input.attributes.type='checkbox';
                this.input.attributes.id=_.attributes.for;
                $.addElement(_);

                this.addElement($);
                this.addElement(this.labelDisplay=new $p.Label);
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
                        var e=new $PropertyChangeEvent('selectedChange',false,true,'update','selected',this._selected,newVal,this);
                        this._selected=newVal;
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
        .class('CheckBox').extends($p.HGroupCheck)(
            function () {
                $super();
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
                $super();
                this.htmlElementInstance=zc.create('div');
                this.visible=false;
                this.includeInLayout=false;
            }
        )

    $package(PATH)
        .class('FormItem')
        .extends($p.VGroup)
        (
            function () {
                $super();
                [
                    this.labelDisplay=new $p.Label(),
                    this.container=new $p.HGroup(),
                    this.errorDisplay=new $p.Label(),
                    // this.lineDisplay=new $p.Line()
                ].forEach(function ($) {
                    $super.addElement($);
                },this);
                // this.container.class.push('FormItem');
                this.errorDisplay.class='ErrorTip';
                this.container.class.push('container');
                // this.lineDisplay.attributes.style='display:none';
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
                get label(){
                    return this.labelDisplay.text;
                },
                set label(value){
                    this.labelDisplay.text=value;
                },
            }
        );

    $package(PATH)
        .class('FormGroup')
        .extends($p.BorderContainer)(
            function () {
                $super();
            }
        );

    $package(PATH)
        .class('normalHeaderNavigation')
        .extends($p.HeaderNavigation)(
            function () {
                $super();
                var HG=new $p.HGroup();
                HG.mxmlChildren=[
                    new $p.Button(),
                    new $p.HGroup(),
                ];
                this._init_Button(HG.mxmlChildren[0]);
                this._init_HGroup(HG.mxmlChildren[1]);
                this.addElement(HG);
            },
            {
                clickHandler:function (event) {
                    window.history.back();
                },
                _init_Button:function ($) {
                    $.class.push('elementLeft');
                    $.addElement(new $p.Image);
                    $.mxmlChildren[0].attributes['src']='/vsystem.server.20160816/images/icons/012.png';

                    this.clickHandler=this.clickHandler.bind(this);
                    $.addEventListener('click',this.clickHandler);
                },
                _init_HGroup:function ($) {
                    $.class.push('elementRight');
                    var _=new $p.LinkButton;
                    _.label='主页';
                    _.addEventListener('click',function () {
                        if(window.hasOwnProperty('$router'))$router.url='mainmenu.html';
                        else console.log('no router in window');
                    });
                    $.addElement(_);
                },
            }
        );


    $package(PATH)
        .class('SkinnableDataContainer')
        .extends('html.display.FlexSprite')(
            function () {
                $super();
                this.htmlElementInstance=$c('div');
                this.dataGroupProperties={itemRenderer:$p.ItemRenderer};
            },{
                dataGroupProperties:null,
                dataGroup:null,
                get autoLayout(){
                    var v = this.dataGroupProperties.autoLayout;
                    return (v === undefined) ? true : v;
                },
                set autoLayout(value){
                    this.dataGroupProperties.autoLayout = value;
                },
                get dataProvider(){
                    return this.dataGroupProperties.dataProvider;
                },
                set dataProvider(value){
                    this.dataGroupProperties.dataProvider = value;
                    this.dispatchEvent(new $Event("dataProviderChanged"));
                },
                get itemRenderer(){
                    return this.dataGroupProperties.itemRenderer;
                },
                set itemRenderer(newVal){
                    if(this.dataGroupProperties.itemRenderer!==newVal)this.dataGroupProperties.itemRenderer=newVal;
                },
                get itemRendererFunction(){
                    return this.dataGroupProperties.itemRendererFunction;
                },
                set itemRendererFunction(newVal){
                    if(this.dataGroupProperties.itemRendererFunction!==newVal)this.dataGroupProperties.itemRendererFunction=newVal;
                },
                get layout(){
                    return this.dataGroupProperties.layout;
                },
                set layout(newVal){
                    if(this.dataGroupProperties.layout!==newVal)this.dataGroupProperties.layout=newVal;
                },
                get typicalItem(){
                    return this.dataGroupProperties.typicalItem;
                },
                set typicalItem(newVal){
                    if(this.dataGroupProperties.typicalItem!==newVal)this.dataGroupProperties.typicalItem=newVal;
                },
                itemToLabel:function (item) {
                    if (item !== null) return item.toString();
                    else return " ";
                },
                updateRenderer:function (renderer, itemIndex, data) {
                    renderer.owner = this;
                    // Set the index
                    if (renderer instanceof $p.ItemRenderer){
                        (renderer).itemIndex = itemIndex;
                        (renderer).label = this.itemToLabel(data);
                        (renderer).data = data;
                    };
                },
            }
        );

    $package(PATH)
        //用caretChange来监听手动绑定的this.selectedIndex=1;
        .class('ListBase')
        .extends($p.SkinnableDataContainer)
        .static({
            get NO_CARET(){return -1},
            get NO_SELECTION(){return -1},
            get NO_PROPOSED_SELECTION(){return -2},
            get CUSTOM_SELECTED_ITEM(){return -3},
            get TYPE_MAP(){return { rollOver: "itemRollOver", rollOut:  "itemRollOut" }},
        })
        (
            function () {
                $super();
                this._caretIndex=$self.NO_CARET;
                this._proposedSelectedIndex=$self.NO_PROPOSED_SELECTION;
                this._rendererCache=[];

                //与flex不一样
                this.addElementAt(this.dataGroup=new $p.Group(),0);
            },
            {
                inUpdateRenderer:false,
                dataProviderChanged:false,
                doingWholesaleChanges:false,
                caretItem:undefined,
                set dataProvider(value) {
                    this.dataProviderChanged = true;
                    this.doingWholesaleChanges = true;
                    $super.dataProvider = value;
                    this.invalidateProperties();
                },
                get dataProvider(){
                    return $super.dataProvider;
                },
                get dataProviderLength(){
                    return this.dataProvider instanceof Array?this.dataProvider.length:0;
                },
                get caretIndex () {
                    return this._caretIndex;
                },
                _labelField:'label',
                labelFieldOrFunctionChanged:false,
                get labelField() {
                    return this._labelField;
                },
                set labelField(value){
                    if (value != this._labelField){
                        this._labelField = value;
                        this.labelFieldOrFunctionChanged = true;
                        this.invalidateProperties();
                    };
                },
                _labelFunction:undefined,
                get labelFunction() {
                    return this._labelFunction;
                },
                set labelFunction(value){
                    if (value != this._labelFunction){
                        this._labelFunction = value;
                        this.labelFieldOrFunctionChanged = true;
                        this.invalidateProperties();
                    };
                },
                _proposedSelectedIndex:-1,
                _selectedIndex:-1,
                dispatchChangeAfterSelection:false,
                changeCaretOnSelection:true,
                get selectedIndex() {
                    if (this._proposedSelectedIndex != $self.NO_PROPOSED_SELECTION) return this._proposedSelectedIndex;
                    return this._selectedIndex;
                },
                set selectedIndex(value) {
                    this.setSelectedIndex(value, false);
                    // this.setSelectedIndex(value, true);
                },
                setSelectedIndex:function (value, dispatchChangeEvent, changeCaret) {
                    if (value == this.selectedIndex) {
                        // this should short-circuit, but we should check to make sure
                        // that caret doesn't need to be changed either, as that's a side
                        // effect of setting selectedIndex
                        if (changeCaret) this.setCurrentCaretIndex(this.selectedIndex);
                        return;
                    };
                    if (dispatchChangeEvent) this.dispatchChangeAfterSelection = (this.dispatchChangeAfterSelection || dispatchChangeEvent);
                    this.changeCaretOnSelection = changeCaret||true;
                    this._proposedSelectedIndex = value;
                    this.invalidateProperties();
                },
                _selectedItem:undefined,
                _pendingSelectedItem:undefined,
                get selectedItem(){
                    if (this._pendingSelectedItem !== undefined) return this._pendingSelectedItem;
                    if (this.selectedIndex == $self.NO_SELECTION || this.dataProvider == null) return undefined;
                    else return this.dataProviderLength > this.selectedIndex ? this.dataProvider[selectedIndex] : undefined;
                },
                set selectedItem(value){
                    this.setSelectedItem(value, false);
                },
                setSelectedItem:function(value, dispatchChangeEvent){
                    if(dispatchChangeEvent===undefined)dispatchChangeEvent=false;
                    if (this.selectedItem !== value){
                        if (dispatchChangeEvent) this.dispatchChangeAfterSelection = (this.dispatchChangeAfterSelection || dispatchChangeEvent);
                        this._pendingSelectedItem = value;
                        this.invalidateProperties();
                    };
                },

                itemToLabel:function (data) {
                    if (data == null)return " ";

                    if (this.labelFunction != null) return this.labelFunction(data);

                    if (data instanceof XMLDocument){
                        try {
                            if (data[this.labelField].length() != 0)
                                data = data[this.labelField];
                            //by popular demand, this is a default XML labelField
                            //else if (data.@label.length() != 0)
                            //  data = data.@label;
                        } catch(e){}
                    }
                else if (data instanceof Object) {
                        try {
                            if (data[this.labelField] != null) data = data[this.labelField];
                        } catch(e){}
                    }

                    if (data instanceof String) return String(data);

                    try {
                        return data.toString();
                    } catch(e) {}

                    return " ";
                },

                _rendererCache:null,
                commitProperties:function () {
                    var e;
                    var changedSelection = false;

                    $super.commitProperties();
                    if(this.dataProviderChanged===true){
                        // console.log(this.numElements)

                        var i,n;
                        //判断是否需要生成新的显示元件
                        if( this.dataProviderLength>this._rendererCache.length){
                            n=this.dataProviderLength-this._rendererCache.length;
                            for(i=0;i<n;i++){
                                this._rendererCache.push(this.itemRendererFunction instanceof Function?this.itemRendererFunction():new this.itemRenderer);
                            };
                        };


                        //删除
                        if(this.dataProviderLength<this.dataGroup.numElements){
                            for(i=this.dataGroup.numElements-this.dataProviderLength-1;i<this.dataGroup.numElements;i++)this.dataGroup.removeElementAt(i);
                        }else{//添加
                            for(i=this.dataGroup.numElements;i<this.dataProviderLength;i++)this.dataGroup.addElementAt(this._rendererCache[i],i);
                        };

                        //应用数据
                        for(i=0;i<this.dataGroup.numElements;i++){
                            // this.getElementAt(i).data=this.dataProvider[i];
                            this.updateRenderer(this.dataGroup.getElementAt(i),i,this.dataProvider[i]);
                            // this.getElementAt(i).commitProperties();
                        };
                    };

                    if (this.dataProviderChanged) {
                        this.dataProviderChanged = false;

                        if (this.selectedIndex >= 0 && this.dataProvider && this.selectedIndex < this.dataProviderLength)
                            this.itemSelected(this.selectedIndex, true);
                        else if (this.requireSelection)
                            this._proposedSelectedIndex = 0;
                        else
                            this.setSelectedIndex(-1, false);

                        this.commitSelection(true);
                    };
                },
                _requireSelection:false,
                requireSelection:function()
                {
                    return this._requireSelection;
                },
                allowCustomSelectedItem:false,
                dispatchChangeAfterSelection:false,
                commitSelection:function(dispatchChangedEvents)
                {
                    // Step 1: make sure the proposed selected index is in range.
                    var maxIndex = this.dataProvider ? this.dataProvider.length - 1 : -1;
                    var oldSelectedIndex = this._selectedIndex;
                    var oldCaretIndex = this._caretIndex;
                    var e;

                    if (!this.allowCustomSelectedItem || this._proposedSelectedIndex != $self.CUSTOM_SELECTED_ITEM) {
                        if (this._proposedSelectedIndex < $self.NO_SELECTION)
                            this._proposedSelectedIndex = $self.NO_SELECTION;
                        if (this._proposedSelectedIndex > maxIndex)
                            this._proposedSelectedIndex = maxIndex;
                        if (this.requireSelection && this._proposedSelectedIndex == $self.NO_SELECTION &&
                            this.dataProvider && this.dataProviderLength > 0) {
                            this._proposedSelectedIndex = $self.NO_PROPOSED_SELECTION;
                            return false;
                        };
                    };


                    // Caching value of proposed index prevents its being changed in the dispatch
                    // of the changing event, if that results in a call into this function
                    var tmpProposedIndex = this._proposedSelectedIndex;

                    // Step 2: dispatch the "changing" event. If preventDefault() is called
                    // on this event, the selection change will be cancelled.

                    if (this.dispatchChangeAfterSelection) {
                        e = new $IndexChangeEvent($IndexChangeEvent.CHANGING, false, true);
                        e.oldIndex = this._selectedIndex;
                        e.newIndex = this._proposedSelectedIndex;
                        if (!this.dispatchEvent(e)) {
                            //     // The event was cancelled. Cancel the selection change and return.
                            this.itemSelected(this._proposedSelectedIndex, false);
                            this._proposedSelectedIndex = $self.NO_PROPOSED_SELECTION;
                            return false;
                        };
                    };


                    // Step 3: commit the selection change and caret change
                    this._selectedIndex = tmpProposedIndex;
                    this._proposedSelectedIndex = $self.NO_PROPOSED_SELECTION;

                    if (oldSelectedIndex != $self.NO_SELECTION)
                        this.itemSelected(oldSelectedIndex, false);
                    if (this._selectedIndex != $self.NO_SELECTION && this._selectedIndex != $self.CUSTOM_SELECTED_ITEM)
                        this.itemSelected(this._selectedIndex, true);
                    if (this.changeCaretOnSelection)
                        this.setCurrentCaretIndex(this._selectedIndex);

                    // Step 4: dispatch the "change" event and "caretChange"
                    // events based on the dispatchChangeEvents parameter. Overrides may
                    // chose to dispatch the change/caretChange events
                    // themselves, in which case we wouldn't want to dispatch the event
                    // here.
                    if (dispatchChangedEvents) {

                        // Dispatch the change event
                        if (this.dispatchChangeAfterSelection) {
                            e = new $IndexChangeEvent($IndexChangeEvent.CHANGE);
                            e.oldIndex = oldSelectedIndex;
                            e.newIndex = this._selectedIndex;
                            this.dispatchEvent(e);
                            this.dispatchChangeAfterSelection = false;
                        };
                        this.dispatchEvent(new $FlexEvent($FlexEvent.VALUE_COMMIT));

                        //Dispatch the caretChange event
                        if (this.changeCaretOnSelection) {
                            e = new $IndexChangeEvent($IndexChangeEvent.CARET_CHANGE);
                            e.oldIndex = oldCaretIndex;
                            e.newIndex = this.caretIndex;
                            this.dispatchEvent(e);
                        };
                    };


                    this.changeCaretOnSelection = true;
                    return true;
                },
                itemSelected:function () {
                    // if this method is called from anywhere besides the updateRenderer(),
                    // then we want transitions for selection to play.  This way if it's called
                    // from the selectedIndex setter or through the keyDown handler or through
                    // commitProperties(), transitions will be enabled for it.
                    if (!this.inUpdateRenderer){
                        // turnOnSelectionTransitionsForOneFrame();
                    };

                    // Subclasses must override this method to display the selection.
                },
                setCurrentCaretIndex:function (value) {
                    if (value == this.caretIndex) return;
                    this._caretIndex = value;
                },
            }
        );

    $package(PATH)
        .class('List')
        .extends($p.ListBase)
        (
            function () {
                $super();
            }
        );

    $package(PATH)
        .class('ItemRenderer')
        .extends($p.Group)(
            function () {
                $super();
            },{
                _data:null,
                set data(value){
                    if(this._data!==value){
                        this._data=value;
                    };
                },
                get data(){
                    return this._data;
                },
                _itemIndex:-1,
                get itemIndex(){
                    return this._itemIndex;
                },
                set itemIndex(value){
                    if(this._itemIndex!==value)this._itemIndex=value;
                },
                get label(){
                    return this.htmlElementInstance.innerText;
                },
                set label(value){
                    if(this.htmlElementInstance.innerText!==value)this.htmlElementInstance.innerText=value;
                },
            }
        );

        $package(PATH)
            .class('Toast')
            .extends($p.List)(
                function () {
                    $super();
                    this.itemRenderer=$p.ToastRenderer;
                    this.commitProperties=this.commitProperties.bind(this);
                },
                {
                    show:function ($text,$delay,$closeHandler) {
                        var $={text:$text,delay:$delay||800,closeHandler:$closeHandler};
                        !this.dataProvider?this.dataProvider=[$]:this.dataProvider.push($);

                        $callLater(this.commitProperties);
                        setTimeout(function () {
                            this.dataProvider=this.dataProvider.filter(function (t) {
                                return t!==$;
                            });
                            $callLater(this.commitProperties);
                        }.bind(this),$.delay);
                    },
                    set parent(value){
                        $super.parent=value;
                        if(value.toast!==this) value.toast=this;
                    },
                }
            );

        $package(PATH)
            .class('ToastRenderer')
            .extends($p.ItemRenderer)(
                function () {
                    $super();
                },
                {
                    set data(value){
                        $super.data=value;
                        this.label=value.text;
                    },
                }
            );

    $class('RadioGroup')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.isShow=false;
            },{

            }
        );

    $class('RadioBox')
        .extends('html.display.FlexSprite')
        (
            function () {
                $super();
                this.htmlElementInstance=$c('span');
                this.mxmlChildren=[
                    this._editor=$c('input'),
                    this._labelFor=$c('label'),
                    this._labelDisplay=$c('span'),
                ];
                //
                this._editor.setAttribute('id','mx:'+this.UID);
                this._editor.setAttribute('type','radio');
                this._labelFor.setAttribute('for','mx:'+this.UID);
            },{
                _labelDisplay:null,
                _labelFor:null,
                _editor:null,

                get label(){
                    return this._labelDisplay.innerText;
                },
                set label(newVal){
                    if(this.label!==newVal)this._labelDisplay.innerText=newVal;
                },
                get value(){
                    return this._editor.getAttribute('value');
                },
                set value(newVal){
                    var $old=this._editor.getAttribute('value');
                    if($old!==newVal){
                        this._editor.setAttribute('value',newVal);
                    };
                },
            }
        );

})(this);
