const BEGIN = '<img src="img/';
const ln = gLanguage == 'russian' ? ['язык', 'видео'
	, 'время общее', 'среднее', 'медианное'
	, 'ссылки', 'язык / название видео или презентации', 'дата', 'длина', 'вер<br>сия', 'раздел', 'размер<br>(мб)', '<span class="fracb"><span>мб</span><span>мин</span></span>', '&Delta;'
] :
	['language', 'video'
		, 'time total', 'average', 'median'
		, 'links', 'language / name of video or presentation', 'date', 'length', 'ver<br>sion', 'chapter', 'size<br>(mb)', '<span class="fracb"><span>mb</span><span>min</span></span>', '&Delta;'
	]

const showName = gAdmin ? 0 : 0

function load() {
	fetchpost('../php/video_list.php', {}, callback)
	s = ln[0]
	for (i = 0; i < 3; i++) {
		s += '<label><input type="radio" name="rad" onclick="updateTable();updateTableStatistics();"'
			+ (i == (gLanguage == 'russian') ? ' checked="checked"' : '')
			+ ' style="margin-left:30px;vertical-align: middle;margin-top: -1px;" />'
			+ (i == 2 ? im(0) + ' + ' + im(1) : im(i)) + ` ${ln[1]} <span id="s${i}"></span></label>`
	}
	el('p').innerHTML = s + "<p id='p1'></p><p id='p2'></p>"
}

function im(i) {
	return '<img src="img/' + (i ? 'ru' : 'en') + '.gif">'
}

function callback(s) {
	if (typeof s != "string") {
		el('p1').innerHTML = s.message
		return
	}
	else {
		try {
			videos = JSON.parse(s)
		} catch (e) {
			el('p1').innerHTML = String(e)
			return
		}
	}
	const im = ['youtube', 'zen'/*, 'video'*/]
	a = []
	co = [0, 0, videos.length]
	gvt = []
	videos.forEach((e, ind) => {
		id = e[0]
		//e[0] = remote + e[0] + '.mp4'

		b = +(e[1] == 'russian')
		co[b]++;
		d = new Date(e[5])

		ts = formatString(e[6], ':', 2)
		if (e[6] < 60) {
			ts = '0:' + ts
		}
		t = stringToTime(ts)
		gvt.push([t, b])

		version = e[7]

		dt = ind == videos.length - 1 ? 0 : (d - new Date(videos[ind + 1][5])) / 1000 / 3600 / 24

		size = +e[9]
		mbmin = 60 * size / t
		toobig = size >= 100

		aa = [im.reduce((a, e1, i) =>
			a + (i == 2 && toobig ? '' :
				`<a href="${e[[2, 3, 0][i]]}" target="_blank">${BEGIN + e1}16.png"${i ? ' class="ma"' : ''}></a>`), '')
			, [BEGIN + e[1].slice(0, 2) + `.gif" style="display:inline-block;margin:0 3px 2px 0;">` + e[4], strip(e[4])]
			, [Calendar.getDateFormat(d, '%e%b%Y', gLanguage == 'russian'), d]
			, [ts, t]
			, [version, +version]
			, [e[8], e[8]]//chapter
			, [formatNumber(size, 2), size]//size
			, [formatNumber(mbmin, 1), mbmin]
			, [dt <= 7 ? '' : '+' + dt, dt]
		];
		if (showName) {
			aa.push(id)
		}
		a.push(aa)
	});

	co.forEach((e, i) => el('s' + i).innerHTML = e)
	title = ln.slice(-a[0].length + showName)
	if (showName) {
		title.push('id')
	}
	gtable = new Table(title, a, { o: "cns", arrowsColumns: [1, 2, 3, 4, 5, 6, 7], nstring: ['#', '№'][+gLanguage == 'russian'], filter })
	el('p1').innerHTML = gtable.html()

	updateTableStatistics()
}
/*
update videos set language=if(rand()<.5,'russian','english')
update videos set language='russian'
*/
function updateTable() {
	gtable.filter(filter)
}

function filter(e) {
	let i = checkIndex()
	return i == 2 ? true : e[1].s.slice(BEGIN.length, BEGIN.length + 2) == ['en', 'ru'][i]
}

//remove all tags
function strip(html) {
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || "";
}

function checkIndex() {
	return [...document.querySelectorAll('input[name="rad"]')].findIndex(e => e.checked)
}

function updateTableStatistics() {
	let i = checkIndex(), a = i == 2 ? gvt : gvt.filter(e => e[1] == i)
	a = a.map(e => e[0]).sort((a, b) => a - b)
	let med = a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2] + a[a.length / 2 + 1]) / 2
		, sumt = a.reduce((a, e) => a + e, 0);
	el('p2').innerHTML = [sumt, sumt / a.length, med].reduce((a, e, i) => a + (i ? ', ' : '') + ln[i + 2] + ' ' + (e < 60 ? '0:' : '') + timeToString(e), '')
}