gdrag = 0
gd = []
gadd = 0;
gshowhelp = true
gshowhelptimer = 10
const TABLE_ID = 'table'
const XY = ['x', 'y']
const STARTY = 5;
const XT = '3*cos(t)'
const YX = 'tan(x)'
const DIGITS = 6
const IDIGITS = 4
const COLORS = ['black', 'indianred', 'green', 'blue', '#808000', 'orange']
const GRAPH_PARAMETERS = ['0', '2*pi', '5 * 1000'];//min,max,step
const GRAPH_FORMULA = [YX, 'y(x) = ', '3*sin(3*a)', 'r(a) = ', '3*sin(t)', 'y(t) = ', 'x(t) = ']
const INPUT_SEPARATOR = ' - '
const gl = gLanguage == 'russian' ? ['сброс', 'тип', 'стандартный', 'полярный (a - угол)', 'параметрический', 'шагов', 'Вы можете выбрать область построения. Для этого необходимо нажать левую клавишу мыши и затем, таща мышь, выбрать прямоугольник. После того, как левая клавиша мыши будет отпущена программа пересчитает xmin, xmax, ymin, ymax и перерисует график. Можно нажать правую клавишу мыши, чтобы сделать область построения больше.'] :
	['reset', 'type', 'standard', 'polar (a is angle)', 'parametrical', 'steps', 'You can select a rectangle on the screen by pressing left mouse button and drag the mouse. If you release left button, program recalculates xmin, xmax, ymin, ymax and redraw the graph. Press right mouse button to make drawing area bigger.']
const STEPS = 5
const HELP = 6

function load() {
	gt = el(TABLE_ID)
	r = gt.insertRow(-1);
	b = ['plus', 'zoom0', 'zoom1', 'reset']
	s = ['plus.png', 'viewmag+.png', 'viewmag-.png', gl[0]].reduce((a, e, i) => a + '<td><button id="' + b[i] + '" onclick="bclick(this)">'
		+ (e.indexOf('.') == -1 ? e : '<img class="va" src="img/graph/' + e + '">')
		+ '</button> ', '<table class="nm"><tr>');

	gca = el('canvas')
	gc = gca.getContext("2d");
	gc.strokeStyle = 'black';
	gc.lineWidth = 1;

	//set gca width & height
	recountCanvasSizeDraw(false)

	i = gPageType == 0 ? document.getElementsByClassName("main")[0] : document.getElementsByClassName("fullscreen")[1];
	gBGColor = window.getComputedStyle(i, null).getPropertyValue('background-color');
	k = gw / gh
	gRange = [-STARTY * k, STARTY * k, -STARTY, STARTY]

	XY.forEach((e, i) => {
		s += '<td><span class="ml">' + e + '</span>'
		for (j = 0; j < 2; j++) {
			k = 2 * i + j;
			s += ' ' + input('m' + k, '', '', xychanged);
			if (j == 0) {
				s += INPUT_SEPARATOR
			}
		}
	});

	s += '<td><span class="ml" id="m"></span>'

	r.insertCell(-1).innerHTML = s;

	gCells = gt.rows[0].cells.length;
	setM(gRange)
	addRow();
	window.addEventListener('resize', recountCanvasSizeDraw);
	setTimeout(timer1, gshowhelptimer * 1000);
	a = document.querySelectorAll(".content")[0];
	a.style.marginTop = a.style.marginBottom = 0;
}

function timer1() {
	gshowhelp = false
	draw()
}

function draw(ok) {
	gc.fillStyle = gBGColor;
	gc.fillRect(0, 0, gw, gh);
	if (ok === false) {
		return
	}
	gc.setLineDash([]);//solid

	gc.beginPath();
	i = Math.floor(y2Point(0)) + .5
	gc.moveTo(0, i);
	gc.lineTo(gw, i);

	i = Math.floor(x2Point(0)) + .5
	gc.moveTo(i, 0);
	gc.lineTo(i, gh);
	gc.stroke();

	for (j = 1; j < gt.rows.length; j++) {
		i = rowId(j)
		gc.fillStyle = COLORS[i % COLORS.length];
		k = gd[i];
		for (i = 0; i < k.length; i += 2) {
			x = k[i]
			y = k[i + 1];
			if (x >= ga[0] && x <= ga[1] && y >= ga[2] && y <= ga[3]) {
				gc.fillRect(x2Point(x), y2Point(y), 1, 1);
			}
		}
	}

	if (gshowhelp) {
		gc.font = "20px Arial";
		gc.fillStyle = 'black'
		gc.textBaseline = 'top'
		drawMultilineText(gc, gl[HELP], gw / 2, 0, 0)
	}
}

function xychanged(e) {
	ev = e.keyCode
	if (ev >= 37 && ev <= 40) {//arrows
		return
	}
	id = e.target.id
	if (el(id).value.length == 0 || isNaN(pf(id))) {
		el(id).style.color = "red";
		draw(false)
		return
	}
	j = 2 * Math.floor(id.substring(1) / 2)
	ok = pf('m' + j) < pf('m' + (j + 1))
	for (i = 0; i < 2; i++) {
		el('m' + (j + i)).style.color = ok ? "black" : "red";
	}
	if (ok) {
		countGA()
		if (j == 0) {
			countDataX()
		}
	}
	draw(ok)
}

function formulaChanged(e) {
	rformulaChanged(e, 1)
}

function rchanged(e) {
	rformulaChanged(e, 2)
}

function rformulaChanged(e, i) {
	ev = e.keyCode
	if (ev >= 37 && ev <= 40) {//arrows
		return
	}
	countData(e.target.id.substring(i))
	draw()
}

function recountCanvasSizeDraw(_draw = true) {
	let rect = gca.getBoundingClientRect();
	let w = gPageType == 0 ? 786 : el('table').clientWidth-2
	let i = window.innerHeight - rect.top - 4;//-4
	if (i % 2 == 1) {
		i++;
	}
	let h = Math.max(10, i)
	setCanvasSize(gca, w, h)
	gw = w
	gh = h
	if (_draw) {
		draw()
	}
}

function wrapSpan(id, t, dn, c) {
	let s = '<span id="' + id + '"'
	if (dn || typeof c != 'undefined') {
		s += ' style="';
		if (dn) {
			s += 'display:none;'
		}
		if (typeof c != 'undefined') {
			s += 'color:' + c + ';'
		}
		s += '"'
	}
	return s + '>' + t + '</span>'
}

function input(id, value, size, onkeyup) {
	let s = '<input id="' + id + '" type="text" value="' + value + '"'
	if (size !== '') {
		s += ' size="' + size + '"'
	}
	return s + " onkeyup=" + onkeyup.name + "(event)>"
}

function addRow() {
	let i = [], j, k, c, s, n = gadd++;

	//search color index whick appear minimal times
	for (j = 0; j < COLORS.length; j++) {
		i.push([j, 0]);
	}
	for (j = 1; j < gt.rows.length; j++) {
		k = el('ys' + rowId(j)).style.color
		c = COLORS.indexOf(k);
		if (c == -1) {//"#808000"
			c = k.slice(k.indexOf("(") + 1, k.indexOf(")")).split(",");
			k = "#";
			c.forEach(e => {
				k += parseInt(e).toString(16).padStart(2, '0')
			});
			c = COLORS.indexOf(k);
		}
		i[c][1]++;
	}

	c = i.reduce((a, b) => (a[1] < b[1]
		|| (a[0] < b[0] && a[1] == b[1])) ? a : b);
	n = c[0]

	c = COLORS[n % COLORS.length]
	j = 1
	const szi=60
	s = wrapSpan('s' + n, wrapSpan('xs' + n, GRAPH_FORMULA[6], 0, c) + ' ' + input('x' + n, XT, szi, formulaChanged), 1)
		+ ' ' + wrapSpan('ys' + n, GRAPH_FORMULA[1], 0, c) + input('y' + n, YX, szi, formulaChanged)
		+ ' ' + gl[j++] + ' <select id="i' + n + '" onchange="change(this)">'
	for (i = 0; i < 3; i++) {
		s += '<option>' + gl[j++] + '</option>'
	}
	s += '</select>'

	s1 = wrapSpan('as' + n, '', 0)
	for (j = 0; j < 2; j++) {
		s1 += ' ' + input('r' + j + n, GRAPH_PARAMETERS[j], 7, rchanged)
		if (j == 0) {
			s1 += INPUT_SEPARATOR
		}
	}
	s1 += ' ' + gl[STEPS] + ' ' + input('r' + j + n, GRAPH_PARAMETERS[j], 4, rchanged)

	s += wrapSpan('sr' + n, s1, 1)

	s += ' <button id="b' + n + '" onclick="bmclick(this)"'
	if (gt.rows.length == 1) {
		s += ' disabled'
	}
	s += '><img class="va" src="img/graph/minus.png"></button>'

	c = gt.insertRow(-1).insertCell(-1)
	c.innerHTML = s
	c.colSpan = gCells;

	countData(n)
	recountCanvasSizeDraw()
}

function change(e) {
	i = 2 * e.selectedIndex
	j = e.id.substring(1);
	el('y' + j).value = GRAPH_FORMULA[i++]
	el('ys' + j).innerHTML = GRAPH_FORMULA[i++]
	el('s' + j).style.display = e.selectedIndex == 2 ? 'inline' : 'none'
	el('sr' + j).style.display = e.selectedIndex != 0 ? 'inline' : 'none'
	el('y' + j).style.color = "black";

	if (e.selectedIndex == 2) {
		el('x' + j).style.color = "black";
		el('x' + j).value = XT
	}

	if (e.selectedIndex != 0) {
		el('as' + j).innerHTML = ' ' + (e.selectedIndex == 1 ? 'a' : 't')
	}
	countData(j)
	draw();
}

function bclick(e) {
	if (typeof e == 'string') {
		id = e
	}
	else {
		id = e.id
	}
	if (id == 'plus') {
		if (gt.rows.length == 2) {
			//enable 'minus' button
			button2().disabled = false;
		}
		addRow();
	}
	else if (id == 'reset') {
		for (i = gt.rows.length - 1; i > 0; i--) {
			gt.deleteRow(i)
		}
		setM(gRange)
		addRow();
	}
	else {
		b = []
		for (k = 0; k < 3; k += 2) {
			i = (ga[k] + ga[k + 1]) / 2
			j = (ga[k + 1] - ga[k]) / 2 * (id == 'zoom0' ? .5 : 2)
			b.push(i - j, i + j)
		}
		setM(b)
		countDataX()
		draw()
	}
}

function rowId(r) {
	let s = gt.rows[r].cells[0].innerHTML
	let f = 'id="';
	let i = s.indexOf(f) + f.length + 1;
	return s.substring(i, s.indexOf('"', i))
}

//button of second row
function button2() {
	return el('b' + rowId(1))
}

function bmclick(e) {
	i = getRow(e)
	gt.deleteRow(i)
	if (gt.rows.length == 2) {
		//disable 'minus' button
		button2().disabled = true;
	}
	recountCanvasSizeDraw()
}

function getRow(e) {
	let i, p = e;
	do {
		p = p.parentElement;
		if (p.nodeName == 'BODY') {
			throw 0;
		}
	} while (p.nodeName != 'TR' || p.parentElement.parentElement.id != TABLE_ID)

	for (i = 0; i < gt.rows.length; i++) {
		if (p == gt.rows[i]) {
			return i;
		}
	}

	throw 0;
}

function mdown(e) {
	if (e.button == 0) {
		gdrag = 1;
		gdx = e.offsetX + .5
		gdy = e.offsetY + .5
		gc.setLineDash([10, 10]);
		gimage = new Image();
		gimage.src = gca.toDataURL("image/png");
	}
	else if (e.button == 2) {
		bclick('zoom-')
	}
}

function mmove(e) {
	if (typeof ga == 'undefined') {//sometimes fired before load()
		return
	}
	s = ''
	for (i = 0; i < 2; i++) {
		s += XY[i] + ' = ';
		if (i == 0) {
			s += point2x(e.offsetX).toFixed(DIGITS) + ' '
		}
		else {
			s += point2y(e.offsetY).toFixed(DIGITS)
		}
	}
	el('m').innerHTML = s
	if (gdrag) {
		gc.save()
		gc.setTransform(1, 0, 0, 1, 0, 0)
		gc.drawImage(gimage, 0, 0)
		gc.restore()

		x = e.offsetX + .5
		y = e.offsetY + .5
		gc.beginPath();
		gc.rect(Math.min(gdx, x), Math.min(gdy, y), Math.abs(gdx - x), Math.abs(gdy - y));
		gc.stroke();
	}
}

function mup(e) {
	if (gdrag) {
		x = e.offsetX + .5
		y = e.offsetY + .5
		gdrag = 0;
		if (x == gdx || y == gdy) {
			return
		}
		//y max first
		b = [];
		[Math.min(gdx, x), Math.max(gdx, x), Math.max(gdy, y), Math.min(gdy, y)].forEach((e, i) => {
			e -= .5
			b.push(i < 2 ? point2x(e) : point2y(e))
		})
		setM(b)
		countDataX()
		draw()
	}
}

function mout(e) {
	if (typeof ga == 'undefined') {//sometimes fired before load()
		return
	}
	if (gdrag) {
		gc.drawImage(gimage, 0, 0)
		gdrag = 0;
	}
	el('m').innerHTML = ''
}

//prevents context menu on right click
function mcontextmenu(e) {
	e.preventDefault()
}

function pf(id) {
	try {
		return ExpressionEstimator.calculate(el(id).value)
	}
	catch {
		return NaN;
	}
}

function countGA() {
	ga = []
	for (i = 0; i < 4; i++) {
		ga.push(pf('m' + i))
	}
}

function x2Point(x) {
	return gw * (x - ga[0]) / (ga[1] - ga[0])
}

function y2Point(y) {
	return gh * (ga[3] - y) / (ga[3] - ga[2])
}

function point2x(x) {
	return ga[0] + (ga[1] - ga[0]) * x / gw
}

function point2y(y) {
	return ga[2] + (ga[3] - ga[2]) * (1 - y / gh)
}

//xmin,xmax changed recount all y(x)
function countDataX() {
	let i, j, n
	for (i = 1; i < gt.rows.length; i++) {
		j = rowId(i)
		n = el('i' + j).selectedIndex
		if (n == 0) {
			countData(j)
		}
	}
}

function countData(j) {
	gd[j] = [];
	n = el('i' + j).selectedIndex
	e = 0

	//set all colors
	es = []
	for (i = 1; i >= (n == 2 ? 0 : 1); i--) {
		id = XY[i] + j

		try {
			es[i] = new ExpressionEstimator(el(id).value, 'xat'[n])
			o = true;
		}
		catch {
			o = false;
			e = 1
		}
		el(id).style.color = o ? 'black' : 'red'
	}

	if (n != 0) {
		//pf('r0'+j) returns 0 for empty string so check
		m = []
		for (i = 0; i < 2; i++) {
			id = 'r' + i + j
			o = el(id).value.length != 0 && !isNaN(m[i] = pf(id));
			el(id).style.color = o ? 'black' : 'red'
			if (!o) {
				e = 1
			}
		}

		if (m[0] >= m[1]) {
			for (i = 0; i < 2; i++) {
				id = 'r' + i + j
				el(id).style.color = 'red'
			}
			e = 1
		}

		id = 'r2' + j
		steps = pf(id)
		o = steps > 0 && Number.isInteger(steps)
		el(id).style.color = o ? 'black' : 'red'
		if (!o) {
			e = 1
		}
	}

	if (e) {
		return
	}

	if (n == 0) {
		for (i = 0; i < gw; i++) {
			x = point2x(i)
			y = es[1].calculate(x);
			if (vn(y)) {
				gd[j].push(x, y);
			}
		}
	}
	else {
		for (i = 0; i < steps; i++) {
			t = a = m[0] + (m[1] - m[0]) / (steps - 1) * i
			if (n == 1) {
				r = es[1].calculate(a)
				if (vn(r)) {
					gd[j].push(r * Math.cos(a), r * Math.sin(a));
				}
			}
			else {
				x = es[0].calculate(t)
				y = es[1].calculate(t)
				if (vn(x) && vn(y)) {
					gd[j].push(x, y);
				}
			}
		}
	}
}

function vn(a) {
	return typeof a == 'number' && !isNaN(a)
}

function setM(a) {
	a.forEach((e, i) => el('m' + i).value = normalize(e, IDIGITS))
	countGA()
}

function drawMultilineText(ctx, text, maxWidth, x, y) {
	let dy = parseInt(ctx.font)
	let words = text.split(/\s+/);
	let currentLine = words[0];
	for (let i = 1; i < words.length; i++) {
		let word = words[i];
		let width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			drawJustify(ctx, currentLine, maxWidth, x, y)
			y += dy;
			currentLine = word;
		}
	}
	drawJustify(ctx, currentLine, maxWidth, x, y)
}

function drawJustify(ctx, text, maxWidth, x, y) {
	let width = ctx.measureText(text.replace(/\s+/g, '')).width;
	let words = text.split(" ");
	let m = Math.floor((maxWidth - width) / (words.length - 1))
	words.forEach(e => { ctx.fillText(e, x, y); x += ctx.measureText(e).width + m })
}
