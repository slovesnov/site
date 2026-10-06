function getInfo(x, id1, id2) {
	let card = x.innerHTML.toLowerCase();

	//sklansky group
	sg = 9
	dg = 9
	if (card == 'aa' || card == 'kk' || card == 'qq' || card == 'jj')
		sg = 1
	else if (card == 'tt')
		sg = 2
	else if (card == '99')
		sg = 3
	else if (card == '88')
		sg = 4
	else if (card == '77' || card == '97')
		sg = 5
	else if (card == '66' || card == '55' || card == '87' || card == '86' || card == '75')
		sg = 6
	else if (card == '44' || card == '33' || card == '22')
		sg = 7
	else if (card == 'ak') {
		sg = 1
		dg = 2
	}
	else if (card == 'aq') {
		sg = 2
		dg = 3
	}
	else if (card == 'kq' || card == 'aj') {
		sg = 2
		dg = 4
	}
	else if (card == 'kj' || card == 'qj' || card == 'jt') {
		sg = 3
		dg = 5
	}
	else if (card == 'k8' || card == 'k7' || card == 'k6' || card == 'k5' || card == 'k4' || card == 'k3' || card == 'k2' ||
		card == 'q8' || card == 't7' || card == '64' || card == '53' || card == '43') {
		sg = 7
	}
	else if (card == 'a8' || card == 'a7' || card == 'a6' || card == 'a5' || card == 'a4' || card == 'a3' || card == 'a2') {
		sg = 5
	}
	else if (card == 'at') {
		sg = 3
		dg = 6
	}
	else if (card == 'kt' || card == 'qt') {
		sg = 4
		dg = 6
	}
	else if (card == 'k9' || card == 'j8') {
		sg = 6
		dg = 8
	}
	else if (card == 'j8' || card == '54') {
		sg = 6
		dg = 8
	}
	else if (card == 'a9' || card == 'q9' || card == 't8' || card == '87' || card == '76' || card == '65') {
		sg = 5
		dg = 8
	}
	else if (card == 'j9' || card == 't9' || card == '98') {
		sg = 4
		dg = 7
	}
	else if (card == 'j7' || card == '96' || card == '85' || card == '74' || card == '42' || card == '32') {
		sg = 8
	}

	let pair = 0;
	if (card.charAt(0) == card.charAt(1))
		pair = 1;

	ss = '<b>' + card.toUpperCase();
	if (pair == 0)
		ss = ss + 's';
	ss += '(' + sg + ')</b>'

	ds = '<b>' + card.toUpperCase() + '(' + dg + ')</b>'

	//dont do else if!!!! there are some intersections here
	if (card == 'aa' || card == 'kk' || card == 'qq' || card == 'jj' || card == 'tt' || card == '99' || card == 'ak' || card == 'aq') {
		ss += '<br>always.13'
		ds += '<br>always.13'
	}

	if (card == '88' || card == '77' || card == '66')
		ss += '<br>utg.10<br>otherwise.13'

	if (card == '55' || card == '44' || card == '33' || card == '22')
		ss += '<br>utg.8<br>mp.10<br>otherwise.13'

	if (card == 'aj' || card == 'at') {
		ss += '<br>utg.8<br>otherwise.13'
		ds += '<br>utg.7<br>mp 8<br>cut.11<br>otherwise.13'
	}

	if (card == 'a9' || card == 'a8' || card == 'a7' || card == 'a6' || card == 'a5' || card == 'a4' || card == 'a3' || card == 'a2') {
		ss += '<br>utg.5<br>mp.7<br>cut.button.10<br>sb.13'
		ds += '<br>utg.mp.5<br>cut.7<br>button.9<br>sb.13'
	}

	if (card == 'kq' || card == 'kj' || card == 'kt' || card == 'k9' || card == 'qj' || card == 'qt' || card == 'q9' || card == 'jt' || card == 'j9' || card == 't9')
		ss += '<br>utg.8<br>mp.10<br>otherwise.13'

	if (card == 'k8' || card == 'k7' || card == 'k6' || card == 'k5' || card == 'k4' || card == 'q8' || card == 'j8' || card == 't8' || card == '98')
		ss += '<br>utg.5<br>mp.6<br>cut.8<br>button.9<br>sb.13'

	if (card == 'kq' || card == 'kj' || card == 'kt' || card == 'qj' || card == 'qt' || card == 'jt')
		ds += '<br>utg.5<br>mp.8<br>cut.button.10<br>sb.13'

	if (card == 'q7' || card == 'q6' || card == '97' || card == '96' || card == '87' || card == '86' || card == '76' || card == '75' || card == '65')
		ss += '<br>utg.4<br>mp.5<br>cut.6<br>button.7<br>sb.13'

	//simple rebound
	s = ''
	d = ''
	if (card == 'aa' || card == 'kk' || card == 'qq' || card == 'jj' || card == 'ak') {
		s += '<br>always.13'
		d += '<br>always.13'
	}
	if (card == 'tt' || card == '99')
		s += '<br>utg.8<br>mp.9<br>cut.11'
	if (card == '88' || card == '77')
		s += '<br>mp.5<br>cut.7'
	if (card == 'aq') {
		s += '<br>utg.8<br>mp.9<br>cut.11'
		d += '<br>utg.8<br>mp.9<br>cut.11'
	}
	if (card == 'aj' || card == 'at')
		s += '<br>mp.6<br>cut.9'
	if (card == 'aj')
		d += '<br>mp.5<br>cut.7'
	if (card == 'at')
		d += '<br>cut.6'
	if (card == 'a9')
		s += '<br>cut.6'

	if (s.length > 0)
		ss += "<br>[reb i!=bl]" + s//dont remove double qoute
	if (d.length > 0)
		ds += "<br>[reb i!=bl]" + d//dont remove double qoute

	//rebound sb
	s = ''
	d = ''
	if (card == 'aa' || card == 'kk' || card == 'qq' || card == 'jj' || card == 'ak') {
		s += '<br>always.13'
		d += '<br>always.13'
	}
	if (card == 'tt' || card == '99' || card == 'aq') {
		s += '<br>mp.cut.button.13'
		d += '<br>mp.cut.button.13'
	}
	if (card == '88' || card == '77' || card == 'aj' || card == 'at')
		s += '<br>mp.7<br>cut.button.13'

	if (card == '66' || card == '55')
		s += '<br>cut.5<br>button.8'

	if (card == 'aj')
		d += '<br>mp.6<br>cut.button.13'

	if (card == 'at')
		d += '<br>mp.4<br>cut.8<br>button.10'

	if (card == 'a9')
		s += '<br>mp.4<br>cut.8<br>button.10'

	if (card == 'a8' || card == 'a7' || card == 'a6' || card == 'a5' || card == 'a4' || card == 'kq' || card == 'kj')
		s += '<br>cut.4<br>button.6'

	if (card == 'a9' || card == 'a8' || card == 'a7' || card == 'kq')
		d += '<br>cut.4<br>button.6'

	if (s.length > 0)
		ss += "<br>[reb i=sb]" + s//dont remove double qoute
	if (d.length > 0)
		ds += "<br>[reb i=sb]" + d//dont remove double qoute

	//rebound bb
	s = ''
	d = ''
	if (card == 'aa' || card == 'kk' || card == 'qq' || card == 'jj' || card == 'ak') {
		s += '<br>always.13'
		d += '<br>always.13'
	}
	if (card == 'tt' || card == '99' || card == 'aq') {
		s += '<br>mp.cut.button.sb.13'
		d += '<br>mp.cut.button.sb.13'
	}
	if (card == '88' || card == '77' || card == 'aj' || card == 'at')
		s += '<br>mp.8<br>cut.button.sb.13'

	if (card == '66' || card == '55')
		s += '<br>mp.5<br>cut.8<br>button.10<br>sb.13'

	if (card == '44' || card == '33')
		s += '<br>mp.4<br>cut.5<br>button.6<br>sb.7'

	if (card == 'aj')
		d += '<br>mp.7<br>cut.button.sb.13'

	if (card == 'at')
		d += '<br>mp.6<br>cut.10<br>button.sb.13'

	if (card == 'a9')
		s += '<br>mp.6<br>cut.10<br>button.sb.13'

	if (card == 'a8' || card == 'a7' || card == 'a6' || card == 'a5' || card == 'a4')
		s += '<br>mp.3<br>cut.6<br>button.8<br>sb.13'

	if (card == 'a9' || card == 'a8' || card == 'a7')
		d += '<br>mp.3<br>cut.6<br>button.8<br>sb.13'

	if (card == 'a3' || card == 'a2')
		s += '<br>mp.2<br>cut.5<br>button.6<br>sb.8'

	if (card == 'a6' || card == 'a5' || card == 'a4' || card == 'a3' || card == 'a2')
		d += '<br>mp.2<br>cut.5<br>button.6<br>sb.8'

	if (card == 'kq' || card == 'kj')
		s += '<br>mp.4<br>cut.5<br>button.8<br>sb.13'

	if (card == 'kq')
		d += '<br>mp.4<br>cut.5<br>button.8<br>sb.13'

	if (card == 'kt' || card == 'k9' || card == 'qj')
		s += '<br>mp.3<br>cut.4<br>button.6<br>sb.10'

	if (card == 'kj' || card == 'kt')
		d += '<br>mp.3<br>cut.4<br>button.6<br>sb.10'

	if (s.length > 0)
		ss += "<br>[reb i=bb]" + s//dont remove double qoute
	if (d.length > 0)
		ds += "<br>[reb i=bb]" + d//dont remove double qoute
	//end all of the rebounds

	if (ds.length < 14)
		ds += '<br>never';//'['+ds.length+']';//'never'
	if (ss.length < 14)
		ss += '<br>never';//'['+ss.length+']';//'never'

	if (pair == 1)
		ds = "";

	el(id1).innerHTML = ss
	el(id2).innerHTML = ds
	//alert(ss);
}
function mov(x) {
	x.style.backgroundColor = 'palegreen';
}
function fix(x) {
	getInfo(x, "fx1", "fx2")
}
function mou(x) {
	x.style.backgroundColor = "transparent"//alternative variant x.style.backgroundColor = ""
}
function load() {
	let row;
	let t = el("ct");
	for (i = 0; i < t.rows.length; i++) {
		row = t.rows[i];
		for (j = 0; j < row.cells.length; j++) {
			x = row.cells[j].innerHTML;
			if (x == 'k3' || x == 'k2'
				|| x == 'q5' || x == 'q4' || x == 'q3' || x == 'q2'
				|| x == 'j7' || x == 'j6' || x == 'j5' || x == 'j4' || x == 'j3' || x == 'j2'
				|| x == 't7' || x == 't6' || x == 't5' || x == 't4' || x == 't3' || x == 't2'
				|| x == '95' || x == '94' || x == '93' || x == '92'
				|| x == '85' || x == '84' || x == '83' || x == '82'
				|| x == '74' || x == '73' || x == '72'
				|| x == '64' || x == '63' || x == '62'
				|| x == '54' || x == '53' || x == '52'
				|| x == '43' || x == '42'
				|| x == '32')
				row.cells[j].style.color = '#FF7F50';
			else if (x == 'k9' || x == 'k8' || x == 'k7' || x == 'k6' || x == 'k5' || x == 'k4'
				|| x == 'q9' || x == 'q8' || x == 'q7' || x == 'q6'
				|| x == 'j9' || x == 'j8'
				|| x == 't9' || x == 't8'
				|| x == '98' || x == '97' || x == '96'
				|| x == '87' || x == '86'
				|| x == '76' || x == '75'
				|| x == '65')
				row.cells[j].style.color = '#B8860B';
		}
	}
}
