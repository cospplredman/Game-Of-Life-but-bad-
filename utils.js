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
	screenctx.lineWidth=2;
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
function updateSidebar() {
	let sidebarContainerOpenedPercentMax = 15;
	let lerpDirection = options?0:-sidebarContainerOpenedPercentMax;
	sidebarLeftPercent = lerp(sidebarLeftPercent,lerpDirection,0.1);
	sidebarContainerOpened.style = "left:" + sidebarLeftPercent + "%";
	sidebarContainerUnopened.style = "left:" + (sidebarLeftPercent+sidebarContainerOpenedPercentMax) + "%";
	sidebarArrow.style = "left:" + (sidebarLeftPercent+sidebarContainerOpenedPercentMax) + "%";
	sidebarEdge.style = "left:" + (window.innerWidth * (sidebarLeftPercent + sidebarContainerOpenedPercentMax)/100 + 25) + "px";
}

//for future reference the copy format is an array with .h and .w properties
//the array contains cells
function copy(x,y,w,h){
	let ret = [];
	ret.w = w, ret.h = h;
	for(let i = 0; i != alive.length; i++)
		if(alive[i][0] >= x && alive[i][0] <= (x + w) && alive[i][1] >= y && alive[i][1] <= (y + h))
			ret.push([alive[i][0] - x, alive[i][1] - y]);
	return ret;
}

//rotates by a rotation matrix
//note it is technically possible to rotate by things that arent multiples of 90
//and it would still work
function rotate(t,f = [[0,1],[-1,0]]){
	let k = t.w*f[0][0] + t.h*f[0][1], j = t.w*f[1][0] + t.h*f[1][1];
	t.w = k, t.h = j;
	for(let i = 0; i != t.length; i++)
		t[i] = [t[i][0]*f[0][0] + t[i][1]*f[0][1], t[i][0]*f[1][0] + t[i][1]*f[1][1]];
	return t;
}

function paste(x,y,t){
	let nxt = [];
	for(let i = 0; i != t.length; i++)
		nxt.push([t[i][0] + x, t[i][1] + y]);
	for(let i = 0; i != alive.length; i++)
		if(alive[i][0] < x && alive[i][0] > (x + t.w) || alive[i][1] < y || alive[i][1] > (y + t.h))
			nxt.push(alive[i]);
	alive = nxt;
}

