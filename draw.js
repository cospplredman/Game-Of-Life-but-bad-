function drawLine(x1,y1,x2,y2) {
	screenctx.moveTo(x1+0.5,y1+0.5);
	screenctx.lineTo(x2+0.5,y2+0.5);
}
function drawTextWithOutline(txt,x,y,maxWidth) {
	screenctx.fillText(txt,x+0.5, y+0.5, maxWidth);
	screenctx.strokeText(txt,x+0.5, y+0.5, maxWidth);
}
function fillTriangle(x1, y1, x2, y2, x3, y3) {
	screenctx.beginPath();
	screenctx.moveTo(x1+0.5,y1+0.5);
	screenctx.lineTo(x2+0.5,y2+0.5);
	screenctx.lineTo(x3+0.5,y3+0.5);
	screenctx.closePath();
	screenctx.fill();
	screenctx.stroke();
}
function drawGrid(){
	screenctx.strokeStyle = "#222222";
	screenctx.lineWidth=2;
	screenctx.beginPath();
	for(let dimPos = 0; dimPos < screenctx.canvas.width + px; dimPos+=px)
		drawLine(dimPos+(xOff%px),0,dimPos+(xOff%px),screenctx.canvas.height);
	
	for(let dimPos = 0;dimPos < screenctx.canvas.height + px; dimPos+=px)
		drawLine(0,dimPos+(yOff%px),screenctx.canvas.width,dimPos+(yOff%px));
	
	screenctx.stroke();
}
function loop(){
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	if(grid)
		drawGrid();
	
	if(pause && !lastpausestate)
		clearInterval(updateInterval);
	else if(!pause && lastpausestate)
		updateInterval = setInterval(update,1000/tps);
	lastpausestate=pause;
	
	if(zoom != oldZoom) {
		//got bored so i fixed zoom
		let tmp = [(xOff - (screenctx.canvas.width/ 2))/px, (yOff - (screenctx.canvas.height/2))/px]
		oldZoom = lerp(oldZoom,zoom,0.1);
		px = 20/oldZoom;
		xOff = tmp[0] * px + (screenctx.canvas.width/ 2)
		yOff = tmp[1] * px + (screenctx.canvas.height/2)
	}
	screenctx.fillStyle = "#ffffff";
	for(let i = 0; i != alive.length; i++){
		let x = (alive[i][0]*px), y = (alive[i][1]*px);
		if(x >= -xOff-px && x <= screenctx.canvas.width - xOff && y >= -yOff-px && y <= screenctx.canvas.height - yOff)
			screenctx.fillRect(x + xOff, y + yOff,px,px);
	}
	
	screenctx.fillStyle = "#999999";
	if(!panmode) 
		xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
	else
		xOff = xOffTmp - (xTmp - x), yOff = yOffTmp - (yTmp - y);
	
	screenctx.fillRect(x - ((x - xOff) % px), y - ((y - yOff) % px),px,px);
	
	
	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#000000";
	screenctx.lineWidth=0.5;
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
