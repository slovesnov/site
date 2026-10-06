languageString = [[
	'error',
	'common functions', 'constants', 'trigonometric functions', 'hyperbolic functions', 'rounding and additional functions',
	'clear', 'recount', 'copy to memory', 'add to buffer', 'clear buffer', 'expression', 'result',
	'memory', 'buffer', 'Javascript calculator'
], [
	'ошибка',
	'общие функции', 'константы', 'тригонометрические функции', 'гиперболические функции', 'дополнительные функции и функции округления',
	'очистить', 'пересчитать', 'копировать в память', 'добавить в буфер', 'очистить буфер', 'выражение', 'результат',
	'память', 'буфер', 'Научный калькулятор'
]];

languageStringMobile = [[
	'error',
	'common functions', 'constants', 'trigonometric', 'hyperbolic functions', 'additional functions',
	'&#x232b;', '&#x27f3;', 'memory', '+buffer', '&#x232b;buffer', 'expression', 'result',
	'memory', 'buffer', 'Javascript calculator'
], [
	'ошибка',
	'общие функции', 'константы', 'тригонометрические', 'гиперболические', 'дополнительные',
	'&#x232b;', '&#x27f3;', 'память', '+буфер', '&#x232b;буфер', 'выражение', 'результат',
	'память', 'буфер', 'Научный калькулятор'
]];

LANGUAGE_ID = [];

function load() {
	ascetic = gPageName == 'calculator_javascript_ascetic'

	replaceA = [
		['exp()', 'log()', 'pow(,)', 'sqrt()', 'abs()', 'random()', 'min(,)', 'max(,)']
		, ['pi', 'e', 'sqrt2', 'sqrt1_2', 'ln2', 'ln10', 'log2e', 'log10e']
		, []//fill below
		, []//fill below
		, ['ceil()', 'floor()', 'round()', 'atan2(,)']
	];

	let a = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']
	let b = a.concat(a.map(e => 'a' + e))
	for (let i = 0; i < 2; i++) {
		replaceA[i + 2] = b.map(e => e + (i ? 'h' : '') + '()')
	}


	replaceA.unshift(['a', 'b', 'c', 'd'])

	ilanguage = gLanguage == 'russian' ? 1 : 0
	texpression.focus();

	//'copy to memory' -> 'COPY_TO_MEMORY'
	s = languageString[0];
	for (i = 0; i < s.length; i++) {
		LANGUAGE_ID.push(s[i].toUpperCase().replace(/ /g, '_'))
	}

	if (gMobile) {
		languageString = languageStringMobile

		/*invalid width for android so use onresize ovent
			window.addEventListener("orientationchange", function(e) {
			}, false);
		dont need procees resize event for desktop
		*/
		window.addEventListener('resize', () => {
			el('st').innerHTML = getStyle(window.outerWidth)//should be outerWidth
		});
		addStyle(getStyle(window.innerWidth), 'st')//should be innerWidth
	}

	s = '<tr>'
	for (i = 0; i < replaceA[0].length; i++) {
		j = replaceA[0][i];
		s += '<td><span id="txt' + j + '">' + j + '=</span><input type="text" id="' + j + '" value="0" oninput="com()">'
		if (ascetic && i == 1) {
			s += '<tr>'
		}
	}
	el('abcd').innerHTML = s

	comboLanguageSelector = new Combobox('languageSelector', ilanguage
		, (gMobileMode == MOBILE_MODE_OFFLINE ? '' : '<img src="img/en.gif"> ') + 'en'
		, (gMobileMode == MOBILE_MODE_OFFLINE ? '' : '<img src="img/ru.gif"> ') + 'ru'
		, changeLanguage);

	stm = '<table id="tamemory"><tr><td id="MEMORY"><td><input type="text" id="tmemory">'
	if (ascetic) {
		stm += '<button class="comboboxbutton" id="ADD_TO_BUFFER" onclick="addBuffer()"><button class="comboboxbutton" id="CLEAR_BUFFER" onclick="clearBuffer()">'
	}
	stm += '</table>'
	if (ascetic) {
		s = stm
	}
	else {
		s = '<table id="tablefieldset">'
		for (j = 1; j < replaceA.length; j++) {
			if (j % 2 == 1) {
				s += '<tr>'
			}
			if (j == 5) {
				s += '<td>' + stm
			}

			l = replaceA[j].length / 2;//number of buttons in the row
			if (l == 2) {//four buttons one row
				l = 4;
			}

			//LANGUAGE_ID[1] - common functions
			s += '<td><fieldset><legend id="' + LANGUAGE_ID[j] + '"></legend><table class="buttons">';
			for (i = 0; i < replaceA[j].length; i++) {
				if (i % l == 0) {
					s += '<tr>'
				}
				m = k = replaceA[j][i]
				if (gMobile) {
					n = k.indexOf('(');
					if (n != -1) {
						m = k.substring(0, n)
					}
				}
				s1 = ' bf';
				if (j == 4 && i > 5) {
					s1 = ' bf4';
				}
				s += '<td><button class="comboboxbutton b' + l + s1 + '" onclick=bclick("' + k + '")>' + m;
			}
			s += '</table>'
			s += '</fieldset>'
		}
		s += '</table>'
	}
	el('buttons').innerHTML = s

	if (gMobileMode == MOBILE_MODE_OFFLINE) {
		e = el('tablebuffer');
		e.rows[2].cells[0].innerHTML = ""
	}
	else {
		s = gLanguage == 'russian' ?
			'перейти к ' + (ascetic ? 'полному' : 'аскетичному') + ' режиму'
			: 'switch to ' + (ascetic ? 'full' : 'ascetic') + ' mode'

		//for smartphone android local version for safety additional check window.location.href.indexOf('.html')!=-1
		if (gMobile && window.location.href.startsWith("file:///") && window.location.href.indexOf('.html') != -1) {
			r = 'calculator' + (ascetic ? '' : '_ascetic') + ".html"
		}
		else {
			r = '?calculator_javascript' + (ascetic ? '' : '_ascetic')
		}

		el('ps').innerHTML = '<a href="' + r + '">' + s + '</a>'
	}

	changeLanguage(ilanguage);
}

function com() {
	e = texpression.value.replace(/ю|б/gi, ".")
	if (texpression.value != e) {
		a = texpression.selectionStart
		b = texpression.selectionEnd
		texpression.value = e;
		texpression.selectionStart = a
		texpression.selectionEnd = b
	}

	e = e.replace(/\s+/g, "");//remove all whitespaces
	if (e.length == 0) {
		texpression.style.color = tresult.style.color = "black";//set color as normal
		tresult.value = "";
		return;
	}

	replaceA[0].forEach(s => e = e.replace(new RegExp("\\b" + s + "\\b", 'gi'), '(' + el(s).value + ')'))//use brackets

	try {
		r = 0
		v = normalize1(ExpressionEstimator.calculate(e));
	}
	catch (error) {
		r = 1
		v = languageString[ilanguage][0]
	}
	tresult.value = v
	texpression.style.color = tresult.style.color = r ? "red" : "black"
}

function bclick(fun) {
	v = el('texpression')
	//v.focus();//?? should set focus for correct working of function selectionStart & selectionEnd
	i = v.selectionStart;
	j = v.selectionEnd

	let s = v.value;
	let k = fun.indexOf('(')
	if (k == -1) {//no arguments
		q = fun + s.substring(i, j)
	}
	else {
		q = fun.substring(0, k) + '(' + s.substring(i, j) + (fun.indexOf(',') == -1 ? '' : ',') + ')'
	}

	v.value = (s.substring(0, i) + q + s.substring(j));
	com()
}

function changeLanguage(lng) {
	ilanguage = lng
	com()//need to change result value

	let i, j, k, s;
	//set language dependent captions
	for (i = 0; i < LANGUAGE_ID.length; i++) {
		k = LANGUAGE_ID[i]
		if (k == 'ERROR') {
			continue;
		}
		s = languageString[ilanguage][i]
		if (k == 'JAVASCRIPT_CALCULATOR') {
			document.title = document.querySelectorAll('h3')[0].innerHTML = s;
			continue;
		}
		j = el(k);
		if (j === null) {//ascetic
			continue;
		}
		if (j.type == 'button') {
			j.value = s
		}
		else {
			j.innerHTML = s
		}
	}

}

function addBuffer() {
	tbuffer.value += texpression.value + '=' + tresult.value + '\n'
}

function clearBuffer() {
	tbuffer.value = ''
}

/*
1.0000000000000002=1
0.49999999999999994=0.5
4.9999999999999994=5
normalize1 because normalize is defined in common.js
*/
function normalize1(s) {
	s += '';
	let i, j, k, l;
	if ((i = s.indexOf('.')) != -1) {
		for (l = 0; l < 2; l++) {
			if ((k = s.match(new RegExp((l ? 9 : 0) + "{7,}\\d$"))) != null) {
				j = k.index;
				if (j - 1 == i) {
					j--;
				}
				return s.substr(0, j - l) + (l ? String.fromCharCode(s.charCodeAt(j - 1) + 1) : '');
			}
		}
	}
	return s;
}

function getStyle(w) {
	if (ascetic) {
		let j = Math.floor(w / 2) - 20
		return '#a,#c{width:' + j + 'px;}'
			+ '#b,#d{width:' + (w - 40 - j) + 'px;}'
	}
	else {
		let i = Math.floor((w - 4) / 8)
		// i*8+4=w, 4-borders of fieldsets
		let pi = w - 4 - 8 * i;
		let j = Math.floor((w - 80) / 4)
		return '.b4{width:' + i + 'px;}'
			+ '.b6{width:' + Math.floor((w - 4 - pi) / 12) + 'px;}'
			+ '#tmemory {	width: ' + (i * 4 + 2 - 90) + 'px;}'
			+ '#tablefieldset > tbody > tr > td:first-child {	padding:0 ' + pi + 'px 0 0;}'
			+ '#a,#b,#c{width:' + j + 'px;}'
			+ '#d{width:' + (w - 80 - 3 * j) + 'px;}'
	}
}