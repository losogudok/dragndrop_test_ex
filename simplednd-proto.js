/*==========  PROTOTYPAL INHERITANCE  ==========*/

function extend(obj) {
    var args = [].slice.call(arguments, 1);
    args.forEach(function(source) {
        for (var prop in source) {
            obj[prop] = source[prop];
        }
    });
    return obj;
};

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
var SimpleDnD = {
    dragEl: {},
    init: function(options) {
        var self = this;
        this.rootEl = options.rootEl;
        this.dropZones = options.dropZones;
        this.draggable = options.draggable;
        this.dragElCounter = 0;
        this.attachEvents(this.rootEl);
        this.attachCustomEvents(this);
        [].forEach.call(this.draggable, function(el) {
            el.setAttribute('data-dragel', self.dragElCounter);
            self.dragElCounter++;
        });
    },
    attachEvents: function(el) {
        var self = this;
        el.addEventListener('dragenter', function(e) {
            var el = self.delegate(e, this);
            self.onDragEnter(e, el, self);
        }, false);
        el.addEventListener('dragover', function(e) {
            var el = self.delegate(e, this);
            if (el === self.rootEl && self.rootEl.children.length !=0 ) return;
            self.onDragOver(e, el, self);
        }, false);
        el.addEventListener('dragleave', function(e) {
            var el = self.delegate(e, this);
            if (el === self.rootEl) return;
            self.onDragLeave(e, el, self);
        }, false);
        el.addEventListener('dragend', function(e) {
            var el = self.delegate(e, this);
            if (el === self.rootEl) return;
            self.onDragEnd(e, el, self);
        }, false);
        el.addEventListener('drop', function(e) {
            var el = self.delegate(e, this);
            if (el === self.rootEl) return;
            self.onDrop(e, el, self);
        }, false);
        el.addEventListener('dragstart', function(e) {
            var dragEl = self.dragEl;
            dragEl.el = e.target;
            self.onDragStart(e, el, self);
        }, false);
    },
    delegate: function(e, _this) {
        var target = e.target;
        while (target != _this) {
            if (target.getAttribute('draggable') == 'true') {
                return target;
            }
            target = target.parentNode;
        }
        return target;
    },
    attachCustomEvents: function(self) {

    },
    onDragStart: function(e, el, self) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', e.target.dataset['dragel']);
        return true;
    },
    onDragLeave: function(e, el, self) {
        el.classList.remove('dragging-over');
    },
    onDragEnd: function(e, el, self) {
        el.classList.remove('dragging');
    },
    onDragOver: function(e, el, self) {
        if (el == self.rootEl) {
            return false;
        }
        var targetCoord = e.target.getBoundingClientRect();
        if (e.clientY - targetCoord.top < (targetCoord.height / 2)) {
            e.target.insertAdjacentElement('beforeBegin', self.dragEl.el);
        } else {
            e.target.insertAdjacentElement('afterEnd', self.dragEl.el);
        }
        e.preventDefault();
        return false;
    },
    onDragEnter: function(e, el, self) {
        e.preventDefault();
        return false;
    },
    onDrop: function(e, el, self) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
};
var SimpleDnDList = extend(SimpleDnD, PubSub);
var SimpleDnDListWithRedBorder = Object.create(SimpleDnDList, {
    onDragEnd: {
        value: function(e, el, self) {
            el.classList.remove('dragging');
            self.trigger('dragended', {
                obj: self
            });
        }
    },
    attachCustomEvents: {
        value: function() {
            this.on('dragended', this.ondragended);
        }
    },
    ondragended: {
        value: function(e) {
            if (e.obj === this ) {
                this.showRedBorder();    
            }
        }
    },
    showRedBorder: {
        value: function() {
            var self = this;
            this.rootEl.classList.add('red-border');
            setTimeout(function() {
                self.rootEl.classList.remove('red-border');
            }, 1000);
        }
    }
});
var SimpleDnDListWithRedBackground = Object.create(SimpleDnDListWithRedBorder, {
    init: {
        value: function(options) {
            Object.getPrototypeOf(Object.getPrototypeOf(this)).init.call(this, options);
            this.copyList = options.copyList;
        }
    },
    ondragended: {
        value: function(e) {
            if (e.obj === this ) {
                this.showRedBorder();    
                this.showRedBackground();
                this.copyTo(this.copyList);
            }            
        }
    },
    showRedBackground: {
        value: function() {
            var self = this;
            this.rootEl.classList.add('red-border');
            this.rootEl.classList.add('red-background');
            setTimeout(function(){
                self.rootEl.classList.remove('red-border');
                self.rootEl.classList.remove('red-background');
            }, 1000);    
        }
    },
    copyTo: {
        value: function(list) {
            var copy = this.dragEl.el.cloneNode(true);
            list.appendChild(copy);
        }
    }
});
