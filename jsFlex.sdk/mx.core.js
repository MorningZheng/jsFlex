/**
 * Created by morning on 2017/6/15.
 */
(function () {
    var idEditor={
        add:function (element) {
            if(element===undefined){
                if(this.id){
                    if(this.owner && this.owner[this.id]!==this)this.owner[this.id]=this;
                    if(this.document && this.document[this.id]!==this)this.document[this.id]=this;
                };
            }else{
                if(element.id){
                    if(this[element.id]!==element)this[element.id]=element;
                    if(this.document && this.document[element.id]!==element)this.document[element.id]=element;
                };
            };
        },
        del:function (element) {
            if(element===undefined){
                if(this.owner && this.owner[this.id]===this)delete this.owner[this.id];
                if(this.document && this.document[this.id]===this)delete this.document[this.id];
            }else{
                if(element.id){
                    if(this[element.id]===element) delete this[element.id];
                    if(this.document && this.document[element.id]===element)delete this.document[element.id];
                };
            };
        }
    };

    $package('mx.core')
        .class('UIComponent')
        .extends('flash.display.DisplayObject')
        (
            function () {
                this.mxmlChildren=[];
            },{
                mxmlChildren:null,

                _document:null,
                get document(){
                    return this._document;
                },
                set document(newVal){
                    if(this._document!==newVal){
                        idEditor.del.call(this);
                        this._document=newVal;
                        idEditor.add.call(this);
                    };
                },

                _owner:null,
                get owner(){
                    return this._owner;
                },
                set owner(newVal){
                    if(this._owner!==newVal){
                        idEditor.del.call(this);
                        this._owner=newVal;
                        idEditor.add.call(this);
                    };
                },
                _parent:null,
                get parent(){
                    return this._parent;
                },
                set parent(newVal){
                    if(this._parent!==newVal){
                        idEditor.del.call(this);
                        this._parent=newVal;
                        idEditor.add.call(this);
                    };
                },

                id:null,
                addElementAt:function (element,index) {
                    //do something
                    element.owner=this;
                    element.parent=this;
                    element.document=this.document;
                    if(element instanceof mx.core.UIComponent){
                        // if(element.initialized===false)element.commitProperties();
                        element.elementAdded(this,index);
                    };
                    return element;
                },
                addElement:function (element) {
                    return this.addElementAt(element,-1);
                },
                removeElementAt:function (index) {
                    return this.removeElement(this.getElementAt(index));
                },
                removeElement:function (element) {
                    //do something
                    element.document=element.owner=element.parent=null;
                    element.elementRemoved(this,index);
                    return element;
                },
                getElementAt:function (index) {},
                getElementIndex:function (element) {},
                removeAllElements:function () {
                    for(var _=this.numElements-1;_>-1;_--){
                        this.removeElementAt(this.children[_]);
                    };
                },
                childrenCreated:function () {},

                _initialized:false,
                get initialized(){
                    return this._initialized;
                },
                set initialized(newValue){
                    if(this._initialized!==newValue){
                        this._initialized=newValue;
                        if(newValue)this.commitProperties();
                    };
                },
                commitProperties:function () {
                },
                elementAdded:function (element,index) {
                    // this.owner=element.owner;
                    // this.document=element.document;
                },
                elementRemoved:function (element,index) {
                    if(element instanceof mx.core.UIComponent){
                        // delete element.owner;
                        // delete element.document;
                    };
                },
            }
        );
})();