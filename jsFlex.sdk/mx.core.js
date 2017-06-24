/**
 * Created by morning on 2017/6/15.
 */
(function () {
    // var idEditor={
    //     add:function () {
    //         if(this.id){
    //             if(this.owner && this.owner[this.id]!==this)delete this.owner[this.id];
    //             if(this.document && this.document[this.id]!==this)delete this.document[this.id];
    //         };
    //     },
    //     del:function () {
    //         if(this.id){
    //             if(this.owner && this.owner[this.id]===this)delete this.owner[this.id];
    //             if(this.document && this.document[this.id]===this)delete this.document[this.id];
    //         };
    //     }
    // };

    $package('mx.core')
        .class('UIComponent')
        .extends('flash.display.DisplayObject')
        (
            function () {
                this.mxmlChildren=[];
            },{
                mxmlChildren:null,

                get document(){
                    return this.parent?this.parent.document:null;
                },

                get owner(){
                    return this.parent?this.parent.owner:null;
                },
                _parent:null,
                get parent(){
                    return this._parent;
                },
                set parent(newVal){
                    if(this._parent!==newVal){
                        // idEditor.del.call(this);
                        this._parent=newVal;
                        // idEditor.add.call(this);
                    };
                },

                _id:null,
                get id(){
                    return this._id;
                },
                set id(newVal){
                    if(this._id!==newVal)this._id=newVal;
                },
                addElementAt:function (element,index) {
                    //do something
                    // element.parent=element.owner=this;
                    if(element instanceof mx.core.UIComponent)element.elementAdded(this,index);
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
                    if(element.owner && this.id && element.owner.hasOwnProperty(this.id)===false)element.owner[this.id]=this;
                },
                elementRemoved:function (element,index) {
                    if(element.owner && this.id && element.owner[this.id]===this)delete element.owner[this.id];
                },
            }
        );
})();