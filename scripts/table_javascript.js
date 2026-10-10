function load() {
	for (n = 0; n < 3; n++) {
		if (n == 0) {
			data = [['help.txt', 1000, 'ok'], ['table.js', 8654, 'ok'], ['table.css', 54, 'ok']]
			title = ['filename', 'size', 'status']
			options = { sort: 1, color: 1, border: 1 }
			comparator = undefined
		}
		else if (n == 1) {
			data = [['help.txt', ['1 000', 1000], 'ok'], ['table.js', ['8 654', 8654], 'ok'], ['table.css', 54, 'ok']]
			title = { up: ['filename', 'size', 'status'], down: ['total', '9 708'] }
			options = { sort: 1, color: 1, border: 1 }
			comparator = undefined
		}
		else {
			title = ['name', 'birth date', 'death date', 'age']
			data = [
				['Vera Francevna Menchik', '16-02-1906', '26-06-1944', false]
				, ['Judit Polgár', '23-07-1976', null, false]
				, ['Garry Kimovich Kasparov', '13-04-1963', null, true]
				, ['Robert James Fischer', '09-03-1943', '17-01-2008', true]
				, ['Vladimir Borisovich Kramnik', '25-06-1975', null, true]
				, ['Vasily Vasilyevich Smyslov', '21-03-1921', '27-03-2010', true]
				, ['Alexandra Konstantinovna Kosteniuk', '23-04-1984', null, false]
				, ['Lyudmila Vladimirovna Rudenko', '27-07-1904', '04-03-1986', false]
			]
			d = []
			data.forEach(e => {
				b = e[0].split(/\s+/)
				e[0] = [e[0], b[b.length - 1]]//for correct sort by surname
				live = e[2] == null
				for (i = 1; i < 3; i++) {
					d[i] = e[i] ? new Date(e[i].split('-').reverse().join('-')) : new Date()
					e[i] = [e[i] ? d[i].toLocaleDateString('en-en', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					}) : '?', d[i]]
				}
				sub = d[2].getMonth() < d[1].getMonth()
					|| d[2].getMonth() == d[1].getMonth() && d[2].getDay() <= d[1].getDay()
				e.splice(3, 0, d[2].getFullYear() - d[1].getFullYear() - sub)
				e.push(live)
				//e = [ [name,surname], [birth date as text, birth date as Date]
				//, [death date as text, death date as Date], age in year, woman(hidden), live(hidden)]
			})
			comparator = []
			comparator[0] = [undefined, undefined, '5d', '5', '4', '4d']
			options = {
				o: 'cns0', class: 't' + n, additionalSortTitle: [['live', 'woman']]
			}
		}
		el('t' + n).innerHTML = new Table(title, data, options, comparator).html()
	}

}