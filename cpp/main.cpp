#include"stdio.h"
#include"qtree.h"

#ifdef WASM
#include"emscripten/emscripten.h"
#include"emscripten/html5.h"
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

using Node = qtree::Node;
qtree tr = {};
Node *qt = nullptr;
size_t depth = 0;

void ptree(Node* a, size_t d){
	for(size_t i = 0; i != (1 << d); i++, printf("\n"))
		for(size_t j = 0; j != (1 << d); j++)
			printf("%d ", a->get(j << (64 - d), i << (64 - d)));
}

Node *set(Node *a, size_t x, size_t y, Node *v, size_t d){
	size_t w = 1 << d;
	size_t i = (x >= w) + 2*(y >= w);
	Node r(a->nf[0], a->nf[1], a->nf[2], a->nf[3]);

	if(d == 0)
		r.nf[i] = v;
	else
		r.nf[i] = set(r.nf[i], x & (w - 1), y & (w - 1), v, d-1);
	return tr.get(r); 
}

Node* etree(size_t d){
	if(d == 0)
		return tr.base[0];

	Node* q = etree(d-1);
	return tr.get(Node(q,q,q,q));
}
//=================================================================

EM_JS(void, setup, (), {
	glob.ev = [];
	onmessage = async function(e) {
		glob.ev.push(e.data);
	};
});

EM_JS(size_t, getEvent, (), {
	glob.c = glob.ev.pop();

	if(glob.c != undefined)
		return glob.c[0];
	return 0;
});

EM_JS(size_t, numEvents, (), {
	return glob.ev.length;		
});

EM_JS(size_t, NP, (size_t a), {
	return glob.c[1][a];
});

EM_JS(void, PR, (size_t e, size_t x, size_t y), {
	postMessage([e, [x, y]]);	
});

enum{None, setCell, getCell};

EM_BOOL evLoop(double time, void* userData){
	size_t v = numEvents();
	for(size_t i = 0; i != v; i++){
		size_t n = getEvent();
		switch(n){
			case setCell:
				printf("setCell\n");
				qt = set(qt, NP(0), NP(1), tr.base[NP(2)], depth);
			break;
			case getCell:
				printf("getCell\n");
				if(qt->get(NP(0), NP(1)));
				PR(2, NP(0), NP(1));
			break;
		}	
	}
	return EM_TRUE;
}

int main(){
	qt = etree(32);
	depth = 32;
	setup();

	//god this is awful XD
	emscripten_request_animation_frame_loop(evLoop, 0);
}
