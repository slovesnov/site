const G = 9.81
const R = 30
const PARABOLA = 0
const CIRCLE = 1
const LINEAR = 2
const H = 300
const W = 600
const T = Math.sqrt(8 * H / G)
const BG = '#e8e4e5'
const minDelay = 20
const maxDelay = 400
const valueDelay = maxDelay - minDelay - 100
const BALLS_COLOR = ['#800000', '#008000', '#000080', '#800080']
x0 = R + 1
y0 = H + R
gprevindex = 0

/* https://libraryofjuggling.com

резиновые надувные шарики
носки
из куска ткани (4 детали)
из куска ткани (2 детали)
*/

function load() {
	e = el('speed')
	e.min = minDelay
	e.max = maxDelay
	e.value = valueDelay //((+e.min)+(+e.max))/2

	time = -1
	timer(true)

	Q = []
	//half shower
	k = 1 / 4
	k1 = 1 / 6
	a = [createTrack(
		{ type: PARABOLA, h: 1, x: k }
		, { type: CIRCLE, x: 1 - k }
		, { type: PARABOLA, h: 1 / 2, x: 1 - k - k1 }
		, { type: CIRCLE, x: k + k1 }
		, 3
	)]
	Q.push(a)

	//cascade
	k = 1 / 3
	k1 = 1 / 5
	a = [createTrack(
		{ type: PARABOLA, h: 1, x: k }
		, { type: CIRCLE, x: 1 - k1, t: .5 }
		, { type: PARABOLA, h: 1, x: 1 - k }
		, { type: CIRCLE, x: k1, t: .5 }
		, 3
	)]
	Q.push(a)

	//shower
	k = 1 / 5
	a = [createTrack(
		{ type: PARABOLA, h: 1, x: k }
		, { type: LINEAR, x: 1 - k, t: .5 }
		, 3
	)]
	Q.push(a)

	//fountain
	k = 1 / 7
	k1 = 1 / 5
	t1 = .5
	for (i = 0; i < 2; i++) {
		o = createTrack(
			{ type: PARABOLA, h: 1, x: k + k1 }
			, { type: CIRCLE, x: k, t: .5 }
			, 2)
		o1 = copyTrack(o, 1 - k1 - 2 * k, 1, .5 * (1 + i))
		a = [o, o1];
		Q.push(a)
	}

	//tennis
	k = 1 / 3
	k1 = 1 / 5
	o = createTrack(
		{ type: PARABOLA, h: 2 / 3, x: k }
		, { type: CIRCLE, x: 1 - k1, t: .5 }
		, { type: PARABOLA, h: 2 / 3, x: 1 - k }
		, { type: CIRCLE, x: k1, t: .5 }
		//,3
		, [1 / 3 - 1 / 2, 2 / 3 - 1 / 2]
	)
	k = 0
	o1 = createTrack(
		{ type: PARABOLA, h: 1, x: k }
		, { type: PARABOLA, h: 1, x: 1 - k }
		, [1 / 5]
	)
	a = [o, o1];
	Q.push(a)

}

function draw() {
	steps = 60
	time++
	ca = el('canvas')
	ctx = ca.getContext('2d');
	ctx.translate(x0, 0)

	headCenterX = W / 2;
	headCenterY = 100;
	headRX = 50
	headRY = 75
	shouldersUpWidth = 200;
	shouldersDownWidth = 180;
	shouldersHeight = 200;
	shouldersYShift = 30;

	n = el('s').selectedIndex
	a = Q[n]
	for (k = 0; k < 2; k++) {
		i = (time - !k) % steps / (steps - 1);
		a = Q[k == 0 ? gprevindex : n]
		l = 0;
		a.forEach(e => {
			for (j = 0; j < e.balls; j++) {
				[xc, yc] = coordinates(e, i + j / e.balls + (e.ballTimeShift ? e.ballTimeShift[j] : 0));
				ctx.fillStyle = ctx.strokeStyle = k ? BALLS_COLOR[(l++) % BALLS_COLOR.length] : BG;
				ctx.beginPath();
				ctx.arc(xc, yc, R + !k, 0, 2 * Math.PI);
				ctx.fill()
			}
		})

		if (!k) {
			ctx.lineWidth = 1
			ctx.strokeStyle = "#000"
			ctx.beginPath();
			ctx.ellipse(headCenterX, headCenterY, headRX, headRY, 0, 0, 2 * Math.PI);
			ctx.moveTo(headCenterX - shouldersUpWidth / 2, headCenterY + headRY + shouldersYShift + .5);
			ctx.lineTo(headCenterX + shouldersUpWidth / 2, headCenterY + headRY + shouldersYShift + .5)
			ctx.lineTo(headCenterX + shouldersDownWidth / 2, headCenterY + headRY + shouldersYShift + shouldersHeight + .5)
			ctx.lineTo(headCenterX - shouldersDownWidth / 2, headCenterY + headRY + shouldersYShift + shouldersHeight + .5)
			ctx.closePath()
			ctx.moveTo(0, y0 + .5)
			ctx.lineTo(W, y0 + .5)
			/*
						ctx.moveTo(W/5, y0 -100)
						ctx.lineTo(W/5, y0 + 100)
			
						ctx.moveTo(2*W/5, y0 -100)
						ctx.lineTo(2*W/5, y0 + 100)
			
						ctx.moveTo(4*W/5, y0 -100)
						ctx.lineTo(4*W/5, y0 + 100)
			
						ctx.moveTo(3*W/5, y0 -100)
						ctx.lineTo(3*W/5, y0 + 100)
			*/

			ctx.stroke();
		}

	}
	gprevindex = n//need if combobox changed
	ctx.resetTransform()
	// ctx.rect(.5,.5,ca.width-1,ca.height-1)
	// ctx.stroke();
}

function speed() {
	timer(false)
	timer(true)
}

function mdown(e) {
	//console.log(e)
	bclick()
}

function timer(start) {
	if (start) {
		//max->min,min=>max t=max+min-v
		let v = el('speed').value
		gInterval = setInterval(draw, maxDelay + minDelay - v);
		el('sspeed').innerHTML = v
	}
	else {
		clearInterval(gInterval)
		gInterval = 0
	}
	el('b').innerHTML = '⏵⏸'[+start]
}

function bclick() {
	timer(!gInterval)
}

function createTrack(...a) {
	let n = a.pop(), b = Array.isArray(n)
	let o = a
	o.balls = b ? n.length : n
	o.forEach(e => {
		e.x *= W;
		if (e.y === undefined) {
			e.y = 0
		}
		e.y += y0
		if (e.h !== undefined) {
			e.h *= H
		}
		if (e.t === undefined) {
			e.t = e.type == PARABOLA ? Math.sqrt(8 * e.h / G) : T
		}
		else {
			e.t *= T
		}
	});
	if (b) {
		o.ballTimeShift = n
	}
	let sum = o.reduce((a, e) => a + e.t, 0)
	o.forEach(e => e.t /= sum)
	return o
}

function copyTrack(_o, xshift, invert, timeshift) {
	let o = [..._o];
	o.invert = invert
	o.timeshift = timeshift * T
	o.balls = _o.balls
	o.forEach(e => e.x += xshift * W)
	return o
}

//t=only fractional part of a number
function coordinates(o, t) {
	if (o.timeshift) {
		t += o.timeshift
	}
	t = t - Math.floor(t)
	if (o.invert) {
		t = 1 - t
	}
	let i, j, q = 0
	for (i = 0; i < o.length; i++) {
		j = q
		q += o[i].t
		if (t <= q) {
			break;
		}
	}
	t = (t - j) / (q - j) //0..1
	j = (i + 1) % o.length

	let type = o[i].type
		, x0 = o[i].x, y0 = o[i].y
		, x1 = o[j].x, y1 = o[j].y
	//console.log(i,o[i])
	if (type == PARABOLA) {
		return [x0 + (x1 - x0) * t, y0 + 4 * o[i].h * t * (t - 1)]
	}
	else if (type == CIRCLE) {
		const r = Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2) / 2
		return [(x0 + x1) / 2 + Math.sign(x0 - x1) * r * Math.cos(Math.PI * t), (y0 + y1) / 2 + r * Math.sin(Math.PI * t)]
	}
	else {
		return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]
	}
}

/*
-gT^2*t/2+gT^2*t^2/2
gT^2/2(t^2-t)
y=gt^2/2 gT^2/8=h T=sqrt(8h/g) - время полёта

x=vx*t 	vx*T=w vx=w/T

y(0)=y(T)=0
y=vy*t-g*t^2/2
vy*T=gT^2/2 vy=gT/2

t=T/2 y=gT/2*(T/2)-g(T^2/4)/2=gT^2/8=h T=sqrt(8h/g)
Y=h

x0,y0,z0 плечо (координать известны)
x1,y1,z1 локоть (координать нужно найти)
x2,y2,z2 шар/кисть (координать известны)
l1 - длина плеча известно
l2 - длина предплечья+часть ладони известно
(x1-x0)^2+(y1-y0)^2+(z1-z0)^2=l1^2
(x1-x2)^2+(y1-y2)^2+(z1-z2)^2=l2^2

пересечение двух сфер даёт окружность

-2x1x0-2y1y0-2z1z0+2x1x2+...=l1^2-l2^2
*/