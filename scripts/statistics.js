lng = gLanguage == 'russian' ? [
	'имя, язык', 'символов', 'байт', 'ожидание ответа...', 'всего'
	, 'посещаемость сайта по дням и по уникальному/общему числу посетителей'
	, 'глобальная посещаемость сайта и по страницам выбранного дня'
	, 'число страниц сайта на русском и английском языках'
	, 'страницы сайта / длина контента'
	, 'таблица счетчиков', 'таблица ip', 'дата', 'счетчик', 'админ', 'уникальных', 'год'
	, 'По годам.'
	, 'По месяцам.'
	, '<span style="font-size:85%">По имени, языку. Жирный шрифт - страница есть на двух языках.</span>'
	, 'По имени.'
	, 'Выбранный день.'
	, 'строк', 'месяц', 'первая дата', 'имя', 'комментарий'
	, 'всего страниц', 'только на английском', 'только на русском', 'на русском и английском', 'переведено на английский'
] : [
	'name, language', 'symbols', 'bytes', 'waiting for response...', 'total'
	, 'site attendance by inique/total visitors'
	, 'global site attendance and by pages of selected day'
	, 'number of site pages in english and russian languages'
	, 'pages / content length'
	, 'counters table', 'ip table', 'date', 'counter', 'admin', 'unique', 'year'
	, 'Group by year.'
	, 'Group by month.'
	, '<span style="font-size:90%">Group by name, language. Bold font - page exists on two languages.</span>'
	, 'Group by name.'
	, 'Special date.'
	, 'rows', 'month', 'first date', 'name', 'comment'
	, 'total pages', 'only in english', 'only in russain', 'in english and russian', 'translated to english'
]

const nameLanguage = 0
const waiting = 3
const total = 4
const attendance = 5
const counters_table = 9
const ip_table = 10
const date = 11
const counter = 12
const admin = 13
const unique = 14
const year = 15
const byyear = 16
const rows = 21
const month = 22
const firstDate = 23
const namei = 24 //name is deprecated warning in js
const comment = 25
const totalPages = 26

const pageInfo = 0
const dayByDay = 1
const contentLength = 2
const calendar = 3

function load() {
	o = ["f(" + dayByDay + ")", 'updateCalendar()', "f(" + pageInfo + ")", "f(" + contentLength + ")"]
	s = ''
	gt = [['', '', [lng[counters_table], 2], [lng[ip_table], 4]], [lng[date], lng[counter], lng[admin], lng[unique], lng[admin], lng[total], lng[admin]]]
	for (i = 0; i < o.length; i++) {
		//s += '<tr><td' + (i == 1 ? '' : ' colspan=2') + '><span class="link" onclick="' + o[i] + '">' + lng[attendance + i] + '</span>'
		s += '<tr><td' + (i == 1 ? '' : ' colspan=2') + '><a onclick="' + o[i] + '" href="#">' + lng[attendance + i] + '</a>'
		if (i == 1) {
			s += '&nbsp;<td><span id="calendar"></span>'
		}
	}
	el('table').innerHTML = s
	gCalendar = new Calendar('calendar', '', updateCalendar, '%d %b %Y', gLanguage == 'russian');
}

function updateCalendar() {
	f(gCalendar.getDateFormat('%F'));
}

function f(s) {
	el('o').innerHTML = lng[waiting]
	fetchpost("php/statistics.php", s, fcb, typeof s == 'number' ? s : calendar)
}

function fcb(s, p) {
	if (typeof s != 'string') {
		s = s.toString();
	}
	else {
		// console.log(s.substring(0,200))
		// console.log(s.length,p)
		if (p == pageInfo) {
			a = []
			c = JSON.parse(s)
			pe = c[1] + c[3];
			pr = c[2] + c[3];
			pt = pe + pr

			for (i = 0; i < 5; i++) {
				b = [lng[totalPages + i]]
				if (i) {
					v = i == 4 ? c[3] / pr : c[i] / pt
					b[1] = i == 4 ? c[3] + ' / ' + pr + ' = ' + v.toFixed(2) : c[i]
				}
				else {
					b[0] += ' = ' + limage('ru') + ' +' + limage('en')
					b[1] = pt + ' = ' + pr + ' + ' + pe
					v = 1
				}
				b.push(formatNumber(v * 100, 2) + '%')
				a.push(b)
			}
			t = [lng[comment], lng[counter], '%']
			s = new Table(t, a, { class: "alignright", o: "bc" }).html()
		}
		else if (p == dayByDay) {
			a = []
			JSON.parse(s).forEach(e => {
				b = e.slice(1).map(e => [formatString(e), e])
				e[0] = da(e[0])
				b.unshift(e[0])
				a.push(b)
			});
			s = new Table(gt, a, { class: "alignright daybyday", o: "bnsc" }).html()
		}
		else if (p == contentLength) {
			a = []
			t = [0, 0];
			JSON.parse(s).forEach(e => {
				for (i = 2; i < 4; i++) {
					j = e[i];
					e[i] = [formatString(j), j]
					t[i - 2] += j
				}
				e[0] += ref(e[0], e[1])
				e.splice(1, 1)
				a.push(e)
			});
			down = ['', lng[total]].concat(t.map(e => formatString(e)));
			s = new Table({ up: lng.slice(0, waiting), down }, a, { class: "alignright", o: "bnsc11" }).html()
		}
		else if (p == calendar) {
			d = JSON.parse(s)
			s = '<table><tr>'
			//got list of pages with two languages
			diffLanguage = new Set(
				d[2].map(e => e[2].slice(0, -2)).sort((a, b) => a.localeCompare(b))
					.filter((e, i, a) => i && e == a[i - 1])
			)
			d.forEach((q, qi) => {
				a = []
				down = [0, 0, 0]
				q.forEach(e => {
					for (i = 0; i < 2; i++) {
						j = e[i];
						e[i] = [formatString(j), j]
						down[i] += j
					}
					if (qi == 1) {
						j = e[2]
						e[2] = [Calendar.getDateFormat(new Date(j.substring(0, 4), Number(j.substring(4)) - 1, 1), '%b%Y', gLanguage == 'russian'), Number(j)]
					}
					else if (qi == 2 || qi == 4) {
						j = e[2]
						n = j.slice(0, -2)
						l = j.slice(-2)
						e[2] = [(diffLanguage.has(n) ? '<b>' + n + '</b>' : n) + ref(n, l), n]
					}
					if (qi == 2 || qi == 3) {
						e[3] = da(e[3])
					}
					a.push(e)
				})
				for (i = 0; i < 2; i++) {
					down[i] = formatString(down[i])
				}
				down[2] = lng[rows] + ' ' + a.length
				id = [year, month, nameLanguage, namei, nameLanguage]
				ids = [counter, admin, id[qi]];
				if (qi == 2 || qi == 3) {
					ids.push(firstDate)
				}
				b = []
				ids.forEach(e => b.push(lng[e]))
				s += '<td style="vertical-align:top;">' + new Table({ up: [[[lng[byyear + qi], b.length]], b], down }, a, { class: "alignright attendance", o: "bsc" + (qi >= 2 ? 0 : 2) + "1" }).html()
			})
			s += '</table>'
		}
	}
	el('o').innerHTML = s
}

function limage(language) {
	return ' <img src="../img/' + language + '.gif">'
}

function ref(name, language) {
	return limage(language) + '<a href="?' + name + ',' + language + '"><img style="transform: rotate(90deg)" src="' + Table.imagePath + 'up8.png"></a>'
}

function da(j) {
	return [Calendar.getDateFormat(new Date(j), '%d%b%Y', gLanguage == 'russian'), j]
}
