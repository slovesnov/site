function dataToTable() {
	let a = [], slength, sviews, m, length, date, views
	slength = sviews = 0
	gdata.split("\n").forEach(e => {
		m = e.split(/\s/)
		length = Number(m.pop())
		date = new Date(m.pop())
		views = Number(m.pop())
		slength += length
		sviews += views
		a.push([m.join(' '), [youtubeDateToString(date), date], [timeToString(length), length], [formatNumber(views), views]])
	});
	return new Table({
		up: ["название выпуска", "дата", "длина", "просмотры"], down: [
			['', 'всего', '', timeToString(slength), formatNumber(sviews)]
			, ['', 'среднее', '', timeToString(slength / a.length), formatNumber(sviews / a.length, 0)]]
	}, a, { id: "t1", o: "cns" }).html()
}

function youtubeDateToString(date, o = 0) {
	let m = date.toLocaleDateString('ru-RU', { month: 'long' });
	if (o == 1) {
		if ([2, 7].includes(date.getMonth())) {
			m += 'а'
		}
		else {
			m = m.slice(0, -1) + 'я'
		}
	}
	return date.getDate() + ' ' + m + ' ' + date.getFullYear();
}
