id = ['масса', 'рост', 'возраст'];
function load() {
	b = [73, 178, 47]
	el('a').innerHTML = id.map((e, i) => e + ` <input type='text' value='${b[i]}' id='${e}' oninput='r()' style='width:40px'>`).join(' ')
	r()
}

function r() {
	//|| NaN error on empty string
	[m, h, age] = id.map(e => {
		let n = evaluateString(el(e).value)
		let er = n <= 0 || n === false
		el(e).style.color = !er ? 'black' : 'red'
		return er ? NaN : n
	})
	s = `<table class='table_color table_border'><thead><tr><th>` + ['k', 'Миффлин-Сан Жеор', 'Харрис Бенедикт'].join('<th>') + '</thead><tbody>'
	v = [10 * m + 6.25 * h - 5 * age + 5, 13.4 * m + 4.8 * h - 5.7 * age + 88.36]
	f = (e, d) => isNaN(e) ? '?' : formatNumber(e, d);
	[1.2, 1.375, 1.55, 1.725, 1.9].forEach(e => {
		s += v.reduce((a, q) => a + '<td>' + f(q * e, 1) + '/m = ' + f(q * e / m, 2), `<tr><td>${e}`)
	})
	s += `</table>`
	el('p').innerHTML = s
}
