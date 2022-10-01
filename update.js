class qtree{
	constructor(nodes, wpn = 1){
		this.nodes = nodes;
		this.wpn = wpn;
		this.next = undefined;
	}

	toString(){

		let q = this.nodes.join("");
		let e = q;
		if(q.length == 64){
			e = "";
			for(let i = 0; i != 8; i++)
				e += String.fromCharCode(Number.parseInt(q.slice(i*8, (i+1) * 8),2));
		}

		return e;
	}

	get(x, y){
		if(x < 0 || y < 0 || x >= this.wpn*2 || y >= this.wpn*2)
			return 0;
		
		let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
		if(this.wpn == 1)
			return this.nodes[i];
		return this.nodes[i].get(x % this.wpn, y % this.wpn);
	}

	set(x, y, v, memo = {}){
		let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
		let c = new qtree([...this.nodes], this.wpn);
		if(c.wpn == 1)
			c.nodes[i] = v;
		else
			c.nodes[i] = c.nodes[i].set(x % c.wpn, y % c.wpn, v, memo);
			
		if(memo[c.toString()])
			c = memo[c.toString()];
		else
			memo[c.toString()] = c;

		return c;
	}

	check(x, y){
		let sum = 	this.get(x-1,y-1) + this.get(x,y-1) + this.get(x+1,y-1) +
			this.get(x-1,y) + this.get(x+1, y) +
			this.get(x-1,y+1) + this.get(x,y+1) + this.get(x+1,y+1);

		if(sum == 3)
			return 1;
		if(sum == 2 && this.get(x, y))
			return 1;

		return 0;
	}

	solve(memo = {}){
		if(this.next)
			return this.next;

		if(this.wpn == 1){
			if(memo["0000"])
				return this.next = memo["0000"];

			memo["0000"] = new qtree([0,0,0,0]);
			return this.next = memo["0000"];
		}

		let tree = new qtree([
			this.nodes[0].solve(memo),
			this.nodes[1].solve(memo),
			this.nodes[2].solve(memo),
			this.nodes[3].solve(memo)
		], this.wpn)

		for(let y = 1; y != this.wpn*2 - 1; y++){
			let x = this.wpn - 1;
			let xl = this.wpn + 1;
			if(y >= x && y < xl){
				x = 1;
				xl = this.wpn*2 - 1;
			}

			for(;x!=xl;x++)
				if(this.check(x, y))
					tree = tree.set(x, y, 1, memo);
		}

		if(memo[tree.toString()])
			tree = memo[tree.toString()];
		else
			memo[tree.toString()] = tree;

		return this.next = tree;
	}
}

let xd = 0;
let yd = 0;
let memo = {"0000": new qtree([0,0,0,0])};
let qt = new qtree([
	memo["0000"],
	memo["0000"],
	memo["0000"],
	memo["0000"]
], 2);
memo[qt.toString()] = qt;

function eqtree(wpn){
	if(wpn == 1){
		if(memo["0000"])
			return memo["0000"];
		return memo["0000"] = new qtree([0,0,0,0]);
	}

	let tree = new qtree([
		eqtree(wpn/2),
		eqtree(wpn/2),
		eqtree(wpn/2),
		eqtree(wpn/2)
	],wpn)

	if(memo[tree.toString()])
		tree = memo[tree.toString()];
	else
		memo[tree.toString()] = tree;

	return tree;
}

function setCell(x, y, v){
	let i = 0
	let grow = false;

	if(x >= qt.wpn*2 + xd || x < xd)
		grow = true;
	if(x < xd){
		xd -= 2*qt.wpn
		i += 1;
	}
	
	if(y >= qt.wpn*2 + yd || y < yd)
		grow = true;
	if(y < yd){
		yd -= 2*qt.wpn
		i += 2;
	}

	if(grow){
		let nodes = [eqtree(qt.wpn), eqtree(qt.wpn), eqtree(qt.wpn), eqtree(qt.wpn)];
		nodes[i] = qt;

		let k = new qtree(nodes, qt.wpn*2)
		if(memo[k.toString()])
			k = memo[k.toString()];
		else
			memo[k.toString()] = k;

		qt = k;
	}

	
	qt = qt.set(x - xd, y - yd, v, memo);
}

function update(){
	let startTime = new Date().getTime();
	
	qt = qt.solve(memo);

	let endTime = new Date().getTime();
	tpsAccurate = 1000 / (endTime - startTime);

	if(tps != 0)
		tpsAccurate = Math.min(tps, tpsAccurate);
}
