CXX = g++
INC = ./

main.o: main.cpp
	$(CXX) -o $@ $< -I$(INC)

test: main.o
	./$< && rm ./$<

all: main.o

.PHONY: all test
