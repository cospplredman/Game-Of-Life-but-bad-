#include<Array.h>

struct BigInt : public Array<uint32_t> {
	size_t ul = 0;
	unsigned char sign = 0;
	
	BigInt();
	BigInt(uint32_t);
	BigInt(BigInt&);

	BigInt& operator+=(BigInt&);
	BigInt operator+(BigInt&);

	BigInt& operator-=(BigInt&);
	BigInt operator-(BigInt&);

	BigInt& operator*=(BigInt&);
	BigInt operator*(BigInt&);

	BigInt& operator/=(BigInt&);
	BigInt operator/(BigInt&);

	BigInt& operator%=(BigInt&);
	BigInt operator%(BigInt&);

	BigInt& operator&=(BigInt&);
	BigInt operator&(BigInt&);

	BigInt& operator|=(BigInt&);
	BigInt operator|(BigInt&);

	BigInt& operator^=(BigInt&);
	BigInt operator^(BigInt&);

	BigInt& operator>>=(BigInt&);
	BigInt operator>>(BigInt&);
	
	BigInt& operator<<=(BigInt&);
	BigInt operator<<(BigInt&);

	BigInt operator++(int);
	BigInt operator++();
	BigInt operator+();

	BigInt operator--(int);
	BigInt operator--();
	BigInt operator-();
	
	BigInt operator~();
	char operator!();

	char operator>(BigInt&);
	char operator>=(BigInt&);

	char operator<(BigInt&);
	char operator<=(BigInt&);
	
	char operator==(BigInt&);
	char operator!=(BigInt&);
};
