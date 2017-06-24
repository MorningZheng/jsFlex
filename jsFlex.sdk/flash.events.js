/**
 * Created by morning on 2017/6/15.
 */
$package(
    'flash.events'
    )
    .class('EventDispatcher')(
        function (target) {
            if(target) this._target=target;
        },
        {
            _initializeListeners:function (type) {
                type=type||'';
                // console.log(type);
                if(this._listeners===null)this._listeners={};
                if(type){
                    if(this._listeners.hasOwnProperty(type)===false)this._listeners[type]={0:[],1:[]};
                    return this._listeners[type];
                }else{
                    return this._listeners;
                };
            },
            _target:null,
            _listeners:null,
            addEventListener:function (type, listener, useCapture, priority, useWeakReference) {
                //现在所有的，只实现目标阶段和冒泡阶段
                if(listener instanceof Function){
                    var $=this._initializeListeners(type);
                    $[useCapture?1:0].push({
                        listener:listener,
                        useCapture:useCapture||false,
                        priority:priority||0,
                        useWeakReference:useWeakReference||false,
                    });
                }else{
                    throw '指定的 listener 不是一个函数。';
                };
            },
            dispatchEvent:function (event) {
                var $=this._initializeListeners(event.type);
                //	Boolean — 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
                event.eventPhase=1;
                event.eventPhase=2;
                event.target=event.currentTarget=this;
                $[0].sort(this._sortPriority).some(function (_) {
                    _.listener(event);
                });
                event._bubbles=true;
                event.eventPhase=3;
                $[1].sort(this._sortPriority).some(function (_) {
                    _.listener(event);
                });
                if(this.parent)this._triggerParent(event,this.parent);
            },

            _triggerParent:function (event,node) {
                try{
                    var $=node._initializeListeners(event.type);
                    event.currentTarget=node;
                    $[1].sort(node._sortPriority).some(function (_) {
                        _.listener(event);
                    });
                    if(node.parent)this._triggerParent(event,node.parent);
                }catch(_){};
            },

            _sortPriority:function (a,b) {
                if(a.priority>b.priority)return -1;
                else if(a.priority<b.priority)return 1;
                else return 0;
            },
            hasEventListener:function (type) {
                var $=this._initializeListeners(type);
                return $[0].length>0||$[1].length>0;
            },
            removeEventListener:function (type, listener, useCapture) {
                var $=this._initializeListeners(type);
                $[useCapture?1:0]=$[useCapture?1:0].filter(function (_) {
                    return _.listener!==listener;
                });
            },
            willTrigger:function (type) {
                //hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
                //有待实现
                if(this.hasEventListener(type)===false){
                    return this.parent && this.numElements?
                        this._findParenTrigger(type,this.parent)?true:this._findChildTrigger(type,this.children):false;
                }else return true;
            },
            _findParenTrigger:function (type,node) {
                try{
                    var $=node._initializeListeners(type);
                    if($[1].length>0)return true;
                    else if(node.parent)return this._findParenTrigger.call(this,type,node.parent);
                    else return false;
                }catch(_){
                    return false;
                };
            },
            _findChildTrigger:function (type,children) {
                return Array.prototype.some.call(children,function (node) {
                    try{
                        var $=node._initializeListeners(type);
                        if($[0].length>0)return true
                        else if(node.children)this._findChildTrigger.call(this,type,node.children);
                        else return false;
                    }catch(_){
                        return false;
                    }
                },this)
            },
        }
    );


$package('flash.events')
    .class('Event')
    .extends((function () {
        var $=function () {};
        $.prototype=new Event('document.Event');
        $.prototype.type='bridge';
        $.__GLOBAL__={
            initialized:{class:1,request:1,static:0,initializer:0,prototype:0},
            prototype:$.prototype,
            class:$,
        };
        return $;
    })())
    .static({
        ACTIVATE:'activate',
        ADDED:'added',
        ADDED_TO_STAGE:'addedToStage',
        BROWSER_ZOOM_CHANGE:'browserZoomChange',
        CANCEL:'cancel',
        CHANGE:'change',
        CHANNEL_MESSAGE:'channelMessage',
        CHANNEL_STATE:'channelState',
        CLEAR:'clear',
        CLOSE:'close',
        CLOSING:'closing',
        COMPLETE:'complete',
        CONNECT:'connect',
        CONTEXT3D_CREATE:'context3DCreate',
        COPY:'copy',
        CUT:'cut',
        DEACTIVATE:'deactivate',
        DISPLAYING:'displaying',
        ENTER_FRAME:'enterFrame',
        EXIT_FRAME:'exitFrame',
        EXITING:'exiting',
        FRAME_CONSTRUCTED:'frameConstructed',
        FRAME_LABEL:'frameLabel',
        FULLSCREEN:'fullScreen',
        HTML_BOUNDS_CHANGE:'htmlBoundsChange',
        HTML_DOM_INITIALIZE:'htmlDOMInitialize',
        HTML_RENDER:'htmlRender',
        ID3:'id3',
        INIT:'init',
        LOCATION_CHANGE:'locationChange',
        MOUSE_LEAVE:'mouseLeave',
        NETWORK_CHANGE:'networkChange',
        OPEN:'open',
        PASTE:'paste',
        PREPARING:'preparing',
        REMOVED:'removed',
        REMOVED_FROM_STAGE:'removedFromStage',
        RENDER:'render',
        RESIZE:'resize',
        SCROLL:'scroll',
        SELECT:'select',
        SELECT_ALL:'selectAll',
        SOUND_COMPLETE:'soundComplete',
        STANDARD_ERROR_CLOSE:'standardErrorClose',
        STANDARD_INPUT_CLOSE:'standardInputClose',
        STANDARD_OUTPUT_CLOSE:'standardOutputClose',
        SUSPEND:'suspend',
        TAB_CHILDREN_CHANGE:'tabChildrenChange',
        TAB_ENABLED_CHANGE:'tabEnabledChange',
        TAB_INDEX_CHANGE:'tabIndexChange',
        TEXT_INTERACTION_MODE_CHANGE:'textInteractionModeChange',
        TEXTURE_READY:'textureReady',
        UNLOAD:'unload',
        USER_IDLE:'userIdle',
        USER_PRESENT:'userPresent',
        VIDEO_FRAME:'videoFrame',
        WORKER_STATE:'workerState'
    })(
        function (type, bubbles, cancelable) {
            if(type===undefined)throw 'Event type must be a string';

            var $e;
            try{
                $e=new Event(type,{cancelable: this._cancelable, bubbles: this._bubbles});
            }catch(_){
                $e = document.createEvent('Event');
                $e.initEvent(type,this._bubbles,this._cancelable);
            };
            $e.__proto__=this.constructor.prototype;
            $e.type=this.type=type;
            $e.bubbles=this._bubbles=bubbles||false;
            $e.cancelable=this._cancelable=cancelable||false;

            return $e;
        },
        {
            _bubbles:false,
            _cancelable :false,
            _currentTarget:null,
            _eventPhase:1,
            _target:null,
            get bubbles(){return this._bubbles;},
            get cancelable(){return this._cancelable;},
            get currentTarget(){return this._currentTarget;},
            get eventPhase(){return this._eventPhase;},
            get target(){return this._target;},
        }
    );


$package('flash.events')
    .extends('flash.events.Event')
    .class('Request')(
        function (type, bubbles, cancelable, value) {
            var $e=this.super(type, bubbles, cancelable);
            Object.defineProperty($e,'value',{configurable: true, enumerable: true,writable:false,value:value});
            return $e;
        }
    );

$package('fl.events')
    .extends('flash.events.Event')
    .class('ListEvent')
    .static({
        ITEM_CLICK:'itemClick',
        ITEM_DOUBLE_CLICK:'itemDoubleClick',
        ITEM_ROLL_OUT:'itemRollOut',
        ITEM_ROLL_OVER:'itemRollOver'
    })(
        function (type,bubbles,cancelable,columnIndex,rowIndex,index,item) {
            if(columnIndex!==undefined)this._columnIndex=columnIndex;
            if(rowIndex!==undefined)this._rowIndex=rowIndex;
            if(index!==undefined)this._index=index;
            if(item!==undefined)this._item=item;
            return this.super(type,bubbles,cancelable);
        },
        {
            _columnIndex:-1,
            _index:-1,
            _item:null,
            _rowIndex:-1,
            get columnIndex(){
                return this._columnIndex;
            },
            get index(){
                return this._index;
            },
            get item(){
                return this._item;
            },
            get rowIndex(){
                return this._rowIndex;
            }
        }
    );

$package('flash.events')
    .class('PropertyChangeEvent')
    .extends('flash.events.Event')
    .static({PROPERTY_CHANGE:'propertyChange'})
    (function (type, bubbles, cancelable,
               kind, property, oldValue, newValue, source) {
        var $e=this.super(type, bubbles, cancelable);
        $e.kind = kind;
        $e.property = property;
        $e.oldValue = oldValue;
        $e.newValue = newValue;
        $e.source = source;
        return $e;
    });

$package('flash.events')
    .class('PropertyChangeEventKind')
    .extends('flash.events.Event')
    .static({
        get UPDATE(){return 'update';},
        get DELETE(){return 'delete';}
    });

$package('flash.events')
    .class('EventPhase')
    .extends('flash.events.Event')
    .static({
        get	CAPTURING_PHASE(){return 1},
        get	AT_TARGET(){return 2},
        get	BUBBLING_PHASE(){return 3},
    });

$package('flash.events')
    .class('TimerEvent')
    .extends('flash.events.Event')
    .static({
        get	TIMER(){return 'timer';},
        get	TIMER_COMPLETE(){return 'timerComplete';},
    })(
        function () {
            return this.super.apply(this,arguments);
        }
    )