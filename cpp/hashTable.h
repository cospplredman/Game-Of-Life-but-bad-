#include<Array.h>
#define INIT_SIZE 1 << 15

#ifndef HASH_TABLE_GUARD
#define HASH_TABLE_GUARD
template<class A, class B = void>
struct hashTable{
	size_t items = 0;

	struct element{
		A *a;
		B *b;
	};

	Array<element> m_arr;

	hashTable(){
		m_arr.alloc(INIT_SIZE);
		clear();
	}

	void clear(){
		for(size_t i = 0; i != m_arr.length; i++)
			m_arr[i] = {nullptr, nullptr};
	}

	void expand(){
		element *q = m_arr.m_arr;
		size_t len = m_arr.length;
		m_arr.m_arr = new element[m_arr.length * 2];
		m_arr.length *= 2;
		clear();
		for(size_t i = 0; i != len; i++){
			if(q[i].a)
				set(*(q[i].a), *(q[i].b));
		}
		delete q;
	}

	element &el(size_t a){
		return m_arr[a % m_arr.length];
	}

	void set(A& b, B& c){
		if((float)items / (float)m_arr.length > 0.7)
			expand();

		size_t a = +b;
		size_t retry = 0;
		while(1){
			element *q = &el(a + retry);
			if(q->a == nullptr){
				*q = {&b, &c};
				items++;
				return;
			}else if(*(q->a) == b){
				*q = {&b, &c};
				return;
			}
			retry++;
		}
	}

	B* get(A& b){
		size_t a = +b;
		size_t retry = 0;
		while(1){
			element *q = &el(a + retry);
			if(q->a == nullptr)
				return nullptr;
			if(*(q->a) == b)
				return q->b;
			retry++;
		}
	}


};


template<class A>
struct hashTable<A, void> : public Array<A> {
	hashTable(){
		this->alloc(INIT_SIZE);
	}

	char has(size_t, A&);

	void set(size_t, A&);
};

template<class A>
using Set = hashTable<A, void>;
#endif
