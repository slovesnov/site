let record = 0;
let filling = 0;
let boardSizeX = 9, boardSizeY = 9;

let curGameType = 0;
let showFindPath = false;
let showPath = false;
let clearPathDelay = 500;
let playerScore = 0;
let scoreLineSize = 5;
let beginTime = 0, delayTime = 0;

let paused = false;
let imgpath = "img/lines/"
let pathImage = new Image();
pathImage.src = imgpath + "p.gif";

let pathX = [], pathY = [], pathStepCount;
let beginPointX = -1, beginPointY = -1, endPointX = -1, endPointY = -1;

let waitClearPath = false;
let waitID = 0;

let foundX = 0, foundY = 0;
let scoreLineType = "";
let beginLineX = 0, beginLineY = 0;

let scoreDrawSize = 7, clearCell;

let cellType = [];
let selectCell = [];
let pathBoard = new Array(boardSizeX);
let m = new Array(boardSizeX * boardSizeY);

let colorstring = ["empty", "red", "yellow", "green", "blue", "violet", "cian"];

let MaxEstimate = -1000;
let BestSquareEnd, BestSquareBegin;
let MaxDefColor;

let lh = [
	1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1];
let bh = [
	0, 0, 0, 0, 0, 1, 2, 3, 4, 9, 9, 9, 9, 9, 10, 11, 12, 13, 18, 18, 18, 18, 18, 19, 20, 21, 22, 27, 27, 27, 27, 27, 28, 29, 30, 31, 36, 36, 36, 36, 36, 37, 38, 39, 40, 45, 45, 45, 45, 45, 46, 47, 48, 49, 54, 54, 54, 54, 54, 55, 56, 57, 58, 63, 63, 63, 63, 63, 64, 65, 66, 67, 72, 72, 72, 72, 72, 73, 74, 75, 76];
let lv = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
let bv = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44
];
let ld1 = [
	1, 1, 1, 1, 1, 0, 0, 0, 0,
	1, 2, 2, 2, 2, 1, 0, 0, 0,
	1, 2, 3, 3, 3, 2, 1, 0, 0,
	1, 2, 3, 4, 4, 3, 2, 1, 0,
	1, 2, 3, 4, 5, 4, 3, 2, 1,
	0, 1, 2, 3, 4, 4, 3, 2, 1,
	0, 0, 1, 2, 3, 3, 3, 2, 1,
	0, 0, 0, 1, 2, 2, 2, 2, 1,
	0, 0, 0, 0, 1, 1, 1, 1, 1];
let bd1 = [
	0, 1, 2, 3, 4, 0, 0, 0, 0,
	9, 0, 1, 2, 3, 4, 0, 0, 0,
	18, 9, 0, 1, 2, 3, 4, 0, 0,
	27, 18, 9, 0, 1, 2, 3, 4, 0,
	36, 27, 18, 9, 0, 1, 2, 3, 4,
	0, 36, 27, 18, 9, 10, 11, 12, 13,
	0, 0, 36, 27, 18, 19, 20, 21, 22,
	0, 0, 0, 36, 27, 28, 29, 30, 31,
	0, 0, 0, 0, 36, 37, 38, 39, 40];
let ld2 = [
	0, 0, 0, 0, 1, 1, 1, 1, 1,
	0, 0, 0, 1, 2, 2, 2, 2, 1,
	0, 0, 1, 2, 3, 3, 3, 2, 1,
	0, 1, 2, 3, 4, 4, 3, 2, 1,
	1, 2, 3, 4, 5, 4, 3, 2, 1,
	1, 2, 3, 4, 4, 3, 2, 1, 0,
	1, 2, 3, 3, 3, 2, 1, 0, 0,
	1, 2, 2, 2, 2, 1, 0, 0, 0,
	1, 1, 1, 1, 1, 0, 0, 0, 0];
let bd2 = [
	0, 0, 0, 0, 4, 5, 6, 7, 8,
	0, 0, 0, 4, 5, 6, 7, 8, 17,
	0, 0, 4, 5, 6, 7, 8, 17, 26,
	0, 4, 5, 6, 7, 8, 17, 26, 35,
	4, 5, 6, 7, 8, 17, 26, 35, 44,
	13, 14, 15, 16, 17, 26, 35, 44, 0,
	22, 23, 24, 25, 26, 35, 44, 0, 0,
	31, 32, 33, 34, 35, 44, 0, 0, 0,
	40, 41, 42, 43, 44, 0, 0, 0, 0
];

function load() {
	for (i = 0; i < boardSizeX; i++) {
		pathBoard[i] = new Array(boardSizeY).fill(0);
	}
	s = '<table style="padding:0;margin:0;">';
	for (let yd = 0; yd < boardSizeY; ++yd) {
		s += '<tr style="padding:0;margin:0;">';
		for (let xd = 0; xd < boardSizeX; ++xd) {
			s += '<td style="padding:0;margin:0;border-spacing:0;font-size:0;"><a style="border-spacing:0;font-size:0;" href="" OnClick="cellClick(' + yd + ',' + xd + ');return false;" onMouseOver="cellOver(' + yd + ',' + xd + '); return true;" onMouseOut="cellOut(' + yd + ',' + xd + '); return true;"><img src=' + imgpath + 'n0.gif width=31 height=31 border=0 name="' + yd + 'x' + xd + '"></a>';
		}
	}
	s += '</table>';
	el('td').innerHTML = s;

	for (let i = 0; i <= 6; i++) {
		cellType[i] = new Image(0, 1);
		cellType[i].src = imgpath + "n" + i + ".gif";
	}
	clearCell = cellType[0].src;

	for (i = 1; i <= 6; i++) {
		selectCell[i - 1] = new Image(0, 1);
		selectCell[i - 1].src = imgpath + "s" + i + ".gif";
	}

	safeClearPath();

	curGameType = 0;
	beginPointX = -1;
	showFindPath = false;
	showPath = false;
	playerScore = 0;
	filling = 0;
	paused = false;

	for (let x = 0; x < boardSizeX; x++)
		for (let y = 0; y < boardSizeY; y++)
			document[x + "x" + y].src = clearCell;

	putRandomItems(3);
	drawScore();
}

function getRandom(Range) {
	if (Range < 2) return 0;
	return Math.round(Math.random() * (Range - 1));
}

function getSelectSrc(s) {
	for (let i = 1; i < cellType.length; i++)
		if (cellType[i].src == s) return selectCell[i - 1].src;
	return s;
}
function getNormalSrc(s) {
	for (let i = 0; i < selectCell.length; i++)
		if (selectCell[i].src == s) return cellType[i + 1].src;
	return s;
}

function isClear(x, y) {
	let src = document[x + "x" + y].src;
	return src == clearCell || src == pathImage.src;
}

function findPath() // 1 - end, 0 - no step
{
	let x = pathX[pathStepCount - 1], y = pathY[pathStepCount - 1];
	if (x == endPointX && y == endPointY) return 1;
	if (x > 0 && pathBoard[x - 1][y] == 0) {
		pathX[pathStepCount] = x - 1; pathY[pathStepCount] = y;
		pathBoard[pathX[pathStepCount]][pathY[pathStepCount]] = 1;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = pathImage.src;
		pathStepCount++;
		if (findPath() == 1) return 1;
		pathStepCount--;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = clearCell;
	}
	if (y > 0 && pathBoard[x][y - 1] == 0) {
		pathX[pathStepCount] = x; pathY[pathStepCount] = y - 1;
		pathBoard[pathX[pathStepCount]][pathY[pathStepCount]] = 1;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = pathImage.src;
		pathStepCount++;
		if (findPath() == 1) return 1;
		pathStepCount--;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = clearCell;
	}
	if (x < boardSizeX - 1 && pathBoard[x + 1][y] == 0) {
		pathX[pathStepCount] = x + 1; pathY[pathStepCount] = y;
		pathBoard[pathX[pathStepCount]][pathY[pathStepCount]] = 1;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = pathImage.src;
		pathStepCount++;
		if (findPath() == 1) return 1;
		pathStepCount--;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = clearCell;
	}
	if (y < boardSizeY - 1 && pathBoard[x][y + 1] == 0) {
		pathX[pathStepCount] = x; pathY[pathStepCount] = y + 1;
		pathBoard[pathX[pathStepCount]][pathY[pathStepCount]] = 1;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = pathImage.src;
		pathStepCount++;
		if (findPath() == 1) return 1;
		pathStepCount--;
		if (showFindPath) document[pathX[pathStepCount] + "x" + pathY[pathStepCount]].src = clearCell;
	}
	return 0;
}

function clearPath() {
	for (i = 0; i < pathStepCount; i++)
		if (isClear(pathX[i], pathY[i]))
			document[pathX[i] + "x" + pathY[i]].src = clearCell;
}
function drawPath() {
	//confirm("line146 drawpath");
	//let s="";
	for (i = 0; i < pathStepCount; i++)
		if (isClear(pathX[i], pathY[i])) {
			//setTimeout("document[pathX[i]+\"x\"+pathY[i]].src =pathImage.src",100);
			//pause(50);
			document[pathX[i] + "x" + pathY[i]].src = pathImage.src;
			//pause(100);
			//confirm('line 151'+i+" "+pathStepCount);
			//s+="["+pathX[i]+" "+pathY[i]+"]";
			//if(i%10==0)s+="\n";
		}
	//window.status="line 151"+i+" "+pathStepCount;
	//confirm(s);
}

function safeClearPath() {
	if (waitClearPath) {
		clearTimeout(waitID);
		clearPath();
		waitClearPath = false;
	}
}
function runWaitClearPath() {
	safeClearPath();
	drawPath();
	waitClearPath = true;
	waitID = setTimeout("safeClearPath();", clearPathDelay);
}

function moveCell() {
	//beginPointX = x1; beginPointY = y1;
	//endPointX = x2; endPointY = y2;

	if (showPath) safeClearPath();

	for (let x = 0; x < boardSizeX; x++)
		for (let y = 0; y < boardSizeY; y++)
			pathBoard[x][y] = isClear(x, y) ? 0 : 2;

	pathX[0] = beginPointX; pathY[0] = beginPointY;
	//pathBoard[pathX[0]][pathY[0]] = 1;
	pathStepCount = 1;
	let r = findPath();
	if (showFindPath) clearPath();
	if (showPath) runWaitClearPath();
	//if(true)drawPath();
	if (r != 1) {
		alert("You cann't move here!");
		document[beginPointX + "x" + beginPointY].src =
			getNormalSrc(document[beginPointX + "x" + beginPointY].src);
		curGameType = 1;
		beginPointX = -1;
		return false;
	}

	document[endPointX + "x" + endPointY].src =
		getNormalSrc(document[beginPointX + "x" + beginPointY].src);

	document[beginPointX + "x" + beginPointY].src = clearCell;

	curGameType = 1;
	beginPointX = -1;
	return true;
}

function findSetCell() {
	for (let y = 0; y < boardSizeY; y++)
		for (let x = 0; x < boardSizeX; x++)
			if (!isClear(x, y)) return true;
	return false;
}

function findClearCell(x, y) {
	for (foundY = y; foundY < boardSizeY; foundY++)
		for (foundX = x; foundX < boardSizeX; foundX++)
			if (isClear(foundX, foundY)) return true;
	return false;
}
function findNewPosition() {
	if (!findClearCell(0, 0)) return false;
	let x = foundX, y = foundY;
	for (let i = 0; i < 20; i++) {
		let nx = getRandom(boardSizeX - x) + x;
		let ny = getRandom(boardSizeY - y) + y;
		if (isClear(nx, ny)) { foundX = nx; foundY = ny; return true; }
	}
	nx = x + parseInt((boardSizeX - x - 1) / 2);
	ny = y + parseInt((boardSizeY - y - 1) / 2);
	if (Math.random() < 0.55 && findClearCell(nx, ny)) return true;
	foundX = x; foundY = y;
	return true;
}
function putRandomItem() {
	if (!findNewPosition()) return false;
	document[foundX + "x" + foundY].src = cellType[getRandom(cellType.length - 1) + 1].src;
	return true;
}
function putRandomItems(count) {
	for (let i = 0; count > 0; count--)
		if (putRandomItem()) {
			i++; filling = filling + 1;
		} else {
			break;
		}
	if (!findNewPosition()) {
		//проверка на рекорд
		if (record < playerScore) {
			url = 'http://anekdots.ru/games/lines/record.phtml?record=' + playerScore;
			window.open(url, '1', 'resizable=no,menubar=no,scrollbars=no,width=250,height=40');
		}
	}
	let k = filling * 100. / 81.;
	let s = k + "";
	if (k < 10) s = s.substring(0, 4);
	else if (k < 100) s = s.substring(0, 5);
	else s = s.substring(0, 6);
	el('percent').value = s + "%";
	CMove();
	return i;
}

function drawScore() {
	let s = "" + playerScore;
	while (s.length < scoreDrawSize) s = "0" + s;
	el('score').value = s;
}

function getLineSize(dx, dy) {
	let lineSize = 1;
	if (dx == 0 && dy == 0) return 1;
	let x = endPointX + dx, y = endPointY + dy;
	while (x >= 0 && x < boardSizeX && y >= 0 && y < boardSizeY) {
		if (document[x + "x" + y].src == scoreLineType) lineSize++; else break;
		x += dx; y += dy;
	}
	dx = -dx; dy = -dy;
	beginLineX = endPointX; beginLineY = endPointY;
	x = endPointX + dx, y = endPointY + dy;
	while (x >= 0 && x < boardSizeX && y >= 0 && y < boardSizeY) {
		if (document[x + "x" + y].src == scoreLineType) lineSize++; else break;
		beginLineX = x; beginLineY = y;
		x += dx; y += dy;
	}
	return lineSize;
}
function findScore() {
	scoreLineType = document[endPointX + "x" + endPointY].src;
	let scoreLine = 0;
	for (let dx = -1; dx <= 1; dx++)
		for (let dy = -1; dy <= 1; dy++) {
			let lineSize = getLineSize(dx, dy);
			//alert("line("+dx+","+dy+"): "+lineSize);
			if (lineSize < scoreLineSize) continue;
			for (let i = 0, x = beginLineX, y = beginLineY; i < lineSize; i++, x += dx, y += dy)
				document[x + "x" + y].src = clearCell;
			scoreLine += lineSize;
		}
	if (scoreLine > 0) {
		//playerScore += parseInt(Math.pow(scoreLine,1.8));
		playerScore += (scoreLine - 4) * scoreLine;

		filling -= scoreLine;
		let k = filling * 100. / 81.;
		let s = k + "";
		if (k < 10) s = s.substring(0, 4);
		else if (k < 100) s = s.substring(0, 5);
		else s = s.substring(0, 6);
		el('percent').value = s + "%";

		drawScore();
		return true;
	}
	return false;
}

function cellOver(x, y) {
	let i = parseInt(BestSquareBegin / 9 + 1) - 1;
	let j = BestSquareBegin % 9;
	document[i + "x" + j].src = imgpath + "n" + m[BestSquareBegin] + ".gif";

	i = parseInt(BestSquareEnd / 9 + 1) - 1;
	j = BestSquareEnd % 9;
	document[i + "x" + j].src = imgpath + "n0.gif";

	window.status = "[" + x + "," + y + "] " + (9 * x + y);
}
function cellOut(x, y) {
	if (x == 0 || y == 0 || x == 8 || y == 8) {
		let i = parseInt(BestSquareEnd / 9 + 1) - 1;
		let j = BestSquareEnd % 9;
		document[i + "x" + j].src = imgpath + "mb.gif";

		i = parseInt(BestSquareBegin / 9 + 1) - 1;
		j = BestSquareBegin % 9;
		document[i + "x" + j].src = imgpath + "m" + m[BestSquareBegin] + ".gif";
	}
	window.status = "";
}
function cellClick(apx, apy) {
	let x = apx, y = apy; // force no error in IE4

	//if(paused) stopClick();

	if (curGameType == 3) {
		return; // end? stop...
	}
	if (curGameType == 0) {
		let d = new Date();
		beginTime = d.getTime();
		delayTime = 0;
		curGameType = 1;
	}

	let c = isClear(x, y);
	if (beginPointX == -1) {
		if (c) { return; }
		beginPointX = x; beginPointY = y;
		document[x + "x" + y].src = getSelectSrc(document[x + "x" + y].src);
		curGameType = 2;
		return;
	}
	if (!c) {
		document[beginPointX + "x" + beginPointY].src =
			getNormalSrc(document[beginPointX + "x" + beginPointY].src);
		beginPointX = x; beginPointY = y;
		document[x + "x" + y].src = getSelectSrc(document[x + "x" + y].src);
		curGameType = 2;
		return;
	}
	endPointX = x; endPointY = y;
	let needPut = false;
	if (moveCell()) {
		if (!findScore() || !findSetCell()) needPut = true;
	}
	if (needPut) {
		putRandomItems(3);
		if (!findClearCell(0, 0)) {
			curGameType = 3;
		}
	}

	/*
	 if(!findNewPosition()){ alert(x+"x"+y); return; } 
	 document[foundX+"x"+foundY].src = cellType[getRandom(cellType.length-1)+1].src;
	 setTimeout("cellClick(0,0);",50);
	*/
}

function MakeMove(begin, end) {
	beginPointY = begin % 9;
	beginPointX = parseInt(begin / 9 + 1) - 1;
	//confirm(beginPointY);
	endPointY = end % 9;
	endPointX = parseInt(end / 9 + 1) - 1;
	//confirm("["+beginPointX+" "+beginPointY+"]-["+endPointX+" "+endPointY+"]");

	needPut = false;

	if (moveCell()) {
		if (!findScore() || !findSetCell()) needPut = true;
	}
	if (needPut) {
		putRandomItems(3);
		if (!findClearCell(0, 0)) {
			curGameType = 3;
		}
	}
	else {
		CMove();
	}
	// moveCell();
	beginPointX = -1;
}
function pr(begin) {
	let i = (parseInt(begin / 9 + 1) - 1);
	let s = "[" + begin % 9 + " " + i + "]";
	return s;
}
function sbros(color, square) {
	let i1, i2;
	i1 = 1;
	while ((square - i1 + 1) % 9 != 0 && m[square - i1] == color) i1++;
	i2 = 1;
	while ((square + i2) % 9 != 0 && m[square + i2] == color) i2++;
	if (i1 + i2 > 5) {
		//alert("hline "+square+" color="+color);
		return true;

	}
	i1 = 9;
	while (square - i1 > 0 && m[square - i1] == color) i1 += 9;
	i2 = 9;
	while (square + i2 < 81 && m[square + i2] == color) i2 += 9;
	if (i1 + i2 > 5 * 9) {
		//alert("vline "+square+" color="+color+" i1+i2="+(i1+i2));
		return true;
	}
	i1 = 10;
	while (square + i > 0 && (square - i1 + 1) % 9 != 0 && m[square - i1] == color) i1 += 10;
	i2 = 10;
	while ((square + i2) % 9 != 0 && square + i2 < 81 && m[square + i2] == color) i2 += 10;
	if (i1 + i2 > 5 * 10) {
		//alert("diag1 "+square+" color="+color);
		return true;
	}

	i1 = 8;
	while (square - i1 > 0 && (square - i1) % 9 != 0 && m[square - i1] == color) i1 += 8;
	i2 = 8;
	while ((square + i2 + 1) % 9 != 0 && square + i2 < 81 && m[square + i2] == color) i2 += 8;
	if (i1 + i2 > 5 * 8) {
		//alert("diag2 "+square+" color="+color);
		return true;
	}
	return false;
}
//предполагаем, что всё лежит в пределах массива
function EstimateLine(beginsquare, color, increment, sq) {
	let i, j, est = 0;
	for (i = 0, j = beginsquare; i < 5; i++, j += increment) {
		if (m[j] == 0) est -= 10;
		else if (m[j] != color) est -= 20;
	}
	if (est == 0) {//sbros
		est += 100;
	}
	if (sq != beginsquare) {
		if (m[sq - increment] == color) est += 5;
		else {
			if (m[sq + 1 + increment] != 0 && m[sq - 1 + increment] != 0 &&
				m[sq + 9 + increment] != 0 && m[sq - 9 + increment] != 0) est -= 30;
		}
	}
	if (sq != beginsquare + j - increment) {  //last in a line
		if (m[sq + increment] == color) est += 5;
		else {
			if (m[sq + increment + 1] != 0 && m[sq - 1 + increment] != 0 &&
				m[sq + 9 + increment] != 0 && m[sq - 9 + increment] != 0) est -= 30;
		}
	}
	if (increment == 1 || increment == 9) est += 4;

	return est;
}

function Estimate(color, square /*,pr*/) {
	let i;
	let est = 0, maxest = -5000;
	for (i = 0; i < lh[square]; i++) {
		est = EstimateLine(bh[square] + i, color, 1, square);

		if (est > maxest) {
			maxest = est;
		}
	}

	for (i = 0; i < lv[square]; i++) {
		est = EstimateLine(bv[square] + i * 9, color, 9, square);

		if (est > maxest) {
			maxest = est;
		}
	}

	for (i = 0; i < ld1[square]; i++) {
		est = EstimateLine(bd1[square] + i * 10, color, 10, square);

		if (est > maxest) {
			maxest = est;
		}
	}

	for (i = 0; i < ld2[square]; i++) {
		est = EstimateLine(bd2[square] + i * 8, color, 8, square);

		if (est > maxest) {
			maxest = est;
		}
	}

	return maxest;

}

function DefineColor(beginsquare, increment) {
	let i, j, k;
	MaxDefColor = -1;
	let c = new Array(7);
	for (i = 0; i < 7; ++i)c[i] = 0;
	for (i = 0, j = beginsquare; i < 5; i++, j += increment) {
		c[m[j]]++;
		if (c[m[j]] > MaxDefColor && m[j] != 0) {
			MaxDefColor = c[m[j]];
			k = m[j];
		}
	}

	return k;
}

function EstimateBegin(color, square) {
	let i, j;
	let est = 0;

	if (square > 8 && square < 72) {//up down
		if (m[square - 9] == m[square + 9] && m[square - 9] != 0) {
			if (m[square + 9] != color) {
				return -10 + Estimate(color, square);
			}
			else est = 10;
		}
	}
	i = square % 9;
	j = parseInt(square / 9 + 1) - 1;// j ~ x
	if (i != 0 && i != 8) {//left right
		if (m[square - 1] == m[square + 1] && m[square - 1] != 0) {
			if (m[square + 1] != color) {
				return -10 + Estimate(color, square);
			}
			else est = 10;
		}
	}
	if (square > 8 && square < 72 && i != 0 && i != 8) {//diag1 & diag2
		if (m[square - 8] == m[square + 8] && m[square - 8] != 0) {
			if (m[square + 8] != color) {
				return -10 + Estimate(color, square);
			}
			else est = 10;
		}

		if (m[square - 9] == m[square + 9] && m[square - 9] != 0) {
			if (m[square + 9] != color) {
				return -10 + Estimate(color, square);
			}
			else est = 10;
		}
	}

	//if(square>17){
	if (m[square - 9] == m[square - 18] && m[square - 9] != 0) {
		if (m[square + 9] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}
	//}
	if (m[square + 9] == m[square + 18] && m[square + 9] != 0) {
		if (m[square - 9] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}
	if (i < 7 && m[square + 1] == m[square + 2] && m[square + 1] != 0) {
		if (m[square - 1] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}

	if (i > 1 && m[square - 1] == m[square - 2] && m[square - 1] != 0) {
		if (m[square + 1] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}

	//x+ y+
	if (i < 8 && j < 8 && m[square + 10] == m[square + 20] && m[square + 10] != 0) {
		if (m[square - 10] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}

	//x- y-
	if (i > 1 && j > 1 && m[square - 10] == m[square - 20] && m[square - 10] != 0) {
		if (m[square + 10] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}

	//x+ y-
	if (i < 8 && j > 1 && m[square - 8] == m[square - 16] && m[square - 8] != 0) {
		if (m[square + 8] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}

	//x- y+
	if (i > 1 && j < 8 && m[square + 8] == m[square + 16] && m[square + 8] != 0) {
		if (m[square - 8] != color) {
			return -10 + Estimate(color, square);
		}
		else est = 9;
	}


	return est + Estimate(color, square);
}
function CMove() { //computer move
	el('advise').value = "thinking...";

	let src;
	let i, j, k, l;
	let s = "";
	let roll = new Array(81);
	let smas = new Array(81);
	let new_smas = new Array(81);
	let smas_counter, new_smas_counter;
	let rate = "", rate1;
	MaxEstimate = -5000;
	let locmax = -5000;
	for (i = 0; i < 9; ++i) {
		for (j = 0; j < 9; ++j) {
			src = document[i + "x" + j].src;
			for (k = 0; k < 6; k++) {
				if (src == cellType[k].src) break;
			}
			m[9 * i + j] = k;
			//s+=k;
		}
		//s+="\n";
	}
	//if(!confirm(s))return;

	//получим для каждого элемента массив куда можно катиться.
	for (k = 0; k < 81; ++k)if (m[k] != 0) {
		for (i = 0; i < 81; ++i)roll[i] = false;
		//smas is a bound
		smas[0] = k;
		smas_counter = 1;
		//if(confirm("line527 k="+k)==0)return;
		while (smas_counter != 0) {
			new_smas_counter = 0;
			for (i = 0; i < smas_counter; ++i) {
				if ((smas[i] + 1) % 9 != 0 && m[smas[i] + 1] == 0 && roll[smas[i] + 1] == false) {
					roll[smas[i] + 1] = true;
					new_smas[new_smas_counter] = smas[i] + 1;
					new_smas_counter++;
				}
				if ((smas[i]) % 9 != 0 && m[smas[i] - 1] == 0 && roll[smas[i] - 1] == false) {
					roll[smas[i] - 1] = true;
					new_smas[new_smas_counter] = smas[i] - 1;
					new_smas_counter++;
				}
				if (smas[i] > 8 && m[smas[i] - 9] == 0 && roll[smas[i] - 9] == false) {
					roll[smas[i] - 9] = true;
					new_smas[new_smas_counter] = smas[i] - 9;
					new_smas_counter++;
				}
				if (smas[i] < 72 && m[smas[i] + 9] == 0 && roll[smas[i] + 9] == false) {
					roll[smas[i] + 9] = true;
					new_smas[new_smas_counter] = smas[i] + 9;
					new_smas_counter++;
				}
			}//end for
			smas_counter = new_smas_counter;
			for (i = 0; i < smas_counter; ++i)smas[i] = new_smas[i];
			/*
					 s="for "+k+"\n";
					 for( i=0;i<9;++i){
						 for( j=0;j<9;++j){
							 if(roll[9*i+j]==true)s+="*";
							 else s+=" ";
						 }
						 s+="\n";
					 }
					 if(confirm(s)==0)return;
			//*/
		}//end while

		//получили массив куда катит
		/*   s="for "+k+"\n";
			 for(i=0;i<9;++i){
				 forj=0;j<9;++j){
					 if(roll[9*i+j]==true)s+="*";
					 else s+=" ";
				 }
				 s+="\n";
			 }
			 if(confirm(s)==0)return;*/

		//
		for (i = 0; i < 81; ++i)if (roll[i] == true) {
			//square beginning is "k" ## end is i
			j = m[k];
			m[k] = 0;
			m[i] = j;
			src = Estimate(j, i /*,0*/);
			rate1 = src + "";
			m[k] = j;
			m[i] = 0;

			locmax = EstimateBegin(j, k);

			//ishodnoe sostoyanie
			src -= locmax;
			if (src > MaxEstimate) {
				rate = rate1 + "-(" + locmax + ")";
				MaxEstimate = src;
				BestSquareEnd = i;
				BestSquareBegin = k;
			}
		}

	}//for(k=0;...)if(m[k]!=0)
	/*if(confirm(pr(BestSquareBegin)+""+BestSquareBegin+"-"+pr(BestSquareEnd)+""+BestSquareEnd+
	" "+colorstring[m[BestSquareBegin]]+" rate="+MaxEstimate+" "+rate)==0){
 
			 j=m[BestSquareBegin];
			 m[BestSquareBegin]=0;
			 m[BestSquareEnd]=j;
 
		Estimate(j,BestSquareEnd ,1);
			 m[BestSquareBegin]=j;
			 m[BestSquareEnd]=0;
 
	}*/
	//MakeMove(BestSquareBegin,BestSquareEnd);
	el('advise').value = pr(BestSquareBegin) + "" + BestSquareBegin + "-" +
		pr(BestSquareEnd) + "" + BestSquareEnd + " " +
		colorstring[m[BestSquareBegin]] + " rate=" + MaxEstimate + " " + rate;

	i = parseInt(BestSquareEnd / 9 + 1) - 1;
	j = BestSquareEnd % 9;
	document[i + "x" + j].src = imgpath + "mb.gif";

	i = parseInt(BestSquareBegin / 9 + 1) - 1;
	j = BestSquareBegin % 9;
	document[i + "x" + j].src = imgpath + "m" + m[BestSquareBegin] + ".gif";
}
function Follow() {
	let i = parseInt(BestSquareBegin / 9 + 1) - 1;
	let j = BestSquareBegin % 9;
	document[i + "x" + j].src = imgpath + "n" + m[BestSquareBegin] + ".gif";

	i = parseInt(BestSquareEnd / 9 + 1) - 1;
	j = BestSquareEnd % 9;
	document[i + "x" + j].src = imgpath + "n0.gif";

	MakeMove(BestSquareBegin, BestSquareEnd);

}
function DebugEstimate() {
	let s = el('debug').value;
	let k = 10 * parseInt(s.charAt(0)) + parseInt(s.charAt(1));
	let i = 10 * parseInt(s.charAt(3)) + parseInt(s.charAt(4));
	let j, src;
	//confirm();
	//square beginning is "k" ## end is i
	j = m[k];
	m[k] = 0;
	m[i] = j;
	src = Estimate(j, i);
	m[k] = j;
	m[i] = 0;
	//ishodnoe sostoyanie
	src += "-(" + EstimateBegin(j, k) + ")";
	el('ds').value = src;
}