var Debug;
document.addEventListener("DOMContentLoaded", function(){
	Debug = Debugglet.create({
		root : document.querySelector("#debugger")
	});
	AppView.create();
}, true);
