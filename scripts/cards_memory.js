g_suits = 'cdsh'
g_cards = 'AKQJT98765432'

//for cards_memory
g_time = 300;//milliseconds
var g_timeoutid, g_o;

function load() {
	var i, j, k, s = ''
	for (i = 0; i < 4; i++) {
		s += '<img src="img/bridge/' + g_suits.charAt(i) + '.png"'
		if (cm() && i > 0) {
			s += ' class="s1"'
		}
		s += '>'
		if (i % 2) {
			s += '<span class="redtext">'
		}
		for (j = 12; j >= 0; j--) {
			k = j * 4 + i;
			s += '<span id="i' + k + '"';
			if (cm()) {
				s += ' class="s"'
			}
			s += ' onmouseover="over(this)" onmouseleave="leave()"'
			if (!cm()) {
				s += ' onclick="spanClick()"'
			}
			s += '>' + g_cards.charAt(j) + '</span>'
		}
		if (i % 2) {
			s += '</span>'
		}
		s += '<br>'
	}
	s += '<textarea rows="5" style="width:220px" id="helperedit"></textarea><br>'
	s += '<input type="button" value="reset" onclick="onclear()">'
	document.getElementById('table').innerHTML = s;

	if (cm()) {
		g_time = parseFloat(document.getElementById('time').innerHTML) * 1000
		//console.log(g_time)
	}
	else {
		document.body.onkeydown = spanClick
	}
}

function cm() {
	return gPageName == 'cards_memory';
}

function over(o) {
	g_o = o;
	if (cm()) {
		g_timeoutid = setTimeout(spanClick, g_time);
	}
}

function leave() {
	if (cm()) {
		clearTimeout(g_timeoutid)
	}
	else {
		g_o = undefined;
	}
}

function spanClick() {
	if (g_o === undefined) {
		return;
	}
	document.getElementById('i' + parseInt(g_o.id.substring(1))).classList.toggle("out");
}

function getCheck(i) {
	return document.getElementById('i' + i).classList.contains("out");
}

function setCheck(i, v) {
	if (v != getCheck(i)) {
		document.getElementById('i' + i).classList.toggle("out");
	}
}

function onclear() {
	for (i = 0; i < 52; i++) {
		setCheck(i, false);
	}
	document.getElementById('helperedit').value = "";
}

function cclear(k) {
	var c = false
	for (i = 0; i < 13; i++) {
		if (!getCheck(i * 4 + k)) {
			c = true;
			break;
		}
	}
	for (i = 0; i < 13; i++) {
		setCheck(i * 4 + k, c);
	}
}
