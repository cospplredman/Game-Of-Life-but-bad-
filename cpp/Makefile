#Building requires the emscripten compiler and associated headers

CXX = emcc
WASMFLAGS = -sALLOW_MEMORY_GROWTH -O3 -sEXPORTED_FUNCTIONS=_main

INC = ./

build:
	mkdir $@

build/main.js: main.cpp build
	$(CXX) $(WASMFLAGS) -o $@ *.cpp -I$(INC); echo ";let glob = {};" >> build/main.js

run: build/main.o
	$<

clean:
	if [ -d "./build" ]; then rm -r build; fi

all: clean build/main.js

.PHONY: all clean run
