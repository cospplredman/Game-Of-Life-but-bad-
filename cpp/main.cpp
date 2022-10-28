#include"stdio.h"
#include"qtree.h"
#include<chrono>

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
			printf("%zd ", a->get(j, i, d) & 1);
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

size_t sum(Node *a){
	size_t c = 0;
	for(size_t i = 0; i != 4; i++)
		c += a->nf[i]->hash & 1;

	return c;
}

size_t outer(Node *b){
	size_t c = 0;
	for(size_t i = 0; i != 4; i++)
		c += sum(b->nf[i]) - (b->nf[i]->nf[3-i]->hash & 1);

	return c;
}

Node *adapt(Node* b){
	ptree(b, 2);
	printf("out %zd, sum %zd\n", outer(b), sum(b));
	if(outer(b)){
		b = center(b);
		depth++;
		return center(b);
	}
	return center(b);
}

//=================================================================

EM_JS(void, setup, (), {
	glob.ev = [];
	glob.alive = [];
	glob.v = [0,0,0,0,0];
	onmessage = async function(e) {
		glob.ev.push(e.data);
	};
	postMessage([4,[]]);
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
		glob.alive.push([(x + glob.v[0]) , (y + glob.v[1])]);
});

EM_JS(void, PC, (), {
	postMessage([3, [glob.alive, glob.v]]);
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

EM_JS(void, SV, (), {
	glob.v = glob.c[1];
});

EM_JS(void, SAT, (double q), {
	postMessage([5, [q]]);	
});

//==================================================
enum{None, setCell, getCell, update, p, getCells, getView, getPause, getTps};
size_t x, y, w, h, pause = 1, tps = 10, vd=0, sd=1;
double aft = 0.065;
std::chrono::high_resolution_clock::time_point frameStart;

void sendCells(){
	CP();
	size_t qd = depth - vd - 1;
	qt->map(x + (1 << (qd)), y + (1 << (qd)), w, h, qd, PP);
	PC();
}

void setSd(size_t a){
	if(a < 1)
		a = 1;
	if(sd != a){
		tr.forgetNext();
		sd = a;	
	}
}

size_t l2(size_t a){
	size_t c = 0;
	while(a){
		a>>=1;
		c++;
	}

	return c;
}

EM_BOOL evLoop(double time, void* userData){
	auto frameEnd = std::chrono::high_resolution_clock::now();
	auto frameTime = std::chrono::duration_cast<std::chrono::microseconds>(frameEnd - frameStart);
	double ft = std::chrono::duration<float>(frameTime).count();


	size_t uv = 0;

	size_t mx = 0;
	size_t cu = 0;

	size_t v = numEvents();
	for(size_t i = 0; i != v; i++){
		size_t n = getEvent();
		switch(n){
			case setCell:
				qt = set(qt, (uint64_t)(NP(0) + (1 << 30)) << vd, (uint64_t)(NP(1) + (1 << 30)) << vd, tr.base[NP(2)], depth - 1);
				uv = 1;
			break;
			case p:
				ptree(qt, 5);
				printf("tableSize %zd, items %zd, depth %zd\n", tr.memo.l2sz, tr.items, depth);
				for(size_t i = 0; i != tr.memo.l2sz; i++){
					if(tr.memo.m_key[i]){
						cu++;
					}else{
						if(cu > mx)
							mx = cu;
						cu = 0;
					}
				}
				printf("\n");
				printf("biggest cluster %zd \n", mx);
			break;
			case getView:
				x = NP(0), y = NP(1), w = NP(2), h = NP(3), vd = NP(4);
				SV();
				uv = 1;
			break;
			case getPause:
				pause = NP(0);
			break;
			case getTps:
				tps = NP(0);
			break;
		}	
	}

	if(!pause){
		if((float)tps > 1.0/std::chrono::duration<float>(frameTime).count()){
			setSd(l2((double)tps / (1.0/aft)));
			double atps = 1.0/std::chrono::duration<float>(frameTime).count() * (1 << (sd - 1));
			SAT(atps);
			frameStart = std::chrono::high_resolution_clock::now();
			//for when i get around to abitrarily sized maps
			//qt = adapt(qt->solven(tr, depth, sd));
			qt = center(qt->solven(tr, depth-2, sd));
			uv = 1;
		}else if(tps == 0){
			setSd(depth-2);
			double atps = 1.0/std::chrono::duration<float>(frameTime).count() * (1 << (sd - 1));
			SAT(atps);
			frameStart = std::chrono::high_resolution_clock::now();
			qt = center(qt->solve(tr));
			uv = 1;
		}
		aft = (99.0*aft + ft)/100.0;
	}

	if(uv)
		sendCells();

	//printf("%f fill%%\n", (float)tr.items / (float)tr.memo.l2sz);
	if((float)tr.items / (float)tr.memo.l2sz > 0.6)
		tr.prune(qt, depth);

	return EM_TRUE;
}

int main(){
	qt = etree(31);
	depth = 31;
	setup();
	frameStart = std::chrono::high_resolution_clock::now();

	//god this is awful XD
	emscripten_request_animation_frame_loop(evLoop, 0);
}
