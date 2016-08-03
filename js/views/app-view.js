"use strict";

var AppView = (function(){

	function create(){
		var appView = {};
		bind(appView);
		appView.init();
		return appView;
	}

	function bind(appView){
		appView.installServiceWorker = installServiceWorker.bind(appView);
		appView.serviceWorkerInstalled = serviceWorkerInstalled.bind(appView);
		appView.serviceWorkerInstallFailed = serviceWorkerInstallFailed.bind(appView);
		appView.cacheDom = cacheDom.bind(appView);
		appView.attachEvents = attachEvents.bind(appView);
		appView.attachSubviews = attachSubviews.bind(appView);
		appView.init = init.bind(appView);
		appView.setModel = setModel.bind(appView);
	}

	function installServiceWorker(){
		if("serviceWorker" in navigator){
			navigator.serviceWorker.register("service-worker.js", {scope: "./"})
				.then(this.serviceWorkerInstalled)
				.catch(this.serviceWorkerInstallFailed);
		}
	}

	function serviceWorkerInstalled(registration){
		console.log("App Service registration successful with scope:", registration.scope);
	}

	function serviceWorkerInstallFailed(error){
		console.error("App Service failed to install", error);
	}

	function cacheDom(){
		this.dom = {};
		this.dom.canvas = document.getElementById("canvas");
		this.dom.debugger = document.getElementById("debugger");
		this.dom.strokingType = document.getElementById("stroking-type");
		this.dom.clear = document.getElementById("clear");
	}

	function attachSubviews(){
		this.views = {};

		this.views.sketchPad = SketchPad.create({
			canvas : this.dom.canvas,
			debug : true
		});
	}

	function setModel(){
		this.model = {
			widthStroking : true
		};
	}

	function attachEvents(){
		var self = this;
		document.addEventListener("touchstart", function(e){ e.preventDefault(); });
		document.addEventListener("touchmove", function(e){ e.preventDefault(); });
		this.dom.strokingType.addEventListener("click", function(e){
			self.model.widthStroking = !self.model.widthStroking;
			self.dom.strokingType.textContent = self.model.widthStroking ? "Width" : "Opacity";
			self.views.sketchPad.setOption("widthStroking", self.model.widthStroking);
		});
		this.dom.strokingType.addEventListener("touchstart", function(e){
			self.model.widthStroking = !self.model.widthStroking;
			self.dom.strokingType.textContent = self.model.widthStroking ? "Width" : "Opacity";
			self.views.sketchPad.setOption("widthStroking", self.model.widthStroking);
		});
		this.dom.clear.addEventListener("click", function(){
			self.views.sketchPad.clear();
		});
		this.dom.clear.addEventListener("touchstart", function(){
			self.views.sketchPad.clear();
		});
	}

	function getQueryData(){
		var searchParams = new URLSearchParams(window.location.search.substr(1));
	}

	function init(){
		this.installServiceWorker();
		this.setModel();
		this.cacheDom();
		this.attachEvents();
		this.attachSubviews();
	}

	return {
		create : create
	};

})();
