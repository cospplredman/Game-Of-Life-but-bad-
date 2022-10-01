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
		switch(mbutton){
			case 2:
				for(let i = 0; i != alive.length; i++)
					if(alive[i][0] == xTmp && alive[i][1] == yTmp){
						alive = alive.slice(0,i).concat(alive.slice(i+1,alive.length));
						break;
					}
			break;
			case 0:
				let n=true;
				for(let i = 0; i != alive.length; i++)
					if(n && alive[i][0] == xTmp && alive[i][1] == yTmp)
						n = false;
				if(n) alive.push([xTmp,yTmp]);
			break;
			case -1:
				draggingmouse=false;
		}
	}
}
function updateTPS(newTPS) {
	tps=newTPS >= 0 ? newTPS : 0;
	if(!pause) {
		clearInterval(updateInterval);
		updateInterval=setInterval(update,1000/tps);
	}
}
function openSidebar() {
	options=!options;
	if(options) {
		sidebarArrow.className = sidebarArrow.className.replace(/(?:^|\s)right(?!\S)/g , ' left');
	} else {
		sidebarArrow.className = sidebarArrow.className.replace(/(?:^|\s)left(?!\S)/g , ' right');
	}
}
function toggleSidebarDropdown(type) {
	let dropdownicon = document.getElementById("sidebar-dropdown-" + type);
	let isActive = false;
	if(dropdownicon.innerHTML == "▼") {
		dropdownicon.innerHTML="▲";
		isActive = true;
	} else if(dropdownicon.innerHTML == "▲") dropdownicon.innerHTML="▼";
	switch(type) {
	case "ruleset":
		if(isActive) document.getElementById("sidebar-ruleset-states").style="display:block;";
		else document.getElementById("sidebar-ruleset-states").style="display:none;";
		break;
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
	zoom += clamp(e.deltaY,-1,1)*scrollSpeed;
	zoom = clamp(zoom, 0.03, 20)
});
// Meta
sidebarContainerUnopened.addEventListener("mousedown", openSidebar);
sidebarEdge.addEventListener("mousedown", openSidebar);
