T = ['цена', 'объём', '%']
ROWS = 10

function load() {
	t = el("t")
	for (i = 0; i < ROWS; i++) {
		r = t.insertRow(-1)
		r.innerHTML = T.reduce((a, e, j) => a + `<td><input type="text" id="${'t' + i + j}" oninput="com()" placeholder="${e}">`
			, '<tr>') + `<td><span id="s${i}" style="margin-left:5px"></span>`
	}

	/*
	1л 9% 52.39
	52.39/9 = 5.821111111111112
	52.39/(1000*9/100) = 0.582111111111111
	https://www.globus.ru/products/728921_ST/
	70 % 170 мл 41.89
	41.89/.17/70 = 3.5201680672269
	*/
/*
	a = [52.39, 1, 9, 41.89, .17, 70, 52.39, 1, 9, 41.89, .17, 70]
	for (i = 0; i < a.length / T.length; i++) {
		for (j = 0; j < 3; j++) {
			el('t' + i + j).value = a[i * 3 + j]
		}
	}
	// */
	com()
}

function com() {
	a = []
	min = Infinity
	for (i = 0; i < ROWS; i++) {
		for (j = 0; j < 3; j++) {
			e = el('t' + i + j)
			ev = e.value
			try {
				if (ev.length == 0) {
					throw 0
				}
				v = eval(ev)
				if (!isFinite(v)) {
					throw 1
				}
				e.style.backgroundColor = ''
			}
			catch (ex) {
				v = NaN;
				e.style.backgroundColor = ex ? 'red' : ''
			}
			//t=P/(V*C/100) руб/мл
			if (j == 0) {
				t = v * 100
			}
			else {
				t /= v
			}
		}
		a.push(t)
		if (t < min) {
			min = t;
		}
		el('s' + i).innerHTML = isNaN(t) ? '?' : formatNumber(t, 1)
	}
	//can be several minimums
	a.forEach((e,i) => el('s' + i).style.backgroundColor = e == min ? '#0f0' : '');
}
