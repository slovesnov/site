const REMOTE = 'http://slovesnov.rf.gd/'
const MOBILE_MODE_OFFLINE = 2;
const CALORIE_COLUMNS = {
	'название': 1, 'масса': 1, 'масса%': 0, 'база%': 0, 'белки': 1, 'жиры': 1, 'углеводы': 1, 'б.всего': 1, 'ж.всего': 1, 'у.всего': 1, 'кк/100г': 1, 'кк всего': 1, 'кк%': 0, 'р/кг': 0, 'р/1000кк': 0, 'р всего': 0, 'р%': 0, 'белок%': 0, 'р/гБелка': 0
	, 'b12': 0, 'b12.всего': 0, 'кл.': 0, 'кл.всего': 0
	, 'строка в чеке / дата чека': 0
}

const lnLeastSquares = typeof gLanguage == 'undefined' || gLanguage == 'russian' ? ['тип', 'простой x, y', 'масса, калории', 'масса, время (кулинария)', 'опц', 'г', 'кг', 'ккал', 'переменная', 'размерность', 'значение', 'экспоненциальная форма', 'можно перетащить файл прямо на страницу'
] : ['type', 'simple x, y', 'mass, calorie', 'mass, time (cooking)', 'opt', 'g', 'kg', 'kcal', 'variable', 'dimension', 'value', 'exponentially', 'you can drag a file directly onto the page']

window.onscroll = () => {
	//gMobile not defined in jm.js
	let i, e = el('totop');
	if (typeof gMobile != 'undefined' && e) {
		i = gMobile ? 300 : 1000;
		e.style.bottom = (document.body.scrollTop > i || document.documentElement.scrollTop > i) ?
			(gMobile ? "0" : "20px") : "-60px";
	}
}

function totop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
}

function addStyle(text, id) {
	let style = document.createElement('style');
	if (typeof id != 'undefined') {
		style.id = id;
	}
	style.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(style);
	style.innerHTML = text;
}

function el(i, s) {
	let e = document.getElementById(i)
	if (s === undefined)
		return e
	e.innerHTML = s
}

//p can be string p='a=1&b=2' or object p = {a:1, b:2} or FormData see siteupdate.js
function fetchpost(url, p, f, ...params) {
	fetchgetpost(url, p, f, 1, ...params)
}

function fetchgetpost(url, body, f, post = 1, ...params) {
	let o
	if (!(body instanceof FormData) || !post) {
		body = new URLSearchParams(body);
	}
	if (post) {
		o = {
			method: 'POST', body
		}
	}
	else {
		url += "?" + body
	}
	o = fetch(url, o).then(r => r.text())
	if (typeof f == 'function') {
		o.then(r => f(r, ...params))
			.catch(e => f(e, ...params))
	}
}

//working only from page on site, not working if open file in folder
function downloadUTF8(filename, text) {
	let a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	a.setAttribute('download', filename);
	a.click();
}
/*
//if download many files browser asking permission
function downloadUTF8Files(files) {
	let a = document.createElement('a'),filename;
	files.forEach(e=>{
		filename=e.slice(Math.max(e.lastIndexOf('/'),e.lastIndexOf('\\'))+1)
		a.setAttribute('href', e);
		a.setAttribute('download',filename);
		a.click();
	})
}*/

function saveForOfflineMobileClick() {
	fetchgetpost('index.php?' + [gPageName, gLanguage, gParameter, 2].join(), null, saveForOfflineMobileClickCallback);
}

function saveForOfflineMobileClickCallback(s) {
	if (typeof s != 'string' || s.startsWith('error')) {
		console.error(s);
		return
	}
	else {
		downloadUTF8(gPageName + '.html', s);
	}
}

function formatString(n, separator = ' ', digits = 3) {
	let s = n.toString();
	let r = new RegExp('\\B(?=(\\d{' + digits + '})+' + (s.includes('.') ? '\\.' : '$') + ')', 'g')
	return s.replace(r, separator);
}

//formatNumber(1234.5555, 1) -> '1 234.5'
function formatNumber(n, digits) {
	return formatString(normalize(n, digits))
}

//321.10 -> 321.1, 1.00 -> 1, 100 -> 100
function normalize(s, digits = null) {
	return Number(digits === null ? s.toString() : Number(s).toFixed(digits))
}

//fastest version
function tag2text(s) {
	return s.trim()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function codeString(text, lng, width) {
	let s = ''
	if (width) {
		if (typeof width=='string' && width.endsWith('%')) {
			s = width
		}
		else {
			s = width + 'px'
		}
		s = ` style="width:${s}"`
	}
	return `<pre class="code-container"${s}><code class="language-${lng}">${tag2text(text)}</code></pre>`
}

//1456 -> 24:16
function timeToString(t) {
	let v
	t = Math.round(t)
	if (t >= 3600) {
		v = [Math.floor(t / 3600), Math.floor((t / 60) % 60), t % 60]
	}
	else if (t >= 60) {
		v = [Math.floor(t / 60), t % 60]
	}
	else {
		v = [t]
	}
	return v.map((e, i) => i ? String(e).padStart(2, 0) : e).join(':')
}

//24:16 -> 1456
function stringToTime(s) {
	return s.split(':').reverse().reduce((a, e, i) => a + Number(e) * Math.pow(60, i), 0);
}

__gRecipeButton = [];
function recipeButton(o, buttonText) {
	__gRecipeButton.push(JSON.stringify(o))
	return `<button class="comboboxbutton" onclick="recipeButtonClick(${__gRecipeButton.length - 1})">${buttonText ? buttonText + ' ' : ''}<img src="img/jm/edit16.png"></button>`
}

function recipeButtonClick(i) {
	const key = 287;
	sessionStorage.setItem(key, __gRecipeButton[i]);
	window.open('index.php?calorie_recipe,,' + new URLSearchParams({ 'storage': key }), '_blank').focus()
}

function recipeCallback(s, o, d) {
	if (!Object.hasOwn(o, 'buttonRecipe')) {
		//if not defined use one text for all buttons
		o.buttonRecipe = o.p
	}
	el(o.id === undefined ? 'p' : o.id).innerHTML = recipeParse(s, o)
	//console.log(formatNumber((new Date() - d) , 1))
	if (typeof o.callback == 'function') {//poverty
		o.callback(s, o, d)
	}
}

function isSiteUpdate() {
	return typeof CALORIE_HISTORY_CURRENT_DAY != 'undefined'
}

/*Note not working with field which is function, it's possible to add using paremeter a={f:fname}, 
or o={f:'fname'} to call function use window['fname'](arguments)*/
// function cloneObject(o, a = {}) {
// 	return Object.assign(JSON.parse(JSON.stringify(o)), a)
// }

function recipeParse(s, o = {}) {
	let a
	try {
		a = JSON.parse(s)
	}
	catch (ex) {
		//in poverty.js exception is ok, it's showed by alert() function
		console.log(s)
		console.log(ex)
		// console.log(o)
		//if user pass invalid recipe just output return message
		//s = ex+'<br>'+s
		return s;
	}
	if (a.data === undefined) {//empty recipe is ok
		return ''
	}
	if (isSiteUpdate()) {
		gRecipeParseData = a;
	}
	s = ''

	a.data.forEach((e, ii) => {
		let d, b, i, j, k;
		if (e.title) {
			i = o.h4 ? 4 : 3
			//id uses in poverty
			if (isSiteUpdate()) {
				if (e.title == 'неизвестный рецепт') {
					e.title = 'Итог'
				}
			}
			s += `<h${i} id='pp${ii}'>` + e.title
			/*buttonRecipe is array a[] then every button recipe is a[i]
			buttonRecipe is string "s" then every button recipe is s
			buttonRecipe is null no button added
			*/
			if (Object.hasOwn(o, 'buttonRecipe')) {
				j = o['buttonRecipe']
				if (j !== null) {
					//need all properties
					k = o['afterButtonRecipe']

					delete o.callback
					let o1 = structuredClone(o)
					o1.p = Array.isArray(j) ? o.buttonRecipe[ii] : j
					s += ' ' + recipeButton(o1) +
						(k === undefined ? '' : (Array.isArray(k) ? o.afterButtonRecipe[ii] : k))

					// s += ' ' + recipeButton(cloneObject(o, { p: Array.isArray(j) ? o.buttonRecipe[ii] : j })) +
					// 	(k === undefined ? '' : (Array.isArray(k) ? o.afterButtonRecipe[ii] : k))
				}
			}
			s += `</h${i}>`
		}
		b = { up: a.columns }
		j = e.data.pop();
		d = []
		for (i = 0; i < a.columns.length; i++) {
			k = j[i]
			d.push(Array.isArray(k) ? k[0] : k)
		}
		d.class = j.class;
		b.down = d;
		d = { o: "bsr" + (o.trColorSequence ? 'c' : '') }
		if (isSiteUpdate()) {
			d.permutation = gpermutation;
		}
		s += new Table(b, e.data, d).html()
		if (e.addon) {
			if (o.summaryid) {
				s += `<span id='${o.summaryid}'>`;
			}
			s += e.addon;
			if (o.summaryid) {
				s += `</span>`;
			}
		}
	});
	return s;
}

const RECIPE_TYPE_DEFAULT = 0;
const RECIPE_TYPE_ADD_PER_KG = 1;
const RECIPE_TYPE_ONLY_PER_KG = 2;

function recipeColumnsArrayToObject(o) {
	let a, c
	if (Object.hasOwn(o, "columns")) {
		c = o["columns"];
		if (typeof c != 'string') {
			if (Array.isArray(c)) {
				a = {}
				c.forEach((e, i) => {
					e.forEach(e => {
						a[e] = +!i
					})
				});
				o["columns"] = a
			}
			o.columns = JSON.stringify(o.columns)
		}
	}
}

function recipeLoad(o) {
	redirectUrl()
	if (Object.hasOwn(o, "recipeType") && o.recipeType != RECIPE_TYPE_DEFAULT) {
		o.p = addPerKgRecipe(o.p, o.recipeType == RECIPE_TYPE_ADD_PER_KG)
	}

	o.rkgformula = 0;
	o.recipe = 1
	recipeColumnsArrayToObject(o)
	fetchpost('../php/siteupdate.php', o, recipeCallback, o, new Date())
}

function addPerKgRecipe(p, add = true) {
	//from php
	const rfrom = "¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞↉,";
	const mathSymbol = '(?:[-\\d+*\\/().,eE' + rfrom + ']|(?<=[-+*\\/()])\\s+|\\s+(?=[-+*\\/()]))*';
	const pureMathBase = mathSymbol + '[\\d' + rfrom + ']' + mathSymbol;
	let t = p.trim(), s = add ? t : '', b, v;
	t.split(/\n/).forEach((e, i, a) => {
		e = e.trim();
		if (!e.length) {
			return
		}
		b = '#№'.includes(e[0]);
		if (!i && !b) {
			b = true
			e = '#' + e
		}
		if (b) {
			e += ' на кг'
			if (i) {
				s += '\n}'
			}
		}
		s += '\n' + e
		if (b) {
			v = a[i + 1].match(new RegExp(pureMathBase, 'u'))[0].replace(/\s+/, '')
			if (!v.match(new RegExp('^[' + rfrom + '\\d\\.eE]+$', 'u'))) {
				v = '(' + v + ')'
			}
			s += '\n1000/' + v + '{'
		}
	});
	s += '\n}'
	return s
}

function getCookie(cname) {
	let m = document.cookie.match(new RegExp(';\\s*' + cname + '=(.*?)(;|$)'))
	return m ? decodeURIComponent(m[1]) : ''
}

function setCookie(cname, cvalue, exdays = 365) {
	let d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function redirectUrl() {
	let s = location.href, i;
	if (s.startsWith("file:")) {
		i = s.lastIndexOf('/')
		window.location = 'http://localhost' + s.substring(i)
	}
}

function gzinflate(s) {
	return pako.inflateRaw(Uint8Array.fromBase64(s).buffer, { to: 'string' })
}

//output base64, analog php base64_encode(gzdeflate($s, 9));
// o = ['d'].reduce((a, e) => a + `${e}='${gzdeflate(window[e])}'<br>`, '')
// el('p', o + '//')
function gzdeflate(sourceString, maxCompress = 1) {
	const plainBytes = new TextEncoder().encode(sourceString);
	let o = {
		windowBits: -15,
	}
	if (maxCompress)
		o.level = o.memLevel = 9
	const compressedBytes = pako.deflate(plainBytes, o);
	o = compressedBytes.reduce((a, e) => a + String.fromCharCode(e), '')

	// let getByteLength = (str) => new TextEncoder().encode(str).length;
	// console.log("size before", getByteLength(sourceString), "after", getByteLength(btoa(o)))
	return btoa(o);
}

const gCommonDebugOutputname = -1;
function downloadCopyCode(i, buttonIndex) {
	// console.log(i, buttonIndex)
	let a = gSourceCodeSelector, s, j, n, m
	if (a.length <= i) {
		return
	}
	s = a[i].innerHTML.replace(/<(\/?)(div|span|br).*?>/g, m => ['<br>', '</div>'].includes(m) ? '\n' : '')
	const e = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&nbsp;': ' ' };
	s = s.replace(new RegExp(Object.keys(e).join('|'), 'g'), a => e[a])
	if (buttonIndex == 1) {
		navigator.clipboard.writeText(s).then(() => { }, () => alert(gLanguage == 'russian' ? 'невозможно скопировать в буфер обмена' : 'cann\'t copy to clipboard'))
	}
	else {
		n = gSourceCodeFileNames[i]
		if (n === undefined || buttonIndex == gCommonDebugOutputname) {
			if (buttonIndex == gCommonDebugOutputname) {
				n = undefined
			}
			j = s.indexOf('html')
			if (j == -1 || j > 20) {
				if (s.match(/#include/)) {
					n = 'main.cpp'
				}
				else if (m = s.match(/\bclass\s+(\w+)/i)) {
					n = m[1] + '.java'
				}
				else {
					j = s.indexOf('<?php')
					if (j > -1 && j < 20) {
						n = 'sample.php'
					}
				}
			}
			if (!n) {
				n = 'sample.html'
			}
		}
		if (buttonIndex == gCommonDebugOutputname) {
			console.log(i + 'recognized ' + n + ', data ' + gSourceCodeFileNames[i])
		}
		else {
			downloadUTF8(n, s)
		}
	}
}

function setCanvasSize(c, w, h) {
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
	c.style.width = w + "px";
	c.style.height = h + "px";
	// Set actual size in memory (scaled to account for extra pixel density).
	const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	c.width = Math.floor(w * scale);
	c.height = Math.floor(h * scale);
	// Normalize coordinate system to use CSS pixels.
	c.getContext("2d").scale(scale, scale);
}

function getPlantsArray(map = null) {
	let a = [], pfaf, m, edible, berry, plantarium, n, o, f, b, s, j, k;
	const nopfaf = 'nopfaf'
	/*from plants.js
			const edibleFullString = ['съедобные употребляю', 'съедобные не употребляю, не пробовал', 'съедобные не употребляю, не нравится'
			, ['растения с особенностями','ягоды с особенностями','несъедобные, неядовитые']
			, 'ядовитые', 'неизвестные', 'неизвестные съедобность не указана в книгах'];
	 */
	const edibleString = ['1', '0', '2', '3', '-', '?', '??']
	const ir = 7
	const kh = 'Known Hazards'
	const eu = 'Edible Uses'

	gdata.trim().split(/\n\s*\n/).forEach(q => {
		q.split('\n').forEach((e, i) => {
			if (i == 0) {
				pfaf = e.indexOf(nopfaf) == -1
				if (!pfaf) {
					e = e.replace(nopfaf, "").trim()
				}
				if (m = e.match(/\sed(.{1,2})(\s|$)(berry)?/)) {
					e = e.replace(m[0], "")
					if ((edible = edibleString.indexOf(m[1])) == -1) {
						alert("неправильный параметр edible" + e)
						throw 'error' + e.name + ' ' + m[1]
					}
					berry = m[3] !== undefined;
				}
				else {
					alert("не задана съедобность для строки " + e)
					throw 0
				}
				if (m = e.match(/\d+/)) {
					e = e.replace(m[0], "")
				}
				plantarium = m == null ? m : m[0]
				if (e[0] == '?') {
					e = e.substring(1)
					if (gPageName != 'fern') {
						unrecognized.push(e)
					}
				}
				if (e[0] != e[0].toUpperCase()) {
					console.log('1st char is not uppercased ' + e)
				}

				j = e.indexOf('(');
				if (j == -1) {
					n = e.trim()
				}
				else {
					n = e.slice(0, j)
				}
				n = n.trim()
				if (gPageName != 'fern') {
					if (setn.has(n)) {
						console.log('repeat name found ' + n)
					}
					setn.add(n)
				}
				o = {
					t: '', name: e.trim(), latinName: '', latinTitle: /[a-z]/iu.test(e), o: '', '0': '', '1': ''
					, pfaf, plantarium, edible, berry, family: ''
				}

				f = e.slice(0, 1).toUpperCase()
				if (map) {
					j = map.get(f)
					if (j === undefined) {
						j = 0;
					}
					map.set(f, j + 1)
				}
			}
			else if (i < ir) {
				j = e.indexOf('\t');
				k = e.slice(j + 1)
				o.t += '<tr><td>' + e.slice(0, j) + '<td>' + k
				if (i >= ir - 2) {
					j = k.indexOf(' ')
					if (j != -1) {
						k = k.substring(0, j)
					}
					if (i == ir - 1) {
						o.latinName += ' '
					}
					o.latinName += k
				}
				else if (i == ir - 3) {
					o.family = k
				}
			}
			else if ((b = e.startsWith(kh)) || e.startsWith(eu)) {
				s = b ? kh : eu
				o[+!b] = '<p class="pw"><b>' + s + '</b>' + e.slice(s.length)
			}
			else {
				o.o += o.o.length ? '<br>' : '<p class="pw">'
				o.o += e
			}
		})
		a.push(o)
	});
	return a;
}

function referenceFromPlant(e) {
	let refs = ''
	if (e.pfaf) {
		refs += referencePlant('https://pfaf.org/user/plant.aspx?LatinName=' + e.latinName.replace(/\s/, '+'), 'pfaf')
	}
	if (e.plantarium) {
		if (refs) {
			refs += ' '
		}
		refs += referencePlant('https://www.plantarium.ru/page/view/item/' + e.plantarium + '.html', 'plantarium')
	}
	return refs;
}

function imagePlant(s) {
	return '<img src="/img/plants/' + s + '.png" style="vertical-align:middle;">'
}

function referencePlant(u, s) {
	return '<a href="' + u + '" target="_blank">' + imagePlant(s) + '</a>'
}

function imageTag(name, w, aligncenter = true) {
	w /= window.devicePixelRatio;
	let a = aligncenter ? ` style="position:relative;left:${Math.round((800 - w) / 2)}px;"` : '';
	return `<img src="img/${name}"${a} width="${Math.round(w)}"></img>`
}

function imageref(base, name, w, h, shortname) {
	return '<a href="img/' + base + '/o' + (shortname ? shortname : name) + '.jpg" target="_blank"><img src="img/' + base + '/' + name + '.jpg"'
		+ (w | h ? ' style="' : '')
		+ (w ? 'width:' + Math.round(w / window.devicePixelRatio) + 'px;' : '')
		+ (h ? 'height:' + Math.round(h / window.devicePixelRatio) + 'px;' : '')
		+ (w | h ? '"' : '')
		+ '></a>'
}

//like php but has additional glue as the beginning
function implode(a, glue) {
	return a.reduce((a, e) => a + glue + e, '')
}

/*jm & parser_pfc
parse
from recipe string " 2.4 25 2.9 "
site https://health-diet.ru/base_of_food/sostav/40.php
site https://calorizator.ru/product/fruit/banana
site https://fitaudit.ru/food/114334
*/
function getPFCFromString(s) {
	const d = String.raw`(\d+(?:\.\d*)?)`, na = ['белки', 'жиры', 'углеводы', 'пищевые волокна']
	let a = s.replaceAll(',', '.').toLowerCase().split('\n').filter(e => !e.match(/^\s*$/)), b = [], m, i, j
	if (a.length == 1) {
		m = a[0].match(new RegExp(Array(3).fill(d).join('\\s+')))
		return m == null ? m : m.slice(1, 4)
	}
	for (i = 0; i < na.length; i++) {
		for (j = 0; j < a.length; j++) {
			m = a[j].match(new RegExp(na[i] + '.*?' + d))
			if (m) {
				b.push(m[1])
				break
			}
		}
		if (i < 3 && j == a.length) {
			return null
		}
	}
	return b
}
/*
function getPFCFromString(s) {
	const d = String.raw`(\d+(?:\.\d*)?)`, na = ['белки', 'жиры', 'углеводы'], n = '(' + na.join('|') + ')'
	let a = s.replaceAll(',', '.').toLowerCase().split('\n').filter(e => !e.match(/^\s*$/)), b, m, i
	if (a.length == 1) {
		m = a[0].match(new RegExp(Array(3).fill(d).join('\\s+')))
		return m == null ? m : m.slice(1, 4)
	}
	a = a.filter(e => e.match(new RegExp(n)))
	if (a.length == 3) {
		b = Array(3).fill(null)
		a.forEach(e => {
			m = e.match(new RegExp(n + '.*?' + d))
			i = na.indexOf(m[1])
			b[i] = m[2]
		})
		return b.some(e => e === null) ? null : b
	}
	else {
		return null
	}
}*/

//cooking & poverty
function leastSquares(x, y) {
	let sxy = 0, sx = 0, sy = 0, sx2 = 0, i
	const n = x.length
	for (i = 0; i < n; i++) {
		sxy += x[i] * y[i]
		sx += x[i]
		sy += y[i]
		sx2 += x[i] * x[i]
	}
	i = (n * sxy - sx * sy) / (n * sx2 - sx * sx)
	return [i, (sy - i * sx) / n]
}

function getLeastSquaresDataError(s) {
	return { ok: false, s: (gLanguage == 'russian' ? 'ошибка' : 'error') + ' ' + s }
}

const LEASTSQUARES_XY = 0
const LEASTSQUARES_MASS_CALORIE = 1
const LEASTSQUARES_MASS_TIME = 2

//need to add expressionEstimator to script if use this function (call evaluateString)
function getLeastSquaresData(id, se) {
	return getLeastSquaresDataFromString(el(id).value.trim(), se)
}

//need to add expressionEstimator to script if use this function (call evaluateString)
function getLeastSquaresDataFromString(str, se) {
	let x = [], y = [], n, a, b, e, i, v, mm = e => e.map((s, i) => ({ s, i: i + 1 })).filter(e => !/^\s*$/.test(e.s));
	//allow data in one row "1155.6 -0.1 1911.1 0.3 1225.3 -0.1"
	a = mm(str.split(/\n/))
	if (a.length == 1) {
		b = str.split(/\s+/)
		if (str.length && b.length % 2 == 0) {
			a = []
			for (i = 0; i < b.length; i += 2) {
				a.push(b[i] + ' ' + b[i + 1])
			}
			a = mm(a)
		}
		else {
			return getLeastSquaresDataError((gLanguage == 'russian' ? 'массив данных имеет' : 'data array has') + ' '
				+ (gLanguage == 'russian' ? ['нечётную', 'нулевую'] : ['odd', 'zero'])[b.length ? 0 : 1] + ' ' + (gLanguage == 'russian' ? 'длину' : 'length'))
		}
	}
	for (e of a) {
		i = e.i;
		n = e.s.trim().split(/\s+/)
		if (n.length != 2) {
			if (n.length == 1 && se == LEASTSQUARES_MASS_CALORIE && i == a.length) {//last string can be only length
				n[1] = "0"
			}
			else {
				return getLeastSquaresDataError((gLanguage == 'russian' ? 'неверное число данных в строке' : 'wrong number of data in the string') + ' ' + i)
			}
		}
		for (b = 0; b < 2; b++) {
			v = evaluateString(n[b])
			if (v === false) {
				a = (gLanguage == 'russian' ? 'неверно задан параметр' : 'wrong parameter') + ' '
				v = gLanguage == 'russian' ? ['x', 'y', 'масса', 'калории', 'масса', 'время'] : ['x', 'y', 'mass', 'calorie', 'mass', 'time']
				console.log(se, b, 3 * se + b)
				return getLeastSquaresDataError(a + v[2 * se + b] + ' ' + (gLanguage == 'russian' ? 'строка' : 'line') + ' ' + i)
			}
			(b ? y : x).push(v)
		}
	}
	if (se == LEASTSQUARES_MASS_CALORIE) {
		a = x;
		[x, y] = [y.slice(0, -1), x.map((e, i, a) => a[i + 1] - e).slice(0, -1)]
	}
	//console.log(x,y)
	i = getLeastSquaresObject(x, y, se)
	if (se == LEASTSQUARES_MASS_CALORIE) {
		i.mass = a;
	}
	return i
}

function getLeastSquaresObject(x, y, se) {
	let n, a, b, e, s;
	n = x.length
	if (n < 2) {
		if (se == LEASTSQUARES_MASS_CALORIE && n == 0) {
			n = 1
		}
		return getLeastSquaresDataError((gLanguage == 'russian' ? ['нет данных', 'мало данных'] : ['no data', 'little data'])[n])
	}
	else {
		if (se == LEASTSQUARES_MASS_TIME) {
			x.forEach((e, i) => {
				if (e <= 0) {
					return getLeastSquaresDataError((gLanguage == 'russian' ? 'масса должна быть&ge;0 строка ' : 'mass must be&ge;0 line ') + (i + 1))
				}
			})
			y.forEach((e, i) => {
				if (e <= 0) {
					return getLeastSquaresDataError((gLanguage == 'russian' ? 'время должно быть&ge;0 строка ' : 'time must be&ge;0 line ') + (i + 1))
				}
			})
			x.map((e, i) => [e, i]).sort((a, b) => a[0] - b[0]).forEach((e, i, ar) => {
				if (i && e[0] == ar[i - 1][0]) {
					a = e[1] + 1
					b = ar[i - 1][1] + 1
					return getLeastSquaresDataError((gLanguage == 'russian' ? 'найдены две одинаковые массы строки ' : 'found two identical masses on lines ') + Math.min(a, b) + ', ' + Math.max(a, b))
				}
			})
		}
	}
	[a, b] = e = leastSquares(x, y)
	//console.log(x,y,a,b)
	if (se == LEASTSQUARES_XY) {
		s = 'y = ' + polynomialString(e, 2, 'x');
	}
	else if (se == LEASTSQUARES_MASS_CALORIE) {
		s = '&delta; = ' + polynomialString(e, 2, 'c', '&middot;') + ' = A&middot;c+B';
	}
	else if (se == LEASTSQUARES_MASS_TIME) {
		s = 't = ' + polynomialString(e, 0, 'm') + ' = ' + polynomialString(e, 1, 'm')
	}
	e = gLanguage == 'russian' ? 'возможна ошибка' : 'possible error'
	if (se == LEASTSQUARES_MASS_CALORIE) {
		n = 0
		if (a <= 0) {
			n = 1
			s += ' ' + e + ' a&le;0'
		}
		if (b >= 0) {
			s += (n ? ',' : ' ' + e) + ' b&ge;0'
		}
	}
	else if (se == LEASTSQUARES_MASS_TIME) {
		n = 0
		if (a < 0) {
			n = 1
			s += ' ' + e + ' a&lt;0'
		}
		if (b < 0) {
			s += (n ? ',' : ' ' + e) + ' b&lt;0'
		}
	}
	return { ok: true, s, a, b, x, y }
}

function getLeastDataTableString(o, n) {//n==se
	const g = 5
	const kg = 6
	const kcal = 7
	const variable = 8
	let s = o.s, q, w, p, j, fr
	if (o.ok && n == LEASTSQUARES_MASS_CALORIE) {
		w = [];
		['mass', 'x', 'y'].forEach((e, i) => {
			//ignore last value for mass, mass.length=x.length+1=y.length+1
			let a = o[e], b = i ? a : a.slice(0, -1), m = expectedValue(b), v = Math.sqrt(variance(b, m))
			w.push([m, v], [m - 3 * v, m + 3 * v])
		})
		let em = w[0][0]
		let ec = w[2][0]
		let c0 = -o.b / o.a
		//' &blank; '
		const se = ' &nbsp; '
		const setex = '\\quad'
		let fe = (e, tex) => {
			if (!Array.isArray(e)) {
				e = [e]
			}
			return e.map(e => e.toExponential(5)).join(tex ? setex : se)
		}
		let fn = (e, digits, add, tex) => {
			if (!Array.isArray(e)) {
				e = [e]
			}
			if (!Array.isArray(digits)) {
				digits = Array(e.length).fill(digits)
			}
			return e.map((e, i) => formatNumber(e, digits[i]) + add).join(tex ? setex : se)
		}

		const brackets = 0
		let f2 = (e, t) => (t ? '&mu;' : '&sigma;') + (brackets ? '(' + e + ')' : '<sub>' + e + '</sub>')
		let E = (e) => f2(e, 1)
		let S = (e) => f2(e, 0)

		q = [];
		['m', 'c', '&delta;'].forEach((e, i) => {
			for (j = 0; j < 2; j++) {
				if (i == 0) {
					p = j == 1 ? 1 : [1, 3]
				}
				else {
					p = i == 1 ? 0 : 3
				}
				q.push([E(e) + (j ? '&plusmn;3' : se) + S(e), lnLeastSquares[i == 1 ? kcal : kg], p, w[2 * i + j]])
			}
		})
		const EC = 0
		const C0 = 1
		const EM = 2
		j = 31.4
		const P = [ec, c0, j * em]
		const A = [E('c'), 'C<sub>0</sub>', j + E('m')]
		q.push([j + E('m'), lnLeastSquares[kcal], j * em])
		const sp = "<span style='display: inline-block;position: relative;vertical-align: middle;font-size: 42px;margin-top: -7px;'>";
		fr = (i, j) => [`100${sp}(</span><span class="fracb"><span>${A[i]}</span><span>${A[j]}</span></span> -1${sp})</span>`, '-', 1, '%', 100 * (P[i] / P[j] - 1)]
		// fr = (i, j) => [`100<span class="fracb"><span>${A[i]}-${A[j]}</span><span>${A[j]}</span></span>`, '-', 1, '%', 100 * (P[i] / P[j] - 1)]
		const co = 'корреляция'//'correlation';
		n = [
			['n', '-', o.mass.length - 1]
			, ['10<sup>6</sup>A', lnLeastSquares[g] + '/1000' + lnLeastSquares[kcal], o.a * 10 ** 6]
			, ['10<sup>3</sup>B', lnLeastSquares[g], o.b * 10 ** 3]
			, ...q
			, ['C<sub>0</sub>', lnLeastSquares[kcal], c0]
			//, ['0.8C<sub>0</sub>' + se + '0.7C<sub>0</sub>', lnLeastSquares[kcal], [c0 * .8, c0 * .7]]
			, ['C<sub>0</sub>/' + E('m'), lnLeastSquares[kcal] + '/' + lnLeastSquares[kg], 2, c0 / em]
			, fr(EC, C0)
			, fr(EC, EM)
			, fr(C0, EM)
			, [co + '(&delta;,c)', '-', 3, correlation(o.x, o.y, w[2][0], w[4][0], w[2][1], w[4][1])]
		]
		const dp = [0, '']
		s += n.reduce((a, e) => {
			q = dp.map((v, j) => e.length > j + 3 && e[j + 2] ? e[j + 2] : v)
			p = e[e.length - 1]
			return a + '<tr><td>' + [e[0], e[1], fn(p, ...q, 0), fe(p, 0)].join('<td>')
		}
			, '<table class="table_common table_color table_border"><thead><th>' +
			lnLeastSquares.slice(variable, variable + 4).join('<th>') + '</thead>') + '</table>'

		//todo just for easy to find
		const tex = 0
		if (tex) {
			let u = {
				'&middot;': '\\cdot ', '&mu;': '\\mu', '&sigma;': '\\sigma', '&delta;': '\\delta', '&plusmn;': '\\pm'
				, '<sub>(.+?)<\\/sub>': '_$1', '<sup>(.+?)<\\/sup>': '^$1'
				, [sp + '(.+?)<\\/span>']: (_, v) => v == '(' ? '\\left(' : '\\right)'
				, '<span class="fracb"><span>(.+?)<\\/span><span>(.+?)<\\/span><\\/span>': '\\frac{$1}{$2}'
				, ' ': '\\ '//this replace should goes after <span...
			}
			let le = 4;
			w = `\n\\hline\n`
			let s1 = n.reduce((a, e) => {
				e = e.map(e => {
					return typeof e == 'string' ? e.replaceAll(se, setex) : e
				})
				t = e[0];
				for ([k, v] of Object.entries(u)) {
					t = t.replace(new RegExp(k, 'gi'), v)
				}
				if (e[3] == '%') {
					e[3] = '\\%'
				}
				if (t.startsWith(co)) {
					t = `${co}$${t.slice(co.length)}$`
				}
				else {
					t = '$' + t + '$'
				}
				q = dp.map((v, j) => e.length > j + 3 && e[j + 2] ? e[j + 2] : v)
				p = e[e.length - 1]
				return a + w + [t, e[1], fn(p, ...q, 1), fe(p, 1)].join(' & ') + ' \\\\'
			}, `\\begin{center}\n\\begin{tabular}{ ${'|c'.repeat(le) + '|'} }` + w +
			lnLeastSquares.slice(variable, variable + le).map(e => `\\textbf{${e}}`).join(' & ') + ' \\\\') + w + `\\end{tabular}\n\\end{center}`
			latexTableJoin(s1)
			//console.log(s1)
			//navigator.clipboard.writeText(s1).then(() => console.log('copied to clipboard'), () => console.log('error'))
		}
	}
	return s
}

function expectedValue(a) {
	return a.length ? a.reduce((a, b) => a + b) / a.length : NaN
}

function variance(a, ev) {
	return a.reduce((a, e) => a + (e - ev) ** 2, 0) / a.length
}

function correlation(a, b, eva, evb, sigmaa, sigmab) {
	if (eva === undefined) {
		eva = expectedValue(a)
		evb = expectedValue(b)
		sigmaa = Math.sqrt(variance(a, eva))
		sigmab = Math.sqrt(variance(b, evb))
	}
	return a.reduce((a, e, i) => a + (e - eva) * (b[i] - evb), 0) / (a.length * sigmaa * sigmab)
}

//need to add expressionEstimator to script if use this function
function evaluateString(s) {
	try {
		return ExpressionEstimator.calculate(s)
	}
	catch (ex) {
		if (ex instanceof ReferenceError) {
			console.log('aslov need to include expressionEstimator.js to use this function')
		}
		return false
	}
}

//from solve_power234.js where done for complex numbers (modified)
function polynomialString(a, type = 1, v = 'x', mul = '*') {
	//console.log(a)
	const q = ['1', '1e+0', '-1', '-1e+0']
	let j = a.length, r = a.reduce((a, e, i) => {
		j--
		if (e == 0) {
			return a;
		}
		let s;
		if (type == 0) {
			s = formatNumber(i ? e : 1 / e, 3)
		}
		else if (type == 1) {
			s = formatNumber(e, 4)
		}
		else {
			s = e.toExponential()
		}
		if (s[0] != '-' && a.length) {
			a += '+'
		}

		if (type == 0 && i == 0) {
			a += v + (s == '1' ? '' : '/' + s)
		}
		else {
			if (j == 0 || !q.includes(s)) {
				a += s
				if (j) {
					a += mul
				}
			}
			else if (q.slice(2).includes(s)) {
				a += '-'
			}
			if (j != 0) {
				a += v + (j == 1 ? '' : '^' + j)
			}
		}
		return a;
	}, '')
	return r.length ? r : '0'
}

function isLocal() {
	return !isRemote()
}

function isRemote() {
	return window.location.host.includes('slovesnov')
}

/*cooking, calorie_reduction
todo 5sep25{
проверить пшеничная km=2.5
проверить манка km=2.5
горох
}

макароны открытам 235мл/100г в конце 137 воды остаётся, 4+помещивание+6+отстаивание4
макароны было 10+4пз

насыпная плотность семечек инет .4 моя .384
	// { name: gGroatsE ? 'wheat groats1' : 'пшеничная полтавская', p: 11.5, f: 1.3, c: 67.9, km: 4, rho: .568, cm: 'зам пз 10+10' }
	// , { name: gGroatsE ? 'wheat groats2' : 'пшеничная увелка', p: 12, f: 1, c: 66, km: 4, rho: .787, cm: 'зам пз 10+10' }

https://rusautomation.ru/articles/nasypnaya-plotnost-sypuchikh-materialov/
насыпная плотность https://www.ekotsentr.ru/data/svoistva.pdf
насыпная плотность https://www.pereezd.net.ua/sypuchie_gruzy.html гороха 725

как готовить рекомендации по пшеничным из рецептов
https://calorizator.ru/article/food/porridge-cooking
горох https://www.bolshoyvopros.ru/questions/3815255-skolko-nuzhno-vody-chtoby-svarit-stakan-gorohovoj-krupy.html
горох http://localhost/index.php?texts_recipe,russian 50->98
? - пока нет моих рецептов
*/
const gGroatsE = typeof gLanguage != 'undefined' && gLanguage == 'english'
const gGroats = [
	{ name: gGroatsE ? 'wheat groats' : 'пшеничная', p: 11.8, f: 1.2, c: 67, km: 2.5, rho: .678, cm: '?зам пз 10+10' }
	, { name: gGroatsE ? 'pearl' : 'перловка', p: 9.3, f: 1.2, c: 69, km: 2.25, rho: .828, cm: 'зам пз 10+10' }
	, { name: gGroatsE ? 'millet' : 'пшено', p: 11.5, f: 3.3, c: 64.8, km: 4, rho: .780, cm: 'зам пз 10+10' }
	, { name: gGroatsE ? 'pea' : 'горох', p: 23, f: 1.6, c: 48.1, km: 2.5, rho: .725, cm: 'зам пз 10+10' }
	, { name: gGroatsE ? 'rice' : 'рис', p: 7, f: 1, c: 71, km: 4.5, rho: .690, cm: 'зам пз 10+10' }
	, { name: gGroatsE ? 'semolina' : 'манка', p: 10.3, f: 1, c: 67.4, km: 5.7, rho: .680, cm: 'зам пз 10+10' }
	, { name: gGroatsE ? 'corn grits' : 'кукурузная', p: 8.3, f: 1.2, c: 75, km: 2.5, rho: .7/*inet */, cm: '?зам пз 10+10' }
	, { name: gGroatsE ? 'buckwheat' : 'гречка', p: 12.6, f: 3.3, c: 60.7, km: 2.5, rho: .660, cm: '?зам з/пз 10+10/0+0' }
	, { name: gGroatsE ? 'macaroni' : 'макароны', p: 10.4, f: 1.1, c: 71.5, km: 2.35, rho: .66, cm: '?чтобы вода покрыла, пз 10+10' }
	, { name: gGroatsE ? 'rolled oats' : 'геркулес', p: 12, f: 6, c: 51, km: 5.7, rho: .532, cm: 'пз 10+10/3+6 долг/быстр варки' }
]

function prepareGGroats() {
	gGroats.forEach(e => {
		let b, kv = e.kmEnd = e.km
		e.cal = e.p * 4 + e.f * 9 + e.c * 4
		//set kv kmEnd
		if (typeof e.kmEnd == 'string') {
			b = e.kmEnd.split(/\s+/)
			kv = b[0]
			e.kmEnd = b.length == 1 ? '?' : b[1]
		}
		try {
			b = eval(kv + '*' + e.rho)
			if (isNaN(b)) {
				throw 0
			}
			e.kv = b
		}
		catch {
			e.kv = NaN//'?'
		}
	})
}

function isLeapYear(y) {
	return y % 4 == 0 && (y % 100 != 0 || y % 400 == 0)
}

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function getMaxDaysInMonth(y, m) {
	let days = MONTH_DAYS[m];
	if (m == 1 && isLeapYear(y)) {
		days++;
	}
	return days;
}

function trhasError(entry, resultentry, floor) {
	let error = false, v
	try {
		v = eval(entry.value)
		if (v <= 0 || isNaN(v)) {
			error = true;
		}
	} catch (e) {
		error = true;
	}

	entry.style.color = error ? "red" : "black";
	resultentry.innerHTML = error ? "" : "=" + v.toFixed(floor ? 0 : 2);
	return [error, v]
}

function calorieUpdate(s, p, d) {
	if (isSiteUpdate()) {
		gpagehelp = false
	}
	if (!gpagehelp) {
		el('time').innerHTML = formatNumber((new Date() - d) / 1000, 1)
	}
	id = gpagehelp ? p : 'p'
	if (typeof s != 'string') {
		el(id).innerHTML = s
		return
	}

	if (p === undefined) {
		s1 = recipeParse(s)
		el(id).innerHTML = s1
		if (isSiteUpdate()) {
			finishUpdateCalorie(!s1.startsWith('</table>'))
		}
		return
	}

	try {
		d = JSON.parse(s);
	}
	catch (ex) {
		el(id).innerHTML = ex + '<br>' + s
		return
	}

	o = { border: 1, color: 1, sort: 1 }
	if (p == 'predefined_all' || gpagehelp) {
		title = [['продукт', 'столовая ложка', 'чайная ложка', 'стакан'], ['продукт', 'штука'], ['алиас', 'продукт'], ['категория', 'масса без скорлупы', 'масса со скорлупой'], ['продукт', 'плотность', 'белки', 'жиры', 'углеводы'], ['продукт', 'белки', 'жиры', 'углеводы']]
		t = ['Таблица масс чайной ложки, столовой ложки, стакана.', 'Таблица масс продуктов в штуках.'
			, 'Таблица алиасов (регулярное выражение).', 'Таблица масс яиц по категориям.', 'Таблица продуктов с плотностью &ne; 1.', 'Таблица продуктов без чека.']
		s = ''
		if (gpagehelp) {
			n = p[p.length - 1];
		}
		d.forEach((e, i) => {
			if (gpagehelp) {
				i = +n
			}
			a = [];
			e.forEach((e, j) => {
				if (i >= 1 && i <= 3) {
					if (i == 1) {
						e[1] = formatNumber(e[1], 5)
					}
					else if (i == 3) {
						e[0] = 'С' + (j > 1 ? j - 1 : 'ВО'[j])
						e.push(`${75 - 10 * j} &le; m &lt; ${j ? (85 - 10 * j) : '&infin;'}`)
					}
					a.push(e)
				}
				else {
					a.push([e[0], ...e[1]])
				}
			})
			s += '<h4>' + t[i] + '</h4>' + new Table(title[i], a, o).html()
		})
		el(id).innerHTML = s
		return
	}
	a = [];
	title = ['название', 'белки', 'жиры', 'углеводы', 'ккал/100г', 'мин.остаток%', 'макс.потеря%']
	d.forEach(e => {
		r = e[1] + e[2] + e[3]
		c = [4 * (e[1] + e[3]) + 9 * e[2], r, 100 - r].map(e => Number(e.toFixed(2)))
		a.push(e.concat(c));
	})
	o.number = 1
	el(id).innerHTML = new Table(title, a, o).html()
}

function deltaMass(a) {
	return a.map((e, i, a) => e - a[i - 1]).slice(1)
}

//https://stackoverflow.com/questions/19064352/how-to-redirect-through-post-method-using-javascript/38445519
//redirectPost('http://www.example.com', { text: 'text\n\ntext' });
function redirectPost(url, data) {
	let form = document.createElement('form');
	document.body.appendChild(form);
	form.method = 'post';
	form.action = url;
	for (let name in data) {
		let input = document.createElement('input');
		input.type = 'hidden';
		input.name = name;
		input.value = data[name];
		form.appendChild(input);
	}
	form.submit();
}

/*
	let s = Object.keys(window)
	===== some code =====
	s = Object.keys(window).filter(e => !s.includes(e)).join(' ') || 'no undeclared variables are found'
	console.log(s)
*/
function getInfo() {
	let m = [...new Error().stack.matchAll(/(?:at )?(\w+).*[(\/]([\w.]+):(\d+)/g)][1]
	return m[1] + '() ' + m[2] + ':' + m[3]
}

function latexTableJoin(s1) {
	const columns = [1, 4, 6, 0, 2], ss = ' & ', se = ' \\\\', hl = '\n\\hline\n'
	let d = s1 + String.raw`\begin{center}
\begin{tabular}{ |c|c|c|c| }
\hline
\textbf{переменная} & \textbf{размерность} & \textbf{значение} & \textbf{экспоненциальная форма} \\
\hline
$n$ & - & 152 & 1.52000e+2 \\
\hline
$10^6A$ & г/1000ккал & 307 & 3.06971e+2 \\
\hline
$10^3B$ & г & -575 & -5.74767e+2 \\
\hline
$\mu_m\quad\sigma_m$ & кг & 62\quad2.02 & 6.20085e+1\quad2.01961e+0 \\
\hline
$\mu_m\pm3\sigma_m$ & кг & 55.9\quad68.1 & 5.59497e+1\quad6.80673e+1 \\
\hline
$\mu_c\quad\sigma_c$ & ккал & 1 755\quad853 & 1.75451e+3\quad8.52953e+2 \\
\hline
$\mu_c\pm3\sigma_c$ & ккал & -804\quad4 313 & -8.04353e+2\quad4.31337e+3 \\
\hline
$\mu_\delta\quad\sigma_\delta$ & кг & -0.036\quad0.575 & -3.61842e-2\quad5.75091e-1 \\
\hline
$\mu_\delta\pm3\sigma_\delta$ & кг & -1.761\quad1.689 & -1.76146e+0\quad1.68909e+0 \\
\hline
$29\mu_m$ & ккал & 1 798 & 1.79825e+3 \\
\hline
$C_0$ & ккал & 1 872 & 1.87238e+3 \\
\hline
$C_0/\mu_m$ & ккал/кг & 30.2 & 3.01956e+1 \\
\hline
$100\left(\frac{\mu_c}{C_0}\ -1\right)$ & - & -6.3\% & -6.29546e+0 \\
\hline
$100\left(\frac{\mu_c}{29\mu_m}\ -1\right)$ & - & -2.4\% & -2.43233e+0 \\
\hline
$100\left(\frac{C_0}{29\mu_m}\ -1\right)$ & - & 4.1\% & 4.12266e+0 \\
\hline
корреляция$(\delta,c)$ & - & 0.455 & 4.55287e-1 \\
\hline
\end{tabular}
\end{center}`
	let v = []
	let s = String.raw`\begin{center}
\begin{tabular}{ |${'c|'.repeat(columns.length)} }` + hl
	let a = d.split(/\n/).filter(e => e.length && !/^\\(hline|begin|end)/.test(e))
	let l = a.length / 2
	a.forEach((e, i) => {
		let b = e.replace(se, '').split(ss)
		if (i < l)
			v.push(b)
		else {
			b.unshift(...v[i - l])
			s = columns.reduce((a, e, j) => a + (j ? ss : '') + b[e], s) + se + hl;
		}
	});
	s += String.raw`\end{tabular}
\end{center}`
	//console.log(s)
	navigator.clipboard.writeText(s).then(() => console.log('copied to clipboard'), () => console.log('error'))
}

//color or colorIndex
function createGraphO1(title, color) {
	const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'teal', 'olive', 'maroon', 'navy', 'lime']
	let borderColor = typeof color == 'string' ? color : colors[color % colors.length]
	return {
		label: title
		, fill: false
		, borderColor
		, data: []
	}
}

//parser or labels array see gto.js
function createGraph(n, o, title, type = 'line', parser = 'YYYY-MM-DD') {
	let data = {}, scales = {
		yAxes: [{
			scaleLabel: {
				display: true,
			}
		}]
	}
	if (Array.isArray(parser)) {
		data.labels = parser
	}
	else {
		scales.xAxes = [{
			type: "time",
			time: {
				parser,
				tooltipFormat: 'll',
				unit: 'day'
			}
		}]
	}
	let config = {
		type,
		data,
		scales,
		options: {
			responsive: true,
			scales
		}
	};
	config.options.scales.yAxes[0].scaleLabel.labelString = title
	config.data.datasets = o
	let ctx = el("canvas" + n).getContext("2d");
	window.myLine = new Chart(ctx, config);
}

//divCanvas
function divGraph(i, display = 'none', width = '75%') {
	return "<div id='dc" + i + "' style='width:" + width + ";display:" + display + ";'><canvas id='canvas" + i + "'></canvas></div>"
}

/*
o={
title
color
width default 800
type 'bar' or 'line'
borderWidth default 1
ticksOnlyFirst siteupdate, gto
sameScale siteupdate, gto
min, max siteupdate
}
*/
function createNGraphs(id, names, labels, _data, o) {
	//https://stackoverflow.com/questions/70386467/chart-js-combine-scatter-and-line
	if (names.length != _data.length) {
		alert('error names.length != _data.length')
		throw 0
	}
	//labels.length != _data[0].length it's ok
	const type = o.type ?? 'bar'
	const width = o.width ?? 800
	const borderWidth = o.borderWidth ?? 1
	const color = o.color ?? ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(254, 190, 16)', 'rgb(0,0,255)']
	const cn = color.length
	const ticksOnlyFirst = o.ticksOnlyFirst
	const sameScale = o.sameScale
	let datasets = [], scales = {}, q, min, max
	if (sameScale) {
		if (o.min) {
			min = o.min
			max = o.max
		}
		else {
			q = _data.flat().filter(e => !isNaN(e))
			min = Math.min(...q)
			max = Math.max(...q)
		}
	}
	names.forEach((label, i) => {
		datasets.push({
			label,
			data: _data[i],
			backgroundColor: color[i % cn],
			borderColor: color[i % cn],
			borderWidth,
			yAxisID: 'y' + i,
			tension: .4,//.1 .4 for new version of chart.js
		})
		scales['y' + i] = q = {
			type: 'linear',
			position: i ? 'right' : 'left',
			grid: {
				drawOnChartArea: !i, // only want the grid lines for one axis to show up
			},
		}
		q.display = ticksOnlyFirst ? Boolean(!i) : true
		if (!ticksOnlyFirst)
			q.ticks = { color: color[i % cn] }

		if (sameScale) {
			q.min = min
			q.max = max
		}
	})

	const data = {
		labels,
		datasets
	};

	const config = {
		type,
		data: data,
		options: {
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			stacked: false,
			scales
		},
	};
	if (o.title) {
		config.options.plugins = {
			title: {
				display: true,
				text: o.title
			}
		}
	}
	createChart(id, width, config)
}

function createChart(id, width, config) {
	let i = id + 'chart';
	el(id).innerHTML = `<div style="width:${width}px"><canvas id="${i}"></canvas></div>`
	new Chart(el(i), config)
}
