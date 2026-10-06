lng = gLanguage == 'russian' ? ['белки', 'жиры', 'углеводы', 'ккал/кг/день', 'г/кг/день'] :
	['protein', 'fat', 'carbohydrates', 'kcal/kg/day', 'g/kg/day']

//https://51.rospotrebnadzor.ru/content/809/59947/
pfcd = [[1, 1, 4], [1, 1.2, 4], [30, 30, 40, 29], [15, 30, 55, 29]]
pfc = [4, 9, 4]

function load() {
	a = []
	const t = pfcd.length;
	for (i = 0; i < t; i++) {
		a.push(ta(i))
	}
	el('p').innerHTML = a.join('<hr>');
	for (i = 0; i < t; i++) {
		recount(i)
	}
}

function getType(id) {
	return +(pfcd[id].length == 4)
}

function ta(id) {
	tn = [lng.slice(-1), '%']
	const type = getType(id)
	let s = '<table style="text-align: center;"><tr><td>' + implode(lng.slice(0, -1), '<th>') + '<tr><th>' + tn[type]
	let i = 0, j
	pfcd[id].forEach((e, j) => {
		if (type && j == 2) {
			s += '<td id="' + id + (i++) + '">' + e
		}
		else {
			s += '<td><input type="text" id="' + id + (i++) + '" size="7" value="' + e + '" oninput="recount(' + id + ')">'
		}
	})
	if (!type) {
		s += '<td id="' + id + (i++) + '">'
	}
	s += '<tr><th>' + tn[+!type]
	for (j = 0; j < 3; j++) {
		s += '<td id="' + id + (i++) + '">'
	}
	return s + `<td><button class="comboboxbutton" style="margin-left:2px;" onclick="buttonClick(${id})"><img src="../img/jm/copy16.png"></button></table>`
}

function getValues(id, type) {
	let a = [], i, v;
	for (i = 0; i < 3 + type; i++) {
		v = el2(id, i)

		if (v.nodeName == 'TD') {
			v = 100 - a[0] - a[1]
			if (v <= 0) {
				break
			}
			a.push(v)
			continue;
		}

		try {
			//eval('')=undefined
			v = eval(v.value)
			//isFinite(+-Infinity or NaN or undefined)=false
			if (v <= 0 || !isFinite(v)) {
				break
			}
			a.push(v);
		}
		catch {
			break
		}
	}
	return a
}

function recount(id) {
	const type = getType(id)
	let v = getValues(id, type), c, i, s
	//console.log(type,el2(id,2).nodeName)
	const ok = v.length == 3 + type;
	if (ok) {
		c = v.reduce((a, e, i) => a + e * pfc[i], 0)
	}
	const n = 3;
	el2(id, n).innerHTML = ok ? normalize(c, 2) : '?'
	if (type) {
		//v.length>2 mass set invalid but carbohydrates is ok
		el2(id, 2).innerHTML = v.length > 2 ? formatNumber(v[2], 2) : '?'
	}
	for (i = 0; i < 3; i++) {
		s = ok ? normalize(type ? v[i] * v[3] / 100 / pfc[i] : pfc[i] * v[i] * 100 / c, 2) : '?'
		el2(id, n + i + 1).innerHTML = s + (type ? '' : '%')
	}
}

function el2(a, b) {
	return el(a + '' + b)
}

function buttonClick(id) {
	n = id < 2 ? 2 : 0
	for (i = 0; i < (n == 2 ? 2 : 3); i++) {
		el2(n, i).value = el2(id, i + 4).innerHTML.replace('%', '')
	}
	recount(n)
}