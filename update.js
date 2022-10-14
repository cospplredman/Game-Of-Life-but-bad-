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

qtree.prototype.solve = function(memo = {}){
	if(this.next)
		return this.next;
	if(this.wpn == 2)
		return this.solve2(memo);

	let subslv = [
		this[0].solve(), 
		new qtree([this[0][1], this[1][0], this[0][3], this[1][2]], this.wpn/2).memoize(memo).solve(), 
		this[1].solve(),

		new qtree([this[0][2], this[0][3], this[2][0], this[2][1]], this.wpn/2).memoize(memo).solve(), 
		new qtree([this[0][3], this[1][2], this[2][1], this[3][0]], this.wpn/2).memoize(memo).solve(),
		new qtree([this[1][2], this[1][3], this[3][0], this[3][1]], this.wpn/2).memoize(memo).solve(),

		this[2].solve(), 
		new qtree([this[2][1], this[3][0], this[2][3], this[3][2]], this.wpn/2).memoize(memo).solve(), 
		this[3].solve()
	];

	let slv = new qtree([
		new qtree([subslv[0], subslv[1], subslv[3], subslv[4]], this.wpn/2).memoize(memo).solve(),
		new qtree([subslv[1], subslv[2], subslv[4], subslv[5]], this.wpn/2).memoize(memo).solve(),
		new qtree([subslv[3], subslv[4], subslv[6], subslv[7]], this.wpn/2).memoize(memo).solve(),
		new qtree([subslv[4], subslv[5], subslv[7], subslv[8]], this.wpn/2).memoize(memo).solve()
	], this.wpn/2);

	this.next = slv.memoize(memo);
	Object.freeze(this);
	return this.next;
}

function etree(wpn){
	if(wpn == 1)
		return new qtree([0,0,0,0], wpn);
	let a = etree(wpn/2);
	return new qtree([a,a,a,a], wpn);
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

		let k = new qtree(nodes, qt.wpn*2)
		qt = k;
	}

	qt = qt.set(x - xd, y - yd, v);
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
