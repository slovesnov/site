lng = gLanguage == 'russian' ? ['система счисления', 'число']
	: ['radix', 'number']

minRadix = 2
maxRadix = 36

function load() {
	el('p').innerHTML = '<table>'
		+ '<tr><th>' + lng[0] + '<td><input type="number" value="16" id="f" onkeyup="c()" onchange="c()" min="' + minRadix + '" max="' + maxRadix + '" style="width:100px">'
		+ '<td><input type="number" value="10" id="t" onkeyup="c()" onchange="c()" min="' + minRadix + '" max="' + maxRadix + '" style="width:100px">'
		+ '<tr><th>' + lng[1] + '<td><input type="text" value="FF.8" id="n" onkeyup="c()"><td id="o">'
		+ '</table>'

	c();
}

function c() {
	const c0 = '0'.charCodeAt(0)
	const c9 = '9'.charCodeAt(0)
	const ca = 'a'.charCodeAt(0)
	let s = el('n').value.toLowerCase(), i, j, n = 0
	f = Number(el('f').value)
	t = Number(el('t').value)
	a = s.split(/\./)

	let notValid = s => {
		let i, k
		for (i = 0; i < s.length; i++) {
			k = s.charCodeAt(i)
			if (k < c0 || k > c9 && k < ca) {
				return true
			}
			k -= k >= ca ? ca - 10 : c0
			if (k >= f) {
				return true
			}
		}
		return false
	}

	if (!Number.isInteger(f) || f < minRadix || f > maxRadix
		|| !Number.isInteger(t) || t < minRadix || t > maxRadix
		|| a.length > 2 || a.some(notValid)) {
		el('o').innerHTML = '?'
		return
	}

	s1 = a[0]
	for (i = s1.length - 1, j = 1; i >= 0; i--, j *= f) {
		k = s1.charCodeAt(i)
		k -= k >= ca ? ca - 10 : c0
		n += k * j
	}

	if (a.length > 1) {
		s1 = a[1]
		for (i = 0, j = 1 / f; i < s1.length; i++, j /= f) {
			k = s1.charCodeAt(i)
			k -= k >= ca ? ca - 10 : c0
			n += k * j
		}
	}

	el('o').innerHTML = n.toString(t);// + ' ' + toRadix(n, t);
}

function toRadix(n, radix) {
	let s = '';
	let i, j
	let k = Math.floor(n);
	n -= k;
	do {
		i = k % radix;
		k = Math.floor(k / radix);
		s = (i < 10 ? i : 'a'.charCodeAt(0) + i - 10) + s;
	} while (k);

	if (n == 0) {
		return s;
	}
	s += '.';

	j = 0;
	while (n != 0 && j < 25) {
		n *= radix;
		k = Math.floor(n);
		n -= k;
		//console.log(n)
		i = k % radix;
		s += (i < 10 ? i : 'a'.charCodeAt(0) + i - 10);
		j++
	}
	return s;
}
