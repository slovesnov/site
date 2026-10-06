function load() {
	e = document.getElementsByTagName('h3')[0]
	e.innerHTML = e.innerHTML.replace(/\^(.)/g, '<sup>$1</sup>')
	let rows = 8, c = []
	s = '<table class="single"><thead><tr><th>n<th>треугольник Паскаля'
	for (j = 1; j < 4; j++) {
		s += '<th>' + (10 ** j + 1) + '<sup>n</sup>'
	}
	s += '</thead><tbody>'
	for (i = 0; i < rows; i++) {
		s += '<tr><td>' + i + '<td>'
		for (j = 0; j <= i; j++) {
			k = j == 0 || j == i ? 1 : c[j - 1] + c[j]
			if (j > 1) {
				c[j - 1] = pk
			}
			pk = k
			s += k + '&nbsp;'.repeat(3)
		}
		c.push(1)
		for (j = 1; j < 4; j++) {
			s += '<td>' + formatString((10n ** BigInt(j) + 1n) ** BigInt(i), ' ', j)
		}
	}
	s += '</tbody></table>'
	el('p').innerHTML = s
}
