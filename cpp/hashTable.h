#include"common.h"
#ifndef HASH_TABLE_GUARD
#define HASH_TABLE_GUARD
/*
 * Open address hashing
 * linear probing
 * power of 2 size
 *
 * */
template<class A>
struct hashTable {
	size_t l2sz;
	A* m_key;

	~hashTable();
	hashTable();
	A* getptr(A&);
	void expand();	
};

template<class A>
hashTable<A>::~hashTable(){
	delete[] m_key;
}

template<class A>
hashTable<A>::hashTable(){
	l2sz = 1 << 26;
	m_key = new A[l2sz]{};
}

template<class A>
A* hashTable<A>::getptr(A &b){
	size_t a = +b;
	size_t retry = 0;
	A *q = &m_key[a & (l2sz - 1)];
	while(*q){
		if(*q == b)
			break;
		q = &m_key[(a + ++retry) & (l2sz - 1)];
	}
	return q;
}

template<class A>
void hashTable<A>::expand(){
	l2sz <<= 1;

	A *key = m_key;
	m_key = new A[l2sz]{};

	for(size_t i = 0; i != (l2sz >> 1); i++)
		if(!!key[i]) set(key[i]);
}
#endif
