function mov(x) {
	x.style.backgroundColor = 'palegreen';
}
function fix(x) {
	let card = x.innerHTML.toLowerCase();
	ss = '<b>' + card.toUpperCase() + '</b><br>'
	if (card == 'aa' || card == 'kk')
		ss += 'r&le;1 raise<br>else all in'
	else if (card == 'qq')
		ss += 'r&le;1 raise'
	else if (card == 'ak')
		ss += 'r=0 raise<br>r=1 call'
	else if (card == 'jj' || card == 'tt')
		ss += 'r=0 [early:call] [else:raise]'
	else if (card == '99' || card == '88' || card == '77' || card == '66' || card == '55' || card == '44' || card == '33' || card == '22')
		ss += 'r=0 call'
	else if (card == 'aq' || card == 'aj' || card == 'kq')
		ss += 'r=0 [early.mid fold] [late.bl raise]'
	else
		ss += 'nothing'
	el("fx1").innerHTML = ss
}
function fif(x) {
	let card = x.innerHTML.toLowerCase();
	ss = '<b>' + card.toUpperCase() + '</b><br>'
	if (card == 'aa' || card == 'kk')
		ss += 'r=0 raise<br>else all in'
	else if (card == 'ak' || card == 'qq' || card == 'jj')
		ss += 'r=0 raise<br>r=1 all in'
	else if (card == 'tt' || card == 'aq')
		ss += 'r=0 [mid.late.bl raise]'
	else
		ss += 'nothing'
	el("fx2").innerHTML = ss
}
function mou(x) {
	x.style.backgroundColor = "transparent"//alternative variant x.style.backgroundColor = ""
}
function load() {
	let row, t;

	t = el("t24");
	for (i = 0; i < t.rows.length; i++) {
		row = t.rows[i];
		for (j = 0; j < row.cells.length; j++) {
			x = row.cells[j].innerHTML;
			if (!(x == 'aa' || x == 'kk' || x == 'qq' || x == 'jj' || x == 'tt' || x == '99' || x == '88' || x == '77' || x == '66' || x == '55' || x == '44' || x == '33' || x == '22'
				|| x == 'ak' || x == 'aq' || x == 'aj' || x == 'kq' || j == 0 && i > 0))
				row.cells[j].style.color = '#FF7F50';
		}
	}

	t = el("t14");
	for (i = 0; i < t.rows.length; i++) {
		row = t.rows[i];
		for (j = 0; j < row.cells.length; j++) {
			x = row.cells[j].innerHTML;
			if (!(x == 'aa' || x == 'kk' || x == 'qq' || x == 'jj' || x == 'tt'
				|| x == 'ak' || x == 'aq' || j == 0 && i > 0))
				row.cells[j].style.color = '#FF7F50';
		}
	}
}