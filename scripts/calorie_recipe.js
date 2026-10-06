//default values CHECKA[][] from php
const CHECKA = [
	['numbers', 'номер', 0],
	['check', 'чек', 0]
]
const CHECK = CHECKA.map(e => e[0])

const COLUMN_NAMES = Object.keys(CALORIE_COLUMNS);
const CL = COLUMN_NAMES.length;
const REFRESH = '&#8635;'; //'&#10226;' '&#128472;'
const DEFAULT_PRICE = '';
const RECOUNT_ON_COMBO_SUBRECIPES_CHANGED = 1;
const MD = ['mass', 'days']
const MD_VALUE = [70, 1]
const MD_CHECKED = true

const COLUMNS_SET = [Object.values(CALORIE_COLUMNS)
	, [ /*название*/ 1, /*масса*/ 1, /*масса%*/ 1, /*база%*/ 1, /*белки*/ 1, /*жиры*/ 1, /*углеводы*/ 1, /*б.всего*/ 0, /*ж.всего*/ 0, /*у.всего*/ 0
	, /*кк/100г*/ 1, /*кк всего*/ 1, /*кк%*/ 1, /*р/кг*/ 0, /*р/1000кк*/ 0, /*р всего*/ 0, /*р%*/ 0, /*белок%*/ 0, /*р/гБелка*/ 0
	,/*b12*/0,/*b12.всего*/0,/*кл.*/0,/*кл.всего*/0, /*строка в чеке / дата чека*/ 0]
	, [ /*название*/ 1, /*масса*/ 1, /*масса%*/ 0, /*база%*/ 0, /*белки*/ 1, /*жиры*/ 1, /*углеводы*/ 1, /*б.всего*/ 1, /*ж.всего*/ 1, /*у.всего*/ 1
	, /*кк/100г*/ 1, /*кк всего*/ 1, /*кк%*/ 0, /*р/кг*/ 0, /*р/1000кк*/ 0, /*р всего*/ 0, /*р%*/ 0, /*белок%*/ 0, /*р/гБелка*/ 0
	,/*b12*/1,/*b12.всего*/1,/*кл.*/1,/*кл.всего*/1, /*строка в чеке / дата чека*/ 0]
]

function load() {
	gpagehelp = gPageName == 'calorie_recipe_help'
	if (gpagehelp) {
		redirectUrl()
		for (i = 0; e = el('r' + i); i++) {
			//js automatically changed & to &amp;
			//&мука 340
			p = e.innerHTML.replace('&amp;', '&');
			o = { p }
			if (i == 15) {
				MD.forEach((e, i) => o[e] = i == 1 ? 1 : 65)
			}
			else if (i == 16) {
				o.columns = JSON.stringify({ b12: 1, "b12.всего": 1, 'строка в чеке / дата чека': 0 })
			}
			else if (i == 17) {
				o.columns = JSON.stringify({ 'кл.': 1, 'кл.всего': 1, 'строка в чеке / дата чека': 0 })
			}
			e.innerHTML = '<table><tr><td class="c" style="width:400px">' + p + '<td style="vertical-align:top;">' + `<button class="comboboxbutton" onclick="window.open('index.php?calorie_recipe,,` + new URLSearchParams(o) + `', '_blank').focus()"><img src="img/jm/edit16.png"></button>`
		}
		return
	}

	gcolumns = Object.values(CALORIE_COLUMNS);
	grkgformula = true

	/*cann't set 
	#p{
		margin: 0 0 400px 0;
	}
	in css because <p id="p"><p> in other pages so add style manually*/
	el('p').style.margin = "0 0 400px 0";

	document.body.onkeydown = e => {
		if (e.key == 'Escape') {
			bclick()
			e.preventDefault()
		}
		else if (e.key == 'F9' || e.key == 'F10') {
			let i = (gi + (e.key == 'F9' ? -1 : 1) + gr.length) % gr.length
			rc(i)
			e.preventDefault()
		}
		if (e.key == 'F1' || e.key == 'F2') {
			bclickt()
			e.preventDefault()
		}
	};

	el('t').innerHTML = '<button class="comboboxbutton" style="margin-bottom:3px;" onclick="bclick()" id="refresh">' + REFRESH + '</button>'
		+ ' <button class="comboboxbutton" onclick="showColumnsDialog()">колонки</button>'
		+ ' <span id="goodscombo"></span>'
		+ ' <span id="subrecipescombo"></span>'
		+ ' <span id="calendar"></span>'
		+ ' <span id="helpcombo"></span>'
		+ ' Нажмите Esc для расчёта. Время <span id="time"></span>'
		+ '<br>'
		+ '<span style="background:LemonChiffon">'
		+ cb('addon', 'масса', MD_CHECKED)
		+ MD.reduce((a, e, i) => a + (i ? ' дни' : '') + ` <input type="number" id="${e}" value="${MD_VALUE[i]}" min="1" oninput="massDaysInput()">`, '')
		+ cb('show_summary_costs', 'суммарные расходы', false)
		+ '</span> цены <input type="text" id="price" value="' + DEFAULT_PRICE + '">'
		//note  step="any" allows use float numbers as input
		+ CHECKA.reduce((a, e) => a + cb(e[0], e[1], e[2], e[0] == 'check' ? 'checkClick()' : null), '')
		+ '<p id="recipes">' + gr.reduce((a, e, i) => {
			/* need filter first
			/люда изи кук
			/https://www.youtube.com/watch?v=q9iIyUOuq7E
			#ватрушка на песочном тесте
			...
			*/
			b = e.split('\n').map(e => e.trim())
			if (b[0][0] != '#') {
				b[0] = '#' + b[0]
			}
			return a + (i ? '<br>' : '') + ref(i + 1, i) + ' '
				+ b.filter(e => e[0] == '#').map(e => e.slice(1)).reduce((b, e, j) =>
					b + (j ? ', ' : '') + ref(getTitle(e), i, j)
					, '')
				+ '</b>'
		}, '') + '</p>';
	o = Object.fromEntries(new URLSearchParams(gParameter));
	const sessionKey = 'storage';
	if (Object.hasOwn(o, sessionKey)) {//for very long recipe use sessionStorage see common.js
		e = sessionStorage.getItem(o[sessionKey])
		if (e !== null) {
			o = JSON.parse(e)
		}
	}
	gCalendar = new Calendar('calendar', '', null, '%d%b%y', 1);
	gGoodsCombo = new Combobox('goodscombo', 0
		, 'рецепт'
		, 'рецепт+продукты'
		, 'только продукты');
	gSubrecipesCombo = new Combobox('subrecipescombo', Object.hasOwn(o, 'subrecipes') ? o.subrecipes : 0
		, 'подрецепт и итог'
		, 'только подрецепт'
		, 'только итог'
		, 'объединённый'
		, 'объединённый гр.'
		, subrecipesComboChanged
	);
	gHelpCombo = new Combobox({
		id: 'helpcombo'
		, index: 0
		, data: ['товары', 'предопределённые таблицы', 'остаток/потеря', 'описание редактора рецептов']
		, changeFunction: helpComboCallback
		, buttonTextFunction: () => '?'
	})

	if (o.p) {
		CHECK.concat('addon', 'show_summary_costs').forEach(e => {
			if (Object.hasOwn(o, e)) {
				el(e).checked = JSON.parse(o[e])//"0" "false"
			}
		})
		if (Object.hasOwn(o, 'rkgformula')) {
			grkgformula = JSON.parse(o.rkgformula)
		}
		if (Object.hasOwn(o, 'columns')) {
			for (let [k, v] of Object.entries(JSON.parse(o.columns))) {
				gcolumns[COLUMN_NAMES.indexOf(k)] = v
			}
		}
		MD.concat('price').forEach(e => {
			if (Object.hasOwn(o, e)) {
				el(e).value = o[e]
			}
		});
		if (Object.hasOwn(o, 'mass')) {
			el('addon').checked = true
		}
		rcs(o.p.trim().split(/\n/).map(e => e.trim()).join('\n'));
	}
	else {
		rc(0)
	}
}

function getTitle(p) {
	//from calorie_recipe.php
	const mathSymbol = '[-\\d+*\\/().,eE\\s]*';
	const pureMathBase = mathSymbol + '\\d' + mathSymbol;
	const pureMath = '(' + pureMathBase + ')';
	const pureMaths = '\\s*' + pureMath;
	return p.toLowerCase().replace(new RegExp(
		"\\s*(?<![а-яё])(" + ['остаток', 'дополнительно'].map(e => e[0] + "(" + e.slice(1) + ")?").join('|') + ")" + pureMaths
		, "uig"), "")
}

function ref(s, i, j) {
	return '<a href="#" onclick="rc(' + i + (j === undefined ? '' : (',' + j)) + ')">' + s + '</a>'
}

function wrapcv(s) {
	return '<label>' + s + '</label>'
	//return '<span class="checkboxes"><label><span>' + s + '</span></label></span>'
}

function rc(i, j) {
	gi = i
	let s = gr[i]
	el('check').checked = false
	if (j !== undefined) {
		/*make trim avoid `
		#сныть маринованная на банку 720мл
		`
		*/
		s = s.trim().split(/\n\s*#/)[j]
	}
	rcs(s)
}

function rcs(s) {
	el('a').value = s
	bclick()
}

function bclick(p) {
	if (!gpagehelp && el('refresh').disabled) {
		return
	}
	o = {
		p: p ?? el('a').value
	}
	if (!gpagehelp) {
		o.date = JSON.stringify(gCalendar.getDateFormat('%F'))
		o.goods = gGoodsCombo.getIndex()
		o.subrecipes = gSubrecipesCombo.getIndex()
		if (el('addon').checked) {
			MD.forEach(e => o[e] = el(e).value)
		}
		o.price = el('price').value
		CHECK.concat('show_summary_costs').forEach(e => {
			o[e] = el(e).checked
		})
		o.rkgformula = JSON.stringify(grkgformula)
		o.columns = JSON.stringify(gcolumns);
	}
	el(gpagehelp ? p : 'p').innerHTML = (gpagehelp ? '' : '<h3>') + 'ожидание ответа...' + (gpagehelp ? '' : '</h3>')//long response on remote
	o.recipe = 1
	fetchpost('php/siteupdate.php', o, calorieUpdate, p, new Date());
}

function bclickt() {
	gcolumns = Object.values({
		...CALORIE_COLUMNS, 'б.всего': 1,
		'ж.всего': 1,
		'у.всего': 1,
		'кк%': 1,
		'р/кг': 0,
		'р/1000кк': 0,
		'р всего': 0,
		'строка в чеке / дата чека': 0
	});
	grkgformula = 0
	el('addon').checked = true
	el('days').value = gSubrecipesCombo.getIndex() == 3 ? (el('a').value.match(/^[#№]/gm) || [0]).length : 1//at least one day so use [0]
	//(el('a').value.match(/&день/g) || [0]).length//at least one day so use [0] TODO
	bclick()
}

function checkClick() {
	if (el('check').checked) {
		el('addon').checked = true
	}
}

function showColumnsDialog() {
	let i, j, k, s = '<table class="tabledialog">';
	const nc = 2;
	const d = Math.floor(CL / nc) + (CL % nc != 0)
	for (i = 0; i < d; i++) {
		s += '<tr>'
		for (j = 0; j < nc && (k = i + j * d) < CL; j++) {
			s += '<td>' + cb('c' + k, COLUMN_NAMES[k], gcolumns[k], 'pcheck()', String(k + 1).padStart(2, 0) + ' ')
			if (COLUMN_NAMES[k] == 'р/кг') {
				s += ' ' + cb('rkgformula', 'р/кг формула', grkgformula)
			}
			if (['жиры', 'ж.всего'].includes(COLUMN_NAMES[k])) {
				s += ' <button class="comboboxbutton" onclick="columnsDialogButton(' + (k - 1) + ')">бжу</button>'
			}
		}
	}
	j = ['ок', 'ок' + REFRESH, 'отмена', 'только название', 'по умолчанию', '']
	for (i = 1; i < COLUMNS_SET.length; i++) {
		j.push('набор' + i + REFRESH)
	}
	showModal('выберите колонки, которые нужно показать', s + '</table>', clickModal, j, false);
}

function pcheck() {
	let i, j, k
	for (i = k = 0; i < CL; i++) {
		el('c' + i).disabled = false
		if (el('c' + i).checked) {
			k++
			j = i
		}
	}
	if (k == 1) {
		el('c' + j).disabled = true
	}
}

function clickModal(n) {
	let i
	if (n >= 3) {
		for (i = 0; i < CL; i++) {
			el('c' + i).checked = n == 3 ? !i : COLUMNS_SET[n - 4][i]
		}
		pcheck()
	}

	if ([0, 1].includes(n) || n >= 5) {
		for (i = 0; i < CL; i++) {
			gcolumns[i] = el('c' + i).checked
		}
		grkgformula = el('rkgformula').checked
	}

	if (n == 1 || n >= 5) {
		bclick()
	}

	if (![3, 4].includes(n)) {
		closeModal()
	}
}

function cb(id, title, checked = false, onclick = null, pretitle = '') {
	return wrapcv(pretitle + `<input type="checkbox" id="${id}"` + (checked ? ' checked' : '')
		+ (onclick ? ` onclick="${onclick}"` : '') + '>' + title)
}

function columnsDialogButton(n) {
	let i, c = 0
	for (i = 0; i < 3; i++) {
		if (el('c' + (i + n)).checked) {
			c++;
		}
	}
	for (i = 0; i < 3; i++) {
		el('c' + (i + n)).checked = c < 2
	}
}

function subrecipesComboChanged() {
	if (RECOUNT_ON_COMBO_SUBRECIPES_CHANGED) {
		bclick()
	}
}

function helpComboCallback(i) {
	if (i == 0) {
		window.open('php/jm.php?goods_viewedit_foodonly', '_blank');
	}
	else if (i == 1) {
		bclick('predefined_all')
	}
	else if (i == 2) {
		bclick('loss_all')
	}
	else if (i == 3) {
		window.open('?calorie_recipe_help', '_blank')
	}
	// , ['товары', "window.open('php/jm.php?goods_viewedit_foodonly','_blank')"]
	// , ['предопределённые таблицы', "bclick('predefined_all')"]
	// , ['остаток/потеря', "bclick('loss_all')"]
	// , ['описание редактора рецептов', "window.open('?calorie_recipe_help','_blank')"]
}

function massDaysInput() {
	let ok = []
	MD.forEach((e, i) => {
		let a = el(e)
		ok[i] = a.value.length != 0
		a.style.color = ok[i] ? 'black' : 'red'
	})
	el('refresh').disabled = !ok[0] || !ok[1]
}
