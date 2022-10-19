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

_qtree.solven = function(depth = 1){
	if(this.next)
		return this.next;

	if(this.depth == 1)
		return this.solve2();

	let nw, n, ne, w, cc, e, sw, s, se;

	if(this.depth <= depth){
	 	nw = this.nw().solven(depth),
		n  = this.n() .solven(depth),
		ne = this.ne().solven(depth),
		w  = this.w() .solven(depth),
		cc = this.cc().solven(depth),
		e  = this.e() .solven(depth),
		sw = this.sw().solven(depth),
		s  = this.s() .solven(depth),
		se = this.se().solven(depth);
	}else{
	 	nw = this.nw().cc(),
		n  = this.n() .cc(),
		ne = this.ne().cc(),
		w  = this.w() .cc(),
		cc = this.cc().cc(),
		e  = this.e() .cc(),
		sw = this.sw().cc(),
		s  = this.s() .cc(),
		se = this.se().cc();
	}

	return this.next = qtree(
		qtree(nw, n, w, cc).solven(depth), 
		qtree(n, ne, cc, e).solven(depth), 
		qtree(w, cc, sw, s).solven(depth), 
		qtree(cc, e, s, se).solven(depth)
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

//TODO
//map function that returns weather a given tree has cells or not
_qtree.map = function(x, y, w, h, func){
	let m = 1n << BigInt(this.depth);
	let nd = [this.nw(), this.ne(), this.sw(), this.se()];
	for(let i = 0; i != 4; i++)
		if(overlap(m*BigInt(i&1), m*(BigInt(i&2) >> 1n), m, m, x, y, w, h)){
			if(this.depth == 0)
				func(-(x - m*BigInt(i&1)), -(y - m*(BigInt(i&2) >> 1n)), nd[i]);
			else
				nd[i].map(x - m*BigInt(i&1), y - m*(BigInt(i&2) >> 1n), w, h, func);
		}
}

_qtree.set = function(x, y, v){
	let w = 1n << BigInt(this.depth);
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

_qtree.remember = function(){
	if(this.depth > 0){
		let nd = [this.nw(), this.ne(), this.sw(), this.se()];
		kk: for(let j = 0; j != nd.length; j++){
			let arr = memo[nd[j].hash] ??= [];
			for(let i = 0; i != arr.length; i++)
				if(Object.is(nd[j], arr[i]))
					continue kk;
			nd[j].remember();
		}
	}
	this.memoize();
}

Object.freeze(_qtree);
var qtree = (nw, ne, sw, se) => {
	let tree = Object.create(_qtree);
	
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

function forget(step){
	for(let i in memo){
		for(let j in memo[i]){
			if(memo[i][j].depth > step)
				memo[i][j].next = undefined;
			delete memo[i][j];
		}
		delete memo[i];;
	}
}

let step = 0;

//=====================================================================================================================//



let qt = etree(64);
let hw = 1n << BigInt(qt.depth);
let tpsAccurate = 0;
let pause = true;
let updateInterval;
let tps = 10;

function setCell(x, y, v){
	qt = qt.set(x + hw, y + hw, v);
}

function update(){
	let st, ed;
	if(tps == 0){
		if(step != (qt.depth - 2)){
			step = qt.depth - 2;
			forget(0);
			qt.remember();
		}

		st = performance.now();
		qt = center(qt.solve());
		ed = performance.now();
	}else{
		if(step != 0){
			step = 0;
			forget(0);
			qt.remember();
		}

		st = performance.now();
		qt = center(qt.solven(1));
		ed = performance.now();

	}
	tpsAccurate = BigInt(Math.round(1000 / (ed - st + 0.5))) * 1n << BigInt(step);


	tpsAccurate = (tpsAccurate > tps && tps != 0 ? tps : tpsAccurate);
}

let getCells = function(x, y, w, h){
	let alive = [];
	qt.map(x + hw, y + hw, w, h, (x, y, v) => {if(v) alive.push([x, y])});
	postMessage(alive);
}

let getTps = function(){
	postMessage(tpsAccurate);
}

let setPause = function(v){
	if(v && !pause)
		clearInterval(updateInterval);
	else if(!v && pause)
		updateInterval = setInterval(update, 1000/tps);

	pause = v;
}

let setTps = function(v){
	tps += v;
	tps = tps < 0 ? 0 : tps;
	if(!pause){
		clearInterval(updateInterval);
		updateInterval = setInterval(update, 1000/tps);
	}
}

let events = {setCell, getCells, getTps, update, setPause, setTps};
onmessage = (e) => {
	let ev = e.data;
	if(events[ev[0]])
		events[ev[0]](...ev[1]);
	else
		console.log("unrecognized event: " + ev[0]);
}
