const VOL = [720, 1000, 500, 670]
const VOLS = VOL.slice().sort((a, b) => a - b)
/* 				
https://rusautomation.ru/articles/nasypnaya-plotnost-sypuchikh-materialov/
Насыпная плотность сыпучих материалов г/л
Соль пищевая тонкого помола – 1200
Сахар-песок – 850
my [4/3, 1]
web salt is better, may be sugar also
*/
const DENSITY_ALL = [1.0492, 1.2, .85]
const DIGITS = 1;

const DEFAULT = [.72, 10, 5, 3, 3, 3]
const N = ['объём банки', 'уксус', 'соль', 'сахар', 'гвоздика', 'чёрный перец', 'душистый перец']
const VINEGAR_PERCENT_ID = 'v' + VOL.length
const M = [15 / 214, 50 / 1412, 15 / 105];
const ME = [['мл', 'чл', 'стл'], ['мл', 'г', 'чл', 'стл'], ['шт', 'г']]

function load() {
	// console.log(1)
	a = [VOL.reduce((a, v, i) => a + (i % 2 && !gMobile ? '' : '<tr>')
		+ '<td><table class="nm" id="t' + i + '"' + (gMobile && i % 2 || !gMobile && (i == 1 || i == 2) ? ' style="background:LemonChiffon;"' : '') + '>'
		+ N.reduce((a, e, j) => a + '<tr><td>' + (j == 1 ? '' : e) + '<td>'
			+ (j ? '' : createInputSelect({ min: 1, value: v, id: 'i' + i }, VOLS, undefined, 'inputVolumeChanged(event)', 1) + ' мл'), '')//volume
		+ '</table>'
		, '')
		,
	N.slice(1).reduce((a, e, i) => a + '<tr><td>' + e
		+ (i ? '' : ' ' + createInputSelectVinegar(VINEGAR_PERCENT_ID, 70, 'echeck(event)'))
		+ '<td>' + createInput('p' + i, DEFAULT[i]) + ' '
		+ (i < 3 ? createSelect('ps' + i, ['г', 'мл', 'чл', 'стл'], undefined, i ? 0 : 2) : 'шт.')
		+ '<td> на ' + createInput('pv' + i, 1000) + ' мл'
		, '') + '<tr><td colspan="3">' + wrapcv('<input type="checkbox" id="same" checked><label for="same">одинаковый % уксуса для всех банок</label>')
	]

	el('p').innerHTML = '<div class="tab">'
		+ ['количество', 'параметры'].reduce((a, e) => a + '<button class="tablinks" onclick="switchTab(event)">' + e + '</button>', '')
		+ '</div>'
		+ a.reduce((a, e) => a + '<div class="tabcontent"><table class="nm">' + e + '</table></div>', '')

	ga = []
	for (i = 1; i < N.length; i++) {
		if (i < 4) {
			a = [1 / 5, 1 / 15]
			if (i == 2 || i == 3) {
				a.unshift(DENSITY_ALL[i - 1])
			}
		}
		else {
			a = [M[i - 4]]
		}
		a.unshift(1)
		ga.push(a)
	}


	i = 0
	if (i != 1) {
		updateRecountTable(true)
	}
	document.getElementsByClassName('tablinks').item(i).click()
}

//not need to create0 in case of input changes, because need to store focus on input element, so not need to create
function updateRecountTable(create0) {
	let b = el('same').checked
	let e = el('v0')
	let p = e ? e.value : 70
	for (let i = 0; i < VOL.length; i++) {
		if (i == 0 && !create0) {
			continue
		}
		el('t' + i).rows[1].cells[0].innerHTML = b && i > 0 ? 'уксус ' + p + '%' : 'уксус ' + createInputSelectVinegar('v' + i, p, 'inputVolumeChanged(event)')
	}
	recountAll()
}

function recountAll() {
	let i, j
	gpercent = getPercent(VINEGAR_PERCENT_ID, true)
	/* 	вяземский неполную чл на 1л ~ .5чл/720мл, 
		грибоведы маринованные грибы 1чл на 1л
	 */
	//{мл мл мл шт шт шт}/литр
	gpar = [];
	for (i = 0; i < N.length - 1; i++) {
		if (i < 3) {
			j = el('ps' + i).selectedIndex
		}
		v = meval('p' + i) / meval('pv' + i) * 1000
		if (i < 3) {
			//console.log(i,j)
			v *= [1 / DENSITY_ALL[i], 1, 5, 15][j]
		}
		gpar.push(v)
	}
	for (i = 0; i < VOL.length; i++) {
		updateTable(i)
	}
}

function meval(id, lessEqual100 = false) {
	// console.log(id)
	try {
		let v = el(id).value
		// console.log(v,id)
		if (/^[-\s\d+*\/().]+$/.test(v)) {
			v = eval(v)
			//v>0 needs always
			if (isFinite(v) && v > 0 && (lessEqual100 && v <= 100 || !lessEqual100)) {
				return v;
			}
		}
	}
	catch {
	}
	return NaN;
}

function createInputSelectVinegar(id, value, changef) {
	return createInputSelect({ min: 1, max: 100, value, id }, ['', 70, 9], undefined, changef) + '%'
}

function createInputSelect(input, items, selectid, changef, se = 0) {
	return '<div class="select-editable se' + se + '">'
		+ createSelect(selectid, items, 'this.nextElementSibling.value=this.value;' + (changef === undefined ? '' : changef))
		+ '<input type="number" id="' + input.id + '"'
		+ (input.min === undefined ? '' : ' min="' + input.min + '"')
		+ (input.max === undefined ? '' : ' max="' + input.max + '"')
		+ ' value="' + input.value + '"'
		+ (changef === undefined ? '' : ' oninput="' + changef + '"') + '></div>'
}

function createSelect(id, items, changef, selectedIndex) {
	return '<select' + (id === undefined ? '' : ' id="' + id + '"') + (changef === undefined ? '' : ' onchange="' + changef + '"') + '>' +
		items.reduce((a, e, i) => a + '<option' + (i == selectedIndex ? ' selected' : '') + '>' + e + '</option>', '')
		+ '</select>'
}

function createInput(id, value) {
	return `<input type="text" value="${value}" id="${id}" style="width:40px;" oninput="echeck('${id}')"></input>`
}

function getPercent(id, par) {
	let b = el('same').checked
	return meval(par || !b ? id : 'v0', true)
}

function tableChanged(event) {
	let i = getN(event);
	if (i == 0 && el('same').checked) {
		//no items are created so focus will be in same place
		updateRecountTable(false)
	}
	else {
		updateTable(i)
	}
}

function updateTable(i) {
	j = -1
	v = meval('i' + i)
	p = getPercent('v' + i, false)
	e = isNaN(v) || isNaN(p) || isNaN(gpercent) || gpar.some(e => isNaN(e))
	for (r of el('t' + i).rows) {
		j++
		if (j == 0) {
			continue
		}
		//se needs only for j==2 or j==3
		se = [2, 3].includes(j) && gMobile ? '' : ' '
		t = gpar[j - 1] * v / 1000
		if (j == 1) {
			t *= gpercent / p
		}
		a = ME[j == 1 ? 0 : (j > 3 ? 2 : 1)]
		r.cells[1].innerHTML = ga[j - 1].map((v, i) => e ? '?' : (i == 1 && j > 3 ? formatNonZero : formatNumber)(t * v, DIGITS) + se + a[i]).join(se + '=' + se)
	}
}

/* formatNonZero works line formatNumber but return always non zero string
formatNumber(0.01,1)="0"
formatNonZero(0.01,1)="0.01" - return string is always nonzero
formatNonZero(0.012,1)="0.01" - return string is always nonzero
on js realized in marinade.js
on php realized in calorieCommon.php
*/
function formatNonZero(v, digits) {
	return formatNumber(v, v == 0 ? digits : Math.max(Math.floor(-Math.log10(v)) + 1, digits));
}

//https://www.w3schools.com/howto/howto_js_tabs.asp
function switchTab(event) {
	let j, t = event.target, a = [...document.getElementsByClassName('tablinks')];
	a.forEach((e, i) => {
		if (e == t) {
			e.classList.add('active');
			j = i
		}
		else {
			e.classList.remove('active');
		}
	});

	[...document.getElementsByClassName('tabcontent')].forEach((e, i) => e.style.display = i == j ? 'block' : 'none');

	if (a[0] == t) {
		//check 'same percent' can be changed so need to create0 always
		updateRecountTable(true)
	}
}

//from calorie_recipe
function wrapcv(s) {
	return '<span class="checkboxes"><label><span>' + s + '</span></label></span>'
}

function echeck(event) {
	let id = typeof event == 'string' ? event : gi(event)
	//console.log(event,id)
	//id[0] can be 'p' - parameter or 'i' - volume or 'v' - vinegar
	let vinegar = id[0] == 'v'
	let v = meval(id, vinegar);
	el(id).style.color = isNaN(v) ? 'red' : 'black'
}

function inputVolumeChanged(event) {
	echeck(event)
	tableChanged(event)
}

function getN(event) {
	return gi(event).match(/\d+/)[0]
}

function gi(event) {
	let t = event.target
	let id = t.id;
	if (id == '') {//select
		id = t.nextSibling.id
	}
	return id
}
