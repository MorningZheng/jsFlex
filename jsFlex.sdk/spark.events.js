(function () {
    var PATH='spark.events';

    $package(PATH)
        .class('IndexChangeEvent')
        .extends('flash.events.Event')
        .static({
            get CHANGE(){return 'change'},
            get CHANGING(){return 'changing'},
            get CARET_CHANGE(){return 'caretChange'},
        })(
            function (type, bubbles, cancelable, oldIndex, newIndex) {
                this.oldIndex = oldIndex||-1;
                this.newIndex = newIndex||-1;

                return $super(type, bubbles||false, cancelable||false);
            },{
                newIndex:undefined,
                oldIndex:undefined,
                clone:function () {
                    return new $self(this.type, this.bubbles, this.cancelable, this.oldIndex, this.newIndex);
                },
            }
        )
})();