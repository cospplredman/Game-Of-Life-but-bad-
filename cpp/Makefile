CXX = g++
INC = ./

build:
	mkdir $@

build/main.o: main.cpp build
	$(CXX) -g -o $@ *.cpp -I$(INC)

run: build/main.o
	$<

clean:
	if [ -d "./build" ]; then rm -r build; fi

all: clean build/main.o run

.PHONY: all clean run
