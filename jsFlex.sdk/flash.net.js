/**
 * Created by morning on 2017/6/19.
 */
(function () {
    // 'use strict';

    $package('flash.net',
        EventDispatcher=$import('flash.events.EventDispatcher'),
        $Event=$import('flash.events.Event')
    )
        .class('URLLoader')
        .extends(EventDispatcher)
        (
            function (request) {
                if(request instanceof URLRequest)this._request=request;
                this.super();

                if(this._handler===null)this._handler=new XMLHttpRequest();
                var $=[
                    function (event) {
                        if(event.lengthComputable)this.bytesTotal=event.total;
                        if(this._handler.getResponseHeader('Content-Length'))this.bytesTotal=parseInt(this._handler.getResponseHeader('Content-Length'));
                        this.bytesLoaded+=event.loaded;
                        this.dispatchEvent(event);
                    },
                    function (event) {
                        this.dispatchEvent(new $Event('ioError'));
                    },
                    function (event) {
                        this.dispatchEvent(new $Event('complete'));
                    },
                ].map(function (_) {
                    return _.bind(this);
                },this);

                this._handler.addEventListener("progress", $[0]);
                this._handler.addEventListener("error", $[1]);
                this._handler.addEventListener("abort", $[1]);
                this._handler.addEventListener("load", $[2]);
            },
            {
                get data(){
                    return this._handler.responseText;
                },
                _request:null,
                _handler:null,
                bytesTotal:0,
                bytesLoaded:0,
                close:function () {
                    this._handler.abort();
                },
                load:function (request) {
                    if(request instanceof URLRequest)this._request=request;
                    this._handler.open(this._request.method,this._request.url);
                    this.dispatchEvent(new $Event($Event.OPEN));
                    this.bytesLoaded=0
                    this.bytesTotal=0;
                    try{
                        this._handler.withCredentials=true;
                    }catch(_){};

                    this._handler.send(request.data);
                },
                _progressHandler:null,
                _loadHandler:null,
                _errorHandler:null,
                _abortHandler:null,
            }
        );


    $package('flash.net',
        URLRequestMethod=$import('flash.net.URLRequestMethod')
    )
        .class('URLRequest')(
            function (url) {
                if(url&&url.constructor === String)this.url=url;
                this.requestHeaders=[];
            },
            {
                url:null,
                method:'GET',
                contentType:'application/x-www-form-urlencoded',
                data:null,
                requestHeaders:null,
                userAgent:''
            }
        );

    $package('flash.net')
        .class('URLRequestMethod')
        .static({
            get DELETE(){
                return 'DELETE';
            },
            get GET(){
                return 'GET';
            },
            get HEAD(){
                return 'HEAD';
            },
            get OPTIONS(){
                return 'OPTIONS';
            },
            get POST(){
                return 'POST';
            },
            get PUT(){
                return 'PUT';
            },
        });

    $package('flash.net')
        .class('Then')
        .static({
            call:function (args) {

            }
        })(
            function (task,errorHandler) {
                var $=this;
                if($===undefined)$=new flash.net.Then;
                $.then(task,errorHandler);
                return $;
            },
            {
                call:function (args) {
                    this.index=0;
                    this.list[0].argument=Array.prototype.slice.call(arguments,0);
                    this.running=true;
                    $callLater(this.work.bind(this));
                    return this;
                },
                then:function (task,errorHandler) {
                    if(this.list===null)this.list=[];
                    if(task instanceof Function)this.list.push({task:task,error:errorHandler});
                    return this;
                },
                running:false,
                args:null,
                list:null,
                index:-1,
                work:function () {
                    if(this.running===false){
                        this.end();
                    }else if(this.index===this.list.length){
                        this.end();
                    }else{
                        var $=this.getTaskByIndex(this.index);
                        try{
                            $.task.apply(this,[this].concat($.argument));
                        }catch(e){
                            this.error(e.stack || e.sourceURL || e.stacktrace);
                        };
                    };
                },
                stop:function () {
                    this.running=false;
                },
                over:function () {
                    this.index++;
                    this.getTaskByIndex(this.index).argument=Array.prototype.slice.call(arguments,0);
                    this.work();
                },
                error:function ($) {
                    this.stop();
                    (this.list[this.index].errorHandler||this.list[0].errorHandler||this.defaultError).call(this,this,$);
                },
                end:function () {
                    this.stop();
                    console.log('all tasks run complete');
                },
                defaultError:function ($) {
                    console.log('Then runs error on '+this.index,$);
                },
                getTaskByIndex:function (index) {
                    return index<this.list.length&&index>-1?this.list[index]:null;
                },

            }
        )
})();