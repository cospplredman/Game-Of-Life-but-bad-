function qtree(nodes, wpn, hash = undefined){
	this.wpn = wpn
	for(let i = 0; i != 4; i++)
		this[i] = nodes[i];

	this.next = undefined;
	this.hash = hash;
}

qtree.prototype.equals = function(a){
	if(a.wpn != this.wpn)
		return false;

	if(this.toString() != a.toString())
		return false;

	for(let i = 0; i != 4; i++)
		if(a[i] instanceof qtree){
			if(!this[i].equals(a[i]))
				return false;
		}else if(!a[i] == this[i])
			return false;
	return true;
}

qtree.prototype.toString = function(){
	if(this.hash)
		return this.hash;

	let q = 0;
	let mul = [1, 11, 101, 1007];
	
	for(let i = 0; i != 4; i++)
		if(this[i] instanceof qtree)
			q += mul[i] * this[i].toString();
		else
			q += mul[i] * this[i];

	this.hash = q;
	return q;
}

qtree.prototype.print = function(){
	let l = "";
	for(let i = 0; i != this.wpn*2; i++){
		for(let j = 0; j != this.wpn*2; j++)
			l += " " + this.get(j, i);
		l += "\n";
	}
	console.log(l);
}

qtree.prototype.get = function(x, y){
	let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
	if(this.wpn == 1)
		return this[i];

	return this[i].get(x % this.wpn, y % this.wpn);
}

qtree.prototype.set = function(x, y, v){
	let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
	
	let nodes = [this[0], this[1], this[2], this[3]];
	let nt = new qtree(nodes, this.wpn);

	if(nt.wpn == 1)
		nt[i] = v;
	else
		nt[i] = nt[i].set(x % this.wpn, y % this.wpn, v);
	
	return nt;
}

qtree.prototype.setn = function(i, n){
	let nd = [this[0], this[1], this[2], this[3]];
	nd[i] = n;
	return new qtree(nd, this.wpn);
}

qtree.prototype.memoize = function(memo = {}){
	let hash = this.toString();
	if(memo[hash]){
		let arr = memo[hash];
		for(let el in arr)
			if(arr[el].equals(this)){
				delete this;
				return arr[el];
			}
	}

	let arr = memo[hash] ??= [];
	for(let i = 0; i != 4; i++)
		if(this[i] instanceof qtree)
			this[i] = this[i].memoize(memo);

	arr.push(this);
	return this;
}

qtree.prototype.check = function(x, y){
	let sum = 	this.get(x-1,y-1) + this.get(x,y-1) + this.get(x+1,y-1) +
			this.get(x-1,y) + this.get(x+1, y) +
			this.get(x-1,y+1) + this.get(x,y+1) + this.get(x+1,y+1);

	if(sum == 3 || (sum == 2 && this.get(x, y)))
		return 1;

	return 0;
}

qtree.prototype.inner = function(){
	return new qtree([this[0][3], this[1][2], this[2][1], this[3][0]], this.wpn/2);
}

qtree.prototype.solve2 = function(memo = {}){
	if(this.next)
		return this.next;

	let nodes = [0, 0, 0, 0];
	for(i = 0; i != 4; i++)
		nodes[i] = this.check(1 + (i&1), 1 + ((i&2) >> 1));

	this.next = new qtree(nodes, 1).memoize(memo);
	Object.freeze(this);
	return this.next;
}

qtree.prototype.solve = function(step = 0, memo = {}){
	if(this.next && (step >= this.wpn/2 || step == 0))
		return this.next;

	if(this.wpn == 2)
		return this.solve2(memo);


	let op = "inner";
	if(step >= this.wpn/2 || step == 0)
		op = "solve";

	let subslv = [
		this[0][op](step, memo), 
		new qtree([this[0][1], this[1][0], this[0][3], this[1][2]], this.wpn/2).memoize(memo)[op](step, memo), 
		this[1][op](step, memo),

		new qtree([this[0][2], this[0][3], this[2][0], this[2][1]], this.wpn/2).memoize(memo)[op](step, memo), 
		this.inner().memoize(memo)[op](step, memo),
		new qtree([this[1][2], this[1][3], this[3][0], this[3][1]], this.wpn/2).memoize(memo)[op](step, memo),

		this[2][op](step, memo), 
		new qtree([this[2][1], this[3][0], this[2][3], this[3][2]], this.wpn/2).memoize(memo)[op](step, memo), 
		this[3][op](step, memo)
	];

	let slv = new qtree([
		new qtree([subslv[0], subslv[1], subslv[3], subslv[4]], this.wpn/2).memoize(memo).solve(step, memo),
		new qtree([subslv[1], subslv[2], subslv[4], subslv[5]], this.wpn/2).memoize(memo).solve(step, memo),
		new qtree([subslv[3], subslv[4], subslv[6], subslv[7]], this.wpn/2).memoize(memo).solve(step, memo),
		new qtree([subslv[4], subslv[5], subslv[7], subslv[8]], this.wpn/2).memoize(memo).solve(step, memo)
	], this.wpn/2)

	this.next = slv.memoize(memo);
	Object.freeze(this);
	return slv.memoize(memo);
}

function etree(wpn){
	if(wpn == 1)
		return new qtree([0,0,0,0], wpn).memoize(memo);
	let a = etree(wpn/2);
	return new qtree([a,a,a,a], wpn).memoize(memo);
}

function center(t){
	let nd = [etree(t.wpn), etree(t.wpn), etree(t.wpn), etree(t.wpn)];
	nd[0] = nd[0].setn(3, t[0]);
	nd[1] = nd[1].setn(2, t[1]);
	nd[2] = nd[2].setn(1, t[2]);
	nd[3] = nd[3].setn(0, t[3]);
	return new qtree(nd, t.wpn*2).memoize(memo);
}

let xd = -1;
let yd = -1;
let qt = new qtree([0, 0, 0, 0], 1);
let memo = {}

function setCell(x, y, v){
	if(x < xd + qt.wpn/2 || y < yd + qt.wpn/2 || x >= qt.wpn/2 || y >= qt.wpn/2){
		let i = (x < xd ? 1 : 0) + (y < yd ? 2 : 0);
		if(x >= xd)
			xd -= qt.wpn;
		
		if(y >= yd)
			yd -= qt.wpn;

		qt = center(qt);
	}
	
	qt = qt.set(x - xd, y - yd, v)
}

function update(){
	let startTime = new Date().getTime();

	qt = center(qt.solve(0,memo));

	let endTime = new Date().getTime();
	tpsAccurate = 1000 / (endTime - startTime);

	if(tps != 0)
		tpsAccurate = Math.min(tps, tpsAccurate);
}
