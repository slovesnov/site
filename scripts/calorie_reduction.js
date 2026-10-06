const cc = [4, 9, 4]
const cc1 = [[30, 65, 300], [0, 20, 100], [1, 3, 10], [1, 12, 24]]
const distr = [50, 70]
const seps = ' / '

const imass = 5
const itotal = 9
const igkgday = itotal + 1
const withoutReduction = igkgday + 3
const ihelp = withoutReduction + 2
const ihelpPerMeal = ihelp + 1
const ihelpBreak = ihelpPerMeal + 1
const ihours = ihelpBreak + 1
const ihoursn = ihours + 1
const iname = ihoursn + 1
const idrygroat = iname + 1
const icookedgroat = idrygroat + 1
const iprotein = icookedgroat + 1

lng = gLanguage == 'russian' ? [
	'белки', 'жиры', 'углеводы', 'ккал', 'ккал/кг/день'
	, 'масса (кг)', 'снижение калорийности %', 'число приёмов пищи', 'часов на все приёмы пищи'
	, 'в день всего' + seps + 'растительный' + seps + 'животный', 'г/кг/день', '% калорийности', 'за один приём пищи всего' + seps + 'растительный' + seps + 'животный'
	, 'без снижения', 'со снижением'
	, 'Соотношение растительного/животного белка ' + di(0) + ', растительного/животного жира ' + di(1) + '. Приёмы пищи распределяются равномерно по калориям и по времени в течение дня, последний приём пищи за 4 часа до сна + 8 часов на сон, то есть на все приёмы пищи остаётся 12 часов. Значит перерыв между приёмами пищи в часах равен 12/(число_ приёмов_пищи-1).', 'За приём пищи.', 'перерыв между приёмами пищи', 'ч', '24 - число_часов_на_сон - (3 или 4)'
	, 'название', 'сухая крупа', 'готовая крупа', 'б', 'ж', 'у', 'ккал/100г', 'масса'
] :
	['protein', 'fat', 'carbohydrates', 'kcal', 'kcal/kg/day'
		, 'mass (kg)', 'calorie reduction %', 'number of meals', 'hours for all meals'
		, 'per day total' + seps + 'vegetable' + seps + 'animal', 'g/kg/day', 'calorie %', 'per meal total' + seps + 'vegetable' + seps + 'animal'
		, 'without reduction', 'with reduction'
		, 'The proportion of vegetable/animal protein ' + di(0) + ', vegetable/animal fat ' + di(1) + '. Meals are distributed evenly by calories and time during the day, the last meal is 4 hours before bedtime + 8 hours for sleep, that is for all meals remains 12 hours. So the break between meals in hours is 12/(number_of_meals-1).', 'Per meal.', 'interval between meals', 'h', '24 - number_of_hours_for_sleep - (3 or 4)'
		, 'name', 'dry groat', 'cooked groat', 'p', 'f', 'c', 'kcal/100g', 'mass'
	]
const ai = ['', '10-20%', '3-6, ' + lng[ihelpBreak] + ' <span id="s"></span>', lng[ihoursn]]

/*овощи мин.400 желательно хотя бы 800-1000г
курица 16	14	
сельдь 18.4	11.7	
яйцо 12.7	11.5	0.7
творог 9% 16	9	3
https://youtu.be/5WfXeQDz3P4?t=834

/на 4 приёма пищи
1{
гречка 59.2
вода 200%
курица 100*8.1/16
масло подсолнечное 16.3-100*8.1/16*.14
капуста 250
}

овощи/каша=2

воды 4*(59.2*2+100*8.1/16*.74+250*.92)=1543
нужно 29*65=1885
*/
function load() {
	prepareGGroats()
	// console.log(withoutReduction-igkgday)
	s = '<table>'
	for (i = 0; i < ai.length; i++) {
		// style=background:red
		s += `<tr><td>${lng[imass + i]}<td>`
			+ inp('i' + i, cc1[i], 'i')
			+ `<td${i > 1 ? ' colspan=5' : ''}>${ai[i]}`
		if (i == 0) {
			s += '<td>'
			for (j = 0; j < 4; j++) {
				s += '<td>' + lng[j == 3 ? 4 : j]
			}
		}
		else if (i == 1) {
			s += '<td id="gkg">' + lng[igkgday]
			for (j = 0; j < 4; j++) {
				s += '<td>' + inp('g' + j, [1, 1, 4, 29][j], 'g')
			}
		}
	}
	s += '</table>' + lng[ihelp]
	for (k = 0; k < 2; k++) {
		s += '<table id="t' + k + '" class="t table_common single table_color">'
		for (j = 0; j < withoutReduction - igkgday + 2; j++) {
			if (!j) {
				s += '<thead>'
			}
			s += '<tr>'
			for (i = 0; i <= imass; i++) {
				s += j ? '<td>' : '<th>'
				if (j == 0) {
					s += lng[i == 0 ? withoutReduction + k : i - 1]
				}
				else {
					if (i == 0) {
						s += lng[itotal + j - 1]
					}
				}
			}
			if (!j) {
				s += '</thead>'
			}
		}
		s += '</table><p id="p' + k + '"></p>'
	}
	el('p').innerHTML = s
	recount();
}

function recount(e) {
	//m - mass
	//let i, j, r, v, a, b, 
	m = nu('i0'), percent = nu('i1') / 100, n = nu('i2')
	if (!Number.isInteger(n)) {
		n = NaN
	}
	if (e !== undefined) {
		r = e.target.id;
		if (r[0] == 'g') {
			i = Number(r[1])
			if (i == 3) {
				for (j = 0; j < 3; j++) {
					el('g' + j).value = [4, 9, 16][j] * el('g3').value / 29 / cc[j]
				}
			}
			else {
				r = 0;
				for (j = 0; j < 3; j++) {
					a = Number(el('g' + j).value)
					if (a < 0) {
						a = NaN
					}
					r += cc[j] * a
				}
				el('g3').value = r
			}
		}
	}
	for (j = 0; j < 2; j++) {
		a = []
		r = el('t' + j).rows
		v = 0
		for (i = 0; i < 3; i++) {
			b = nu('g' + i)
			v += b * cc[i]
			a.push(m * b - (i == 2 && j == 1 ? v * m * percent / cc[2] : 0))
		}
		if (j) {
			v *= 1 - percent
		}
		b = [v * m, v];
		b.forEach((e, i) => r[1].cells[i + 4].innerHTML = f(e))
		r[4].cells[4].innerHTML = f(b[0] / n)
		a.forEach((e, i) => [i == 2 ? f(e) : f1(e, distr[i] / 100)
			, f(e / m)
			, f(e * 100 / m * cc[i] / v, '%')
			, i == 2 ? f(e / n) : f1(e / n, distr[i] / 100)].forEach((e, j) => r[j + 1].cells[i + 1].innerHTML = e)
		)

		fk = (e, k, n) => isNaN(k) || isNaN(n) || n <= 0 ? '?' : formatNumber(e / k, 1)
		a1 = lng.slice(iprotein, iprotein + 5)
		s = gGroats.reduce((q, e) => {
			k = e.kmEnd == '?' ? NaN : 1 + e.kmEnd
			c = e.cal
			mc = a[2] / n * 100 / e.c
			//console.log(n)
			return q + '<tr><td>'
				+ [e.name, e.p, e.f, e.c, c
					, n <= 0 || isNaN(n) ? '?' : formatNumber(mc, 1)
					, ''
					, fk(e.p, k, n)
					, fk(e.f, k, n)
					, fk(e.c, k, n)
					, fk(c, k, n)
					, fk(mc, 1 / k, n)
				].join('<td>')
		}, '<table class="table_common table_border table_color t2"><thead><tr><th><th colspan="5">'
		+ lng[idrygroat] + '<th><th colspan="5">' + lng[icookedgroat] + '<tr><th>'
		+ [lng[iname], ...a1, '', ...a1].join('<th>') + '</thead>') + '</table>'
		el('p' + j).innerHTML = lng[ihelpPerMeal] + s
	}
	if (n == 1) {
		j = 24
	}
	else {
		i = el('i3').value / (n - 1)
		j = f(i)
	}
	b = j != '?' && !Number.isInteger(i)
	j += ' ' + lng[ihours]
	if (b) {
		a = timeToString(i * 3600)
		b = a.lastIndexOf(':')
		j += ' = ' + a.slice(0, b)
	}
	el('s').innerHTML = j
}

function nu(id) {
	let k = el(id).value
	return k.length ? Number(k) : NaN
}

function inp(id, value, class_) {
	let b = id[0] == 'i'
	return `<input type="${b ? 'number' : 'text'}" id="${id}" class="${class_}" value="${b ? value[1] : value}" onkeyup="recount(event)"${b ? ' onchange="recount(event)" min="' + value[0] + '" max="' + value[2] + '"' : ''}></input>`
}

function di(i) {
	return distr[i] + '/' + (100 - distr[i])
}

function f(v, a = '') {
	return isFinite(v) && v >= 0 ? formatNumber(v, 1) + a : '?'
}

function f1(v, percent) {
	return f(v) + seps + f(v * percent) + seps + f(v * (1 - percent))
}
