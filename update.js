let rule = [[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

function setup(){
	let checks = []
	for(let i = 0; i != alive.length; i++)
		checks.push([
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0]
	    	]);
	for(let i = 0; i != alive.length; i++){
		for(let j = i + 1; j < alive.length; j++){
			let x = alive[j][0] - alive[i][0] , y = alive[j][1] - alive[i][1];
			if(x >= -2 && x <= 2 && y >= -2 && y <= 2)
				checks[i][x+2][y+2]=1, checks[j][alive[i][0]-alive[j][0]+2][alive[i][1]-alive[j][1]+2] = 9;
		}
		let a = checks[i];
		let l = [
			[
				a[0][0] + a[0][1] + a[0][2],
				a[0][1] + a[0][2] + a[0][3],
				a[0][2] + a[0][3] + a[0][4]
			],
			[
				a[1][0] + a[1][1] + a[1][2],
				a[1][1] + a[1][2] + a[1][3],
				a[1][2] + a[1][3] + a[1][4]
			],
			[
				a[2][0] + a[2][1] + a[2][2],
				a[2][1] + a[2][2] + a[2][3],
				a[2][2] + a[2][3] + a[2][4]
			],
			[
				a[3][0] + a[3][1] + a[3][2],
				a[3][1] + a[3][2] + a[3][3],
				a[3][2] + a[3][3] + a[3][4]
			],
			[
				a[4][0] + a[4][1] + a[4][2],
				a[4][1] + a[4][2] + a[4][3],
				a[4][2] + a[4][3] + a[4][4]
			]
		],
	   	 f = [
			[
				l[0][0] + l[1][0] + l[2][0],
				l[0][1] + l[1][1] + l[2][1],
				l[0][2] + l[1][2] + l[2][2]
			],
			[
				l[1][0] + l[2][0] + l[3][0],
				l[1][1] + l[2][1] + l[3][1],
				l[1][2] + l[2][2] + l[3][2]
			],
			[
				l[2][0] + l[3][0] + l[4][0],
				l[2][1] + l[3][1] + l[4][1],
				l[2][2] + l[3][2] + l[4][2]
			]
		]
		for(let q = 0; q != 3; q++)
			for(let j = 0; j != 3; j++)
				if(a[1+q][1+j] != 9 && rule[a[1+q][1+j]][f[q][j] - a[1+q][1+j]])
					nxt.push([alive[i][0] - 1 + q, alive[i][1] - 1 + j]);
	}
}

function update(){
	let startTime = new Date().getTime();
	nxt = [];
	setup();
	alive = nxt;
	tpsAccurate = 1000 / (new Date().getTime() - startTime);
	tpsAccurate = (tpsAccurate > tps && tps != 0 ? tps : tpsAccurate);
}
