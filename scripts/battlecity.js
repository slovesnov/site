let gimage = [], gstate = [];
function load() {
	let tanks = [18, 2, 0, 0, 14, 4, 0, 2, 14, 4, 0, 2, 2, 5, 10, 3, 8, 5, 5, 2, 9, 2, 7, 2, 10, 4, 6, 0, 7, 4, 7, 2, 6, 4, 7, 3, 12, 2, 4, 2, 0, 10, 4, 6, 0, 6, 8, 6, 0, 8, 8, 4, 0, 4, 10, 6, 2, 10, 0, 8, 16, 2, 0, 2, 8, 2, 8, 2, 2, 8, 6, 4, 4, 4, 4, 8, 2, 8, 2, 8, 6, 2, 8, 4, 6, 8, 2, 4, 0, 10, 4, 6, 10, 4, 4, 2, 0, 8, 2, 10, 4, 6, 4, 6, 2, 8, 2, 8, 15, 2, 2, 1, 0, 4, 10, 6, 4, 8, 4, 4, 0, 8, 6, 6, 6, 4, 2, 8, 0, 8, 4, 8, 0, 10, 4, 6, 0, 6, 4, 10]

	let i, j, k, s = '', q, a = [], b = []

	let sum = [0, 0, 0, 0], mn = [20, 20, 20, 20], mx = [0, 0, 0, 0]
	for (i = 0; i < 35; i++) {
		for (j = 0; j < 4; j++) {
			k = tanks[i * 4 + j]
			sum[j] += k
			if (mn[j] > k) {
				mn[j] = k
			}
			if (mx[j] < k) {
				mx[j] = k
			}
		}
	}
	let o = el('battlecity');
	k = '<table width="100%">'
	for (i = 1; i < 36; i++) {
		j = i + '/' + (i + 35)
		q1 = (gMobile ? '' : 'Уровень ') + j;
		q = 'Уровень ' + j;
		if (i % 5 == 1) {
			k += '<tr>'
		}
		k += '<td><a href="#l' + i + '">' + q1 + '</a>'

		j = new Image();
		gimage.push(j);
		gstate.push(0);
		//use closure to store parameter
		j.onload = ((id) => () => {
				let c = el("c" + id);
				let i = gimage[id]
				c.width = i.width;
				c.height = i.height;
				c.getContext("2d").drawImage(i, 0, 0);
		})(i - 1);
		j.src = "img/battlecity/level" + i + ".png";

		s += '<h4 id="l' + i + '">' + q + '</h4><p><table><tr><td><canvas id="c' + (i - 1) + '" onclick="changeImage(this)">'
		aa = gMobile ? '' : 'уровень'
		s += '<td><table class="single">'
		if (gMobile) {
			s += '<tr><td><td colspan=2>уровни'
		}
		s += '<tr><td><b>' + (gMobile ? '&nbsp;&nbsp;&nbsp;' : 'число танков') + '</b><td>' + aa + i + '<td>' + aa + (i + 35)
		for (j = 0; j < 4; j++) {
			s += '<tr><td><img src="img/battlecity/tank' + j + '.png"><td>' + tanks[(i - 1) * 4 + j] + '<td>' + tanks[34 * 4 + j]
		}
		s += '</table></table>'
	}
	k += '<tr><td><a href="#statistics">Статистика</a><td><a href="#other">Прочее</a><td><a href="#anthem">Гимн игры</a><td colspan=2><a href="?battlecity_levels">Отгадывание уровней игры</a>'
	k += '</table>'
	k += '<p>Для того, чтобы увидеть места появления призов, нажмите на одну из картинок уровня. Чтобы вернуть нормальный вид, нажмите на нее еще раз.'
	s += '</table>'
	o.innerHTML = k + s

	s = '<h4 id="statistics">Статистика</h4><p><table class="single"><tr><td><td>уровни 1-35<td>уровни 1-70<tr><td>всего танков / процент'
	for (j = 0; j < 4; j++) {
		a[j] = (sum[j] / 7).toFixed(2) + '%'
	}
	s += h(sum, a)

	for (j = 0; j < 4; j++) {
		a[j] = (sum[j] + 35 * tanks[34 * 4 + j])
		b[j] = (a[j] / 14).toFixed(2) + '%'
	}
	s += h(a, b)

	s += '<tr><td>минимум / максимум / среднее'

	for (j = 0; j < 4; j++) {
		a[j] = (sum[j] / 35).toFixed(2);
	}
	s += h(mn, mx, a)

	for (j = 0; j < 4; j++) {
		a[j] = ((sum[j] + 35 * tanks[34 * 4 + j]) / 70).toFixed(2)
	}
	s += h(mn, mx, a)

	s += '<tr><td>частота встречаемости на уровнях'
	for (j = 0; j < 4; j++) {
		sum[j] = 0;
	}
	for (i = 0; i < 35; i++) {
		for (j = 0; j < 4; j++) {
			if (tanks[i * 4 + j] != 0) {
				sum[j]++;
			}
		}
	}
	for (j = 0; j < 4; j++) {
		a[j] = sum[j] + '/35'
		b[j] = (sum[j] * 100 / 35).toFixed(2) + '%'
	}
	s += h(a, b)

	for (j = 0; j < 4; j++) {
		if (j != 0) {
			sum[j] += 35;
		}
		a[j] = sum[j] + '/70'
		b[j] = (sum[j] * 100 / 70).toFixed(2) + '%'
	}
	s += h(a, b)

	s += '</table>'
	o.innerHTML += s

	s = '<p><table class="single"><tr><th>уровень'
	for (j = 0; j < 4; j++) {
		s += '<td><img src="img/battlecity/tank' + j + '.png">'
	}

	for (i = 0; i < 35; i++) {
		s += '<tr><td>' + (i == 34 ? '&ge;' : '') + (i + 1)
		for (j = 0; j < 4; j++) {
			s += '<td>' + tanks[i * 4 + j]
		}
	}
	s += '</table>'
	o.innerHTML += s

}

function h(a, b, c) {
	let j, s = '<td><table>'
	for (j = 0; j < 4; j++) {
		s += '<tr><td style="border:0"><img src="img/battlecity/tank' + j + '.png">' + a[j] + ' ' + b[j]
		if (c !== undefined) {
			s += ' ' + c[j]
		}
	}
	return s + '</table>'
}

function changeImage(o) {
	c = el(o.id);
	id = o.id.substring(1)
	ctx = c.getContext("2d");
	if (gstate[id] == 0) {
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 1;
		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
				//use 48.5 otherwise real line width 2
				ctx.rect(48.5 + 96 * i, 48.5 + 96 * j, 32, 32);
			}
		}
		ctx.stroke();
	}
	else {
		ctx.drawImage(gimage[id], 0, 0);
	}
	gstate[id] = !gstate[id]
}