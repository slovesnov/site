g = []
l = gLanguage == 'russian' ? ['рост (метры или сантиметры)', 'диапазон массы или масса (кг)', 'слишком широкий диапазон', 'масса', 'имт'] : ['height (meters or centimeters)', 'mass range or mass (kg)', 'too wide range', 'mass', 'bmi']

function load() {
	a = ['h', 'm']
	b = ['1.78', '58.6 80']
	el('p').innerHTML = a.reduce((a, e, i) => a + l[i] + ` <input type="text" id="${e}" value="${b[i]}" style="width:60px" oninput="c(this);showTable()">` + (i ? '' : ' '), '') + `<p id='t'>`
	a.forEach(e => c(el(e)))
	showTable()
}

function showTable() {
	if (g.some(e => e === null)) {
		el('t').innerHTML = ''
		return
	}
	const step = .1
	const as = 1
	const maxColumns = 8
	//cann't use (g[2] - g[1]) / step - (63.9-60)*10=39.99999
	steps = Math.floor(g[2] * 10) - Math.floor(g[1] * 10) + 1
	//rows*columns>=steps
	rows = Math.floor(steps / maxColumns) + (steps % maxColumns ? 1 : 0);
	columns = Math.floor(steps / rows) + (steps % rows ? 1 : 0)
	s1 = '<th>' + l.slice(-2).join('<th>')
	s = "<table class='table_border table_color'><thead><tr style='font-size:70%'>" + (s1 + (as ? '<th style="width:15px">' : '')).repeat(columns - 1) + s1 + "</thead><tbody>"
	for (i = 0; i < rows; i++) {
		s += '<tr>'
		for (j = 0; j < columns && j * rows + i < steps; j++) {
			m = g[1] + i * step + j * rows * step
			s += [m, m / (g[0] ** 2)].map((e, i) => '<td>' + formatNumber(e, i + 1)).join('') + (as && j < columns - 1 ? '<td style="background:#e8e4e5">' : '')
		}
	}
	el('t').innerHTML = s + '</tbody></table>'
}

function c(e) {
	mass = +(e.id == 'm')
	m = e.value.trim().split(/\s+/).map(e => +e)
	ok = m.every(e => isFinite(e))
	f = e => e > 300 ? e / 10 : e
	am = () => {
		for (i = 0; i < 1 + mass; i++) {
			g[i + 1 - !mass] = ok ? m[i] : null
		}
	}

	if (ok) {
		if (mass) {
			//allow 586 instead of 58.6
			m = m.map(f)
			if (m.length == 1) {
				m[1] = m[0]
			}
			else if (m.length != 2 || m[0] > m[1]) {
				ok = false
			}
			am()
		}
		else {
			if (m.length > 0) {
				if (m[0] > 3) {//allow 178 instead of 1.78
					m[0] /= 100
				}
			}
			if (m.length > 2) {
				ok = false
			}
			am()
			if (m.length > 1) {//allow "1.78 93"
				mass = true
				m[0] = m[1] = f(m[1])
				am()
			}
		}
	}
	e.style.color = ok ? 'black' : 'red'
}