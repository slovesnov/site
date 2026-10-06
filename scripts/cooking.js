coefficients = [2, 4, 2.35]
potMass = 965
dmass = 1500;
inputvalue = [80, 3];
inputid = ['ik', 'it0'];
pho = [1.2, .85]
tareChecked = 0
TC = 'tc'
goods = [
	['белый/черный хлеб сухой', 90, 2, 'белый хлеб 180/4 360/6, проверка 260']
	, ['семечки 500г/10мин', 1 / 0.015965508, 2.018366593, 'много точек']
	//, ['свекла', 30]
	, ['курица', 36]
	, ['капуста', 40]
	, ['картофель', 80, 3, '200/5.5 240/6, проверка 400']
	, ['арахис 500г/(4+3.5)мин', 500 / 7.5]
	//, ['яйцо nCO=n*61.1 (n+1)/2мин', 61.1 * 2, 1 / 2, '1СО/1 2СО/1.5']
	// , ['геркулес 250г/3мин+6', 250 / 3]
	// , ['макароны 335г/4+6мин+4', 335 / 10]
	, ['пользовательский', input(0), input(1)]
]
const DRY_COLUMNS = 5
const ALL_DRY_COLUMNS = DRY_COLUMNS + 1
const SS = ['соль', 'сахар']

function fn(v, p = 1) {
	return [formatNumber(v, p), v]
}

function load() {
	prepareGGroats()

	d = goods.map((e, i) => [e[0]
		, ''
		, i + 1 == goods.length ? e[1] : fn(e[1])
		, i + 1 == goods.length ? e[2] : (e[2] ? formatNumber(e[2], 2) : '')
		, e[3]
	]
	)
	gtable = new Table([['масса <input type="text" id="ic" value=' + dmass + ' oninput="com1()" style="width:135px;">', '<span id="mc"><span>', ['t = m / k + t<sub>0</sub>', 2], ''], [
		'<label for="tare">вычесть тару 888г</label><input type="checkbox" id="tare"'
		+ (tareChecked ? ' checked' : '') + ' onclick="com1()">'
		, 'время', 'k', 't<sub>0</sub>', 'комментарий']], d, { class: 'tc', id: TC, o: "csb" })

	f = (v, d = 1) => [v.toFixed(d), v]

	a = gGroats.map(e => {
		['p', 'f', 'c', 'cal'].forEach(q => e['m' + q] = e[q] / (e.kmEnd + 1))
		return [e.name, f(e.rho, 2), e.p, e.f, e.c, e.cal, e.km, f(e.kv)
			, f(e.mp), f(e.mf), f(e.mc), f(e.mcal), e.cm, '']
	})
	gtcolumns = a[0].length

	q = ['б', 'ж', 'у', 'кк']
	t = [['', ['сухая крупа', DRY_COLUMNS], ['микроволновка (мои рецепты) &nbsp; k<sub>m</sub>=k<sub>v</sub>/&rho; &nbsp; масса <input type="number" id="mg" value="100" style="width:90px;margin-right:20px;" oninput="countm()">', gtcolumns - ALL_DRY_COLUMNS]]
		, ['имя', '&rho;', ...q
		, 'k<sub>m</sub>'
		, 'k<sub>v</sub>', ...q
		, 'рецепт', 'вода'
	]]
	gt = new Table(t, a, { class: 'tc tg', o: 'cs0b' })

	d = []
	grainMap = new Map([
		['пшенная', 'пшено'],
		['рисовая', 'рис'],
		['ячневая', 'перловка'],
		['манная', 'манка'],
	]);

	//1982 Лабзина А.Я., Васильченко Е.В., Кузнецова Л.Н. - Обслуживающий труд [страница 22]
	`гречка
рассыпчатая 1.5 21 
вязкая 3.2 40
геркулес
вязкая 3.2 40 
жидкая 4.2 50
рисовая
рассыпчатая 2.1 28 
вязкая 3.7 45
жидкая 5.7 65
манная
вязкая 3.7 45
жидкая 5.7 65 
перловка
рассыпчатая 2.4 30
вязкая 3.7 45
пшенная
рассыпчатая 1.8 25 
вязкая 3.2 40
жидкая 4.2 50
ячневая
рассыпчатая 2.4 30
вязкая 3.7 45`.split('\n').forEach(e => {
		r = e.match(/(.+)(\d\.\d)\s+(\d+)/)
		if (r) {
			j = grainMap.get(l) ?? l
			q = gGroats.find(e => e.name == j)
			for (i = 2; i < 4; i++) {
				r[i] = Number(r[i])
			}
			d.push([l + ' ' + r[1]
				, r[2]
				, f(q.rho * r[2], 2)
				, f(q.cal / (1 + r[2]))
				, r[3]
				, f(r[3] / 10 / (1 + r[2]), 2)])
		}
		else {
			l = e
		}
	})

	//картинка варите каши правильно
	d1 = `гречка 2
рис 1.5
ячневая 3
пшеничная 3
пшено 3
геркулес 4/1.5
перловка 2
горох 2`.split('\n').map(e => {
		r = e.match(/\s+[\d./]+$/)
		kv = eval(r[0])
		l = e.slice(0, -r[0].length)
		j = grainMap.get(l) ?? l
		q = gGroats.find(e => e.name == j)
		km = kv / q.rho
		return [l, f(km, 2), f(kv, 2), f(q.cal / (1 + km))]
	})

	el('p').innerHTML = gt.html() + `<p>Для всего кроме макарон и геркулеса, желательно замачивание, отстаивание можно увеличивать. Если гречка была замочена, то можно готовить закрытым способом, если без замачивания - открытым. Всё остальное готовится полузакрытым способом, иначе выкипает. Сокращения: зам - предварительное замачивание, пз - полузакрытый способ приготовления, з - закрытый способ приготовления.</p>`
		+ `<table><tr><td>Обслуживающий труд. Лабзина, Васильченко, Кузнецова 1982`
		+ new Table(['название', 'k<sub>m</sub>', 'k<sub>v</sub>', 'кк', 'соль', 'соль%'], d, { class: 'tc', o: 'cs0b' }).html()
		+ `<td style='vertical-align:top'>Картинка "варите каши правильно"` + new Table(['название', 'k<sub>m</sub>', 'k<sub>v</sub>', 'кк'], d1, { class: 'tc', o: 'cs0b' }).html() + `</table>`
		+ gtable.html() + `Введите массы и время испытаний для получения формулы.<table><tr><td><textarea id="mt" rows="4" cols="30" oninput="inputmtchanged()">
100 1
200 2
400 3.5
</textarea><td><span id="io"></span><br><button class="comboboxbutton" onclick="copy()"><img src='img/jm/copy16.png'></button></table>`
		+ SS.reduce((a, e, i) => a + e + '<input type="number" id="a' + i + '" oninput="com(' + i + ')" value="20" style="width:40px">г = <span id="as' + i + '"></span>мл<span style="margin-right:30px"></span>', '') +
		`<br>яйцо 1-4 штуки любой категории на 3 минуты на максимальную мощность, под крышкой<td style="padding-left:60px">`

	SS.forEach((_, i) => com(i))
	inputmtchanged()
	com1()
	countm()
}

function countm() {
	v = el('mg').value
	gGroats.forEach((_, i) => gt.set(i, gtcolumns - 1, v.length && v >= 0 ? fn(v * gt.get(i, ALL_DRY_COLUMNS).v) : ['?', 0]))
}

function getMass() {
	let mass = 0
	try {
		mass = eval(el('ic').value)
		if (el('tare').checked) {
			mass -= 888;
		}
		if (mass < 0 || !isFinite(mass)) {
			mass = 0
		}
	}
	catch {
	}
	return mass
}

function com1() {
	let mass = getMass(), s, v, max, i, e, a
	el('ic').style.color = mass ? 'black' : 'red'
	i = 0
	for (e of gtable.data) {
		if (mass) {
			a = [e[2].v, +e[3].v];
			v = (mass / a[0] + a[1]) * 60
			max = goods[i][3] * 60
			if (!isNaN(max) && v < max) {
				s = 'max(' + timeToString(v) + ',' + timeToString(max) + ')=' + timeToString(max)
			}
			else {
				s = timeToString(v)
			}
		}
		else {
			s = v = '?'
		}
		if (!/^[\d\s]+$/.test(el('ic').value)) {
			el('mc').innerHTML = mass ? 'm=' + mass : ''
		}
		e[1] = { s, v }
		i++
	}
	gtable.fill()
	inputktchanged()
}

function com(i) {
	let e = el('a' + i)
	let s, v, m, b
	try {
		v = e.value
		b = /[-+/*]/.test(v)
		m = eval(v)
		if (m === undefined)
			throw 0
		s = (b ? formatNumber(m, 1) + 'г = ' : '') + formatNumber(m / pho[i], 1)
	}
	catch {
		s = '?'
	}
	el('as' + i).innerHTML = s;
	e.style.color = s == '?' ? "red" : "black";
}

function ops(a) {
	let s = ''
	a.forEach(e => s += op(e));
	return s;
}

function op(e) {
	return '<option value="' + e + '">' + e + '</option>'
}

function mround(v) {
	let s = v + ''
	let i = s.indexOf('.');
	if (i == -1 || s.length - i - 1 < 2) {
		return v;
	}
	else {
		return normalize(v, 2)
	}
}

function input(i, value) {
	if (value === undefined) {
		value = inputvalue[i]
	}
	return '<input type="text" id="' + inputid[i] + '" value="' + value + '" style="width:50px;text-align: right" oninput="inputktchanged()">'
}

function getRow() {
	let r = el(inputid[0]).parentElement.parentElement
	return [...el(TC).rows].findIndex(e => e == r)
}

function inputktchanged() {
	let mass = getMass(), a = [], ok = true, v, s, r
	inputid.forEach(e => {
		r = ev(e)
		if (r === false) {
			ok = false
		}
		else {
			a.push(r)
		}
	})
	v = (mass / a[0] + a[1]) * 60
	if (a[0] <= 0 || v < 0) {
		ok = false;
	}
	r = getRow()
	el(TC).rows[r].cells[1].innerHTML = s = ok ? timeToString(v) : '?'
	//for table sort
	r -= 2;//2 number of rows in table
	;[v].concat(a).forEach((v, i) => {
		if (i) {
			s = input(i - 1, a[i - 1])
		}
		gtable.data[r][i + 1] = { s, v }
	})
}

function ev(id) {
	let e = el(id), v = evaluateString(e.value)
	e.style.color = v === false ? 'red' : 'black'
	return v
}

function inputmtchanged() {
	o = getLeastSquaresData('mt', LEASTSQUARES_MASS_TIME)
	gp = [1 / o.a, o.b]
	el('io').innerHTML = o.s;
}

function copy() {
	inputid.forEach((e, i) => el(e).value = gp[i])
	inputktchanged()
}