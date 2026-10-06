function load() {
	a=gLanguage == 'russian'?['диаметр1', 'диаметр2', 'высота', 'объём']:['diameter1', 'diameter2', 'height', 'volume']
	s = a.reduce((a, e, i) => a + '<tr><td>' + e + `<td>`
		+ (i == 3 ? '<span id="o"></span>' : `<input type="text" id='${i}' oninput="r()">`), '<table>') + '</table>'
	el('p').innerHTML = s
	r()
}

function r() {
	try {
		a = []
		for (i = 0; i < 3; i++) {
			v = el(i).value
			if (v.length == 0) {
				throw 0
			}
			v = eval(v)
			if (isNaN(v)) {
				throw 0
			}
			a.push(v)
		}
		h = a[2]
		r1 = a[0]/2
		r2 = a[1]/2
		v = Math.PI / 3 * h * (r1 ** 2 + r2 ** 2 + r1 * r2)
		// if (isNaN(v)) {
		// 	throw 0
		// }
		s = formatNumber(v, 3)
	}
	catch {
		s = '?'
	}
	el('o').innerHTML = s
}