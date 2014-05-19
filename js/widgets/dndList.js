/**
 * Created by andrey on 13.05.14.
 */
define(['libs/dragndrop','libs/pubsub','utils/helpers'], function(dragManager, pubsub, helpers){
    function init() {
        dragManager.onDragCancel = function(dragObject) {
            dragObject.avatar.rollback();
        };

        dragManager.onDragEnd = function(dragObject, dropElem, e) {
            if (dropElem.dataset.droppable === 'sort') {
                var elem = helpers.getElementUnderClientXY(dragObject.elem, e.clientX, e.clientY);
                elem.insertAdjacentElement('afterEnd', dragObject.elem);
                dragObject.elem.style.position = ''
            }
        };
    }
    return {
        init: init
    };
});