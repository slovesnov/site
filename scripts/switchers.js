const size = 70
const spaceBetween = 40
const gtopleft = spaceBetween / 2
const onColor= '#900C3F';

function getVPoints(x, y, n) {
	let a = [], i;
	let k = 1 - 2 * .28
	if (n == 4) {
		k /= 2
	}
	y += (size - (n - 1) * k * size) / 2
	for (i = 0; i < n; i++) {
		a.push([x, y])
		y += k * size
	}
	return a;
}

function drawSwitch(x, y, index) {
	const r = Math.floor(size * .15);
	let c = el('c').getContext("2d");
	let a, i, n, t, b;
	gc = c

	c.strokeStyle = 'black';
	c.lineWidth = 1;
	c.beginPath();
	x += .5
	y += .5
	c.moveTo(x, y + r);
	c.quadraticCurveTo(x, y, x + r, y)
	c.moveTo(x + r, y);
	c.lineTo(x + size - r, y);
	c.quadraticCurveTo(x + size, y, x + size, y + r)
	c.lineTo(x + size, y + size - r);
	c.quadraticCurveTo(x + size, y + size, x + size - r, y + size)
	c.lineTo(x + r, y + size);
	c.quadraticCurveTo(x, y + size, x, y + size - r)
	c.lineTo(x, y + r);

	let k = .28
	const r1 = 3
	n = gswitcherState.length
	t = index == 0 ? 0 : (index + 1 == n ? 2 : 1)
	if (t == 0) {
		a = [[x + size * k, y + size / 2]].concat(getVPoints(x + size * (1 - k), y, 2))
	}
	else {
		a = getVPoints(x + size * k, y, 2).concat(t == 2 ? [[x + size * (1 - k), y + size / 2]] : getVPoints(x + size * (1 - k), y, 4))
	}
	a.forEach(e => {
		mt(e[0] + r1, e[1])
		c.arc(e[0], e[1], r1, 0, 2 * Math.PI);
	});

	b = gswitcherState[index]
	ls=lampState()
	cl=ls?['black',onColor]:['red','blue']
	st=lampState(index);

	c.stroke();
	if (t == 0 || t == 2) {
		c.beginPath()
		c.strokeStyle = ls ? onColor : (t ? 'red' : 'blue');
		mt(a[t][0], a[t][1])
		v = a[t == 0 ? b + 1 : +b];
		lt(v[0], v[1])
		c.stroke();
		c.strokeStyle = 'black';
	}
	else {
		x1 = [0, 0, 0, 0]
		for (i = 0; i < 2; i++) {
			c.strokeStyle = cl[+(st!=i)];
			c.beginPath()
			for (j = 0; j < 2; j++) {
				v = a[j ? 2 * i + 2 + b : i]
				ml(v[0], v[1], !j)
				for (k = 0; k < 2; k++) {
					x1[i * 2 + k] += v[k] / 2
				}
			}
			c.stroke();
		}
		c.strokeStyle = 'black';
		c.beginPath()
		mt(x1[0], x1[1])
		lt(x1[2], x1[3])
		c.stroke();
	}

	ga = ga.concat(a)

	if (index == 1) {
		for (i = 0; i < 2; i++) {
			c.beginPath()
			c.strokeStyle = cl[+(st!=i)];
			v = ga[i + 1]
			mt(v[0], v[1])
			v = ga[i + 3]
			lt(v[0], v[1])
			c.stroke();
		}
	}
	else if (index > 1) {
		c.beginPath()
		c.strokeStyle = cl[+(!st)];
		j = ga.length - (index == n - 1 ? 2 : 5)
		v = ga[j - 4]
		y1 = v[1]
		x1=x - spaceBetween + spaceBetween / 3
		mt(v[0], y1)
		lt(x1, y1)
		lt(x1, ga[j][1])
		lt(ga[j][0], ga[j][1])
		y = ga[j - 3][1]
		mt(v[0], y)
		lt(x1, y)

		c.stroke();
		c.beginPath()
		c.strokeStyle = cl[+st];

		v = ga[j - 5]
		v1 = ga[j - 2]
		mt(v[0], v[1])
		x1=x - spaceBetween + 2 * spaceBetween / 3
		lt(x1, v[1])
		lt(x1, v1[1])
		lt(v1[0], v1[1])
		v = ga[j - 1]
		mt(v[0], v[1])
		lt(x1, v[1])

		c.stroke();

	}
}

function mt(x, y) {
	ml(x, y, true)
}

function lt(x, y) {
	ml(x, y, false)
}

function ml(x, y, move = true) {
	if (move) {
		gc.moveTo(Math.floor(x) + .5, Math.floor(y) + .5)
	}
	else {
		gc.lineTo(Math.floor(x) + .5, Math.floor(y) + .5)
	}
}

function switcherSelectChanged() {
	gswitcherState = new Array(el('select').selectedIndex + 2).fill(false)
	draw()
}

function lampState(index) {
	let b = true;
	for (let i = 0; i < (index || gswitcherState.length); i++) {
		b ^= gswitcherState[i];
	}
	return b;
}

function draw() {
	ca = el('c')
	n = gswitcherState.length
	const width = n * (size + spaceBetween)
	const height = 140
	setCanvasSize(ca, width, height)
	x = gtopleft
	ga = []
	for (i = 0; i < n; i++) {
		drawSwitch(x, 0, i);
		x += size + spaceBetween
	}
	const rlamp = 24;
	const batterySizeX = 8;
	const yd = height - rlamp - 1;
	const xbattery = (width-2*rlamp- batterySizeX) / 3;//left side of battery
	const xlamp = 2*xbattery+batterySizeX+rlamp;
	gc.font = '20px serif';
	b = lampState();
	if (b) {
		gc.beginPath();
		gc.arc(xlamp, yd, rlamp, 0, 2 * Math.PI)
		gc.fillStyle = "yellow"
		gc.fill()
	}

	gc.beginPath();
	// mt(0,height-1)
	// lt(width,height-1)
	gc.fillStyle = gc.strokeStyle = b ? '#900C3F' : 'blue';
	//gc.fillStyle for fillText
	mt(ga[0][0], ga[0][1])
	lt(0, ga[0][1])
	lt(0, yd)
	lt(xbattery, yd)
	mt(xbattery, yd - 5)
	lt(xbattery, yd + 5)
	gc.stroke()


	gc.beginPath();
	mt(xbattery + batterySizeX, yd)
	gc.fillText('-', xbattery - 7, yd - 6);
	lt(xlamp - rlamp, yd)
	ml(xlamp + rlamp, yd)

	gc.arc(xlamp, yd, rlamp, 0, 2 * Math.PI)

	a = rlamp * Math.SQRT1_2
	ml(xlamp + a, yd + a)
	lt(xlamp - a, yd - a)
	ml(xlamp - a, yd + a)
	lt(xlamp + a, yd - a)

	if (!b) {
		gc.fillStyle = gc.strokeStyle = 'red';
		//gc.fillStyle for fillText
	}
	mt(xbattery + batterySizeX, yd - 10)
	lt(xbattery + batterySizeX, yd + 10)
	gc.fillText('+', xbattery + batterySizeX + 5, yd - 6);

	mt(ga[ga.length - 1][0], ga[ga.length - 1][1])
	lt(width - 1, ga[ga.length - 1][1])
	lt(width - 1, yd)
	lt(xlamp + rlamp, yd)

	gc.stroke()

}

function load() {
	c = el('select')
	s = ''
	for (i = 2; i < 8; i++) {
		s += '<option>' + i + '</option>'
	}
	c.innerHTML = s;
	c.addEventListener("change", switcherSelectChanged);
	c.selectedIndex = 3
	switcherSelectChanged()

	el('c').addEventListener("mousedown", mclick);
}

function mclick(e) {
	rect = el('c').getBoundingClientRect();
	v = e.clientY - rect.top
	if (v >= size) {
		return;
	}
	v = e.clientX - rect.left - gtopleft
	i = v % (size + spaceBetween)
	if (i < size) {
		i = Math.floor(v / (size + spaceBetween))
		if (i < gswitcherState.length) {
			gswitcherState[i] = !gswitcherState[i]
			draw()
		}
	}
}
