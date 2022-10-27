#include"qtree.h"
#include<stdio.h>

using Node = qtree::Node;

Node* Node::nw(){
	return nf[0];
}

Node* Node::n(qtree &tree){
	return tree.get(Node(
		nf[0]->nf[1], nf[1]->nf[0],
		nf[0]->nf[3], nf[1]->nf[2]		
	));
}

Node* Node::ne(){
	return nf[1];
}

Node* Node::w(qtree &tree){
	return tree.get(Node(
		nf[0]->nf[2], nf[0]->nf[3],
		nf[2]->nf[0], nf[2]->nf[1]		
	));
}

Node* Node::cc(qtree &tree){
	return tree.get(Node(		
		nf[0]->nf[3], nf[1]->nf[2],
		nf[2]->nf[1], nf[3]->nf[0]		
	));
}

Node* Node::e(qtree &tree){
	return tree.get(Node(
		nf[1]->nf[2], nf[1]->nf[3],
		nf[3]->nf[0], nf[3]->nf[1]		
	));
}

Node* Node::sw(){
	return nf[2];
}

Node* Node::s(qtree &tree){
	return tree.get(Node(
		nf[2]->nf[1], nf[3]->nf[0],
		nf[2]->nf[3], nf[3]->nf[2]		
	));
}

Node* Node::se(){
	return nf[3];
}

Node::Node(size_t a){
	for(size_t i = 0; i != 3; i++)
		nf[i] = nullptr;

	nf[3] = (Node*)0x1;
	hash = a;
	next = nullptr;
}

Node::Node(Node* a, Node* b, Node* c, Node* d){
	nf[0] = a;
	nf[1] = b;
	nf[2] = c;
	nf[3] = d;
	hash = hsh();
	next = nullptr;
}

char rule[2][9] = {{0,0,0,1,0,0,0,0,0}, {0,0,1,1,0,0,0,0,0}};

Node* Node::solve1(qtree& tree){
	size_t a[4][4] = {
		{nw()->nw()->hash, nw()->ne()->hash, ne()->nw()->hash, ne()->ne()->hash},
		{nw()->sw()->hash, nw()->se()->hash, ne()->sw()->hash, ne()->se()->hash},
		{sw()->nw()->hash, sw()->ne()->hash, se()->nw()->hash, se()->ne()->hash},
		{sw()->sw()->hash, sw()->se()->hash, se()->sw()->hash, se()->se()->hash}
	};

	char b[2][2];

	for(size_t i = 0; i != 2; i++)
		for(size_t j = 0; j != 2; j++){
			b[i][j] = 	a[i][j] + a[i+1][j] + a[i+2][j] +
					a[i][j+1] + a[i+1][j+1] + a[i+2][j+1] +
					a[i][j+2] + a[i+1][j+2] + a[i+2][j+2];
			b[i][j] = rule[a[i + 1][j + 1]][b[i][j] - a[i+1][j+1]];
		}
	
	return next = tree.get(Node(
		tree.base[b[0][0]],
		tree.base[b[0][1]],
		tree.base[b[1][0]],
		tree.base[b[1][1]]
	));

}

Node* Node::solve(qtree& tree){
	if(next)
		return next;

	if(nw()->nw()->nw() == nullptr)
		return solve1(tree);
	
	Node *mp[] = {
		nw()->solve(tree),
		n(tree)->solve(tree),
		ne()->solve(tree),
		w(tree)->solve(tree),
		cc(tree)->solve(tree),
		e(tree)->solve(tree),
		sw()->solve(tree),
		s(tree)->solve(tree),
		se()->solve(tree)
	};

	return next = tree.get(Node(
		tree.get(Node(mp[0],mp[1],mp[3],mp[4]))->solve(tree),
		tree.get(Node(mp[1],mp[2],mp[4],mp[5]))->solve(tree),
		tree.get(Node(mp[3],mp[4],mp[6],mp[7]))->solve(tree),
		tree.get(Node(mp[4],mp[5],mp[7],mp[8]))->solve(tree)	
	));
}

Node* Node::solven(qtree& tree, size_t d, size_t md){
	if(d < md)
		return solve(tree);

	if(next)
		return next;

	if(nw()->nw()->nw() == nullptr)
		return solve1(tree);
	
	Node *mp[] = {
		nw()->cc(tree),
		n(tree)->cc(tree),
		ne()->cc(tree),
		w(tree)->cc(tree),
		cc(tree)->cc(tree),
		e(tree)->cc(tree),
		sw()->cc(tree),
		s(tree)->cc(tree),
		se()->cc(tree)
	};

	return next = tree.get(Node(
		tree.get(Node(mp[0],mp[1],mp[3],mp[4]))->solven(tree, d-1, md),
		tree.get(Node(mp[1],mp[2],mp[4],mp[5]))->solven(tree, d-1, md),
		tree.get(Node(mp[3],mp[4],mp[6],mp[7]))->solven(tree, d-1, md),
		tree.get(Node(mp[4],mp[5],mp[7],mp[8]))->solven(tree, d-1, md)
		
	));
}

Node::operator bool(){
	return !!nf[3];
}

char Node::operator==(Node &b){
	for(char i = 0; i != 4; i++)
		if(nf[i] != b.nf[i])
			return 0;
	return 1;
}

size_t Node::hsh(){
	//if the tree has live cells in it the 0'th bit should be set
	// this hash function was a joke but its actually good x3
	size_t q = (nf[0]->hash | nf[1]->hash | nf[2]->hash | nf[3]->hash);
	size_t e[] = {(size_t)nf[0], (size_t)nf[1], (size_t)nf[2], (size_t)nf[3]};
	size_t f = 2*e[0] ^ 3*e[1] ^ 5*e[2] ^ 7*e[3];
	size_t g = 11*nf[0]->hash + 13*nf[1]->hash + 17*nf[2]->hash + 19*nf[3]->hash;

	return ((g + f) & ~1) | (q & 1);
}

size_t Node::operator+(){
	return hash; 
}

void Node::print(){
	printf("Node(%p, %p, %p, %p)\n", nf[0], nf[1], nf[2], nf[3]);
}

size_t Node::get(size_t x, size_t y, size_t d){
	x <<= (32 - d);
	y <<= (32 - d);

	Node *c = this;
	while(d--){
		c = c->nf[(x >> 31) + ((y >> 30) & 2)];
		x <<= 1;
		y <<= 1;
	}

	return c->hash;
}

size_t overlap(int64_t x, int64_t y, int64_t w, int64_t h, int64_t x1, int64_t y1, int64_t w1, int64_t h1){
	if((x <= x1 && (x + w) > x1) || (x1 <= x && (x1 + w1) > x))
		if((y <= y1 && (y + h) > y1) || (y1 <= y && (y1 + h1) > y))
			return 1;
	return 0;
}

void Node::map(int64_t x, int64_t y, int64_t w, int64_t h, int64_t d, void (*f)(size_t, size_t, size_t)){
	size_t m = 1 << d;
	for(size_t i = 0; i != 4; i++){
		if(overlap(m*(i&1), m*((i&2) >> 1), m, m, x, y, w, h)){
			if(d == 0){
				f(m*(i&1) - x, m*((i&2) >> 1) - y, nf[i]->hash & 1);
			}else
				nf[i]->map(x - m*(i&1), y - m*((i&2) >> 1), w, h, d-1, f);
		}
	}
	
}

qtree::qtree(){
	items = 0;
	base[0] = get(Node(size_t(0)));
	base[1] = get(Node(size_t(1)));
}

Node* qtree::get(Node a){
	Node* q = memo.getptr(a);
	if(*q)
		return q;
	*q = a;
	items++;
	return q;
}

void qtree::forgetNext(){
	for(size_t i = 0; i != memo.l2sz; i++)
		memo.m_key[i].next = nullptr;
}
