/*==========  CLASSICAL INHERITANCE  ==========*/
"use strict";

function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

function mixin(receiver, supplier) {
    Object.keys(supplier).forEach(function(key) {
        receiver[key] = supplier[key];
    });

    return receiver;
}


var PubSub = {
    subscribers: {
        any: []
    },
    on: function(type, fn, context) {
        type = type || 'any';
        fn = typeof fn === "function" ? fn : context[fn];
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push({
            fn: fn,
            context: context || this
        });
    },
    off: function(type, fn, context) {
        this.visitSubscribers('off', type, fn, context);
    },
    trigger: function(type, publication) {
        this.visitSubscribers('trigger', type, publication);
    },
    visitSubscribers: function(action, type, arg, context) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
            max = subscribers ? subscribers.length : 0;
        for (i = 0; i < max; i += 1) {
            if (action === 'trigger') {
                subscribers[i].fn.call(subscribers[i].context, arg);
            } else {
                if (subscribers[i].fn === arg &&
                    subscribers[i].context === context) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};

var Helpers = {
    attachEvent: function(el, type, cssClass, callback) { 
        var self = this;
        if (arguments.length === 3) {
            callback = arguments[2];
            cssClass = false;
        }
        el.addEventListener(type, function(e) {
            var target = self.delegate(el, e, cssClass);
            if (!target) {
                return false;
            }
            e.data = {
                el: target
            };
            callback.call(self, e);
        }, true);    
    },
    delegate: function(el, e, cssClass) {
        var target = e.target;
        if (cssClass) {
            while (!target.classList.contains(cssClass) && target != el) {
                target = target.parentNode;
            }
            if (target === el) {
                return false;
            }
        }
        return target;
    }
};


function SimpleDnD(options) {
    this.rootEl = options.rootEl;
    this.dropZones = options.dropZones;
    this.draggable = options.draggable;
    this.init(this.rootEl);
}
SimpleDnD.prototype = {
    // Current dragging element
    dragEl: null,

    init: function(rootEl) {
        this.attachEvent(rootEl, 'dragenter', this.onDragEnter);
        this.attachEvent(rootEl, 'dragover', this.onDragOver);
        this.attachEvent(rootEl, 'dragleave', this.onDragLeave);
        this.attachEvent(rootEl, 'dragend', this.onDragEnd);
        this.attachEvent(rootEl, 'drop', this.onDragStart);
        this.attachEvent(rootEl, 'dragstart', 'js-draggable', this.onDragStart);
    },
    onDragStart: function(e) {
        var proto = SimpleDnD.prototype;
        var el = e.data.el;
        proto.dragEl = el;
        console.log(SimpleDnD.prototype.dragEl);
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', e.target.dataset['dragel']);
        return true;
    },
    onDragLeave: function(e) {
        var el = e.data.el;
        el.classList.remove('dragging-over');
    },
    onDragEnd: function(e) {
        var el = e.data.el;
        el.classList.remove('dragging');
    },
    onDragOver: function(e) {
        var dragEl = this.dragEl;
        var el = e.data.el;
        // console.log(self);
        var targetCoord = e.target.getBoundingClientRect();
        if (el == this.rootEl && this.rootEl.children.length) {
            return false;
        }
        else if (this.rootEl.children.length === 0) {
            return this.rootEl.appendChild(dragEl);
        }
        if (e.clientY - targetCoord.top < (targetCoord.height / 2)) {
            e.target.insertAdjacentElement('beforeBegin', dragEl);
        } else {
            e.target.insertAdjacentElement('afterEnd', dragEl);
        }
        e.preventDefault();
        return false;
    },
    onDragEnter: function(e) {
        // this.classList.add('dragging-over');
        // this.classList.remove('dragging-over');
        // var el = e.target;
        e.preventDefault();
        return false;
    },
    onDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    },
    constructor: SimpleDnD
};

mixin(SimpleDnD.prototype, Helpers);


// List with border

function SimpleDnDListWithBorder(options) {
    SimpleDnD.call(this, options);
    this.uber = SimpleDnD.prototype;
}
SimpleDnDListWithBorder.prototype = Object.create(SimpleDnD.prototype, {
    constructor: {
        value: SimpleDnDListWithBorder
    }
});
SimpleDnDListWithBorder.prototype.onDragEnd = function(e) {
    var rootEl = this.rootEl;

    Object.getPrototypeOf(SimpleDnDListWithBorder.prototype).onDragEnd.call(this, e);
    rootEl.classList.add('red-border');
    setTimeout(function() {
        rootEl.classList.remove('red-border');
    }, 1000)
};

// List with border and background

function SimpleDnDListWithBorderAndBackground(options) {
    SimpleDnDListWithBorder.call(this, options);
    this.copyList = options.copyList;
    this.uber = SimpleDnDListWithBorder.prototype;
}
SimpleDnDListWithBorderAndBackground.prototype = Object.create(SimpleDnDListWithBorder.prototype, {
    constructor: {
        value: SimpleDnDListWithBorderAndBackground
    }
});
SimpleDnDListWithBorderAndBackground.prototype.onDragEnd = function(e) {
    var rootEl = this.rootEl;
    Object.getPrototypeOf(SimpleDnDListWithBorderAndBackground.prototype).onDragEnd.call(this, e);
    rootEl.classList.add('red-background');
    var copy = this.dragEl.cloneNode(true);
    this.copyList.appendChild(copy);
    setTimeout(function() {
        rootEl.classList.remove('red-background');
    }, 1000);
};
