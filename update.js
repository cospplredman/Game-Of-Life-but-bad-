function check(c){
	alive[c].t = true;
	let done=[[true,true,true],[true,true,true],[true,true,true]],
	    a = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,1,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	    ];
	
	for(let i = 0; i != alive.length; i++){
		if(i == c) continue;
		let x = alive[i][0] - alive[c][0] , y = alive[i][1] - alive[c][1];
		if(x >= -2 && x <= 2 && y >= -2 && y <= 2){
			a[x + 2][y + 2] = 1;
			if(alive[i].t){
				let tj = x < 0 ? -1 : -1 + x, tw = y < 0 ? -1 : -1 + y
				for(let j = x < 0 ? 2 + x : 2; j != tj; j--)
					for(let w = y < 0 ? 2 + y : 2; w != tw; w--)
						done[j][w] = false;
			}
		}
	}
	
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
	for(let i = 0; i != 3; i++)
		for(let j = 0; j != 3; j++){
			if(done[i][j] && ((f[i][j] - a[1 + i][1 + j]) == 3 || (a[1 + i][1 + j] == 1 && f[i][j] == 3))){
				nxt.push([alive[c][0] - 1 + i, alive[c][1] - 1 + j]);
			}
		}
}
function update(){
	let startTime = new Date().getTime();
	nxt = []
	for(let i = 0; i != alive.length; i++)
		check(i);
	alive = nxt;
	tpsAccurate = 1000 / (new Date().getTime() - startTime);
	tpsAccurate = (tpsAccurate > tps && tps != 0 ? tps : tpsAccurate);
}