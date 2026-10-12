const ln = gLanguage == 'russian' ? ['имя', 'язык', 'версия', 'дата'] :
	['name', 'language', 'version', 'date']

function load() {
	fetchpost('../php/versions_list.php', {}, callback)
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
	d = [];
	q.forEach(e => {
		l = e[1]
		e[1] = ['en', 'ru'].map(w => l.includes(w[0]) ? `<img src=../img/${w}.gif>` : '').join(' ')
		a = e[3].split(' ');
		special = a[0] == '**'
		date = new Date(a[2], a[1] - 1, special ? 15 : a[0]);
		e[3] = [a[0] + Calendar.getDateFormat(date, ' %B %Y', gLanguage == 'russian'), date]
		d.push(e)
	});
	el('p', new Table(ln, d, "nsbc").html())
}