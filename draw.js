function loop(){
         if(!panmode) 
                 xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
         else
                 xOff = xOffTmp - (xTmp - x), yOff = yOffTmp - (yTmp - y);
	
	if(zoom != oldZoom) {
		let tmp = [(xOff - (screenctx.canvas.width/ 2))/px, (yOff - (screenctx.canvas.height/2))/px]
		oldZoom = lerp(oldZoom,zoom,0.5);
		if(Math.abs(oldZoom - zoom) < 0.001)
			oldZoom = zoom;

		px = Math.ceil(20/oldZoom) + 1;
		xOff = Math.floor(tmp[0] * px + (screenctx.canvas.width/ 2))
		yOff = Math.floor(tmp[1] * px + (screenctx.canvas.height/2))
                
		xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
	}

 
	updateSidebar();
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
        
	screenctx.fillStyle = "#999999";
        screenctx.fillRect(x - ((x - xOff) % px), y - ((y - yOff) % px),px,px);
	
	if(pause && !lastpausestate)
		clearInterval(updateInterval);
	else if(!pause && lastpausestate)
		updateInterval = setInterval(update,1000/tps);
	lastpausestate=pause;
	

	screenctx.fillStyle = "#ffffff";
	for(let i = 0; i != alive.length; i++){
		let x = (alive[i][0]*px), y = (alive[i][1]*px);
		if(x >= -xOff-px && x <= screenctx.canvas.width - xOff && y >= -yOff-px && y <= screenctx.canvas.height - yOff)
			screenctx.fillRect(x + xOff, y + yOff,px,px);
	}
	
	if(grid)
		drawGrid();
	
	screenctx.fillStyle = "#111111";
	screenctx.globalAlpha = 0.3;
	screenctx.fillRect(screenctx.canvas.width-265,8,192,64);
	screenctx.globalAlpha = 1.0;
	
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
	
	screenctx.beginPath();
	screenctx.fillStyle = "#000000";
	screenctx.strokeStyle = "#ffffff";
	screenctx.lineWidth=2;
	screenctx.arc(x, y, 6, 0, 2 * Math.PI);
	screenctx.fill();
	screenctx.stroke();
	
	requestAnimationFrame(loop);
}
