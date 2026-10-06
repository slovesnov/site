/*https://tehtab.ru/Guide/GuidePhysics/GuidePhysicsHeatAndTemperature/SpecificHeat/FoodStuffSpecHeatCapacity/
теплоемкость продуктов
картофель 3430 дж/кг/град
*/
lng = gLanguage == 'russian' ?
	['масса', 'граммы', 'время', 'секунды / мм:cc', 'изменение температуры', 'градусы', 'теплоемкость', 'дж/кг/град', 'мощность', 'ватты'
		, 'параметр', 'единица измерения', 'значение']
	:
	['mass', 'grams', 'time', 'seconds / mm:ss', 'temperature change', 'degrees', 'heat capacity', 'j/kg/deg', 'power', 'watts'
		, 'parameter', 'measure', 'value']

p = ['m', 't', 'te', 'c', 'w']

a = [
	{ m: 132, t: '60*1', c: 4200, w: 800 }
	, { m: 200, te: 20, c: 4200, w: 800 }
	, { te: 60, t: '60*1', c: 4200, w: 800 }
]

function load() {
	s = ''
	a.forEach((e, i) => {
		s += '<table class="t"><tr>' + implode(lng.slice(-3), '<th>')
		p.forEach((e1, j) => {
			id = ' id="' + e1 + i + '"'
			b = lng.slice(2 * j, 2 * j + 2)
			if (j == 1 && i != 1) {
				k = b[1].indexOf(' ')
				b[1] = b[1].slice(0, k)
			}
			s += '<tr>' + implode(b, '<td>') + (e[e1] === undefined ? '<td' + id + '>'
				: '<td><input type="text"' + id + ' value="' + e[e1] + '" onkeyup="r(' + i + ')">')

		})
		s += '</table>'
	})

	el('p').innerHTML = s
	for (i = 0; i < a.length; i++) {
		r(i)
	}
}

function r(i) {
	v = {}
	b = a[i]
	p.forEach(e => {
		if (b[e] === undefined) {
			nf = e
			return
		}
		l = el(e + i)
		try {
			c = eval(l.value)
			if (typeof c != 'number' || c < 0) {//eval('')=undefined eval('Math.sin')
				throw 0;
			}
			v[e] = c
			ok = 1;
		}
		catch {
			ok = 0;
		}
		l.style.color = ok ? 'black' : 'red';
	})
	t = 0
	if (Object.keys(v).length == p.length - 1) {
		/*
		te = t*w/c/m
		t = te*c*m/w
		m = t*w/c/te
		*/
		if (v.m !== undefined) {
			v.m /= 1000
		}
		if (nf == 'te') {
			c = v.t * v.w / v.c / v.m
		}
		else if (nf == 't') {
			c = v.te * v.c * v.m / v.w
		}
		else if (nf == 'm') {
			c = v.t * v.w / v.c / v.te
			c *= 1000
		}
		else {
			throw 0
		}

		if (!isNaN(c)) {
			t = (c != Infinity) + 1
		}
	}
	b = ['?', '&infin;', formatNumber(c, 0)]
	s = b[t]
	if (i == 1) {
		b[2] = timeToString(c)
		s += ' / ' + b[t]
	}
	el(nf + i).innerHTML = s
}
