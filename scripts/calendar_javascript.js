function load() {
	gCalendar = new Calendar('calendar', '', updateCalendar, '%d %B %Y', gLanguage == 'russian', Calendar.simagePath);
	t = el('t')
	d = new Date(2017, 11, 3);
	['%a'
		, '%A'
		, '%b'
		, '%B'
		, '%C'
		, '%d'
		, '%D'
		, '%e'
		, '%F'
		, '%h'
		, '%m'
		, '%u'
		, '%w'
		, '%y'
		, '%Y'
		, '%%'
	].forEach(e => {
		r = t.insertRow(-1)
		r.insertCell(-1).innerHTML = e
		for (j = 0; j < 2; j++) {
			r.insertCell(-1).innerHTML = Calendar.getDateFormat(d, e, j)
		}
	});
	s = ''
		;['left2', 'left', 'right', 'right2', 'ok', 'cancel'].forEach((e, i) => {
			s += (i ? ', ' : '') + '<img style="vertical-align:middle" src="' + Calendar.simagePath + '/' + e + '.png">' + e + '.png'
		})
	el('icons', s)
}

function updateCalendar() {
	document.getElementById('out').innerHTML = gCalendar.getDateFormat('%F');
}
