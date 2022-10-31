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
screen.addEventListener("mousemove",function(e) {
	if(panmode)
		xOff -= x - e.clientX, yOff -= y - e.clientY
	
	x = e.clientX, y = e.clientY;

	let xTmp = Math.floor((x - xOff)/px), yTmp = Math.floor((y - yOff)/px);
	switch(mbutton){
		case 1:
			setCell(xTmp, yTmp, 1);
		break;
		case 4:
			setCell(xTmp, yTmp, 0);
		break;
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
