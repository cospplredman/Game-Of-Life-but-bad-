let updater = new Worker("cpp/build/main.js");
let glob = {ev:[], v:[]};

updater.onready = (e) => {
	getInfo();
}

updater.onmessage = (e) => {
	glob.ev.push(e.data);
}

let getInfo = () => {
	let v = glob.ev.length;

	let t = [
		-Math.floor(Number(xOff)/Math.floor(px)),
		-Math.floor(Number(yOff)/Math.floor(px)),
		Math.floor(screenctx.canvas.width/px + 1),
		Math.floor(screenctx.canvas.height/px + 1)
	];

	
	for(let i = 0; i != 4; i++)
		if(t[i] != glob.v[i]){
			sendv(t);
			break;
		}

	glob.v = t;

	for(let i = 0; i != v; i++){
		let n = glob.ev.pop();
		switch(n[0]){
			case 3:
				alive = n[1];
			break;
			case 4:
				sendv(glob.v);
			break;
		}
	}

	requestAnimationFrame(getInfo);
}

let sendv = function(v){
	updater.postMessage([6, v]);
}

let getCells = function(x, y, w, h){
	updater.postMessage([5,[x, y, w, h]]);
}

let update = function(){
	updater.postMessage([3,[]]);
}

let getTps = function(){
	//TODO
	return 0;
}

let setCell = function(x, y, v){
	updater.postMessage([1,[Number(x) + (1 << 30), Number(y) + (1 << 30), Number(v)]]);
	q = true;
}

let setTps = function(newTPS) {
	//updater.postMessage(["setTps", [newTPS]]);
}

let setPause = function(v){
	//updater.postMessage(["setPause", [v]]);
}
