const PERIOD = gPageName == 'poverty_period'
const N = PERIOD ? null : Number(gPageName.match(/\d+/)[0])
const SUMMARY = gPageName.includes('summary') ? (N == 6 ? 1 : (N == 10 ? 2 : 3)) : 0
const WRITE_GR_FILES = gAdmin && SUMMARY == 3 && isLocal() ? 0 : 0
const ADD_GRAPH0 = gAdmin ? 0 : 0 //gAdmin ? 1 : 0
const GRAPH_AVG_DAYS = 7
const LAST_DEFAULT_DAYS = 2
//show & output consts
const SHOW_TIME = gAdmin ? 0 : 0
const OUTPUT_CORRELATION = gAdmin ? 0 : 0 //only if WRITE_GR_FILES is on
const SHOW_INFO = gAdmin ? 0 : 0
const SHOW_CLICKABLE_IMAGES = gAdmin && isLocal() ? 0 : 0
const SHOW_DELETE_BUTTON = gAdmin && isLocal() ? 0 : 0

const SPECIAL_GRAPH_TITLE = [
	['C0', 'C0/μm'/*, 'A*10^6', '-B*10^3'*/]//&mu; not working
	, ['калории', 'масса съеденного', 'калорийность/100г']
];
const SPECIAL_GRAPH_TYPE = gAdmin ? 0 : 0//0...SPECIAL_GRAPH_TITLE.length-1
const SPECIAL_GRAPH_NAME = 'График ' + SPECIAL_GRAPH_TITLE[SPECIAL_GRAPH_TYPE].join(', ')

const ST = ['График калорий и массы тела'
	, 'График потребляемых калорий и массы съеденного'
	, 'График калорийность/100г и масса съеденного/калории'
	, SPECIAL_GRAPH_NAME
	, 'График скользящего среднего по калориям за ' + dayString(GRAPH_AVG_DAYS)
	, 'Рецепт сгруппированный по продуктам'
	, 'Список продуктов не чисто растительного происхождения, витамин b12'
	, 'Статистика завтрак, обед, ужин'
]
const ST_GROUP_INDEX = 5

const NOB12_GOODS = [
	'пирог с джемом'
	, 'арахис в сахарной глазури'
	, 'крекер'
	, 'салат'
	, 'драже'
	, 'овощи тушеные'
	, 'суп'
	, 'печенье'
	, 'нуга с арахисом'
	, 'вафли fun banan'
	, 'сникерс'
	, 'шоколад'
	, 'пюре овощное'
	, 'milky way'
	, 'молочный шоколад'
	, 'пряник'
	, 'сосиска в тесте'
	, 'булочка с творогом'
	, 'gallina blanca бульонный кубик'
	, 'лепешка ржаная'
	, 'слойка с сыром'
	, 'пряники'
	, 'вафли'
	, 'лечо'
	, 'калужское тесто'
	, 'панировка с куркумой и паприкой'
	, 'смесь листовых овощей'
]

const REFRESH = '⟲';//'↻'
const START_DATE = new Date('2024-08-01')
const START_EVERYDAY_LOOT_DATE = new Date('2024-11-16')
const PREVIOUS_DAYS_DIALOG = 1 //number of previous days showed in diaolg
const BDS = ['завтрак', 'обед', 'ужин']
const PERCENT = .025;
const GRIDN = ['show_x', 'step_x', 'pixels_x', 'digits_x'
	, 'show_y', 'step_y', 'pixels_y', 'digits_y'
	, 'maxsteps']
const GRIDV0 = [1, 100, 0, 0
	, 1, .1, 0, 1,
	100]
const GRIDV1 = [1, 100, 0, 0
	, 1, 200, 0, 0,
	100]
//like GRIDV0 only GRIDMASS[1]=7
const GRIDMASS = [1, 7, 0, 0
	, 1, .1, 0, 1,
	100]
//like GRIDV1 only GRIDCALORIE[1]=7
const GRIDCALORIE = [1, 7, 0, 0
	, 1, 200, 0, 0,
	100]

const GRIDCALORIE100 = [1, 1
	, 0, 0
	, 1, 100, 0, 0,
	100]

const GRIDC0 = [1, 1, 0, 0
	, 1, 1, 0, 1,
	100]
const CALENDAR_FORMAT = '%d %b %Y'
const CALENDAR_FORMAT1 = '%d %B %Y'
const DAY_SECONDS = 24 * 3600 * 1000;
const REDI = /^\s*((\d{4})-(\d{1,2})-(\d{1,2})).*((\d{4})-(\d{1,2})-(\d{1,2}))\s*$/ //2024-12-25 2024-12-25
const REDI1 = /^\s*(\d{4})-(\d{1,2})\s*(?:-(\d{1,2}))?\s*$/ //2024-12 or 2024-12-25
const STORAGE_KEY = 'poverty'
const BDATAFILE = 'bdatafile'

gCalendar = [];
gUpdateCalendar = true
gLastDaysOK = true
gDaysIntervalOK = true

function load(par, callLoadJoinedRecipe = true) {
	//console.log('load', par)
	['carbohydrateByDay', 'calorieByDay', 'eatenByDay', 'bdsMassCalorie', 'massCalorieMinMax', 'bdsMassCalorie'].forEach(e => {
		if (typeof window[e] == 'undefined') {
			window[e] = []
		}
	})
	if (gp.length != carbohydrateByDay.length
		|| gp.length != calorieByDay.length
		|| gp.length != eatenByDay.length
		|| gp.length != bdsMassCalorie.length
	) {
		console.log(`gp.length=${gp.length} != [${carbohydrateByDay.length} ${calorieByDay.length} ${eatenByDay.length} ${bdsMassCalorie.length}] need ${REFRESH}файлы`)
	}

	//console.log(calorieByDay.slice(-1)[0])
	END_DATE = gp.length ? getDateFromEnd(0) : START_DATE
	if (typeof massCalorieMinMax == 'undefined') {
		massCalorieMinMax = []
	}
	if (typeof bdsMassCalorie == 'undefined') {
		bdsMassCalorie = []
	}

	if (PERIOD && par === undefined) {
		s = Calendar.getDateFormat(START_EVERYDAY_LOOT_DATE, '%d%b', 1).replace(/(?<=[^\d]{3})(.*)/, '')
		//global variable
		LB = ['до' + s, 'с' + s, REFRESH]
		LBL = LB.length
	}
	//need evMass before recipeObject
	mass = gp.map((e, i) => {
		let s = e.split('\n')[0]
		let m = s.match(/^#(\d+[а-я]+)\sмасса\s(\d+\.?\d*)$/)
		if (m == null) {
			throw "invalid " + s;
		}
		let date = dateString(i);
		if (m[1] != date) {
			throw "invalid day " + s + '\nshould be' + date;
		}
		return +m[2]
	})
	evMass = expectedValue(mass);

	if (SHOW_INFO) {
		showInfo()
	}
	load1(par, callLoadJoinedRecipe)
}

function createAllDaysRecipe() {
	let s = gp.join("\n").split("\n").map(e => e.trim()).join("\n"),
		r = recipeObject(s, gp.length)
	recipeColumnsArrayToObject(r)
	//console.log(s.length)
	return r
}

function inputLastDays() {
	let l = el('ld')
	let i = evaluateString(l.value)
	gLastDaysOK = typeof i == 'number' && Number.isInteger(i) && i > 0 && i <= gp.length
	l.style.color = gLastDaysOK ? "black" : "red"
	setButtonState(gLastDaysOK, 'ba' + (LBL - 1))
}

function inputDaysInterval() {
	const minYear = 2024, maxYear = 2025;
	let i = el('di').value
	let m = i.match(REDI), j
	let ok = m !== null, inRange = (n, a, b) => m[n] >= a && m[n] <= b
		, validDate3 = (yearIndex, monthIndex, dayIndex) => inRange(yearIndex, minYear, maxYear) && inRange(monthIndex, 1, 12) && inRange(dayIndex, 1, getMaxDaysInMonth(m[yearIndex], m[monthIndex] - 1))
		, validDate = (i) => validDate3(2 + 4 * i, 3 + 4 * i, 4 + 4 * i)
	if (ok) {
		for (i = 0; i < 2; i++) {
			for (j = 2; j < 5; j++) {
				m[j + 4 * i] = +m[j + 4 * i]
			}
		}
		ok = validDate(0) && validDate(1)
	}
	else {
		m = i.match(REDI1)
		ok = m !== null
		if (ok) {
			ok = inRange(1, minYear, maxYear) && inRange(2, 1, 12) && (m[3] === undefined || validDate3(1, 2, 3))
		}
	}
	el('di').style.color = ok ? "black" : "red"
	gDaysIntervalOK = ok
	setButtonState(gDaysIntervalOK, 'dib')
}

function setButtonState(ok, id) {
	el(id).disabled = !ok
}

function clickIfOk(ok, e, id) {
	const KEY_ARRAY = ['Enter', 'Escape'];
	if (ok && KEY_ARRAY.includes(e.key)) {
		el(id).click()
		return true
	}
	else {
		return false
	}
}

function cbutton(n) {
	const l = 2
	if (n >= l) {
		const a = [[START_DATE, START_EVERYDAY_LOOT_DATE], [START_EVERYDAY_LOOT_DATE, END_DATE], [getDateFromEnd(evaluateString(el('ld').value) - 1), END_DATE]]
		setCalendars(a[n - l])
	}
	else {
		gCalendar[n].setDate([START_DATE, END_DATE][n])
	}
}

function getDateRange(...d) {
	let changed = false;
	let a = d.slice(0, 2).map(e => {
		if (e < START_DATE || e > END_DATE) {
			changed = true;
			return e < START_DATE ? START_DATE : END_DATE;
		}
		return e
	})
	if (a[0] > a[1]) {
		if (d[2]) {
			a[0] = a[1]
		}
		else {
			a[1] = a[0]
		}
		changed = true;
	}
	a.push(changed)
	return a;
}

function loadFromCalendars() {
	//need to create new date because of timezone difference 
	let a = gCalendar.map(e => Math.floor((new Date(e.getDateFormat('%F')) - START_DATE) / DAY_SECONDS))
	a[1]++
	countMassCalorieMinMax(...a)
	setInputCalendar()
	load1(a)
}

function setCalendars(a) {
	gUpdateCalendar = false
	gCalendar.forEach((e, i) => e.setDate(a[i]))
	gUpdateCalendar = true
	loadFromCalendars()
}

function updateCalendar(n) {
	if (!gUpdateCalendar) {
		return
	}
	let a = getDateRange(gCalendar[0].getDate(), gCalendar[1].getDate(), n)
	if (a[2]) {
		setTimeout(() => setCalendars(a), 0)
	}
	else {
		loadFromCalendars()
	}
}

function dateInputChanged() {
	let m = el('di').value.match(REDI)
	if (m) {
		m = getDateRange(new Date(m[1]), new Date(m[5]), 0)
	}
	else {
		m = el('di').value.match(REDI1)
		m = getDateRange(new Date(m[1], m[2] - 1, m[3] ?? 1), new Date(m[1], m[2] - 1, m[3] ?? getMaxDaysInMonth(m[1], m[2] - 1)), 0)
	}
	setCalendars(m)
}

function setInputCalendar() {
	let d = gCalendar.map(e => e.getDate()), i = 0, s
	if (d[0].getFullYear() == d[1].getFullYear() && d[0].getMonth() == d[1].getMonth()) {//same year and month
		if (d[0].getDate() == d[1].getDate()) {
			i = 1
		}
		else if (d[0].getDate() == 1 && [Calendar.getDaysInMonth(d[1]), END_DATE.getDate()].includes(d[1].getDate())) {
			i = 2
		}
		if (i) {
			s = gCalendar[0].getDateFormat('%F')
			if (i == 2) {
				s = s.slice(0, 7)
			}
		}
	}
	if (!i) {
		s = gCalendar.map(e => e.getDateFormat('%F')).join(' ')
	}
	el('di').value = s
}

function massChanged() {
	e = el('mass')
	ok = /^\d{2,3}(\.\d*)?$/.test(e.value)
	e.style.color = ok ? 'black' : 'red'
	for (i = 0; i < 2; i++) {
		getModalButton(i).disabled = !ok
	}
}

function textareaInput(t) {
	sessionStorage.setItem(STORAGE_KEY, el(t.id).value)
}

function textareaKeydown(t, e) {
	if (!el('autoru').checked) {
		return;
	}
	const KEYR = 'йцукенгшщзхъфывапролджэячсмитьбюё';
	const KEYE = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`';
	const R = KEYR + KEYR.toUpperCase()
	const E = KEYE + KEYE.toUpperCase()
	//prevents ctrl+z ... alt
	if (!e.ctrlKey && !e.altKey && (i = E.indexOf(e.key)) != -1) {
		e.preventDefault();
		addPFC(t, R[i])
	}
}

function addPFC(t, add) {
	const start = t.selectionStart
	const end = t.selectionEnd
	const text = t.value
	t.value = text.substring(0, start) + add + text.substring(end, text.length)
	t.selectionStart = t.selectionEnd = start + add.length
	t.focus()
	textareaInput(t)
}

function fromStorage(n) {
	el('ta' + n).value = sessionStorage.getItem(STORAGE_KEY)
}

function bclick(command, n) {
	if (command == 'delete') {
		if (confirm(`Вы действительно хотите удалить данные за ${dateString(n)}?`)) {
			execCommand(n - 1, '#' + dateString(n), command)
		}
		return
	}

	if (command == 'edit') {
		m = mass[n]
		b = gp[n].split(/^[&#].+$/m).slice(1, -1).map(e => e.trim())
	}
	else {
		m = mass.length ? mass[mass.length - 1] : 64
		n = gp.length
		b = new Array(3).fill('')
	}
	d = getDateFromStart(n)
	s1 = `<td rowspan=3 style="white-space:pre;"><div style='height:450px; overflow:auto;'>${gp.slice(n - PREVIOUS_DAYS_DIALOG, n).join('\n')}</div>`
	s = '<table>'
		+ `<tr><td colspan=3>масса <input type="number" id="mass" value="${m}" oninput="massChanged()" style="width:40px" step=".1"><label><input type="checkbox" id="autoru" checked style="vertical-align: middle;">перекодировать буквы <img src="../img/en.gif">&rarr;<img src="../img/ru.gif"></label> <button class="comboboxbutton" onclick="addPFC(el('ta' + gLastTextArea),' бжу 0 0 0 b12 0 животный белок/жир 0 0')">бжу b12 жив. жир/белок</button>`
		+ BDS.map((e, i) => `<tr><td>${[...e].join('<br>') + '<br>' + clickableImage('', `fromStorage(${i})`, 'refresh')}<td><textarea id="ta${i}" oninput="textareaInput(this)" onkeydown="textareaKeydown(this,event)" onfocus="gLastTextArea=${i}" style="height:145px;width:300px;">${b[i]}</textarea>` + (i ? '' : s1)
		).join('')
		+ '</table>'
	gLastTextArea = 0
	showModal('дата ' + Calendar.getDateFormat(d, CALENDAR_FORMAT1, gLanguage == 'russian'),
		s, j => {
			m = el('mass').value
			s = '#' + dateString(n) + ' масса ' + m + BDS.map(
				(e, i) => {
					v = el('ta' + i).value.trim()
					return '\n' + v + (v.length ? '\n' : '') + '&' + e
				}
			).join('')
			if (j == 0) {
				execCommand(n, s, command)
			}
		}, ['ок', 'отмена'])
}

function execCommand(fi, s, command) {
	gfi = fi
	gcommand = command
	fetchpost('php/poverty.php', { s, command })
	if (command == 'plus') {
		gp.push(s)
	}
	else if (command == 'edit') {
		gp[fi] = s
	}
	else {
		gp.pop()
		callbackUnionRecipe()
		return
	}
	loadJoinedRecipe(fi, fi + 1, callbackUnionRecipe)
}

function loadJoinedRecipe(fi, li, callback) {
	let a = gp.slice(fi, li)
		, ra = a.join('\n')
		, r = recipeObject(ra, 1, 1)
	if (callback) {
		r.callback = callback
	}
	r.buttonRecipe = a
	r.afterButtonRecipe = Array.from({ length: li - fi }, (_, i) => ' ' + clickableImageL('edit', fi + i))
	//console.log(1)
	recipeLoad(r)
}

function clickableImage(bclass, clickf, img) {
	return `<a onclick="${clickf}"${bclass.length ? ` class="${bclass}"` : ''}><img style="vertical-align:middle;height:14px" src="img/jm/${img}16.png" /></a>`
	//return `<button${bclass.length ? ` class="${bclass}"` : ''} onclick="${clickf}"><img style="vertical-align:middle;" src="img/jm/${img}16.png"></button>`
}

function clickableImageL(n, i) {
	return SHOW_CLICKABLE_IMAGES ? clickableImage(n == 'plus' ? 'm' : '', `bclick('${n}',${i})`, n) : ''
}

function load1(par, callLoadJoinedRecipe = true) {
	//console.log('load1', par)
	if (par === undefined) {
		[fi, li] = firstLastIndices()
	}
	else {
		[fi, li] = par
	}

	l = gp.length
	s2 = '<tr><td><table style="margin-top:0">'
	lastMinMass = Infinity
	k = Math.min(li, l)
	for (i = fi, j = 0; i <= k; i++, j++) {
		if (j % 10 == 0) {
			s2 += `<tr${j % 50 ? '' : ' class="mt"'}>`
		}
		s2 += '<td>'
		if (i == k) {
			s2 += clickableImageL('plus')
				+ (gp.length && SHOW_DELETE_BUTTON ? clickableImageL('delete', gp.length - 1) : '')
		}
		else {
			v = mass[i]
			dm = lastMinMass - v
			if (dm > 0) {
				lastMinMass = v
			}
			s2 += dateref(j, i, dm) + clickableImageL('edit', i)
		}
	}
	s2 += '</table>'
	el('pall').innerHTML = recipeButton(createAllDaysRecipe(), "все дни")

	fn = (b, h, n) => (b ? `<span` : `<a href="?${h}"`) + ` class='m'>` + n + (b ? `</span>` : `</a>`)
	s = '<table><tr>'
	for (i = 1; i < (gAdmin ? 12 : 11); i++) {
		if (i == 7) {
			s += '<tr>'
		}
		if (i != 11) {
			s += `<td>` + fn(i == N && !SUMMARY, 'poverty' + i, 'часть' + i)
		}
		j = [6, 10, 11].indexOf(i)
		if (j != -1) {
			if (i == 10) {
				s += '<td colspan="2">'
			}
			s += fn(i == N && SUMMARY, `poverty${i}_summary`, `часть` + i + ' ' + ['итоги месяца', 'итоги двух месяцев', 'итоги пяти месяцев'][j])
			if (i == 6) {
				s += fn(PERIOD, `poverty_period`, `выбрать период`)
			}
		}
	}
	s += '</table>'
	s1 = 'за ' + dayString(gp.length ? li - fi : 0)
	s3 = ['новый минимум массы', 'повтор минимума массы'].reduce((a, e, i) => a + ` <span class='nm${i + 1}'${i ? '' : ' style="margin-left:70px;"'}>${e}</span>`, '')
	t = [`<table id="t255"><tr><td>${PERIOD ? ('выберите период'
		+ LB.reduce((a, e, i) => a + ' ' + (i == LBL - 1 ? `<input type="number" min="1" max="${gp.length}" id="ld" oninput="inputLastDays()" onkeydown="clickIfOk(gLastDaysOK, event, 'ba${LBL - 1}')" value="${LAST_DEFAULT_DAYS}">` : '')
			+ `<button onclick="cbutton(${i + 2})" class="comboboxbutton" id="ba${i}">${e}</button>`, '')
		+ ' <button onclick="cbutton(0)" class="comboboxbutton">⇤</button>'
		+ [0, 1].map(e => ` <span id="calendar${e}"></span>`).join(' - ')
		+ ' <button onclick="cbutton(1)" class="comboboxbutton">⇥</button> '
		+ [START_DATE, END_DATE].map(e => Calendar.getDateFormat(e, CALENDAR_FORMAT, gLanguage == 'russian')).join(' - ')
		+ ' (' + dayString(gp.length) + ') '
		+ `<input type="text" id="di" oninput="inputDaysInterval()" onkeydown="clickIfOk(gDaysIntervalOK, event, 'dib')"><button onclick="dateInputChanged()" class="comboboxbutton" id="dib">${REFRESH}</button>`
		+ (isLocal() ? ` <button id="${BDATAFILE}" onclick="updateDataFile()" class="comboboxbutton">${REFRESH}файлы</button>` : '')
	) : '<a href="#theory">Теория</a>'}</td></tr>` + `<tr><td><a href="#diary">Дневник питания <span id="s266">${s1}</span></a>${s3}</td></tr>`
		, `<tr><td><a href="#graphs">Графики</a></td></tr>` +
	ST.reduce((a, e, i) => a + `<tr><td><a href="#g${i}"${i >= ST_GROUP_INDEX ? '' : ' class="m"'}>${e}</a>${i == ST_GROUP_INDEX ? '<a href="#summaryid" style="margin-left:50px;">итог</a>' : ''}</td></tr>`, '')
		, `<tr><td><a href="#history">История из жизни</a></td></tr>`]

	for (i = 0; i < 2; i++) {
		if (i == 0 && par !== undefined) {
			el('s266').innerHTML = s1;
			el('t255').rows[2].cells[0].innerHTML = s2;
			continue
		}
		el('tc' + i).innerHTML = s + (i ? '' : t[0] + s2 + t[1]
			+ (!SUMMARY && [6, 10].includes(N) || PERIOD ? '' : t[2])) + '</table>';
	}

	//if PERIOD also need to 	countMassCalorieMinMax(fi,li) because it's called on callback, but massCalorieMinMax is used in this function 
	countMassCalorieMinMax(fi, li)
	if (PERIOD && par === undefined) {
		for (i = 0; i < 2; i++) {
			gCalendar[i] = new Calendar('calendar' + i, getDateFromStart([fi, li - 1][i])
				, (j => () => updateCalendar(j))(i)//closure
				, CALENDAR_FORMAT, gLanguage == 'russian');
		}
		setInputCalendar()
	}

	/*соль 524-388(18авг)+797-355+644(1ноя) с синей ложкой и крышкой, перец 162, чай 491
	на 1ноя 524-388+797-355=578 1ноя-1авг= (3 дня жил у матери) 563/(92-3)=6.5
	на 12янв2025 масса соли 428 - (8 дней жил у матери) 524-388+797-355+644-428=794
	дней 153+11-3-8 (+11 тк замеры на 12янв, -3 жил у матери -8 жил у матери)
	794/(153+11-3-8)=5.18
	*/
	s = `<h4 id="graphs">Графики</h4>` + createAscendingArray(ST.length, 0).reduce((a, e) => a + `<p id='g${e}' class='mw'></p>`, '')
	if (par === undefined) {
		el('p').insertAdjacentHTML("afterend", `<span id="s286">` + s + '</span')
	}
	else {
		el('s286').innerHTML = s
	}

	if (N == 8) {
		r = recipeObject(`салат оливье
картофель 400
морковь 300
огурцы 200
зеленый горошек 200 бжу 5 0.2 8.3 клетчатка 5.7
/яйцо 4*61.1
яйцо 4c0
докторская колбаса 400 бжу 12 20 0 животный белок/жир 1 1
майонез 300
укроп зелень 30
соль 30`, 1)
		r.id = 'r8'
		recipeLoad(r)
	}

	if (gp.slice(fi, li).length) {
		//console.log(callLoadJoinedRecipe)
		if (callLoadJoinedRecipe) {
			loadJoinedRecipe(fi, li)
		}
		cd = calorieByDay.slice(fi, li)
		ed = eatenByDay.slice(fi, li)
		width = SUMMARY || PERIOD ? 1400 : 650
		labels = createDateLabels(fi, li)
		na = ["калории", "масса тела"]
		da = [cd, mass.slice(fi, li)]
		if (ADD_GRAPH0) {
			const shift = 1;
			[7, 14].forEach(e => {
				na.push('скользящее среднее по калориям за ' + dayString(e))
				l = calorieByDay.length
				a = new Array(e + shift).fill(NaN)
				//i - e-shift>=0
				for (i = e + shift; i <= l; i++) {
					c = calorieByDay.slice(i - e - shift, i - shift)
					ev = expectedValue(c)
					a.push(ev)
				}
				da.push(a)
			})
		}
		createNGraphs('g0', na, labels, da
			, {
				width
				, type: 'line'
				, borderWidth: 3
			})

		createNGraphs('g1', ['калории', 'масса съеденного'], labels, [cd, ed], {
			width
			, type: 'bar'
		})
		gCalorie100g = cd.map((e, i) => e * 100 / ed[i])

		b = gCalorie100g.map(e => 100 / e)
		t = ['калорийность/100г', 'масса съеденного/калории = 100/(калорийность/100г)']
		v = [gCalorie100g, b]
		createNGraphs('g2'
			, t
			, labels, v, { width })

		t = SPECIAL_GRAPH_TITLE[SPECIAL_GRAPH_TYPE];
		id = 'g' + ST.indexOf(SPECIAL_GRAPH_NAME)
		if (SPECIAL_GRAPH_TYPE == 0) {
			dm = deltaMass(mass);
			l = dm.length
			a = Array.from(t, () => [])//a = new Array(t.length).fill([]) not working because a[i] is the same array
			for (i = 2; i <= l; i++) {//need at least two points so starts from i=2
				c = calorieByDay.slice(0, i)
				b = dm.slice(0, i)
				ev = expectedValue(mass.slice(0, i))
				j = leastSquares(c, b);
				m = -j[1] / j[0];
				[m, m / ev, j[0] * 10 ** 6, -j[1] * 10 ** 3].slice(0, t.length).forEach((e, i) => a[i].push(normalize(e, 2)))
			}
			createNGraphs(id
				, t
				, labels.slice(2), a, {
				width, type: 'line'
				, borderWidth: 2
			})
		}
		else if (SPECIAL_GRAPH_TYPE == 1) {
			d = []
			for (i = 0; i < cd.length; i++) {
				d.push([cd[i], ed[i], gCalorie100g[i]])
			}
			d.sort((a, b) => b[0] - a[0])
			l1 = createAscendingArray(li - fi, 0)
			a = Array.from(t, () => [])//a = new Array(t.length).fill([]) not working because a[i] is the same array
			for (i = 0; i < cd.length; i++) {
				for (j = 0; j < a.length; j++) {
					a[j].push(d[i][j])
				}
			}
			createNGraphs(id
				, t
				, l1, a, {
				width, type: 'line'
				, borderWidth: 2
			})
		}

		t = ['скользящее среднее по калориям за ' + dayString(GRAPH_AVG_DAYS), 'масса']
		a = []
		for (i = fi; i < li; i++) {
			c = calorieByDay.slice(Math.max(i + 1 - GRAPH_AVG_DAYS, 0), i + 1)
			ev = expectedValue(c)
			a.push(ev)
		}
		createNGraphs('g4'
			, t
			, labels, [a, mass.slice(fi, li)], {
			width, type: 'line'
			, borderWidth: 2
		})

		//Groupped recipe. Need to make another copy of object because id is changed. Also 2nd parameters days is changed
		a = gp.slice(fi, li)
		ra = a.join('\n')
		gjoinrecipe = ra
		r = recipeObject(ra, 1, 1)
		r.buttonRecipe = a
		gdays = a.length
		o = { days: gdays, id: 'g' + ST_GROUP_INDEX, subrecipes: 4, trColorSequence: 1, summaryid: 'summaryid', callback: callbackgroup1 }
		recipeLoad({ ...structuredClone(r), ...o })
	}
	if (WRITE_GR_FILES) {
		b = ['mass', 'mass1', 'eaten'];
		l = mass.length;
		a = [createAscendingArray(l), mass]
		o = { writeFile: 1 };
		labels = createDateLabels(0, l)
		f = (e, ext = 'gr') => 'p_' + e + '.' + ext;

		c = [mass, eatenByDay];
		c.forEach((e, i) => o[f(b[i] + 'Calorie')] = stats(e, calorieByDay, i))

		o[f('massCarbohydrate')] = stats(mass, carbohydrateByDay, c.length)
		o[f('massCalorie', 'txt')] = mass.reduce((a, e, i) => a + (i ? '\n' : '') + e.toFixed(1) + ' ' + calorieByDay[i], '');

		dm = deltaMass(mass);
		['mass', 'calorie', 'deltamass'].forEach((e, i) => {
			if (i < 2) {
				return
			}
			a[1] = [mass, calorieByDay, dm][i]
			p = getSpline(a[1]);
			if (i == 2) {
				a[0] = a[0].slice(0, -1)
			}
			o[f(e)] = graphString(a, a[0].length, i != 1 ? GRIDMASS : GRIDCALORIE, p, 1);
		});

		l = Math.min(dm.length, calorieByDay.length)
		a[1] = []
		const st = 2
		for (i = st; i < l; i++) {
			c = calorieByDay.slice(0, i)
			b = dm.slice(0, i)
			ev = expectedValue(mass.slice(0, i))
			j = leastSquares(c, b)
			a[1].push(-j[1] / j[0] / ev)
		}
		a[0] = createAscendingArray(l - st)
		o[f('c0')] = graphString(a, a[0].length, GRIDC0, null, 1);

		a[1] = getCalorieWeekData()[0].split(/\s+/).map(e => Number(e));
		l = a[1].length
		a[0] = createAscendingArray(l)
		o[f('calorieWeek')] = graphString(a, a[0].length, GRIDCALORIE100, null, 1);

		l = calorieByDay.length
		a[1] = []
		a[2] = []
		for (i = 1; i <= l; i++) {
			c = calorieByDay.slice(0, i)
			ev = expectedValue(c)
			a[1].push(ev)

			j = 7
			if (i < j) {
				ev = NaN;//not show
			}
			else {
				c = calorieByDay.slice(i - j, i)
				ev = expectedValue(c)
			}
			a[2].push(ev)
		}
		a[0] = createAscendingArray(l)
		o[f('calorieAvg')] = graphString(a, a[0].length, GRIDCALORIE100, null, 1);

		fetchpost('../php/poverty.php', o
			, (s, d) => { console.log(s); showElapseTime(d, 315) }
			, new Date()
		)
	}

	f = a => a.reduce((a, e) => a + '<th>' + e, '')
	const MMA = ['минимум', 'максимум', 'среднее']
	const MMT = ['&sigma;', '&mu; - 3&sigma;', '&mu; + 3&sigma;']
	s = '<h4>' + ST[ST_GROUP_INDEX + 2] + '</h4><table><tr>'
	for (k = 0; k < 2; k++) {
		s += `<td style="padding-right:40px"><table class="table_color table_border"><thead><tr><td>${k ? 'калории' : 'масса'}` + f(MMA) + '</thead>'
		for (i = 0; i < 3; i++) {
			s += '<tr><th>' + BDS[i];
			for (j = 0; j < 3; j++) {
				l = 3 * i + j + 9 * k
				s += '<td>' + formatNumber(massCalorieMinMax[l], 1)
			}
		}
		s += '<tr><th>общее';
		for (j = 0; j < 3; j++) {
			min = Infinity
			max = -Infinity
			for (i = 0; i < 3; i++) {
				l = 3 * i + j + 9 * k
				min = Math.min(min, massCalorieMinMax[l])
				max = Math.max(max, massCalorieMinMax[l])
			}
			s += '<th>' + formatNumber(min, 1) + ' - ' + formatNumber(max, 1)
		}
		s += '</table>'
	}
	s += '</table><p>'
	if (gp.length) {
		s += [mass, deltaMass(mass), calorieByDay, eatenByDay, gCalorie100g].reduce((a, _e, i) => {
			//here full array calorieByDay, in ?least_squares exclude last value calorieByDay.slice(0,-1)
			if (i == 4) {
				e = _e
			}
			else {
				if (par === undefined) {
					if (PERIOD) {
						j = firstLastIndices()
						e = _e.slice(j[0], j[1])
					}
					else {
						e = _e
					}
				}
				else {
					e = _e.slice(par[0], par[1])
				}
			}
			c = i < 2;
			t1 = [Math.min(...e), Math.max(...e)]
			m = expectedValue(e);
			si = Math.sqrt(variance(e, m))
			t2 = [m, si, m - 3 * si, m + 3 * si]

			a += '<tr><td>' + ['масса', 'разница массы', 'килокалории', 'съедено', 'ккал/100г'][i]
			t1.forEach((e, i) => {
				v = i ? e - t2[0] : t2[0] - e
				b = v > t2[1] * 3//out of 3sigma range .26 .97 .79
				a += '<td>' + (b ? '<b>' : '') + formatNumber(e, 1) + (c ? ' кг' : '')
					+ (b ? ' &nbsp; ' + (v / t2[1]).toFixed(2) + '&sigma;</b>' : '')
			})
			t2.forEach((e, j) => a += '<td>' + formatNumber(e * (i == 1 && j == 0 || c && j == 1 ? 1000 : 1), 2)
				+ (c ? (i == 0 && j == 1 || i == 1 && j < 2 ? ' г' : ' кг') : ''))
			return a
		}, '<table class="table_border table_color"><thead><tr><th>' + f(MMA.concat(MMT)) + '</thead>') + '</table>'
	}
	el('g' + (ST_GROUP_INDEX + 2)).innerHTML = s
}

function dateref(k, n, dm) {
	let a = gp[n].split('\n')[0].slice(1), s = 'm'
	if (dm >= 0) {
		s += ' nm' + (dm > 0 ? 1 : 2)
	}
	if (SUMMARY || PERIOD) {
		a = a.replace(' масса', '');//.replace(/([а-я]{3})[а-я]+/, '$1').replace(' ', '')
	}
	return `<a href='#pp${k}' class='${s}'>${a + (dm > 0 && isFinite(dm) ? '<span class="snm">' + formatNumber(dm, 1) + '</span>' : '')}</a>`
}

function callbackUnionRecipe(s, o, d) {
	//console.log('callbackUnionRecipe')
	showElapseTime(d, arguments.callee.name)
	if (gcommand == 'delete') {
		carbohydrateByDay.pop()
		calorieByDay.pop()
		eatenByDay.pop()
		bdsMassCalorie.pop()
	}
	else {
		try {
			a = JSON.parse(s)
		}
		catch (ex) {
			console.log(s + ex)
			return
		}
		carbohydrateByDay_ = getAValue(a, 7, false)
		calorieByDay_ = getAValue(a, 9, false)
		eatenByDay_ = getAValue(a, 1, false)
		b = [{ data: a.data[0].data.filter(e => e.class.includes('bold')) }]
		bdsMassCalorie_ = getMassCalorieValue(b, false)
		if (gcommand == 'plus') {
			if (gfi != calorieByDay.length) {
				console.log(`gfi=${gfi} != ${calorieByDay.length} need ${REFRESH}файлы`)
			}
			carbohydrateByDay.push(carbohydrateByDay_)
			calorieByDay.push(calorieByDay_)
			eatenByDay.push(eatenByDay_)
			bdsMassCalorie.push(bdsMassCalorie_)
		}
		else {
			if (gfi >= calorieByDay.length || gfi < 0) {
				console.log(`gfi=${gfi} >= ${calorieByDay.length} or <0 need ${REFRESH}файлы`)
			}
			carbohydrateByDay[gfi] = carbohydrateByDay_
			calorieByDay[gfi] = calorieByDay_
			eatenByDay[gfi] = eatenByDay_
			bdsMassCalorie[gfi] = bdsMassCalorie_
		}

	}
	writeDataFile(new Date(), false)
	load([gfi, gfi + 1], false)
}

function callbackgroup1(s, o, d) {
	showElapseTime(d, arguments.callee.name)
	try {
		a = JSON.parse(s)
	}
	catch (ex) {
		alertException(s)
		return
	}
	if (a.data === undefined) {//empty recipe is ok
		b = []
	}
	else {
		//slice(0,-1) to remove всего
		b = a.data[0].data.slice(0, -1).map(e => [e[0][1], e[1][1]]).filter(e => !NOB12_GOODS.includes(e[0]))
	}
	fetchpost('../php/poverty.php', { group: JSON.stringify(b) }, callbackgroup2, new Date())
}

function callbackgroup2(s, d) {
	showElapseTime(d, arguments.callee.name)
	try {
		a = JSON.parse(s)
	}
	catch (ex) {
		console.log(s)
		console.log(ex)
		return
	}

	d = []
	d1 = []
	b12 = 0
	join = [
		['колбаса', ['колбаса', 'ветчина']]
		, ['сметана', ['сметана топленая 25%', 'сметана брест-литовск 25%', 'сметана 20%', 'сметана 30%']]
		, ['молоко', ['молоко 2.5%', 'молоко 3.2%']]
		, ['творог', ['творог 9%', 'творог 5%']]
	]
	j = []
	join.forEach((e, i) => {
		d1.push([e[0], 0, null, 0])
		e[1].forEach(e => j[e] = i)
	})
	mt = 0
	a.forEach(e => {
		mt += e[1]
		if (e[2] == '?') {
			m = gjoinrecipe.replaceAll('ё', 'е').match(new RegExp(e[0] + String.raw`.*b12\s*(\d*(\.\d*)?)`))
			e[2] = m === null ? '?' : m[1]
			e[3] = e[2] * e[1] / 100
		}
		b = [e[0], [formatNumber(e[1], 0), e[1]], [formatNumber(e[2], 3), e[2]], e[3] == '?' ? ['?', '?'] : [formatNumber(e[3], 3), e[3]]]
		d.push(b)
		o = j[e[0]]
		if (o !== undefined) {
			o = d1[o]
			o[1] += e[1]
			o[3] += e[3]
		}
		else {
			d1.push(b)
		}
		if (e[2] != '?') {
			b12 += e[1] / 100 * e[2];
		}
	})
	d1.forEach(e => {
		if (e[2] === null) {
			e[2] = 100 * e[3] / e[1]
			for (i = 1; i < 4; i++) {
				e[i] = [formatNumber(e[i], i == 1 ? 0 : 3), e[i]]
			}
		}
	})
	d1 = d1.filter(e => e[1][1] != 0)//e[1][1]=0 not need to show (can be for PERIOD)
	b12s = formatNumber(b12, 1)
	title = {
		up: ['название', 'масса', 'b12 мкг/100г', 'b12 всего мкг']
		, down: ['', 'всего', formatNumber(mt, 1), mt ? formatNumber(b12 * 100 / mt, 3) : '-', b12s]
	}
	el('g' + (ST_GROUP_INDEX + 1)).innerHTML = '<h4 id="b12">' + ST[ST_GROUP_INDEX + 1] + '</h4><table><tr><td>простая таблица'
		+ new Table(title, d, "s31cbn").html()
		+ '<td style="vertical-align:top;padding-left:35px;">объединённая таблица'
		+ new Table(title, d1, "s31cbn").html()
		+ '</table>'
		+ '<p class="mw"><i>Примечание.</i> Таблицы отсортированы по суммарному содержанию витамина b12, всего b12 ' + b12s + ' мкг.'
		+ [2.4, 3].reduce((a, e, i) => {
			need = e * gdays;
			return a + "<br>По " + (i ? 'российскому' : 'международному') + ' стандарту требуется ' + e + "*" + gdays + "=" + formatNumber(need, 2) + ' мкг'
				+ ", получено " + formatNumber(b12 * 100 / need, 1) + '%.'
		}, '')
}

function recipeObject(p, days, columnsType) {
	let a = ['б.всего', 'ж.всего', 'у.всего', 'кк%']
	if (columnsType) {
		a.push('b12', 'b12.всего', 'кл.', 'кл.всего')
	}
	return {
		p
		, columns: [a, ['р/кг', 'р/1000кк', 'р всего', 'строка в чеке / дата чека']]
		, h4: 1
		, mass: evMass
		, days
		, show_summary_costs: 0
		, numbers: 1
	}
}

function countMassCalorieMinMax(fi, li) {
	//console.log(fi, li, bdsMassCalorie.length)
	a = new Array(6).fill([Infinity, -Infinity, 0]).flat()
	//bdsMassCalorie[i]=[ [breakfastMass,breakfastCalorie],[dinnerMass,dinnerCalorie],[supperMass,supperCalorie] ]
	bdsMassCalorie.slice(fi, li).forEach(e => {
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 2; j++) {
				m = e[i][j]
				k = 3 * i + (j ? 9 : 0)
				a[k] = Math.min(m, a[k])
				a[k + 1] = Math.max(m, a[k + 1])
				a[k + 2] += m
			}
		}
	})
	for (i = 0; i < 6; i++) {
		a[3 * i + 2] /= li - fi
	}
	//massCalorieMinMax[min,max,avg min,max,avg min,max,avg] calorie[min,max,avg min,max,avg min,max,avg]
	massCalorieMinMax = a.map(e => +e.toFixed(2))
}

function updateMinMaxDataCB(s, d) {
	try {
		a = JSON.parse(s)
	}
	catch (ex) {
		console.log(s)
		return
	}
	bdsMassCalorie = getMassCalorieValue(a.data, true)
	countMassCalorieMinMax(0, bdsMassCalorie.length)
	finishUpdateDataFile(d)
}

function updateCalorieCB(s, d) {
	try {
		a = JSON.parse(s)
	}
	catch (ex) {
		alertException(s)
		//cann't throw because fetchpost has catch method and call this function 2dn time
		return
	}
	carbohydrateByDay = getAValue(a, 7, true)
	calorieByDay = getAValue(a, 9, true)
	eatenByDay = getAValue(a, 1, true)
	finishUpdateDataFile(d)
}

function getAValue(a, n, b) {
	let v = a.data[0].data.map(e => normalize(e[n][1], 2))
	return b ? v.slice(0, -1) : v.slice(-1)[0]
}

function getMassCalorieValue(a, b) {
	let v = a.map(e => e.data.slice(0, 3).map(e => [normalize(e[1][1], 2), normalize(e[9][1], 2)]))
	return b ? v : v[0]
}

function alertException(s) {
	const t = '</table>'
	if (s.startsWith(t)) {
		s = s.slice(t.length)
	}
	alert(s)
}

function finishUpdateDataFile(d) {
	if (++gc != 2) {
		return
	}
	writeDataFile(d, true)
	loadFromCalendars()
}

function writeDataFile(d, showAlert) {
	let dataFile = ['calorieByDay', 'eatenByDay', 'carbohydrateByDay', 'bdsMassCalorie'].map(e => e + ' = ' + JSON.stringify(window[e])).join('\n')
	//console.log(dataFile,JSON.stringify(calorieByDay.length))
/*
	fetchpost('../php/poverty.php', { dataFile }, s => {
		s = 'обновнение файлов завершено статус - ' + s + ', время ' + elapseTime(d)
		if (showAlert) {
			alert(s)
		}
		else {
			console.log(s)
		}
	})
*/
}

function showInfo() {
	o = {}
	a = []
	m = new Map()
	deltaMass(mass).forEach((e, i) => {
		e = e.toFixed(1)
		v = o[e]
		if (v === undefined) {
			v = o[e] = []
		}
		v.push(calorieByDay[i])
		a.push([calorieByDay[i], e])
		i = m.get(e) || 0
		m.set(e, i + 1)
	})
	s = [...m].sort((a, b) => a[0] - b[0]).reduce((a, e) => a + e[0] + ' ' + e[1] + '\n', '')
	console.log(s)
	d = -Infinity;
	a = a.sort((a, b) => a[0] - b[0])
	for (i = 0; i < a.length - 1; i++) {
		m = a[i][1]
		for (j = a.length - 1; j > i; j--) {
			m1 = a[j][1]
			l = m - m1
			if (l >= 0) {
				if (a[j][0] - a[i][0] >= d) {
					d = a[j][0] - a[i][0]
					console.log(a[i][0], m, a[j][0], m1, d.toFixed(1))
				}
				break;
			}
		}
	}

	m = Infinity;
	maxSameDifference = -Infinity
	for ([k, v] of Object.entries(o)) {
		v.sort((a, b) => a - b)//ascending
		d = v[v.length - 1] - v[0]
		if (d > maxSameDifference) {
			maxSameDifference = d
			maxSameDifferenceD = k
		}
		for (i = 0; i < v.length - 1; i++) {
			d = v[i + 1] - v[i]
			if (d < m) {
				m = d;
				md = [v[i + 1], v[i], k];
			}
		}
	}
	console.log(m.toFixed(1), ...md)
	console.log(maxSameDifference.toFixed(1), maxSameDifferenceD)

	d = Object.keys(o).sort((a, b) => a - b)
	s = `[${d[0]} ${d[d.length - 1]}] absent`
	for (i = Number(d[0]) + .1; i < Number(d[d.length - 1]); i += .1) {
		j = i.toFixed(1)
		if (!d.includes(j)) {
			s += ' ' + j
		}
	}
	console.log(s)
}

function statp(b, n) {
	if (n === undefined) {
		n = b[0].length
	}
	let a = b.map(e => e.slice(0, n))
	let ev = a.map(e => expectedValue(e))
	let disp = a.map((e, i) => variance(e, ev[i]))
	return [correlation(a[0], a[1], ev[0], ev[1], Math.sqrt(disp[0]), Math.sqrt(disp[1])), ev, disp]
}

function stats(mass, calorieByDay, ind) {
	let m, c, n, a, corr, le, f, w, s
	m = ind == 1 ? mass : deltaMass(mass)
	c = calorieByDay
	n = Math.min(m.length, c.length)
	a = [c.slice(0, n), m.slice(0, n)];
	corr = statp(a, n)[0]
	//count correlation only if calorie in range
	if (OUTPUT_CORRELATION && ind == 0) {
		le = 3
		f = c.slice(0, -1)
		s = Math.min(...f) + '-' + Math.max(...f) + ' ' + formatNumber(corr, le) + ' 100%';
		[[1000, 1500], [1000, 1600], [1000, 1700], [1000, 1800]].forEach(r => {
			f = [[], []]
			w = -1
			a[0].forEach((e, i) => {
				if (e >= r[0] && e <= r[1]) {
					f[0].push(a[0][i])
					f[1].push(a[1][i])
					w++
				}
			});
			f = statp(f, n)[0]
			s += '\n' + r[0] + '-' + r[1] + ' ' + formatNumber(f, le) + ' ' + formatNumber(w * 100 / n, 1) + '%' + ' ' + w + '/' + n
		})
		console.log(s)
	}
	le = leastSquares(a[0], a[1]);
	return graphString(a, n, ind == 1 ? GRIDV1 : GRIDV0, le)
}

function graphWrap(s) {
	const graphSeparator = String.fromCharCode(8)
	return graphSeparator + s + graphSeparator
}

function graphString(a, n, grid, le, a0int) {
	let i, j, k, s, min, max, d, s1 = []
	for (k = 1; k < a.length; k++) {
		s1[k - 1] = ''
		for (i = 0; i < n; i++) {
			for (j = 0; j < 2; j++) {
				s1[k - 1] += normalize(a[j == 0 ? 0 : k][i], 1) + (i == n - 1 && j == 1 ? '' : ' ')
			}
		}
	}

	s = '1.27'
	for (i = 0; i < 2; i++) {
		if (i == 0) {
			min = Math.min(...a[i])
			max = Math.max(...a[i])
		}
		else {
			min = Infinity
			max = -Infinity
			for (k = 1; k < a.length; k++) {
				j = a[k].filter(e => !isNaN(e))
				min = Math.min(min, ...j)
				max = Math.max(max, ...j)
			}
		}
		d = max - min
		s += `\nminmax_${'xy'[i]}=`
		for (j = 0; j < 2; j++) {
			if (j) {
				if (i == 0 && a0int) {
					v = max + 1
				}
				else {
					v = max + d * PERCENT
				}
			}
			else {
				if (i == 0 && a0int) {
					v = min - 1
				}
				else {
					v = min - d * PERCENT
				}
			}
			s += (j ? ' ' : '') + graphWrap(normalize(v, 4))
		}
	}
	s += GRIDN.reduce((a, e, i) => a + ' ' + e + '=' + graphWrap(grid[i]), `\ngrid`)

	j = []
	s1.forEach(e => {
		j.push(e)
		if (Array.isArray(le)) {
			j.push(polynomialString(le, 2, 'x'))
		}
		else if (typeof le == 'string') {
			j.push(le)
		}
	})

	return j.reduce((a, e, i) => a + '\ntype=' + graphWrap(0)
		+ ' color=' + graphWrap(+!i) + ' formula=' + graphWrap(e) + ' show=' + graphWrap(1), s);
}

function getSpline(y) {
	let n = y.length - 1, i, j, a, b = [], c = [], d, s = ''
	for (i = 0; i < n - 1; i++) {
		a = Array(n - 1).fill(0)
		a[i] = 4
		if (i - 1 >= 0) {
			a[i - 1] = 1
		}
		if (i + 1 < n - 1) {
			a[i + 1] = 1
		}
		c.push(a)
		b[i] = 3 * (y[i + 2] - 2 * y[i + 1] + y[i])
	}
	a = math.inv(c)
	c = [0, ...math.multiply(a, b), 0]
	b = []
	d = []
	for (i = 0; i < n; i++) {
		b[i] = y[i + 1] - y[i] - (c[i + 1] + 2 * c[i]) / 3
		d[i] = (c[i + 1] - c[i]) / 3
	}
	for (i = 0; i < n; i++) {
		j = i + 1
		s += '#' + j + ' ' + (j + 1) + ' ' + polynomialString([d[i], c[i], b[i], y[i]], 1, '(x-' + j + ')')
	}
	//spline coefficients a,b,c,d
	// return [y.slice(0,-1),b,c.slice(0,-1),d]
	return s;
}

function createDateLabels(fi, li) {
	return Array.from({ length: li - fi }, (_, i) => dateString(fi + i))
}

function dateString(i) {
	return getDateFromStart(i).toLocaleString("ru-ru", { day: "numeric", month: "short" }).replace(/\.|\s/g, '');
}

function firstIndex(n, summary = false, period = false) {
	return period ? gp.length - 1 : (n == 1 || summary ? 0 : 1 + 7 * (n - 2))
}

function firstLastIndices() {
	let fi, li
	if (gp.length) {
		fi = firstIndex(N, SUMMARY, PERIOD)
		if (PERIOD) {
			li = fi + 1
		}
		else if (SUMMARY) {
			li = [31, 61, gp.length][SUMMARY - 1];
		}
		else {
			if (N == 10) {
				li = 61
			}
			else {
				li = fi + (N == 1 ? 1 : 7)//not included
			}
		}
	}
	else {
		fi = 0
		li = 1
	}
	return [fi, li]
}

function getCalorieWeekData() {
	let s = ['', ''], i, j, a, b, mb, c, p
	for (i = 1; ; i++) {
		a = firstIndex(i)
		b = firstIndex(i + 1)
		mb = Math.min(b, mass.length)
		c = 0
		for (j = a; j < mb; j++) {
			c += calorieByDay[j]
		}
		p = [c / (mb - a), mass[Math.min(b, mass.length - 1)] - mass[a]].map(e => formatNumber(e, 1).replaceAll(' ', ''))
		if (i != 1) {
			p[0] = ' ' + p[0]
		}
		s[0] += p[0]
		s[1] += ' '.repeat(p[0].length - p[1].length) + p[1]
		if (b >= mass.length) {
			break;
		}
	}
	return s;
}

function dayString(i) {
	let j = i % 100, k = i % 10
	return i + ' ' + (j > 10 && j < 20 || k == 0 || k > 4 ? 'дней' : (k == 1 ? 'день' : 'дня'))
}

function showElapseTime(d, s) {
	if (SHOW_TIME) {
		console.log(elapseTime(d), s)
	}
}

function elapseTime(d) {
	return formatNumber((new Date() - d) / 1000, 1)
}

function createAscendingArray(length, start = 1) {
	return Array.from({ length }, (_, i) => i + start)
}

function getDateFromEnd(days) {
	return getDateFromStart(gp.length - 1 - days)
}

function getDateFromStart(days) {
	return new Date(START_DATE.getTime() + days * DAY_SECONDS);
}

function updateDataFile() {
	gc = 0
	r = createAllDaysRecipe()
	fetchpost('../php/siteupdate.php', { ...structuredClone(r), ...{ subrecipes: 3, recipe: 1 } }, updateCalorieCB, new Date())
	fetchpost('../php/siteupdate.php', { ...structuredClone(r), ...{ subrecipes: 2, recipe: 1 } }, updateMinMaxDataCB, new Date())
}
