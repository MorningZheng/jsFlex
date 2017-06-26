/**
 * Created by morning on 2017/6/21.
 */
(function () {
    $package(
        'vsystem.core',
        URLLoader=$import('flash.net.URLLoader'),
        URLRequest=$import('flash.net.URLRequest')
    )
        .class('rpc')
        .extends('flash.net.Then')
        .static({
            url:null,
        })(
            function (url,api) {
                if(api===undefined)api=api||url;
                else vsystem.core.rpc.url=url;

                if((this instanceof vsystem.core.rpc)===false){
                    var $=new vsystem.core.rpc();
                    $.api=api;
                    return $;
                }else{
                    this.api=api;
                    return this;
                };
            },
            {

                _args:null,
                _loader:null,
                _api:null,
                get api(){
                    return this._api;
                },
                set api(newVal){
                    if(this._api!==newVal)this._api=newVal;
                },
                args:null,
                call:function () {
                    this._args=Array.prototype.slice.call(arguments,0);
                    if(this._loader===null){
                        this._loader=new URLLoader();
                        this._loader.addEventListener('complete',function () {
                            var _=this._loader.data.trim();
                            if(_){
                                _=JSON.parse(this._loader.data);
                                if(_.flag)this.over(_.message);
                                else this.error('server error');
                            }else{
                                console.log('could not decode',_);
                                this.error('no response data');
                            };

                        }.bind(this));
                    }else{
                        this._loader.close();
                    };

                    this.then(function ($t,$r) {
                        var $=new URLRequest(this.constructor.url+'?z=0&s='+String(Math.random() * 65535));
                        $.data='["'+this._api+'",'+JSON.stringify(this._args)+']';
                        $.method='POST';
                        this._loader.load($);
                    }.bind(this));
                    return this.super.call();
                },
            }
        );
})();