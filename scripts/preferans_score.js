gfc = "#F6F4BA"

function load(first) {
	gp = p = 3 + el("players").selectedIndex;//players
	e = el("c");
	gw = w = e.width
	h = e.height
	gr = r = Math.floor(Math.min(w, h) / 15)
	d = 5
	we = 85;
	he = 22;
	ga = a = we + 2 * d
	b = a * h / w
	setCanvasSize(e, w, h)

	gc = c = e.getContext("2d");
	c.fillStyle = gfc;
	c.fillRect(0, 0, w, h);
	if (typeof first == 'undefined') {
		c.translate(.5, .5);
		document.body.addEventListener('keyup', keyup, false);
	}
	else {
		e = el("d");
		while (e.childNodes.length > 1) {
			e.removeChild(e.lastChild);
		}
	}
	c.beginPath();

	c.moveTo(p == 3 ? w / 2 : 0, p == 3 ? h / 2 : 0);
	c.lineTo(w, h);
	c.moveTo(p == 3 ? w / 2 : w, p == 3 ? h / 2 : 0);
	c.lineTo(0, h);

	if (p == 3) {
		c.moveTo(w / 2, 0);
		c.lineTo(w / 2, h / 2);
	}

	for (i = 0; i < 2; i++) {
		k = Math.floor(a * (i + 1))
		j = Math.floor(b * (i + 1))
		if (p == 3) {
			if (i == 0) {
				for (l = 1; l < 3; l++) {
					c.moveTo(l * k, 0);
					m = Math.floor(h / 2 + (w / 2 - l * a) / w * h)
					c.lineTo(l * k, m);
					c.lineTo(w - l * k, m);
					c.lineTo(w - l * k, 0);
				}
			}
		}
		else {
			k = Math.floor(a * (i + 1))
			j = Math.floor(b * (i + 1))
			c.strokeRect(k, j, w - 2 * k, h - 2 * j);
		}

		if (i == 0) {
			for (k = 0; k < p - 2; k++) {
				//vertical vist lines
				l = Math.floor(w / (p - 1) * (k + 1))
				c.moveTo(l, 0);
				c.lineTo(l, j);
				c.moveTo(l, h);
				c.lineTo(l, h - j);

				//horizontal vist lines
				l = Math.floor(h / (p - 1) * (k + 1))
				c.moveTo(0, l);
				c.lineTo(a, l);
				c.moveTo(w, l);
				c.lineTo(w - a, l);
			}
		}
	}
	c.stroke();

	c.beginPath();
	c.arc(Math.floor(w / 2), Math.floor(h / 2), r, 0, 2 * Math.PI);
	c.fill();
	c.stroke();

	for (from = 0; from < 4; from++) {
		if (p == 3 && from == 0) {
			continue;
		}
		for (j = 0; j < p - 1; j++) {
			if (p == 3) {
				if (from == 2) {
					to = j == 0 ? 3 : 1
				}
				else {
					if (j == 0) {
						to = from == 3 ? 1 : 3
					}
					else {
						to = 2
					}
				}
			}
			else {
				if (j == 1) {
					to = (from + 2) % 4
				}
				else if (j == 0) {
					to = from % 2 == 0 ? 3 : 0
				}
				else {
					to = from % 2 == 0 ? 1 : 2
				}
			}

			if (from % 2 == 1) {
				if (p == 3) {
					t = h * (2 * j + 1) / 4 - he / 2
					if (j == 0) {
						k = t;//used later
					}
				}
				else {
					if (j == 0) {
						t = a + d;
					}
					else if (j == 1) {
						t = h / 2 - he / 2
					}
					else {
						t = h - a - he - d;
					}
				}
				l = from == 3 ? d : w - we - d
			}
			else {
				l = w / (p == 3 ? 4 : 6) * (2 * j + 1) - we / 2
				if (from == 0) {
					t = (b - he) / 2
				}
				else {
					t = h - b / 2 - he / 2;
				}
			}
			appendChild(l, t, "v" + from + to);
		}

		if (from % 2 == 0) {
			l = 2 * a
			t = (b - he) / 2 + (from == 0 ? b : h - 2 * b)
		}
		else {
			l = (a - we) / 2 + (from == 3 ? a : w - 2 * a);
			t = p == 3 ? k : 2 * b + d
		}
		appendChild(l, t, "p" + from);

		if (from % 2 == 0) {
			l = 2 * a + (2 * d + he) * w / h
			t = from == 0 ? 2 * b + d : h - 2 * b - he - d;
		}
		else {
			l = from == 3 ? 2 * a + d : 2 * a - we - d + (w - 4 * a)
			t = p == 3 ? k : 3 * b;
		}
		appendChild(l, t, "g" + from);
	}

	score()
}

function appendChild(l, t, id) {
	var f = document.createElement("input");
	f.setAttribute('type', 'text');
	f.style = "left:" + l + "px;top:" + t + "px;width:" + we + "px;height:" + he + "px;"
	f.id = id;
	f.placeholder = textFromId(f)
	el("d").appendChild(f);
}

function textFromId(e) {
	var id = e.id
	var i = id[1] - '0';
	var a = gLanguage == 'russian' ? ["север", "восток", "юг", "запад"] : ["north", "east", "south", "west"]
	var s;
	if (id[0] == 'v') {
		//need to use "\u2192" for placeholder "&rarr;" doesn't work
		s = (gLanguage == 'russian' ? "висты" : "whists") + " " + a[i][0] + "\u2192" + a[id[2] - '0'][0];
	}
	else {
		if (gLanguage == 'russian') {
			s = (id[0] == 'g' ? "гора" : "пуля") + " " + a[i] + "а"
		}
		else {
			s = a[i] + "'s " + (id[0] == 'g' ? "dump" : "pool")
		}
	}
	return s;
}

function bclick(zero) {
	e = el("d");
	for (i = 1; i < e.childNodes.length; i++) {
		j = e.childNodes[i]
		j.value = zero ? 0 : ""
	}
	score()
}

function score() {
	sc = [0, 0, 0, 0]
	pg = []
	v = []
	leningrad = el("type").selectedIndex == 1;

	try {
		for (i = 0; i < 4; i++) {
			if (i == 0 && gp == 3) {
				j = 0;
			}
			else {
				j = numberFromId('p' + i);
				if (leningrad) {
					j *= 2;
				}
				j -= numberFromId('g' + i);
			}
			pg.push(j)

			a = [];
			for (j = 0; j < 4; j++) {
				a.push(i == j || ((i == 0 || j == 0) && gp == 3) ? 0 : numberFromId('v' + i + '' + j))
			}
			v.push(a)
		}

		for (i = 0; i < 4; i++) {
			a = (gp - 1) * pg[i]
			for (j = 0; j < 4; j++) {
				if (j != i) {
					a -= pg[j]
				}
			}
			a /= gp;
			a *= 10;
			for (j = 0; j < 4; j++) {
				a += v[i][j] - v[j][i]
			}
			sc[i] = a;
		}

	}
	catch (err) {
		for (i = 0; i < 4; i++) {
			sc[i] = '?';
		}
	}
	fs = 32;
	gc.font = fs + "px Times New Roman";
	for (i = gp == 3 ? 1 : 0; i < 4; i++) {
		x = w / 2
		y = h / 2
		s = sc[i] + ''
		if (gp == 3 && (j = s.indexOf('.')) != -1) {
			s = s.substr(0, j + 1) + '(' + s[j + 1] + ')'
		}
		if (sc[i] > 0) {
			s = '+' + s
		}
		gc.fillStyle = gfc;
		if (i % 2 == 0) {
			gc.textAlign = "center";
			gc.textBaseline = i == 0 ? "alphabetic" : "top";
			a = gr + 7
			y += a * (i == 0 ? -1 : 1)
			a = w * (a - 1) / h
			b = y;
			if (i == 0) {
				b -= fs;
			}
			//fs+1 because of roundng
			gc.fillRect(x - a, b, 2 * a, fs + 1)
		}
		else {
			gc.textAlign = i == 1 ? "left" : "right";
			gc.textBaseline = "middle";
			a = gr + 7
			x += a * (i == 1 ? 1 : -1);
			if (i == 3) {
				b = ga * 2 + 1;
				c = x - ga * 2 - 1;
			}
			else {
				b = x
				c = gw - 2 * ga - x - 1;
			}
			gc.fillRect(b, y - fs / 2, c, fs)
		}
		gc.fillStyle = "#000000";
		gc.fillText(s, x, y);
	}

}

function numberFromId(id) {
	var e = el(id)
	if (e.value.length == 0) {
		e.style.color = 'black';
		throw 0;
	}
	var v = Number(e.value);//if e.value.length==0 => v=0
	if (isNaN(v) || v < 0 && id[0] != 'g' || !Number.isInteger(v)) {
		e.style.color = 'red';
		throw 0;
	}
	else {
		e.style.color = 'black';
	}
	return v;
}

function keyup(e) {
	if (e.target.tagName.toLowerCase() != 'input') {
		return;
	}
	try {
		//set red/black color
		numberFromId(e.target.id);
	}
	catch (err) {
	}
	//redraw anyway
	score()
}