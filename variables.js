// Canvas & outer html
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d", {alpha: false});

let zp = 20, vp = 0;
let cellPath = new Path2D();
screenctx.canvas.width = window.innerWidth;
screenctx.canvas.height = window.innerHeight;


// Grid
let xOff = 0, yOff = 0,
    px = 20,
    x = 0, y = 0,
    grid = true, zoom = 1, vd = 0;

// Mouse
let draggingmouse=false;
let mbutton=-1;
let panmode = false;
let scrollSpeed = 0.15;

//worker cache
let tpsAccurate = 0;
let alive = [];
let tps = 10;
let pause = true;
