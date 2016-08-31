const SketchPad = (function(){

	const defaults = {
		canvas : null, //required
		debugObserver: null
	};

	function create(options){
		let sketchPad = {};
		sketchPad.options = Object.assign({}, defaults, options);
		bind(sketchPad);
		sketchPad.init();
		return sketchPad;
	}

	function bind(sketchPad){
		sketchPad.init = init.bind(sketchPad);
		sketchPad.cacheDom = cacheDom.bind(sketchPad);
		sketchPad.attachEvents = attachEvents.bind(sketchPad);
		sketchPad.strokeStart = strokeStart.bind(sketchPad);
		sketchPad.strokeMove = strokeMove.bind(sketchPad);
		sketchPad.strokeStop = strokeStop.bind(sketchPad);
		sketchPad.clear = clear.bind(sketchPad);
		sketchPad.debug = debug.bind(sketchPad);
	}

	function cacheDom(){
		this.dom = {};
		this.dom.canvas = this.options.canvas;
		this.dom.debugger = this.options.debugger;
	}

	function attachEvents(){
		this.dom.canvas.addEventListener("touchstart", this.strokeStart);
		this.dom.canvas.addEventListener("touchmove", this.strokeMove);
		this.dom.canvas.addEventListener("touchend", this.strokeStop);
	}

	function strokeStart(e){
		const firstTouch = e.touches[0];
		const x = firstTouch.pageX;
		const y = firstTouch.pageY;
		const stroke = "#000000";
		const width = 1.0;

		this.debug(firstTouch);

		this.context.strokeStyle = stroke;
		this.context.lineWidth = width;
		this.context.moveTo(x, y);
		this.context.beginPath();

		e.preventDefault();
	}

	function strokeMove(e){
		const firstTouch = e.touches[0];
		const canvasEdges = this.dom.canvas.getBoundingClientRect();
		const x = firstTouch.pageX - canvasEdges.left;
		const y = firstTouch.pageY - canvasEdges.top;

		this.debug(firstTouch);

		this.context.lineTo(x, y);
		this.context.stroke();

		e.preventDefault();
	}

	function strokeStop(e){
		this.context.stroke();
		this.context.closePath();

		e.preventDefault();
	}

	function clear(){
		const fill = "#FFFFFF";

		this.dom.canvas.width = canvas.width;
		this.context.fillStyle = fill;
		this.context.rect(0, 0, canvas.width, canvas.height);
		this.context.fill();
	}

	function debug(touch){
		if(this.options.debugObserver){
			this.options.debugObserver.pressure = touch.force;
			this.options.debugObserver.angle = touch.rotationAngle;
			this.options.debugObserver.x = touch.pageX;
			this.options.debugObserver.y = touch.pageY;
			this.options.debugObserver.radiusX = touch.radiusX;
			this.options.debugObserver.radiusY = touch.radiusY;
		}
	}

	function init(){
		this.cacheDom();
		this.context = this.dom.canvas.getContext("2d");
		this.attachEvents();
		let canvasEdges = this.dom.canvas.getBoundingClientRect();

		this.dom.canvas.width = canvasEdges.width;
		this.dom.canvas.height = canvasEdges.height;
		this.clear();
	}

	return {
		create : create
	};

})();
