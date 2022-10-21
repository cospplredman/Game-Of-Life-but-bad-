#include<BigInt.h>
#include<stdio.h>

BigInt::BigInt(){
	printf("BigInt()\n");
}

BigInt::BigInt(uint32_t a){
	printf("BigInt(uint32_t)\n");
	if(a){
		alloc(1);
		(*this)[0] = a;
	}
}

BigInt::BigInt(BigInt &b){
	printf("BigInt(BigInt&)\n");
	alloc(b.length);
	for(size_t i = 0; i != b.length; i++)
		(*this)[i] = b[i];	
}

BigInt& BigInt::operator+=(BigInt& b){
	BigInt r = *this + b;
	delete m_arr;
	m_arr = r.m_arr;
	length = r.length;
	r.m_arr = nullptr;
	return *this;
}

BigInt BigInt::operator+(BigInt& b){
	if(sign && !b.sign)
		return b - *this;
	else if(b.sign && !sign)
		return *this - b;

	BigInt r;
	BigInt *mx, *mn;

	if(length > b.length){
		mx = &(*this);
		mn = &b;
	}else{
		mx = &b;
		mn = &(*this);
	}

	r.alloc(mx->length + 1);
	size_t i = 0, ln = 0;
	uint64_t c = 0;

	for(; i < mn->length; i++){
		(c += (*mx)[i]) += (*mn)[i];
		r[i] = c & 0xffffffff;
		c >>= 32;
		if(r[i]) ln = i;
	}

	for(; i < mx->length && c; i++){
		c += (*mx)[i];
		r[i] = c & 0xffffffff;
		c >>= 32;
		if(r[i]) ln = i;
	}

	if(i < mx->length)
		ln = mx->length - 1;

	for(; i < mx->length; i++)
		r[i] = (*mx)[i];

	r[mx->length] = c & 0xffffffff;

	if(!c)
		r.length = ln;

	return r;
}

BigInt& BigInt::operator-=(BigInt& b){
	BigInt r = *this - b;
	delete m_arr;
	m_arr = r.m_arr;
	length = r.length;
	r.m_arr = nullptr;
	return *this;
}

BigInt BigInt::operator-(BigInt& b){
	BigInt r;
	
	size_t sz = ((length < b.length) ? b.length : length) + 1;
	r.alloc(sz);
	size_t i = 0;
	uint64_t c = 1;
	uint32_t sx = (!b.sign) * 0xffffffff;
	uint32_t sxt = (sign) * 0xffffffff;

	if(length < b.length){
		for(; i < length; i++){
			(c += (*this)[i]) += ~(b[i]);
			r[i] = c & 0xffffffff;
			c >>= 32;
		}
		
		for(; i < b.length; i++){
			(c += sxt) += ~(b[i]);
			r[i] = c & 0xffffffff;
			c >>= 32;
		}
	}else{
		for(; i < b.length; i++){
			(c += (*this)[i]) += ~(b[i]);
			r[i] = c & 0xffffffff;
			c >>= 32;
		}
		
		uint32_t sx = (!b.sign) * 0xffffffff;
		for(; i < length; i++){
			(c += (*this)[i]) += sx;
			r[i] = c & 0xffffffff;
			c >>= 32;
		}

	}

	c += sx += sxt;
	r[sz-1] = c & 0xffffffff;

	if(sign != b.sign)
		r.sign = sign;
	else
		r.sign = !(c>>32);

	sx = (r.sign) * 0xffffffff;
	i++;
	while(i >= 0 && r[--i] == sx)
		r.length--;

	return r;
}

BigInt& BigInt::operator*=(BigInt& b){
	return *this;
}

BigInt BigInt::operator*(BigInt& b){
	BigInt r;
	return r;

}

BigInt& BigInt::operator/=(BigInt& b){
	return *this;
}

BigInt BigInt::operator/(BigInt& b){
	BigInt r;
	return r;
}

BigInt& BigInt::operator%=(BigInt& b){
	return *this;
}

BigInt BigInt::operator%(BigInt& b){
	BigInt r;
	return r;
}

BigInt& BigInt::operator&=(BigInt& b){
	return *this;
}

BigInt BigInt::operator&(BigInt& b){
	BigInt r;
	return r;
}

BigInt& BigInt::operator|=(BigInt& b){
	return *this;
}

BigInt BigInt::operator|(BigInt& b){
	BigInt r;
	return r;
}

BigInt& BigInt::operator^=(BigInt& b){
	return *this;
}

BigInt BigInt::operator^(BigInt& b){
	BigInt r;
	return r;

}

BigInt& BigInt::operator>>=(BigInt& b){
	return *this;
}

BigInt BigInt::operator>>(BigInt& b){
	BigInt r;
	return r;
}

BigInt& BigInt::operator<<=(BigInt& b){
	return *this;
}

BigInt BigInt::operator<<(BigInt& b){
	BigInt r;
	return r;
}

BigInt BigInt::operator++(int){
	return *this;
}

BigInt BigInt::operator++(){
	return *this;
}

BigInt BigInt::operator+(){
	return *this;
}

BigInt BigInt::operator--(int){
	return *this;
}

BigInt BigInt::operator--(){
	BigInt r;
	return r;
}

BigInt BigInt::operator-(){
	//maybe
	BigInt q = BigInt(1);
	if(!*this)
		return BigInt(*this);
	return ~(*this) + q;

}

BigInt BigInt::operator~(){
	BigInt r;
	r.alloc(length);
	r.sign = !sign;
	for(size_t i = 0; i != length; i++)
		r[i] = ~(*this)[i];
	return r;
}

char BigInt::operator!(){
	if(length)
		return 0;
	return 1;
}

char BigInt::operator>(BigInt& b){
	if(length != b.length)
		return length > b.length;
	for(size_t i = length; i > 0; i--)
		if((*this)[i] != b[i])
			return (*this)[i] > b[i];
	return 0;
	
}

char BigInt::operator>=(BigInt& b){
	if(length != b.length)
		return length > b.length;
	for(size_t i = length; i > 0; i--)
		if((*this)[i] != b[i])
			return (*this)[i] > b[i];
	return 1;
}

char BigInt::operator<(BigInt& b){
	if(length != b.length)
		return length < b.length;
	for(size_t i = length; i > 0; i--)
		if((*this)[i] != b[i])
			return (*this)[i] < b[i];
	return 0;
}

char BigInt::operator<=(BigInt& b){
	if(length != b.length)
		return length < b.length;
	for(size_t i = length; i > 0; i--)
		if((*this)[i] != b[i])
			return (*this)[i] < b[i];
	return 1;
}

char BigInt::operator==(BigInt& b){
	if(b.length != length)
		return 0;
	for(size_t i = 0; i != length; i++)
		if(b[i] != (*this)[i])
			return 0;
	return 1;
}

char BigInt::operator!=(BigInt& b){
	if(b.length != length)
		return 1;

	for(size_t i = 0; i != length; i++)
		if(b[i] != (*this)[i])
			return 1;
	return 0;
}
