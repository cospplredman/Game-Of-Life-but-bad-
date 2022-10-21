#include"qtree.h"
#include"BigInt.h"

using Node = qtree::Node;

Node* Node::nw(){
	return nf[0];
}

Node* Node::n(){
	return this;
}

Node* Node::ne(){
	return nf[1];
}

Node* Node::w(){
	return this;
}

Node* Node::cc(){
	return this;
}

Node* Node::e(){
	return this;
}

Node* Node::sw(){
	return nf[2];
}

Node* Node::s(){
	return this;
}

Node* Node::se(){
	return nf[3];
}

//Node* Node::solve1();
//Node* Node::solve();
//Node* Node::solven();

char Node::operator==(Node &b){
	if(*this == b)
		return 1;
	
	//if(depth != b.depth || hash != b.hash || depth == -1)
	//	return 0;

	for(char i = 0; i != 4; i++)
		if(!(*nf[i] == *b.nf[i]))
			return 0;

	return 1;
}

size_t Node::operator+(){
	//hash function
	return 0;
}

//Node* qtree::get(Node**);
