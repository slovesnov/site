let gTotalTime
let gTimerId = 0
let gStartTimer = 0
let gUserError
let gUserMass

function load() {
	let a = [
		"блины#pan",
		"грибной суп#mushroomsoup",
		"грибы жареные#friedmushrooms",
		"грибы соленые#pickledmushrooms",
		"иван-чай и другие#tea",
		"кабачки жареные#squash",
		"капуста квашеная#cabbage",
		"картошка жареная#friedpotato",
		"квас#kvass",
		"куриный суп#chickensoup",
		"курица в м.печи#chikenmicrowave",
		"курица жареная#chiken",
		"малиновая засыпка#raspberry",
		"малиновый компот#compote",
		"оладьи#pancake",
		"пирожки жареные#friedpies",
		"ревеневый мармелад#rheummarmalade",
		"рыба сушеная#fish",
		"салат Оливье#olivie",
		"сухари в м.печи#rusk",
		"творог#quark",
		"чайный гриб#kombucha",
		"яблочный джем#applesjam",
		"яблочный мармелад#applesmarmalade",
		"яблочная начинка#applefilling",
		"яйца вареные#eggs"
	]
	let columns = 4;
	let i, j, k, l, table, row, cell

	table = el("list");
	for (j = 0; j < a.length;) {
		row = table.insertRow(-1)
		for (i = 0; i < columns && j < a.length; i++, j++) {
			cell = row.insertCell(-1)
			k = a[j].search("#")
			cell.innerHTML = '<a href="' + a[j].substring(k) + '">' + a[j].substring(0, k) + '</a>';
		}
	}

	row = el("coefficients").rows;
	l = row[1].cells

	for (i = 2; i < row.length; i++) {
		k = row[i]
		j = k.cells[2]
		if (j == undefined) {
			continue;
		}

		l = k.cells[1].innerHTML
		if (l == '?') {
			j.innerHTML = l
			continue;
		}
		l = 60 / eval(getPureK(l))
		j.innerHTML = normalize(l.toFixed(2))
	}

	inputChanged()
	updateTimerButtonImage()
	updateTimer()
}

function getPureK(l) {
	let k = l.indexOf(" ");
	if (k != -1) {
		l = l.slice(0, k)
	}
	return l
}

function inputChanged() {
	if (gTimerId != 0) {
		stopTimer();
	}
	el("timepass").style.color = "black"
	el("timeremain").style.color = "black"

	let a = trhasError(mass, massresult, true)
	let error = a[0]
	let m = a[1]
	let i, j, k, n
	let a1 = trhasError(usercoefficient, usercoefficientresult, false)
	gUserError = a1[0] || error
	if (!gUserError) {
		gUserMass = m
		i = el("coefficienttype").selectedIndex
		j = eval(usercoefficient.value);
		gTotalTime = m * (i == 1 ? j : 60 / j)
	}
	el("timeresult").innerHTML = gUserError ? "??" : timeToString(gTotalTime)
	updateTimer()

	let row = el("coefficients").rows;
	for (i = 2; i < row.length; i++) {
		k = row[i];
		j = k.cells[3];
		if (j == undefined) {
			continue;
		}
		n = k.cells[1].innerHTML
		if (n == '?') {
			j.innerHTML = '??:??'
		}
		else {
			j.innerHTML = error ? "-" : timeToString(m * eval(getPureK(n)))
		}
	}
}

//begin timer functions
function startStopTimer() {
	if (gTimerId == 0) {
		gTimerId = setInterval(updateTimer, 1000);
		gStartTimer = new Date().getTime();
		el("timepass").style.color = "black"
		el("timeremain").style.color = "black"
		updateTimer()
		updateTimerButtonImage()
	}
	else {
		stopTimer()
	}
}

function stopTimer() {
	clearInterval(gTimerId);
	gTimerId = 0
	updateTimerButtonImage()
}

function updateTimer() {
	let i, j;
	if (gUserError) {
		el("timepass").innerHTML =
			el("timeremain").innerHTML =
			el("seccoefficient").innerHTML = "??"
	}
	else {
		j = gTimerId == 0 ? 0 : Math.round((new Date().getTime() - gStartTimer) / 1000)
		i = gTotalTime - j;
		if (gTimerId != 0 && (j == 0 || i == 0)) {//beep only if timer is running
			try {
				new Audio('img/microwave/' + (i == 10 ? 1 : 2) + '.mp3').play();
			}
			catch (err) {//some versions of browsers don't support Audio element
			}
		}

		el("timepass").innerHTML = timeToString(j);
		el("seccoefficient").innerHTML = (j / gUserMass).toFixed(2)
		if (i < 0) {
			el("timeremain").style.color = "red";
			j = '-' + timeToString(-i);
		}
		else {
			j = timeToString(i);
		}
		el("timeremain").innerHTML = j
	}
}

function updateTimerButtonImage() {
	el("timerimage").src = "img/microwave/" + (gTimerId == 0 ? "play" : "pause") + ".png";
}
//end timer functions
