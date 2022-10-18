async function lop(){
	alive = await getCells(
		-Math.floor(xOff/px), 
		-Math.floor(yOff/px),
		Math.floor(screenctx.canvas.width/px + 1),
		Math.floor(screenctx.canvas.height/px + 1)
	);

	tpsAccurate = await getTps();
	requestAnimationFrame(lop);
}

function loop(){
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	screenctx.fillStyle = "#ffffff";
	
	{ //cells
		for(let i in alive)
			screenctx.fillRect(alive[i][0]*px + xOff, alive[i][1]*px + yOff, px, px);
	}

	if(grid){ //grid
		screenctx.strokeStyle = "#222222";
		screenctx.lineWidth = px/50;
		drawGrid();
		screenctx.strokeStyle = "#ffffff";
		screenctx.lineWidth = 1;
	}

	if(!pause) //pause state symbol
		fillTriangle(screenctx.canvas.width - 64, 10, screenctx.canvas.width-64, 74, screenctx.canvas.width-8, 42);
	else {
		screenctx.beginPath();
		screenctx.rect(screenctx.canvas.width - 32, 10, 24, 64);
		screenctx.rect(screenctx.canvas.width - 64, 10, 24, 64);
		screenctx.fill();
		screenctx.stroke();
	}

	{ //TPS text
		screenctx.strokeStyle = "#000000";
		screenctx.lineWidth=1;
		screenctx.font = "24px Courier New";
		drawTextWithOutline((tps ? "TPS: " + tps : "Unlimited"),screenctx.canvas.width - 192, 26, 128);
		screenctx.fillStyle = `hwb(${Math.floor(lerp(0, 120, clamp(tpsAccurate / (tps ? tps : 300) , 0, 1)))} 0% 0%)`
		drawTextWithOutline("(Actual: " + Math.floor(tpsAccurate * 10) / 10 + ")",screenctx.canvas.width - 256, 50, 192);
	}

	{ //cursor
		screenctx.fillStyle = "#999999";
        	screenctx.fillRect(Math.floor((x - xOff)/px)*px + xOff, Math.floor((y - yOff)/px)*px + yOff,px,px);
		screenctx.beginPath();
		screenctx.fillStyle = "#000000";
		screenctx.strokeStyle = "#ffffff";
		screenctx.arc(x, y, 6, 0, 2 * Math.PI);
		screenctx.fill();
		screenctx.stroke();
	}	

	requestAnimationFrame(loop);
}
