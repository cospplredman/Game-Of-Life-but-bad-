WCC = emcc
#WASMFLAGS = -sASSERTIONS -sALLOW_MEMORY_GROWTH -O3 -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -sEXPORTED_FUNCTIONS=_main
WASMFLAGS = -sALLOW_MEMORY_GROWTH -O3 -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -sEXPORTED_FUNCTIONS=_main

INC = ./

build:
	mkdir $@

build/main.js: main.cpp build
	$(WCC) $(WASMFLAGS) -o $@ *.cpp -I$(INC) -DWASM; echo ";let glob = {};" >> build/main.js

run: build/main.o
	$<

clean:
	if [ -d "./build" ]; then rm -r build; fi

all: clean build/main.js

.PHONY: all clean run
