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


function SimpleDnDList(options) {
    this.rootList = options.rootList;
    this.dropZones = options.dropZones;
    this.draggable = options.draggable;
    this.init(this.draggable, this.dropZones);
    this.counter = 0;
}
SimpleDnDList.prototype = {
        init: function(dragEls, dropZones) {
            var list = this.rootList;
            [].forEach.call(dragEls, function(el) {
                el.setAttribute('data-dragel', this.counter);
                this.counter++;
            });
            var onDragStart = this.onDragStart.bind(this);
            var onDrop = this.onDrop.bind(this);
            var onDragEnter = this.onDragEnter.bind(this);
            var onDragLeave = this.onDragLeave.bind(this);
            var onDragEnd = this.onDragEnd.bind(this);
            var onDragOver = this.onDragOver.bind(this);

            list.addEventListener('dragenter',onDragEnter, false);
            list.addEventListener('dragover',onDragOver, false);
            list.addEventListener('dragleave',onDragLeave, false);
            list.addEventListener('dragend',onDragEnd, false);
            list.addEventListener('drop',onDrop, false);
            list.addEventListener('dragstart',onDragStart, false);
            // [].forEach.call(dropZones, function(item) {
            //     item.addEventListener('dragenter', self.onDragEnter, false);
            //     item.addEventListener('dragover', self.onDragOver, false);
            //     item.addEventListener('dragleave', self.onDragLeave, false);
            //     item.addEventListener('dragend', self.onDragEnd, false);
            //     item.addEventListener('drop', self.onDrop, false);
            //     item.addEventListener('dragstart', self.onDragStart, false);
            // });
        },
        // delegate: function(e) {
        //     var target = e.target;

        //     while(target != this) { // (2)
        //     if (target.getAttribute('draggable') == 'true') { // (3)
        //        return target;
        //     }
        //     target = target.parentNode;
        //   }
        // }
        onDragStart: function(e) {
            console.log(this);
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
        constructor: SimpleDnDList
    }
};


// List with border

// function SimpleDnDListWithBorder(options) {
//     SimpleDnDList.call(this, options);
//     this.rootEl = options.rootEl;

//     this.rootEl.addEventListener('dragend', this.rootOnDragEnd, false);
// }

// extend(SimpleDnDListWithBorder, SimpleDnDList);

// SimpleDnDListWithBorder.prototype.rootOnDragEnd = function (e){
//     var self = this;
//     this.classList.add('red-border');
//     setTimeout(function(){
//         self.classList.remove('red-border');
//     }, 1000)
// };

// List with border and background

// function SimpleDnDListWithBorderAndBackground(options) {
//     SimpleDnDListWithBorder.call(this, options);
//     this.copyList = options.copyList;
// }

// extend(SimpleDnDListWithBorderAndBackground, SimpleDnDListWithBorder);

// SimpleDnDListWithBorderAndBackground.prototype.rootOnDragEnd = function (e){
//     var self = this;
//     this.classList.add('red-border');
//     this.classList.add('red-background');
//     setTimeout(function(){
//         self.classList.remove('red-border');
//         self.classList.remove('red-background');
//     }, 1000);    
// };

/*==========  PROTOTYPAL INHERITANCE  ==========*/


// var SimpleDnD = {
//     configure: function(options) {
//         this.rootEl
//     },
// }