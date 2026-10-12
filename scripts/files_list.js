const ln = gLanguage == 'russian' ? ['имя', 'размер', 'mtime', 'всего', 'все'] :
	['name', 'size', 'mtime', 'total', 'all']

function load() {
	fetchpost('../php/files_list.php', {}, callback)
}

function callback(s) {
	if (typeof s != "string") {
		el('p', s.message)
		return
	}
	try {
		q = JSON.parse(s)
	} catch (e) {
		el('p', String(e))
		return
	}
	fn = e => [formatString(e), e]
	const u = [...new Set(q.map(e => e[1]))];
	length = u.length + 1
	d = Array.from({ length }, () => []);
	t = Array.from({ length }).fill(0);
	const ALL_INDEX0 = 1;
	const AI = ALL_INDEX0 ? 0 : length - 1
	q.forEach(e => {
		i = u.indexOf(e[1]) + ALL_INDEX0
		t[i] += e[2]
		t[AI] += e[2];
		e[2] = fn(e[2])
		da = +e[3]
		date = new Date(da * 1000)
		e[3] = [Calendar.getDateFormat(date, '%e%b%Y', gLanguage == 'russian'), da]
		e.splice(1, 1)
		d[i].push(e)
		d[AI].push(e)
	});
	s = d.reduce((a, e, i) => {
		title = { up: ln.slice(0, q[0].length), down: ['', ln[3], formatString(t[i])] }
		return a + `<td><h3>${i == AI ? ln[4] : u[i-ALL_INDEX0]}</h3>` + new Table(title, e, "nsbc").html()
	}
		, '<table class="m"><tr>') + '</table>'
	el('p', s)
}