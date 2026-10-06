lng = gLanguage == 'russian' ? ['плотность арбуза', 'общий объём'
	, 'объём без корок', 'объём корок'
	, 'входные параметры', 'результаты', 'масса арбуза', 'толщина корки'
	, 'см', 'г', 'кг', 'л', 'г/см³', 'длина окружности', 'диаметр'
	, "<i>Примечания.</i><ol><li>Можно вставлять текст с данными в документ и тогда он автоматически распарсится, например, '3432, 64.5, 64.5, 56.5, 1.1' или '3432 64.5 64.5 56.5' или '3432 64.5 56.5'.<li>Лучше использовать длину окружности, а не диаметр, иначе получаются сильно неправильные результаты.</ol>", 'г или кг определяется автоматически'
]
	: ['watermelon density', 'total volume'
		, 'volume without peels', 'volume of peels'
		, 'input parameters', 'results', 'watermelon mass', 'peel thickness'
		, 'cm', 'g', 'kg', 'l', 'g/cm³', 'circle length', 'diameter'
		, "<i>Notes.</i><ol><li>You can paste text with data into a document and then it will automatically parse, for example, '3432, 64.5, 64.5, 56.5, 1.1' or '3432 64.5 64.5 56.5' or '3432 64.5 56.5'.<li>It is better to use the circle length rather than the diameter, otherwise you get badly wrong results.</ol>", 'g or kg is determined automatically'
	]
ar = ['result', 'v', 'vnp', 'vp']
a1 = ['m', 'a', 'b', 'c', 'k']
values = [3432, 64.5, 64.5, 56.5, .4]//.865
//values = [4216, 68, 68, 61, .4] //9.5*pi*25^2/4=4663.301595172349153 0.987
//3432  64.5  56.5
//4216 68 61
//values = [9000, 81, 81, 81, 1.1]
in_params = 4
results = 5
mass = 6
cm = mass + 2
gram = cm + 1
kg = gram + 1
liter = kg + 1
gcm3 = liter + 1
note = gcm3 + 3
noteGKG = note + 1

function onp(e) {
	//console.log(e)
	e.stopPropagation()
	e.preventDefault()
	let s = e.clipboardData.getData('Text')
	let a = s.split(/,?\s+/)
	if (a.length < 3 || a.length > 5) {
		return;
	}
	a = a.map(e => Number(e))
	if (a.some(e => isNaN(e) || e<=0)) {
		return;
	}
	// console.log(a.length,a)
	if (a.length == 3) {
		a.splice(1, 0, a[1])
	}
	if (a.length == 4) {
		a.push(values[values.length - 1])
	}
	a1.forEach((e, i) => el(e).value = a[i])
	paramschanged()
}

function load() {
	document.addEventListener('paste', onp);
	tr = '<tr><td style="padding-right:5px;">'
	//sp=' &nbsp;  &nbsp; '
	o = {
		m: lng[noteGKG],
		a: '<label><input type="checkbox" style="vertical-align:middle;" checked="checked" onclick="paramschanged()" id="ab_check">a = b</label>',
		b: re(lng.slice(note - 2, note), 'a, b, c', 'lenMeasure')
	}
	el('p').innerHTML = '<table><tr><td colspan=2><h4>' + lng[in_params] + '</h4>' +
		[lng[mass], '', '', '', lng[mass + 1]].reduce((a, e, i) => {
			j = a1[i]
			//console.log(e)
			return a + tr + (i > 0 && i < 4 ? j : e) + '<td' + (j == 'b' ? ' id="tb"' : '') + '><input type="text" id="' + j + '" style="width:70px" onkeyup="paramschanged()" value="' + values[i] + '" onpaste="onp(event)">'
				// onpaste="onp(event)" allow paste in text field
				+ '<td style="padding-right:25px;">'
				+ (j == 'm' ? '<span id="massm"></span>' : lng[cm])
				+ '<td>' + (o[j] || '')
		}, '')
		+ '</table>'
		+ '<h4>' + lng[results] + '</h4>'
		+ lng.slice(0, in_params).reduce((a, e, i) => a + tr + e + '<td id="' + ar[i] + '"><td>' + lng[i ? liter : gcm3], '<table>') + '</table>'
		+ '<p style="width:500px">' + lng[note]
	paramschanged()
}

function paramschanged() {
	el('b').disabled = el('ab_check').checked

	if (el('ab_check').checked) {
		el('b').value = el('a').value
	}

	try {
		a1.forEach(e => {
			i = Number(el(e).value)
			// i = eval(el(e).value)
			if (isNaN(i) || i <= 0) {
				throw 1
			}
			if (e == 'm') {
				b = i > 100
				if (b) {
					i /= 1000;
				}
				el('massm').innerHTML = lng[b ? gram : kg]
			}
			else if (e != 'k') {
				i /= 2 * (el('lenMeasure').selectedIndex == 0 ? Math.PI : 1)
			}
			window[e] = i
		})
		volume = ellipsoidVolume(a, b, c)
		volume1 = ellipsoidVolume(a, b, c, k)
		r = [m / volume, volume, volume1, volume - volume1]
	}
	catch (e) {
		r = new Array(4).fill('?');
		console.log(e)
	}

	r.forEach((e, i) => el(ar[i]).innerHTML = typeof e == 'string' ? e : e.toFixed(3))
}

function ellipsoidVolume(a, b, c, k = 0) {
	return 4 / 3 * Math.PI * (a - k) * (b - k) * (c - k) / 1000
}

function re(a, sp, id) {
	return a.reduce((a, e) => a + `<option>${e}</option>`, sp + ` <select id="${id}" onchange="paramschanged()">`) + `</select>`
}
