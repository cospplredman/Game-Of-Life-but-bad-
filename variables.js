// Canvas
let screen = document.getElementById("screen");
let screenctx = screen.getContext("2d", {alpha: false});
screenctx.canvas.width = window.innerWidth;
screenctx.canvas.height = window.innerHeight;

//current frame
let loddist = 1;
let zp = 0, vp = 0;
let frame;
createImageBitmap(screen).then((img)=>{frame=img});

/*
 * View related variables.
 *
 * px is the width in pixels of every cell
 * x and y are the mouse x and y coordinates in pixels
 * xOff and yOff are basically the x and y coordinates of the camera in pixels
 * 
 * zoom affects px
 * vd is basically which LOD to display
 * */
let xOff = 0, yOff = 0,
    px = 20,
    x = 0, y = 0,
    grid = true, zoom = 1, vd = 0;

// Mouse
let mbutton=0;
let panmode = false;
let scrollSpeed = 0.15;

//worker
let updater = new Worker("cpp/main.js");

//worker message cache
let glob = {ev:[], v:[]};
let tpsAccurate = 0;
let alive = [];
let tps = 10;
let pause = true;
