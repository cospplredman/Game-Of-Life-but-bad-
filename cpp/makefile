#Building requires the emscripten compiler and associated headers


SRC := $(shell echo src/*.cpp)
OBJ := $(SRC:.cpp=.o)
INC := src

CXX = emcc
CXXFLAGS = -I${INC} -sALLOW_MEMORY_GROWTH -O3 -sEXPORTED_FUNCTIONS=_main

default: all
all: main.js

clean:
	rm -f main.js main.wasm ${OBJ}

%.o: %.cpp
	${CXX} ${CXXFLAGS} -c $< -o $@

main.js: main.cpp ${OBJ}
	$(CXX) ${CXXFLAGS} $^ -o $@; \
	echo ";let glob = {};" >> main.js

.PHONY: all clean
