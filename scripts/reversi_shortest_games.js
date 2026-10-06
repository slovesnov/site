const gcellSizeStart = gMobile ? 30 : 48;
const gmaxAnimationStep = 10;
const gAnimationStepTime = 50;
gstep = gmaxAnimationStep
//https://thesaurus.altervista.org/reversi?tz=airyqU6pTShgK78C&fl=if#e3
// D3E3F4G3F3C5H3F2C4C3E2E1B3H4H5A3 16turns
gLanguageString = [
	['start', 'new game', 'apply moves', 'new game and apply moves', 'board', 'moves', 'animation', 'possible moves', 'last move', 'reversible disks']
	, ['старт', 'новая игра', 'сделать ходы', 'новая игра и сделать ходы', 'доска', 'ходы', 'анимация', 'возможные ходы', 'последний ход', 'переворачивающиеся диски']
]

function draw(list) {
	ca = el('c')
	c = ca.getContext("2d");
	c.lineWidth = 1;
	bgColor = 'rgb(84,150,108)';
	boardSize = Reversi.boardSize
	diskMargin = gcellSize / 12;
	chipRStart = gcellSize / 2 - diskMargin;
	firstAnimationStep = gstep == 0

	c.beginPath();
	c.fillStyle = gdefaultBGColor;
	c.fillRect(0, 0, ca.width, ca.height);

	k = boardSize * gcellSize;
	c.fillStyle = bgColor;
	c.fillRect(gtopleft, gtopleft, k, k);

	c.fillStyle = 'black';
	c.font = '24px Times New Roman';
	c.textAlign = "center";

	c.strokeStyle = 'black';
	for (i = 0; i < boardSize + 1; i++) {
		j = gtopleft + i * gcellSize + .5
		c.moveTo(j, gtopleft);
		c.lineTo(j, gtopleft + k);

		c.moveTo(gtopleft, j);
		c.lineTo(gtopleft + k, j);
	}
	c.stroke();

	lastmove = firstAnimationStep ? gmove : gr.lastMoveIndex()
	for (i = 0; i < boardSize; i++) {
		for (j = 0; j < 2; j++) {
			c.fillStyle = 'black';
			c.textBaseline = j ? 'top' : 'alphabetic';
			c.fillText(String.fromCharCode('A'.charCodeAt(0) + i), gtopleft + gcellSize * (i + .5), gtopleft + k * j + (j == 0 ? -1 : 1) * 3);
			c.textBaseline = 'middle';
			c.fillText(i + 1, gtopleft + k * j + (j == 0 ? -1 : 1) * 12, gtopleft + gcellSize * (i + .5));
		}

		for (j = 0; j < boardSize; j++) {
			n = Reversi.index(i, j);
			co = gr.board[n]
			if (co == Reversi.empty && lastmove != n) {
				if (isShowPossibleMoves() && !firstAnimationStep && gr.possibleMove(n, gr.move)) {
					c.strokeStyle = gr.move == Reversi.black ? 'black' : 'white';
					c.beginPath();
					r = chipRStart / 4;
					c.arc(gtopleft + gcellSize * (i + .5), gtopleft + gcellSize * (j + .5), r, 0, 2 * Math.PI);
					c.stroke();
				}
				continue
			}

			r = chipRStart;
			if (!firstAnimationStep && isShowReversible() && Array.isArray(list) && list.includes(n)) {
				c.fillStyle = co == Reversi.black ? 'rgb(80,80,80)' : 'rgb(175,175,175)';
			}
			else {
				c.fillStyle = co == Reversi.black ? 'black' : 'white';
				if (firstAnimationStep && n == lastmove) {
					c.fillStyle = gr.move == Reversi.black ? 'black' : 'white';
				}
			}
			c.beginPath();
			c.arc(gtopleft + gcellSize * (i + .5), gtopleft + gcellSize * (j + .5), r, 0, 2 * Math.PI);
			c.fill();

			if (isShowLastMove() && n == lastmove) {
				r = chipRStart;
				x = (gcellSize - r * Math.SQRT2) / (Math.SQRT2 + 2)
				c.fillStyle = 'blue';
				c.beginPath();
				c.arc(gtopleft + gcellSize * (i + 1) - x, gtopleft + gcellSize * (j + 1) - x, x - 1, 0, 2 * Math.PI);
				c.fill();
			}
		}
	}

	ca = el('score')
	c = ca.getContext("2d");
	c.fillStyle = bgColor;
	c.fillRect(0, 0, ca.width, ca.height);
	a = gr.count()
	c.font = '24px Times New Roman';
	c.textAlign = "center";
	c.textBaseline = 'middle';

	for (i = 0; i < 2; i++) {
		c.fillStyle = i ? 'white' : 'black';
		c.beginPath();
		c.arc(gcellSize * (i + .5), gcellSize * .5, chipRStart, 0, 2 * Math.PI);
		c.fill();

		c.fillStyle = !i ? 'white' : 'black';
		c.fillText(a[i], gcellSize * (i + .5), gcellSize * .5 + 2);
	}

}

function getMove(e) {
	let rect = el('c').getBoundingClientRect();
	let x = Math.floor((e.clientX - rect.left - gtopleft) / gcellSize);
	let y = Math.floor((e.clientY - rect.top - gtopleft) / gcellSize);
	if (x < 0 || x >= Reversi.boardSize || y < 0 || y >= Reversi.boardSize) {
		return -1
	}
	return Reversi.index(x, y);
}

function mmove(e) {
	if (isAnimationDrawing() || ((gmove = getMove(e)) == -1)) {
		return;
	}
	list = gr.reversibleDisksList(gmove, false)
	draw(list);
}

function mclick(e) {
	if (isAnimationDrawing() || ((gmove = getMove(e)) == -1)) {
		return;
	}

	if (gr.possibleMove(gmove, gr.move)) {
		list = undefined
		if (isShowAnimation()) {
			gdisks = gr.reversibleDisksList(gmove)
			gstep = 0;
			gt = setInterval(drawanimation, gAnimationStepTime);
			list = gr.reversibleDisksList(gmove, false)
		}
		else {
			gr.makeMove(gmove);
		}
		drawUpdateMovesButtons(list);
	}
	//console.log(gr.movesString())
}

function drawanimation() {
	++gstep;
	ca = el('c')
	c = ca.getContext("2d");
	const r = chipRStart;
	const a = 3 * Math.PI / 4;

	d = Math.acos(1 - 2 * gstep / gmaxAnimationStep)

	gdisks.forEach(e => {
		for (k = 0; k < 2; k++) {
			c.beginPath();
			//gr.move is changed afte makemove
			c.fillStyle = k == (gr.move == Reversi.black) ? 'black' : 'white';
			c.arc(gtopleft + gcellSize * (e[0] + .5), gtopleft + gcellSize * (e[1] + .5), r, a - d, a + d, !k);
			c.fill();
		}
	})

	if (gstep == gmaxAnimationStep) {
		clearInterval(gt);
		gr.makeMove(gmove);
		drawUpdateMovesButtons()
	}
}

function newgame() {
	if (isAnimationDrawing()) {
		return;
	}
	n = Number(el('boardSize').value);
	Reversi.setBoardSize(n)

	gtopleft = 23;
	gcellSize = gcellSizeStart
	//gcellSize=(n==12? 10/12:1)*gcellSizeStart
	i = 2 * gtopleft + n * gcellSize
	setCanvasSize(el('c'), i, i)

	e = el('score')
	setCanvasSize(e, gcellSize * 2, gcellSize)

	gr = new Reversi(gStartPositioin.getIndex());
	// gr.makeMoves('g6g7g8h8i8i9i10j10e4')
	if (isShowAnimation()) {
		gstep = gmaxAnimationStep
	}
	drawUpdateMovesButtons()
}

function applyMoves(p) {
	if (isAnimationDrawing()) {
		return;
	}
	if (p) {
		newgame()
	}
	s = el('moves').value.replace(/\s+/g, '')
	gr.makeMoves(s)
	drawUpdateMovesButtons()
}

function modifyMoves(s, n) {
	let t = ''
	Reversi.splitMoves(s).forEach(e => {
		t += String.fromCharCode(e[0] + n) + (e[1] + n)
	});
	return t
}

function load() {
	['d3e3f3e2f1c4b5d6d7c3f4a6b3', 'd3c4b3c6e6d6f5a2b5f7d7g8'].forEach((e, i) => {
		el('s' + i).innerHTML = '<img src="img/reversi/js' + (i ? 3 : 1) + '.png">' + ' ' + e + ' ' + movesButton(8, i == 0, e);
	})

	a = ['startPositon', 1];
	for (i = 0; i < 6; i++) {
		a.push('<img src="img/reversi/js' + i + '.png">')
	}
	gStartPositioin = new Combobox(a);

	i = el('c')
	i.addEventListener("mousedown", mclick);
	i.addEventListener("mousemove", mmove);

	for (i = 0; i < 8; i++) {
		el('b' + i).addEventListener("click", bclick);
	}

	l = gLanguageString[gLanguage == 'russian' ? 1 : 0];

	['animation', 'possible', 'lastmove', 'reversible'].forEach((e, i) => {
		el('l' + e).innerHTML = l[l.length - 4 + i]
		if (i == 1 || i == 2) {
			el(e).addEventListener("click", draw)
		}
	})


	a = ['start', 'newgame', 'apply', 'clearapply'];
	a.forEach((e, i) => {
		j = el(e)
		j.innerHTML = l[i]
		if (i) {
			j.classList.add('comboboxbutton');
		}
	});

	mo = [
		"", "", "f5g5h4g4f4g3h2i3j4j2g8g1i1k5k1l6",
		"", "", "f5e6d5e4f3d3h6c6c4g2b7a8c2g8h9h1",

		"", "", "e4f4g7d5c4e3e2d3f3f1d1b5a6",
		"", "", "e4d5c4d3e2c2g5b5b3f1b1a6",

		"", "", "d3e3f6c4b3c2e2a4a2d2d1",
		"", "", "d3c4b5c6d7b7e3e8a8b4a4",

		"c2d2e1b3a4b4e4c5c6", "c2b4c5b2b3d2b5b6e4f4", "c2b4a5a4d5d2e1e4f4a6",
		"c2b3a2c5c6d5e4", "c2b5d2c1b2a3b4c5b3e3", "c2b3a4c1d1c5c6e1e3",

		"b1c1d1a3d4d3c4d2a4a2", "b1a1d3d2c1d1a2a3c4d4", "b1c1d1a1a3d4",
		"a1c4d4a2b4d3d2b1a3", "b1a4d2d1a3a2c1a1d3", "a1a2c1c4a3"]
	for (j = 0; j < 3; j++) {
		[0, 1, 3, 4].forEach(i => {
			mo[i + 6 * j] = modifyMoves(mo[3 * 6 + i], 3 - j)
		});
	}

	mof = [
		37, 30, 2, 2, 72, 13,
		37, 30, 4, 2, 72, 1,
		36, 28, 1, 2, 66, 7,
		16, 7, 2, 2, 24, 5,
		4, 4, 1, 1, 1, 1,
	]
	maxBoardSize = mo.length / 6 * 2 + 2


	s = ''
	for (j = maxBoardSize; j >= 4; j -= 2) {
		s += '<option value="' + j + '">' + l[a.length] + ' ' + j + 'x' + j + '</option>'
	}
	e = el('boardSize')
	e.innerHTML = s;
	e.selectedIndex = 2;


	i = document.getElementsByClassName("fullscreen")[0];
	//i=document.getElementsByClassName("main")[0];
	gdefaultBGColor = window.getComputedStyle(i, null).getPropertyValue('background-color');

	newgame();

	/*	
	const b=[Reversi.BLACK_ONLY,
			Reversi.WHITE_ONLY,
			Reversi.BLACK_AND_WHITE];
		for (j = 0; j <mo.length/6 ; j++) {
			Reversi.setBoardSize(2*(mo.length/6+1-j))
			for (i = 0; i < 6; i++) {
				r = new Reversi(i < 3 ? 1 : 3);
				r.makeMoves(mo[i+6*j])
				if (!r.isEnd()) {
					throw 0
				}
				if (r.endGameType() != b[i % 3]) {
					console.log(b)
					throw 0
				}
			}
		}
	// */

	e = el('t');
	k = 0;
	for (j = 0; j < mo.length / 3; j++) {
		r = e.insertRow(-1)
		standard = !(j % 2)
		boardSize = maxBoardSize - 2 * Math.floor(j / 2)
		r.insertCell(-1).innerHTML = boardSize + 'x' + boardSize + ' <img src="img/reversi/js' + (standard ? 1 : 3) + '.png" class="i">'
		for (i = 0; i < 3; i++) {
			s = mo[k];
			moves = Reversi.splitMoves(s).length;
			s += movesButton(boardSize, standard, s);
			[s, moves, mof[k]].forEach(a => r.insertCell(-1).innerHTML = a)
			k++;
		}
	}

}

function movesButton(boardSize, standard, turns) {
	return '<button class="comboboxbutton moves" onclick="tclick(' + boardSize + ',' + standard + ',\'' + turns + '\')">*</button>';
}

function tclick(boardSize, standard, turns) {
	el('boardSize').selectedIndex = (maxBoardSize - boardSize) / 2;
	gStartPositioin.setIndex(standard ? 1 : 3)
	el('moves').value = turns;
	applyMoves(true);
}

function bclick(e) {
	if (isAnimationDrawing()) {
		return;
	}
	i = Number(e.target.id.substring(1))
	if (i < 4) {
		gr.undoredo(i < 2, i == 0 || i == 3)
	}
	else {
		gr = gr.transform([1, 3, 6, 4][i - 4])
	}
	drawUpdateMovesButtons()
}

function updateButtons() {
	b = ['undoall', 'undo', 'redo', 'redoall', 'rotate90', 'rotate270', 'updown', 'leftright']
	for (i = 0; i < b.length; i++) {
		d = isAnimationDrawing() || i < 4 && !gr.isUndoredoPossible(i < 2)
		e = el('b' + i)
		e.setAttribute("src", 'img/reversi/' + (b[i] + (d ? 'd' : '')) + '.png')
		e.disabled = d
	}
}

function isAnimationDrawing() {
	return gstep < gmaxAnimationStep
}

function isShowAnimation() {
	return el('animation').checked
}

function isShowReversible() {
	return el('reversible').checked
}

function isShowPossibleMoves() {
	return el('possible').checked
}

function isShowLastMove() {
	return el('lastmove').checked
}

function updateMoves() {
	l = gLanguageString[gLanguage == 'russian' ? 1 : 0]
	s = gr.movesString()
	if (s.length) {
		s = l[l.length - 5] + " " + s
	}
	el('smoves').innerHTML = s
}

function drawUpdateMovesButtons(l) {
	draw(l)
	updateButtons()
	updateMoves();
}