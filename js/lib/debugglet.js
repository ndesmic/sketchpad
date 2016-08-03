var Debugglet = (function(){
	var defaults = {
		root : null //required
	};

    function create(options){
        var debugglet = {};
		debugglet.options = Object.assign({}, defaults, options);
        bind(debugglet);
        debugglet.init();
        return debugglet;
    }
    function bind(debugglet){
        debugglet.init = init.bind(debugglet);
		debugglet.write = write.bind(debugglet);
		debugglet.log = log.bind(debugglet);
		debugglet.warn = warn.bind(debugglet);
		debugglet.error = error.bind(debugglet);
		debugglet.exception = exception.bind(debugglet);
		debugglet.cacheDom = cacheDom.bind(debugglet);
		debugglet.addWatch = addWatch.bind(debugglet);
		debugglet.updateWatch = updateWatch.bind(debugglet);
    }
    function init(){
		this.cacheDom();
		this.console = console;
		window.console = {
			log : this.log,
			warn : this.warn,
			error : this.error
		};
		this.watches = {};
		window.addEventListener("error", this.exception);
    }
	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
		this.dom.watches = this.dom.root.querySelector(".watches");
		this.dom.console = this.dom.root.querySelector(".debug-console");
	}
	function log(){
		this.write.apply(null, ["info"].concat(Array.prototype.slice.call(arguments,0)));
	}
	function warn(){
		this.write.apply(null, ["warn"].concat(Array.prototype.slice.call(arguments,0)));
	}
	function error(){
		this.write.apply(null, ["error"].concat(Array.prototype.slice.call(arguments,0)));
	}
	function exception(e){
		this.write.apply(null, ["error", e.message, 'File: ' + e.filename, 'Line: ' + e.lineno, 'Col: ' + e.colno]);
	}
	function addWatch(name){
		var watch = document.createElement("div");
		watch.classList.add("watch");
		watch.innerHTML = "<div class='title'>" + name + "</div>" + "<div class='" + name + " value'></div>";
		this.dom.watches.appendChild(watch);
		this.watches[name] = {
			element : watch.querySelector(".value")
		};
	}
	function updateWatch(name, value){
		if(typeof(value) === "number"){
			value = value.toFixed(4);
		}
		this.watches[name].element.textContent = value;
	}
	function write(){
		var type = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		var line = document.createElement("div");
		line.classList.add(type);
		line.classList.add("debugglet");
		line.textContent = JSON.stringify(args.join(" "))
		this.dom.console.appendChild(line);
		this.console.log(...args);
	}
    return {
        create : create
    };
})();
