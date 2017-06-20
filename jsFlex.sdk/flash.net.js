/**
 * Created by morning on 2017/6/19.
 */
$package('flash.net',
    EventDispatcher=$import('flash.events.EventDispatcher')
)
    .extends(EventDispatcher)
    .class('URLLoader')
    (
        function (request) {
            if(request instanceof URLRequest)this._request=request;
            this.super();
        },
        {
            data:null,
            _request:null,
            close:function () {

            },
            load:function () {

            },

        }
    );


$package('flash.net',
    URLRequestMethod=$import('flash.net.URLRequestMethod')
)
    .class('URLRequest')(
        function (url) {
            if(url&&url.constructor === String)this._url=url;
        },
        {
            url:null,
            method:URLRequestMethod.GET,
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