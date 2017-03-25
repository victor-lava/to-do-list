
// Universal event handler
function createEventHandler(trigger, targetSelector, callback){
	var domElement = document.querySelector(targetSelector);
	domElement.addEventListener(trigger, callback);
}

// Converts time to degrees.
function timeToDegree(time,max){
	return Math.round(time*360/max) ;
}