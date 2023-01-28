#Building requires the emscripten compiler and associated headers

SRC := $(shell echo src/*.cpp)
OBJ := $(SRC:.cpp=.o)
INC := src

CXX = emcc
CXXFLAGS = -I${INC} -g0 -O2 -Wall -pedantic

default: all
all: main.js

clean:
	rm -f main.js main.wasm ${OBJ}

%.o: %.cpp
	${CXX} ${CXXFLAGS} -c $< -o $@

main.js: main.cpp ${OBJ}
	$(CXX) ${CXXFLAGS} $^ -o $@ -sALLOW_MEMORY_GROWTH -sEXPORTED_FUNCTIONS=_main --pre-js prejs.js

.PHONY: all clean
