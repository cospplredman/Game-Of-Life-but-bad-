let updater = new Worker("cpp/build/main.js");
let glob = {ev:[]};

updater.onmessage = (e) => {
	glob.ev.push(e.data);
}


let getInfo = () => {
	let v = glob.ev.length;
	for(let i = 0; i != v; i++){
		let n = glob.ev.pop();
		switch(n[0]){
			case 2:
				console.log("getCell response", n);
				alive.push([BigInt(n[1][0] - (1 << 30)), BigInt(n[1][1] - (1 << 30))]);
			break;
			case 3:
				alive = n[1];
			break;
		}
	}

	getCells(
		-Math.floor(Number(xOff)/Math.floor(px)),
		-Math.floor(Number(yOff)/Math.floor(px)),
		Math.floor(screenctx.canvas.width/px + 1),
		Math.floor(screenctx.canvas.height/px + 1)
	)
	requestAnimationFrame(getInfo);
}

let getCells = async function(x, y, w, h){
	updater.postMessage([5,[x, y, w, h]]);
}

let getTps = async function(){
	return 0;
}

let setCell = function(x, y, v){
	updater.postMessage([1,[Number(x) + (1 << 30), Number(y) + (1 << 30), Number(v)]]);
}

let setTps = function(newTPS) {
	updater.postMessage(["setTps", [newTPS]]);
}

let setPause = function(v){
	updater.postMessage(["setPause", [v]]);
}
