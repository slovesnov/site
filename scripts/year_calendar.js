const ALLOW_ENDING_ZERO = 0;

lng = gLanguage == 'russian' ?
	['день недели', 'уравнения', 'год', 'угадано', 'среднее', 'сек'
		, 'размер календаря', 'календарь', 'день', 'месяц']
	:
	['day of week', 'equations', 'year', 'guess', 'average', 'sec'
		, 'calendar size', 'calendar', 'day', 'month']

const WEEKDAY = 0
const EQUATIONS = 1
const YEAR = 2
const GUESS = 3
const AVERAGE = 4
const SEC = 5
const CALENDAR_SIZE = 6
const CALENDAR = 7
const DAY = 8
const MONTH = 9

// ROOT3EQUATIONS_FROM = [1,  2,  3,  4,  6,  7,  8,  9]
// ROOT3EQUATIONS_TO =  [30, 21, 74, 86, 81, 72, 20, 32]
ROOT3EQUATIONS_INDEX = null;

const WEEKDAYS = 'WEEKDAY';
const MULXYS = 'MULXY';
const comboData = [
	{
		a: lng[WEEKDAY]
		, range: [0]
		, name: WEEKDAYS
	}
	, {
		range: [1000, 100]
		, name: 'ROOT3'
	}
	, {
		range: [100]
		, name: 'ROOT5'
	}
	, {
		range: [1000, 100, [11, 25]]
		, name: 'POW2'
	}
	, {
		a: ['x,y', 'x*y']
		, range: [1000, 100]
		, name: MULXYS
	}
	, {
		range: [100]
		, name: 'POW3'
	}
	, {
		range: [1000, 100]
		, name: 'ROOT2'
	}
];

const CALENDAR_SIZES = [4, 3, 6, 2, 1, 12]

function guessName() {
	return comboData[gCombo.getIndex()].name
}

function powOrMul() {
	return guessName().match("^(POW|MUL)")
}

function com() {
	document.location = "?year_calendar," + gLanguage + "," + eval(cyear.value) + CALENDAR_SIZES[ocars.selectedIndex];//use url to pass parameter
}

function load() {
	//gMobile = 1
	M = []
	//MS = []
	l = gLanguage == 'russian' ? 'ru-RU' : 'en-EN'
	for (i = 0; i < 12; i++) {
		s = new Date(2022, i, 1).toLocaleDateString(l, { month: 'long' }).toLowerCase()
		M.push(s);
		//MS.push(s.slice(0, 3));
	}
	b = [];
	['long', 'short'].forEach((weekday, j) => {
		a = []
		for (i = 0; i < 7; i++) {
			a.push(new Date(2022, 7, 1 + i).toLocaleDateString(l, { weekday }).toLowerCase());
		}
		b[j] = a
	});
	[WFULL, WS] = b

	if (gPageName == 'calendar') {
		s = CALENDAR_SIZES.reduce((a, e) => a + '<option>' + e + ' x ' + 12 / e, '')
		s1 = ''
		for (i = 1; i < 32; i++) {
			s1 += '<option>' + i
		}
		s2 = M.reduce((a, e) => a += '<option>' + e, '')
		s3 = WFULL.reduce((a, e) => a + '<tr><td>' + e + '<td>'.repeat(6), '')

		el('p', `<input type="text" id="cyear" SIZE=5 onkeyup="com1()">
${lng[CALENDAR_SIZE]} <SELECT id="ocars">${s}</SELECT>
<input type="button" value="${lng[CALENDAR]}" onclick="com()" id="cbutton" class="comboboxbutton">
<hr>
<table class="firstc">
<tr><td>${lng[DAY]}<td>${lng[MONTH]}<td>${lng[YEAR]}<td>${lng[WEEKDAY]}
<tr><td><SELECT id="day" onchange="com2()" size=12>${s1}</SELECT>
<td><SELECT id="month" onchange="com2()" size=12>${s2}</SELECT>
<td><input type="text" id="year" SIZE="5" onkeyup="com2()">
<td id="wday" align="center">
</table>
<hr>
<table class="firstc">
<tr><td>${lng[MONTH]}<td>${lng[YEAR]}
<tr><td><SELECT id="monthc" onchange="com3()" size=12>${s2}</SELECT>
<td><input type="text" id="yearc" SIZE=5 onkeyup="com3()">
<td><table id="calc">${s3}</table>
</table>`)

		el('cyear').focus();
		d = new Date();
		el('yearc').value = year.value = cyear.value = d.getFullYear()
		el('day').selectedIndex = d.getDate() - 1;
		el('monthc').selectedIndex = el('month').selectedIndex = d.getMonth()
		com2()
		com3()
	}
	else if (gPageName == 'calendar_formula') {
		setSourceCodeButtons('main.cpp')
		if (gMobile) {
			window.addEventListener('resize', fillTable);
		}
		fillTable()
	}
	else if (gPageName == 'calendar_guess') {
		//  ${gLanguage == 'russian' ? 'заново' : 'restart'}
		el('p').innerHTML = `<button id='brestart' class='comboboxbutton' onclick='guess()'>&#10227;</button> <span id='o'></span> <span id='type'></span><div id='s'></div>`

		k = 0
		comboArray = []
		indexes = []
		const postfix = '_INDEX'

		comboData.forEach(e1 => {
			n = e1.name
			pow = n.startsWith('POW')
			if (!e1.a) {
				e1.a = []
				e1.a[+pow] = powString('x', e1.name.slice(-1))
				e1.a[+!pow] = 'x'
			}
			r = e1.range
			r.forEach(e => {
				j = e1.name;
				if (r.length > 1) {
					j += '_' + (Array.isArray(e) ? e[1] : e)
				}
				indexes.push(j);
				j += postfix
				window[j] = k++;
				comboArray.push({
					min: getMinRange(e), max: getMaxRange(e)
					, p: [n.startsWith('ROOT') ? Number(n.slice(-1)) : 1, pow ? Number(n.slice(-1)) : 1]
				})
			})
		});

		k = 0;
		comboData.forEach(e => {
			e.start = k;
			r = e.range
			k += r.length
		})

		//parse gParameter after comboData.start is set, allow string and index
		k = gParameter.toUpperCase()
		if (k.endsWith(postfix)) {//allow both pow2_100_index and pow2_100
			k = k.slice(0, -postfix.length)
		}
		if (indexes.includes(k)) {
			//don't allow gParameter='i' (cann't just check window['i']) make strict check from array 
			i = window[k + postfix]
		}
		else {
			i = parseInt(gParameter)
			i = i >= 0 && i < comboArray.length ? i : 0
		}
		k = getGuessRow(i)
		//start and column are used below
		start = comboData[k].start
		column = i - start
		o = {
			id: 'type', index: k, callChangeFunctionOnSameIndex: true
			, data: [], changeFunction: guess, buttonTextFunction: getComboButtonLabel
		}

		k = 0;
		comboData.forEach((e1, i) => {
			const table = 0;
			s = getComboLabel(i);
			a = [s]
			r = e1.range

			if (r.length == 1) {
				if (table) {
					if (e1.name != WEEKDAYS) {
						a.push(getLabel(r[0]))
					}
				}
				else {
					s += (e1.name == WEEKDAYS ? '' : ' ' + getLabel(r[0]));
				}
			}
			else {
				if (table) {
					s = ''
				}
				s += r.reduce((a, e, j) => {
					return a + '<label' + '><input type="radio"'
						+ (j == column && e1.start == start || j == 0 ? ' checked' : '')
						+ ' name="g' + i + '"' + ' onclick="gCombo.setIndex(' + i + ')"' + '>' + getLabel(e) + '</label>'
				}, '')
				if (table) {
					a.push(s)
				}
			}
			if (e1.name == MULXYS) {
				s += ' [0&le;y&lt;' + getPowString(100) + ']'
			}
			o.data.push(table ? a : s);
		})

		gCombo = new Combobox(o);

		guess();
	}
	else {
		//used on 'year_calendar' page
		//parameter is defined in index.php
		b = gMobile && window.outerWidth < 600;
		y = new Date().getFullYear()
		cs = b ? 3 : 4
		i = gParameter.length
		if (i) {
			j = Number(gParameter.substring(0, i - 1))
			if (Number.isInteger(j)) {
				y = j
			}
			j = Number(gParameter.substring(i - 1))
			if (CALENDAR_SIZES.includes(j)) {
				cs = j
			}
		}
		s = '<h3>' + y + ' ' + lng[YEAR] + '</h3><table class="outer"' + (b ? ' style="font-size:smaller"' : '') + '>'
		DMAX = MONTH_DAYS.slice()

		if (isLeapYear(y)) {
			DMAX[1]++;
		}

		for (mm2 = 0; mm2 < 12 / cs; mm2++) {
			s += "<tr>";
			for (mm1 = 0; mm1 < cs; mm1++) {
				m = 1 + mm1 + cs * mm2
				s1 = ''
				first = wdate(1, m, y)
				k = 0
				WFULL.forEach((e, i) => {
					s1 += "<tr><td>" + e;
					j = i - first + 1
					if (i < first) {
						s1 += '<td>'
						j += 7
						if (!i) {
							k++
						}
					}
					for (; j <= DMAX[m - 1]; j += 7) {
						s1 += "<td>" + j
						if (!i) {
							k++
						}
					}
				})
				s += '<td><table class="year"><tr><td><th colspan="' + k + '"">' + M[m - 1] + s1 + "</table>"
			}
		}
		s += "</table>"
		el('p', s)
	}
}

function powString(s, p) {
	return p == 1 ? s : s + '<sup style="font-size:70%">' + p + '</sup>'
}

function si() {
	let i = gCombo.getIndex();
	return comboData[i].start + getGuessColumn(i)
}

function fillTable() {
	t = el('t')
	rows = (window.outerWidth < 600) + 1
	for (k = 0; k < rows; k++) {
		for (j = 0; j < 2; j++) {
			r = t.insertRow(-1)
			for (i = M.length / rows * k; i < M.length / rows * (k + 1); i++) {
				if (j == 0) {
					s = M[i]
				}
				else {
					month = i + 1
					if (month > 2)
						month -= 2;
					else {
						month += 10;
					}
					s = Math.floor((13 * month - 1) / 5) % 7;
				}
				r.insertCell(-1).innerHTML = s
			}
		}
	}

	t = el("t1")
	for (j = 0; j < 2; j++) {
		r = t.insertRow(-1)
		r.insertCell(-1).innerHTML = j ? 'M(m)' : 'm'

		for (i = 0; i < M.length; i++) {
			if (j == 0) {
				s = i + 1
			}
			else {
				month = i + 3
				if (month > 2)
					month -= 2;
				else {
					month += 10;
				}
				s = floorMod(floorDiv((13 * month - 1), 5), 7);
			}
			r.insertCell(-1).innerHTML = s
		}
	}
}

function com1() {
	el('cbutton').disabled = getYear('cyear') === undefined
}

function com2() {
	y = getYear('year')
	if (y === undefined) {
		el('wday').innerHTML = ''
		return
	}
	leap = isLeapYear(y)
	da = el('day')
	mo = el('month')
	d = da.selectedIndex + 1
	m = mo.selectedIndex + 1
	el('wday').innerHTML = WFULL[wdate(d, m, y)]

	//disable some months
	const md = [1, 3, 5, 8, 10]
	if (d == 31) {
		a = md
	}
	else if (d == 30 || d == 29 && !leap) {
		a = [1]
	}
	else {
		a = []
	}
	md.forEach(e => mo.options[e].disabled = a.includes(e))

	//disable some days
	if ([4, 6, 9, 11].includes(m)) {
		a = 29
	}
	else if (m == 2) {
		a = leap ? 28 : 27
	}
	else {
		a = 30
	}
	for (i = 28; i < 31; i++) {
		da.options[i].disabled = i > a
	}
}

function com3() {
	let i, j, k, y;
	let t = el('calc')
	let mo = el('monthc').selectedIndex
	for (i = 0; i < t.rows.length; i++) {
		for (j = 1; j < t.rows[i].cells.length; j++) {
			t.rows[i].cells[j].innerHTML = "";
		}
	}

	y = getYear('yearc')
	if (y === undefined) {
		return
	}
	j = wdate(1, mo + 1, y)

	days = getMaxDaysInMonth(y, mo)

	for (i = 1, k = 1; k < days + 1; k++) {
		t.rows[j].cells[i].innerHTML = k;
		if (j == 6) {
			j = 0;
			i++;
		}
		else {
			j++;
		}
	}
}
//return random integer [a..b), a & b integers
function getRandom(a, b, allowEndingZero = 1) {
	let v
	do {
		v = a + Math.floor(Math.random() * (b - a))
	} while (!allowEndingZero && v % 10 == 0)
	return v;
}

/*p can be undefined when it called from reset button or at start
p can be string if called from bclick()
p can be number if called from combobox changeFunction: guess
*/
function guess(p) {
	if (p === undefined || typeof p == 'number') {//reset or combobox
		gg = gr = ga = 0
		gadd = ''
	}

	i = si()
	gt = performance.now()

	if (i == WEEKDAY_INDEX) {
		year = getRandom(1900, 2100);
		m = getRandom(0, 11 + 1);
		day = getRandom(1, MONTH_DAYS[m] + 1);
		ganswer = wdate(day, m + 1, year)
	}
	else {
		if (guessName() == MULXYS) {
			j = getGuessColumn(gCombo.getIndex())
			j = getRandom(0, 10 ** (3 - j), ALLOW_ENDING_ZERO)
			k = getRandom(0, 100, ALLOW_ENDING_ZERO)
			gguess = j + '*' + k
			ganswer = j * k
		}
		else if (i == ROOT3EQUATIONS_INDEX) {
			j = getRandom(0, ROOT3EQUATIONS_FROM.length)
			gguess = ROOT3EQUATIONS_FROM[j]
			ganswer = ROOT3EQUATIONS_TO[j]
		}
		else {
			j = getRandom(comboArray[i].min, comboArray[i].max, ALLOW_ENDING_ZERO)
			gguess = j ** comboArray[i].p[0]
			ganswer = j ** comboArray[i].p[1]
		}
	}

	//updateStatistics
	k = gMobile ? new Array(3).fill('') : [lng[GUESS], lng[AVERAGE], lng[SEC] + '.']
	s = k[0] + ' '
	if (gg == 0) {
		s += '?/? ' + k[1] + ' ? ' + k[2]
	}
	else {
		j = ga / gg
		s += gr + '/' + gg + ' ' + (gr * 100 / gg).toFixed(1) + '% ' + k[1] + ' ' + j.toFixed(1) + ' ' + k[2]
			+ (j >= 60 ? ' (' + timeToString(j) + ')' : '')
	}
	s += gadd
	el("o").innerHTML = s

	if (i == WEEKDAY_INDEX) {
		s = M[m];
		if (gLanguage == 'russian') {
			if (m == 2 || m == 7) {
				s += "а";//"марта" "августа"
			}
			else {
				s = s.substring(0, s.length - 1) + "я";
			}
		}
		gdate = day + ' ' + s + ' ' + year
		s = WFULL.reduce((a, e, i) => a + (gMobile ? '<br>' : '') + button(i, e, gMobile ? `margin-top:5px;width:180px;` : ''), gdate)
	}
	else {
		if (i == ROOT3EQUATIONS_INDEX) {
			s = gguess
		}
		else {
			j = comboArray[i].p[0]
			s = powString(fs(gguess), j == 1 ? comboArray[i].p[1] : '1/' + j) + ' ='
		}
		s += ' <input type="number" id="guess" min="0" onkeydown="inputkeydown(event)">' + button(0, 'ok')
	}
	el('s').innerHTML = s + (typeof p == 'string' ? p : '')

	if (i != WEEKDAY_INDEX) {
		e = el('guess')
		e.focus();
		//11ch - 11 characters
		e.style.width = (powOrMul() ? 11 : 5) + 'ch'
	}
}

function button(i, e, s) {
	return ` <button class="comboboxbutton" onclick="bclick(${i})" ${s ? `style="${s}"` : ''}>${e}</button>`
}

function inputkeydown(event) {
	if (event.key == "Enter") {
		bclick(0)
	}
}

//index is row
function getGuessColumn(index) {
	let e = document.querySelectorAll('input[name=g' + index + ']')
	return e && e.length ? [...e].findIndex(e => e.checked) : 0
}

//full index
function getGuessRow(index) {
	return comboData.findIndex(e => {
		return index >= e.start && index < e.start + e.range.length
	})
}

function getComboLabel(index) {
	let e = comboData[index]
	return index == WEEKDAY_INDEX ? e.a : e.a[0] + '&rarr;' + e.a[1]
}

function getComboButtonLabel(index) {
	return getComboLabel(index) + ' ' + (index == WEEKDAY_INDEX ? '' : getLabel(comboData[index].range[getGuessColumn(index)]))
}

function getMinRange(e) {
	return Array.isArray(e) ? e[0] : 0
}

function getMaxRange(e) {
	return Array.isArray(e) ? e[1] : e
}

function getLabel(e) {
	return getPowString(Array.isArray(e) ? e[0] : 0) + '&le;x&lt;' + getPowString(Array.isArray(e) ? e[1] : e);
}

function getPowString(n) {
	const pow = 1
	if (pow) {
		if (n == 100) {
			return powString(10, 2);
		}
		if (n == 1000) {
			return powString(10, 3);
		}
	}
	return n
}

function bclick(p) {
	s = ''
	ga += (performance.now() - gt) / 1000
	gg++
	i = si()
	j = i == WEEKDAY_INDEX
	l = j ? p : el('guess').value
	gadd = ''
	if (ganswer == l) {
		gr++;
	}
	else {
		if (j) {
			gadd = ' ' + gdate + ' ' + WS[ganswer] + ' &ne; ' + WS[l]
		}
		else {
			ss = '&nbsp;'.repeat(3)
			pe = fs(gguess)
			f = fs(ganswer)
			s += ' ' + fs(l) + ' &ne; '
			if (powOrMul()) {
				s += powString(pe, comboArray[i].p[1]) + ' = ' + f
			}
			else if (i == ROOT3EQUATIONS_INDEX) {
				s += ganswer
			}
			else {
				k = powString(f, comboArray[i].p[0])
				s += f + ss + k + ' = ' + pe
				if (i == ROOT3_1000_INDEX) {
					s += ss + k + "%11 = " + gguess % 11
				}
			}
		}
	}
	guess(s)
}

function getYear(id) {
	let y = undefined;
	//eval('')=undefined not throw
	try {
		y = eval(el(id).value)
	}
	catch {
	}
	return y
}

function floorDiv(a, b) {//like java Math.floorDiv. a or/and b can be negative
	return Math.floor(a / b)
}

function floorMod(a, b) {//like java Math.floorMod. a or/and b can be negative
	return a - b * floorDiv(a, b)
}

//0-monday... 6-sunday
function wdate(day, month, year) {
	let c, r, y, f = floorDiv
	if (month > 2)
		month -= 2;
	else {
		month += 10;
		year--;
	}
	y = floorMod(year, 100);
	c = f(year, 100);
	r = floorMod(day + f((13 * month - 1), 5) + y + f(y, 4) + f(c, 4) - 2 * c, 7);
	return r ? r - 1 : 6;
}

function fs(s) {
	return formatString(s, ',')
}