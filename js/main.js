require(['dragndrop','pubsub'], function(dragManager, pubsub){
	 dragManager.onDragCancel = function(dragObject) {
      	dragObject.avatar.rollback();
    };

    dragManager.onDragEnd = function(dragObject, dropElem) {
		dropElem.className = 'computer computer-smile';
		dragObject.elem.style.display = 'none';
		setTimeout(function() { dropElem.className = 'computer'; }, 200);
    };
});