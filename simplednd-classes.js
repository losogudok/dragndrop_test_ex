/*==========  CLASSICAL INHERITANCE  ==========*/


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


function SimpleDnD(options) {
    this.dropZones = options.dropZones;
    this.draggable = options.draggable;
    this.init(this.draggable, this.dropZones);
}
SimpleDnD.prototype = (function() {
    var el;
    SimpleDnD.counter = 0;


    return {
        init: function(dragEls, dropZones) {
            var self = this;
            [].forEach.call(dragEls, function(el) {
                el.setAttribute('data-dragel', SimpleDnD.counter);
                SimpleDnD.counter++;
            });
            [].forEach.call(dropZones, function(item) {
                item.addEventListener('dragenter', self.onDragEnter, false);
                item.addEventListener('dragover', self.onDragOver, false);
                item.addEventListener('dragleave', self.onDragLeave, false);
                item.addEventListener('dragend', self.onDragEnd, false);
                item.addEventListener('drop', self.onDrop, false);
                item.addEventListener('dragstart', self.onDragStart, false);
            });
        },
        onDragStart: function(e) {
            el = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('Text', e.target.dataset['dragel']);
            return true;
        },
        onDragLeave: function(e) {
            this.classList.remove('dragging-over');
        },
        onDragEnd: function(e) {
            this.classList.remove('dragging');
        },
        onDragOver: function(e) {
            var targetCoord = e.target.getBoundingClientRect();
            if (e.clientY - targetCoord.top < (targetCoord.height / 2)) {
                this.insertAdjacentElement('beforeBegin', el);
            } else {
                this.insertAdjacentElement('afterEnd', el);
            }
            e.preventDefault();
            return false;
        },
        onDragEnter: function(e) {
            this.classList.add('dragging-over');
            this.classList.remove('dragging-over');
            var el = e.target;
            e.preventDefault();
            return false;
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        constructor: SimpleDnD
    }
})();


// List with border

function SimpleDnDListWithBorder(options) {
    SimpleDnD.call(this, options);
    this.rootEl = options.rootEl;

    this.rootEl.addEventListener('dragend', this.rootOnDragEnd, false);
}

extend(SimpleDnDListWithBorder, SimpleDnD);

SimpleDnDListWithBorder.prototype.rootOnDragEnd = function (e){
    var self = this;
    this.classList.add('red-border');
    setTimeout(function(){
        self.classList.remove('red-border');
    }, 1000)
};

// List with border and background

function SimpleDnDListWithBorderAndBackground(options) {
    SimpleDnDListWithBorder.call(this, options);
    this.copyList = options.copyList;
}

extend(SimpleDnDListWithBorderAndBackground, SimpleDnDListWithBorder);

SimpleDnDListWithBorderAndBackground.prototype.rootOnDragEnd = function (e){
    var self = this;
    this.classList.add('red-border');
    this.classList.add('red-background');
    setTimeout(function(){
        self.classList.remove('red-border');
        self.classList.remove('red-background');
    }, 1000);    
};

/*==========  PROTOTYPAL INHERITANCE  ==========*/


// var SimpleDnD = {
//     configure: function(options) {
//         this.rootEl
//     },
// }