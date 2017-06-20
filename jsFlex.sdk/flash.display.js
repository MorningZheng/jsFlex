/**
 * Created by morning on 2017/6/15.
 */
$package('flash.display')
    .class('DisplayObject')
    .extends('flash.events.EventDispatcher')
    (
        function () {
            throw new Error('DisplayObject$ class cannot be instantiated.',2012);
        },{
            callLater:function (method, args) {
                $callLater.apply(this,method,args);
            },
        }
    );