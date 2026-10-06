
l = gLanguage == 'russian' ? ['длина', '%', 'количество', 'Английский язык.', 'Русский язык.', 'всего', 'математическое ожидание', 'среднеквадратическое отклонение', 'дисперсия', 'данные', 'приближение нормальным распределением', 'буква', 'частота', 'log(частоты)', 'График логарифма частоты в процентах.'] : ['length', '%', 'quantity', 'English language.', 'Russian language.', 'total', 'expected value', 'standard deviation', 'variance', 'data', 'normal distribution approximation', 'character', 'frequency', 'log(frequency)', 'Logarithmic frequency percentage chart.']
const TOTAL = 5
const DATA = TOTAL + 4
function load() {
	//allow valid scroll from words.exe https://slovesnov.rf.gd/?words,en#MENU_DICTIONARY_STATISTICS https://slovesnov.rf.gd/?words,en#MENU_WORD_FREQUENCY
	const scrollAfterRenderPlugin = {
		id: 'scrollAfterRender',
		afterRender: (chart) => {
			if (window.location.hash) {
				const element = document.querySelector(window.location.hash);
				if (element) {
					if (!chart.hasScrolled) {
						element.scrollIntoView({ behavior: 'auto' });
						chart.hasScrolled = true;
					}
				}
			}
		}
	};
	Chart.register(scrollAfterRenderPlugin);

	total = wordsData.map(e => e.reduce((a, e) => a + e[1], 0))
	ev = wordsData.map((e, i) => e.reduce((a, e) => a + e[0] * e[1], 0) / total[i])
	va = wordsData.map((e, i) => e.reduce((a, e) => a + e[1] * ((e[0] - ev[i]) ** 2), 0) / (total[i] - 1))//unbiased
	normal = (x, i) => 100 / Math.sqrt(2 * Math.PI * va[i]) * Math.exp(-((x - ev[i]) ** 2) / 2 / va[i])
	s = '<table><tr>'
	wordsData.forEach((e, i) => {
		down = [total[i], ev[i], Math.sqrt(va[i]), va[i]].map((e, j) => [[l[TOTAL + j], 4], formatNumber(e, 3)])
		d = e.map(e => {
			pr = e[1] / total[i]
			n = normal(e[0], i)
			w = n / 100 * total[i]
			return [e[0], [(100 * pr).toFixed(3), e[1]], [formatNumber(e[1]), e[1]], [n.toFixed(3), w], [formatNumber(w, 0), w]]
		})
		s += `<td valign="top"${i ? '' : ' style="padding-right:15px"'}>` + l[3 + i] + new Table({
			up: [[l[0], [l[DATA], 2], [l[DATA + 1], 2]], ['', l[1], l[2], l[1], l[2]]]
			, down
		}, d, 'csb').html()
	})

	el('tf', s + '</table>')
	o = { width: 790, type: 'line', borderWidth: 3, ticksOnlyFirst: 1, sameScale: 1 }
	wordsData.forEach((e, i) => {
		o.title = l[3 + i]
		names = l.slice(DATA, DATA + 2)
		const dataMap = new Map(e);
		length = e[e.length - 1][0];//max
		d = Array.from({ length }, (_, j) => dataMap.get(j + 1) * 100 / total[i] || 0);
		d1 = Array.from({ length }, (_, j) => normal(j + 1, i));
		data = [d, d1]
		labels = Array.from({ length }, (_, i) => i + 1)
		createNGraphs('tfc' + i, names, labels, data, o)
	})

	//letters
	la = lettersData.map(e => {
		flat = e.split(/\s+/)
		m = new Map()
		for (i = 0; i < flat.length; i += 2) {
			m.set(flat[i], flat[i + 1]);
		}
		return m
	})

	comparator = [(x, y) => {
		let a = x[0].v, b = y[0].v
		//'-' as last char
		if (a === '-') return 1;
		if (b === '-') return -1;
		return a.localeCompare(b, 'ru')
	}]

	s = la.reduce((a, e, i) => {
		d = [...e].map(e => {
			v = +e[1]
			return [e[0], [e[1]+'%', v], [formatNumber(Math.log(v/100), 3), v]]
		})
		return a + `<td valign="top"${i ? '' : ' style="padding-right:15px"'}>` + l[3 + i] + new Table({
			up: l.slice(11, 14)
			, down: [l[TOTAL], e.size]
		}, d, 'csb', comparator).html()
	}, '<table><tr>') + '</table>'
	el('tl', s)

	o = { width: 790, type: 'line', borderWidth: 3, ticksOnlyFirst: 1, sameScale: 1, title: l[14] }
	length = Math.max(...la.map(e => e.size))
	names = l.slice(3, 5)
	maxfrequency = []
	labels = Array.from({ length }, () => []);
	data = la.map(e => {
		for (j = e.size; j < length; j++) {//add if small length
			labels[j].push('')
		}
		se = [...e].sort((a, b) => b[1] - a[1])
		maxfrequency.push(+se[0][1]);
		return se.map((e, j) => {
			labels[j].push(e[0]);
			return Math.log(e[1]/100)
		});
	})
	for (j = 0; j < length; j++) {
		labels[j].push(j + 1)
	}
	createNGraphs('MENU_DICTIONARY_STATISTICS', names, labels, data, o)

	index = gLanguage == 'russian' ? 1 : 0;
	keyboardData[index].forEach((rowString, rowIndex) => {
		rowDiv = document.createElement('div');
		rowDiv.className = 'keyboard-row';

		if (rowIndex === 1) {
			rowDiv.style.marginLeft = '20px';
		} else if (rowIndex === 2) {
			rowDiv.style.marginLeft = '40px';
		}

		for (char of rowString) {
			keyDiv = document.createElement('div');
			keyDiv.className = 'key';

			letterSpan = document.createElement('span');
			letterSpan.textContent = char.toUpperCase();
			keyDiv.appendChild(letterSpan);

			freq = la[index].get(char);
			ratio = freq / maxfrequency[index];

			probSpan = document.createElement('span');
			probSpan.className = 'key-prob';
			probSpan.textContent = formatNumber(freq, 3) + `%`;
			keyDiv.appendChild(probSpan);

			hue = (1 - ratio) * 120;
			keyDiv.style.backgroundColor = `hsl(${hue}, 85%, 65%)`;
			keyDiv.style.color = '#000';

			rowDiv.appendChild(keyDiv);
		}
		el('keyboardContainer').appendChild(rowDiv);
	});
}

const wordsData = [
	[[1, 26], [2, 481], [3, 2534], [4, 7886], [5, 17506], [6, 32124], [7, 44550], [8, 53911], [9, 55677], [10, 48460], [11, 39687], [12, 30882], [13, 22376], [14, 15330], [15, 9627], [16, 5680], [17, 3214], [18, 1636], [19, 836], [20, 411], [21, 193], [22, 79], [23, 33], [24, 12], [25, 8], [27, 3], [28, 2], [29, 2], [31, 1]]
	,
	[[1, 31], [2, 673], [3, 7228], [4, 23297], [5, 62884], [6, 119344], [7, 190204], [8, 250787], [9, 290308], [10, 308347], [11, 286742], [12, 250224], [13, 196643], [14, 145543], [15, 102568], [16, 67898], [17, 43766], [18, 27579], [19, 17189], [20, 10150], [21, 6073], [22, 3408], [23, 1731], [24, 993], [25, 678], [26, 394], [27, 245], [28, 156], [29, 115], [30, 74], [31, 53], [32, 29], [33, 10], [34, 5], [35, 5], [36, 6], [37, 2], [38, 3], [39, 3], [40, 3], [41, 1], [42, 1], [44, 1], [47, 1], [48, 1], [53, 1], [54, 1], [56, 1], [57, 1], [64, 1]]]

const lettersData = [`a  8.513  b  1.827  c  4.316  d  3.210  e 10.757  f  1.110  g  2.352  h  2.630  
i  9.060  j  0.161  k  0.782  l  5.562  m  3.013  n  7.197  o  7.175  p  3.197  
q  0.167  r  7.030  s  7.305  t  6.571  u  3.720  v  0.951  w  0.643  x  0.297  
y  1.974  z  0.480`,
	`а  8.841  б  1.499  в  5.225  г  1.671  д  2.089  е  8.083  ж  0.610  з  1.621  и  7.629  й  1.306  к  3.572  
л  3.947  м  4.064  н  6.177  о  9.531  п  2.955  р  5.757  с  4.999  т  4.633  у  3.026  ф  0.472  х  1.109  
ц  0.545  ч  1.158  ш  1.768  щ  0.759  ъ  0.036  ы  1.819  ь  1.209  э  0.229  ю  1.530  я  2.010  -  0.120`];

const keyboardData = [
	[
		'qwertyuiop',
		'asdfghjkl',
		'zxcvbnm'
	], [
		'йцукенгшщзхъ',
		'фывапролджэ',
		'ячсмитьбю-'
	]]
