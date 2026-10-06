gRotate = 'fbudlrmse'
probabilityFraction = [18, 54]
gl = gLanguage == 'russian' ? ['Шаблоны', 'уникальных', 'повторов', 'вероятности', 'Математические ожидания'
	, 'период', 'вероятность', 'номер', 'ходов', 'имя', 'ссылка'
] : ['Templates', 'unique', 'repeat', 'probabilities', 'Expected values'
	, 'period', 'probability', 'id', 'turns', 'name', 'reference'
]

function load() {
	i = 5;
	PERIOD = i++;
	PROBABILITY = i++
	ID = i++
	TURNS = i++
	NAME = i++
	REFERENCE = i++

	newRow = true
	helperSign = '#$/'

	gAllRotations.forEach((a, k) => {
		//count number of templates
		for (i = j = 0; j < a.length; j++) {
			if (a[j].charAt(0) != '#') {
				i++;
			}
		}

		j = parseInt(a[a.length - 1])
		l = 0
		head = gl[l++] + ' ' + i + ', ' + gl[l++] + ' ' + j + ', ' + gl[l++] + ' ' + (i - j) + ', ' + gl[l++]
		q = ''

		//probability array
		pa = [0, 0, 0]
		ev = [0, 0]

		for (i = 0; i < a.length; i++) {
			t = a[i].split(',')
			if (t[0].charAt(0) == '#') {
				if (t[0].length == 1) {//same row
					newRow = false;
				}
				else {
					q += '<tr><td colspan=2><h4>' + t[0].substring(1) + '<h4>'
				}
				continue;
			}

			probability = parseInt(t[2])
			if (t[0].indexOf('*') == -1) {//not repeat
				pa[Math.floor((Math.log(probability) / Math.log(2)))]++
			}

			id = t[0]
			period = t[1]
			probability *= probabilityFraction[k]

			if (t[3].length == 0) {
				comment = ''
			}
			else {
				l = helperSign.indexOf(t[3].charAt(0))
				comment = (l == 2 ? '' : (gl[NAME + l]) + ' ') + t[3].substring(1)
			}
			b = t[4].split('=')
			if (newRow) {
				q += '<tr>'
			}
			for (l = 0; l < b.length; l++) {
				s = t = b[l]

				t = makeSup(t);
				for (j = 0; j < gRotate.length; j++) {
					w = gRotate.charAt(j) + ""
					t = t.replace(new RegExp(w, 'g'), w.toUpperCase());
				}
				w = s.toLowerCase();

				n = [0, 0]
				for (j = 0; j < 2; j++) {
					n[j] = countTurns(w, j == 1)
					if (l == 0) {
						ev[j] += n[j] / probability
					}
				}
				if (l == 0) {
					q += '<td>' + getImageString(s, 0) + '<td>';
				}
				if (b.length == 1) {
					q += t + '<br>' + gl[TURNS] + ' ' + n[0] + 'htm ' + n[1] + 'qtm';
				}
				else {
					if (l > 0) {
						q += '<br>'
					}
					q += t + ' ' + n[0] + 'htm ' + n[1] + 'qtm';
				}
				if (l + 1 == b.length) {
					q += '<br> ' + gl[PERIOD] + ' ' + period
						+ '<br> ' + gl[PROBABILITY] + ' ' + fractionString(1, probability) + '<br>' + gl[ID] + ' ' + id;
				}
			}
			if (comment != '') {
				q += '<br>' + comment
			}
			newRow = true
		}

		pa[2]++;//identical template
		for (j = i = 0; i < pa.length; i++) {
			t = probabilityFraction[k] * (1 << i)
			head += (i == 0 ? ' ' : '+') + pa[i] + '&times;' + fractionString(1, t)
			j += pa[i] / t
		}
		head += '=' + j + '<br>' + gl[4]
		for (j = 0; j < 2; j++) {
			head += ' ev<sub>' + (j == 0 ? 'htm' : 'qtm') + '</sub>=' + ev[j].toFixed(2)
		}
		head += '<table>'

		q += '</table>'
		document.getElementById(k == 0 ? 'pll' : 'oll').innerHTML = head + q;
	});
}

function countOccurence(t, c) {
	let j = t.match(new RegExp(c, 'g'))
	return j == null ? 0 : j.length
}

function fractionString(a, b) {
	return '<sup>' + a + '</sup>&frasl;<sub>' + b + '</sub>'
}

function countTurns(s, qtm) {//count number of turns in htm or qtm metrics. String should be in lower case
	s = s.replace(/\s+/g, "")
	let i, j, k, c, q, power
	if ((i = s.indexOf('(')) == -1) {
		q = s.match(new RegExp('[' + gRotate + 'xyz]', 'gi'))
		i = q == null ? 0 : q.length
		if (qtm) {
			i += countOccurence(s, '2')
		}
		return i
	}
	for (k = 0, j = i + 1; j < s.length; j++) {
		c = s.charAt(j);
		if (c == '(') {
			k++;
		}
		else if (c == ')') {
			k--;
		}
		if (k == -1) {
			break;
		}
	}

	q = gRotate + 'xyz()';

	for (k = j + 1; k < s.length; k++) {
		if (q.indexOf(s.charAt(k)) != -1) {
			break;
		}
	}

	q = s.substring(j + 1, k);
	power = 1;
	if (q.length > 0) {
		if (q.charAt(0) == '\'') {
			q = q.substring(1);
		}
		else if (q.charAt(q.length - 1) == '\'') {
			q = q.substring(0, q.length - 1);
		}
		if (q.length > 0) {
			power = parseInt(q);
		}
	}

	return countTurns(s.substring(0, i), qtm) + countTurns(s.substring(i + 1, j), qtm) * power + countTurns(s.substring(k), qtm)
}
