function drawLine(x1, y1, x2, y2) {
	screenctx.moveTo(x1, y1);
	screenctx.lineTo(x2, y2);
}

function drawTextWithOutline(txt, x, y, maxWidth) {
	screenctx.fillText(txt,x, y, maxWidth);
}

function fillTriangle(x1, y1, x2, y2, x3, y3) {
	screenctx.beginPath();
	screenctx.moveTo(x1, y1);
	screenctx.lineTo(x2, y2);
	screenctx.lineTo(x3, y3);
	screenctx.closePath();
	screenctx.fill();
	screenctx.stroke();
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

function sign(v){
	return v < 0 ? -1 : 0;
}

function clamp(val, min, max) {
	return (val <= max ? (val >= min ? val : min) : max);
}

function place(arr){
	for(let i = 0; i < arr.length; i++)
		setCell(arr[i][0], arr[i][1], 1);
}

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

function RLE(str){
	//TODO
}

function attemptEditGrid() {
	if(draggingmouse && mbutton!=-1 && mbutton!=1) {
		let xTmp = (x - xOff)/px, yTmp = (y - yOff)/px;
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
