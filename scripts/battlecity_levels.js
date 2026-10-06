function load() {
	t = el("t")
	CELLS = 5
	for (i = 0; i < 35; i++) {
		if (i % CELLS == 0) {
			r = t.insertRow(-1);
		}
		c = r.insertCell(-1);
		j = i + 1;
		k = j < 10 ? '0' + j : j;
		c.innerHTML = '<button class="comboboxbutton b" id="' + i + '" onclick="bclick(this)">' + k + '</button>'
	}
	r = t.insertRow(-1);
	c = r.insertCell(-1);
	c.id = "o";
	c.colSpan = CELLS
	bclick()
}

function cc() {
	j = el('deletion').checked
	for (i = 0; i < gstep; i++) {
		el(ga[i]).disabled = j
	}
}

let gstep, gguess, ga, gok, gbad
//input number changed calls bclick(0)
function bclick(e) {
	if (typeof e == 'undefined') {
		gstep = -1;
		gguess = 0;
		gbad = [];
		ga = makeArray(35, 1);
		for (i = 0; i < 35; i++) {
			el(i).disabled = false
		}
	}
	else if (e !== 0) {
		i = ga[gstep]
		if (gok = (i == parseInt(e.id))) {
			gguess++;
		}
		else {
			gbad.push(i + 1)
		}
	}
	if (e !== 0) {
		gstep++;
	}
	max = el('number').value
	if (max > 35 || max == '' || max == "0") {
		max = 35
	}
	pr = gguess * 100 / gstep
	p = gstep == 0 ? '?' : pr.toFixed(1)

	if (gstep == max) {
		if (pr < 60) {
			e = 2;
		}
		else if (pr < 80) {
			e = 3;
		}
		else if (pr < 90) {
			e = 4;
		}
		else {
			e = 5;
		}
		s = 'Тест закончен.\nУгадано ' + gguess + '/' + gstep + ' ' + p + '%.\nВаша оценка - ' + e + '.\n';
		if (gbad.length == 0) {
			s += 'Угаданы все уровни.'
		}
		else {
			s += 'Не угаданы уровни: ' + gbad;
		}
		alert(s)
		bclick()
	}
	else {
		j = ga[gstep] + 1
		el("i").src = "../img/battlecity/level" + j + ".png";
		s = 'шагов ' + gstep + '/' + max + '<br>угадано ' + gguess + '/' + gstep + ' ' + p + '%<br>последний '
		if (gstep == 0) {
			s += '-'
		}
		else {
			k = ga[gstep - 1]
			if (el('deletion').checked) {
				el(k).disabled = true
			}
			s += k + 1
			s += ' <img style="vertical-align:middle" src="../img/jm/' + (gok ? 'ok' : 'delete') + '.png">';
		}
		el("o").innerHTML = s
	}

}

//from bullscows.js
function makeArray(n, random) {
	let i, j, t, a = Array.from({ length: n }, (_, i) => i)
	if (random) {
		for (i = 0; i < n - 1; i++) {
			j = getRandom(n - i);
			if (j == 0) {
				continue;
			}
			j += i;
			[a[i], a[j]] = [a[j], a[i]]
		}
	}
	return a
}

//from bullscows.js
//return random [0..max)
function getRandom(max) {
	return Math.floor(Math.random() * max);
}
