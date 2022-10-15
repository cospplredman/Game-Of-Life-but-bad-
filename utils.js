function drawLine(x1,y1,x2,y2) {
	screenctx.moveTo(x1+0.5,y1+0.5);
	screenctx.lineTo(x2+0.5,y2+0.5);
}
function drawTextWithOutline(txt,x,y,maxWidth) {
	screenctx.fillText(txt,x+0.5, y+0.5, maxWidth);
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
	screenctx.lineWidth=px/50;
	screenctx.beginPath();
	for(let dimPos = 0; dimPos < screenctx.canvas.width + px; dimPos+=px)
		drawLine(dimPos+(xOff%px),0,dimPos+(xOff%px),screenctx.canvas.height);
	
	for(let dimPos = 0;dimPos < screenctx.canvas.height + px; dimPos+=px)
		drawLine(0,dimPos+(yOff%px),screenctx.canvas.width,dimPos+(yOff%px));
	
	screenctx.stroke();
}
function lerp(start, end, t) {
	return (1-t)*start+t*end;
}
function clamp(val, min, max) {
	return (val <= max ? (val >= min ? val : min) : max);
}
function updateTPS(newTPS) {
	tps=newTPS >= 0 ? newTPS : 0;
	if(!pause) {
		clearInterval(updateInterval);
		updateInterval=setInterval(update,1000/tps);
	}
}
function attemptEditGrid() {
	if(draggingmouse && mbutton!=-1 && mbutton!=1) {
		let xTmp = Math.floor((x - xOff)/px), yTmp = Math.floor((y - yOff)/px);
		switch(mbutton){
			case 2:
				setCell(xTmp, yTmp, 0);
			break;
			case 0:
				setCell(xTmp, yTmp, 1);
			break;
		}
	}
}
