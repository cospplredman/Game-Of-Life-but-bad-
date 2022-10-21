using size_t = decltype(sizeof(int));

template<class A, class B>
struct add{
	A &a; B &b;
	add(A &g, B &h) : a(g), b(h) {};

	decltype(a[0] + b[0]) operator[](size_t c){
		return a[c] + b[c];
	}

	template<class T>
	add<add<A, B>, T> operator+(T d) {
		return {*this, d};
	}
};
