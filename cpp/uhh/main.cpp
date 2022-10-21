#include<ctop.h>
#include<stdio.h>

int main(){
	int a[] = {3, 8};
	int b[] = {4, 10};
	
	auto c = add{a, b} + b;

	printf("%d\n", c[0]);
	printf("%d\n", c[1]);
	return 0;
}


