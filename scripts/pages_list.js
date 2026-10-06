ln = gLanguage == 'russian' ?
	['имя', 'язык', 'дата', 'идентификатор', 'админ', 'видео', 'всего', 'перевод', 'страниц'
		, 'Список видео на которые ссылается больше одной страницы.', 'счётчик'
	]
	:
	['name', 'language', 'date', 'identifier', 'admin', 'video', 'total', 'translation', 'pages'
		, 'A list of videos that link to more than one page.', 'counter'
	];

const TRANSLATION = 7;
const PAGES = TRANSLATION + 1
const V2 = PAGES + 1;
const COUNTER = V2 + 1;

function load() {
	s = ln[1]
	for (i = 0; i < 3; i++) {
		s += '<label><input type="radio" name="rad" onclick="updateTable()"'
			+ (i == (gLanguage == 'russian') ? ' checked="checked"' : '')
			+ ' style="margin-left:30px;vertical-align: middle;margin-top: -1px;" />'
			+ (i == 2 ? im(0) + ' + ' + im(1) : im(i)) + ' <span id="s' + i + '"></span></label>'
	}
	el('p').innerHTML = s+"<p id='p1'></p><p id='p2'></p>"
	fetchpost('../php/pages_list.php', {}, callback)
}

function im(i) {
	return '<img src="img/' + (i ? 'ru' : 'en') + '.gif">'
}

function callback(s) {
	// console.log(s)
	if (typeof s != "string") {
		gerror = 1
		el('p1').innerHTML = s.message
	}
	else {
		try {
			gerror = 0
			v = JSON.parse(s)
			ga = v[0]
		} catch (e) {
			gerror = 1
			el('p1').innerHTML = String(e)
		}

		a = []
		v[1].forEach(e => {
			a.push([e[0] + ' ' + im(e[1] == 'russian'), Number(e[2])])
		})

		el('p2').innerHTML = ln[V2] + new Table([ln[3], ln[COUNTER]], a, "csb").html()
		updateTable()
	}
}

function updateTable() {
	if (gerror) {
		return
	}
	const check = 0
	let name
	if (check) {
		re = gLanguage == 'english' ? /^[a-z ,.()'+-/\d]*$/i : /^[а-яёa-z ,.()'+-/\d?"]*$/i
	}
	a = []

	//uses below
	i = [...document.querySelectorAll('input[name="rad"]')].findIndex(e => e.checked)
	uc = [0, 0, 0]
	c = [0, 0, ga.length]
	total = { count: 0, video: 0 }
	setv = new Set()
	lr = +(gLanguage == 'russian')
	ga.forEach(e => {
		id = e[0]
		language = e[1]
		l = +(language == 'russian')
		name = e[2]
		date = e[3]
		admin = e[4]
		opposite_language = e[5] ? (l ? 'english' : 'russian') : 0
		video = e[6] ? '+' : ''
		uc[l] += admin
		c[l]++
		if (i != l && i != 2) {
			return;
		}
		if (video) {
			setv.add(e[6])
			total.video++
		}
		total.count++
		t = name
		// t = name.length ? name : id
		if (check) {
			[/([a-z]+)([а-яё]+)/i, /([а-яё]+)([a-z]+)/i].forEach(e => {
				if (m = name.match(e)) {
					console.log('error mix en&ru chars [' + m[1] + '][' + m[2] + '] ' + id)
				}
			})
			if (!/^\w+$/.test(id)) {
				console.log('error ' + id)
			}
			if (!re.test(name)) {
				console.log('error ' + name + ' len=' + name.length + ' id=' + id)
				// use regex without $ at the end
				//m=name.match(/^[а-яёa-z ,.()'+-/\d?"]*/i)[0]
				// console.log('match '+m+' '+m.length)				
			}
		}
		const len = 76
		s = t.length > len ? fn(t, len * 100 / t.length) : t
		a.push([[hr(id, language, s), t]
			, hr(id, language, l) + (opposite_language ? ' / ' + hr(id, opposite_language, !l) : '')
			, date, id
			, admin ? (opposite_language ? '+ / +' : '+') : ''
			, video
		])
	})
	uc[2] = uc[0] + uc[1]
	//console.log(uc)
	l = ln.slice(0, a[0].length)
	l[1] += ' /<br>' + ln[TRANSLATION]
	l = l.map((e, i) => [1].includes(i) ? fn(e, 60) : e)
	c.forEach((e, j) => el('s' + j).innerHTML = ln[PAGES] + ' ' + e + ' / ' + (e - uc[j]) + ' (' + uc[j] + ')')
	co = []
	//not visited page go on top
	co[2] = [(a, b) => cdate(a, b, 0), (a, b) => cdate(a, b, 1)]
	el('p1').innerHTML = new Table({ up: l, down: ['', ln[l.length] + ' ' + total.count, '', '', '', uc[lr] + '/' + uc[+!lr] + ' (' + uc[2] + ')', total.video + ' / ' + setv.size] }, a, 'bcns' + (gAdmin ? 41 : 3), co).html()
}

function cdate(a, b, o) {
	let c = a[2].v === null, d = b[2].v === null
	if (c || d) {
		return c && d ? 0 : (c ? -1 : 1)
	}
	else {
		c = b[2].v.localeCompare(a[2].v)
		return o ? c : -c
	}
}

function fn(s, percent) {
	return '<span style="font-size:' + percent + '%">' + s + '</span>'
}

function hr(id, language, p) {
	return '<a href="?' + id + ',' + language + '">' + (typeof p == 'string' ? p : im(p)) + '</a>'
}
