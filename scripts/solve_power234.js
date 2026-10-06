gs = ['', '']
gl = gLanguage == 'russian' ? ['Квадратное уравнение.', 'Кубическое уравнение.', 'Уравнение четвёртой степени.', 'сброс', 'Введите коэффициенты полинома или корни.'] : ['Quadratic equation.', 'Cubic equation.', 'Quartic equation.', 'reset'
	, 'Input the coefficients of the polynomial or the roots.'
]

function load() {
	//should be init here because complex.js can be included after this script
	gsv = [[1, new Complex(1, 2), new Complex(1, -1), 2, 1]
		, [0, new Complex(3, 1), 5, new Complex(0, -1)]]

	const pl = ' style="padding-left:20px"'
	const rows = 0
	//value[pow-2][0-1][coeffients]
	value = [];
	s = gl[gl.length - 1];
	if (!rows) {
		s += '<table><tr>'
	}
	for (n = 0; n < 3; n++) {
		p = n + 2
		value[n] = []
		if (!rows) {
			s += `<td style="vertical-align:top${n == 1 ? ';background:#ddd' : ''}">`
		}
		s += `<h4>${gl[n]} <button class="comboboxbutton" onclick="reset(${n})">${gl[3]}</button></h4>`
		s += '<table><tr>'
		for (j = 0; j < 2; j++) {
			value[n].push([])
			s += '<td' + (j ? pl : '') + '><table>';
			for (let i = 0; i < p + 1 - j; i++) {
				e = na(i, j)
				v = gsv[j][i]
				k = n + '' + j + '' + i
				s += `<tr><td>${e}<td><input type="text" id="i${k}" oninput="input(event)" value="${v}">`
				value[n][j].push(v)
			}
			if (j == 1) {
				s += '<tr><td>&nbsp;'
			}
			s += '</table>';
		}
		s += `<tr><td><span id="po${2 * n}"></span><td ${pl}><span id="po${2 * n + 1}" style="padding-top:4px"></span>`
		s += '</table>';
	}
	if (!rows) {
		s += '</table>';

	}
	el('p').innerHTML = s

	for (i = 0; i < 6; i++) {
		s = ''
		p = Math.floor(i / 2) + 2
		for (k = 0; k <= p - (i % 2); k++) {
			if (k && !(i % 2)) {
				s += '+'
			}
			j = p - k
			if (i % 2) {
				s += '(x-' + na(k, 1) + ')'
			}
			else {
				s += na(k, i % 2) + (j == 0 ? '' : ('x' + (j == 1 ? '' : '<sup>' + j + '</sup>')))
			}
		}
		gs[i] = s + ' =<br>= '
		recountP(i)
	}
}

function na(n, i) {
	return i == 0 ? String.fromCharCode('a'.charCodeAt(0) + n) : `x<sub>${n + 1}</sub>`
}

function input(e) {
	let t = e.target
	let v = null, a, re = 0, im = 0, i;
	let i1 = +t.id[1];//pow-2
	let i2 = +t.id[2];//0,1
	let i3 = +t.id[3];//index
	a = t.value.toLowerCase().split(/(?<!(?:e|^))([+-])/)
	if (a.length <= 3 && t.value.length) {
		if (a.length == 3) {
			i = a.pop()
			a[1] += i;
		}
		if (a.length == 2 && a[0].endsWith('i') + a[1].endsWith('i') == 1 || a.length == 1) {
			a.forEach(e => {
				if (e.endsWith('i')) {
					i = e.slice(0, -1)
					// console.log(i,Number(e.slice(0, -1)))
					im = (i == '+' || i == '') ? 1 : (i == '-' ? -1 : Number(e.slice(0, -1)))
				}
				else {
					re = Number(e)
				}
			})
			if (im !== null && re !== null && !isNaN(re) && !isNaN(im)) {
				v = new Complex(re, im)
			}
		}
	}
	if (i2 == 0 && i3 == 0 && v == 0) {
		v = null
	}
	value[i1][i2][i3] = v
	el(t.id).style.color = v === null ? 'red' : 'black'
	recountP(i1 * 2 + i2)
}

function recountP(n) {
	// console.log(n)
	let b
	let p0 = Math.floor(n / 2)
	let s, v = value[p0][n % 2]
	//console.log(v)
	b = v.every(e => e !== null)
	if (b && n % 2) {
		v = createPolynomial(v)
	}
	//console.log(n,b)
	s = 'f(x) = ' + gs[n] + (b ? polynomialString(v) : '?');// + ' = 0'
	if (b) {
		s += solven(p0 + 2, v).reduce((a, e) => a + '<br>f( ' + (e instanceof Complex ? e.toString() : formatNumber(e, 5))
			+ ' ) = ' + countPolynomial(e, ...v).toString()
			, '');
	}
	el('po' + n).innerHTML = s
}

//create polynomial from roots
function createPolynomial(...v) {
	if (Array.isArray(v[0])) {
		v = v[0]
	}

	let i, p, a = [1], c;
	for (i = 1; i <= v.length; i++) {
		c = new Complex(0)
		p = new Permutations(i, v.length, Permutations.COMBINATIONS);
		for (const e of p) {
			c.addEq(e.reduce((a, e) => a.mul(v[e]), new Complex(1)))
		}
		if (i % 2) {
			c = c.unaryMinus()
		}
		a.push(c)
	}
	return a
}

function polynomialString(...v) {
	if (Array.isArray(v[0])) {
		v = v[0]
	}
	let r = '', i, j, k, s, l = v.length
	for (i = 0, j = l - 1; i < l; i++, j--) {
		k = new Complex(v[i])
		if (k.isZero()) {
			continue;
		}
		s = k.toString()
		if (k.hasTwoParts() && j != 0) {
			if (r != '') {
				r += '+'
			}
			r += '(' + s + ')'
		}
		else {
			r += (['+', '-'].includes(s[0]) || r == '' ? '' : '+')
			if (j == 0 || (s != '1' && s != '-1')) {
				r += s
			}
			else if (s == '-1') {
				r += '-'
			}
		}
		if (j != 0) {
			r += 'x' + (j == 1 ? '' : '<sup>' + j + '</sup>')
		}
	}
	return r
}

function countPolynomial(...v) {
	if (Array.isArray(v[0])) {
		v = v[0]
	}
	let x = v.shift();
	return v.reduce((a, e) => a.mul(x).add(e), new Complex(v.shift()));
}

function solve2(...v) {
	let [a, b, c] = preparePolynom(v, 2)
	let D = b.mul(b).sub(a.mul(c).mul(4))
	let x = D.root(2).map(e => e.div(a.mul(2)))
	return adjustRoots(x, a, b)
}

function solve3(...v) {
	let [a, b, c, d] = preparePolynom(v, 3)
	let p = c.div(a).sub(b.mul(b).div(a.mul(a).mul(3)))
	let q = b.pow(3).mul(2).div(a.mul(3).pow(3)).sub(b.mul(c).div(3).div(a.pow(2))).add(d.div(a))
	let D, x
	if (p.isZero()) {
		x = q.unaryMinus().root(3);
	}
	else {
		D = q.div(2).pow(2).add(p.div(3).pow(3))
		x = q.div(-2).add(D.root(2)[0]).root(3)
		x = x.map(e => p.div(-3).div(e).add(e))
	}
	return adjustRoots(x, a, b)
}

function solve4(...v) {
	let [a, b, c, d, e] = preparePolynom(v, 4)
	let a2 = a.pow(2)
	let a3 = a2.mul(a)
	let p = c.div(a).sub(b.pow(2).mul(3).div(8).div(a2))
	let q = d.div(a).sub(b.mul(c).div(a2.mul(2))).add(b.pow(3).div(a3.mul(8)))
	let r = e.div(a).sub(b.mul(d).div(a2.mul(4))).add(b.pow(2).mul(c).div(a3.mul(16))).sub(b.pow(4).div(a3.mul(a).mul(256 / 3)))
	let s, x, y
	if ([p, q, r].every(e => e.isZero())) {
		y = [0, 0, 0, 0]
	}
	else {
		y = []
		s = solve3(2, p.unaryMinus(), r.mul(-2), r.mul(p).sub(q.mul(q).div(4)))
		s = s.find(e => !(e.mul(2).sub(p).isZero()))
		s.mul(2).sub(p).root(2).forEach(e => {
			x = solve2(1, e, s.sub(q.div(2).div(e)))
			y = y.concat(x)
		})
	}
	return adjustRoots(y, a, b)
}

function solven(n, a) {
	if (n == 4) {
		return solve4(a)
	}
	else if (n == 3) {
		return solve3(a)
	}
	else if (n == 2) {
		return solve2(a)
	}
}

function preparePolynom(v, n) {
	if (Array.isArray(v[0])) {
		v = v[0]
	}
	const c = n + 1
	if (v.length != c) {
		throw new Error('invalid number of coefficients ' + v.length + ' expected' + c)
	}
	return v.map(e => new Complex(e))
}

function adjustRoots(v, a, b) {
	return v.map(e => new Complex(e).sub(b.div(a.mul(v.length))))
}

function reset(n) {
	let a, i, j, k, p = n + 2, v
	for (j = 0; j < 2; j++) {
		a = []
		for (i = 0; i < p + 1 - j; i++) {
			k = n + '' + j + '' + i
			v = j == 0 && i == 0 ? 1 : 0
			a.push(v)
			el('i' + k).value = v
		}
		value[n][j] = a
		recountP(n * 2 + j)
	}

}