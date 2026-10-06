let ge = [0, 15, 12, 9, 8, 6, 4];
let gmaxouts = 15;
function load() {
	let t = el("ct");
	let i, j, o;
	let c = ['#FFE4C4', '#E0FFFF', '#F4A460']

	for (i = 0; i < gmaxouts; i++) {
		o = t.insertRow(-1);
		for (j = 0; j < 5; j++) {
			ce = o.insertCell(-1)
			if (j == 0) {
				ce.innerHTML = (i + 1) + ' out' + (i > 0 ? 's' : '');
			}
		}
		ge.push(i + 1)
	}
	for (i = 0; i < c.length; i++) {
		t.rows[0].cells[i + 2].bgColor = c[i]
	}

	for (i = 1; i < t.rows.length; i++) {
		o = t.rows[i]
		for (j = 0; j < 3; j++) {
			o.cells[j + 2].bgColor = c[j]
		}
		if (i > 1) {
			o.cells[1].innerHTML = ge[i - 1].toString()
		}
	}

	callbankchanged()
}

function formatS(n) {
	let s = n.toString();
	if (s == '0' || s == 'NaN') {//s=NaN for empty 'bank' or 'e' field. NaN is case sensitive string
		return "error";
	}
	let i = s.lastIndexOf(".");
	return i == -1 ? s : s.substr(0, i + 3);
}

function trunc(a, b, bankChance, full) {
	if (bankChance < 0) {
		return "never"
	}
	let r = a + formatS(b / bankChance);
	if (full) {
		r += "<br>bankChance<nobr> " + formatS(bankChance) + "<br>equity " + equity(bankChance);
	}
	return r
}

function equity(bankChance) {
	return formatS(100 / (1 + bankChance)) + "%";
}

function scutcall(o, i, p, b) {
	o.cells[i].innerHTML = trunc("call&lt;", b, (1 - p) / p, true) + '<br>' + trunc("cut&gt;", b, (1 - 2 * p) / p, false);
}

function getSeparatorIndex(c) {
	let i, j, ch
	let count = 0
	let s = "{}[]()"
	for (i = 0; i < c.length; i++) {
		ch = c.charAt(i);
		if (ch == ',') {
			if (count == 0) {
				return i;
			}
		}
		else {
			j = s.indexOf(ch)
			if (j != -1) {
				ch = (1 << ((j >> 1) * 10));//allow max 10 brakets
				count += j % 2 == 0 ? ch : -ch;
			}
		}
	}
	throw new Exception("");
}

function callbankchanged() {
	ge[0] = eval(ends.value)
	let t = el("ct");
	let i, o, b, c, p;

	try {
		c = el("callbank").value;
		i = getSeparatorIndex(c)
		b = ExpressionEstimator.calculate(c.substring(i + 1));
		c = ExpressionEstimator.calculate(c.substring(0, i));
		if (b == 0 || c == 0) {
			throw new Exception("");
		}

		for (i = 0; i < t.rows.length - 1; i++) {
			o = t.rows[i + 1]
			scutcall(o, 2, ge[i] / 47, b)
			scutcall(o, 3, ge[i] / 46, b)
			scutcall(o, 4, ge[i] * (93 - ge[i]) / 46 / 47, b)
		}

		p = 1 / (1 + b / c)
		el("bchance").innerHTML = formatS(b / c)
		el("turnouts").innerHTML = "&ge;" + formatS(47 * p)
		el("riverouts").innerHTML = "&ge;" + formatS(46 * p)
		//el("equity").innerHTML=equity(b/c)
		callbank.style.color = "black";
	} catch (exception) {
		console.log(exception)
		el("bchance").innerHTML =
			el("turnouts").innerHTML =
			el("riverouts").innerHTML = ""
		callbank.style.color = "red";
	}
}