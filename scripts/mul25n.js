function load() {
	s = s1 = '<thead><tr><th><th style="text-align:center;">A*B<th style="text-align:center;">A&sup2;</thead>'
	for (i = 1; i <= 4; i++) {
		j = 25 * i
		k = 100
		for (l = 0; l < 2; l++) {
			if (l) {
				j *= 10
				k *= 10
			}
			s += '<tr><td>' + j + '<td>(' + j + '+a)(' + j + '&plusmn;b) = (' + j * j / k + '+' + f('(a&plusmn;b)', k / j, 0) + ')' + k + '&plusmn;ab'
				+ '<br>(' + j + '-a)(' + j + '-b) = (' + j * j / k + '-' + f('(a+b)', k / j, 0) + ')' + k + '+ab'
				+ '<td>(' + j + '&plusmn;a)&sup2; = (' + j * j / k + '&plusmn;' + f('a', k / j, 1) + ')' + k + '+a&sup2;'
		}
	}
	el('t').innerHTML = s

	s = s1
	for (i = 0; i < 2; i++) {
		j = 25 + (i ? '0' : '') + 'n'
		s += '<tr>' + '<td>' + j
		for (l = 0; l < 2; l++) {
			s += (l ? '<br>' : '<td>') + '(' + j + '+-'[l] + 'a)(' + j + '±-'[l] + 'b) = ['
				+ (i ? '<span class="fracb"><span>' : '')
				+ `(2${i ? '' : '.'}5n)&sup2;`
				+ (i ? '</span><span>10</span></span>' : '')
				+ ` ${'+-'[l]} <span class="fracb"><span>(a${'±+'[l]}b)n</span><span>4</span></span>]100${i ? '0' : ''}${'±+'[l]}ab`
		}
		s += '<td>(' + j + '±a)&sup2; = ['
		+ (i ? '<span class="fracb"><span>' : '')
		+ `(2${i ? '' : '.'}5n)&sup2;`
		+ (i ? '</span><span>10</span></span>' : '')
		+` ± <span class="fracb"><span>na</span><span>2</span></span>]100${i ? '0' : ''}+a&sup2;`
	}
	el('t1').innerHTML = s

}

function f(s, k, type) {
	if (k == 4 / 3) {
		return 3 + s + '/' + (type ? 2 : 4)
	}
	if (type) {
		k /= 2
	}
	if (k == .5) {
		return 2 + s
	}
	return s + (k == 1 ? '' : '/' + k)
}