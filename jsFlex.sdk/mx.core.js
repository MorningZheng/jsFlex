/**
 * Created by morning on 2017/6/15.
 */
(function () {
    var UIComponentGlobals={
        layoutManager:{
            invalidatePropertiesList:[],
            invalidateProperties:function ($component) {
                this.invalidatePropertiesList.push($component);
                $callLater(this.doInvalidateProperties.bind(this));
            },
            doInvalidateProperties:function () {
                var $=this.invalidatePropertiesList.concat();
                this.invalidatePropertiesList.length=0;
                $.forEach(function (_) {
                    _.commitProperties();
                });
            },
        },
    };

    $package('mx.core')
        .class('UIComponent')
        .extends('flash.display.DisplayObject')
        (
            function () {
                // this.mxmlChildren=[];
            }, {
                _mxmlChildren:undefined,
                get mxmlChildren(){
                    if(this._mxmlChildren===undefined)this._mxmlChildren=[];
                    return this._mxmlChildren;
                },
                set mxmlChildren(nv){
                    if(this._mxmlChildren!==nv)this._mxmlChildren=nv;
                },

                get document() {
                    return this.parent ? this.parent.document : null;
                },

                get owner() {
                    return this.parent ? this.parent.owner : null;
                },
                _parent: null,
                get parent() {
                    return this._parent;
                },
                set parent(newVal) {
                    if (this._parent !== newVal) {
                        this._parent = newVal;
                    }
                    ;
                },

                _id: null,
                get id() {
                    return this._id;
                },
                set id(newVal) {
                    if (this._id !== newVal) this._id = newVal;
                },
                addElementAt: function (element, index) {
                    //do something
                    // element.parent=element.owner=this;
                    if (element instanceof mx.core.UIComponent) element.elementAdded(this, index);
                    return element;
                },
                addElement: function (element) {
                    return this.addElementAt(element, -1);
                },
                removeElementAt: function (index) {
                    return this.removeElement(this.getElementAt(index));
                },
                removeElement: function (element) {
                    //do something
                    element.document = element.owner = element.parent = null;
                    element.elementRemoved(this, element.getElementIndex(element));
                    return element;
                },
                getElementAt: function (index) {
                },
                getElementIndex: function (element) {
                },
                removeAllElements: function () {
                    for (var _ = this.numElements - 1; _ > -1; _--) {
                        this.removeElementAt(this.children[_]);
                    }
                    ;
                },
                childrenCreated: function () {
                },

                _initialized: false,
                get initialized() {
                    return this._initialized;
                },
                set initialized(newValue) {
                    if (this._initialized !== newValue) {
                        this._initialized = newValue;
                        if (newValue) this.commitProperties();
                    }
                    ;
                },
                commitProperties: function () {
                    this.invalidatePropertiesFlag = false;
                    this.commitCurrentState();
                },
                elementAdded: function (element, index) {
                    if (element.owner && this.id && element.owner.hasOwnProperty(this.id) === false) element.owner[this.id] = this;
                    if(element.initialized===true) $this.commitProperties();
                },
                elementRemoved: function (element, index) {
                    if (element.owner && this.id && element.owner[this.id] === this) delete element.owner[this.id];
                },
                invalidatePropertiesFlag: false,
                invalidateProperties: function () {
                    if (!this.invalidatePropertiesFlag) {
                        this.invalidatePropertiesFlag = true;
                        UIComponentGlobals.layoutManager.invalidateProperties(this);
                    }
                    ;

                },
                _states: null,
                get states() {
                    return this._states;
                },
                set states(value) {
                    if (this._states !== value) {
                        this._states = value;
                        this.commitCurrentState();
                    };
                },

                commitCurrentState:function () {
                },
            }
        );
})();