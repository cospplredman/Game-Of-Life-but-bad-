// Canvas & outer html
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d");
let options = false;
let sidebarContainerUnopened = document.getElementById("sidebar-container-unopened");
let sidebarArrow = document.getElementById("sidebar-arrow");
let sidebarEdge = document.getElementById("sidebar-edge");
let sidebarContainerOpened = document.getElementById("sidebar-container-opened");
let sidebarLeftPercent = -15;
// Grid
let xOff = 0, yOff = 0,
    xOffTmp = 0, yOffTmp = 0,
    px = 20,
    tx = 0, ty = 0,
    x = 0, y = 0,
	xTmp = 0, yTmp = 0,
	xOffZoom = 0, yOffZoom = 0,
    grid = true;
// Cells
let alive = [];
let nxt = [];
// Mouse
let draggingmouse=false;
let mbutton=-1;
let panmode = false;
let scrollSpeed = 0.15;
let oldZoom = 1;
let zoom = 1;
// Update loop
let updateInterval = null
let tps = 10;
let tpsAccurate = 10;
let pause = true;
let lastpausestate = true;
