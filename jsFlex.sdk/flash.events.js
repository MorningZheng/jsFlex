/**
 * Created by morning on 2017/6/15.
 */
$package('flash.events').class('EventDispatcher')(
    function () {
    },
    {
    }
);


$package('flash.events')
    .class('Event')
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
            if(type===undefined){
                // throw 'Event type must be a string';
            };
            if(bubbles!==undefined)this._bubbles=Boolean(bubbles);
            if(cancelable!==undefined)this._cancelable=Boolean(cancelable);

            var $c={__CLASS__:{value:this.constructor.__GLOBAL__.name}};
            var $t=this;// this.constructor.prototype;
            Object.keys($t.constructor.prototype).forEach(function ($k) {
                if($k!=='self'&&$k!=='constructor'){
                    var $o=Object.getOwnPropertyDescriptor($t.constructor.prototype,$k);
                    if($o.hasOwnProperty('value')===true && ($o.value instanceof Function)===false){
                        $o.value=$t[$k];
                    };
                    $c[$k]=$o;
                    $o=null;
                };
            });
            $t=null;

            var $e;
            try{
                $e=new Event(type,{cancelable: this._cancelable, bubbles: this._bubbles});
            }catch(_){
                $e = document.createEvent('Event');
                $e.initEvent(type,this._bubbles,this._cancelable);
            };

            return Object.defineProperties($e,$c);
        },
        {
            _bubbles:'',
            _cancelable :'',
            _currentTarget:'',
            _eventPhase:'',
            _target:'',
            get bubbles(){return _bubbles;},
            get cancelable(){return _cancelable;},
            get currentTarget(){return _currentTarget;},
            get eventPhase(){return _eventPhase;},
            get target(){return _target;}
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
    .extends('flash.events.Event')
    .class('PropertyChangeEvent')
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
    .static({
        get UPDATE(){return 'update';},
        get DELETE(){return 'delete';}
    });