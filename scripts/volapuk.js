gt = [
	['A', 'a', '6', '6', 'B', 'B', 'r', 'r', 'g', 'g', 'E', 'e', 'E', 'e', 'ZH', 'zh', '3', '3', 'U', 'u', 'U', 'u', 'K', 'k', '/|', '/|', 'M', 'M', 'H', 'H', 'O', 'o', 'n', 'n', 'P', 'p', 'C', 'c', 'T', 'm', 'y', 'y', 'F', 'f', 'X', 'x', 'U', 'u', '4', '4', 'W', 'w', 'W', 'w', 'b', 'b', 'bl', 'bl', 'b', 'b', 'E', 'e', 'lO', 'lo', 'q', 'q']
	//ËëÛû - french language
	//⋏λ 
	, ['A', 'α', '6', '6', 'B', 'ϐ', 'Γ', 'r', 'Δ', 'g', 'E', 'ϵ', 'Ë', 'ë', 'Ж', 'ж', '3', '3', 'U', 'u', 'Û', 'û', 'K', 'ϰ', 'Λ', '⋏', 'M', 'm', 'H', 'H', 'O', 'o', 'Π', 'n', 'P', 'p', 'C', 'c', 'T', 'm', 'y', 'y', 'Φ', 'φ', 'Χ', 'χ', 'U', 'u', 'Ч', 'ч', 'W', 'ω', 'W', 'ω', 'b', 'b', 'bl', 'bl', 'b', 'b', '∋', '∍', 'Ю', 'ю', 'Я', 'я']

	, ['a', 'b', 'v', 'g', 'd', 'e', 'yo', 'zh', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'ts', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'iu', 'ia'].map(e => [e.toUpperCase(), e]).flat()

]
gm = []
const SI = gt.length

function load() {
	s1 = "йцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ";
	s2 = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>~";

	f = [...s1].sort((a, b) => {		
		v = a.localeCompare(b)
		return a.toUpperCase() == b.toUpperCase() ? -v : v
	})

	gt.forEach(e => {
		m = new Map()
		f.forEach((c, j) => m.set(c, e[j]))
		gm.push(m)
	})

	a = [...s1].map((e, i) => [s2[i], e])

	m = new Map(a.sort((a, b) => {
		al = a[0].match(/[a-z]/i) !== null
		bl = b[0].match(/[a-z]/i) !== null
		if (al == bl) {
			return a[0].localeCompare(b[0])
		}
		return bl ? 1 : -1
	}))
	gm.push(m)
	// console.log(f,m.keys())

	s = '<tr><td colspan="8">' + ['copy', 'refresh'].reduce((a, e) => a + `<button class='comboboxbutton' onclick='cc()'><img src='img/jm/${e}16.png'></button> `, '') + "<span id='type'></span>"
	for (j = 0; j < 17; j++) {
		s += '<tr>'
		for (i = 0; i < (j == 0 ? 2 : 4); i++) {
			l = (i < 2 ? i : i + 30) + j * 2
			s += `<td id="f${l}"><td><input type="text" style="width:24px" id="i${l}" oninput=ut(${l})>`;
		}
	}
	el('t').innerHTML = s

	combo = new Combobox('type', 1, 'латиница', 'utf8', 'транслит', 'раскладка'
		, reset)
	reset()
}

function reset() {
	n = combo.getIndex();
	e = el("in");
	e.placeholder = n == SI ? 'Ddtlbnt ntrcn lkz gthtrjlbhjdfybz' : 'Введите текст для перекодирования';
	[...gm[n].keys()].forEach((e, i) => el('f' + i).innerHTML = e)
	ge = [...gm[n].values()].slice()
	ge.forEach((e, i) => el("i" + i).value = e)
	ena()
	e.focus();
}

function ut(i) {
	ge[i] = el("i" + i).value
	ena()
}

function ena() {
	en(0)
	en(1)
}

function en(o) {
	e = el("in");
	e = o ? e.placeholder : e.value
	m = gm[combo.getIndex()]
	s = [...e].reduce((a, e) => a + (m.get(e) ?? e), '')

	e = el("out");
	if (o) {
		e.placeholder = s
	}
	else {
		e.value = s
	}
}

function cc() {
	navigator.clipboard.writeText(el('out').value).then(
		() => {
			// console.log('ok')
		}
		, () => {
			// console.log('error')
		}
	)
}
