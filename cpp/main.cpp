#include<stdio.h>
#include<hashTable.h>

#include<BigInt.h>

void pbint(BigInt& a){
	char hex[] = "0123456789ABCDEF";
	if(a.sign)
		printf("-0x");
	else
		printf("0x");
	for(size_t i = a.length; i != 0; i--){
		uint32_t k = a[i-1];
		for(size_t i = 0; i != 8; i++){
	       		printf("%c", hex[(k & 0xf0000000) >> 28]);
			k <<= 4;
		}
	}
	printf("\n");
}

#define TSZ 100000
int main(){
	size_t q[TSZ];
	size_t f[TSZ];
	for(int i = 0; i != TSZ; i++)
		q[i] = i*i, f[i] = i*i*i;
	hashTable<size_t, size_t> c = {};
	
	for(size_t i = 0; i != TSZ; i++)
		c.set(q[i], f[i]);

	for(size_t i = 0; i != TSZ; i++)
		if(f[i] != *c.get(q[i]))
			printf("ind %d incorrect\n", i);

	return 0;
}
