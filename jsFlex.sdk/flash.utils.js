/**
 * Created by morning on 2017/6/24.
 */
$package('flash.utils',
    TimerEvent=$import('flash.events.TimerEvent')
    )
    .class('Timer').extends('flash.events.EventDispatcher')
    .static({
        get MAX_VALUE(){return 2147483647;}
    })
(
    function (delay, repeatCount) {
        this.super();
        this._delay=delay||20;
        this._repeatCount=repeatCount||0;
    },{
        _handler:-1,
        _delay:20,
        _repeatCount:0,
        _currentCount:0,
        _count:0,
        get currentCount(){
            return this._currentCount;
        },
        get delay(){
            return this._delay;
        },
        get repeatCount(){
            return this._repeatCount;
        },
        _running:false,
        get running(){
            return this._running;
        },

        reset:function () {
            this.stop();
            this._count=0;
            this._currentCount=0;
        },

        start:function () {
            if(this.running === false){
                this._running=true;
                this._run();
            };
        },

        stop:function () {
            clearTimeout(this._handler);
            this._running=false;
            this._count=0;
        },
        _run:function () {
            if(this._count<this.repeatCount || this.repeatCount==0){
                this._count++;
                this._currentCount++;
                this._handler=setTimeout(function () {
                    this.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
                    this._run();
                }.bind(this),this.delay);
            }else{
                this._count=0;
                this.stop();
                this.dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
            };
        },
    }
)