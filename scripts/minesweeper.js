const bgColor = 'rgb(198,198,198)'
const lineColor = 'rgb(128,128,128)'
const digitColor = ['#0000ff', '#008100', '#ff1300', '#000083', '#810500', '#2a9494', '#000000', '#808080'];
const bigLineWidth = 5;
const mainMargin = 25;
const faceSize = 32;
const faceMargin = bigLineWidth + 2
const statsWindow = [mainMargin + bigLineWidth, bigLineWidth + mainMargin]
const statsWindowHeight = faceSize + 2 * faceMargin;
//startCells[0] set below
const startCells = [null, statsWindowHeight + statsWindow[1] + 20]
//boardOptions[3] - use defined,boardOptions[3][0]=0 copy parameters from current board otherwise from board[3] on dialog popup
const boardOptions = [[9, 9, 10], [16, 16, 40], [30, 16, 99], [0, 0, 0]];

const WHBC = ['width', 'height', 'number of bombs', 'cell size in pixels']
const CHECK_ID = ['open cells automatically', 'set flags automatically']
const gvars=['gFlags','gOpen','gGameState','gTime']

gTime = 0
gCellSize = 24;//22
gBoard = 2
/* global variables
gGameState
ga, gStates
c - canvas
gOpen
*/

const BOMB = -1;

//cell states
const CLOSE = 0;
const FLAG = 1;
const OPEN = 2;

//game states gGameState
const FACE_SAD = 0;
const FACE_SMILE = 1;
const FACE_WIN = 2;

const MAX_WIDTH = 70
const MAX_HEIGHT = 100
const MAX_CELLSIZE = 40

const languageString = [[
	...CHECK_ID
	, 'parameter', 'error', 'is not a number', 'should be'
	, 'Parameters', 'Set up game parameters'
	, ...WHBC
	, 'bombs percent', 'copy parameters from'
	, 'novice', 'beginner', 'expert', 'user defined','undo move', 'Cancel'//should goes after 'copy parameters from' see showDialog()	
], [
	'открывать ячейки автоматически', 'ставить флаги автоматически'
	, 'параметр', 'ошибка', 'не является числом', 'должен быть'
	, 'Параметры', 'Установите параметры игры'
	, 'ширина', 'высота', 'число бомб', 'размер ячейки в пикселях'
	, 'процент бомб', 'копировать параметры из'
	, 'начинающий', 'новичок', 'эксперт', 'пользовательский','отменить ход', 'Отмена'//should goes after 'copy parameters from' see showDialog()
]];


function load() {
	LANGUAGE_ID = new Map()
	languageString[0].forEach((e, i) => LANGUAGE_ID.set(e, i));

	i = LANGUAGE_ID.get('novice')
	s = '<canvas id="c" tabindex=1></canvas><br>'
	for (j = 0; j < 5; j++) {
		q = j < 3 ? 'newgame(' + j + ')': ['showDialog()', 'undo()'][j-3]
		s += '<button class="comboboxbutton" onclick="' + q + '">' + ls(i++) + '</button> '
	}
	//s+='<button class="comboboxbutton" onclick="test()">test</button> <button class="comboboxbutton" onclick="t1()">t1</button>'

	s += '<br>'
	CHECK_ID.forEach((e, i) =>
		s += '<label' + (i ? '' : ' style="margin-right:20px;display:inline-block;margin-top:5px;"') + '><input type="checkbox" id="' + e + '" checked>' + ls(i) + '</label>'
	)

	el('p').innerHTML = s

	c = el('c')
	c.addEventListener('mousedown', mclick)
	document.addEventListener('keydown', kdown);
	
	//prevent context menu popup
	c.addEventListener('contextmenu', e => e.preventDefault())

	CHECK_ID.forEach(e => el(e).addEventListener('change', checkChanged))

	newgame(gBoard)
}

function getStatsWindowWidth() {
	return 2 * (startCells[0] - statsWindow[0]) + gWidth * gCellSize;
}

function getBorderThickness() {
	return Math.max(1, Math.floor(gCellSize / 7))
}

function getFaceCenter() {
	return [statsWindow[0] + getStatsWindowWidth() / 2,
	statsWindow[1] + statsWindowHeight / 2]
}

function drawFace(type) {
	let i, j, d = 4
	let [x, y] = getFaceCenter()

	gGameState = type
	c.fillStyle = "yellow"
	c.lineWidth = 1
	c.beginPath();
	c.arc(x, y, faceSize / 2 - 2, 0, 2 * Math.PI);
	c.fill();

	c.strokeStyle = "black"
	c.stroke();

	//eye center
	const eye = [[x - d, y - d], [x + d, y - d]]
	if (type == FACE_WIN) {
		c.fillStyle = "black"
		c.beginPath();
		c.arc(x - d, y - d, 4, 0, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(x + d, y - d, 4, 0, 2 * Math.PI);
		c.fill();

	}
	else if (type == FACE_SMILE) {
		c.beginPath();
		c.arc(x - d, y - d, 2, 0, 2 * Math.PI);
		c.stroke();
		c.beginPath();
		c.arc(x + d, y - d, 2, 0, 2 * Math.PI);
		c.stroke();
	}
	else {
		d /= 2
		for (i = 0; i < 2; i++) {
			for (j = 0; j < 2; j++) {
				c.moveTo(eye[i][0] - d * (j ? 1 : -1), eye[i][1] - d);
				c.lineTo(eye[i][0] + d * (j ? 1 : -1), eye[i][1] + d);
			}
		}
		c.stroke();
	}

	i = Math.PI / 7
	c.beginPath();
	if (type == FACE_SAD) {
		i = -i;
		c.arc(x, y + 8 + 2, 8, Math.PI - i, i);
	}
	else {
		c.arc(x, y, 8, i, Math.PI - i);
	}
	c.stroke();

	drawOutBorder(x - faceSize / 2, y - faceSize / 2, faceSize, faceSize, "white", lineColor, bigLineWidth)
}

function stopTimerIfRun() {
	if (gTime != 0) {
		clearInterval(gInterval);
		gTime = 0
	}
}

function newgame(board) {
	gBoard = board;
	[gWidth, gHeight, gBombs] = boardOptions[board]

	startCells[0] = statsWindow[0]
	const a = 24 * 8 - gWidth * gCellSize;
	if (a > 0) {
		startCells[0] += a / 2
	}
	stopTimerIfRun();

	ca = el('c')
	ca.width = gWidth * gCellSize + 2 * Math.max(statsWindow[0], startCells[0])
	ca.height = gHeight * gCellSize + startCells[1] + statsWindow[1]

	let w = gWidth * gCellSize + 2 * Math.max(statsWindow[0], startCells[0])
	let h = gHeight * gCellSize + startCells[1] + statsWindow[1]
	// ca.width = w
	// ca.height = h
	setCanvasSize(ca, w, h)

	gOpen = 0;

	c = ca.getContext("2d");
	//c.font = 'bold ' + gCellSize + "px Times";
	c.font = 'bold ' + gCellSize + "px Tahoma";

	c.fillStyle = bgColor
	c.fillRect(0, 0, w, h)

	drawOutBorder(2 * bigLineWidth, 2 * bigLineWidth, w - 4 * bigLineWidth, h - 4 * bigLineWidth, "white", lineColor, bigLineWidth)
	drawOutBorder(statsWindow[0], statsWindow[1], getStatsWindowWidth(), statsWindowHeight, lineColor, "white", bigLineWidth)
	drawOutBorder(startCells[0], startCells[1], gWidth * gCellSize, gHeight * gCellSize, lineColor, "white", bigLineWidth)

	drawFace(FACE_SMILE);

	gState = new Array(gWidth * gHeight)
	gState.fill(CLOSE);

	gFlags = 0;
	drawFlags()
	drawClock()//draw 000

	for (i = 0; i < gWidth * gHeight; i++) {
		drawCell(i);
	}

}

function drawOutBorder(x, y, width, height, color1, color2, borderWidth) {
	for (let i = 0; i < 2; i++) {
		c.fillStyle = i ? color2 : color1
		c.beginPath();
		if (i) {
			c.moveTo(x + width + borderWidth, y + height + borderWidth)
		}
		else {
			c.moveTo(x - borderWidth, y - borderWidth)
		}
		c.lineTo(x + width + borderWidth, y - borderWidth)
		c.lineTo(x + width, y)
		if (i) {
			c.lineTo(x + width, y + height)
		}
		else {
			c.lineTo(x, y)
		}
		c.lineTo(x, y + height)
		c.lineTo(x - borderWidth, y + height + borderWidth)
		c.fill();
	}
}

function drawFlags() {
	drawDigitString(1)
}

function drawClock() {
	drawDigitString(0)
}

function drawDigitString(flags) {
	let s;
	c.save()
	if (flags) {
		s = Math.max(-99, gBombs - gFlags)
	}
	else {
		s = gTime == 0 ? 0 : Math.min(999, Math.floor((new Date().getTime() - gTime) / 1000))
	}
	if (s < 0) {
		s = '-' + String(-s).padStart(2, '0')
	}
	else {
		s = String(s).padStart(3, '0');
	}
	const sub = 8;//need for novice mode smaller font
	let k = new DigitalFont(1000, statsWindowHeight - sub, s)
	let x = statsWindow[0] + (flags ? 1 : -1) * sub / 2, y = statsWindow[1] + sub / 2, width = k.getStringSize(999)[0] + 1, height = statsWindowHeight - sub + 1;
	if (!flags) {
		x += getStatsWindowWidth() - k.getStringSize(s)[0]
	}
	c.fillStyle = bgColor
	c.fillRect(x, y-1, width, height)

	c.fillStyle = "black"
	c.translate(x, y)
	k.drawString(s, c)

	c.restore()
}

function drawCell(i) {
	if (gState[i] == CLOSE) {
		drawCloseCell(i)
	}
	else if (gState[i] == FLAG) {
		drawFlagCell(i)
	}
	else {
		if (ga[i] == BOMB) {
			drawBombCell(i, 1)
		}
		else {
			drawDigitCell(i)
		}
	}
}

function getRXY(i) {
	return [gCellSize * getX(i) + startCells[0], gCellSize * getY(i) + startCells[1]]
}

function drawDigitCell(i) {
	let [rectX, rectY] = getRXY(i);
	c.fillStyle = bgColor;
	c.fillRect(rectX, rectY, gCellSize, gCellSize)
	c.strokeStyle = lineColor
	c.lineWidth = 1
	c.strokeRect(rectX, rectY, gCellSize, gCellSize)

	if (ga[i]) {
		c.fillStyle = digitColor[ga[i] - 1];
		let s = ga[i] + '';
		const box = getTextBBox(c, s);
		c.fillText(s, rectX + (gCellSize - box.width) / 2 - box.left, rectY + (gCellSize - box.height) / 2 - box.top);
	}
}

function drawBombCell(i, red = false) {
	let [rectX, rectY] = getRXY(i);
	let r = gCellSize / 4;
	let j;
	drawCloseCell(i, red);
	c.fillStyle = "black"
	c.beginPath();
	c.arc(rectX + gCellSize / 2, rectY + gCellSize / 2, r, 0, 2 * Math.PI);
	c.fill();

	c.lineWidth = 1;
	c.strokeStyle = "black"
	c.save();
	c.translate(rectX + gCellSize / 2, rectY + gCellSize / 2)
	for (j = 0; j < 8; j++) {
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(0, -gCellSize / 2 + getBorderThickness());
		c.rotate(Math.PI / 4);
		c.stroke();
	}
	c.restore();
}

function drawCloseCell(i, red = false) {
	let [rectX, rectY] = getRXY(i);
	rectX += getBorderThickness();
	rectY += getBorderThickness();
	let sz = gCellSize - 2 * getBorderThickness();
	drawOutBorder(rectX + .5, rectY + .5, sz - 1, sz - 1, "white", lineColor, getBorderThickness())

	c.fillStyle = red ? "red" : bgColor
	c.fillRect(rectX, rectY, sz, sz)
}

function drawFlagCell(i, red = false) {
	let [rectX, rectY] = getRXY(i);
	let y1 = rectY + gCellSize - getBorderThickness();
	const lw = 2;
	const d = 3;
	const flagHeight = gCellSize / 2.7;
	drawCloseCell(i, red);
	c.lineWidth = lw;
	c.strokeStyle = "black"
	c.beginPath();
	c.moveTo(rectX + gCellSize / 2, y1);
	c.lineTo(rectX + gCellSize / 2, rectY + getBorderThickness());

	c.moveTo(rectX + getBorderThickness(), y1)
	c.lineTo(rectX + gCellSize - getBorderThickness(), y1);
	y1 -= lw;
	c.moveTo(rectX + getBorderThickness() + d, y1)
	c.lineTo(rectX + gCellSize - getBorderThickness() - d, y1);
	c.stroke();

	c.fillStyle = red ? "black" : "red"
	c.beginPath();
	c.moveTo(rectX + gCellSize / 2, rectY + getBorderThickness());
	c.lineTo(rectX + getBorderThickness(), rectY + getBorderThickness() + flagHeight / 2);
	c.lineTo(rectX + gCellSize / 2, rectY + getBorderThickness() + flagHeight);
	c.fill();
}

function openCells(ar) {
	gOpenCells = []
	ar.forEach(e => {
		openCell(e)
	})
	if (gOpen == gWidth * gHeight-gBombs) {
		//set all flags which not set
		gState.forEach((e, i) => {
			if (e == CLOSE && ga[i] == BOMB) {
				drawFlagCell(i)
			}
		})
		stopTimerIfRun()
		drawFace(FACE_WIN)
	}
}

function openCell(e) {
	if (gState[e] == CLOSE) {
		if (ga[e] == BOMB) {
			gameOver(e)
			return //23aug2023
		}
		gState[e] = OPEN
		drawCell(e)
		gOpen++;
		gOpenCells.push(e)

		if (ga[e] == 0) {
			getAdjacentCells(e).forEach(e => {
				openCell(e)
			})
		}
	}
}

function gameOver(index) {
	gState.forEach((e, i) => {
		if (e == CLOSE && ga[i] == BOMB) {
			drawBombCell(i, i == index)
		}
		//invalid flags
		if (e == FLAG && ga[i] != BOMB) {
			drawFlagCell(i, true)
		}
	})
	stopTimerIfRun()
	drawFace(FACE_SAD)
}

function startTimerIfNotRun(setgtime=true){
	if (gTime == 0) {
		if(setgtime){
			gTime = new Date().getTime()
		}		
		gInterval = setInterval(drawClock, 250);
	}	
}

function storeState(){
	gh={
		gState:gState.slice()
		,ga:ga.slice()
	}
	gvars.forEach(e=>gh[e]=window[e])
}

function undo(){
	if(gOpen==0){
		return
	}
	//before gTime is set
	startTimerIfNotRun(false)

	gState=gh.gState.slice()
	ga=gh.ga.slice()
	gvars.forEach(e=>window[e]=gh[e])

	drawFace(gGameState)
	for (let i = 0; i < gWidth * gHeight; i++) {
		drawCell(i);
	}
}

function kdown(e) {
	if(e.key=='ArrowLeft'){
		undo()
	}
	else if(e.key=='ArrowRight'){
		//console.log('right')
	}
	/*	
	else if(['l','д'].includes(e.key.toLowerCase())){
		a=`cl65 70 9 
		221222212
		122222222
		222222222
		222222222
		222221222
		122222222
		211212222
		220222222
		220212222
		12*1001*1
		*21100111
		110000000
		000011100
		11001*100
		*32222100
		2**3*1000
		13*422000
		0112*1000`
		b=a.split(/\n/);
		cl=b.shift().trim().split(/\s/)
		gHeight=b.length/2
		gWidth=b[0].trim().length

		gOpen=parseInt(cl[1])
		gFlags=parseInt(cl[2])
		//console.log(gOpen,gFlags,gWidth,gHeight,gBombs)
		k=0;
		k1=0
		ga=new Array(gWidth*gHeight)
		gState=new Array(gWidth*gHeight)
		for(i=0;i<gHeight*2;i++){
			v=b[i].trim()
			if(i<gHeight){
				for(j=0;j<v.length;j++){
					gState[k++]=parseInt(v[j])
				}
			}
			else{
				for(j=0;j<v.length;j++){
					ga[k1++]=v[j]=='*'?BOMB:parseInt(v[j])
				}
			}
		}
		startTimerIfNotRun()
	
		gGameState=FACE_SMILE
		drawFace(gGameState)
		for (let i = 0; i < gWidth * gHeight; i++) {
			drawCell(i);
		}
		
	}
	*/
	else{
		// console.log(e)
	}
}

function mclick(e) {
	let i, j, c, st, x, y, rect
	rect = el('c').getBoundingClientRect();
	i = e.clientX - rect.left
	j = e.clientY - rect.top
	x = Math.floor((i - startCells[0]) / gCellSize);
	y = Math.floor((j - startCells[1]) / gCellSize);
	if (x < 0 || x >= gWidth || y < 0 || y >= gHeight) {
		[x, y] = getFaceCenter();
		if (Math.abs(i - x) < faceSize/2 && Math.abs(j - y) < faceSize/2) {
			newgame(gBoard);
		}
		return
	}
	if (gGameState != FACE_SMILE) {
		return;
	}

	i = x + y * gWidth
	st = gState[i]
	if (e.button == 0) {
		if (st == CLOSE) {
			if (gOpen == 0) {
				startTimerIfNotRun()
				//generate field without bomb on 'i' cell
				x = gWidth * gHeight;
				ga = [...Array(x).keys()];
				//swap i & x-1
				[ga[i], ga[x - 1]] = [ga[x - 1], ga[i]]
				for (c = 0; c < gBombs; c++) {
					j = c + Math.floor(Math.random() * (x - 1 - c));
					[ga[c], ga[j]] = [ga[j], ga[c]]
				}
				c = ga.slice(0, gBombs);
				ga.fill(0);
				c.forEach(e => {
					getAdjacentCells(e).forEach(e => {
						ga[e]++;
					})
				})
				c.forEach(e => {
					ga[e] = BOMB;
				});
			}

			storeState()
			// j=gState.reduce((a,e,i)=> a+(i%gWidth?'':'\n') +e,'')
			// +ga.reduce((a,e,i)=> a+(i%gWidth?'':'\n') +(e==-1?'*':e),'')
			// console.log('cl'+i,gOpen,gFlags,j)
		
			if (ga[i] == BOMB) {
				gameOver(i)
			}
			else {
				openProceed([i])
			}
		}
		else if (st == OPEN) {
			c = getAdjacentCells(i)
			if (countFlags(c) == ga[i]) {
				storeState()
				openProceed(c)
			}
		}
	}
	else if (e.button == 2) {
		if ([CLOSE, FLAG].includes(st) && typeof ga!='undefined') {
			storeState()
			switchFlags([i])
			proceed(1, adjacentOpenCells([i]))
		}
	}
}

function openProceed(ar) {
	openCells(ar)
	let c = adjacentOpenCells(gOpenCells, 1)
	proceed(0, c)
	proceed(1, c)//if not flags set may be still need open some cells
}

function switchFlags(ar) {
	ar.forEach(e => {
		let c = gState[e] == FLAG
		gState[e] = c ? CLOSE : FLAG;
		drawCell(e)
		gFlags += c ? -1 : 1
	})
	drawFlags()
}

function getAdjacentCells(i) {
	let x = getX(i), y = getY(i);
	let cells = [];
	let f = (e, c, d, max) => {
		add(c > 0, e - d)
		add(c + 1 < max, e + d)
	}

	let add = (cond, c) => {
		if (cond) {
			cells.push(c);
		}
	}

	f(i, x, 1, gWidth)
	f(i, y, gWidth, gHeight)

	add(x > 0 && y > 0, i - gWidth - 1)
	add(x + 1 < gWidth && y + 1 < gHeight, i + gWidth + 1)

	add(x > 0 && y + 1 < gHeight, i + gWidth - 1)
	add(x + 1 < gWidth && y > 0, i - gWidth + 1)
	return cells;
}

function countFlags(c) {
	return c.reduce((ac, e) => {
		return ac + (gState[e] == FLAG);
	}, 0)
}

function getX(i) {
	return i % gWidth
}

function getY(i) {
	return Math.floor(i / gWidth)
}

function getTextBBox(c, text) {
	let s = String(text);
	const metrics = c.measureText(s);
	const left = -metrics.actualBoundingBoxLeft;
	const top = -metrics.actualBoundingBoxAscent;
	const right = metrics.actualBoundingBoxRight;
	const bottom = metrics.actualBoundingBoxDescent;
	// actualBoundinBox... excludes white spaces
	const width = s.trim() === s ? right - left : metrics.width;
	const height = bottom - top;
	return { left, top, right, bottom, width, height };
}

//op=true open cells, op=false set flags
function proceed(op, set, p = 0) {
	let c, l, a = new Set(), b

	if (!el(CHECK_ID[+(!op)]).checked) {
		return
	}
	if (set === undefined) {
		set = [...Array(gWidth * gHeight).keys()];
	}
	set.forEach(i => {
		if (gState[i] == OPEN && ga[i] != 0) {
			c = getAdjacentCells(i);
			b = [];
			l = 0;
			c.forEach(e => {
				if (gState[e] == CLOSE) {
					b.push(e)
				}
				if (!op && gState[e] == CLOSE || gState[e] == FLAG) {
					l++
				}
			})
			if (l == ga[i]) {
				b.forEach(e => a.add(e))
			}
		}
	})

	if (op) {
		openCells(a)
		if (a.size) {
			a = new Set();
			gOpenCells.forEach(e => a.add(e))
			proceed(op, a, p + 1)
		}
	}
	else {
		switchFlags(a)
	}
	if (a.size) {
		proceed(!op, adjacentOpenCells(a, op), p + 1)
	}
}

function adjacentOpenCells(a, addCells = 0) {
	let c = new Set()
	a.forEach(e => {
		getAdjacentCells(e).forEach(e => {
			if (gState[e] == OPEN) {
				c.add(e)
			}
		})
	})
	if (addCells) {
		a.forEach(e => c.add(e))
	}
	return c
}

function checkChanged(e) {
	if (e.target.checked) {
		proceed(!CHECK_ID.indexOf(e.target.id))
	}
}

function ls(i) {
	return languageString[gLanguage == 'russian' ? 1 : 0][typeof i === 'number' ? i : LANGUAGE_ID.get(i)]
}

function showDialog() {
	i = LANGUAGE_ID.get('Parameters')
	header=ls(i++)
	j=0;
	s = `<table>
	<tr><td colspan="2">`+ ls(i++) + `</td></tr>`
	WHBC.forEach(e => s += `<tr><td>` + ls(i++) + `</td><td><input type="number" id="` + e + `"></td></tr>`)
	s+=`<tr><td>`+ ls(i++) + `</td><td id="bombsPercent"></td></tr>
	<tr><td>`+ ls(i++) + `</td><td><select id="copy" onchange="selectChanged()">
	<option>`+ ls(i++) + `</option>
	<option>`+ ls(i++) + `</option>
	<option>`+ ls(i++) + `</option>
	</select></td></tr>
	<tr><td colspan=2 id="message" style="color:red"></td></tr></table>`
	showModal(ls(i++),s,clickModal,['ok', gLanguage == 'russian' ? 'отмена' : 'cancel'])
	el('copy').selectedIndex = -1
	if (boardOptions[3][0] == 0) {
		b = [gWidth, gHeight, gBombs]
	}
	else {
		b = boardOptions[3]
	}
	b.push(gCellSize)
	WHBC.forEach((e, i) => {
		a = el(e)
		a.onkeyup = dku
		a.min = 1
		a.max = [MAX_WIDTH, MAX_HEIGHT, MAX_WIDTH * MAX_HEIGHT - 1, MAX_CELLSIZE][i]
		a.value = b[i]
	})
	updateBomsPercent()
}

function selectChanged() {
	WHBC.forEach((e, i) => {
		if(i<3){
			el(e).value = boardOptions[el('copy').selectedIndex][i]
		}
	})
	updateBomsPercent()
}

function dku() {
	//e.target.id
	o = parseParameters()
	updateBomsPercent(o.ok ? undefined : '?')
	el('message').innerHTML = o.s
	getModalButton(0).disabled = !o.ok
}

function nu(i){
	//el(...).value='' if input '30-', '30e'
	return Number(el(WHBC[i]).value)
}

function parseParameters() {
	let a = [], b, e, s = '', m, i = 0, s1
	for (e of WHBC) {
		b = nu(i)
		s1 = ls('error') + ' ' + ls('parameter') + ' ' + ls(e) + ' ';
		if (el(e).value.length == 0 || isNaN(b)) {
			s = s1 + ls('is not a number')
			break;
		}
		s1 += ls('should be') + ' '
		if (b < 1) {
			s = s1 + '> 0'
			break;
		}
		a.push(b)
		m = [MAX_WIDTH, MAX_HEIGHT, a[0] * a[1] - 1, MAX_CELLSIZE]
		if (b > m[i]) {
			s = s1 + '&le; ' + m[i]
			break;
		}
		i++
	}
	return { ok: s == '', s, a }
}

function clickModal(n) {
	if(n==0){
		let p = parseParameters().a;
		boardOptions[3] = p.slice(0, 3)
		gCellSize = p[3]
		newgame(3);
	}
}

function updateBomsPercent(v) {
	if (v === undefined) {
		v = (nu(2) * 100 / nu(0) / nu(1)).toFixed(2) + '%'
	}
	el('bombsPercent').innerHTML = v
}