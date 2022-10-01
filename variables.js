// Canvas & outer html
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d");

// Grid
let xOff = 0, yOff = 0,
    xOffTmp = 0, yOffTmp = 0,

    px = 20,

    x = 0, y = 0,
    xTmp = 0, yTmp = 0,

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

let lastpausestate = true;
let pause = true;
