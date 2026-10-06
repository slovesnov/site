function load() {
	el('p').innerHTML = 'ожидание...'
	fetchpost('../php/plants.php', {}, callback)
}

function callback(s) {
	if (typeof s != "string") {
		el('p').innerHTML = s
	}
	else {
		images = JSON.parse(s)
		d = []
		images.forEach(e => {
			n = e.match(/[а-яё\s]+/i)
			da = e.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/i)
			t = da.slice(-3).join(':')
			a = new Date(da.slice(1, 1 + 3).join('-') + 'T' + t)
			src = 'img/plants/' + e
			d.push([n
				, '<a target="_blank" href="' + src + '"><img src="' + src + '" class="t"></a>'
				, [Calendar.getDateFormat(a, '%e %b %y', 1) + ' ' + t, a]
			])
		});
		el('p').innerHTML = new Table(['русское название', 'фото', 'дата'], d, { o: "scn", arrowsColumns: [0, 2] }).html()
	}
}
