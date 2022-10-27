function draw(){
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	
	{ //cells
		screenctx.fillStyle = "#ffffff";
		let scr = new Path2D();
		let sc = vd - vp;
		sc = (px/(2**sc))/zp;
		scr.addPath(cellPath, new DOMMatrix()
			.translate(xOff, yOff)
			.scale(sc, sc)
		);
		screenctx.fill(scr);
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
		screenctx.fillStyle = `hwb(${Math.floor(lerp(0, 120, clamp(tpsAccurate / (tps ? tps : 300), 0, 1)))} 0% 0%)`
		drawTextWithOutline("(Actual: " + tpsAccurate + ")",screenctx.canvas.width - 256, 50, 192);
	}

	{ //cursor
		screenctx.fillStyle = "#999999";
        	screenctx.fillRect(
			Math.floor((x - xOff)/px)*px + xOff, 
			Math.floor((y - yOff)/px)*px + yOff,
			px,px
		);
		screenctx.beginPath();
		screenctx.fillStyle = "#000000";
		screenctx.strokeStyle = "#ffffff";
		screenctx.arc(x, y, 6, 0, 2 * Math.PI);
		screenctx.fill();
		screenctx.stroke();
	}	

	requestAnimationFrame(draw);
}
