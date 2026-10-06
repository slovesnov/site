const rows = 4;
function ev() {
	for (i = 0; i < rows; i++) {
		try {
			n = eval(el('n' + i).value)
			p = eval(el('p' + i).value)
			v = formatNonZero(1 - (1 - n) / p, 3)
		}
		catch {
			v = '?'
		}
		el('o' + i).innerHTML = v
	}
}

function load() {
	s = '<table><tr><th>начальная влажность n<th>остаток p<th>конечная влажность 1-(1-n)/p'
	for (i = 0; i < rows; i++) {
		if (i) {
			s += '<br>'
		}
		s += `<tr><td><input type="text" id="n${i}" value=".91" oninput="ev()"><td><input type="text" id="p${i}" value=".1" oninput="ev()"><td><span id="o${i}"></span>`
	}
	el('p').innerHTML = s + '</table>'
	ev()
}

function formatNonZero(v, digits) {
	return formatNumber(v, v == 0 ? digits : Math.max(Math.floor(-Math.log10(v)) + 1, digits));
}
