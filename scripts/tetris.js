const gSize = { x: 10, y: 20 }
const size = 29
const bgcolor = '#e8e4e2'
const sizeOut = [9 * size, gSize.y * size]
const nsng = 'notstart'
startplayers = 1
time = 300
gtetris = []

//gtimer
//gLanguage=0

//order of keys is the same with language
options = [{
	keys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyP', 'KeyN']
	, tetrisonly: 1
	, clockwise: 1
}, {
	keys: ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyZ', 'KeyE', 'KeyR']
	, tetrisonly: 1
	, clockwise: 1
}]
const nkeys = options[0].keys.length

//'new game' should goes after 'pause'
const gl = [['total', 'singles', 'doubles', 'triples', 'tetris', 'pentix'
	, 'move left', 'move right', 'rotate', 'move down', 'move down to the end', 'pause', 'new game', 'settings'
	, 'game type', 'tetris only', 'clockwise', 'press any key', 'duplicate key', 'two players']
	, ['всего', 'одиночные', 'двойные', 'тройные', 'тетрис', 'пентикс'
	, 'переместить налево', 'переместить направо', 'поворот', 'переместить вниз', 'переместить вниз до конца', 'пауза', 'новая игра', 'установки'
	, 'тип игры', 'только тетрис', 'по часовой стрелке', 'нажмите любую клавишу', 'повторяющаяся клавиша', 'два игрока']
]

const lng = gl[+(gLanguage == 'russian')]

function lni(s) {
	let i = gl[0].indexOf(s)
	if (i == -1) {
		console.log('not found ' + s)
	}
	return i
}

function ln(s) {
	return lng[lni(s)]
}

function load() {
	redirectUrl()//for cookie
	i = lni('new game')
	el('p').innerHTML = '<table id="gt" style="margin-left:auto;margin-right:auto;"><tr><td>'
		+ lng.slice(i, i + 2).map((e, i) => '<button class="comboboxbutton" onclick="bclick(this,' + i + ')">' + e + '</button>').join('<br><br>') + '</table>';

	options.forEach(e => e.language = lng)

	i = getCookie(gPageName);
	if (i != '') {
		//assign not all option
		o = JSON.parse(i)
		o.forEach((e, i) => options[i] = e)
		startplayers = o.length
	}

	for (i = 0; i < startplayers; i++) {
		addTetris(i)
	}
	document.body.onkeydown = kdown
}

function addTetris(i, notstart = false) {
	for (let j = 0; j < 2; j++) {
		el('gt').rows[0].insertCell(-1).innerHTML = '<canvas id="c' + (j ? 'o' : '') + i + '" style="border: 1px solid black;"></canvas>'
	}
	//clone object to not change options which will be store as cookie
	let o = Object.create(options[i])
	o.language = lng
	o.notstart = notstart
	gtetris.push(new Tetris('c' + i, 'co' + i, o))
}

function bclick(button, index) {
	let i, s;
	if (index == 0) {
		//if not do blur() then any keydown after click button produce keydown on same button
		button.blur()
		gtetris.forEach(e => e.newGame())
		return
	}
	gtimer = []
	gtetris.forEach(e => {
		i = e.isTimerOn()
		gtimer.push(i)
		if (i) {
			e.stopTimer()
		}
	})

	s = '<table id="t"><tr>'
	for (i = 0; i < gtetris.length; i++) {
		s += '<td>' + ps(i)
	}
	s += '<tr><td colspan=2><label><input type="checkbox"'+ (gtetris.length == 2 ? ' checked' : '') + ' id="twoplayers">' + ln('two players') + '</label>'
	s += '</table>'
	showModal(ln('settings'), s, clickModal,['ok', gLanguage == 'russian' ? 'отмена' : 'cancel'])
}

function ps(p) {
	let m = lni('move left')
	return `<table>` + lng.slice(m, m + 7).reduce((a, e, i) => a + '<tr>'
		+ '<td>' + e + (i == 2 ? '<label><input type="checkbox"'
			+ (gtetris[p].clockwise ? ' checked' : '') + ' id="clockwise' + p + '">' + ln('clockwise') + '</label>' : '')
		+ '<td><input type="text" value="' + gtetris[p].keys[i] + '" readonly onfocus="focusbutton(this)" onblur="blurbutton(this)" onkeydown="inputkdown(event)" id="i' + (p * nkeys + i) + '">', '')
		+ '<tr><td>' + ln('game type') + '<td><label><input type="checkbox" id="tetrisonly' + p + '"'
		+ (gtetris[p].tetrisonly ? ' checked' : '') + '>' + ln('tetris only') + '</label>'
		+ '</table>'
}

function focusbutton(b) {
	gbuttonvalue = b.value
	b.value = ln('press any key')
	getModalButton(0).disabled = true
}

function blurbutton(b) {
	if ([ln('press any key'), ln('duplicate key')].includes(b.value)) {
		b.value = gbuttonvalue
		b.style.color = 'black'
		getModalButton(0).disabled = false
	}
}

function inputkdown(e) {
	let i, k = [], id, b, ok
	e.stopPropagation() //prevents kdown
	id = e.srcElement.id
	b = el(id)
	for (i = 0; i < gtetris.length; i++) {
		k = k.concat(getInputKeys(i))
	}
	i = k.indexOf(e.code)
	if (i == id.slice(1)) {//same input key can be the same, otherwise click many times on input produce error
		i = -1;
	}
	ok = i == -1
	b.style.color = ok ? 'black' : 'red'
	b.value = ok ? e.code : ln('duplicate key')
	getModalButton(0).disabled = !ok
}

function kdown(k) {
	gtetris.forEach(e => e.keyDown(k.code))
}

function getInputKeys(player) {
	let i, k = []
	for (i = 0; i < nkeys; i++) {
		k.push(el('i' + (player * nkeys + i)).value)
	}
	return k
}

function clickModal(n) {
	let o, keys
	if (n==0) {
		//change number of players
		if (el('twoplayers').checked) {
			if (gtetris.length == 1) {
				addTetris(1, true)
				el('t').rows[0].insertCell(-1).innerHTML = ps(1)
				gtimer.push(nsng)
			}
		}
		else {
			if (gtetris.length == 2) {
				gtetris.pop()
				gtimer.pop()
				el('gt').rows[0].deleteCell(-1)
				el('gt').rows[0].deleteCell(-1)
				el('t').rows[0].deleteCell(-1)
			}
		}

		gtetris.forEach((e, i) => {
			keys = getInputKeys(i)
			o = { keys };
			['tetrisonly', 'clockwise'].forEach(e => o[e] = el(e + i).checked)
			e.setOptions(o)
			options[i] = o
		})
		setCookie(gPageName, JSON.stringify(options.slice(0, gtetris.length)))
	}
	gtetris.forEach((e, i) => {
		i = gtimer[i]
		if (i === nsng) {
			e.newGame()
		}
		else if (i) {
			e.startTimer()
		}
	})
}

class Tetris {
	constructor(canvasId, canvasOutId, options) {
		let i
		this.setOptions(options)
		this.cells = []
		for (i = 0; i < gSize.x; i++) {
			this.cells.push(new Array(gSize.y))
		}
		i = document.getElementById(canvasId)
		i.width = gSize.x * size
		i.height = gSize.y * size
		this.c = i.getContext("2d");

		i = document.getElementById(canvasOutId)
		this.co = i.getContext("2d");
		this.interval = 0
		this.lines = new Array(6)

		setCanvasSize(i,sizeOut[0],sizeOut[1])
	
		if (!options[nsng]) {
			this.newGame()
		}
	}

	newGame() {
		let x, y
		this.lines.fill(0);
		for (x = 0; x < gSize.x; x++) {
			for (y = 0; y < gSize.y; y++) {
				// this.cells[x][y] = y>=gSize.y-3 && x>0 ? Math.floor(Math.random()*7) : Tetris.empty
				this.cells[x][y] = Tetris.empty
				this.drawCell(this.c, x, y)
			}
		}
		this.startTimerIfNotRun()
		this.generateNext()
		this.newFigure()
	}

	generateNext() {
		this.next = Math.floor(Math.random() * (this.tetrisonly ? 7 : Tetris.figures.length))
	}

	newFigure() {
		let i, j = this.next
		this.generateNext()
		this.rotationCount = 0
		this.figureIndex = this.next
		i = (Math.max(...Tetris.figures[this.figureIndex].map(e => e[0])) + 1) * size
		this.figure = Tetris.figures[this.figureIndex]
		this.co.fillStyle = bgcolor
		this.co.fillRect(0, 0, sizeOut[0], sizeOut[1])
		this.drawFigure(this.co, false, [(sizeOut[0] - i) / 2, 20])
		const fs = 32;
		const wi = gLanguage == 'russian' ? 160 : 140
		this.co.font = fs + "px serif";
		this.co.fillStyle = 'black'
		//if switch to tetris during the game but already have pentix
		for (i = 0; i < 6 - (this.lines[5] == 0 && this.tetrisonly); i++) {
			this.co.fillText(this.language[i], 0, 200 + fs * i);
			this.co.fillText(formatNumber(this.lines[i]), wi, 200 + fs * i);
		}
		//this.co.fillText('index=' + this.next, 0, 200 + fs * i);

		this.figureIndex = j
		this.figure = Tetris.figures[this.figureIndex].map(e => [e[0] + Math.floor(gSize.x / 2), e[1]])
		if (this.canMove(0, 0)) {
			this.drawFigure(this.c)
		}
		else {
			//may be not need here
			this.drawFigure(this.c)

			this.endGame()
		}
	}

	endGame() {
		this.stopTimer()
	}

	startTimer() {
		this.interval = setInterval(() => this.move(0, 1), time);
	}

	stopTimer() {
		clearInterval(this.interval);
		this.interval = 0
	}

	startTimerIfNotRun() {
		if (!this.interval) {
			this.startTimer()
		}
	}

	isTimerOn() {
		return this.interval != 0
	}

	pauseResume() {
		if (this.interval) {
			this.stopTimer()
		}
		else {
			this.startTimer()
		}
	}

	drawFigure(context, clear = false, add = [0, 0]) {
		this.figure.forEach(e => {
			this.drawCell(context, e[0], e[1], clear ? Tetris.empty : this.figureIndex, add)
		})
	}

	move(dx, dy) {
		if (!this.interval) {
			return
		}
		if (this.canMove(dx, dy)) {
			this.drawFigure(this.c, true)
			this.figure = this.figure.map(e => [e[0] + dx, e[1] + dy])
			this.drawFigure(this.c)
			return
		}
		if (dy == 1 && dx == 0) {
			let c = new Set(), x
			this.figure.forEach(e => {
				let x = e[0]
				let y = e[1]
				this.cells[x][y] = this.figureIndex
				c.add(y)
			})
			this.reset = []
			this.drawFigure(this.c);
			[...c].sort((a, b) => a - b).forEach(y => {
				for (x = 0; x < gSize.x && this.cells[x][y] != Tetris.empty; x++);
				if (x == gSize.x) {
					this.reset.push(y)
				}
			})
			if (this.reset.length) {
				this.resetCount = 0
				this.resetTimer()
			}
			else {
				this.newFigure()
			}
		}
	}

	resetTimer() {
		let x, y, v
		if (!this.resetCount) {
			this.intervalReset = setInterval(() => this.resetTimer(), Tetris.timeReset);
			this.stopTimer()
		}
		this.resetCount++

		this.reset.forEach(y => {
			for (x = 0; x < gSize.x; x++) {
				this.drawCell(this.c, x, y)
			}
			this.c.fillStyle = bgcolor
			x = this.resetCount / Tetris.resetSteps

			v = size * gSize.x / 2
			this.c.fillRect(v * (1 - x), size * y, v * 2 * x, size)

			//this.c.fillRect(0, size*y, size*gSize.x*x, size)
		})
		if (this.resetCount >= Tetris.resetSteps) {
			this.reset.forEach(y => {
				for (; y > 0; y--) {
					for (x = 0; x < gSize.x; x++) {
						this.cells[x][y] = this.cells[x][y - 1]
					}
				}
				for (x = 0; x < gSize.x; x++) {
					this.cells[x][0] = Tetris.empty
				}
			})
			x = this.reset.length
			this.lines[x]++;
			this.lines[0] += x;
			for (x = 0; x < gSize.x; x++) {
				for (y = 0; y < gSize.y; y++) {
					this.drawCell(this.c, x, y)
				}
			}
			this.newFigure()
			clearInterval(this.intervalReset);
			this.startTimer()
		}
	}

	canMoveArray(a) {
		return a.every(e => {
			let x = e[0]
			let y = e[1]
			//allow y<0 if fugure just appeared and user make rotation
			return x >= 0 && x < gSize.x && y < gSize.y && (y < 0 || this.cells[x][y] == Tetris.empty)
		})
	}

	canMove(dx, dy) {
		return this.canMoveArray(this.figure.map(e => [e[0] + dx, e[1] + dy]))
	}

	rotate() {
		if (!this.interval || this.figureIndex == Tetris.square_index) {
			return
		}
		let a = (this.rotationCount * (this.clockwise ? 1 : 3)) % 4, x = this.figure[0][0], y = this.figure[0][1]
		if (this.figureIndex == Tetris.r_index) {//rotation point out of figure
			if (a == 0) {
				x++
				y++
			}
			else if (a == 1) {
				x--
				y++
			}
			else if (a == 2) {
				x--
				y--
			}
			else {
				x++
				y--
			}
		}

		a = this.figure.map(e => this.clockwise ? [x + y - e[1], y - x + e[0]] : [x - y + e[1], x + y - e[0]])

		if (this.canMoveArray(a)) {
			this.rotationCount++
			this.drawFigure(this.c, true)
			this.figure = a;
			this.drawFigure(this.c)
		}
	}

	fullDown() {
		if (!this.interval) {
			return
		}
		let y
		for (y = 1; ; y++) {
			if (!this.canMove(0, y)) {
				break;
			}
		}
		if (y) {
			this.move(0, y - 1)
		}
	}

	drawCell(context, x, y, c, add = [0, 0]) {
		const cl = 155
		const dc = 50
		const w = 4
		if (c === undefined) {
			c = this.cells[x][y]
		}
		let f = (color) => {
			let s = '', i
			for (i = 0; i < 3; i++) {
				s += (i ? ',' : 'rgb(') + ((c % 7 + 1) & (1 << i) ? color : 0)
			}
			return s + ')'
		}
		context.fillStyle = c == Tetris.empty ? bgcolor : f(cl)
		x = size * x + add[0]
		y = size * y + add[1]
		context.fillRect(x, y, size, size)
		if (c != Tetris.empty) {
			this.drawOutBorder(context, x + w + .5, y + w + .5, size - 2 * w - .5, size - 2 * w - .5
				, f(cl + dc), f(cl - dc), w)
		}
	}

	drawOutBorder(context, x, y, width, height, color1, color2, borderWidth) {
		for (let i = 0; i < 2; i++) {
			context.fillStyle = i ? color2 : color1
			context.beginPath();
			if (i) {
				context.moveTo(x + width + borderWidth, y + height + borderWidth)
			}
			else {
				context.moveTo(x - borderWidth, y - borderWidth)
			}
			context.lineTo(x + width + borderWidth, y - borderWidth)
			context.lineTo(x + width, y)
			if (i) {
				context.lineTo(x + width, y + height)
			}
			else {
				context.lineTo(x, y)
			}
			context.lineTo(x, y + height)
			context.lineTo(x - borderWidth, y + height + borderWidth)
			context.fill();
		}
	}

	static get figures() {
		return [
			//4
			[[1, 0], [0, 0], [2, 0], [3, 0]],
			[[1, 0], [0, 0], [2, 0], [1, 1]],
			[[1, 0], [0, 0], [1, 1], [2, 1]],
			[[1, 0], [2, 0], [0, 1], [1, 1]],
			[[1, 0], [0, 0], [0, 1], [1, 1]],
			[[1, 0], [0, 0], [2, 0], [0, 1]],
			[[1, 0], [0, 0], [2, 0], [2, 1]],
			//1
			[[0, 0]],
			//2
			[[0, 0], [1, 0]],
			//3
			[[0, 1], [0, 0], [0, 2]],
			[[0, 1], [0, 0], [1, 1]],
			//5
			[[0, 2], [0, 1], [0, 0], [0, 3], [0, 4]],//11
			[[1, 1], [0, 1], [1, 0], [2, 1], [1, 2]],
			[[0, 1], [0, 0], [0, 2], [0, 3], [1, 0]],
			[[1, 1], [0, 0], [1, 2], [1, 3], [1, 0]],
			[[0, 1], [0, 2], [0, 0], [1, 1], [1, 2]],//15
			[[1, 1], [1, 2], [1, 0], [0, 1], [0, 2]],
			[[1, 1], [1, 2], [0, 0], [1, 0], [2, 0]],//17
			[[1, 1], [1, 2], [0, 0], [1, 0], [2, 1]],
			[[1, 1], [1, 2], [0, 1], [1, 0], [2, 0]],
			[[0, 1], [0, 0], [0, 2], [0, 3], [1, 2]],//20
			[[1, 1], [1, 0], [1, 2], [1, 3], [0, 2]],
			[[0, 1], [0, 0], [0, 2], [1, 3], [1, 2]],
			[[1, 1], [1, 0], [1, 2], [0, 3], [0, 2]],
			[[0, 1], [0, 2], [0, 0], [1, 0], [1, 2]],//24
			[[1, 1], [0, 1], [0, 0], [1, 2], [2, 2]],//25
			[[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],//26
			[[1, 1], [1, 0], [0, 0], [1, 2], [2, 2]],
			[[1, 1], [1, 0], [2, 0], [1, 2], [0, 2]],

		]
	}

	static get empty() {
		return -1
	}

	static get square_index() {
		return 4
	}

	/* xxx
	   x
	   x
	*/
	static get r_index() {
		return 26
	}

	static get timeReset() {
		return 30
	}

	static get resetSteps() {
		return 10
	}

	setOptions(options) {
		['tetrisonly', 'clockwise', 'language', 'keys'].forEach(e => {
			if (e in options) {
				this[e] = options[e]
			}
		})
	}

	keyDown(k) {
		let i = this.keys.indexOf(k)
		if (i != -1) {
			//left, right, rotate, down, fulldown, new game, pause
			if (i == 0) {
				this.move(-1, 0)
			}
			else if (i == 1) {
				this.move(1, 0)
			}
			else if (i == 2) {
				this.rotate()
			}
			else if (i == 3) {
				this.move(0, 1)
			}
			else if (i == 4) {
				this.fullDown()
			}
			else if (i == 5) {
				this.pauseResume()
			}
			else if (i == 6) {
				this.newGame()
			}
		}
		return i != -1
	}
}