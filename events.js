// Outer / meta
screen.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);
window.addEventListener("resize", function(e) {
	screenctx.canvas.width = window.innerWidth;
	screenctx.canvas.height = window.innerHeight;
});
// Interaction
function attemptEditGrid() {
	if(draggingmouse && mbutton!=-1 && mbutton!=1) {
		let xTmp = Math.round(((x - xOff) - ((x - xOff) % px))/px), yTmp = Math.round(((y - yOff) - ((y - yOff) % px))/px);
		let n = true;
		let acc = [];
		if(mbutton==2) {
			alive.forEach((k, i)=>{
				if(n && k[0] == xTmp && k[1] == yTmp){
					acc = [...alive.slice(0,i), ...alive.slice(i+1,alive.length)];
				}
			});
			if(acc.length!=0) {
				alive = acc;
			}
		} else if(mbutton==0) {
			n=true;
			alive.forEach((k, i)=>{
				if(n && k[0] == xTmp && k[1] == yTmp){
					n = false;
				}
			});
			if(n) alive.push([xTmp,yTmp]);
		}
	} else if(mbutton==-1) {
		draggingmouse=false;
	}
}
function updateTPS(newTPS) {
	tps=newTPS >= 0 ? newTPS : 0;
	if(!pause) {
		clearInterval(updateInterval);
		updateInterval=setInterval(update,1000/tps);
	}
}
// Keyboard
window.addEventListener("keydown", function(e) {
	switch(e.code){
	case "ArrowUp":
		updateTPS(tps+1);
		break;
	case "ArrowDown":
		updateTPS(tps-1);
		break;
	case "Space":
		pause = !pause;
		break;
	case "KeyG":
		grid = !grid;
		break;
	case "F1":
		options = !options;
		break;
	}
});
// Mouse
screen.addEventListener("mousedown", function(e) {
  switch (e.button) {
    case 0:
	  draggingmouse=true;
	  if(mbutton!=0&&mbutton!=-1) mbutton=-1;
	  mbutton=0;
      break;
	case 1:
	  draggingmouse=true;
	  panmode = true;
	  if(mbutton!=1&&mbutton!=-1) mbutton=-1;
	  mbutton=1;
      break;
    case 2:
	  draggingmouse=true;
	  if(mbutton!=2&&mbutton!=-1) mbutton=-1;
	  mbutton=2;
      break;
  }
  attemptEditGrid();

});
screen.addEventListener("mousemove",function(e) {
	x = e.clientX, y = e.clientY;
	attemptEditGrid();
});
screen.addEventListener("mouseup", function(e) {
  switch (e.button) {
    case 0:
	  draggingmouse=false;
	  mbutton=-1;
      break;
	case 1:
	  panmode=false;
	  draggingmouse=false;
	  mbutton=-1;
	  break;
    case 2:
	  draggingmouse=false;
	  mbutton=-1;
      break;
  }
});
screen.addEventListener("wheel", function(e) {
	zoom += e.deltaY*scrollSpeed;
	zoom = (zoom < 0.03 ? 0.03 : (zoom > 20 ? 20 : zoom));
});