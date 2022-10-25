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
	for(size_t i = 0; i != (1 << d); i++, printf("ad %zd\n", i))
		for(size_t j = 0; j != (1 << d); j++)
			printf("%zd ", a->get(j, i, d));
}

Node *set(Node *a, size_t x, size_t y, Node *v, size_t d){
	size_t w = 1 << d;
	size_t i = (x >= w) + 2*(y >= w);
	Node r(a->nf[0], a->nf[1], a->nf[2], a->nf[3]);

	if(d == 0)
		r.nf[i] = v;
	else
		r.nf[i] = set(r.nf[i], x & (w - 1), y & (w - 1), v, d-1);
				
	r.hash = r.hsh();
	return tr.get(r); 
}

Node* etree(size_t d){
	if(d == 0)
		return tr.base[0];

	Node* q = etree(d-1);
	return tr.get(Node(q,q,q,q));
}

Node* center(Node *a){
	Node* e = etree(depth - 2);
	return tr.get(Node(
		tr.get(Node(e,e,e,a->nf[0])),
		tr.get(Node(e,e,a->nf[1],e)),
		tr.get(Node(e,a->nf[2],e,e)),
		tr.get(Node(a->nf[3],e,e,e))
	));
}
//=================================================================

EM_JS(void, setup, (), {
	glob.ev = [];
	glob.alive = [];
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

EM_JS(void, CP, (), {
	glob.alive = [];		
});

EM_JS(void, PP, (size_t x, size_t y, size_t hsh), {
	if(hsh)
		glob.alive.push([BigInt(x + glob.c[1][0]), BigInt(y + glob.c[1][1])]);
});

EM_JS(void, PC, (), {
	postMessage([3, glob.alive]);
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

EM_JS(void, PI, (), {
	console.log(glob);		
});

//==================================================
enum{None, setCell, getCell, update, p, getCells};

EM_BOOL evLoop(double time, void* userData){
	size_t v = numEvents();
	for(size_t i = 0; i != v; i++){
		size_t n = getEvent();
		switch(n){
			case setCell:
				qt = set(qt, NP(0), NP(1), tr.base[NP(2)], depth - 1);
			break;
			case getCell:
				if(qt->get(NP(0), NP(1), NP(2)))
					PR(2, NP(0), NP(1));
			break;
			case update:
				qt = center(qt->solve(tr));
			break;
			case p:
				ptree(qt, 5);
				printf("items %zd\n", tr.items);
				PI();
			break;
			case getCells:
				CP();
				qt->map(NP(0) + (1 << (depth - 1)), NP(1) + (1 << (depth - 1)), NP(2), NP(3), depth - 1, PP);
				PC();
			break;
		}	
	}
	return EM_TRUE;
}

int main(){
	qt = etree(31);
	depth = 31;
	setup();

	//god this is awful XD
	emscripten_request_animation_frame_loop(evLoop, 0);
}
