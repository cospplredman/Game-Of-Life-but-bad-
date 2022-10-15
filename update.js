let _qtree = Object.create(null);

_qtree.nw = function(){
	return this._nw;
}

_qtree.ne = function(){
	return this._ne;
}

_qtree.sw = function(){
	return this._sw;
}

_qtree.se = function(){
	return this._se;
}

_qtree.cc = function(){
	return qtree(
		this.nw().se(), this.ne().sw(),
		this.sw().ne(), this.se().nw()
	)
}

_qtree.n = function(){
	return qtree(
		this.nw().ne(), this.ne().nw(),
		this.nw().se(), this.ne().sw()
	)
}

_qtree.e = function(){
	return qtree(
		this.ne().sw(), this.ne().se(),
		this.se().nw(), this.se().ne()
	)
}

_qtree.s = function(){
	return qtree(
		this.sw().ne(), this.se().nw(),
		this.sw().se(), this.se().sw()
	)
}

_qtree.w = function(){
	return qtree(
		this.nw().sw(), this.nw().se(),
		this.sw().nw(), this.sw().ne()
	)
}

_qtree.valueOf = function(){
	return this.nw() + this.ne() + this.sw() + this.se();
}

let rule = [[0,0,0,1,0,0,0,0,0], [0,0,1,1,0,0,0,0,0]];
//let rule = [[0,0,0,1,0,0,0,0,0], [0,1,1,1,1,0,0,0,0]];
_qtree.solve2 = function(){
	return this.next = qtree(
		rule[this.nw().se()][
			this.nw() + 			  this.ne().nw() + 
							  this.ne().sw() + 
			this.sw().nw() + this.sw().ne() + this.se().nw() - this.nw().se()
		],
		rule[this.ne().sw()][
			this.nw().ne() + 		  this.ne() +
			this.nw().se() +
			this.sw().ne() + this.se().nw() + this.se().ne() - this.ne().sw()
		],
		rule[this.sw().ne()][
			this.nw().sw() + this.nw().se() + this.ne().sw() +
							  this.se().nw() +
			this.sw() +			  this.se().sw() - this.sw().ne()
		],
		rule[this.se().nw()][
			this.nw().se() + this.ne().sw() + this.ne().se() +
			this.sw().ne() +
			this.sw().se() +		  this.se() - this.se().nw()
		]
	);
}

_qtree.solve = function(){
	if(this.next)
		return this.next;

	if(this.depth == 1)
		return this.solve2();

	let 	nw = this.nw().solve(),
		n  = this.n() .solve(),
		ne = this.ne().solve(),
		w  = this.w() .solve(),
		cc = this.cc().solve(),
		e  = this.e() .solve(),
		sw = this.sw().solve(),
		s  = this.s() .solve(),
		se = this.se().solve();

	return this.next = qtree(
		qtree(nw, n, w, cc).solve(), 
		qtree(n, ne, cc, e).solve(), 
		qtree(w, cc, sw, s).solve(), 
		qtree(cc, e, s, se).solve()
	);
}

_qtree._hash = function(){
	if(this.depth == 0)
		return this.nw() + 11*this.ne() + 101*this.sw() + 1007*this.se();
	return this.nw().hash + 11*this.ne().hash + 101*this.sw().hash + 1007*this.se().hash;
}

_qtree.equals = function(tr){
	if(tr.depth != this.depth || tr.hash != this.hash)
		return false;

	if(Object.is(this, tr))
		return true;

	if(tr.depth == 0)
		return 	this.nw() == tr.nw() &&
			this.ne() == tr.ne() &&
			this.sw() == tr.sw() &&
			this.se() == tr.se();

	return 	this.nw().equals(tr.nw()) &&
		this.ne().equals(tr.ne()) &&
		this.sw().equals(tr.sw()) &&
		this.se().equals(tr.se());
}

function overlap(x, y, w, h, x1, y1, w1, h1){
	let t = 0;
	if((x <= x1 && (x + w) >= x1) || (x1 <= x && (x1 + w1) >= x))
		if((y <= y1 && (y + h) >= y1) || (y1 <= y && (y1 + h1) >= y)){
			return true;
		}
	return false;

}

_qtree.map = function(x, y, w, h, func){
	let m = 1 << this.depth;
	let nd = [this.nw(), this.ne(), this.sw(), this.se()];
	for(let i = 0; i != 4; i++)
		if(overlap(m*(i&1), m*((i&2) >> 1), m, m, x, y, w, h)){
			if(this.depth == 0)
				func(-(x - m*(i&1)), -(y - m*((i&2) >> 1)), nd[i]);
			else
				nd[i].map(x - m*(i&1), y - m*((i&2) >> 1), w, h, func);
		}
}

_qtree.set = function(x, y, v){
	let w = 1 << this.depth;
	let i = (x >= w) + 2*(y >= w);
	let nd = [this.nw(), this.ne(), this.sw(), this.se()];

	if(this.depth == 0)
		nd[i] = v;
	else
		nd[i] = nd[i].set(x % w, y % w, v);
	return qtree(nd[0], nd[1], nd[2], nd[3]);
}

let memo = Object.create(null);
_qtree.memoize = function(){
	this.hash = this._hash();
	let arr = memo[this.hash] ??= [];
	for(let i = 0; i != arr.length; i++)
		if(arr[i].equals(this)){
			delete this;
			return arr[i];
		}

	arr.push(this);
	return this;
}



Object.freeze(_qtree);
var qtree = (nw, ne, sw, se) => {
	//if(nw.depth != ne.depth || nw.depth != sw.depth || nw.depth != se.depth) console.log("WARNING: wrong depths");
	let tree = Object.create(_qtree); /*, {
		_nw: {value: nw},
		_ne: {value: ne},
		_sw: {value: sw},
		_se: {value: se},
		depth: {value: (nw.depth ?? -1) + 1},
		hash: {writable: true},
		next: {writable: true}
	});*/

	tree._nw = nw;
	tree._ne = ne;
	tree._sw = sw;
	tree._se = se;
	tree.depth = (nw.depth ?? -1) + 1;
	return tree.memoize();
}

function etree(n){
	if(n == 0)
		return qtree(0, 0, 0, 0);
	let k = etree(n-1);
	return qtree(k, k, k, k);
}

function center(n){
	let et = etree(n.depth - 1)
	let od = [n.nw(), n.ne(), n.sw(), n.se()];
	let fd = Array(4);
	for(let i = 0; i != 4; i++){
		let nd = [et, et, et, et];
		nd[3 - i] = od[i];
		fd[i] = qtree(nd[0], nd[1], nd[2], nd[3]);
	}
	return qtree(fd[0], fd[1], fd[2], fd[3]);
}

let qt = etree(16);
let xd = 1 << qt.depth;
let yd = 1 << qt.depth;

function setCell(x, y, v){
	qt = qt.set(x + xd, y + yd, v);
}

function update(){
	let st = performance.now();
	qt = center(qt.solve());	
	let ed = performance.now();
	tpsAccurate = 1000 / (ed - st + 0.5) * (1 << (qt.depth - 2));
	tpsAccurate = (tpsAccurate > tps && tps != 0 ? tps : tpsAccurate);
}
