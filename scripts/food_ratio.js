let mass = 75;//do not use const
let tp = `${mass}*2`;//do not use const
const ka = [2, 1.6, 1]
const chicken = ['курица', 16, 14, 0]
const pollock = ['минтай', 19.44, 0.98, 0]
const peanut = ['горох', 23, 1.6, 48.1]
const millet = ['пшено', 11.5, 3.3, 64.8]
const egg = ['яйцо', 12.7, 11.5, 0.7]
const goods = [
	chicken, millet
	, chicken, peanut
	, pollock, chicken
	, pollock, peanut
	, pollock, egg
]
const la = chicken.length
const cl = ['LemonChiffon', 'Azure', 'rgb(253,233,217)', 'rgb(238,210,238)']
const usename = 1
const pfc = 'бжу'
const pfcc = 'бжук'
const kg = ['kg', '']
const kc = [4, 9, 4]

function load() {
	a = []
	//have to do copy because of a[+i[0]][+i[1]][+i[2] + 1] = v
	for (i = 0; i < goods.length; i += 2)
		a.push([[...goods[i]], [...goods[i + 1]]])

	s = `<table id='t'><tr>${td(2 * pfc.length)}масса на ${inp('tp', tp, 35)}г белка, масса человека ${inp('mass', mass, 25)}`
	tp = evs(tp)
	ka.forEach((e, i) => s += f(i) + `белок/жир=` + inp('k' + i, e))
	sl = td(pfc.length)

	a.forEach((e, i) => {
		h = j => usename ? e[j][0] : 'масса' + 'AB'[j]
		s += `<tr>` + td(la + ka.length) + `&nbsp;`//<hr>

		s += `<tr>`
		for (j = 0; j < 2; j++) {
			s += sl + e[j][0]
		}
		for (j = 0; j < ka.length; j++) {
			for (k = 0; k < 2; k++) {
				s += f(j, 1) + h(k) + sp('m' + i + j + k)
			}
		}

		s += `<tr>`
		for (j = 0; j < 2; j++) {
			[...pfc].forEach((q, k) => s += `<td>` + q + inp(i + '' + j + k, e[j][k + 1], 43))
		}
		for (j = 0; j < ka.length; j++) {
			b = getS(e, ka[j], tp)
			s += f(j) + h(0) + ' / ' + h(1) + ' = ' + sp('mr' + i + j)
		}

		s += `<tr>`
		for (j = 0; j < 2; j++) {
			s += sl + `белок/жир=` + sp('r' + i + j)
		}
		['/кг', ''].forEach((q, k) => {
			s += k ? `<tr>` + sl.repeat(2) : ''
			for (j = 0; j < ka.length; j++) {
				s += f(j) + pfcc + q + sp('pfc' + kg[k] + i + j)
			}
		})
	})
	s += `</table>`
	el('p').innerHTML = s
	fillTable()
}

td = (c, s = '') => `<td` + (c == 1 ? '' : ` colspan=` + c) + s + `>`

f = (i, c = 2) => td(c, ` style='padding-left:2px;padding-right:2px;background:${cl[i % cl.length]}'`)

sp = e => `<span id='${e}'>`

inp = (id, value, w = 50) => `<input type='text' style='width:${w}px' id=${id} value=${value} oninput="oninp(this)">`

evs = e => {
	let v = evaluateString(e)
	return v === false ? NaN : v
}

oninp = e => {
	i = e.id
	v = evs(e.value)
	if (i == 'tp') {
		tp = v
	}
	else if (i == 'mass') {
		mass = v
	}
	else if (i[0] == 'k') {
		ka[+i.slice(1)] = v
	}
	else {
		a[+i[0]][+i[1]][+i[2] + 1] = v //+i[2]+1 because of name
	}
	fillTable()
}

getS = (a, ke, tp) => {
	let [name1, p1, f1] = a[0], [name2, p2, f2] = a[1], v = p1 - ke * f1, b = v == 0
	if (v == 0)
		return [Infinity, 100 * tp / p1, 0]
	//k*m/100*p1+m/100*p2=tp
	let k = (ke * f2 - p2) / v, m = tp * 100 / (k * p1 + p2)
	return [k, Math.round(m * k), Math.round(m)]
}

fn = (v, digits = 2) => isFinite(v) ? formatString(normalize(v, digits), ',') :
	(isNaN(v) ? '?' : ((v == Infinity ? '' : '-') + '&infin;'))

fillTable = () => {
	a.forEach((e, i) => {
		for (j = 0; j < ka.length; j++) {
			t = [...pfcc].fill(0)
			b = getS(e, ka[j], tp)
			el('mr' + i + j).innerHTML = fn(b[0])
			for (k = 0; k < 2; k++) {
				q = b[k + 1]
				el('m' + i + j + k).innerHTML = fn(q, 2)
				for (l = 0; l < t.length - 1; l++) {
					t[l] += q / 100 * e[k][l + 1]
				}
			}
			t[l] = t.slice(0, -1).reduce((a, e, i) => a + e * kc[i], 0)
			for (k = 0; k < 2; k++)
				el('pfc' + kg[k] + i + j).innerHTML = t.reduce((a, e) => a + ' &nbsp; ' + fn(e / (k ? 1 : mass), k ? 0 : 2), '')
		}
		for (j = 0; j < 2; j++) {
			el('r' + i + j).innerHTML = fn(e[j][1] / e[j][2])
		}
	})
}
