const csortColumn = 5
const csortOrder = 0;
const differentTime = 0;
const localNotFound = 1;
const remoteNotFound = 2;
const sameTime = 3;
const statusString = ['different md5', 'local not found', 'remote not found', '']
const statusIndex = 5;
const IAL = ['ins/upd videos+pages, unadmin', 'load from videos', 'load title from pages', 'test'];
const IAL_VIDEOS = 0
const IAL_LOAD = 1
const IAL_TITLE = 2
const IAL_TEST = 3
const YOUTUBE = 'youtube'
const VIDEO = {
	name: '',
	language: 'russian',
	[YOUTUBE]: '',
	dzen: '',
	title: "<a href='?'>.</a>",
	date: '',
	length: '',
	version: 1,
	section: '',
	pages: ''
}

const REMOTE_TYPE_SIMPLE = 0;
const REMOTE_TYPE_ZIP = 1;
const REMOTE_TYPE_ENCODE = 2;

const CALORIE_CELLS = 5;
const CALORIE_GRAPH_WIDTH = 1100;
const CALORIE_HISTORY_CURRENT_DAY = 0
const CALORIE_HISTORY_DAYS = 1

const CALORIE_GLP = ['Итог.', 'График массы и калорий.', 'График массы еды и калорийности на 100 грамм.', 'График суточной калорийности и отношения суточной калорийности к средней массе.', 'График линейного приближения по методу наименьших квадратов и пар данных: x - калории, y - изменение массы.', 'Изменение массы и метод наименьших квадратов. Распределение массы и изменения массы человека, калорий, массы еды.']
const CALORIE_SUMMARY_NEED = ['масса', 'кк/100г', 'кк всего']

const DAY_SECONDS = 24 * 3600 * 1000;

const QUERY = {
	delete: `set @n := '', @l:='russian';
delete from counters where name=@n and language=@l;
delete from pages where name=@n and language=@l;`
	, rename: `set @old := '', @new:='';
SET FOREIGN_KEY_CHECKS=0;
update counters set name=@new where name=@old;
update pages set name=@new where name=@old;
SET FOREIGN_KEY_CHECKS=1;`
	, admin: `update pages set admin_only=0 where name=''`
	, "onload...": ['onload', 'content', 'script', 'css', 'type'].reduce((a, e, i) => a + `${i ? '\n\n' : ''}select t1.${e},t1.c,ROUND(t1.c*100/t2.t,2) as '%'
from(select ${e},count(*) as c from pages group by ${e + (e == 'content' ? ' having count(*)>2' : '')} order by c desc)as t1
join(select count(*) as t from pages)as t2;`, '')
	, pages: `SELECT count(*),'total pages' as help FROM pages union
	SELECT count(*), 'only in english' FROM pages WHERE name not in(select name from pages where language = 'russian') and language='english' union
	SELECT count(*), 'only in russain' FROM pages WHERE name not in(select name from pages where language = 'english') and language='russian' union
	SELECT count(*), 'in english and russian' FROM pages WHERE name in(select name from pages where language = 'english') and language='russian'`
	,tablecalendar:`SELECT 
    CASE 
        WHEN COALESCE(script REGEXP '\\\\btable\\\\b', 0) = 1 AND COALESCE(script REGEXP '\\\\bcalendar\\\\b', 0) = 1 THEN 'table+calendar'
        WHEN COALESCE(script REGEXP '\\\\btable\\\\b', 0) = 1 THEN 'table'
        WHEN COALESCE(script REGEXP '\\\\bcalendar\\\\b', 0) = 1 THEN 'calendar'
        ELSE 'none'
    END AS script_group,
    COUNT(*) AS count
FROM pages GROUP BY script_group`
}
const DEFAULT_QUERY = "select name,language,script,css from pages where name regexp 'admin'";

function load(p, p1) {
	if (p == 'massgraph') {
		const CALORIE_GRAPH_WIDTH = 1500;
		const START_DATE1 = new Date('2024-08-01')
		gLanguage = 'russian'
		getDateFromStart = days => new Date(START_DATE1.getTime() + days * DAY_SECONDS);
		diffDays = (a, b) => (b.getTime() - a.getTime()) / DAY_SECONDS
		i = new Array(diffDays(getDateFromStart(gp.length), START_DATE)).fill(NaN)
		m = gp.map(e => +(e.split('\n')[0].match(/[\d.]+$/)[0])).concat(i, gm.map(e => e ? e : NaN))
		dateString = i => getDateFromStart(i).toLocaleString('ru-ru', { day: 'numeric', month: 'short', year: 'numeric' }).slice(0, -3).replace(/(?<=[а-я]{3}).+(?=\d{2})|\s/g, '')
		ds = Array.from(m, (_, i) => dateString(i))
		const START = gp.length + i.length;
		for (j = 1; j >= 0; j--, m = m.slice(START), ds = ds.slice(START)) {
			b = []
			s = m.reduce((a, e, i) => {
				if (isNaN(e))
					return a
				b.push(e)
				return a + i + ' ' + e + '\n'
			}, '').trim()
			o = getLeastSquaresDataFromString(s, LEASTSQUARES_XY)
			y = Array.from(m, (_, i) => o.a * i + o.b);
			v = [365.25, 365.25 / 12, 1]
			s = ['год', 'месяц', 'день'].reduce((a, e, i) => a + ` за ${e} ${formatNumber(o.a * 1000 * v[i], 0)} г,`, '')
			title = `Прирост массы при линейном приближении${s} график за период ${ds[0]} - ${ds[ds.length - 1]}, дней ${ds.length}, точек с данными ${b.length}.`;
			//popup window, so make short titles
			i = ['масса', `приближение`]
			createNGraphs('g' + j, i, ds, [m, y]
				, {
					width: CALORIE_GRAPH_WIDTH
					, type: 'line'
					, borderWidth: 1
					, sameScale: 1
					, ticksOnlyFirst: 1
					, min: Math.floor(Math.min(...b))
					, max: Math.ceil(Math.max(...b))
					, title
				})
		}
		return
	}

	const CA = ['calorie', 'calorie_union', 'calorie_union_group', 'calorie_by_day']
	if ((gtype = CA.indexOf(p)) != -1) {
		Table.setLocalImagePath(true)
		Calendar.setLocalImagePath(true)
		setCookie('language', 'russian');
		a = getCookie('calorie_columns');
		setColumnsPermutation(a.length ? JSON.parse(a) : undefined)

		m2 = [[], []]
		for (i = 0; i < 12; i++) {
			['ru-RU', 'en-EN'].forEach((e, j) => {
				m2[j].push(new Date(2025, i, 1).toLocaleDateString(e, { month: 'short' }).toLowerCase().slice(0, 3))
			})
		}
		gmn = m2[0]

		gDateText = []
		gda = []
		gdt = []
		gmass = []
		de = []
		calorieGaText(1)
		if (typeof gCalendar == 'undefined') {
			gCalendar = []
			calorieSetGindUpdateDays(0).forEach((e, i) => {
				m = ga[e].match(/\d+-\d+-\d+/)
				gCalendar[i] = new Calendar('calendar' + i, m[0]
					, calorieCalendarChanged
					//, (j => () => calorieCalendarChanged(j))(i)//closure
					, '%d%b%y', 1);
			})
			//todo max,not close combobox if change number
			// new Combobox('period', 0, 'все дни', 'последние <input type="number" value="3" min="1" style="width:30px" onmousedown="massDaysInput(event)"> дня'
			new Combobox('period', 0, 'все дни', el('lastdays').innerHTML
				, p => calorieSetGindUpdateDays(p).forEach((e, i) => calorieSetCalendar(i, new Date(gda[e])))
				, () => 'период');
			new Combobox('options', 0, 'экспорт данных', 'удалить историю', 'добавить отсутствующие дни'
				, n => {
					if (n == 0)
						calorieDialog("export")
					else if (n == 1)
						calorieDeleteHistory()
					else calorieMissingDates()
				}, () => 'опции');
		}
		else {
			calorieCalendarChanged()
		}
		gDateText = gDateText.slice(gind[0], gind[1]).reverse()
		if (el('td0')) {
			for (i = 0; i < CALORIE_CELLS; i++) {
				el('td' + i).innerHTML = '';
			}
		}
		else {
			s = '<table>';
			for (i = 0; i < CALORIE_CELLS; i++) {
				s += `<tr><td id='td${i}'>`;
			}
			s += '</table>';
			el('t').innerHTML = s
		}
		if (gtype == 1) {
			a = CALORIE_SUMMARY_NEED.map(e => Object.keys(CALORIE_COLUMNS).indexOf(e))
			b = 0
			gold = [JSON.stringify(gcolumns), JSON.stringify(gpermutation)]
			a.forEach(e => {
				if (!gcolumns[e]) {
					b++
					gcolumns[e] = 1
				}
			})
			if (b) {
				length = gpermutation.length + b
				gpermutation = Array.from({ length }, (_, i) => i)
			}
			else {
				gold = undefined
			}
			showDialog('подождите пока идёт расчёт')
		}
		if (gtype == 0) {
			calorieSetGindUpdateDays(1, 0)
		}
		// else
		// 	calorieRecipe()

		if (p1 === undefined) {
			calorieRecipe()
		}
		else {
			calorieUpdate(gds, undefined, new Date(p1))
		}

		document.onkeydown = e => {
			if (!isModalVisible()) {
				if (e.key == 'Escape')
					calorieDialogDay(0)
				else if (e.code == 'KeyS')
					calorieDialog(`search`)
				else if (e.code == 'KeyQ')
					load('calorie_union')
				else if (e.code == 'KeyW')
					load('calorie')
			}
		}
		return
	}
	if (p == 'exercise') {
		const SHOW_GRAPH = 1
		const SHOW_MEASUREMENTS = 1
		if (SHOW_GRAPH) {
			getDateFromStart = days => new Date(START_DATE.getTime() + days * DAY_SECONDS);
			dateString = i => getDateFromStart(i).toLocaleString('ru-ru', { day: 'numeric', month: 'short' }).replace(/(?<=[а-я]{3}).+|\s/g, '');
			gm = gm.map(e => e ? e : NaN)
			createNGraphs('g0', ['масса'], Array.from(gm, (_, i) => dateString(i)), [gm]
				, {
					width: 1100
					, type: 'line'
					, borderWidth: 3
				})
			// gm.forEach((e, i) => {
			// 	if (!isNaN(e))
			// 		console.log(dateString(i) + ' ' + e)
			// })
		}

		if (SHOW_MEASUREMENTS) {
			h = 1.78
			di = di.replace(/масса\s+(\d+(\.\d+)?)/g, (m, g) => m + '\nимт ' + formatNumber(g / h ** 2, 1))
			b = di.split(/\n/).map(e => e.replace(/\s*\/.*$/, ''))
			n = di.match(/^\d/gm).length
			z = b.length / n
			lv = 0
			s = '<table class="table_border table_color" style="margin-top:0"><tr style="font-size:12px"><th>параметр' + '<th>лев<th>прав'.repeat(n) +
				'<tr><th>'
			for (j = 0; j < n; j++) {
				e = b[j * z]
				k = e.indexOf(' ')
				s += '<th colspan=2>' + e.slice(0, k)
			}
			for (i = 1; i < z; i++) {
				s += '<tr>'
				for (j = 0; j < n; j++) {
					q = b[i + j * z].split(/\s+/)
					l = q.length
					s += q.slice(j ? 1 : 0).reduce((a, e, i) => {
						return a + `<td${l == 2 && (j || i) ? ' colspan=2' : ''}>` + e
							+ `${j && lv != '-' ? '<span style="font-size:10pt"> ' + formatNumber((e / lv - 1) * 100, 1) + '%</span>' : ''}`
					}, '')
					lv = q[1]
				}
			}
			el('g1').innerHTML = s + '</table>'
		}

		Table.setLocalImagePath(true);
		title = ['да<br>та', 'нач<br>ало', 'конец', 'дли<br>на', '&Delta;<br>%'].map((e, i) => [1, 3].includes(i) ? `<span class='fs1'>${e}</span>` : e)
		dt = (t2, t1) => (Math.floor(t2 / 100) - Math.floor(t1 / 100)) * 60 + t2 % 100 - t1 % 100
		a = []
		ft = d => d < 60 ? d : Math.floor(d / 60) /*+ ':'*/ + String(d % 60).padStart(2, 0)
		//ft=d=>timeToString(d).replace(':','')
		g.forEach((e, n) => {
			l = e.length - 1
			text = e[l--]
			skip = e[l--]
			l++
			d = dt(e[l - 1], e[1])
			s = ''
			for (i = 2; i < l; i++) {
				s += e[i] + '<sub class="fs0">' + ft(dt(e[i], e[i - 1])) + '</sub>'
			}
			e[0] = "<span onclick='exerciseToggle(this)'>"
				+ (skip ? '<s>' : '') + (typeof e[0] == 'string' ?
					e[0].slice(0, -4) + e[0].slice(-2) : e[0])
				+ (skip ? '</s>' : '') +
				`</span><div class='c'>${text}</div>`
			if (skip) {
				e[1] = e[2] = e[3] = e[4] = ['', 0]
			}
			else {
				e[2] = [s, e[l - 1]]
				e[3] = [ft(d), d]
				for (j = n - templates; j >= 0 && (dp = a[j]) == 0; j -= templates);
				if (n < templates || skip || dp == 0) {
					vn = 0
					v = ''
				}
				else {
					vn = (d - dp) * 100 / dp
					v = formatNumber(vn, 1)
				}
				e[4] = [v, vn]

			}
			a.push(skip ? 0 : d)
		});

		el('ts').innerHTML = new Table(title, g, { class: 'table_color3', o: 'srb' }).html()
		return
	}
	if (p === 'cc') {
		s = formatNumber(Object.values(gd).reduce((a, e) => a + e, 0))
		el('p').innerHTML = new Table({ up: [['', 'total', s], ['char', 'count']] }, Object.entries(gd), "s11cbn").html()
		return
	}
	if (p === 'versioneditor') {
		for (i = 0; i < 2; i++) {
			versioneditorCombo(el('s' + i))
		}
		return
	}
	if (p === 'exchange') {
		b = ['downd', 'paste', 'clear', 'copy'];
		if (!gMobile) {
			b.push('delete', 'plus');
			// b.push('delete', 'edit', 'plus');
		}
		el('buttons').innerHTML = b.reduce((a, e) => a + `<button class="comboboxbutton" style="margin-right:2px" onclick="exchangeButtonClick('${e}')"><img src="../img/jm/${e}.png"></button>`, '')

		//[...Array(gData.length).keys()].map(e=>getExchangeRow(e)).join('')
		el('t').innerHTML = gData.reduce((a, e, j) => a + getExchangeRow(j), '')
		return
	}
	if (p === 'videos') {
		//SELECT section,count(*) as c FROM `videos`where language='russian' group by section order by c desc
		s = '<table>';
		VIDEO.date = new Date().toISOString().slice(0, 10);
		for ([k, v] of Object.entries(VIDEO)) {
			b = k == 'section'
			bsl = b || k == 'language'
			by = k == YOUTUBE
			d = 'd' + k
			s += `<tr><td>${k}<td><input type="text" id="${k}" style="width:700px;" value="${v}"${bsl ? ' list="' + d + '"' : ''}${by ? ' onpaste=paste(event)' : ''}>`
			if (bsl) {
				s += (b ? gSection : ['russian', 'english']).reduce((a, e) => a + `<option>` + e + `</option>`, `<datalist id="${d}">`) + `</datalist>`
			}
		}
		el('p').innerHTML = s + '</table>'
			+ IAL.reduce((a, e, i) => a + `<button class='comboboxbutton' onclick='videos(${i})'>${e}</button> `, '')
			+ '<label><input id="withremote" type="checkbox" checked>with remote</label>'
		el('o').innerHTML = '<a href="https://ru.file-converter-online.com">https://ru.file-converter-online.com</a><br>if name is empty string then insert/update pages button make videos=NULL for pages<br>You can paste two or more lines in youtube input to get two links youtube+dzen and title.'
		return
	}

	document.onkeydown = e => {
		if (e.key == 'Escape' || e.ctrlKey && e.key == 'Enter') {
			p === 'remote' ? remotec('query') : query()
		}
	}
	if (p !== 'remote') {
		Table.setLocalImagePath(true);
		if (['imagedifference', 'difference'].includes(p)) {
			el('up').innerHTML = "<label><input type='checkbox' id='difference' onclick='directories_checkChanged()' checked> show only difference for directories/files</label>"
			directories_outData(p)
			s = gsize.map(e => formatString(e, ',')).join(' ')
			el('o').innerHTML = `sizes ` + s
			return
		}

		el('query', Object.keys(QUERY).reduce((a, e) => a + `<option>${e}</option>`, '') + `<option selected hidden>query</option>`);
		el('history', `<option selected hidden>history</option>`);
		el('multi_query').value = DEFAULT_QUERY
	}

}

function prepareFetch(o, pages = 0, option = 0) {
	if (option != QUERY_TO_FILE) {
		s = 'overflow:auto;width:800px;white-space:pre-line;'
		// if (option == 4) {
		// 	s += 'vertical-align: top;'
		// }
		let e = el('o')//on remote
		if (e) {
			e.style = s;
			e.innerHTML = 'waiting...'
		}
	}
	fetchpost('siteupdate.php', o, clickCallback, pages, option, new Date())
}

//defined in php see foreach (BUTTONS as $index => $button)
// const UPDATE_REMOTE_TABLE = 0;
// const SHOW_QUERY = 1;
// const QUERY_TO_FILE = 2;
// const QUERY_TO_CLIPBOARD = 3;
// const ROWS_SHOW = 4;
// const SAVE_PAGES = 5;
// const SHOW_PAGES = 6;

function clickCallback(s, pages, option, time) {
	if (typeof s != 'string') {
		alert('error407 ' + s)
		return;
	}
	a = el('o1')
	if (a) {
		a.innerHTML = el('multi_query').value
	}

	if (option == QUERY_TO_FILE) {
		downloadUTF8((pages ? 'pages' : 'money') + '.sql', s)
	}
	else {
		if (s.length) {
			if (option == QUERY_TO_CLIPBOARD) {
				navigator.clipboard.writeText(s).then(() => { }, () => alert('cann\'t copy to clipboard'))
				message = 'text copied to clipboard length' + s.length
			}
			else if (option == SHOW_QUERY) {
				if (el('querycopy').checked) {
					s1 = s.replace(/^rows=\d+\s*|\s*<br>\s*$/, '')
					navigator.clipboard.writeText(s1).then(() => { }, () => alert('cann\'t copy to clipboard'))
				}
				message = tag2text(s);
			}
			else {
				message = s
			}
		}
		else {
			message = 'clickCallback got empty string';
		}
		if (!message.endsWith('<br>')) {
			message += '<br>'
		}
		el('o').innerHTML = message + timeString(time)
	}
}

function timeString(time) {
	return 'time=' + formatString((new Date() - time) / 1000, 3)
}

/* option same with prepareFetch(option)*/
function pagesClick(option) {
	c = el('table');
	table = c.options[c.selectedIndex].value
	prepareFetch({ option, pages: el('pi').value, table, regex: el('ci').checked }, 1, option)
}

function moneyClick(option) {
	prepareFetch({ option, money: el('money').value }, 0, option)
}

function updateFilesTables(i) {
	if (i == 3) {
		location.reload()
		return
	}
	prepareFetch({
		updatefiles: i < 2 ? JSON.stringify(gdiff[0]) : 0
		, updatetables: i != 1 ? JSON.stringify(gdiff[1]) : 0
	})
}

function testClick() {
}

function testClickCallback(s) {
	console.log(s)
	el('o').innerHTML = s
}

function fileUploadCB(s, time) {
	if (typeof s != "string") {
		s = s.message
	}
	else {
		try {
			a = JSON.parse(s);
			remote = a.pop()
			gfiles = getPages(a.filter(e => e[2]), 0)
			s = '<table>'
			a.forEach((a, j) => {
				p = a[0]
				l = a[1]
				r = a[2] ? "ok" : "<font color='red'>not found</font>";
				s += `<tr><td>${j + 1}<td><a href='../index.php?${p + ',' + l}' target='_blank'>${p + ' ' + l}</a><td>${r}`
			})
			s += '</table>' + remote + timefull(time)
		} catch (e) {
			//alert(e)
			//output s which passed to function can be die() in php
			console.log(s)
			console.log(e)
		}
	}
	el('o').innerHTML = s;
}

function timefull(time) {
	return timeString(time) + " " + new Date().toLocaleTimeString('en-US',
		{ hour12: false })
}

function uploadFiles() {
	let f = el('selectfile');
	let files = f.files
	if (!files.length) {
		return;
	}
	let form = new FormData();
	[...files].forEach(e => form.append('file[]', e))
	form.append('withremote', el('selectfileremote').checked)
	fetchpost("siteupdate.php", form, fileUploadCB, new Date())
	f.value = "";//clear to make possible call update same file many times
}

function uploadRemoteSqlFileCB(s, time) {
	el('o').innerHTML = s + '<br>' + timefull(time);
}

function encodeString(s) {
	let a = new TextEncoder().encode(s);
	a = Array.from(a)
	return JSON.stringify(a)
}

function uploadRemoteSqlFile() {
	let f = el('sqlfile');
	let files = f.files
	if (!files.length) {
		return;
	}
	[...files].forEach(e => {
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				el('multi_query').value = reader.result
				query();
			},
			false,
		);
		reader.readAsText(e);
	})
	f.value = "";//clear to make possible call update same file many times
}

function updateRemote() {
	if (typeof gfiles != 'undefined' && gfiles.length) {
		el('pi').value = gfiles.join(' ')
		pagesClick(0)
	}
}

function updateTableClick(show) {
	sel = el('utable');
	table = sel.options[sel.selectedIndex].text;
	where = el('where').value;
	if (!show && where == '') {
		if (!confirm("Are you sure want to make full update of table " + table + "?")) {
			return;
		}
	}
	prepareFetch({ table, where, show }, 0, show)
}

/* directories output */
function directories_outData(p) {
	const delta = 2;
	local = ga[0]
	remote = ga[delta]
	s = ''
	gdiff = [{}, {}]
	gsame = []
	for (const [key, value] of Object.entries(local)) {
		if (!value.length) {
			continue
		}
		a = []
		vr = remote[key]
		rfound = new Array(vr.length).fill(0);
		value.forEach(e => {
			j = vr.findIndex((n) => n[0] == e[0])
			b = [...e];
			if (j == -1) {
				b.push('', '', remoteNotFound)
			}
			else {
				rfound[j] = 1
				q = vr[j]
				b.push(q[1], q[2], q[1] == e[1] ? sameTime : differentTime)
			}
			a.push(b)
		});
		rfound.forEach((e, i) => {
			if (!e) {
				q = vr[i]
				b = [q[0], '', '', q[1], q[2], localNotFound]
				a.push(b)
			}
		})
		a = a.filter(e => e[0] != 'debug.txt')
		a = a.map(e => {
			let a = []
			e.forEach((e, i) => {
				let q, v = e
				if (i == 2 || i == 4) {
					q = formatString(e)
				}
				else if (i == statusIndex) {
					q = statusString[e]
				}
				else {
					const n = 4
					q = i && e.length > 0 ? e.slice(0, n) + '...' + e.slice(-n) : e
				}
				a.push([q, v])
			})
			return a
		})
		b = a.filter(e => [remoteNotFound, differentTime].includes(e[statusIndex][1])).map(e => e[0][0])
		if (b.length) {
			gdiff[0][key] = b
		}

		o = { o: "bcns" + csortColumn + csortOrder, filter: directories_getFilter(), class: 'directory' }
		down = ['', 'total']
		for (i = 0; i < 2; i++) {
			b = i ? vr : value
			down.push('files ' + b.length, b.length ? formatString(b.map(e => e[2]).reduce((a, e) => a + e)) : 0)
		}
		k2 = ['md5', 'size']
		title = {
			up: [[[key, 2], ['local', 2], ['remote', 2]], ['name', ...k2, ...k2, 'status']]
			, down
		}
		same = a.every(e => e[statusIndex][1] == sameTime)
		o.visible = !same
		gsame.push(same)
		s += new Table(title, a, o).html()
		//s+='@Directories are the same';
	}

	if (p == 'imagedifference' && s == '') {
		s = 'All tables are the same' + s
	}

	//different pages
	localTables = ga[1];
	remoteTables = ga[1 + delta];
	s1 = '<table><tr><td>'
	for (table of Object.keys(localTables)) {
		a = []
		pages = []
		columns = localTables[table]['columns'];
		columnsl = columns.length
		local = localTables[table]['data'];//length=columns.length+1
		remote = remoteTables[table]['data'];
		rfound = new Array(remote.length).fill(0);
		ap = (e, s, f) => {
			if (f) {
				pages.push(e)
			}
			e[e.length - 1] = s;
			a.push(e)
		}
		local.forEach(e => {
			j = remote.findIndex(n => {
				//compare without very last element
				let i = n.findIndex((v, i) => v != e[i])
				return i == -1 || i === n.length - 1;
			})
			if (j == -1) {
				ap(e, 'remote not found', true)
			}
			else {
				rfound[j] = 1
				if (e[columnsl] != remote[j][columnsl]) {//length of e=columns.length+1
					ap(e, 'different', true)
				}
			}
		});

		rfound.forEach((e, i) => {
			if (!e) {
				//not need pages.push(e)
				ap(remote[i], 'local not found', false)
			}
		})
		s1 += '<p>Table ' + table + ' local ' + local.length + ', remote ' + remote.length + '.'
			+ (a.length ? new Table([...columns, 'status'], a, { o: "bcn", class: 'table' }).html() : ' Tables are the same.');
		//pages includes only 'different' and 'remote not found'. Status 'local not found' is not in pages
		if (pages.length) {
			if (['pages', 'videos'].includes(table)) {
				where = getPages(pages, 2)
				//['index','russian'].toString()='index,russian'
				s1 += table + ': ' + getPages(pages, 1).join(' ');
			}
			else {
				if (table == 'calorie_slovesno') {
					where = pages.map(e => ['date', 'datetime'].map((q, i) => q + `='${e[i]}'`).join(' and ')).join(' or ')
				}
				else {
					if (table == 'money_goods_slovesno') {
						j = 1
					}
					else {
						j = 0
					}
					where = (j == 1 ? 'name' : 'id') + ' IN(' + pages.map(e => j ? JSON.stringify(e[0]) : e[0]).join(', ') + ')'
					s1 += '<span style=" display: inline-block;max-width:800px">SELECT * FROM ' + table + ' WHERE ' + where + '</span>'
				}
			}
			gdiff[1][table] = where
		}
	}

	b = []
	for (i = 0; i < 2; i++) {
		b.push(Object.keys(gdiff[i]).length)
	}
	if (b.some(e => e)) {
		s += '<p>'
		u = '⟲';//'&#8635;↻' '&#10226;⟲'
		//u='update ';
		[u + 'files + tables', u + 'files', u + 'tables', u].forEach((e, i) => {
			if ([b[0] && b[1], b[0], b[1], 1][i]) {
				s += `<button class="comboboxbutton" onclick='updateFilesTables(${i})'>${e}</button> `
			}
		})
		s += ` <a href="${REMOTE}php/siteupdate.php?saveremote" target="_blank"><img style="vertical-align:middle;" src="/img/jm/save16.png"></a> <a href="${REMOTE}php/siteupdate.php?loadremote" target="_blank"><img style="vertical-align:middle;" src="/img/jm/refresh16.png"></a>`
	}
	s1 += '<td id="o"></table>'
	el('pt').innerHTML = s + s1;
}

function directories_getFilter() {
	return el('difference').checked ? (e) => e[statusIndex].v != sameTime : () => 1
}

function directories_checkChanged() {
	Table.tables.slice(0, Object.keys(ga[0]).length).forEach((e, i) => {
		e.setVisible(!el('difference').checked || !gsame[i])
		e.filterSort(directories_getFilter(), csortColumn, csortOrder)
	})
}

function query() {
	if (isRemote()) {
		remotec("query")
	}
	else {
		prepareFetch({
			query: encodeString(el('multi_query').value.trim())
			, type: REMOTE_TYPE_ENCODE
			, remote: el('multi_remote').checked
			, number: el('multi_number').checked
		})
		addHistory()
	}
}

function addHistory() {
	q = el('multi_query').value.trim()
	h = el('history')
	v = [...h.options].map(option => option.value);
	i = v.indexOf(q)
	if (i == -1) {
		const m = 95
		qs = q.slice(0, m) + (q.length > m ? '…' : '')//for long queries
		h.add(new Option(qs, q));
	}
	else {
		//move up
		h.add(h.options[i], 0);
	}
}

function querySelected() {
	el('multi_query').value = window.getSelection().toString()
	query()
}

function addQuery() {
	let a = el('buffer').value.length ? '\n' : '';
	el('buffer').value += a + el('multi_query').value
}

function cquery() {
	el('multi_query').value = Object.values(QUERY)[el('query').selectedIndex]
	//el('query').selectedIndex = Object.values(QUERY).length //reset index
}

function chistory() {
	el('multi_query').value = el('history').value
}

const EXCHANGE_SAVE_ADD_NEW_DAY_ID = -2;
function exchangeButtonClick(i, j) {
	// dateToString= d=> d.toLocaleString("ru-ru", { day: "numeric", month: "short" }).replace(/\.|\s/g, '')
	if (j) {
		i = getRow(i)
		o = gData[i]
		if (j == 'upd') {
			copyExchange(i)
		}
		else if (j == 'delete') {
			if (window.confirm("Вы действительно хотите удалить запись?")) {
				setExchangeElement(i, 'ожидание...')
				fetchpost('siteupdate.php', { exchangeDelete: o[0] }, exchangeCallback, i, j)
			}
		}
		else if (j == 'copy') {
			navigator.clipboard.writeText(o[1].toLowerCase()).then(() => setExchangeElement(i, 'текст скопирован')
				, () => setExchangeElement(i, 'ошибка копирования'));
		}
		else if (j == 'edit') {//put record to poverty.js file
			fetchpost('siteupdate.php', { exchangeSave: o[1] }, exchangeCallback, i, j)
		}
		return
	}
	if (i == 'downd') {
		exchangeAdd = el('multi_query').value
		if (exchangeAdd.length) {
			setExchangeElement(-1, 'ожидание...')
			fetchpost('siteupdate.php', { exchangeAdd }, addExchangeCallback)
		}
		else {
			setExchangeElement(-1, 'пустая строка')
		}
	}
	/*         else if (i == 'upd') {
					if (gData.length) {
							copyExchange(0)
					}
					else {
							setExchangeElement(-1, 'пустой массив')
					}
			}
	*/
	else if (i == 'paste') {
		navigator.clipboard.readText()
			.then(text => {
				el('multi_query').value = text
			})
			.catch(err => {
				alert(err)
				console.error('Failed to read clipboard contents: ', err);
			});
	}
	else if (i == 'clear') {
		el('multi_query').value = ""
	}
	else if (i == 'copy') {
		navigator.clipboard.writeText(el('multi_query').value).then(
			() => setExchangeElement(-1, 'текст скопирован')
			, () => setExchangeElement(-1, 'ошибка копирования'));
	}
	else if (i == 'delete') {
		if (gData.length) {
			if (window.confirm("Вы действительно хотите удалить ВСЕ записи?") &&
				window.confirm("ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ УДАЛИТЬ ВСЕ ЗАПИСИ?")) {
				setExchangeElement(-1, 'ожидание...')
				fetchpost('siteupdate.php', { exchangeDelete: "all" }, exchangeCallback, -1)
			}
		}
		else {
			setExchangeElement(-1, 'пустой массив')
		}
	}
	else if (i == 'plus') {
		fetchpost('siteupdate.php', { exchangeAddNewDay: 1 }, exchangeCallback, EXCHANGE_SAVE_ADD_NEW_DAY_ID)
	}
}

function getRow(e) {
	let i, p = e;
	do {
		p = p.parentElement;
		if (p.nodeName == 'BODY') {
			throw 0;
		}
	} while (p.nodeName != 'TR')
	i = [...el('t').rows].findIndex(e => p == e);
	if (i == -1) {
		throw 0;
	}
	return i;
}

function copyExchange(i) {
	el('multi_query').value = gData[i][1]
}

gTID = 0
//gTIDRow
function setExchangeElement(i, s) {
	if (gTID) {
		if (gTIDRow < gData.length) {//after delete
			getExchangeOut(gTIDRow).innerHTML = ''
		}
		clearTimeout(gTID)
		gTID = 0
	}
	if (s.length) {
		let e = getExchangeOut(i)
		if (e) {//row can be deleted
			e.innerHTML = s
		}
		gTIDRow = i
		gTID = setTimeout(() => setExchangeElement(i, ''), 3500)
	}
}

function getExchangeOut(i) {
	let e;
	if ([-1, EXCHANGE_SAVE_ADD_NEW_DAY_ID].includes(i)) {
		e = el('s')
	}
	else {
		e = el('t').rows;
		e = i < e.length ? e[i].cells[2] : null
	}
	return e;
}

function exchangeCallback(s, i, j) {
	if (s.startsWith('error')) {
		setExchangeElement(i, s)
	}
	else {
		if (i == EXCHANGE_SAVE_ADD_NEW_DAY_ID) {//save/add button

		}
		else if (i == -1) {
			gData = []
			el('t').innerHTML = ''
		}
		else {
			if (j == 'delete') {
				gData.splice(i, 1);
				el('t').deleteRow(i)
				i = -1;//row is invalid show on common
			}
			else if (j == 'edit') {

			}
		}
		setExchangeElement(i, s)
	}
}

function addExchangeCallback(s) {
	if (s.startsWith('error')) {
		setExchangeElement(-1, s)
	}
	else {
		o = JSON.parse(s)
		id = o[0]
		update = o[1]
		if (update && id != gData[0][0]) {
			alert('update by wrong id' + id + ' ' + gData[0][0])
			throw 0
		}
		if (update) {
			el('t').rows[0].cells[0].innerHTML = gData[0][1] = el('multi_query').value
			setExchangeElement(-1, 'строка обновлена')
		}
		else {
			gData.unshift([id, el('multi_query').value])
			el('t').insertRow(0).innerHTML = getExchangeRow(0)
			setExchangeElement(-1, 'строка вставлена')
		}
	}
}

function getExchangeRow(j) {
	let e = gData[j]
	return '<tr><td>' + e[1] + '<td>' + ['upd', 'delete', 'copy', 'edit'].reduce((a, e) => a
		+ `<button class="comboboxbutton" style="margin-left:2px;" onclick="exchangeButtonClick(this,'${e}')"><img src="../img/jm/${e}16.png"></button>`, '') + '<td>'
}

function getPages(a, par) {
	let f = []
	a.forEach(a => {
		let p, l, i
		p = a[0]
		l = a[1]
		i = f.findIndex(e => e[0] == a[0]);
		if (i == -1) {
			f.push(a.slice(0, 2))
		}
		else {
			f[i] = a[0]//remove language
		}
	})
	if (par == 1) {
		f = f.map(e => Array.isArray(e) ? e[0] + ',' + e[1].substr(0, 1) : e)
	}
	else if (par == 2) {
		f = f.map(e => 'name="' + (Array.isArray(e) ? e[0] + '" AND language="' + e[1] : e) + '"').join(' OR ');
	}
	return f
}

function videos(i) {
	o = { videobutton: i }
	el('language').value = 'russian'.startsWith(el('language').value) ? 'russian' : 'english'
	pages = el('pages').value
	let name = el('name').value
	const mp4 = '.mp4'
	if (name.endsWith(mp4)) {
		el('name').value = name = name.slice(0, -mp4.length)
	}
	language = el('language').value
	if (i == IAL_VIDEOS) {
		a = Object.keys(VIDEO).slice(0, -1);
		j = a.find(e => e != 'section' && el(e).value.length == 0);
		if (j != undefined) {
			el('o').innerHTML = 'error empty ' + j
			return
		}
		a.forEach(e => o[e] = el(e).value.trim());
		k = 'title'
		el(k).value = o[k] = videosNormalizeTitle(o[k])
		o["withremote"] = el("withremote").checked;
		o.pages = pages
		o.i = i
		fetchpost('siteupdate.php', o, videosCallback, o, new Date())
	}
	else if (i == IAL_TEST) {
		a = ['short7_dill', 'russian', 'youtube', 'dzen', 200, 'section', 'er'];
		['name', 'language', 'youtube', 'dzen', 'length', 'section', 'pages'].forEach((e, i) => el(e).value = a[i]);
		el("withremote").checked = false;
	}
	else {
		//el('o').innerHTML='waiting...'
		o.originalName = name
		if (i == IAL_LOAD || i == IAL_TITLE) {
			o.name = i == IAL_TITLE && pages.length ? el('pages').value.trim().split(/\s+/)[0] : name
			if (o.name == '') {
				el('o').innerHTML = 'error empty name'
				return
			}
			o.language = el('language').value
			o.i = i
			fetchpost('siteupdate.php', o, videosCallback, o, new Date())
		}
	}
}

function videosNormalizeTitle(q) {
	let m = /^(<[^>]+>)?([^<>]+)(<[^>]+>)?$/.exec(q), s = m[2]
	//s[0].toUpperCase() != s[0].toLowerCase() - is letter
	if (!/[?!.]$/.test(s)) {
		s += '.'
	}
	if (s[0] == s[0].toLowerCase()) {
		s = s[0].toUpperCase() + s.slice(1)
	}
	return (m[1] || '') + s + (m[3] || '')
}

function videosCallback(s, o, time) {
	let i = o.i
	if (typeof s != "string") {
		s = s.message
	}
	else {
		if (i == IAL_VIDEOS) {
			s += 'clicked ' + IAL[i]
		}
		else if (!s.startsWith('error')) {
			try {
				a = JSON.parse(s);
				if (i == IAL_LOAD) {
					for (const [key, value] of Object.entries(a)) {
						if (key != 'size') {
							el(key).value = value
						}
					}
				}
				else if (i == IAL_TITLE) {
					if (!el('pages').value.length) {
						el('pages').value = o.name
					}
					a.title = videosNormalizeTitle(a.title)
					el('title').value = `<a href='?${o.name + ',' + el('language').value}'>${a.title}</a>`
				}
				s = 'load successfully'
			} catch (e) {
				s = s + e
			}
		}
	}
	el('o').innerHTML = s + ' ' + timefull(time)
}

function paste(e) {
	t = (e.originalEvent || e).clipboardData.getData('text/plain').split('\n').filter(e => !/^\s*$/.test(e))
	if (t.length > 1) {
		e.preventDefault();
		a = Object.keys(VIDEO)
		i = a.indexOf(YOUTUBE);
		a.slice(i, i + 3).forEach((e, i) => el(e).value = t[i].trim())
	}
}

function videostring() {
	let videostring = el('videostring').value
	if (videostring.length) {
		fetchpost('siteupdate.php', { videostring }, videostringCallback, new Date())
	}
	else {
		el('o').innerHTML = 'error empty id'
	}
}

function videostringCallback(s, time) {
	if (typeof s != "string") {
		s = s.message
	}
	el('o').innerHTML = s + '<br>' + timefull(time)
}

function remotec(p) {
	el('p').innerHTML = 'waiting...';

	if (p == 'query paste') {
		navigator.clipboard.readText().then(t => {
			el('multi_query').value = t;
			remotec('query')
		}, () => 'cann\'t read clipboard')
		return
	}
	if (p == 'query') {
		addHistory()
	}
	fetchpost(`siteupdate.php?${p}remote`, p == 'query' ? { query: el('multi_query').value } : {}, s => el('p').innerHTML = s)
}

function versioneditorCombo(c) {
	i = +c.id.slice(1)
	el('t' + i).value = gd[i][c.selectedIndex][1]
}

function versioneditorSave(i) {
	language = ["russian", "english"][i]
	prepareFetch({ versioneditor: el('s' + i).value, language, text: el('t' + i).value })
}

function exerciseCC() {
	n = [...document.querySelectorAll('input[name=c]')].map(e => e.checked)
	document.querySelectorAll('div.c').forEach((e, i) => e.style.display =
		n[i % templates] ? 'block' : 'none');
}

//cann't found this exercise function if found rename to exerciseC()
// function c() {
// 	n = [...document.querySelectorAll('input[name=c]')].findIndex(e => e.checked)
// 	document.querySelectorAll('div.c').forEach((e, i) => e.style.display = (n & (1 << (i % templates))) ? 'block' : 'none');
// }

function exerciseToggle(e) {
	div = e.nextSibling;//.nextSibling
	div.style.display = div.style.display == 'block' ? 'none' : 'block'
}

function finishUpdateCalorie(ok) {
	if (isModalVisible()) {
		closeModal()
	}
	if (typeof gold == 'object') {
		//restore old paremeters
		[gcolumns, gpermutation] = gold.map(e => JSON.parse(e))
	}
	const tg = ['массы', 'изменения массы', 'изменения массы %', 'потребляемых калорий', 'массы еды'];
	const tg1 = ['', '', '', ' Калории округлены до сотни.', ' Массы округлены до сотни.'];
	const massPercentGraph = 2
	const calorieGraph = 3
	const eatmassGraph = 4

	s = el('p').innerHTML
	f = i => ` <button onclick="calorieDialogDay(${i})" class="comboboxbutton"${i ? '' : " title='редактировать последний день,\nможно нажать Escape'"}><img src="../img/jm/edit16.png"></button>`
	if (!s.startsWith('<h3 ')) {
		//error allow edit
		el('p').innerHTML = gdt.reduce((a, e, i) => a + '<h4 style="margin:0">' + e + f(i) + '</h4>', s)
	}

	if (gtype != 1) {
		if ([0, 3].includes(gtype)) {
			for (i = 0; e = el('pp' + i); i++) {
				e.innerHTML += f(i)
			}
		}
		return;
	}
	if (!ok)
		return
	el('p').innerHTML = CALORIE_GLP.map((e, i) => `<a href='#${i ? 'td' + (i - 1) : 'pp0'}'>${e}</a>`).join('<br>') + s
	ai = CALORIE_SUMMARY_NEED.map(e => gRecipeParseData.columns.indexOf(e))
	da = []
	ma = []
	d = [[], [], []]
	gRecipeParseData.data[0].data.reverse().forEach(e => {
		v = e[0][1]
		b = v.split(/\s+/)
		da.push(b[0])
		m = b[1]
		ma.push(+m)
		ai.forEach((q, i) => d[i].push(e[q][1]))
	});
	[mf, ccal100g, calorieByDay] = d
	gDeltaMass = deltaMass(ma)
	f1 = v => formatNumber(v, 1)
	min = f1(Math.min(...gDeltaMass))//used in f function
	max = f1(Math.max(...gDeltaMass))//used in f function

	o = { width: CALORIE_GRAPH_WIDTH, type: 'line', borderWidth: 3 }
	a = [[], []]
	const start = 14;//todo 14 need at least two points so minimun is 2
	for (i = start; i <= gDeltaMass.length; i++) {
		c = calorieByDay.slice(0, i)
		b = gDeltaMass.slice(0, i)
		ev = expectedValue(ma.slice(0, i))
		j = leastSquares(c, b);
		m = -j[1] / j[0];
		[m, m / ev].forEach((e, i) => a[i].push(normalize(e, i ? 2 : 0)))
	}
	l = [['масса', 'калории'], ['масса еды', 'ккал/100г'], ['C0', 'C0/μm']]
	d = [[ma, calorieByDay.map(e => Math.round(e))], [mf, ccal100g.map(e => formatNumber(e, 2))], a]
	x = Array.from(ma, (_, i) => i)
	a = leastSquares(x, ma)
	for (n = 0; n < 3; n++) {
		o.title = CALORIE_GLP[n + 1] + (n == 0 ? ` m = ${a[0].toExponential(5)}*d${(a[1] > 0 ? '+' : '') + a[1].toExponential(5)}` : '')
		createNGraphs('td' + n, l[n], n == 2 ? gDateText.slice(start) : gDateText, d[n], o)
	}

	f = (a, b) => {
		let v = a - b, d = f1(v), deltap = v / b * 100
		return { a: [d, formatNumber(deltap, 1) + '%'], b: [min, max].includes(d), delta: v, deltap }
	}
	s = ma.map((e, i) => e + ' ' + calorieByDay[i]).join('\n');
	gLanguage = 'russian'
	m = Array.from(tg, () => new Map())
	o = getLeastSquaresDataFromString(s, LEASTSQUARES_MASS_CALORIE)
	if (o.ok) {
		createLeastSquareGraph('td' + (n++), o, CALORIE_GRAPH_WIDTH)
		dm = []
		dp = []
		d = ma.map((e, i) => {
			w = f(e, ma[i - 1])
			b = i ? w.b : 0
			q = i ? w.a.map(e => [e, +e.replace(/%$/, '')]) : new Array(2).fill(['-', -Infinity])
			m[0].set(e, (m[0].get(e) ?? 0) + 1)
			if (i) {
				dm.push(w.delta)
				dp.push(w.deltap)
				r = calorieByDay[i - 1]
				r = [formatNumber(r, 1), r]
				for (j = 1; j < 3; j++) {
					v = +(j == 1 ? w.delta : w.deltap).toFixed(1)
					m[j].set(v, (m[j].get(v) ?? 0) + 1)
				}
			}
			else
				r = ['-', -Infinity]
			return [[da[i], i], e, ...q, r].map(e => {
				if (b) {
					if (Array.isArray(e))
						e[0] = `<b>${e[0]}</b>`
					else
						e = [`<b>${e}</b>`, e]
				}
				return e
			})
		})
	}
	else {
		el('td' + (n++)).innerHTML = o.s
	}

	//exclude last item which not showed in table
	l = calorieByDay.slice(0, -1)
	if (l.length) {
		[calorieGraph, eatmassGraph].forEach(e => {
			w = m[e];
			(e == calorieGraph ? l : mf.slice(0, -1)).forEach(e => {
				v = e - e % 100;//also ok with fractions
				w.set(v, (w.get(v) ?? 0) + 1)
			})
		})

		tc = l.reduce((a, b) => a + b)
		i = f(ma[ma.length - 1], ma[0]).a
		down = [['', 'всего', '', i[0] + ' кг', i[1], formatNumber(tc, 1)], ['', 'среднее', formatNumber(expectedValue(ma), 2), formatNumber(expectedValue(dm) * 1000, 1) + ' г', formatNumber(expectedValue(dp), 2) + '%', formatNumber(expectedValue(l), 1)]]
		f = i => `изменение<br>массы${i ? ' %' : ''}`
		// f = i => `<span style='font-size: 10px;'>изменение<br>массы${i ? '%' : ''}<span>`
		mt = r => `<table><tr>` + r.map(e => `<td style='vertical-align:top'>${e}`).join('') + `</table>`
		const c2 = 'дней'//'количество'
		a = m.map((e, i) => {
			if (i == calorieGraph) {
				t = 'калории'
			}
			else if (i == eatmassGraph) {
				t = 'масса еды'
			}
			else
				t = i ? f(i - 1) : 'масса'
			w = ([massPercentGraph, calorieGraph, eatmassGraph].includes(i) ? [...e].map(e => [
				[i == massPercentGraph ? e[0] + '%' : `${e[0]}-${e[0] + 100}`, e[0]]
				, e[1]]) : e)
			return new Table([t, c2], w, "s01cbn").html()
		}
		)
		s = `<table>` + m.map((_, i) => `<tr><td id='b${i}'>`).join('') + `</table>`
		r = [
			'Изменение массы' + new Table({ up: ['дата', 'масса', f(0), f(1), 'калории'], down }, d, "scbn").html()
			, getLeastDataTableString(o, LEASTSQUARES_MASS_CALORIE) + mt(a) + s
		]
		el('td' + (n++)).innerHTML = mt(r)

		width = 600;
		const insertZeros = 1
		m.forEach((e, i) => {
			a = [...e.entries()].sort((a, b) => a[0] - b[0])
			if (insertZeros) {
				c = a
				a = []
				c.forEach((e, q) => {
					if ([calorieGraph, eatmassGraph].includes(i)) {
						if (q && (v = (e[0] - c[q - 1][0]) / 100) > 1) {
							for (j = 1; j < v; j++)
								a.push([c[q - 1][0] + j * 100, 0])
						}
					}
					else if (q && (v = Math.round((e[0] - c[q - 1][0]) * 10)) > 1) {
						for (j = 1; j < v; j++)
							a.push([+formatNumber(c[q - 1][0] + j / 10, 1), 0])
					}
					a.push(e)
				})
			}
			if (i == massPercentGraph) {
				a = a.map(e => {
					e[0] += '%'
					return e
				})
			}
			createNGraphs('b' + i, [c2], a.map(e => e[0]), [a.map(e => e[1])], {
				width
				, type: 'bar'
				, title: `График распределения ${tg[i]}.${tg1[i]}`
			})

		})
	}
}

function calorieCopy(p) {
	s = p ? calorieGetDayObject(1).text : window.getSelection().toString()
	a = s.split("\n").map(e => {
		m = /\s*бжу/.exec(e)
		i = m ? m.index : e.length
		return e.slice(0, i).replace(/(?<!^\s*(\\|\/).*|яйцо\s+\d+[cсд])[-\d+*/().]+\s*$/i, 0).trim() + e.slice(i)
	}).join('\n')
	v = el('ta').value
	el('ta').value += (v.endsWith('\n') || !v.length ? '' : '\n') + a
	calorieUpdateSaveButtons()
}

function calorieButtons(img, text = []) {
	return img.map((e, i) => `<img src='../img/jm/${e}16.png' class='calorie_b'>${text[i] ?? ''}`)
}

function calorieDialogDay(i) {
	gCalorieHistoryIndex = i
	o = calorieGetDayObject(i)
	gTextStart = o.text
	gmassStart = o.d[1]
	//&#9664; &#9654;
	showModal(gdt[i], `<table><tr><td><textarea id="ta" class="calorie_ta" oninput="calorieInput(this)" onkeydown="calorieTextareaKeydown(this,event);return true;">${gTextStart}</textarea>
	<td><textarea id="tb" class="calorie_ta" style="display:none;" readonly></textarea>
	 <tr><td>масса <input type='number' id='ma' value='${gmassStart}' class="calorie_m" step="0.1" oninput="calorieInput(this)"> <button class='comboboxbutton' onclick='calorieHistory(CALORIE_HISTORY_CURRENT_DAY)'>история текущего дня</button> <button class='comboboxbutton' onclick='calorieHistory(CALORIE_HISTORY_DAYS)'>история по дням</button>
	 <br><label><input type="checkbox" id="autoru" checked style="vertical-align: middle;">перекодировать <img src="../img/en.gif">&rarr;<img src="../img/ru.gif"></label>
	 <button class='comboboxbutton' onclick='calorieCopy(1)'>добавить посл. день</button>
	 <button class='comboboxbutton' onclick='calorieRestore()' title='восстановить текст и массу если случайно закрылось окно'>восстановить</button>
	 <td id='tdh' style="display:none;vertical-align:top">масса <input type='number' id='mb' class="calorie_m" readonly>
	<button onclick='calorieUpdateHistory(-Infinity)' class='comboboxbutton' id='preva'>&lt;&lt;</button>
	<button onclick='calorieUpdateHistory(-1)' class='comboboxbutton' id='prev'>&lt;</button>
	<span id='hindex'></span>
	<button onclick='calorieUpdateHistory(1)' class='comboboxbutton' id='next'>&gt;</button>
	<button onclick='calorieUpdateHistory(Infinity)' class='comboboxbutton' id='nexta'>&gt;&gt;</button>
	<button onclick='calorieCopy()' class='comboboxbutton' title='выберите текст и нажмите эту кнопку\nдля копирования его в левое окно'>копировать выделенное</button>
	<br><span id='ttime'></span> <span id='htime'></span>
	 </table>`
		, j => {
			if (j >= 0 && j < 2) {
				gTextStart = el('ta').value
				gmassStart = el('ma').value
				fetchpost('../php/siteupdate.php', { calorie_text: gTextStart, mass: gmassStart, date: gda[i] }, calorieDialogCallback, j);
			}
			if (j == 1) {
				calorieUpdateSaveButtons()
			}
			else if (j == 2) {
				location.reload()
			}
			else {
				closeModal()
			}
		}, calorieButtons(['save', 'save', 'delete', 'delete'], [' закрыть окно и пересчитать', '', ' пересчитать', '']), false)
	calorieUpdateSaveButtons()
}

function calorieUpdateSaveButtons() {
	m = el('ma').value
	b = el('ta').value == gTextStart && m == gmassStart || m.length == 0 || m < 0
	for (i = 0; i < 2; i++)
		getModalButton(i).disabled = b
}

function calorieDialogCallback(s, j) {
	if (s === 'ok') {
		if (j == 0) {
			location.reload()
		}
		else {
			ga[gCalorieHistoryIndex] = '#' + gdt[gCalorieHistoryIndex] + ' ' + gmassStart + '\n' + gTextStart
		}
	}
	else {
		showDialog(s)
	}
}

function calorieHistory(mode) {
	v = typeof gMode == 'undefined' ? undefined : gMode
	gMode = mode
	if (el('tdh').style.display == 'table-cell' && mode == v) {
		el('tb').style.display = el('tdh').style.display = 'none'
	}
	else {
		el('ttime').innerHTML = ['дата и время изменения', 'дата'][gMode]
		if (gMode == CALORIE_HISTORY_CURRENT_DAY)
			fetchpost('../php/siteupdate.php', { calorie_history: gda[gCalorieHistoryIndex] }, calorieHistoryCallback);
		else {
			gHistoryIndex = ga.length == 1 ? 0 : 1
			calorieUpdateHistory()
		}
	}
}

function calorieHistoryCallback(s) {
	try {
		gHistory = JSON.parse(s)
		gHistoryIndex = gHistory.length - 1
	} catch (e) {
		console.log(s)
		console.log(e)
		alert('calorieHistoryCallback ' + e)
		return
	}
	calorieUpdateHistory()
}

function calorieGetDayObject(i) {
	let s = ga[i]
	let j = s.indexOf("\n")
	return { d: s.slice(1, j).split(' '), text: s.slice(j + 1).trim() }
}

function calorieUpdateHistory(p) {
	el('tb').style.display = el('tdh').style.display = 'table-cell'
	l = (gMode == CALORIE_HISTORY_CURRENT_DAY ? gHistory : gmass).length
	if (p != undefined) {
		gHistoryIndex += p
		if (gHistoryIndex < 0) {
			gHistoryIndex = 0
		}
		else if (gHistoryIndex > l - 1) {
			gHistoryIndex = l - 1
		}
	}
	if (gMode == CALORIE_HISTORY_CURRENT_DAY)
		a = l ? gHistory[gHistoryIndex] : ['', 'для этого дня ещё нет истории', ''];
	else
		a = [gmass[gHistoryIndex], calorieGetDayObject(gHistoryIndex).text, gdt[gHistoryIndex]]

	if (l)
		el('hindex').innerHTML = gHistoryIndex + 1;
	['mb', 'tb', 'htime'].forEach((e, i) => {
		b = el(e)
		//doesn't work i == 2 ? b.innerHTML : b.value = a[i]
		if (i == 2) {
			if (gMode == CALORIE_HISTORY_CURRENT_DAY) {
				m = a[i].match(/^(\d+)-(\d+)-(\d+)(.*)/)
				v = m ? m[3] + gmn[m[2] - 1] + m[1] + m[4] : ''
			}
			else
				v = a[i]
			b.innerHTML = v
		}
		else {
			b.value = a[i]
		}
	})
	el('prev').disabled = el('preva').disabled = !l || gHistoryIndex == 0//gHistoryIndex=-1 if l
	el('next').disabled = el('nexta').disabled = gHistoryIndex == l - 1
}

function calorieDeleteHistory() {
	showModal("Предупреждение!", "<p style='width:400px'>История изменений будет безвозвратно удалена! Будет удалена только история, дневник питания останется в базе данных. Удалить историю?</p><label><input id='currentday' type='checkbox' checked>удалить историю также и за последний день</label>"
		, j => {
			if (j == 0) {
				fetchpost('../php/siteupdate.php', { calorie_delete_history: el('currentday').checked }, showDialog)
			}
		}
		, calorieButtons(['ok', 'delete']))
}

function showDialog(s) {
	showModal("Сообщение.", String(s))
}

//from poverty.js
function calorieTextareaKeydown(t, e) {
	if (e.ctrlKey && e.key == 'Enter') {
		getModalButton(0).click()
		return
	}
	if (!el('autoru').checked) {
		return
	}
	const KEYR = 'йцукенгшщзхъфывапролджэячсмитьбюё';
	const KEYE = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`';
	const R = KEYR + KEYR.toUpperCase()
	const E = KEYE + KEYE.toUpperCase()
	//prevents ctrl+z ... alt
	if (!e.ctrlKey && !e.altKey && e.code != 'Slash' && (i = E.indexOf(e.key)) != -1) {
		e.preventDefault()
		addPFC(t, R[i])
		calorieInput(t)//e.preventDefault() not call oninput so call manually
	}
}

//from poverty.js modified
function addPFC(t, add) {
	const start = t.selectionStart
	const end = t.selectionEnd
	const text = t.value
	t.value = text.substring(0, start) + add + text.substring(end, text.length)
	t.selectionStart = t.selectionEnd = start + add.length
	t.focus()
}

function calorieMissingDates() {
	fetchpost('../php/siteupdate.php?calorie_missing_dates', {}, calorieMissingDatesCallback)
}

function calorieMissingDatesCallback(s) {
	showDialog(s)
	m = /\d+/.exec(s)
	v = +m
	if (v) {
		location.reload()
	}
}

function calorieSetCalendar(i, date) {
	o = gCalendar[i]
	o.d = date
	o.startDate = new Date(date);
	o.updateButton();
}

function calorieCalendarChanged() {
	ind = []
	t = []
	for (i = 0; i < 2; i++) {
		r = gCalendar[i].getDateFormat('%F')
		ind[i] = gda.indexOf(r)
		if (ind[i] == -1) {
			t[i] = new Date(gda[ind[i] = (i ? 0 : gda.length - 1)])
			calorieSetCalendar(i, t[i])
		}
		else
			t[i] = new Date(r)
	}
	if (t[0] > t[1]) {
		[ind[0], ind[1]] = [ind[1], ind[0]]
		for (i = 0; i < 2; i++) {
			calorieSetCalendar(i, t[+!i])
		}
	}
	calorieSetGindUpdateDays(ind)
}

function calorieSetGindUpdateDays(p, b = 1) {
	if (typeof p == 'number') {
		p = [p ? Math.min(ga.length - 1, gdays - 1) : ga.length - 1, 0]
	}
	gind = [p[1], p[0] + 1]
	if (b)
		el('days').innerHTML = (gind[1] - gind[0]) + '/' + ga.length
	return p
}

function calorieShowMessage(s) {
	el('message').innerHTML = s
}

function calorieShowMessageSearch(s) {
	const m = '$';
	el('message').innerHTML = s.startsWith(m) ? `<textarea style="border:none;outline:none;resize:none;background-color:transparent;" readonly>${s.slice(m.length)}</textarea>` : s
}

function calorieShowMessageS(s) {
	if (s == 'ok')
		location.reload()
	else
		calorieShowMessage(s)
}

function calorieUsersList() {
	fetchpost('../php/siteupdate.php?calorie_user_list', {}, showDialog)
}

function calorieExportCheckbox() {
	for (i = 0; i < 3; i++) {
		if (el('c' + i).checked)
			break;
	}
	getModalButton(0).disabled = i == 3
}

ghideTimeout = 0
function caloriePassword(b) {
	b = b ?? el('pwd').type == 'text'
	el('pwd').type = b ? 'password' : 'text'
	el('eye').src = `../img/jm/eye${b ? '' : '_closed'}.png`
	if (!b) {
		clearTimeout(ghideTimeout);
		ghideTimeout = setTimeout(caloriePassword, 3000, 1);
	}
}

function calorieRadioIndex(i) {
	return [...document.querySelectorAll(`input[name="r${i}"]`)].findIndex(e => e.checked)
}

function calorieDialog(p) {
	n = ['delete_user', 'create_user', 'login', 'change_password', 'export', 'search'].indexOf(p)
	const DELETE = 0
	const CREATE = 1
	//const LOGIN = 2
	const CHANGE_PASSWORD = 3
	const EXPORT = 4
	const SEARCH = 5
	f = (q, n, l) => q.reduce((a, e, i) => a + `${i ? '<br>' : ''}<label><input type="radio" name="r${n}"${i ? '' : ' checked="checked"'} style="vertical-align: middle;margin-top: -1px;">${e}</label>`, `<fieldset><legend>${l}</legend>`) + `</fieldset>`
	s = `<table>`
	if (n == EXPORT) {
		s += f(['текст', 'json'], 0, 'Формат экспорта')
			+ `<tr><td><fieldset><legend>Что экспортировать?</legend>`
			+ ['дневник питания', 'история изменений', 'список продуктов'].reduce((a, e, i) => a + `${i ? '<br>' : ''}<label><input type='checkbox' onchange="calorieExportCheckbox()" id='c${i}' ${i ? '' : 'checked'}>${e}</label>`, '')
			+ `</fieldset>`
	}
	else if (n == SEARCH) {
		s += `<tr><td>`
			+ f(['текст', 'регулярное выражение'], 0, 'Что искать?')
			+ `<td><input type='text' placeholder='творог' value='' id='search' onkeydown='calorieInputKeyDown(event)'><tr><td colspan=2>`
			+ f(['только в дневнике питания', 'в дневнике питания и истории изменений'], 1, 'Где искать?')
	}
	else {
		s += `<tr><td>Логин<td><input type='text' placeholder='введите имя пользователя' id='user' onkeydown='calorieInputKeyDown(event)'>`
		if (n) {
			s += `<tr><td>Пароль<td><input type='password' placeholder='введите пароль' id='pwd' onkeydown='calorieInputKeyDown(event)'> <a href='#' onclick='caloriePassword();return false;'><img style="vertical-align:middle;" src="../img/jm/eye.png" id='eye'></a>`
		}
		if (n == CREATE) {
			s += `<tr><td>Электронная почта<td><input type='mail' placeholder='адрес электронной почты' id='mail' onkeydown='calorieInputKeyDown(event)'>`
		}
	}
	s += `<tr><td colspan=2 id='message' style='color:red;max-width:500px'>` +
		(n == CREATE ? 'При регистрации пользователя на электронную почту ничего не высылается, она используется для восстановления пароля. Пожалуйста правильно указывайте адрес электронной почты.' : '')
		+ `</table>`
	showModal(["Удаление пользователя", "Регистрация пользователя", "Войти в систему", "Изменить пароль", "Экспорт данных", "Поиск текста или регулярного выражения"][n] + '.', s
		, j => {
			if (j == 0) {
				if (n == EXPORT) {
					o = {}
					for (i = 0; i < 3; i++) {
						o[i] = +el('c' + i).checked
					}
					o.type = calorieRadioIndex(0)
				}
				else if (n == SEARCH) {
					o = [0, 1].map(e => calorieRadioIndex(e))

					s = el('search').value
					if (!s.length) {
						calorieShowMessage("пустой запрос")
						return
					}
					if (o[0] == 1) {
						try {
							new RegExp(s)
						} catch (e) {
							calorieShowMessage("неверное регулярное выражение")
							return
						}
					}
					o = { s, o: JSON.stringify(o) }
				}
				else {
					user = el('user').value
					a = [user]
					if (n) {
						pwd = el('pwd').value
						a.push(pwd)
					}
					if (a.some(e => !/^[\wа-яё][\wа-яё ]+[\wа-яё]$/i.test(e))) {
						calorieShowMessage('Ошибка. Для логина и/или пароля можно использовать русские и английские буквы, цифры, подчёркивание и пробел. Логин и пароль не могут начинаться и заканчиваться пробелом и должны состоять минимум из трёх символов.')
						return
					}
					o = { user }
					if (n) {
						o.pwd = pwd
					}
					if (n == CREATE) {
						o.mail = el('mail').value
						if (!/^[\w.%+-]+@[\w.]+\.[a-z]{2,}$/i.test(o.mail)) {
							calorieShowMessage('Ошибка. Указан неверный адрес электронной почты.')
							return
						}
					}
				}
				o['calorie_' + p] = 1

				if (n == EXPORT)
					f = calorieDownload
				else if (n == CHANGE_PASSWORD)
					f = calorieShowMessage
				else if (n == SEARCH)
					f = calorieShowMessageSearch
				else if (n == DELETE)
					f = showDialog
				else
					f = calorieShowMessageS
				fetchpost('../php/siteupdate.php', o, f)
				if ([DELETE, EXPORT].includes(n))
					closeModal()
			}
			else {
				closeModal()
			}
		}
		, calorieButtons(['ok', 'delete']), false)
}

function calorieDownload(t) {
	d = new Date();
	a = [d.getHours(), d.getMinutes(), d.getSeconds()].map(e => String(e).padStart(2, "0")).join('')//: not allowed
	downloadUTF8("data" + Calendar.getDateFormat(d, '%d%b%Y').toLowerCase() + ` ${a}.txt`, t)
}

function calorieLogout() {
	fetchpost('../php/siteupdate.php', { calorie_logout: 1 }, showDialogLogout)
}

function showDialogLogout(s) {
	showModal("Сообщение.", s, () => location.reload())
}

function calorieInput(e) {
	e = e.id
	localStorage.setItem('calorie' + e, el(e).value)
	calorieUpdateSaveButtons()
}

function calorieRestore() {
	['ma', 'ta'].forEach(e => el(e).value = localStorage.getItem('calorie' + e) ?? '')
	calorieUpdateSaveButtons()
}

function calorieGaText(p) {
	return ga.map(e => e.trim()).join("\n").replace(/#(\d+)-(\d+)-(\d+)\s+(\d+(\.\d+)?)/ig, (match, year, month, day, mass) => {
		let v = day + gmn[month - 1] + year
		if (p) {
			gDateText.push(day + gmn[month - 1])
			gda.push(year + '-' + month + '-' + day)
			gdt.push(v)
			de.push((+day) + m2[1][month - 1] + year + ' ' + mass)
			gmass.push(mass)
		}
		return "#" + v + ' ' + mass
	})
}

function createLeastSquareGraph(id, o, width) {
	let i, y = []
		, d = o.x.map((x, i) => ({ x, y: o.y[i] }))
		, xmin = Math.min(...o.x)
		, xmax = Math.max(...o.x)
		, ymin = Math.min(...o.y)
		, ymax = Math.max(...o.y)

	//for round numbers in axes, also for valid y[]
	xmin -= xmin % 100
	xmax -= xmax % 100
	xmax += 100
	for (i = 0; i < o.x.length; i++) {
		y.push(o.a * (xmin + i * (xmax - xmin) / (o.x.length - 1)) + o.b)
	}
	//https://stackoverflow.com/questions/70386467/chart-js-combine-scatter-and-line
	const data = {
		labels: new Array(o.x.length).fill(''), // place labels array in correct spot
		datasets: [{
			type: 'line',
			label: 'линейное приближение',
			data: y,
			pointRadius: 1,
			borderColor: 'rgba(255,0,0,0.5)',
			backgroundColor: 'rgba(255,0,0,0.5)',
			xAxisID: 'x2' // Specify to which axes to link
		},
		{
			type: 'scatter',
			label: 'пары: x - калории, y - изменение массы',
			data: d,
			pointRadius: 2,
			borderColor: 'rgba(75, 192, 192, 1)',//for legend
			backgroundColor: 'rgba(75, 192, 192, 1)',//for legend
			pointBackgroundColor: 'rgba(75, 192, 192, 1)',
		}
		]
	}

	createChart(id, width, {
		type: 'scatter',
		data,
		options: {
			scales: {
				x: {
					min: xmin,
					max: xmax,
					ticks: {
						stepSize: 100
					}
				},
				x2: { // add extra axes
					position: 'bottom',
					type: 'category',
					display: false
				},
				y: {
					min: ymin - .1,
					max: ymax + .1,
					ticks: {
						stepSize: .1,
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: CALORIE_GLP[4]
				}
			}
		}
	})
}

function calorieInputKeyDown(e) {
	if (e.key == 'Enter') {
		getModalButton(0).click()
	}
}

function calorieColumnsOK() {
	gcolumns = Array.from(Object.keys(CALORIE_COLUMNS), (_, i) => +el('cb' + i).checked)
	f = a => a.map(e => +e.childNodes[0].id.slice(2))
	//order = f([...glist.childNodes])
	a = f([...glist.childNodes].filter(e => e.childNodes[0].checked))
	gpermutation = a.slice().sort((a, b) => a - b).map(e => a.indexOf(e))
	closeModal()
	setCookie('calorie_columns', JSON.stringify([gcolumns, gpermutation]))
	calorieRecipe()
}

function calorieColumnsUpdateOK() {
	for (i = Object.keys(CALORIE_COLUMNS).length - 1; i >= 0 && !el('cb' + i).checked; i--);
	el('ok').disabled = i == -1
}

function calorieColumnsReset(p) {
	n = ['белки', 'жиры', 'углеводы']
	n1 = n.map(e => e[0] + '.всего')
	m = new Map();
	n.forEach((e, i) => {
		m.set(e, e + ' / 100 грамм')
		m.set(n1[i], e + ' всего')
	});
	a = ['кк/100г', 'килокалории / 100 грамм', 'кк всего', 'килокалории всего', 'кк%', 'килокалории%'
		, 'р/кг', 'рублей за килограмм'
		, 'р/1000кк', 'рублей / 1000 килокалорий', 'р всего', 'рублей всего', 'р%', 'рубли%'
		, 'р/гБелка', 'рублей за грамм белка'
		, 'b12.всего', 'b12 всего', 'кл.', 'клетчатка', 'кл.всего', 'клетчатка всего'
	]
	for (i = 0; i < a.length; i += 2)
		m.set(a[i], a[i + 1])
	b = n.concat(n1)
	gbi = []
	a = Object.keys(CALORIE_COLUMNS).map((e, i) => {
		if (k = m.get(e)) {
			if ((j = b.indexOf(e)) != -1)
				gbi[j] = i
			e = k
		}
		return e
	})
	s = a.reduce((a, e, i) => a + `<li draggable="true"><input type="checkbox" onclick="calorieColumnsUpdateOK()" style="vertical-align:middle" id="cb${i}">${e}</li>`, '')
	glist.innerHTML = s
	if (p)
		setColumnsPermutation()
	calorieListParametersSet(gcolumns, gpermutation)
}

let glist, gDraggingItem = null
function calorieColumns(p) {
	if (p === 0 || p === 1) {
		a = gbi.slice(3 * p, 3 * p + 3)
		i = a.reduce((a, e) => a + el('cb' + e).checked, 0)
		a.forEach(e => el('cb' + e).checked = i < 2)
		calorieColumnsUpdateOK()
		return
	}
	showModal('Настройка колонок.', '<table><tr><td><ul class="calorie_sortable_list" id="list"></ul><td style="width:250px;vertical-align:top;padding-left:10px"> <button class="comboboxbutton" onclick="calorieColumnsOK()" id="ok">ок</button> <button class="comboboxbutton" onclick="calorieColumnsReset(1)">по умолчанию</button><br><button class="comboboxbutton" onclick="calorieColumns(0)">бжу / 100 грамм</button> <button class="comboboxbutton" onclick="calorieColumns(1)">бжу всего</button><br><br>Выберите колонки, которые нужно показывать в таблице отчёта, также можно изменить их порядок, для этого нужно перетащить колонку.</span>', { paddingTop: 0 })
	glist = el('list');
	calorieColumnsReset()
	glist.addEventListener('dragstart', e => {
		gDraggingItem = e.target
		gDraggingItem.classList.add('calorie_dragging');
	})
	glist.addEventListener('dragend', () => {
		gDraggingItem.classList.remove('calorie_dragging');
		glist.childNodes.forEach(e => e.classList.remove('calorie_over'));
		gDraggingItem = null;
	})
	glist.addEventListener('dragover', e => {
		e.preventDefault();
		let item = calorieGetDragAfterElement(e.clientX, e.clientY);
		glist.childNodes.forEach(e => e.classList.remove('calorie_over'));
		if (item) {
			item.classList.add('calorie_over');
			glist.insertBefore(gDraggingItem, item);
		} else {
			glist.appendChild(gDraggingItem);
		}
	})
}

function calorieGetDragAfterElement(x, y) {
	let min = Infinity, b, d
	glist.childNodes.forEach(e => {
		b = e.getBoundingClientRect();
		//for 1 column not need (b.left + b.width / 2 - x) ** 2
		if (e != gDraggingItem && (d = (b.top + b.height / 2 - y) ** 2 /*+ (b.left + b.width / 2 - x) ** 2*/) < min) {
			min = d
			r = e
		}
	})
	return min > 4000 ? null : r
}

function calorieListParametersSet(check, permutation) {
	if (check.reduce((a, e) => a + e) != permutation.length)
		throw new Error('error number of setted checks should be=permutation.length')
	a = permutation.map((e, i) => e == -1 ? i : e)
	if (a.slice().sort((a, b) => a - b).some((e, i) => e != i))
		throw new Error('error invalid permutation')
	b = [[], []]
	c = [0, 0]
	check.forEach((e, i) => {
		j = c[e]++
		b[+!e][e ? a[j] : j] = `<li draggable="true">${glist.childNodes[i].innerHTML}</li>`
	})
	glist.innerHTML = b.reduce((a, e) => a + e.join(''), '');
	[...glist.childNodes].slice(0, permutation.length).forEach(e => e.childNodes[0].checked = true)
}

function calorieRecipe() {
	let mass = 0, b, i = 0, p = ga.slice(gind[0], gind[1]).join("\n").replace(/#(\d+)-(\d+)-(\d+)\s+(\d+(\.\d+)?)/ig, (_, year, month, day, m) => {
		mass += +m
		i++
		return "#" + day + gmn[month - 1] + year + ' ' + m
	})
	mass /= i
	b = [0, 3].includes(gtype)
	let o = {
		p, mass: b ? 'fromtitle' : mass, show_summary_costs: 0, subrecipes: b ? 0 : gtype + 2
		, days: b ? 1 : gind[1] - gind[0], columns: JSON.stringify(gcolumns)
		, proteinPerKg: 1.6
		, recipe: 1
	}
	fetchpost('../php/siteupdate.php', o, calorieUpdate, undefined, new Date());
}

function setColumnsPermutation(p) {
	[gcolumns, gpermutation] = p ?? [Object.values(CALORIE_COLUMNS), [0, 1, 2, 3, 4, 6, 7, 8, 5, 9]]
}

function calorieDeleteAllUsers() {
	if (confirm('Точно удалить всех пользователей?')) {
		fetchpost('../php/siteupdate.php', { calorie_delete_all_users: 1 }, showDialog)
	}
}