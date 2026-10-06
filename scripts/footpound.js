l = gLanguage == 'russian' ? ['рост', 'вес', 'имт', 'см', 'кг', '', 'введите рост "футы дюймы" и вес "фунты"'] :
	['height', 'weight', 'bmi', 'cm', 'kg', '', 'enter height "feet inches" and weight "pounds"'];
li = ['6 7 251', '63  265.5', '510155']
n = 2
k = [2.54, 0.453]

function load() {
	s = '<table>'
	for (i = 0; i < n + li.length; i++) {
		s += `<tr><td><input type='text' id='${i + '0'}' placeholder='${l[l.length - 1]}' style='width:300px' value='${i < n ? '' : li[i - n]}' oninput='c(${i})'> <td><span id='${i + '1'}'>`
	}
	el('p').innerHTML = s + '</table>'
	for (i = 0; i < li.length; i++) {
		c(n + i)
	}
}

function c(i) {
	a = el(i + '0').value.trim().split(/\s+/)
	if (a.length == 1) {
		//2nd part one or two digits. two digits can be only 10 or 11
		a = a[0]
		j = a[1] == 1 && a[2] < 2 ? 3 : 2
		a = [a.slice(0, 1), a.slice(1, j), a.slice(j)]
	}
	else if (a.length == 2) {
		a = [a[0].slice(0, 1), a[0].slice(1), a[1]]
	}
	b = a.length == 3 ? [a[0] * 12 + (+a[1]), +a[2]].map((e, i) => e * k[i]) : [false, false]
	b.push(b[1] * 10000 / b[0] ** 2)
	el(i + '1').innerHTML = b.map((e, i) => l[i] + ' ' + (e ? formatNumber(e, 1) : '?') + l[i + b.length]).join(', &nbsp; ')
}