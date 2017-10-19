(function (path) {
    $package(path)
        .class('State')
        .extends('flash.events.EventDispatcher')(
            function (properties) {
                $super();
                this.overrides=[];
                this.stateGroups=[];
                for (var p in properties){
                    this[p] = properties[p];
                }
            },
            {
                initialized:false,
                basedOn:null,
                name:null,
                overrides:null,
                stateGroups:null,
                mx_internal_initialize:function () {
                    if (!this.initialized) {
                        this.initialized = true;
                        for (var i = 0; i < this.overrides.length; i++) {
                            this.overrides[i].mx_internal_initialize();
                        }
                    }
                },
            }
        )
})('mx.states');