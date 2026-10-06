const manMass = 63
const c = [334.7 * 350 / 100, 205 * 650 / 100, 205.34 * 300 / 100]
const names = ['батон традиционный', 'хлеб украинский', 'батон арбатский', 'хлебные дни', 'ккал/день', 'ккал/хлебный день', 'хлебн.кал./сут.норма']
const data = [[3, 0, 0, 2], [2, 1, 0, 2], [4, 0, 0, 2], [4, 1, 0, 2]]
const d0l = data[0].length
const dayIndex = d0l - 1

function load() {
	el('p').innerHTML = data.reduce((a, e, i) => a + (i % 2 ? '' : '<tr>') + '<td style="padding:0 30px 10px 0">' + insert(i, e)
		, '<table>'
	) + '</table>'
}

//white,black,days
function insert(n, v) {
	s = '<table>'
	a = count(v)
	names.forEach((e, i) => {
		s += '<tr><td>' + e + '<td>'
		id = ' id=' + n + i
		if (i < data.length) {
			//com parameter should be string
			s += '<input' + id + ' type=text value=' + v[i] + ' size=2 onkeyup=com("' + n + '")>'
				+ (i < c.length ? ' ' + formatNumber(c[i], 1) : '')
		}
		else {
			s += '<span' + id + '>' + a[i - data.length] + '</span>'
		}
	})
	return s + '</table>'
}

function com(n) {
	//console.log(n.target.id)
	getv(n).forEach((e, i) => el(n + (i + d0l)).innerHTML = e)
}

function getv(n) {
	v = []
	for (i = 0; i < d0l; i++) {
		try {
			a = eval(el(n + i).value)
			if (isNaN(a) || a < 0 || i == dayIndex && a > 7) {
				//if (isNaN(a) || a < 0 || !Number.isInteger(a) || i == dayIndex && (a < 1 || a > 6)) {
				throw new Error
			}
			v.push(a)
		}
		catch {
			return new Array(3).fill('?')
		}
	}
	return count(v)
}

function count(v) {
	cal = c.reduce((a, e, i) => a + e * v[i], 0)
	calDay = manMass * 29
	return [(calDay * 7 - cal) / (7 - v[dayIndex]), cal / v[dayIndex], cal / calDay].map((e, i) => formatNumber(e, i == 2 ? 2 : 1))
}