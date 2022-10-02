function qtree(nodes, wpn){
	tree = Object.create(null);
	Object.setPrototypeOf(tree,qtree.prototype);
	tree.wpn = wpn
	for(let i = 0; i != 4; i++)
		tree[i] = nodes[i];

	tree.next = undefined;
	return tree;
}

qtree.prototype.toString = function(){
	q = "";
	for(let i = 0; i != 4; i++)
		q += this[i]?.toString();
	
	let e = q;

	return e;
	
}

qtree.prototype.get = function(x, y){
	
	if(x < 0 || y < 0 || x >= this.wpn*2 || y >= this.wpn*2)
		return 0;
	
	let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
	if(this.wpn == 1)
		return this[i];
	return this[i].get(x % this.wpn, y % this.wpn);
}

qtree.prototype.set = function(x, y, v){
	let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);

	if(this.wpn == 1)
		this[i] = v;
	else
		this[i].set(x % this.wpn, y % this.wpn, v);
	return this;
}

qtree.prototype.copy = function(){
	let nodes = Array(4);
	for(let i = 0; i != 4; i++)
		if(this[i] instanceof qtree)
			nodes[i] = this[i].copy();
		else
			nodes[i] = this[i];

	return qtree(nodes, this.wpn);
}

qtree.prototype.memoize = function(memo = {}){
	for(let i = 0; i != 4; i++)
		if(this[i] instanceof qtree)
			this[i] = this[i].memoize(memo);

	if(this.toString().length > 16)
		return this;
	return memo[this] ?? (memo[this] = this);
}

qtree.prototype.check = function(x, y){
	let sum = 	this.get(x-1,y-1) + this.get(x,y-1) + this.get(x+1,y-1) +
			this.get(x-1,y) + this.get(x+1, y) +
			this.get(x-1,y+1) + this.get(x,y+1) + this.get(x+1,y+1);

	if(sum == 3 || (sum == 2 && this.get(x, y)))
		return 1;

	return 0;
}
	
qtree.prototype.solve = function(memo = {}){
	if(this.next)
		return this.next;

	tree = qtree([
		this[0]?.solve?.(memo)?.copy() ?? 0,
		this[1]?.solve?.(memo)?.copy() ?? 0,
		this[2]?.solve?.(memo)?.copy() ?? 0,
		this[3]?.solve?.(memo)?.copy() ?? 0
	], this.wpn);

	for(let y = 1; y != this.wpn*2 - 1; y++){
		let x = this.wpn - 1;
		let xl = this.wpn + 1;
		if(y >= x && y < xl){
			x = 1;
			xl = this.wpn*2 - 1;
		}
		for(;x!=xl;x++){
			if(this.check(x, y))
				tree = tree.set(x, y, 1);
		}
	}

	this.next = tree.memoize(memo);
	Object.freeze(this);
	return this.next;
}

function etree(wpn){
	if(wpn == 1)
		return qtree([0,0,0,0], wpn);
	let a = etree(wpn/2);
	return qtree([a,a,a,a], wpn);
	
}

let xd = 0;
let yd = 0;
let qt = new qtree([0, 0, 0, 0], 1);
let memo = {}

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
		let a = etree(qt.wpn);
		a = a.memoize(memo);
		let nodes = [a,a,a,a];
		nodes[i] = qt;

		let k = qtree(nodes, qt.wpn*2)
		qt = k;
	}

	qt = qt.copy()
	qt.set(x - xd, y - yd, v);
	qt = qt.memoize(memo);	
}

function update(){
	let startTime = new Date().getTime();

	qt = qt.solve(memo);

	let endTime = new Date().getTime();
	tpsAccurate = 1000 / (endTime - startTime);

	if(tps != 0)
		tpsAccurate = Math.min(tps, tpsAccurate);
}
