#include<hashTable.h>

struct qtree{
	struct Node{
		size_t hash;
		union{
			Node *nf[4];
			Node *nd[2][2];
		};
	
		Node* nw();
		Node* n();
		Node* ne();
		Node* w();
		Node* cc();
		Node* e();
		Node* sw();
		Node* s();
		Node* se();

		Node* solve1();
		Node* solve();
		Node* solven();
		char operator==(Node&);
		size_t operator+();
	};

	qtree &tree = *this;
	hashTable<Node> memo;
	Node* get(Node**);
};
