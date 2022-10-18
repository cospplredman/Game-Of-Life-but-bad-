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
		setTps(1);
		break;
	case "ArrowDown":
		tps -= 1;
		tps = tps < 0 ? 0 : tps;
		setTps(-1);
		break;
	case "Space":
		setPause(!pause);
		pause = !pause
		break;
	case "KeyG":
		grid = !grid;
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
	if(panmode)
		xOff -= x - e.clientX, yOff -= y - e.clientY

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
screen.addEventListener("wheel", function(e){ 
	let xs = (xOff - x)/px, ys = (yOff - y)/px;

	zoom += clamp(e.deltaY,-1,1)*scrollSpeed;
	zoom = clamp(zoom, 0.03, 20);
	
	px = (20/zoom);
	xOff = xs * px + x;
	yOff = ys * px + y;
});
