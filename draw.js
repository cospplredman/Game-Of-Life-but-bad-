function draw(){
	{ //clear
		screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	}

	{ //cells
		let sc = px*2**(vp[4]-vd);
		screenctx.translate(xOff + vp[0]*sc, yOff + vp[1]*sc);
		screenctx.scale(sc, sc);
		screenctx.imageSmoothingEnabled = false;
		screenctx.drawImage(frame, 0, 0, frame.width, frame.height);
		screenctx.setTransform(1, 0, 0, 1, 0 ,0);
	}

	screenctx.fillStyle = "#999999";
	{ //highlighted cell
        	screenctx.fillRect(
			Math.floor((x - xOff)/px)*px + xOff, 
			Math.floor((y - yOff)/px)*px + yOff,
			px,px
		);
	}

	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#222222";
	screenctx.lineWidth = px/50;
	if(grid){ //grid
		drawGrid();
	}


	screenctx.lineWidth = 1;
	if(pause){ //pause state symbol
		screenctx.beginPath();
		screenctx.rect(screenctx.canvas.width - 32, 10, 24, 64);
		screenctx.rect(screenctx.canvas.width - 64, 10, 24, 64);
		screenctx.stroke();
		screenctx.fill();
	}

	screenctx.font = "24px Courier New";
	{ //TPS text
		let tpstxt = [(tps ? "TPS: " + tps : "Unlimited"), 10, 26];

		screenctx.strokeText(...tpstxt);
		screenctx.fillText(...tpstxt);
	}
	
	screenctx.fillStyle = `hwb(${Math.floor(lerp(0, 120, clamp(tpsAccurate / (tps ? tps : 100), 0, 1)))} 0% 0%)`
	{ //actual TPS text
		let atpstxt = ["(Actual: " + Math.floor(tpsAccurate*10)/10 + ")", 8, 50];

		screenctx.strokeText(...atpstxt);
		screenctx.fillText(...atpstxt);
	}

	screenctx.fillStyle = "#000000";
	screenctx.strokeStyle = "#ffffff";
	{ //cursor
		screenctx.beginPath();
		screenctx.arc(x, y, 6, 0, 2 * Math.PI);
		screenctx.fill();
		screenctx.stroke();
	}


	requestAnimationFrame(draw);
}
