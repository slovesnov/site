function load() {
	s = '<table>'
	const m = 8
	for (i = 1; i < m; i++) {
		s += '<tr>'
		for (j = 0; j < 2; j++) {
			k = 10 + i + j * (m - 1)
			s += '<td>' + k + '<sup>2</sup> = ' + k * k
		}
	}
	s += '</table>'
	el('s51').innerHTML = s
}
