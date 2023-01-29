let glob={ev:[], v:[0,0,1,1,0,0]};
onmessage=function(e){glob.ev.push(e.data);};
postMessage([4,[]]);
