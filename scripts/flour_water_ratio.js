q = (a, b) => `${a}<sub>${b}</sub>`
f = (a, b) => `<span class="fracb"><span>${a}</span>${b}</span>`
r = (a, b = a) => `<a href="${a}">${b}</a>`
ev = s => {
	try {
		let s1 = s.replace(/&frac(\d)(\d);/g, '($1/$2)')
		return eval(s1)
	}
	catch {
		return NaN
	}
}
function load() {
	const eggmass = 61.1
	el('p').innerHTML = [f(q('m', 'м'), q('m', 'в'))
		+ ' = ' + f(q('&rho;', 'м') + q('v', 'м'), q('&rho;', 'в') + q('v', 'в'))
		+ ' = ' + f(2 + q('v', 'м'), 3 + q('v', 'в'))
		, f(q('v', 'м'), q('v', 'в')) + ' = ' + f(3 + q('m', 'м'), 2 + q('m', 'в'))
		, q('&rho;', 'м') + ' = ' + f(2, 3) + ' ' + f('г', 'см&sup3;')
		, q('&rho;', 'в') + ' = ' + '1 ' + f('г', 'см&sup3;')
	].join('<span style="margin-left:40px"></span>')+'<p id="t"></p>'

	t = ['продукт', 'мука', 'вода|молоко', 'яйцо'
		, f(q('m', 'м'), q('m', 'в') + '+' + q('m', 'я'))
		, f(q('v', 'м'), q('v', 'в') + '+' + q('v', 'я'))
		, f(q('m', 'м'), q('m', 'в'))
		, f(q('v', 'м'), q('v', 'в'))
		, 'источник','примечание']
	a = []
	d = [
		['лапша', 200, 100, '-', r('?noodles','мой рецепт'),'3ст муки/ст воды']
		, ['оладьи', 200, 200, '-', '<a href="?pancakes">мой рецепт</a>','1.5ст муки/ст воды']
		//по идее рецепт теста на чебуреки, пельмени и вареники одинаковый
		, ['чебуреки, пельмени, вареники', 300, 150, '-', r('?chebureki','мой рецепт'),'3ст муки/ст воды']
		, ['пироги', 340, 200, '-', r('?calorie_recipe','мой рецепт'),'2.5ст муки/ст воды']
		//https://www.youtube.com/watch?v=YHrAUCUe41I
		, ['блины', '1.5 стакана', '2 стакана', 2,r('?texts_recipe#pan','мой рецепт'),'0.6ст муки/ст воды']//2
		, ['кляр для рыбы', '1.5 стакана', '1 стакан', 2, '-' /*r('https://www.youtube.com/watch?v=UHjO2OBlnp0', 'кулинарим с таней')*/,'1ст муки/ст воды']
		, ['кляр для рыбы', '1.5 стакана', '1.5 стакана', '-', '-' /*r('https://www.youtube.com/watch?v=UHjO2OBlnp0', 'кулинарим с таней')*/,'1ст муки/ст воды']
		// , ['блины на опаре', 1000, '6 стаканов', 2, 'книга о вкусной и здоровой пище страница 305 (280)']
		// , ['блины скороспелые', 500, '3 стакана', 2, 'книга о вкусной и здоровой пище страница 308 (281)']
		// , ['блины алина фуди', 150, 500, 2, r('https://www.youtube.com/watch?v=b5q5n1wUE18')]
		// , ['блины елена попова', 400, 1000, 2, r('https://www.youtube.com/watch?v=nmBehmogCPo')]
		//, ['пельмени', '1.5 стакана', '&frac14; стакана', 1, 'книга о вкусной и здоровой пище страница 116 (103)']
		//, ['пельмени фуди', 500, '1 стакан', 1, r('https://www.youtube.com/watch?v=UHjO2OBlnp0')]
		//вареники с творогом
		//, ['вареники', '2 стакана', '&frac12; стакана', 1, 'книга о вкусной и здоровой пище страница 283 (257)']
		//вареники с творогом
		// , ['вареники фуди', 330, 150, 1, r('https://www.youtube.com/watch?v=D2us15bN6uA')]
		/*same with previous line, ['вареники с вишней фуди', 250, 100, 1, r('https://www.youtube.com/watch?v=mdLCoE-CCxA')]*/
	].map(e => {
		//a[0]/a[1] a[2]/a[3]
		b = typeof e[1] == 'string' && e[1].includes('стакан') && typeof e[2] == 'string' && e[2].includes('стакан')
		zeroEggs = typeof e[3] == 'string' || e[3] == 0
		for (i = 0; i < 4; i++) {
			v = e[i % 2 ? 2 : 1]
			if (typeof v == 'number') {
				a[i] = v
			}
			else {
				v = v.replace(/\s*стакан(а|ов)?/u, '')
				c = b && (i > 1 || zeroEggs)
				a[i] = (v == 1 ? '' : v + (c ? '' : '*')) + (c ? '' : 250) + (i % 2 ? '' : '*&frac23;')
			}
			if (i == 1 && !zeroEggs) {
				a[i] += '+' + (e[3] == 1 ? '' : (e[3] + '*')) + eggmass
			}
		}
		a = a.map((e, i, a) => {
			if (typeof e == 'string' && e.match(/^&frac\d{2};$/) || a[i + 1] == '') {
				return e;
			}
			v = Number(e)
			return isNaN(v) ? '(' + e + ')' : v
		})
		b = []
		for (i = 0; i < 2; i++) {
			v = a[2 * i + 1]
			s = a[2 * i] + (v == '' ? '' : '/' + v)
			k = ev(s)
			f = typeof a[0] == 'string' || typeof v == 'string'
			b.push([(f ? s + '=' : '') + formatNumber(k, 2), k], formatNumber(k * 1.5, 2))
		}
		for (i = 1; i < 3; i++) {
			if (typeof e[i] == 'string') {
				v = e[i].replace(/\s*стакан(а|ов)?/u, '')
				if (v != e[i]) {
					q = ev(v) * 250 * (i == 1 ? 2 / 3 : 1)
					e[i] = [e[i] + '=' + formatNumber(q, 1), q]//for sort
				}
			}
		}
		e.splice(4, 0, ...b)
		if (typeof e[3] == 'string') {//zero eggs for sort
			e[3] = [e[3], 0]
		}
		//комментарий
		e[9]=[e[9],parseFloat(e[9])]
		return e
	})
	el('t').innerHTML = new Table(t, d, "scbr").html()
}