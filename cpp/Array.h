#include<common.h>
#include<stdio.h>

#ifndef ARRAY_GUARD
#define ARRAY_GUARD
template<class T, size_t A = 0>
struct Array{
	enum{length = A};
	T m_arr[A];

	T& operator[](size_t);
};

template<class T, size_t A>
T& Array<T, A>::operator[](size_t n){
	return m_arr[n];
}

template<class T>
struct Array<T, 0>{
	~Array();
	size_t length = 0;
	T *m_arr = nullptr;

	T& operator[](size_t);
	void expand(size_t);
	void alloc(size_t);
};

template<class T>
Array<T, 0>::~Array(){
	printf("~Array()\n");
	delete[] m_arr;
}

template<class T>
void Array<T, 0>::expand(size_t n){
	if(n){	
		T* k = new T[length + n];
		for(size_t i = 0; i != length; i++)
			k[i] = m_arr[i];
	
		delete[] m_arr;
		length += n;
		m_arr = k;
	}
}

template<class T>
void Array<T, 0>::alloc(size_t n){
	delete m_arr;
	m_arr = new T[n];
	length = n;
}

template<class T>
T& Array<T, 0>::operator[](size_t n){
	return m_arr[n];
}
#endif
