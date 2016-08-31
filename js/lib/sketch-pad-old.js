var SketchPad = (function(){

	var defaults = {
		canvas : null, //required
		debug: null,
		widthStroking : true
	};

	function create(options){
		var sketchPad = {};
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
		sketchPad.setOption = setOption.bind(sketchPad);
		sketchPad.setupCanvas = setupCanvas.bind(sketchPad);
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

	function setOption(name, value){
		this.options[name] = value;
	}

	function strokeStart(e){
		var firstTouch = e.touches[0];
		var x = (firstTouch.pageX - this.canvasEdges.left) * this.pixelRatio;
		var y = (firstTouch.pageY - this.canvasEdges.top) * this.pixelRatio;
		var opacity = this.options.widthStroking ? 1 : firstTouch.force * 3;
		var stroke = "rgba(0,0,0," + opacity + ")";
		var width = this.options.widthStroking ? 10 * firstTouch.force : 1;

		this.debug(firstTouch);

		this.context.strokeStyle = stroke;
		this.context.lineWidth = width;
		this.context.moveTo(x, y);

		this.lastX = x;
		this.lastY = y;

		e.preventDefault();
	}

	function strokeMove(e){
		var firstTouch = e.touches[0];
		var x = (firstTouch.pageX - this.canvasEdges.left) * this.pixelRatio;
		var y = (firstTouch.pageY - this.canvasEdges.top) * this.pixelRatio;
		var opacity = this.options.widthStroking ? 1 : firstTouch.force* 3;
		var stroke = "rgba(0,0,0," + opacity + ")";
		var width = this.options.widthStroking ? 10 * firstTouch.force : 1;

		this.debug(firstTouch);
		Debug.updateWatch("debug1", width);
		Debug.updateWatch("debug2", opacity);

		this.context.beginPath();
		this.context.strokeStyle = stroke;
		this.context.lineWidth = width;
		this.context.moveTo(this.lastX, this.lastY);
		this.context.lineTo(x, y);
		this.context.stroke();

		this.lastX = x;
		this.lastY = y;

		e.preventDefault();
	}

	function strokeStop(e){
		this.context.stroke();
		e.preventDefault();
	}

	function clear(){
		var fill = "#FFFFFF";

		this.dom.canvas.width = canvas.width;
		this.context.fillStyle = fill;
		this.context.rect(0, 0, canvas.width, canvas.height);
		this.context.fill();
	}

	function debug(touch){
		if(this.options.debug){
			Debug.updateWatch("pressure", touch.force);
			Debug.updateWatch("angle", touch.rotationAngle);
			Debug.updateWatch("x", touch.pageX);
			Debug.updateWatch("y", touch.pageY);
			Debug.updateWatch("radiusX", touch.radiusX);
			Debug.updateWatch("radiusY", touch.radiusY);
		}
	}

	function setupCanvas(){
		this.context = this.dom.canvas.getContext("2d");
		this.pixelRatio = Util.pixelRatio(this.context);
		this.canvasEdges = this.dom.canvas.getBoundingClientRect();
		this.dom.canvas.width = this.canvasEdges.width * this.pixelRatio;
		this.dom.canvas.height = this.canvasEdges.height * this.pixelRatio;
		this.context.lineJoin = "round";
		this.context.scale(this.pixelRatio, this.pixelRatio);
	}

	function init(){
		this.cacheDom();
		this.setupCanvas();
		this.attachEvents();

		this.clear();

		if(this.options.debug){
			Debug.addWatch("debug1");
			Debug.addWatch("debug2");
			Debug.addWatch("pressure");
			Debug.addWatch("angle");
			Debug.addWatch("x");
			Debug.addWatch("y");
			Debug.addWatch("radiusX");
			Debug.addWatch("radiusY");
		}
	}

	return {
		create : create
	};

})();
