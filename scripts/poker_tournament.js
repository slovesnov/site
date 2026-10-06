function load() {
	com(0, 0);
	com(1, 0);
}

function com(i, v) {
	r = el("rake" + i)
	try {
		p = eval(el("prize" + i).value);
		b = eval(el("bi" + i).value);
		if (v == 1) {
			if (b == 2 || b == 3 || b == 5 || b == 10 || b == 20 || b == 30) {
				r.value = b / 10;
			}
			else if (b == 11) {
				r.value = 1;
			}
			else if (b == 22 || b == 24) {
				r.value = 2;
			}
			else if (b == 50 || b == 100) {
				r.value = 0.08 * b;
			}
			else if (b == 150) {
				r.value = 12;
			}
			else if (b == 300) {
				r.value = 20;
			}
			else if (b == 500) {
				r.value = 25;
			}
		}
		s = Math.round(p / b * 100) / 100 + " " + Math.round(p / (b + eval(r.value)) * 100) / 100;
	}
	catch {
		r.value = '?'
		s = '? ?'
	}
	el("calc" + i).rows[5].cells[1].innerHTML = s;
}

function sel(i) {
	el("bi" + i).value = el("bis" + i).value;
	com(i, 1);
}
