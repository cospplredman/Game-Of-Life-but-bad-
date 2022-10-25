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
	for(size_t i = 0; i != 4; i++)
		nf[i] = nullptr;
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

	//for(size_t i = 0; i != 4; i++, printf("ll%zd\n", i))
	//	for(size_t j = 0; j != 4; j++)
	//		printf("%zd ", a[i][j]);

	char b[2][2];

	for(size_t i = 0; i != 2; i++)
		for(size_t j = 0; j != 2; j++){
			b[i][j] = 	a[i][j] + a[i+1][j] + a[i+2][j] +
					a[i][j+1] + a[i+1][j+1] + a[i+2][j+1] +
					a[i][j+2] + a[i+1][j+2] + a[i+2][j+2];
			b[i][j] = rule[a[i + 1][j + 1]][b[i][j] - a[i+1][j+1]];
		}
	
	//for(size_t i = 0; i != 2; i++, printf("ll%zd\n", i))
	//	for(size_t j = 0; j != 2; j++)
	//	printf("%zd ", b[i][j]);
	

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

Node* Node::solven(qtree&){
	return this;
}

char Node::operator==(Node &b){
	for(char i = 0; i != 4; i++)
		if(nf[i] != b.nf[i])
			return 0;
	return 1;
}

size_t Node::hsh(){
	return 1*nf[0]->hash + 11*nf[1]->hash + 101*nf[2]->hash + 1007*nf[3]->hash;
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
		//printf("%zd\n", (x >> 31) + ((y >> 31) & 2));
		x <<= 1;
		y <<= 1;
	}

	return c->hash;
}

size_t overlap(size_t x, size_t y, size_t w, size_t h, size_t x1, size_t y1, size_t w1, size_t h1){
	if((x <= x1 && (x + w) >= x1) || (x1 <= x && (x1 + w1) >= x))
		if((y <= y1 && (y + h) >= y1) || (y1 <= y && (y1 + h1) >= y))
			return 1;
	return 0;
}

void Node::map(size_t x, size_t y, size_t w, size_t h, size_t d, void (*f)(size_t, size_t, size_t)){
	size_t m = 1 << d;
	for(size_t i = 0; i != 4; i++)
		if(overlap(m*(i&1), m*((i&2) >> 1), m, m, x, y, w, h)){
			if(d == 0)
				f(-(x - m*(i&1)), -(y - m*((i&2) >> 1)), nf[i]->hash);
			else
				nf[i]->map(x - m*(i&1), y - m*((i&2) >> 1), w, h, d-1, f);
		}
	
}

qtree::qtree(){
	items = 0;
	nodes = new Node[memo.l2sz];
	base[0] = get(Node(size_t(0)));
	base[1] = get(Node(size_t(1)));
}

Node* qtree::get(Node a){
	Node** q = memo.getptr(a);
	if(*q)
		return *q;
	
	*q = &nodes[items];
	**q = a;
	items++;
	return *q;
}

void qtree::expand(){
	Node *val = nodes;
	Node **key = memo.m_key;
	memo.l2sz <<= 1;

	nodes = new Node[memo.l2sz];
	memo.m_key = new Node*[memo.l2sz]{nullptr};

	size_t it = items;
	items = 0;
	for(size_t i = 0; i < it; i++)
		get(val[i]);

	base[0] = get(Node(size_t(0)));
	base[1] = get(Node(size_t(1)));
	
	delete[] val;
	delete[] key;
}
