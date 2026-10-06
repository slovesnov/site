const pf = 1//белки/(жиры+4углеводы/9)
const pfc = ['белки', 'жиры', 'углеводы']
const title = ['название продукта', ...pfc, 'ккал', 'b12', 'клетчатка', ...pfc.map(e => `%${e[0]}`)]
const checkTitle = ['все продукты', 'животные продукты и грибы', 'растительные продукты', 'растения', 'крупы/хлеб', '1']
const cal = [4, 9, 4]

function load() {
	if (pf) {
		title.push(pfc[0][0] + `/(${pfc[1][0]}+4${pfc[2][0]}/9)`)
	}
	fetchpost('../php/goods_statistics.php', {}, callback)
}

function callback(s) {
	ok = 1
	try {
		a = JSON.parse(s);
		gUser = a[0]
		const l = title.length - 1
		d = a[1].map(e => {
			e[6] = se.reduce((a, q, i) => a | (q.includes(e[0])) << (i + 2), 1 << !e[6])
			k = cal.reduce((a, k, i) => a + k * e[i + 1], 0)
			e.splice(6, 0, ...cal.map((a, i) => k == 0 ? '0/0' : a * 100 * e[i + 1] / k))
			e.splice(4, 0, k)
			if (pf) {
				k = e[2] + 4 * e[3] / 9
				e.splice(l, 0, k == 0 ? e[1] + '/0' : e[1] / k)
			}
			//need special proceed for water k=0, for good sort ['0/0',-1]
			return e.map((e, i) => i ? (typeof e == 'number' ? [formatNumber(e, i == l ? 2 : 1), e] : [e, -1]) : e)
		})
		q = ['\\&rarr;|', '<img src="../img/en.gif">&rarr;<img src="../img/ru.gif">'].map((e, i) => `<label style='margin-left:20px'>замена ${e}<input type='checkbox' id='${'cl'[i]}filter' checked onclick='updateTable()' style='vertical-align: middle;'></label>`).join('') + `<span style='margin-left:20px'>логин: ${gUser}</span>`
		s = `<input type='text' id='filter' placeholder='фильтр регулярное выражение' oninput='updateTable()' style='width: 200px;'>${q}<br>`
		gtable = new Table(title, d, "cnbs")
		if (gUser == 'slovesno') {
			s += checkTitle.reduce((a, e, i) => a + `<label><input type="radio" name="rad" onclick="updateTable();"${(i ? '' : ' checked="checked"')} style="vertical-align: middle;margin-top: -1px;" />${e}</label>`, ``)
		}
		s += gtable.html()
	}
	catch (ex) {
		ok = 0
		s += '<br>' + ex
	}
	el('p').innerHTML = s
	if (ok)
		el('filter').focus()
}

function replace(s) {
	return s.replace(/ё/gi, 'е')
}

function updateTable() {
	c = el('filter')
	try {
		v = c.value
		if (el('cfilter').checked) {
			v = v.replaceAll('\\', '|')
		}
		if (el('lfilter').checked) {
			const KEYR = 'йцукенгшщзхъфывапролджэячсмитьбюё';
			const KEYE = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`';
			const R = KEYR + KEYR.toUpperCase()
			const E = KEYE + KEYE.toUpperCase();
			v = [...v].map(e => {
				i = E.indexOf(e)
				return i == -1 ? e : R[i]
			}).join('')
			c.value = v
		}
		r = replace(v)
		grfilter = new RegExp(r, 'iu')
		c.style.color = 'black';
	}
	catch (e) {
		grfilter = new RegExp('', 'iu');//every string match
		c.style.color = 'red';
	}
	gindex = [...document.querySelectorAll('input[name="rad"]')].findIndex(e => e.checked)
	gtable.filter(e => {
		b = (gindex == 0 || e[title.length].v & (1 << (gindex - 1))) && grfilter.test(replace(e[0].s))
		return b
	})
}

//till 20nov2025
const se = [
	['абрикос', 'авокадо', 'айва', 'ананас', 'апельсин', 'арбуз', 'баклажаны', 'бананы', 'боярышник', 'брокколи', 'виноград', 'гранат', 'грейпфрут', 'груша', 'дыня', 'инжир свежий', 'кабачки', 'калина', 'капуста', 'картофель', 'киви', 'кукуруза', 'лимон', 'лук', 'малина', 'манго', 'мандарин', 'морковь', 'нектарины', 'огурцы', 'оливки', 'перец болгарский', 'персик', 'питахайя', 'помело', 'ревень', 'редиска', 'редька зеленая', 'редька черная', 'свекла', 'слива', 'томаты', 'тыква', 'тыква мускатная', 'фейхоа', 'хурма', 'чеснок', 'яблоко']
	,
	[
		'картофель',
		'крупа кукурузная',
		'макароны',
		'пшено',
		'мука',
		'сухари черные',
		'крупа пшеничная',
		'перловка',
		'гречка',
		'рис',
		'манка',
		'геркулес',
		'горох',
		'батон традиционный',
		'хлеб белый',
		'батон арбатский',
		'хлеб черный',
		'сушки',
		'сухари белые'
	]
	,
	['абрикос',
		'айва',
		'ананас',
		'апельсин',
		'арбуз',
		'бананы',
		'гранат',
		'грейпфрут',
		'груша',
		'дыня',
		'инжир свежий',
		'киви',
		'кукуруза',
		'лук',
		'манго',
		'мандарин',
		'нектарины',
		'огурцы',
		'персик',
		'питахайя',
		'помело',
		'редиска',
		'слива',
		'томаты',
		'тыква мускатная',
		// 'фейхоа',
		'хурма',
		'яблоко']
]