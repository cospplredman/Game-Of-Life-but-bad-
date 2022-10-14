function loop(){
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
        
	if(!panmode) //pan 
                 xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
        else
                 xOff = xOffTmp - (xTmp - x), yOff = yOffTmp - (yTmp - y);
	
	if(zoom != oldZoom) { //zoom
		let xs = (xOff - (screenctx.canvas.width/ 2))/px, ys = (yOff - (screenctx.canvas.height/2))/px;
		oldZoom = lerp(oldZoom,zoom,0.5);
		if(Math.abs(oldZoom - zoom) < 0.001)
			oldZoom = zoom;

		px = Math.ceil(20/oldZoom) + 1;
		xOff = Math.floor(xs * px + (screenctx.canvas.width/ 2))
		yOff = Math.floor(ys * px + (screenctx.canvas.height/2))
                
		xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
	}

	
	screenctx.fillStyle = "#ff0000";
	screenctx.fillRect(xd*px + xOff, yd*px + yOff, qt.wpn*2*px, qt.wpn*2*px)
	
	screenctx.fillStyle = "#ffffff";
	for(let x = -xOff-px; x <= screenctx.canvas.width - xOff; x += px)
		for(let y = -yOff-px; y <= screenctx.canvas.height - yOff; y += px){
			let xp = Math.floor(x/px), yp = Math.floor(y/px);
			if(!(xp - xd < 0 || xp - xd >= 2*qt.wpn || yp - yd < 0 || yp - yd >= 2*qt.wpn))
				if(qt.get(xp - xd, yp - yd))
					screenctx.fillRect(xp*px + xOff, yp*px + yOff, px, px);
		}
	
	if(grid)
		drawGrid();
	
	
	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#000000";
	screenctx.lineWidth=1;
	screenctx.font = "24px Courier New";

	if(tps != 0) {
		drawTextWithOutline("TPS: " + tps,screenctx.canvas.width - 192, 26, 128);
		if(tpsAccurate / tps > 0.8)
			screenctx.fillStyle = "#00ff00";
		else if(tpsAccurate / tps > 0.4)
			screenctx.fillStyle = "#ffff00";
		else 
			screenctx.fillStyle = "#ff0000";
		drawTextWithOutline("(Actual: " + Math.floor(tpsAccurate * 10) / 10 + ")",screenctx.canvas.width - 256, 50, 192);
	} else {
		drawTextWithOutline("Unlimited",screenctx.canvas.width - 192, 26, 128);
		if(tpsAccurate >= 300)
			screenctx.fillStyle = "#00ff00";
		else if(tpsAccurate >= 50) 
			screenctx.fillStyle = "#ffff00";
		else 
			screenctx.fillStyle = "#ff0000";
		drawTextWithOutline("(Actual: " + Math.floor(tpsAccurate * 10) / 10 + ")",screenctx.canvas.width - 256, 50, 192);
	}

	screenctx.fillStyle = "#ffffff";

	if(!pause)
		fillTriangle(screenctx.canvas.width - 64, 10, screenctx.canvas.width-64, 74, screenctx.canvas.width-8, 42);
	else {
		screenctx.beginPath();
		screenctx.rect(screenctx.canvas.width - 32, 10, 24, 64);
		screenctx.rect(screenctx.canvas.width - 64, 10, 24, 64);
		screenctx.fill();
		screenctx.stroke();
	}

	if(pause && !lastpausestate)
		clearInterval(updateInterval);
	else if(!pause && lastpausestate)
		updateInterval = setInterval(update,1000/tps);
	lastpausestate=pause;


	{ //cursor
		screenctx.fillStyle = "#999999";
        	screenctx.fillRect(x - ((x - xOff) % px), y - ((y - yOff) % px),px,px);
		
		screenctx.beginPath();
		screenctx.fillStyle = "#000000";
		screenctx.strokeStyle = "#ffffff";
		screenctx.lineWidth=2;
		screenctx.arc(x, y, 6, 0, 2 * Math.PI);
		screenctx.fill();
		screenctx.stroke();
	}	

	requestAnimationFrame(loop);
}
