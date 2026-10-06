f = p => createUrl('#', p, ` onclick="queryOut('${p.replaceAll(' ', '_')}');return false;"`)
const U = [
	[
		//first item is ignored so can use comma in 2nd etc items
		//, ['?stopwatch_javascript,,1', 'дро']
		, ['php/siteupdate.php?calorie', 'дневник питания', 1]
		, ['php/siteupdate.php?massgraph', 'massgraph', 1]
		//, ['?stopwatch_javascript,,2', 'планка']
		//, ['?stopwatch_javascript,,3', 'гто']
		// , ['?goods_statistics', 'список продуктов']
		// , ['php/jm.php?goods_viewedit', 'редактор продуктов']
		, ['?statistics', 'статистика сайта', 1]
		// , ['?protein_quantity', 'расчёт количества белка']
		// , ['?aminoacids', 'содержание аминокислот']
		// , ['?right_nutrition_addon1', 'ппп дополнение 1']
		//, ['?bmi', 'индекс массы тела']
		// , ['!private_data/clothes/table.php', 'clothes']
		// , ['?plants', 'список растений']
		// , ['?food', 'список растений, грибов, ягод']
		// , ['?poems_classifier_sample', 'классификатор песен']
		// , ['?cooking', 'время приготовления']
		// , ['?calorie_recipe', 'калории/стоимость рецепта ']
		//, ['https://file-converter-online.com', 'file-converter-online.com']
	], [
		['php/siteupdate.php', 'siteupdate', 'save']
		, ['php/siteupdate.php?difference', 'su diff']
		, ['php/siteupdate.php?imagedifference', 'su img diff']
		, ['?pages_list', 'pages list']
		, ['?video_list', 'video list']
		, ['php/test.php', 'php/test.php', 1]
		, ['?test', '?test', 1]
		, ['php/siteupdate.php?videoseditor', 'videos editor']
		, ['php/siteupdate.php?versioneditor', 'version editor']
		, ['?cookie', 'cookie editor']
		, ['php/siteupdate.php?exchange', 'exchange', 1]
		, ['php/siteupdate.php?exercise', 'exercise']
		, f('exercise workout')
		//not need any more commented in siteupdate.php, f('exercise update mass')
		//, [exerciseAddDate, 'exercise mass']
		//, '<span onclick="exchangeAddNewDay()" class="a">exchangeNewDay</span>'
		//, ['php/siteupdate.php?exchangeAddNewDay', 'exchNewDay']
	], [
		['php/siteupdate.php?pagesreferences', 'pages/js/css references']
		, ['php/siteupdate.php?pagesreferenceslevel', 'pages references level']
		, ['php/siteupdate.php?cookie', 'cookie, php/mysql version', 1]
		, ['php/siteupdate.php?parameters', 'parameters']
		, ['php/siteupdate.php?videodatedifference', 'video date difference']
		, ['php/siteupdate.php?unvisitedpages', 'unvisited pages', 1]
		, ['php/jm.php?checkgoodsincomments', 'check goods in comments']
		, ['php/siteupdate.php?phpinfo', 'phpinfo', 1]
		, ['php/siteupdate.php?ruenchars', 'ruenchars']
		, ['php/siteupdate.php?cc', 'chars count in name']
		, ['php/siteupdate.php?script_css_count', 'script/css count (different)']
		, ['php/siteupdate.php?crlf', 'script/css/php crlf']
		, ['php/siteupdate.php?strangejscss', 'strange js/css']
	]
]

const TURL = [
	'index.php',
	'php/jm.php',
	'php/jm.php?j',
	['/phpmyadmin', 'https://php-myadmin.net/db_structure.php?db=if0_40173715_site']
]

const ICONS = ['favicon', 'money', 'journal', 'phpmyadmin']
const IN_TABLE = 1
const IN_TABLE_ROWSPAN = 4//>0

function load() {
	U.forEach(e => {
		if (!e[0]) {
			e.shift();
		}
	})
	m = Math.max(...U.map((e, i) => e.length + (IN_TABLE && i == 0 ? IN_TABLE_ROWSPAN - 1 : 0)))
	// console.log(m)
	st = '<table class="t" style="margin-top:0">'
	for (j = 0; j < 2; j++) {
		st += TURL.reduce((a, e, i) => {
			b = i != TURL.length - 1
			return a + '<td>' + (j && !b ? '' : createUrl(
				(j && b ? REMOTE : '') + (Array.isArray(e) ? e[j] : e)
				, im(i)))
		}, '<tr><td>' + (j ? 'remote' : 'local'))
	}
	st += '</table>'
	st += 'page <input id="page" type="text" onkeydown="page(this,event);return true;" style="width:110px;margin-top:4px" placeholder="amino">'

	el('p').innerHTML = '<table id="t">'
		+ ('<tr>' + '<td>'.repeat(U.length)).repeat(m)
		+ '</table>' + (IN_TABLE ? '' : st)
		+ '<span id="o"></span>';

	U.forEach((e, i) => {
		e.forEach((e, j) => {
			if (Array.isArray(e)) {
				if (typeof e[0] == 'function') {
					s = createUrl('#', e[1], ` onclick="${e[0].name}();return false;"`)
				}
				else {
					u = e[0] + (e[0].includes('/') ? '' : ',russian')
					s = createUrl(u, e[1])
					if (e.length > 2) {
						s += ' ' + createUrl(REMOTE + u, im(0))
						if (e[2] == 'save') {
							//remote not woking cors policu s += ' ' + createUrl('#', im('jm/save16.png'), ` onclick="queryOut('saveremote',1)"`)
							s += ' ' + createUrl(REMOTE + 'php/siteupdate.php?saveremote', im('jm/save16.png'))
						}
					}
				}
			}
			else {
				s = e
			}
			k = j - U[0].length
			b = IN_TABLE && i && k > 0 && k < IN_TABLE_ROWSPAN
			c = el('t').rows[j].cells[i - b]
			c.innerHTML = s
			if (b && i == 1) {
				c.classList.add('pa');
			}
		})
	})
	if (IN_TABLE) {
		e = el('t').rows[U[0].length].cells[0]
		//e.style.background = 'red'
		e.rowSpan = IN_TABLE_ROWSPAN
		e.innerHTML = st
	}
	//swjerk()
}

function im(j, c) {
	return `<img ${c ? 'onclick="' + c + '" ' : ''}style="vertical-align:middle;" src="/${typeof j == 'string' ? "img/" + j : 'favicon/' + ICONS[j] + '.ico'}">`
}

function createUrl(url, text, add = 'target="_blank"') {
	return '<a href="' + url + '"' + add + '>' + (text === undefined ? url : text) + '</a>'
}

function swjerk() {
	const rev = 1
	s = getCookie('stopwatch_javascript_jerk')
	month = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString('default', { month: 'short' }).toLowerCase().slice(0, 3))
	z = s.split(/\s+(?=\d+[a-z]{3})/)
	d = []
	for (i = 0; i < 2; i++) {
		m = z[i ? z.length - 1 : 0].match(/(\d+)([a-z]{3})/)
		d.push(new Date(2025, month.indexOf(m[2]), m[1]))
	}
	m = (d[1] - d[0]) / (1000 * 60 * 60 * 24);

	w = "<p style='max-width:800px'>"
	j = m + 1 - z.length
	if (j) {
		w += `FOUND ${j} EMPTY DAY(S)<br>`
	}
	if (rev) {
		z = z.reverse()
	}
	r = []
	sep = '=';
	for (i = 0; i < 2; i++) {
		if (i) {
			w += "<br>====== without last day =======<br>";
			//remove last day
			s = s.replace(/\s*\d+[a-z]{3}[\s\d:*]+$/, "");
		}
		a = s.split(/\s+/);
		t = c = tt = 0;
		q = [];
		y = []
		f = (t, c) => " " + timeToString(t) + sep + c + "*" + timeToString(t / c);
		pr = (t, c) => {
			if (!i) {
				r.unshift(f(t, c))
			}
			q.push(c);
		};
		toTime = e => Math.floor(e / 100) * 60 + e % 100
		a.forEach(e => {
			if (/^\d+\*?$/.test(e)) {
				if (e.endsWith('*')) {
					e = e.slice(0, -1)
				}
				e = +e
				v = toTime(e);
				t += v;
				c++;
				tt += v;
				y.push(e)
			} else if (/^\d+[a-z]{3}$/.test(e)) {
				if (t) {
					pr(t, c);
				}
				t = c = 0;
			}
		})
		pr(t, c);
		days = q.length;
		sq = q.reduce((e, a) => e + a);
		d = Math.floor(y.length / 2)
		y = y.sort((a, b) => a - b)
		b = !(y.length % 2)
		if (b) {
			y.push(+timeToString((toTime(y[d - 1]) + toTime(y[d])) / 2).replace(':', ''))
		}
		ay = []
		j = y.sort((a, b) => a - b).reduce((a, e, i) => {
			let c = [d, 0, y.length - 1]
			if (!(y.length % 2)) {
				c.push(d - 1)
			}
			if (c.includes(i)) {
				ay.push(e)
			}
			return a + ' ' + (c.includes(i) ? '<b>' : '')
				+ (b && i == (y.length - 1) / 2 ? '[' : '') + e + (b && i == (y.length - 1) / 2 ? ']' : '') + (c.includes(i) ? '</b>' : '')
		}, '')
		w += "times"
			//+ j
			+ ' ' + ay.join(' … ')
			+ "<br>times per day min " + Math.min(...q) + ", max " + Math.max(...q)
			+ ", total " + sq + sep + days + "*" + formatNumber(y.length / days, 2)
			+ ", total average time per day " + timeToString(tt / days)
			+ "<br>"
			+ "total" + f(tt, y.length)
			+ ", days " + days + ", cookie length " + s.length
		if (!i) {
			jmax = Math.max(...q)
		}
	}
	el('o').innerHTML = w + z.reduce((a, e, i) => {
		b = e.split(/\s/)
		return a + '<tr><td>' + b.reduce((a, e, i) => {
			if (i % 2) {
				c = stringToTime(e)
				if (i > 1) {
					d = timeToString(c - cp)
				}
				cp = c;
			}
			return a + (i % 2 ? '<td>' : ' ') + e //+ (i % 2 && i > 1 ? `+${d}` : '')//show difference
		}, '') + '<td>'.repeat(jmax + 2 - (b.length + 1) / 2) + r[i]
	}, '<table class="table_border table_color jerk"><thead><tr><th><th>' + Array.from({ length: jmax }, (_, i) => i + 1).join('<th>') + '<th></thead>') + '</table>'
}

function queryOut(p) {
	//remote not working CORS polici
	fetchpost('php/siteupdate.php?' + p, {}, s => el('o').innerHTML = s)
}

/* 
function exerciseAddDate() {
	fetchpost('php/siteupdate.php?exercise_add_date', {}, s => el('o').innerHTML = s)
}

function exchangeAddNewDay() {
	fetchpost('php/siteupdate.php', { exchangeAddNewDay: 1 }, s => el('o').innerHTML = s)
}
*/

//from siteupdate.js
function page(t, e) {
	if (e.key == 'Enter') {
		window.open("?" + el('page').value, "_blank").focus();
		//location.href='?'+el('page').value
		return;
	}
	const KEYR = 'йцукенгшщзхъфывапролджэячсмитьбюё';
	const KEYE = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`';
	const R = KEYR + KEYR.toUpperCase()
	const E = KEYE + KEYE.toUpperCase()
	//here R swap with E
	if (!e.ctrlKey && !e.altKey && (i = R.indexOf(e.key)) != -1) {
		e.preventDefault()
		addPFC(t, E[i])
	}
}

//from siteupdate.js
function addPFC(t, add) {
	const start = t.selectionStart
	const end = t.selectionEnd
	const text = t.value
	t.value = text.substring(0, start) + add + text.substring(end, text.length)
	t.selectionStart = t.selectionEnd = start + add.length
	t.focus()
}
