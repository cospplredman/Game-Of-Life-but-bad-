updater.onmessage = (e) => {
	glob.ev.push(e.data);
}

/*
 * Worker Communication loop
 * */
let getInfo = () => {
	let v = glob.ev.length;

	let t = [
		-Math.floor(xOff/px),
		-Math.floor(yOff/px),
		Math.floor(screenctx.canvas.width/px + 1),
		Math.floor(screenctx.canvas.height/px + 1),
		vd
	];

	for(let i = 0; i != 4; i++)
		if(t[i] != glob.v[i]){
			updater.postMessage([6, t]);
			break;
		}

	glob.v = t;

	for(let i = 0; i != v; i++){
		let n = glob.ev.pop();
		switch(n[0]){
			case 3:
				zp = px, vp = n[1][1][4];
				cellPath = new Path2D();
				
				alive = n[1][0];
				for(let i = 0; i != alive.length; i++)
					cellPath.rect(alive[i][0]*px, alive[i][1]*px, px, px);
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
