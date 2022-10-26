#include<stdio.h>
#include<hashTable.h>

#define TSZ 100'000'000
size_t q[TSZ] = {};
int main(){	
	for(size_t i = 0; i != TSZ; i++)
		q[i] = i*i;

	hashTable<size_t> c = {};
	
	for(size_t i = 0; i != TSZ; i++)
		*c.getptr(q[i]) = &q[i];

	for(size_t i = 0; i != TSZ; i++){
		size_t *r = *c.getptr(q[i]);
		if(!r)
			printf("no entry at %d\n", i);
	}
	return 0;
}
