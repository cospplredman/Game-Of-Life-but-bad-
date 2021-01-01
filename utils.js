function lerp(start, end, t) {
	return (1-t)*start+t*end;
}
function clamp(val, min, max) {
	return (val <= max ? (val >= min ? val : min) : max);
}