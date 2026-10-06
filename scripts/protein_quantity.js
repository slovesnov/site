/*ИЗМЕНЕНИЕ ВЕСА МЯСА ПРИ ПРИГОТОВЛЕНИИ ПИЩИ
http://www.delishis.ru/biblio/content/Masso/Masso_1200.html
*/
const gsa = ['свиная шкурка', 'сельдь тихоокеанская слабосоленая']//FOR BOTH LANGUAGES initial name
//const gsa = ['курица', 'яйцо']//FOR BOTH LANGUAGES
const v = [null, null, null, 70, 3, 1.6, 0, 0, 1, null]
// const v = [null, null, null, 67, 3, 1.3, 0, 0, 1, null]
const vl = v.length
const gUseQuery = 0
const kcalPerKg = 29
const cal = [4, 9, 4]

const gKcalString = gLanguage == 'russian' ? 'ккал' : 'kcal'
const gPieceString = gLanguage == 'russian' ? 'шт' : 'piece'
const gEnterAnExpressionString = gLanguage == 'russian' ? 'введите выражение' : 'enter an expression'
const gParameterString = gLanguage == 'russian' ? 'параметр' : 'parameter'
const gpfc = gLanguage == 'russian' ? ['белки', 'жиры', 'углеводы'] : ['protein', 'fat', 'carbohydrate']
const gl = gLanguage == 'russian' ? ['продукт', 'б/шт', 'г/приём', 'г/сут', 'ост.кк/сут']
	: ['good', 'p/pi', 'g/meal', 'g/day', 'left kcal/day']
gl.splice(2, 0, ...gpfc.map(e => '%' + e[0]))
gl.splice(1, 0, ...gpfc, gKcalString, gPieceString)
const gMassString = gLanguage == 'russian' ? 'масса кг' : 'mass kg'
const gMealString = gLanguage == 'russian' ? 'приёмов пищи' : 'meals'
const gProteinPerMealString = gLanguage == 'russian' ? 'г белка/приём пищи' : 'g of protein per meal'

const t = gpfc.map(e => e + ' ' + (gLanguage == 'russian' ? 'г/100г' : 'g/100g')).concat(gLanguage == 'russian' ?
	[gMassString, gMealString, 'белок г/кг массы', 'потеря %', 'усушка %', 'множитель', 'масса штуки'
		, 'г еды за приём пищи', 'г еды за сутки', 'штук за приём пищи', gProteinPerMealString, 'ккал за приём пищи'
		, 'ккал за сутки', 'ккал за сутки/кг'
		, 'жиры за сутки', 'жиры за сутки/кг'
		, 'остаётся ккал/сутки', 'остаётся ккал/сутки/кг'] :
	[gMassString, gMealString, 'protein g/kg of mass', 'loss %', 'shrinkage %', 'multiplier', 'piece mass'
		, 'g of food per meal', 'g of food per day', 'pieces per meal', gProteinPerMealString, 'kcal per meal'
		, 'kcal per day', 'kcal per day/kg'
		, 'fat per day', 'fat per day/kg'
		, 'kcal left in a day', 'kcal left in a day/kg'])
const gKcalIndex = gl.indexOf(gKcalString)
const gPieceIndex = gl.indexOf(gPieceString)
const gEditMassIndex = t.indexOf(gMassString)
const gEditMealIndex = t.indexOf(gMealString)
const gProteinPerMealIndex = t.indexOf(gProteinPerMealString) - vl

function load() {
	setColumns()
	if (gUseQuery) {
		//console.log('query')
		p = JSON.stringify(['курица', 'говядина', 'сельдь', 'яйцо', 'творог 9%', 'молоко 3.2%', 'сельдь тихоокеанская слабосоленая', 'печень говяжья', 'печень свиная', 'печень цыпленка бройлера', 'свиная шкурка', 'сыр маасдам']);
		fetchpost('../php/protein_quantity.php', { p }, callback)
	}
	else {
		callback()
	}
}

function callback(s) {
	if (gUseQuery) {
		//console.log(s)
		a = JSON.parse(s)
	}
	else {
		a = [["говядина", 18.9, 12.4, 0], ["курица", 16, 14, 0], ["молоко 3.2%", 2.9, 3.2, 4.7], ["печень говяжья", 17.9, 3.7, 5.3], ["печень свиная", 18.8, 3.8, 4.7], ["печень цыпленка бройлера", 18, 10, 0]
			, ["свиные рёбра", 15.2, 29.3, 0]
			, ["свиная шкурка", 18, 16, 0]
			, ["сельдь тихоокеанская слабосоленая", 18.4, 11.7, 0], ["сыр маасдам", 25.4, 26.1, 0], ["творог 9%", 16, 9, 3], ["яйцо", 12.7, 11.5, 0.7]]
	}

	a.push([gLanguage == 'russian' ? 'каркас курицы' : 'chicken carcass', 16, 14, 0, null, 60]//как у курицы
		, [gLanguage == 'russian' ? 'шея курицы' : 'chicken neck', 14.7, 26.4, 0, null, 15.5]//https://calorizator.ru/product/beef/chicken-40
		, [gLanguage == 'russian' ? 'спина курицы' : 'chicken back', 14.05, 28.74, 0, null, 46]//https://fitaudit.ru/food/102693
		, [gLanguage == 'russian' ? 'куриная грудка' : 'chicken breast', 23.6, 1.9
			, 0.4]//https://calorizator.ru/product/beef/chicken-8
	)

	m = new Map(gLanguage == 'russian' ? [
		["сельдь тихоокеанская слабосоленая", 'сельдь']
		, ['печень цыпленка бройлера', 'печень куриная']
	] : [
		['курица', 'chicken']
		, ['говядина', 'beef']
		, ['сельдь тихоокеанская слабосоленая', 'herring']
		, ['яйцо', 'egg']
		, ['творог 9%', 'cottage cheese 9%']
		, ['молоко 3.2%', 'milk 3.2%']
		, ['печень цыпленка бройлера', 'chicken liver']
		, ["печень свиная", 'pork liver']
		, ["печень говяжья", 'beef liver']
		, ['сыр маасдам', 'cheese maasdam']
		, ['свиная шкурка', 'pork skin']
		, ["свиные рёбра", 'pork ribs']
	])

	f = (e, d = 1) => [formatNumber(e, d), e]
	a = a.map((e, i) => {
		if (e[0] == 'яйцо') {
			e[gPieceIndex] = 50
		}
		if (l = m.get(e[0])) {
			if ((j = gsa.indexOf(e[0])) != -1) {
				gsa[j] = l
			}
			e[0] = l
		}
		c = cal.reduce((a, q, i) => a + q * e[i + 1], 0)
		b = [
			f(c)
			, [e[gPieceIndex] ?? '-', e[gPieceIndex] ?? 0]
			, e[gPieceIndex] === undefined ? ['-', 0] : f(e[gPieceIndex] / 100 * e[1])
		]
		for (j = 0; j < 3; j++)
			b.push(f(100 * e[j + 1] * cal[j] / c))

		if (!i) {
			e0l = e.length
			gSortedColumns = e0l + b.length;//before 1,2...
		}
		return e.slice(0, e0l)
			.concat(b
				, Array.from({ length: columns }).fill(ci('cp(this)'))
				, Array.from({ length: gl.length - gSortedColumns })
			)
	})

	q = `<th>` + Array.from({ length: columns }, (_, k) => (k + 1) + (k + 1 == columns ?
		' ' + ci('addColumn()', 'plus16', -2) : '')).join('<th>')
	ab = Array.from({ length: columns }, (_, k) => k + 1)
	arrowsColumns = Array.from(gl, (_, k) => k < gSortedColumns ? k : k + columns)
	at = gl.slice();
	at.splice(gSortedColumns, 0, ...ab)
	gtable = new Table(at, a, { sort: 1, sortColumn: 0, color: 1, arrowsColumns })
	el('p').innerHTML = t.reduce((a, e, i) => a + '<tr><td>' /* + i + ' ' */ + e
		+ Array.from({ length: columns }, (_, k) =>
			i >= vl ? `<td id='${k}${i - vl}'>` :
				`<td><input type='text' id='i${k}${i}' style='width:45px' oninput="r(${k})">`
		).join('')
		, `<table><tr><td><table class='table_color' style='margin-top:0'><thead><th>${gParameterString + q}</thead>`) + '</table>'
		+ `<td style='vertical-align:top;padding-left:10px'>`
		+ gtable.html()
		+ ci('reset()', 'refresh16', -4)
		+ ` <input type='text' id='c' style='width:200px;margin-top:5px' oninput='calc()' placeholder='${gEnterAnExpressionString}'> = <span id='r'></span> `
		+ ci('clipboard()', 'copy16', -4)
		+ `</table>`
		+ (gUseQuery ? s : '')
	reset(1)
}

function addColumn() {
	columns++
	callback()
}

function clipboard() {
	s = el('c').value + '=' + el('r').innerHTML
	navigator.clipboard.writeText(s).then(
		() => { }//op('текст скопирован в буфер')
		, () => { }//op('ошибка копирования в буфер')
	);
	//console.log(s)
}

function ci(f, im = 'copy16', ma = null) {
	return `<img src='img/jm/${im}.png'${ma === null ? '' : ` style='margin-bottom:${ma}px'`} onclick='${f}'>`
}

function cp(t) {
	column = t.parentElement
	row = column.parentElement
	table = row.parentElement
	column = [...row.cells].findIndex(e => e == column) - gSortedColumns
	row = [...table.rows].findIndex(e => e == row)
	assignProduct(column, row, 0)
}

function assignProduct(column, row, reset) {
	v.forEach((e, i) => {
		if (e === null || reset) {
			el('i' + column + i).value = e ?? gtable.data[row][i < 3 ? i + 1 : gPieceIndex].v
		}
	})
	r(column)
}

function calc() {
	const d = 2
	let v, v1, a, b, meals, piece
	v = el('c').value.trim()
	a = v.split(/\s+/)
	if (a.length == 3) {
		v = `(${a[0]}-${a[1]})*${a[2]}/100`
	}
	else if (a.length == 2) {
		v = `${a[0]}*${a[1]}/100`
	}
	b = evaluateString(v)
	el('r').innerHTML = b === false ? '?' : (Math.abs(b) < 10 ** (-d) ? b : formatNumber(b, d))
	let fv = (v) => isFinite(v) ?
		[formatNumber(v, 0) + (piece ? '/' + formatNumber(v / piece, 1) : ''), v] : '?';
	for (i = 0; i < gtable.data.length; i++) {
		v = (b === false ? el('0' + gProteinPerMealIndex).innerHTML : b) * 100 / gtable.get(i, 1).v;
		meals = getValue(0, gEditMealIndex)
		piece = gtable.get(i, gPieceIndex).v//use in fv
		v1 = getValue(0, gEditMassIndex) * kcalPerKg - gtable.get(i, gKcalIndex).v * v / 100 * meals
		a = [
			fv(v), fv(v * meals),
			isFinite(v1) ? [formatNumber(v1, 0), v1] : '?'
		];
		a.forEach((e, j) => gtable.set(i, gSortedColumns + columns + j, e))
	}
}

function setColumns() {
	columns = gsa.length
}

function reset(load = 0) {
	if (!load) {
		setColumns()
		callback()
	}
	let column, row
	for (column = 0; column < columns; column++) {
		row = gtable.data.findIndex(e => e[0].s == gsa[column % gsa.length])
		assignProduct(column, row, 1)
	}
}

function getValue(column, row) {
	let b = evaluateString(el('i' + column + row).value)
	return b === false ? NaN : b
}

function r(column) {
	[protein, fat, carbohydrate, mass, meal, proteinPerKg, loss, shrinkage, multiplier, piece] = Array.from({ length: vl }, (_, k) => getValue(column, k))
	l = mass / meal * proteinPerKg * multiplier
	gr = 100 / protein * (1 - shrinkage / 100) / (1 - loss / 100) * l
	cc = gr / 100 * (protein * 4 + fat * 9 + carbohydrate * 4)
	ccday = cc * meal
	fday = gr / 100 * meal * fat
	ccr = mass * kcalPerKg - ccday;
	[gr, gr * meal, gr / piece, l, cc, ccday, ccday / mass, fday, fday / mass, ccr, ccr / mass].forEach((e, i) =>
		el(column + '' + i).innerHTML = isFinite(e) ? formatNumber(e, [0, 1, 4, 5, 9].includes(i) ? 0 : 1) : ([1, 2].includes(i) ? '-' : '?')
	)
	if (!column) {
		calc()
	}
}