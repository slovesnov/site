function load() {
	M = []
	for (i = 0; i < 12; i++) {
		j = new Date(2022, i, 1).toLocaleDateString('ru-RU', { month: 'long' }).toLowerCase()
		if ([2, 7].includes(i)) {
			j += 'а'
		}
		else {
			j = j.slice(0, -1) + 'я'
		}
		M.push(j);
	}

	d2 = []
	tt = tv = tvc = 0
	map = new Map()

	gdata.split("\n").forEach(e => {
		m = e.split(/\s/)
		length = Number(m.pop())
		date = new Date(m.pop())
		sviews = m.pop()
		views = Number(sviews)
		caption = m.join(' ');

		a = caption.split(/,\s/ui)
		a.forEach(e => {
			if (e == 'Азамат') {
				e = 'Азамат Мусагалиев';
			}
			if (e == 'Крид') {
				e = 'Егор Крид';
			}
			j = map.get(e)
			if (j === undefined) {
				j = 0
			}
			map.set(e, j + 1)
		});

		ds = youtubeDateToString(date)
		if (sviews == 'removed') {
			i = 0
		}
		else {
			i = views
			tv += i
			tvc++
		}
		tt += length
		g = a.length
		c = a.join(', ')
		if (g == 5) {
			c = '<span style="font-size:60%">' + c + '</span>';
		}
		d2.push([c, [ds, date], [timeToString(length), length], g, [i ? formatNumber(i) : 'выпуск удален', i]])
	})
	d1 = []
	t = w = 0
	const MN = 'никита|слава|баста|шура|тимати|красава|братья'
	for ([n, c] of map) {
		a = n.split(/\s+/)
		woman = a.every(e => 'аеиоуыэюяё'.indexOf(e.slice(-1)) != -1) && !n.match(new RegExp(MN, "i"))
		if (n.match(/[a-z]/i) || a.length == 1) {
			n1 = n
		}
		else if (a.length == 2) {
			n1 = a[1] + ' ' + a[0]
		}
		else {
			n1 = n
			console.log('strange name' + n)
		}
		d1.push([[n, n1], c, woman ? 'ж' : 'м']);
		t += c
		if (woman) {
			w++
		}
	}

	//r='\\d\\.\\d+\\s+((\\d+)\\s+([а-я]+)\\s+(\\d+))'
	//re='(\\n|^)([а-я \t«»]+)(Ведущий|Комик)\\s+'+r+'\\s+('+r+'|наст\\. время)'
	//console.log(67)
	r = String.raw`\d\.\d+\s+((\d+)\s+([а-я]+)\s+(\d+))`
	//cann't use \s in [а-я \t«»]+
	re = String.raw`(\n|^)([а-я \t«»]+)(Ведущий|Комик)\s${r}\s+(${r}|наст\. время)`
	d0 = []
	to = tc = 0;
	for (m of gv.matchAll(new RegExp(re, 'usig'))) {
		db = stringToDate(m, 5)
		if (m[8] == 'наст. время') {
			de = new Date()
			se = 'настоящее время'
		}
		else {
			de = stringToDate(m, 10)
			se = m[9]
		}
		s = m[2].trim()
		j = s.indexOf('«')
		if (j != -1) {
			k = s.indexOf('»')
			//+2 because of space after
			s = s.substring(0, j) + s.substring(k + 2)
		}
		sa = s.split(' ').reverse().join(' ');

		c = d2.reduce((a, e) => {
			if (e[1][1] >= db && e[1][1] <= de) {
				a.c++
				a.t += e[2][1]
			}
			return a
		}, { c: 0, t: 0 })
		to += c.t
		tc += c.c
		d0.push([[s, sa], [m[4], db], [se, de], c.c, [timeToString(c.t), c.t]]);
	}

	title = [
		{
			up: ['ведущие', 'начало', 'конец', 'выпусков', 'время']
			, down: [['', ['среднее', 3], formatNumber(tc / d0.length, 2), timeToString(to / d0.length)]]
		}
		, { up: ['имя', 'раз', 'пол'], down: ['', 'всего', t, 'ж=' + w] }
		, {
			up: ['список гостей', 'дата', 'время', 'гостей', 'просмотров'], down: [
				['', ['всего', 2], timeToString(tt), t, formatNumber(tv)]
				, ['', ['среднее', 2], timeToString(tt / d2.length), formatNumber(t / d2.length, 2), formatNumber(tv / tvc, 0)]
			]
		}
	]

	d = [d0, d1, d2].map((e, i) => new Table(title[i], e, { id: 't' + i, o: "bsnc" + (i == 0 ? '' : '11') }).html())

	el('p').innerHTML = '<p>Просмотры на ' + youtubeDateToString(new Date(gdate), 1) + '<table id="t"><tr><td>' + d[1] + '<td>' + d[0] + d[2] + '</table>'
}

function stringToDate(m, i) {
	return new Date(m[i + 2], M.indexOf(m[i + 1]), m[i])
}

gv = `Нурлан Сабуров	Ведущий	1.01
25 апреля 2019	наст. время
Алексей Щербаков	Комик	1.01
25 апреля 2019	наст. время
Тамби Масаев	Комик	1.01
25 апреля 2019	наст. время
Илья «Макар» Макаров	Комик	2.11
29 октября 2020	наст. время
Эмир Кашоков	Комик	3.01
1 апреля 2021	наст. время
Бывшие

Имя	Роль	Период участия
Первое появление	Последнее появление
Артур Чапарян	Комик	1.01
25 апреля 2019	1.07
1 августа 2019
Рустам «Рептилоид» Саидахмедов	Комик	1.01
25 апреля 2019	2.15
14 января 2021
Сергей Детков	Комик	1.08
20 сентября 2019	2.09
17 сентября 2020`
