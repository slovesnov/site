function com() {
	let r = [];
	["n", "k", "f"].forEach((e, i) => {
		j = 0
		try {
			v = el(e)
			vv = v.value
			//at least one digit, empty strings is error, "1,3" eval is ok but it's error
			if (!/\d/.test(vv) || vv.includes(',')) {
				throw 0;
			}
			window[e] = eval(vv);
			//only integer numbers are allowed & >=0
			if (window[e] < 0 || !Number.isInteger(window[e])) {
				throw 0;
			}
		}
		catch (ex) {
			j = 1
		}
		v.style.color = j ? "red" : "black";
		el('s' + e).innerHTML = j ? (i == 2 ? 'n' : e) : window[e]
		r[i] = j
	});

	l = gLanguage == 'russian' ? 'Формула Стирлинга' : 'Stirling\'s formula'
	l = "<br>" + l + " ";

	v = factorialStirling(f)
	el("of").innerHTML = r[2] ? "?" : formatString(factorial(f)) + l
		+ formatString(Math.round(v)) + " &asymp; " + v.toExponential(2);

	v = binomialStirling(k, n)
	//if do separator not space then no wrap for very big numbers
	el("o").innerHTML = (r[0] || r[1]) ? "?" : formatString(binomial(k, n)) + l
		+ formatString(Math.round(v)) + " &asymp; " + v.toExponential(2);
}

function binomial(k, n) {
	let r = 1n;
	for (let i = 1; i <= k; i++) {
		r *= BigInt(n - k + i);
		r /= BigInt(i);
	}
	return r;
}

function factorial(n) {
	let r = 1n;
	for (let i = 2; i <= n; i++) {
		r *= BigInt(i);
	}
	return r;
}

function factorialStirling(n) {
	return n == 0 ? 1 : Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
}

function binomialStirling(k, n) {
	return factorialStirling(n) / factorialStirling(k) / factorialStirling(n - k);
}
