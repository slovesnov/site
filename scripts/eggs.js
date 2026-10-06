/* 6999/611=11.454991816693944
69.99 roubles for ten eggs
6.99  roubles for one egg
one egg mass grams 61.1
roubles/gram 6.99/61.1=6.99/61.1=0.114402618657938
so 6999/611=11.454991816693944 is kopeks/g (6999 - price in kopeks)

inputs can be be >= categories or <categories
*/
const cname = ['СО', 'С1', 'С2']
const mass = [611, 552, 462]
const categories = mass.length
const inputs = categories
const mic = Math.max(inputs, categories)

function load() {
	t = el("t")
	for (i = 0; i < categories; i++) {
		for (j = 0; j < mic; j++) {
			v = '<td>'
			if (j < inputs) {
				v += '<input type="text" id="t' + i + j + '" oninput="com()" placeholder="введите цену ' + cname[i] + '">'
				//Note eval("0611")!=611 because it's octal number, so set initial value to empty string
			}
			if (j == 0) {
				v += '<td rowspan=' + mic + '>/' + mass[i] + '=<td rowspan=' + mic + '>'
			}
			r = t.insertRow(-1)
			r.innerHTML = v + '<td>'
			r.style.backgroundColor = dc(i)
		}
	}
	com()
}

function dc(i) {
	return i % 2 ? 'Azure' : 'Beige'
}

function com() {
	b = []
	t = el("t");
	const f = (i) => t.rows[i * mic].cells[2];

	for (i = 0; i < categories; i++) {
		c = []
		for (j = 0; j < inputs; j++) {
			ev = el('t' + i + j).value
			v = Infinity
			if (ev.length != 0) {
				try {
					v = eval(ev) / mass[i]
				}
				catch {
				}
			}
			c.push(v);
		}
		const f1 = (n) => el('t' + i + n)
		v = st(c, f1)
		b.push(v)
		f(i).innerHTML = v == Infinity ? '?' : v.toFixed(3)

		for (j = 0; j < categories; j++) {
			k = v * mass[j];
			t.rows[i * mic + j].cells[j == 0 ? 3 : 1].innerHTML =
				cname[j] + '&thickapprox;' + (v == Infinity ? '?' : k.toFixed(2))
			//k.toFixed(k>1000?0:2)
		}
	}
	st(b, f);
}

function st(b, f) {
	let m = Math.min(...b)
	b.forEach((e, i) => {
		let el = f(i)
		let style = el.style, s;
		if (el.tagName == 'INPUT') {
			s = 'transparent';
			if (e == Infinity) {
				style.color = 'red';
			}
			else {
				style.color = 'black';
				if (e == m) {
					s = '#0f0';
				}
			}
		}
		else {
			s = e == m && m != Infinity ? '#0f0' : '';
		}
		style.backgroundColor = s;
	})
	return m
}
