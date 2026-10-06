gsquare = 50;//square size
gEdgeWidth = 2;
gssquare = 24;//small square size
gsEdgeWidth = 1;
gphi = Math.PI / 4;
gzk = 0.7
gBR = "rufldb"//base rotates
gHR = "mesxyz"//helper rotates
gpostfix = "2'w"
gTimer = 0
gTotalSteps = 10
gStep = 0
/*
gc - contex
gso - original facets
gstep,gs
gw,gh,gcenter - counted from gsquare,gEdgeWidth
gr - helper array for x,y rotations (not need for z rotation)
go - original points
gp - rotated points
*/

function load() {
	if (gLanguage == 'russian') {
		gl = ['случайный', 'анимация', 'сброс', 'скорость', 'стоп', 'шаблон'
			, 'инверсия', 'тип', 'номер', 'период', 'тождественный', 'ходов', 'ошибка'
			, 'несбалансинрованные скобки'
			, 'кавычка между цифрами'
			, 'повтор кавычки'
			, 'неверный постфикс для скобок'
			, 'пустая строка'
			, 'неизвестный символ'
			, 'модификатор w не используется для'
			, 'повтор постфикса'
		]
	}
	else {
		gl = ['scramble', 'animation', 'clear', 'speed', 'stop', 'template'
			, 'inverse', 'type', 'id', 'period', 'identical', 'turns', 'error'
			, 'unbalanced parentheses'
			, 'quote between digits'
			, 'repeat quote'
			, 'invalid postfix for brackets'
			, 'empty string'
			, 'unknown symbol'
			, 'wide isn\'t alowed for'
			, 'duplicate postfix'
		]
	}
	i = gl.length - (65 - 50)
	INVERSE = i++;
	TYPE = i++;
	ID = i++;
	PERIOD = i++;
	IDENTICAL = i++;
	TURNS = i++;
	ERROR = i++;
	UNBALANCED_PARENTHESES = i++;
	QUOTE_BETWEEN_DIGITS = i++;
	REPEAT_QUOTE = i++;
	INVALID_POSTFIX_FOR_BRACKETS = i++;
	EMPTY_STRING = i++;
	UNKNOWN_SYMBOL = i++;
	WIDE_ISNT_ALOWED_FOR = i++;
	DUPLICATE_POSTFIX = i++;

	//count canvas size gw,gh and gcenter
	r = gsquare * 1.5;
	r1 = r * Math.sqrt(2);
	d = gEdgeWidth;
	gw = Math.floor(2 * r1 + 3 * gsquare * Math.cos(gphi) * gzk + 2 * d)
	gh = Math.floor(2 * r1 + 3 * gsquare * Math.sin(gphi) * gzk + 2 * d)
	gcenter = new Point(r1 + d - r, gw - (1.5 * gsquare + r1 + d))

	//9*gssquare+3*gssquare*Math.cos(gphi)*gzk=gsw
	//gssquare=gsw/(9+3*Math.cos(gphi)*gzk)
	r = Math.floor(gssquare * Math.cos(gphi) * gzk) + 1;
	gsw = 9 * gssquare + 3 * r + 1 + 2 * gsEdgeWidth
	gscenter = new Point(gw + gsw - 6 * gssquare - 3 * r + .5, gh - 6 * gssquare - .5)

	o = el("t");
	r = o.insertRow(-1);
	c = r.insertCell(-1);
	c.innerHTML = '<canvas id="c" width="' + (gw + gsw) + '" height="' + gh + '"></canvas>'

	c = r.insertCell(-1);
	c.rowSpan = 2;
	c.style.paddingBottom = "5px";
	s = '<table class="b">'
	cells = 6;
	for (i = 0; i < cells * 12; i++) {
		j = Math.floor(i / gBR.length)
		if (i % cells == 0) {
			s += '<tr>'
		}
		s += '<td';
		if (i >= 18 && i < 18 + 6 || i >= 36 && i < 36 + 6 || i >= 54 && i < 54 + 6) {
			s += ' class="m"'
		}
		s += '><button class="comboboxbutton w" onclick="brotate(this)">'
		if ((j - 2) % 3 == 0) {
			s += gHR[i % 6].toUpperCase()
		}
		else {
			s += gBR[i % 6].toUpperCase()
			if ((j - 1) % 3 == 0) {
				s += 'w'
			}
		}
		if (j > 2) {
			if (j > 8 || j <= 5) {
				s += "'";
			}
			if (j > 5) {
				s += '<sup>2</sup>'
			}
		}
		s += '</button>'
	}
	s += '</table>'
	c.innerHTML = s

	r = o.insertRow(-1);
	c = r.insertCell(-1);
	c.innerHTML = '<table width="100%"><tr>'
		+ '<td><button id="bscramble" class="comboboxbutton" onclick="scramble()"></button>'
		+ '<td><input type="checkbox" id="animation" checked><label id="lanimation" for="animation"></label>'
		+ '<td><button id="bclear" class="comboboxbutton" onclick="reset()"></button>'
		+ '<td><span id="lspeed"></span> <input type="number" id="speed" min="1" max="100" value="50">'
		+ '<td><button id="bclearip" class="comboboxbutton" onclick="play(1)"></button>'
		+ '<td><button id="bstop" class="comboboxbutton" onclick="stop()" disabled></button>'
		+ '</table>';

	["bscramble", "lanimation", "bclear", "lspeed", "bstop", "ltemplate", "linverse"].forEach((e, i) => {
		el(e).innerHTML = gl[i]
	});

	el("bclearip").innerHTML = gl[2] + '+' + gl[INVERSE];//'+&#9654;'


	gc = el("c").getContext("2d");
	//axis x-right, y-down, z-from me
	gc.strokeStyle = 'black';
	gc.lineWidth = gEdgeWidth;

	gr = [[], []]
	for (k = 0; k < 4; k++) {
		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
				gr[0].push(3 + 16 * j + 4 * i - k)//x
				gr[1].push(48 + j - 16 * i + 4 * k)//y
			}
		}
	}

	reset()
	change();//update permutation type

	allRotationsGetString();

}

function brotate(a) {
	stop()
	rotate(a.innerHTML.toLowerCase())
}

//2d or 3d point
function Point(x, y, z) {
	this.x = x
	this.y = y
	this.z = typeof z == 'undefined' ? 0 : z

	this.projection = function () {
		return new Point(gcenter.x + this.x + this.z * Math.cos(gphi) * gzk, gcenter.y + this.y - this.z * Math.sin(gphi) * gzk);
	}

	this.zbuf = function () {
		return -this.x * Math.cos(gphi) * gzk + this.y * Math.sin(gphi) * gzk + this.z;
	}

	this.add = function (p) {
		this.x += p.x
		this.y += p.y
		this.z += p.z
		return this
	}

	this.mul = function (p) {
		this.x *= p
		this.y *= p
		this.z *= p
		return this
	}
}

function AZ(a, n, z) {
	this.a = a;
	this.n = n;
	this.z = z;
}

function Cube(x, y, z, a) {
	this.x = x
	this.y = y
	this.z = z
	this.i = x + 4 * y + 16 * z
	this.a = a

	this.draw = function (grp) {
		var i, p, j, a, n;

		a = [];
		[[0, 4, 16], [16, 1, 4], [4, 1, 16]
			, [1, 4, 16], [0, 1, 4], [0, 1, 16]
		].forEach((e, n) => {
			i = this.a[this.i + e[0]]
			p = new Point(i.x, i.y, i.z)//need to make copy to avoid reference and change point itself
			p.add(this.a[this.i + e[0] + e[1] + e[2]]).mul(.5)
			p = p.zbuf()

			a.push(new AZ(e, n, p));
		});

		a.sort(function (a, b) {
			return b.z - a.z;
		});

		var f = function (p) {
			if (grp.l[0] && !grp.l[1] && !grp.l[2] //u, u'
				|| !grp.l[0] && grp.l[1] && grp.l[2] //dw, dw'
			) {
				if (p != 1) {//0
					return 1;
				}
			}
			if (grp.l[0] && grp.l[1] && !grp.l[2] //uw, uw'
				|| !grp.l[0] && !grp.l[1] && grp.l[2] //d, d'
			) {
				if (p != 2) {//1
					return 1;
				}
			}

			if (!grp.l[0] && grp.l[1] && !grp.l[2]) { //e, e'
				if (p == 0) {//2
					return 1;
				}
			}
			return 0
		}

		a.forEach((e1, no) => {
			if (no < 3) {//only 3 edges max is visible
				return
			}

			n = e1.n;
			e = e1.a;

			j = 0;
			if (this.z == 0 && n == 4 || this.z == 2 && n == 1) {
				//n==4 ? front :back
				gc.fillStyle = gColor[(n == 4 ? 0 : 4) + this.x * 18 + this.y * 6];
			}
			else if (this.y == 0 && n == 5 || this.y == 2 && n == 2) {
				//n==5 ? up : down
				gc.fillStyle = gColor[(n == 5 ? 2 : 5) + this.x * 18 + this.z * 6];
			}
			else if (this.x == 2 && n == 3 || this.x == 0 && n == 0) {
				//n==3 ? right: left
				gc.fillStyle = gColor[(n == 3 ? 1 : 3) + this.y * 18 + this.z * 6];
			}
			else {
				gc.fillStyle = 'white';
				j = 1;
			}

			if (typeof grp == 'undefined' || grp.l[0] && grp.l[1] && grp.l[2]) {
				if (j) {
					return;
				}
			}
			else if (grp.t == 0) {
				if (j) {
					if ([0, 2].indexOf(this.y) == -1 || [0, 2].indexOf(this.z) == -1
						|| n != 3 || f([1, 2, 0][this.x])) {//n!=3 because needs right white edge
						return;
					}
				}
			}
			else if (grp.t == 1) {
				if (j) {
					if ([0, 2].indexOf(this.x) == -1 || [0, 2].indexOf(this.z) == -1
						|| n != 5 || f(this.y)) {
						return;
					}
				}
			}
			else if (grp.t == 2) {
				if (j) {
					if ([0, 2].indexOf(this.x) == -1 || [0, 2].indexOf(this.y) == -1
						|| n != 4 || f(this.z)) {
						return;
					}
				}
			}

			gc.beginPath();
			j = this.i + e[0]

			p = this.a[j].projection();
			gc.moveTo(p.x, p.y);

			[e[1], e[1] + e[2], e[2]].forEach((v) => {
				p = this.a[j + v].projection();
				gc.lineTo(p.x, p.y);
			});

			gc.closePath();

			gc.fill();
			gc.stroke();//draw edge
		});
	}

}

function getCubes(a) {
	var i, j, k;
	var o = []
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++) {
			for (k = 0; k < 3; k++) {
				o.push(new Cube(k, j, i, a));
			}
		}
	}
	return o
}

function drawCube(grp) {
	var i, j, k, n, x, y, dx, dy;
	i = document.getElementsByClassName("main")[0]
	gc.fillStyle = window.getComputedStyle(i, null).getPropertyValue('background-color');

	gc.fillRect(0, 0, gw, gh);

	if (typeof grp == 'undefined') {
		x = 0;
	}
	else {
		x = grp.t;//0-x 1-y 2-z
	}

	for (i = 2; i >= 0; i--) {
		for (j = 2; j >= 0; j--) {
			for (k = 2; k >= 0; k--) {
				/*x increment
				y,z decrement
				n=x+y*3+z*9
				*/
				if (x == 0) {//ijk = xyz
					n = j;
				}
				else if (x == 1) {//ijk = yxz
					n = i;
				}
				else {//ijk = zxy
					n = k;
				}
				n *= 3;

				n += 2 - (x == 0 ? i : j);
				n += 9 * (x == 2 ? i : k);

				gs[n].draw(grp);
			}
		}
	}

	if (typeof grp != 'undefined') {
		return;//during rotation
	}

	gc.lineWidth = gsEdgeWidth;

	//should be integer for line width=1
	dx = Math.floor(Math.cos(gphi) * gzk * gssquare)
	dy = Math.floor(Math.sin(gphi) * gzk * gssquare)

	for (n = 0; n < 6; n++) {
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {

				if (n == 4 || n == 1) {
					//n==4 ? front :back
					k = (n == 4 ? 0 : 4) + j * 18 + i * 6;
				}
				else if (n == 5 || n == 2) {
					//n==5 ? up : down
					k = (n == 5 ? 2 : 5) + i * 18 + j * 6;//i - x, j - z
				}
				else {
					//n==3 ? right: left
					k = (n == 3 ? 1 : 3) + i * 18 + j * 6;//i - y, j - z
				}
				gc.fillStyle = gColor[k];

				gc.beginPath();

				if (n == 0) {
					x = (-j - 1) * gssquare;
					y = i * gssquare
				}
				else if (n == 1) {
					x = (5 - j) * gssquare + 3 * dx;
					y = i * gssquare - 3 * dy
				}
				else if (n == 2) {
					x = i * gssquare;
					y = (j + 3) * gssquare
				}
				else if (n == 3) {
					x = 3 * gssquare + dx * j
					y = i * gssquare - dy * j
				}
				else if (n == 4) {
					x = j * gssquare
					y = i * gssquare
				}
				else if (n == 5) {
					x = dx * j + i * gssquare
					y = -dy * j
				}

				x = gscenter.x + x
				y = gscenter.y + y

				gc.moveTo(x, y);
				for (k = 0; k < 3; k++) {
					if (k == 0) {
						if (n == 3 || n == 5) {
							x += dx;
							y -= dy;
						}
						else {
							x += gssquare;
						}
					}
					else if (k == 1) {
						if (n == 5) {
							x += gssquare;
						}
						else {
							y += gssquare;
						}
					}
					else {
						if (n == 3 || n == 5) {
							x -= dx;
							y += dy;
						}
						else {
							x -= gssquare;
						}
					}
					gc.lineTo(x, y);
				}

				gc.closePath();

				gc.fill();
				gc.stroke();//draw edge
			}
		}

	}
	gc.lineWidth = gEdgeWidth;

}

/*
t=0 x rotation
t=1 y rotation
t=2 or undefined z rotation
*/
function trajectory(i, v, t) {
	if (typeof t == 'undefined' || t == 2) {
		return trajectoryInner(i, v)
	}

	var j = gr[t].indexOf(i)
	var p = trajectoryInner(j, v)
	var z = (3 - 2 * Math.floor(j / 16)) * gsquare
	var d
	if (t == 1) {
		d = p.y
		p.y = p.z
		p.z += p.z - d + z
	}
	else {
		d = p.x
		p.x = p.z + z
		p.z = d
	}
	return p
}

/*
	rotate whole cube
	v=0..1 - for right rotates F,S,B'
	v=0 -> -1 - for inverted rotates F' or B or S'
	v=0..2 or 0..-2 for rotate 180 degrees
*/
function trajectoryInner(i, v) {
	var a, r;
	var j = Math.floor(i / 16)
	i = i % 16;
	/*
	 0  1  2  3
	 4  5  6  7
	 8  9 10 11
	12 13 14 15
	*/
	var i3 = [8, 1, 7, 14].indexOf(i) == -1;
	var i2 = [5, 6, 9, 10].indexOf(i) == -1;
	var i1 = i2 ? [0, 3, 12, 15].indexOf(i) == -1 : i2;

	var phi = (i1 ? Math.atan(1 / 3) * (i3 ? 1 : -1) : Math.PI / 4) + Math.PI / 2 * v;
	if ([2, 3, 6, 1].indexOf(i) != -1) {
		phi += Math.PI / 2;
	}
	else if ([11, 15, 10, 7].indexOf(i) != -1) {
		phi += Math.PI;
	}
	else if ([12, 13, 9, 14].indexOf(i) != -1) {
		phi += 3 * Math.PI / 2;
	}

	if (i1) {
		r = Math.sqrt(5 / 2)
		a = 1.5
	}
	else {
		a = i2 ? 1.5 : .5
		r = a * Math.sqrt(2);
		if (!i2) {
			a++
		}
	}
	return new Point(a - r * Math.cos(phi), a - r * Math.sin(phi), j).mul(gsquare);
}

function RotateParams(s) {
	this.c0 = s[0];
	this.wide = s.indexOf("w") != -1
	this.invert = s.indexOf("'") != -1
	/*base not inverted rotates 
		f s b' z - same clockwise
		u e' d' y - same clockwise
		r m' l' x - same clockwise		
	*/
	if ('bedml'.indexOf(this.c0) != -1) {
		this.invert = !this.invert
	}
	this.r2 = s.indexOf("2") != -1
	var a = ['lmrx', 'uedy', 'fsbz']//l&r changed in a[0] it need for valid rotations
	for (var t = 0; t < a.length; t++) {
		this.ar = a[t]//t, ar use later
		if (this.ar.indexOf(this.c0) != -1) {
			break;
		}
	}
	this.t = t
	a = a[t]
	//true if layer is rotated
	this.l = [this.c0 == a[0] || this.c0 == a[3]
		, this.wide || this.c0 == a[1] || this.c0 == a[3]
		, this.c0 == a[2] || this.c0 == a[3]
	]

	t = (gStep + 1) / gTotalSteps;
	if (this.invert) {
		t = -t
	}
	if (this.r2) {
		t *= 2;
	}
	this.v = t;

}

function timerRotate() {
	grp = new RotateParams(gRotateItem);
	gp = []
	for (i = 0; i < 64; i++) {
		gp.push(trajectory(i, grp.v, grp.t));
	}

	f = getCubes(gp);//rotated

	b = [[3, 9, 1], [1, 9, 3], [1, 3, 9]][grp.t];
	a = []
	grp.l.forEach((e, n) => {
		if (!e) {
			return
		}
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				a.push(b[0] * i + b[1] * j + b[2] * n)
			}
		}
	});

	gs = []
	for (i = 0; i < f.length; i++) {
		gs.push(a.indexOf(i) == -1 ? gso[i] : f[i])
	}
	drawCube(grp);

	if (++gStep == gTotalSteps) {
		if (++gRotateIndex == gRotate.length) {
			stopTimer()
		}
		else {
			gRotateItem = gRotate[gRotateIndex]
			gStep = 0
		}
		modifyColors(grp)

		gs = gso.slice()
		drawCube();//need to draw small cube
	}

}

function getRAC(grp) {
	var a = [];
	getRA(grp, 1).forEach((e) => {
		a = a.concat(e);
	});
	return a;
}

function getRA(grp, center) {
	//automatically generated arrays by postf() function
	var i, a, b, r = []
	if (grp.t == 0) {
		/*l & r changed it's OK*/
		a = [
		/*l'*/[[14, 16, 5, 0], [4, 17, 12, 2], [15, 51, 39, 3], [8, 10, 11, 6], [33, 45, 21, 9]]
		/*m'*/, [[32, 34, 23, 18], [22, 35, 30, 20], [26, 28, 29, 24]]
		/*r*/, [[13, 49, 37, 1], [31, 43, 19, 7], [50, 52, 41, 36], [40, 53, 48, 38], [44, 46, 47, 42]]
		]
		b = [27, 0, 25]
	}
	else if (grp.t == 1) {
		a = [
		/*u*/[[15, 40, 1, 0], [14, 50, 38, 2], [4, 13, 36, 3], [18, 9, 22, 7], [32, 44, 20, 8]]
		/*e'*/, [[33, 46, 19, 6], [31, 42, 21, 10], [27, 28, 25, 24]]
		/*d'*/, [[17, 53, 41, 5], [35, 47, 23, 11], [51, 52, 37, 12], [49, 48, 39, 16], [45, 34, 43, 30]]
		]
		b = [26, 0, 29]
	}
	else {
		a = [
		/*f*/[[36, 48, 12, 0], [41, 39, 2, 1], [38, 37, 5, 3], [18, 42, 30, 6], [23, 21, 20, 19]]
		/*s*/, [[47, 45, 8, 7], [44, 43, 11, 9], [29, 27, 26, 25]]
		/*b'*/, [[40, 52, 16, 4], [22, 46, 34, 10], [53, 51, 14, 13], [50, 49, 17, 15], [35, 33, 32, 31]]
		]
		b = [24, 0, 28]
	}

	for (i = 0; i < 3; i += 2) {
		if (grp.c0 == grp.ar[i] || grp.c0 == grp.ar[3]) {
			r = r.concat(a[i]);
			if (center) {
				r.push([b[i]]);
			}
		}
	}
	if (grp.wide || grp.c0 == grp.ar[1] || grp.c0 == grp.ar[3]) {
		r = r.concat(a[1]);
	}

	return r;
}

function modifyColors(grp) {
	if (grp instanceof Array) {
		grp.forEach((e) => {
			modifyColors(new RotateParams(e));
		});
		return
	}

	var a, i, n, r, l, j;
	a = getRA(grp)
	if (grp.r2) {
		n = 2;
	}
	else {
		n = grp.invert ? 3 : 1
	}

	for (; n > 0; n--) {
		for (i = 0; i < a.length; i++) {
			r = a[i];
			l = gColor[r[3]]
			for (j = 3; j > 0; j--) {
				gColor[r[j]] = gColor[r[j - 1]]
			}
			gColor[r[0]] = l
		}
	}
}

/*
b="f" or b=["f","u2","dw2"]
*/
function rotate(b, animation) {
	var i
	if (gTimer) {
		return
	}

	if (typeof b == 'string') {
		b = [b]
	}

	if (typeof animation == 'undefined') {
		animation = el('animation').checked
	}
	if (animation) {
		el('bstop').disabled = false
		gRotate = b//array of rotates
		gRotateIndex = 0
		gRotateItem = b[0]
		gStep = 0;
		i = el('speed').value;
		if (i < 1) {
			i = 1
		}
		else if (i > 100) {
			i = 100
		}

		/*
		50a+b=50 => b=50(1-a)
		C=f(1)
		a+b=C b=C-a
		50-50a=C-a
		a=(50-C)/49		
		*/
		c = 500
		a = (50 - c) / 49
		b = 50 * (1 - a)

		gIterationTime = i >= 50 ? 100 - i : a * i + b
		gTimer = setInterval(timerRotate, gIterationTime);
	}
	else {
		modifyColors(b);
		drawCube();
	}
}

//note there is document.clear() so use reset() name
function reset() {
	stop();

	go = []
	for (i = 0; i < 64; i++) {
		go.push(trajectory(i, 0));
	}

	resetGColor()

	gso = getCubes(go);
	gs = gso.slice();
	drawCube();
}

function resetGColor() {
	gColor = []
	for (var i = 0; i < 9; i++) {
		gColor.push("red", "green", "yellow", "blue", "orange", "lightGray")
	}
}

function permutationTypePeriod(ra) {
	var as = gColor.slice();
	var i, j, a, b, bi, s
	resetGColor();
	var q = gColor.slice();

	modifyColors(ra);

	//find full rotation inverse
	s = ''
	ra.forEach((e) => {
		var p = new RotateParams(e);
		if (p.l[1]) {
			s += p.ar[3];
			if (p.invert) {
				s += "'";
			}
			if (p.r2) {
				s += "2";
			}
		}
	});
	if (s.length == 0) {
		b = bi = []
	}
	else {
		b = parse(s);
		bi = parse(inverse(s));
	}

	a = getRAC(new RotateParams("u"));
	var r = gl[0]
	var aa = [gl[IDENTICAL], "pll", "oll"]
	for (j = 0; j < aa.length; j++) {
		if (j == 1) {
			modifyColors(bi);
		}

		for (i = 0; i < gColor.length; i++) {
			if (gColor[i] != q[i] && (j == 0
				|| j == 1 && (gColor[i] == 'yellow' || a.indexOf(i) == -1)
				|| j == 2 && a.indexOf(i) == -1)
			) {
				break;
			}
		}

		if (j == 1) {
			modifyColors(b);
		}

		if (i == gColor.length) {
			r = aa[j];
			break;
		}
	}

	//count period
	resetGColor();
	for (k = 1; k < 1261; k++) {//max 1260 ru2d'bd'
		modifyColors(ra);//add new iteration
		for (i = 0; i < gColor.length && gColor[i] == q[i]; i++);
		if (i == gColor.length) {
			break;
		}
	}

	gColor = as.slice()
	return [r, k];
}

function parse(s) {
	var i, j, k, l, o, inv, n, r
	if ((s.match(/\(/g) || []).length != (s.match(/\)/g) || []).length) {
		return gl[UNBALANCED_PARENTHESES]
	}

	while (s.indexOf('(') != -1) {
		o = s.match(/\(([^\)\(]*)\)([\d'w\s]*)/i);
		i = o[2].indexOf("'");
		inv = i != -1;
		if (inv) {
			if ((o[2].match(/'/g)).length > 1) {
				return gl[INVALID_POSTFIX_FOR_BRACKETS] + ' (' + gl[REPEAT_QUOTE] + ')'
			}
			//"2'2" invalid postfix
			k = o[2].replace(/\s/g, '')
			j = k.indexOf("'");
			if (j != 0 && j != k.length - 1) {
				return gl[INVALID_POSTFIX_FOR_BRACKETS] + ' (' + gl[QUOTE_BETWEEN_DIGITS] + ')'
			}
			o[2] = o[2].replace(/'/g, '')
		}

		if (/^\s*$/.test(o[2])) {//test only spaces tabs or empty string
			n = 1
		}
		else {
			n = Number(o[2]);
			if (isNaN(n)) {
				return gl[INVALID_POSTFIX_FOR_BRACKETS]
			}
		}
		k = s.substr(0, o.index)
		for (i = 0; i < n; i++) {
			if (inv) {
				//check whether string in brackets valid (r''u)'
				l = parse(o[1])
				if (typeof l == 'string') {
					return l
				}
				k += inverse(o[1])
			}
			else {
				k += o[1]
			}
		}
		k += s.substr(o.index + o[0].length)
		s = k;
	}

	s = s.toLowerCase().replace(/\s+/g, '')
	if (s.length == 0) {
		return gl[EMPTY_STRING]
	}
	o = []
	n = 0;
	do {
		r = s[n]
		k = 0
		if (gBR.indexOf(r) == -1) {
			k = 1
			if (gHR.indexOf(r) == -1) {
				return gl[UNKNOWN_SYMBOL] + ' [' + r + ']'
			}
		}

		//read postfix
		for (i = ++n; n < s.length && gpostfix.indexOf(s[n]) != -1; n++);
		p = s.substring(i, n)
		if (k == 1 && p.indexOf("w") != -1) {
			return gl[WIDE_ISNT_ALOWED_FOR] + ' ' + r
		}

		for (i = 0; i < gpostfix.length; i++) {
			if ((p.match(new RegExp(gpostfix[i], 'g')) || []).length > 1) {
				return gl[DUPLICATE_POSTFIX] + ' ' + gpostfix[i]
			}
		}
		o.push(r + p)
	} while (n < s.length)
	return o;
}

function inverse(s) {
	return rotateParameters(s)[0]
}

//"r " -> ["r", " "]
function ih(s) {
	var i = /\s*$/.exec(s).index
	return [s.substring(0, i), s.substring(i)];
}

function rotateParameters(s) {
	var a = [];
	['inverse', 'qtm', 'htm'].forEach((e) => {
		a.push(rotateParametersInner(s, e))
	});
	return a;
}

function rotateParametersInner(s, p) {
	var i, j, k, l, r, b
	if ((i = s.indexOf('(')) != -1) {
		//can't use j=s.lastIndexOf(')') because of fw(RUR'U')fw' U' F(RUR'U')F'
		k = 1;
		for (j = i + 1; j < s.length; j++) {
			if (s[j] == '(') {
				k++;
			}
			else if (s[j] == ')') {
				k--;
			}
			if (k == 0) {
				break;
			}
		}
		var AR = gBR + gHR + (gBR + gHR).toUpperCase() + "("
		for (k = j + 1; k < s.length && AR.indexOf(s[k]) == -1; k++);
		/*
		[(f) 2r] invert [r'(f') 2]
		[(f)2 r] invert [r' (f')2] 
		*/

		if (p == 'inverse') {
			r = ''
			b = ih(s.substring(k))
			r += b[1] + rotateParametersInner(b[0], p);

			b = ih(s.substring(j + 1, k))
			r += b[1] + "("
			if (b[0].indexOf("'") == -1) {
				r += rotateParametersInner(s.substring(i + 1, j), p);
			}
			else {
				r += s.substring(i + 1, j);
				b[0] = b[0].replace("'", "");
			}
			r += ")" + b[0]

			b = ih(s.substring(0, i))
			r += b[1] + rotateParametersInner(b[0], p);
		}
		else {
			r = 0
			b = ih(s.substring(k))
			r += rotateParametersInner(b[0], p);

			b = ih(s.substring(j + 1, k))
			b[0] = b[0].replace("'", "").trim();
			l = b[0] == "" ? 1 : Number(b[0])
			r += rotateParametersInner(s.substring(i + 1, j), p) * l;
			b = ih(s.substring(0, i))
			r += rotateParametersInner(b[0], p);
		}
		return r
	}

	//str="r w'2 d u" allowable string, so use split 2 times
	if (p != 'inverse') {
		s = s.trim();
		if (s == "") {
			return 0
		}
	}
	a = s.split(new RegExp('(?=[' + gBR + gHR + '])', "i"))
	if (p == 'inverse') {
		r = ''
		b = []
		a.forEach((q) => {
			ih(q).forEach((e) => {
				if (e.length != 0) {
					b.unshift(e);
				}
			});
		});
		b.forEach((e) => {
			if (" \t".indexOf(e[0]) != -1) {
				r += e
			}
			else if (e.indexOf("'") == -1) {
				r += e[0] + "'" + e.substr(1)
			}
			else {
				r += e.replace(/'/g, '')
			}
		});
		return r;
	}
	else {
		i = a.length
		if (p == 'qtm') {
			a.forEach((e) => {
				i += e.indexOf("2") != -1
			});
		}
		return i
	}
}

function play(v) {
	stop()
	var r = parse(el("text").value);
	if (typeof r == 'string') {
		return;
	}
	if (v) {
		reset();
		playInverse(0)
	}
	else {
		rotate(r)
	}
}

function change() {
	t = el("text")
	r = parse(t.value);
	e = typeof r == 'string'
	if (e) {
		t.style.color = "red";
		el("errorInfo").innerHTML = gl[ERROR] + ' ' + r;
		el("inverse").value = "";
		["qtm", "htm"].forEach((e) => {
			el(e).innerHTML = ""
		});
	}
	else {
		tp = permutationTypePeriod(r)
		t.style.color = "black";
		el("errorInfo").innerHTML = "";
		a = rotateParameters(t.value)//use t.value leave spaces and lower/upper case
		el("inverse").value = a[0];
		["qtm", "htm"].forEach((e, i) => {
			el(e).innerHTML = '<span style="margin-left:10px;display:inline-block;">' + gl[TURNS] + '</span>' + " " + e + ":" + a[i + 1]
		});
	}
	["bclearip", "bplay", "bplayi"].forEach((i) => {
		el(i).disabled = e
	});
	el("type").innerHTML = e ? '' : (gl[TYPE] + ":" + tp[0])
	el("period").innerHTML = e ? '' : (gl[PERIOD] + ":" + tp[1])
}

function playInverse(animation) {
	stop()
	s = inverse(el("text").value);
	rotate(parse(s), animation)
}

function allRotationsGetString() {
	s = gLanguage == 'russian' ?
		"Шаблоны OLL и PLL. Нажмите на кнопку с ходами или изображение чтобы загрузить шаблон."
		: "OLL and PLL. Click on image or button with moves to load template.";
	s += "<table>"
	cells = 4;
	i = 0;
	gAllRotations.forEach((q) => {
		q.forEach((e) => {
			t = e.split(',')
			if (t[0].charAt(0) == '#') {
				return;//like continue in forEach
			}
			if (i++ % cells == 0) {
				s += '<tr>'
			}
			b = t[4].split('=')[0]
			//Note b.replace isn't common
			s += '<td><table><tr><td>' + getImageString(b, 1) + "<td> " + gl[ID] + ": " + t[0]
				+ "<br> " + gl[PERIOD] + ": " + t[1]
				+ '</table>'
				+ '<button onclick="tclick(this)">' + makeSup(b) + '</button>'
		});
	});
	s += '<table>'
	el("b").innerHTML = s;
}

function tclick(o) {
	//if o is string then click from image
	if (typeof o != 'string') {
		o = o.innerHTML
	}
	el("text").value = o.replace(/<sup>/g, "").replace(/<\/sup>/g, "")
	change()
}

function scramble() {
	stop();
	s = ''
	for (i = 0; i < 20; i++) {
		j = getRandom(2)
		k = getRandom(6)
		s += j == 0 ? gBR[k] : gHR[k]
		k = getRandom(3)
		if (k < 2) {
			s += "'2"[k]
		}
		if (j == 0 && getRandom(2) == 0) {
			s += 'w'
		}
		//s+=' '
	}
	rotate(parse(s), 0)
}

//from bullscows.js
//return random [0..max)
function getRandom(max) {
	return Math.floor(Math.random() * max);
}

//stop if timer running
function stop() {
	if (gTimer) {
		stopTimer()
		//finish last rotate
		gStep = gTotalSteps - 1;
		timerRotate();
	}
}

function stopTimer() {
	clearInterval(gTimer);
	gTimer = 0
	el('bstop').disabled = true
}

/*
//count rotation arrays DONT REMOVE
function	postf(){
	s=""
	o=el("p");
	r=[]
	n=0
	for(k=0;k<gs.length;k++){
		b=gso[k].c;
		t=Infinity;
		j=-1
		for(i=0;i<gs.length;i++){
			a=gs[i].c
			v=Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2)
			if(v<t){
				t=v;
				j=i;
			}
		}
		if(k!=gs[j].index){
			r[gs[j].index]=k
			n++
			s+=gs[j].index+'=>'+k+' '+t.toExponential(2)+"<br>"
		}
	}
	s+="n="+n+"<br>/*"+gRotate+"/ a?=[["
	l=0;
	for(i=0;i<r.length;i++){
		if(typeof r[i]=='undefined'){
			continue;
		}
		
		j=k=r[i]
		s+=k
		l++
		while((j1=r[j])!=k){
			r[j]=undefined
			j=j1;
			s+=","+j
			l++
		}
		if(l%4!=0){
			s='error'+l
			break;
		}
		if(l==n){
			s+=']]'
		}
		else{
			s+="],[";
		}
	}
	if(l!=n){
		s='error253'+l+" "+n
	}
	o.innerHTML=s;
	
}*/