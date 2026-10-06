gImageUrl = ['bg0.jpg']
gImageLoaded = 0;
gImage = [];
gRecount = 1;

const gl = [['parameters', 'stop', 'run', 'Press to start/clear', 'Press any key to start/clear stopwatch'
	, 'Stopwatch parameters', 'for example', 'Digital mode']
	, ['параметры', 'стоп', 'запуск', 'Нажмите для запуска/остановки', 'Нажмите любую клавишу для запуска/остановки секундомера'
	, 'Параметры секундомера', 'например', 'Цифровой режим']]
const lng = gl[+(gLanguage == 'russian')]

function load() {
	gCanvas = el("canvas");
	gCtx = gCanvas.getContext("2d");
	/*gParameter
		0 - normal
		1 - jerk +5,20 starts timer immediately
		2 - plank 1 +30,15
		3 - поднятие туловища +30,3 starts timer immediately
		4 - timer no sound
		*/
	gParameter = +gParameter

	gSound = new Audio('img/stopwatch/beep.mp3')
	if (gParameter == 1) {
		gSound.volume = .2//0..1
	}

	for (i = 0; i < gImageUrl.length; i++) {
		j = gImage[i] = new Image();
		j.src = 'img/stopwatch/' + gImageUrl[i];
		//call drawClock after image is load to memory
		j.onload = imageLoaded;
	}

	//read cookie
	i = getCookie(gPageName)
	gTime = 0
	if (i == '') {
		gDigitalMode = 0
		j = "+1 +30,10"//"+1 +20,2 5 +10 423 +45";
	}
	else {
		gDigitalMode = i[0] == 'd'
		j = i.substring(gDigitalMode)
	}
	if (gParameter) {
		j = ['+5,20', '1 +30,15', '+30,3',''][gParameter - 1]
	}
	parseTimes(j)

	fillTable();//should be called before resize to get gSetButtonSize
	i = el("set")
	gSetButtonSize = { width: i.offsetWidth, height: i.offsetHeight }

	window.addEventListener("click", e => {
		if (e.target.id == "set") {
			showModal(ln('Stopwatch parameters'), ln('Stopwatch parameters') + `,<br> ` + ln('for example') + `, "+10 +20,6 +1"<br>
			<input type="text" id="params" onkeyup="inputChanged(event)" value="`+ gTimes + `"><br>
			<label>`+ ln('Digital mode') + ` <input type="checkbox" id="check"${gDigitalMode ? ' checked' : ''} style="vertical-align: middle;"></label>`
				, clickModal, ['ok', gLanguage == 'russian' ? 'отмена' : 'cancel'])
		}
		else if (e.target.id == "runstop") {
			keydown();
		}
	});
	if (gParameter == 1) {
		window.addEventListener('beforeunload', () => {
			n = gPageName + '_jerk'
			s = getCookie(n);
			setCookie('test', String(gTime));
			if (gTime == 0) {
				setCookie(n, s + " gTime=0")
			}
			else {
				d = new Date(gTime) //start time
				ds = d.getDate() + d.toLocaleString('default', { month: 'short' }).toLowerCase()
				t = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0')
				setCookie(n, s + (s.includes(ds) ? '' : ' ' + ds) + " " + t + ' ' + timeToString(Math.floor((new Date().getTime() - gTime) / 1000)))
				//setCookie(n + 'prev', s)
				//setCookie('test', JSON.stringify({ s, gTime, ds, t, ts: timeToString(Math.floor((new Date().getTime() - gTime) / 1000)) }));
			}
		});
	}

	// Event handler to resize the canvas when the document view is changed
	window.addEventListener('resize', resize);
	resize();

	if ([1, 3,4].includes(gParameter)) {
		keydown();
	}
	window.addEventListener('keydown', keydown);
	gCanvas.addEventListener('click', keydown);
}

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

function resize() {
	/* canvas.width = canvas.height = 1; make window.innerWidth & window.innerHeight 
	to not fit to canvas size which can be bigger than window.innerWidth & window.innerHeight
	*/
	gCanvas.width = gCanvas.height = 1;
	gw = window.innerWidth
	gh = window.innerHeight
	setCanvasSize(gCanvas, gw, gh)
	gRecount = 1;
	drawClock();

	//after canvas width,height	
	fillTable();
}

function fillTable() {
	if (gDigitalMode && window.innerWidth > window.innerHeight) {
		rows = 1;
	}
	else {
		rows = 2;
	}
	el("t").innerHTML = '<tr><td><div class="comboboxbutton" id="runstop">' + getRunStopText() + '</div>'
		+ (rows == 1 ? '' : '<tr>') + '<td><div class="comboboxbutton" id="set">'
		+ ln('parameters') + '</div>'
}

function imageLoaded() {
	gImageLoaded++;
	drawClock();
}

function keydown() {
	if (isModalVisible()) {
		return
	}
	if (gTime == 0) {
		gTime = new Date().getTime()
		gBeepIndex = 0
		gInterval = setInterval(drawClock, 200);
	}
	else {
		stopTimerIfRun();
		drawClock();
	}
	updateRunStopButton();
}

function getRunStopText() {
	return ln(gTime ? 'stop' : 'run')
}

function updateRunStopButton() {
	el("runstop").innerHTML = getRunStopText();
}

function stopTimerIfRun() {
	if (gTime != 0) {
		clearInterval(gInterval);
		gTime = 0
	}
}

function adjust(l) {
	let m;
	if (l < 10) {
		l *= 60;
	}
	else if (l > 99) {//123 means 1 minute and 23 seconds
		m = l % 100;
		if (m > 59) {
			return Infinity;
		}
		l = Math.floor(l / 100) * 60 + m
	}
	return l;
}

function drawClock() {
	if (gImageLoaded < gImageUrl.length) {
		return;
	}
	gCtx.save()

	let i, j, k, l, m, w;
	let MLW = 2;
	FS = [70, 80];
	K = [0.9, 0.85, 0.8];
	LW = [7, 7, 14];
	let size = Math.min(gw, gh);

	let r = size / 2 - MLW / 2 - (MLW % 2 == 0 ? 0 : 1);
	NUMBER_MARGIN = 15 * r / 500;

	//use pattern allow width & height >512
	gCtx.rect(0, 0, gw, gh);
	gCtx.fillStyle = gCtx.createPattern(gImage[0], "repeat");
	gCtx.fill();

	gCtx.fillStyle = '#000'
	gCtx.lineCap = "round";
	gCtx.strokeStyle = '#000'

	gCtx.textBaseline = "top";
	//not need to show very first 00:00 so from j=1
	l = [ln(gMobile ? 'Press to start/clear' : 'Press any key to start/clear stopwatch'), gBeepTime.slice(1).map(e => timeToString(e, false)).join(' ')]
	if (gRecount) {
		gRecount = 0;
		let minHeight = 12;
		//get max font height
		outer121: for (i = minHeight; ; i++) {
			gCtx.font = i + "px Times New Roman";
			for (j = 0; j < l.length; j++) {
				k = gDigitalMode ? 0 : i * (j + 1)
				m = gw / 2 - Math.sqrt((2 * r - k) * k)
				if (gCtx.measureText(l[j]).width > m) {
					break outer121;
				}
			}
		}

		if (!gDigitalMode) {
			i--;

			k = (gh - gw) / 2;
			if (k > 2 * i) {
				step = 1;
				m = gw - gSetButtonSize.width
				outer122: for (i = k / 2; i >= minHeight; i -= step) {
					gCtx.font = i + "px Times New Roman";
					for (j = 0; j < 1; j++) {
						if (gCtx.measureText(l[j]).width <= m) {
							break outer122;
						}
					}
				}
			}

		}
		gFontSize = i
	}
	else {
		i = gFontSize;
	}

	if (gTime == 0) {
		m = 0;
	}
	else {
		m = Math.floor((new Date().getTime() - gTime) / 1000)
		if (m >= gBeepTime[gBeepIndex]) {
			gSound.play()
			gBeepIndex++
		}
	}
	s = timeToString(m, true)

	if (gParameter == 1) {
		document.title = s
	}
	else {
		gCtx.font = gFontSize + "px Times New Roman";
		l.forEach((e, i) => gCtx.fillText(e, 0, gFontSize * i))
	}

	if (gDigitalMode) {
		j = Math.max(gSetButtonSize.height, 2 * gFontSize);
		l = 800;
		k = new DigitalFont(Math.min(gw, l), Math.min(gh - j, l), s);
		k.drawStringInPoint(gw / 2, j + (gh - j) / 2, s, gCtx);
		gCtx.beginPath();//DONT REMOVE, if switch after digital mode to analog then bad background drawing
	}
	else {
		gCtx.translate(gw / 2, gh / 2);

		gCtx.lineWidth = MLW;
		gCtx.beginPath();
		gCtx.arc(0, 0, r, 0, 2 * Math.PI);
		gCtx.stroke();

		gCtx.textBaseline = "middle";
		gCtx.textAlign = "center";
		for (i = 0; i < 60; i++) {
			if (i % 5 == 0) {
				j = i % 10 != 0 ? 1 : 2;
			}
			else {
				j = 0;
			}
			gCtx.lineWidth = 2;//don't like too wide LW[j] * size / 1100;
			gCtx.moveTo(0, -r);
			gCtx.lineTo(0, -r * K[j]);
			gCtx.stroke();

			if (i % 5 == 0) {
				j = i % 10 == 0 ? 1 : 0;//don't allow bool for j
				k = FS[j] * size / 700;
				gCtx.font = "bold " + k + "px Times New Roman";

				//in cpp project -r * K[2]+NUMBER_MARGIN+k/2
				//but -r* K[2]+k/2 looks better
				l = r * K[2] - k
				gCtx.fillText((i == 0 ? 60 : i).toString(), 0, -r * K[2] + k / 2);
			}
			gCtx.rotate(2 * Math.PI / 60);
		}

		//m seconds
		// seconds arrow
		j = Math.floor(m % 60) * Math.PI / 30
		width = LW[2] * size / 1100;
		gCtx.beginPath();
		gCtx.strokeStyle = 'rgb(225, 0, 0)'
		gCtx.lineWidth = width;
		gCtx.lineCap = "round";
		gCtx.moveTo(0, 0);
		gCtx.rotate(j);
		gCtx.lineTo(0, -r + width / 2);
		gCtx.stroke();
		gCtx.rotate(-j);

		//in cpp draw 00:00 after arrow
		j = "00:00";//if use j=timeToString(m) string will have different width for 00:10 & 00:11 
		for (k = Math.floor(r * 0.55); k >= 0; k--) {
			gCtx.font = k + "px Times New Roman";
			w = gCtx.measureText(j).width
			if (w <= 2 * l) {
				let d = document.createElement("span");
				d.font = k + "px Times New Roman";
				d.textContent = j;
				document.body.appendChild(d);
				emHeight = d.offsetHeight;
				document.body.removeChild(d);

				//already middle
				//gCtx.textBaseline="middle";
				gCtx.textAlign = "left";//earlier set "center" and text jumps when 00:10 & 00:11 because of diffent width
				gCtx.fillText(s, -w / 2, emHeight / 2);
				break;
			}
		}
	}
	gCtx.restore()
}

function zeroFormat(i) {
	return (i < 10 ? '0' : '') + i
}

function timeToString(i, full) {
	let j = Math.floor(i / 60);
	let k;
	if (full) {
		k = zeroFormat(j) + ":";
	}
	else {
		k = ''
		if (j != 0) {
			k += j;
		}
	}
	return k + zeroFormat(i % 60)
}

function parseTimes(p, checkonly = false) {
	gTimes = p = p.trim()
	let c, l, m, beepTime = [0]
	if (p && p.split(/\s+/).some(e => {
		m = /^(\+)?(\d+)(?:,([1-9]\d*))?$/.exec(e)
		if (!m || (l = adjust(+m[2])) == Infinity) {
			return 1
		}
		if (m[1] || m[3]) {
			for (c = m[3] ?? 1; c > 0; c--) {
				//with counter always reference from last value
				beepTime.push(beepTime[beepTime.length - 1] + l);
			}
		}
		else {
			beepTime.push(l);
		}
		return 0
	})) {
		return 0
	}
	if (!checkonly) {
		//need to sort, because js Set is not ordered, remove duplicates
		gBeepTime = [...new Set(beepTime.sort((a, b) => a - b))]
	}
	return 1
}

function inputChanged(event) {
	event.stopPropagation()
	p = el("params")
	e = parseTimes(p.value, true)
	p.style.color = e ? "black" : "red"
	getModalButton(0).disabled = !e
}

function clickModal(n) {
	if (n == 0) {
		let i = gDigitalMode
		gDigitalMode = el("check").checked;
		gRecount = i != gDigitalMode
		parseTimes(el("params").value)
		//write cookie
		setCookie(gPageName, (gDigitalMode ? 'd' : '') + gTimes);
		stopTimerIfRun()
		drawClock()
		updateRunStopButton()
	}
}
