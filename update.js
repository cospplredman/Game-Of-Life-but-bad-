let updater = new Worker("updateWorker.js");

let get = async function(message){
	return new Promise((r,re) => {
		updater.onmessage = (e) => {
			r(e.data);
		}
		updater.postMessage(message);
	});
}

let getCells = async function(x, y, w, h){
	let alive = await get(["getCells", [x, y, w, h]]);
	for(let i in alive)
		alive[i] = [alive[i][0]+x, alive[i][1]+y];
	return alive;
}

let getTps = async function(){
	return await get(["getTps", []]);
}

let setCell = function(x, y, v){
	updater.postMessage(["setCell",[x, y, v]]);
}

let setTps = function(newTPS) {
	updater.postMessage(["setTps", [newTPS]]);
}

let setPause = function(v){
	updater.postMessage(["setPause", [v]]);
}

let getInfo = async function(){
	alive = await getCells(
		-Math.floor(xOff/px),
		-Math.floor(yOff/px),
		Math.floor(screenctx.canvas.width/px + 1),
		Math.floor(screenctx.canvas.height/px + 1)
	);

	tpsAccurate = await getTps();
	requestAnimationFrame(getInfo);
}
