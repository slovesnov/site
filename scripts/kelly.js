var a, n, periodDays;

/*after N=\sum n_i trades K=K_0*\prod (1+a_i*f)^n_i=
=K_0*exp(log(\prod (1+a_i*f)^n_i)=K_0*exp(\sum n_i*log(1+a_i*f))=K_0*exp(g(f))
after N -trades means after t=periodDays, so K(t)=K_0*exp(g(f)*t/periodDays)
*/

var gl = gLanguage != 'russian' ? [
	'optimal'//0
	, 'critical'//1
	, 'period (days)'//2
	, 'avg time to multiple fortune'//3
	, 'times'//4
	, 'days'//5
	, 'months'//6
	, 'years'//7
	, 'error line'//8
	, 'warning all trades are nonnegative, use max available f'//9
	, 'should be positive integer number'//10
	, 'is not a number'//11
] : [
	'оптимальное'
	, 'критическое'
	, 'период (дни)'
	, 'среднее время для увеличения капитала в'
	, 'раза'
	, 'дни'
	, 'месяцы'
	, 'годы'
	, 'ошибка в строке'//8
	, 'предупреждение нет негативных трейдов, используйте максимально возможное f'//9
	, 'должен быть положительным и целым числом'
	, 'не число'
]

function load() {
	s = '';
	a = []
	n = []

	periodDays = Number(el('pd').value)
	b = el('t').value.split(/\n/)
	for (i = 0; i < b.length; i++) {
		if (/^\s*$/.test(b[i])) {
			continue;
		}
		c = b[i].trim().split(/\s+/);
		//console.log(i+" "+c.length+" "+c[0].length+" "+c[1].length)
		if (c.length != 2) {
			s = gl[8] + " " + (i + 1);
			break;
		}
		a.push(Number(c[0]));
		n.push(Number(c[1]));
	}

	if (s == '') {
		s = check();

		N = 0;
		n.forEach((e) => {
			N += e;
		});

		amin = Math.min(...a);

		if (s == "ok") {
			let e = gDerivative(0);
			if (e <= 0) {
				s = "ev &le; 0";
			}
			else {
				s = "N = " + N + ", ev = " + e + ", " + gl[2] + " = " + periodDays;
				if (amin >= 0) {
					s += "<br>" + gl[9];
				}
				else {
					f = [0, 0]
					for (i = 0; i < 2; i++) {
						f[i] = v = solve(i == 0 ? gDerivative : g, i == 0 ? 0 : v, -1 / amin);
						s += "<br>" + gl[i];
						d = g(v)
						s += "&nbsp;&nbsp; g(f<sub>" + (i == 0 ? 'o' : 'c') + "</sub> = " + v + " = " + ef(v) + ") = " + d + " = " + ef(d)
					}
					alpha = g(f[0]) / periodDays;//a - already defined, so use alpha
					beta = Math.exp(alpha)
					s += "<br>&alpha; = " + alpha + " = " + ef(alpha) + " &nbsp;&nbsp; K(t) = K<sub>0</sub>&sdot;e<sup>&alpha;&sdot;t</sup> = K<sub>0</sub>&sdot;e<sup>" + alpha + "&sdot;t</sup>"
					s += "<br>&beta; = e<sup>&alpha;</sup> = " + beta + " &nbsp;&nbsp; K(t) = K<sub>0</sub>&sdot;&beta;<sup>t</sup> = K<sub>0</sub>&sdot;" + beta + "<sup>t</sup>"

					const KELLY_AVG = [1, 365.25 / 12, 365.25];
					const k = 2;
					s += "<br> " + gl[3] + " " + k + " " + gl[4]
					for (i = 0; i < KELLY_AVG.length; i++) {
						s += (i == 0 ? ":" : ",") + " " + gl[i + 5] + " " + (Math.log(k) / alpha / KELLY_AVG[i]).toFixed(2)
					}
				}
			}
		}
	}
	el('o').innerHTML = s;
}

function solve(fu, a, b) {
	let f, v;
	//let steps=0;
	while (1) {
		f = (a + b) / 2
		v = fu(f);
		//steps++;
		if (v == 0 || f == a || f == b) {
			//console.log(steps)
			return f;
		}
		if (v > 0) {
			a = f;
		}
		else {
			b = f;
		}
	}
}

/*e(log(f))=\sum p_i \log(1+a_i \times f)=\sum n_i/N \log(1+a_i * f)
g=N*e(log(f))=\sum n_i \log(1+a_i * f)
g'=\sum n_i*a_i /(1+a_i * f)
*/
function g(f) {
	let v = 0;
	for (let i = 0; i < n.length; i++) {
		v += n[i] * Math.log(1 + a[i] * f);
	}
	return v;
}

function gDerivative(f) {
	let v = 0;
	for (let i = 0; i < n.length; i++) {
		v += a[i] * n[i] / (1 + a[i] * f);
	}
	return v;
}

function check() {
	var i;
	if (!Number.isInteger(periodDays) || periodDays <= 0) {
		return gl[2] + " " + gl[10];
	}
	/*if(a.length!=n.length){
		return "a and n have different length";
	}*/
	for (i = 0; i < n.length; i++) {
		if (isNaN(a[i])) {
			return "a<sub>" + (i + 1) + "</sub> " + gl[11];
		}
		if (!Number.isInteger(n[i]) || n[i] <= 0) {
			return "n<sub>" + (i + 1) + "</sub> " + gl[10];
		}
	}
	return "ok";
}

function ef(n) {
	return n.toExponential(6)
}