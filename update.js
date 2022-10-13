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
		q += mul[i] * this[i]?.toString();
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
	if(x < 0 || y < 0 || x >= this.wpn*2 || y >= this.wpn*2)
		return 0;
	
	let i = Math.floor(x/this.wpn) + 2*Math.floor(y/this.wpn);
	if(this.wpn == 1)
		return this[i];

	return this[i].get(x % this.wpn, y % this.wpn);
}

qtree.prototype.set = function(x, y, v){
	this.hash = undefined;
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

	return new qtree(nodes, this.wpn, this.hash);
}

qtree.prototype.memoize = function(memo = {}){
	let hash = this.toString();
	if(memo[hash]){
		let arr = memo[hash];
		for(let el in arr)
			if(arr[el].equals(this))
				return arr[el];
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

qtree.prototype.solvev = function(o){

	if(this.hash == 0)
		return 0;
	if(o.wpn == 1)
		return 1;

	let nt = new qtree([
		this[0][1], this[1][0],
		this[0][3], this[1][2]
	], this[0].wpn).solvev(new qtree([
		o[0][1], o[1][0],
		o[0][3], o[1][2]
	],o[0].wpn));

	let nb = new qtree([
		this[2][1], this[3][0],
		this[2][3], this[3][2]
	], this[0].wpn).solvev(new qtree([
		o[2][1], o[3][0],
		o[2][3], o[3][2]
	], o[0].wpn));

	if(nt == 0 && nb == 0)
		return 0;

	let x = this.wpn - 1, y = this.wpn - 1;

	o.set(x, y, this.check(x, y));
	o.set(x + 1, y, this.check(x + 1, y));
	o.set(x, y + 1, this.check(x, y + 1));
	o.set(x + 1, y + 1, this.check(x + 1, y + 1));
	
	return 1;
}

qtree.prototype.solveh = function(o, i = true){

	if(this.hash == 0)
		return 0;
	if(o.wpn == 1)
		return 1;

	let nt = new qtree([
		this[0][2], this[0][3],
		this[2][0], this[2][1]
	], this[0].wpn).solveh(new qtree([
		o[0][2], o[0][3],
		o[2][0], o[2][1]
	],o[0].wpn), false);

	let nb = new qtree([
		this[1][2], this[1][3],
		this[3][0], this[3][1]
	], this[0].wpn).solveh(new qtree([
		o[1][2], o[1][3],
		o[3][0], o[3][1]
	], o[0].wpn), false);

	if(nt == 0 && nb == 0)
		return 0;

	if(i)
		return 1;

	let x = this.wpn - 1, y = this.wpn - 1;

	o.set(x, y, this.check(x, y));
	o.set(x + 1, y, this.check(x + 1, y));
	o.set(x, y + 1, this.check(x, y + 1));
	o.set(x + 1, y + 1, this.check(x + 1, y + 1));
	
	return 1;
}
	
qtree.prototype.solve = function(memo = {}){
	if(this.next)
		return this.next;

	if(this.wpn == 1){
		this.next = new qtree([0, 0, 0, 0], 1).memoize();
		return this.next;
	}

	tree = new qtree([
		this[0].solve(memo).copy(),
		this[1].solve(memo).copy(),
		this[2].solve(memo).copy(),
		this[3].solve(memo).copy()
	], this.wpn);

	this.solvev(tree);
	this.solveh(tree);

	this.next = tree.memoize(memo);
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
