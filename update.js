updater.onmessage = (e) => {
	glob.ev.push(e.data);
}

/*
 * Worker Communication loop
 * */
let getInfo = () => {
	let v = glob.ev.length;

	let t = [
		-Math.floor(xOff/px) - 1,
		-Math.floor(yOff/px) - 1,
		Math.floor(screenctx.canvas.width/px) + 2,
		Math.floor(screenctx.canvas.height/px) + 2,
		vd,
		performance.now()
	];

	for(let i = 0; i != 5; i++)
		if(t[i] != glob.v[i]){
			updater.postMessage([6, t]);
			break;
		}

	glob.v = t;

	for(let i = 0; i != v; i++){
		let n = glob.ev.pop();
		switch(n[0]){
			case 3:
				frame.close();
				frame = n[1][1];
				vp = n[1][0];
			break;
			case 4:
				updater.postMessage([6, t]);
			break;
			case 5:
				tpsAccurate = n[1][0];
			break;
		}
	}

	requestAnimationFrame(getInfo);
}

/*
 * Sets the cell at (x, y) to the state v
 * */
let setCell = function(x, y, v){
	updater.postMessage([1,[x, y, v]]);
}

/*
 * Sets the tps limit to tps
 * */
let setTps = function(tps) {
	updater.postMessage([8, [tps]]);
}

/*
 * Sets the pause state to the state v
 * */
let setPause = function(v){
	updater.postMessage([7, [+v]]);
}

let setRule = function(v){
	updater.postMessage([9, v]);
}
