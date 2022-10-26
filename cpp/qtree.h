#include"hashTable.h"
struct qtree{
	struct Node{
		union{
			Node *nf[4];
			Node *nd[2][2];
		};
		size_t hash;
		Node* next;
	
		Node* nw();
		Node* n(qtree&);
		Node* ne();
		Node* w(qtree&);
		Node* cc(qtree&);
		Node* e(qtree&);
		Node* sw();
		Node* s(qtree&);
		Node* se();

		Node() = default;
		Node(size_t);
		Node(Node*, Node*, Node*, Node*);
		Node* solve1(qtree&);
		Node* solve(qtree&);
		Node* solven(qtree&, size_t, size_t);
		char operator==(Node&);
		size_t operator+();
		size_t hsh();
		void print();
		size_t get(size_t, size_t, size_t);
		void map(int64_t, int64_t, int64_t, int64_t, int64_t, void (*)(size_t, size_t, size_t));
	};

	size_t items;


	hashTable<Node> memo;
	Node *nodes;
	Node *base[2];

	qtree();
	Node* get(Node A);
	void expand();

};
