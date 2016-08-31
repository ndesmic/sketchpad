"use strict";
var Util = (function(){
	function pixelRatio(context){
		var devicePixelsRatio = window.devicePixelRatio || 1;
		var backingStoreRatio = context.webkitBackingStorePixelRatio ||
			 					context.mozBackingStorePixelRatio ||
			 					context.msBackingStorePixelRatio ||
			 					context.oBackingStorePixelRatio ||
			 					context.backingStorePixelRatio || 1;
		return devicePixelRatio / backingStoreRatio;
	}

	return {
		pixelRatio : pixelRatio
	};
})();
