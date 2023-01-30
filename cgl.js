// Canvas
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d", {alpha: false});
screenctx.canvas.width = window.innerWidth;
screenctx.canvas.height = window.innerHeight;

//current frame
let loddist = 1;
let zp = 0, vp = 0;
let frame;

/*
 * View related variables.
 *
 * px is the width in pixels of every cell
 * x and y are the mouse x and y coordinates in pixels
 * xOff and yOff are basically the x and y coordinates of the camera in pixels
 * 
 * zoom affects px
 * vd is basically which LOD to display
 * */
let xOff = 0, yOff = 0,
    px = 20,
    x = 0, y = 0,
    grid = true, zoom = 1, vd = 0;

// Mouse
let mbutton=0;
let panmode = false;
let scrollSpeed = 0.15;

//worker
let updater = new Worker("cpp/main.js");

//worker message cache
let glob = {ev:[], v:[]};
let tpsAccurate = 0;
let alive = [];
let tps = 10;
let pause = true;

// Outer / meta
screen.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);

window.addEventListener("resize", function(e) {
	screenctx.canvas.width = window.innerWidth;
	screenctx.canvas.height = window.innerHeight;
});

// Keyboard
window.addEventListener("keydown", function(e) {
	e.preventDefault();
	switch(e.code){
		case "ArrowUp":
			tps += 1;
			setTps(tps);
		break;
		case "ArrowDown":
			tps -= 1;
			tps = tps < 0 ? 0 : tps;
			setTps(tps);
		break;
		case "Space":
			pause = !pause
			setPause(pause);
		break;
		case "KeyG":
			grid = !grid;
		break;
		case "KeyS":
			screenShot();
		break;
		case "KeyR":
			setRule(rule(prompt("please enter rule")));
		break;
	}
});

// Mouse
screen.addEventListener("mousedown", function(e) {
	let xTmp = Math.floor((x - xOff)/px), yTmp = Math.floor((y - yOff)/px);
	switch (e.button) {
		case 0:
			mbutton |= 1;
			setCell(xTmp, yTmp, 1);
		break;
		case 1:
			panmode = true;
			mbutton |= 2;
		break;
		case 2:
			mbutton |= 4;
			setCell(xTmp, yTmp, 0);
		break;
	}
});

screen.addEventListener("pointermove",function(e) {
	if(panmode)
		xOff -= x - e.clientX, yOff -= y - e.clientY
	
	x = e.clientX, y = e.clientY;

	let events = e.getCoalescedEvents();
	if(mbutton == 1 || mbutton == 4){
		let state = 0;
		if(mbutton == 1)
			state = 1;

		for(let i = 0; i < events.length; i++){
			let x = events[i].clientX, y = events[i].clientY;
			let xTmp = Math.floor((x - xOff)/px), yTmp = Math.floor((y - yOff)/px);

			setCell(xTmp, yTmp, state);
		}
	}

});

screen.addEventListener("mouseleave", ()=>{
	panmode = false;
	mbutton = 0;
});

screen.addEventListener("mouseup", function(e) {
	switch (e.button) {
		case 0:

			mbutton &= ~1;
		break;
		case 1:
			panmode=false;
			mbutton &= ~2;
		break;
		case 2:
			mbutton &= ~4;
		break;
	}
});

screen.addEventListener("wheel", function(e){ 
	e.preventDefault();

	let xs = (xOff - x)/px, ys = (yOff - y)/px;
	zoom += clamp(e.deltaY,-1,1)*scrollSpeed;

	if(zoom < 0.03)
		zoom = 0.03;

	px = 20/zoom;
	td = -Math.floor(Math.log2(px*(1 << loddist)));

	if(td < 0)
		td = 0;

	if(td != vd){
		px *= 2**td;
		xOff = (xs * px) + x;
		yOff = (ys * px) + y;
		
		let d = td - vd > 0 ? 1 << (td - vd) : -(1 << (vd - td - 1));
		xOff -= (xOff - x)/d;
		yOff -= (yOff - y)/d;
		vd = td;
		return;
	}
	

	px *= 2**vd;
	xOff = (xs * px) + x;
	yOff = (ys * px) + y;
});

updater.onmessage = function(e) {
	glob.ev.push(e.data);
}

/*
 * Worker Communication loop
 * */
function getInfo() {
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
				let of = frame;
				frame = n[1][1];
				vp = n[1][0];
				of.close();
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
function setCell(x, y, v){
	updater.postMessage([1,[x, y, v]]);
}

/*
 * Sets the tps limit to tps
 * */
function setTps(tps) {
	updater.postMessage([8, [tps]]);
}

/*
 * Sets the pause state to the state v
 * */
function setPause(v){
	updater.postMessage([7, [+v]]);
}

function setRule(v){
	updater.postMessage([9, v]);
}

function drawLine(x1, y1, x2, y2) {
	screenctx.moveTo(x1, y1);
	screenctx.lineTo(x2, y2);
}

function drawGrid(){
	screenctx.beginPath();
	let xa = xOff%px, ya = yOff%px;
	for(let dimPos = 0; dimPos < screenctx.canvas.width + px; dimPos+=px)
		drawLine(dimPos+xa,0,dimPos+xa,screenctx.canvas.height);
	
	for(let dimPos = 0;dimPos < screenctx.canvas.height + px; dimPos+=px)
		drawLine(0,dimPos+ya,screenctx.canvas.width,dimPos+ya);
	
	screenctx.stroke();
}

function lerp(start, end, t) {
	return (1-t)*start+t*end;
}

function clamp(val, min, max) {
	return (val <= max ? (val >= min ? val : min) : max);
}

/*
 * Places a GOL pattern that you pass it.
 * 	pattern is stored as an array of x y pairs.
 * */
function place(arr){
	for(let i = 0; i < arr.length; i++)
		setCell(arr[i][0], arr[i][1], 1);
}

/*
 * Parses a plain text GOL file and returns a GOL pattern
 * https://conwaylife.com/wiki/Plaintext
 * */
function PT(str){
	let a = str.split("\n");
	let r = [];
	for(let i = 0, k = 0; i < a.length; i++){
		if(a[i][0] == "!")
			continue;
		for(let j = 0; j != a[i].length; j++)
			if(a[i][j] == "O")
				r.push([j, k]);
		k++;
	}
	return r;

}

/*
 * Parses a run length encoded GOL file and returns a GOL pattern
 * https://conwaylife.com/wiki/Run_Length_Encoded
 * */
function RLE(str){
	//TODO: make this less cancer
	let a = str.split("\n");
	let r = [];
	let n = 0;
	for(let i = 0, k = 0, d = 0; i != a.length; i++){
		if(a[i][0] == "#")
			continue;

		if(a[i].match(/x = [0-9]+, y = [0-9]+/))
			continue;

		console.log(a[i]);
		for(let j = 0; j != a[i].length; j++){
			if("0123456789".indexOf(a[i][j]) != -1){
				n = n*10 + Number(a[i][j]);
			}else if(a[i][j] == "b"){
				if(n == 0)
					n = 1;
				d += n;
				n = 0;
			}else if(a[i][j] == "o"){
				if(n == 0)
					n = 1;
				for(let q = 0; q < n; q++)
					r.push([d++,k]);
				n = 0;
			}else if(a[i][j] == "$"){
				d = 0;
				k++
			}
		}
	}
	return r;
}

function screenShot(){
	//TODO: doesn't function properly when LOD is active
	let scr = document.createElement("canvas");
	let ctx = scr.getContext("2d");
	ctx.canvas.width = frame.width;
	ctx.canvas.height = frame.height;
	ctx.drawImage(frame, 0, 0);
	let url = scr.toDataURL();

	var a = document.createElement('a');
	a.href = url;
	a.download = "screenshot.png";
	a.click();
}

function rule(str){
	let ret = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	let q = str.split("/");
	for(let i = 0; i != 2; i++)
		for(let j = 1; j != q[i].length; j++)
			ret[i*9 + +q[i][j]] = 1;
	return ret;
}

function draw(){
	{ //clear
		screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	}

	{ //cells
		let sc = px*2**(vp[4]-vd);
		screenctx.translate(xOff + vp[0]*sc, yOff + vp[1]*sc);
		screenctx.scale(sc, sc);
		screenctx.imageSmoothingEnabled = false;
		screenctx.drawImage(frame, 0, 0, frame.width, frame.height);
		screenctx.setTransform(1, 0, 0, 1, 0 ,0);
	}

	screenctx.fillStyle = "#999999";
	{ //highlighted cell
        	screenctx.fillRect(
			Math.floor((x - xOff)/px)*px + xOff, 
			Math.floor((y - yOff)/px)*px + yOff,
			px,px
		);
	}

	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#222222";
	screenctx.lineWidth = px/50;
	if(grid){ //grid
		drawGrid();
	}


	screenctx.lineWidth = 1;
	if(pause){ //pause state symbol
		screenctx.beginPath();
		screenctx.rect(screenctx.canvas.width - 32, 10, 24, 64);
		screenctx.rect(screenctx.canvas.width - 64, 10, 24, 64);
		screenctx.stroke();
		screenctx.fill();
	}

	screenctx.font = "24px Courier New";
	{ //TPS text
		let tpstxt = [(tps ? "TPS: " + tps : "Unlimited"), 10, 26];

		screenctx.strokeText(...tpstxt);
		screenctx.fillText(...tpstxt);
	}
	
	screenctx.fillStyle = `hwb(${Math.floor(lerp(0, 120, clamp(tpsAccurate / (tps ? tps : 100), 0, 1)))} 0% 0%)`
	{ //actual TPS text
		let atpstxt = ["(Actual: " + Math.floor(tpsAccurate*10)/10 + ")", 8, 50];

		screenctx.strokeText(...atpstxt);
		screenctx.fillText(...atpstxt);
	}

	screenctx.fillStyle = "#000000";
	screenctx.strokeStyle = "#ffffff";
	{ //cursor
		screenctx.beginPath();
		screenctx.arc(x, y, 6, 0, 2 * Math.PI);
		screenctx.fill();
		screenctx.stroke();
	}


	requestAnimationFrame(draw);
}

createImageBitmap(screen).then((img)=>{
	frame=img
	draw();
	getInfo();
});
