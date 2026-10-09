languageString = [[
	'tricks', 'deals', 'probability'
	, 'total', 'contract', 'players'
	, 'defender', 'declarer', 'catcher', 'misere player'
	, 'north', 'east', 'south', 'west'
], [
	'взяток', 'раскладов', 'вероятность'
	, 'всего', 'контракт', 'игрока'
	, 'вистующий', 'играющий', 'ловец', 'мизерист'
	, 'север', 'восток', 'юг', 'запад'
]];

//gLanguage='english'

function load() {
	if (gPageName == 'bridge_logic52') {
		gs.forEach((e, i) => {
			el('c' + i, codeString(e, "cpp"));
		});
		Prism.highlightAll();
		return
	}
	languageString[0].forEach((e, i) => {
		window['g' + e.replace(' ', '_')] = i;
	});
	lstring = function (id) {
		return languageString[gLanguage == 'russian' ? 1 : 0][id];
	}

	const dealsb = [31_038, 219_172, 1_038_782, 2_889_098, 1_022_210]
	const dealsbt = 7;
	const deals = [98, 7324, 132882, 44452]

	ir = function () { r = t.insertRow(-1) }
	ic = function (v, cs) {
		c = r.insertCell(-1)
		if (typeof cs != 'undefined') {
			c.colSpan = cs
		}
		c.innerHTML = typeof v == 'undefined' ? '' : v
	}
	ib = function (v, cs) {
		ic('<b>' + v + '</b>', cs)
		c.style = "text-align:center;"
	}
	iplayers = function (players, b = '') {
		let j, k;
		for (j = 0; j < players; j++) {
			if (b == 2) {
				k = lstring(j ? gcatcher : gmisere_player)
			}
			else {
				k = lstring(j ? gdefender : gdeclarer)
			}
			if (j) {
				k += j;
			}
			if (b == 2) {
				ib(k)
			}
			else {
				ic(k);
				c.classList.add("sf" + b)
				c.style = "text-align:center;"
			}
		}
	}
	setp = function () {
		for (let j = 0; j < players; j++) {
			ib('S<sub>' + (j + 1) + '</sub>(t)');
		}
	}
	ns = () => lstring(gnorth) + ' / ' + lstring(gsouth)
	ew = () => lstring(geast) + ' / ' + lstring(gwest)

	ewns = b => b ? ew() : ns()

	//bridge
	pr = fillDealTable(499, dealsb, dealsbt)
	sc = new Array(2).fill(0);

	t = el("t503");
	ir()
	ic()
	for (i = 0; i < 2; i++) {
		ib(ewns(i))
	}

	ir()
	ib(lstring(gtricks))
	for (i = 0; i < 2; i++) {
		ib('S<sub>' + (i ? 'ew' : 'ns') + '</sub>(t)')
	}

	dealsb.forEach((e, i) => {
		tr = dealsbt + i
		ir()
		ic('t = ' + tr)
		v = countBridgeScore(4, 0, tr, 0, 0)
		ic(v);
		ic(-v);

		v *= pr[i];
		sc[0] += v;
		sc[1] += -v;
	})

	t = el("t513");
	ir()
	ib(lstring(gcontract))
	for (i = 0; i < 2; i++) {
		ib(ewns(i))
	}

	ir()
	ic("4<img src='img/bridge/s.png'>")
	for (i = 0; i < 2; i++) {
		ib(ro(sc[i]))
	}

	//preferans
	pr = fillDealTable(544, deals, 7)
	sc = new Array(14).fill(0);

	st = 556;
	t = el("t" + st);
	for (z = 0; z < 2; z++) {
		ir()
		for (i = 0; i < 2; i++) {
			ic('<table class="single tc" id="t' + (st + 1 + z * 2 + i) + '"></table>');
			c.style = "padding-left: 7px;"
		}
	}

	for (z = 0; z < 2; z++) {
		contract = z + 8
		for (i = 0; i < 2; i++) {
			t = el("t" + (st + 1 + z * 2 + i));
			players = i + 3;
			ir()
			ib(lstring(gcontract) + ' ' + contract + '<img src="img/bridge/d.png"> ( ' + players + ' ' + lstring(gplayers) + ' )', players * 2 + 1)
			c.style = "text-align:center;"

			ir()
			for (j = 0; j < players + 1; j++) {
				ic();
			}
			iplayers(players, 0);
			ir()
			ic(lstring(gtricks))
			c.style = "text-align:center;"
			c.classList.add("sf0")
			ic('pg<sub>1</sub>')
			for (j = 0; j < players - 1; j++) {
				ic('v<sub>' + (j + 2) + '1</sub>')
			}
			setp();

			for (tr = 0; tr < 4; tr++) {
				ir()
				pt = tr + 7;
				ic('t = ' + pt)
				a = score(pt, contract, players)
				a.forEach((e, ind) => {
					ic(ro(e))
					if (ind >= players) {
						sc[ind - players + i * 3 + 7 * z] += e * pr[tr]
						c.style = "background:LemonChiffon;"
					}
				});
			}

		}
	}


	st = 561;
	t = el("t" + st);
	ir()
	for (i = 0; i < 2; i++) {
		ic('<table class="single tc" id="t' + (st + 1 + i) + '"></table>');
		if (i) {
			c.style = "padding-left: 7px;"
		}
	}

	for (i = 0; i < 2; i++) {
		players = i + 3
		t = el("t" + (st + 1 + i));
		ir()
		ib((i + 3) + ' ' + lstring(gplayers), players + 1);
		ir()
		ic(lstring(gcontract))
		c.classList.add("sf1")
		iplayers(players, 1);
		for (j = 0; j < 2; j++) {
			ir()
			ic((j + 8) + '<img src="img/bridge/d.png">')
			for (k = 0; k < players; k++) {
				ic('e<sub>' + (k + 1) + '</sub> = ' + ro(sc[k + i * 3 + 7 * j]));
			}
		}
	}

	//misere game
	const dealsm = [80407, 977, 23345, 49263, 22306, 8207, 251];
	pr = fillDealTable(584, dealsm, 0)
	sc = new Array(7).fill(0);

	for (i = 0; i < 2; i++) {
		players = i + 3;
		t = el("t" + (589 + i));
		ir()
		ib(players + ' ' + lstring(gplayers), players + 1);

		ir()
		ic()
		iplayers(players, 2);

		ir()
		ib(lstring(gtricks))
		setp()

		for (j = 0; j < 7; j++) {
			ir()
			ic('t = ' + j)
			a = score(j, 0, players).slice(players)
			a.forEach((e, ind) => {
				sc[ind + 3 * i] += e * pr[j];
				ic(ro(e))
			});
		}
	}

	st = 597
	t = el("t" + st);
	ir()
	for (i = 0; i < 2; i++) {
		ic('<table class="single tc" id="t' + (st + 1 + i) + '"></table>');
		if (i) {
			c.style = "padding-left: 20px;"
		}
	}


	for (i = 0; i < 2; i++) {
		t = el("t" + (st + 1 + i));
		players = i + 3
		ir();
		ib(players + ' ' + lstring(gplayers), players);
		ir();
		iplayers(players, 2);
		ir();
		for (j = 0; j < players; j++) {
			ic('e<sub>' + (j + 1) + '</sub> = ' + ro(sc[j + 3 * i]))
		}
	}


}

/* 
pt - player tricks
contract
*/
function score(pt, contract, players) {
	let i, j, s, vt, cp, ut, ww, v;
	if (contract == 0) {
		ww = 0
		v = [pt == 0 ? 10 : -10 * pt, 0]
	}
	else {
		vt = 10 - pt;//whist tricks
		cp = 2 * (contract - 5);//contract price
		ut = -(pt - contract);//undertricks
		ww = pt < contract ? ut * cp : 0;
		v = [(pt < contract ? -ut : 1) * cp, (pt < contract ? vt + (contract - pt) : vt) * cp]
	}
	v.push(ww)
	if (players == 4) {
		v.push(ww)
	}

	//set score
	let pg = [];
	for (i = 0; i < players; i++) {
		pg.push(i == 0 ? v[0] : 0);
	}
	let w = [];
	for (i = 0; i < 16; i++) {
		w.push(0);
	}

	let wset = (i, j, v) => w[i * 4 + j] = v;
	let wh = (i, j) => w[i * 4 + j];

	for (i = 1; i < v.length; i++) {
		wset(i, 0, v[i]);
	}

	//count score
	for (j = 0; j < players; j++) {
		s = 10 * (players - 1) / players * pg[j];
		for (i = 0; i < players; i++) {
			if (i != j) {
				s += wh(j, i) - wh(i, j) - 10 * pg[i] / players
			}
		}
		v.push(s)
	}
	return v;
}

function nf(v) {
	return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, gLanguage == 'english' ? "," : " ");
}

function ro(v) {
	return Number.isInteger(v) ? v : v.toFixed(2);
}

function fillDealTable(n, deals, st) {
	let sum = deals.reduce((a, e) => a + e);
	let pr = [];
	t = el("t" + n);
	ir()
	for (i = 0; i < 3; i++) {
		ib(lstring(gtricks + i))
	}
	let total = 0;
	deals.forEach((e, i) => {
		tr = i + st;
		ir()
		ic('t = ' + tr);
		ic(nf(e))
		total += e;
		pr[i] = e / sum;
		ic('pr<sub>' + tr + '</sub> = ' + ro(pr[i] * 100) + '%')
	});
	ir();
	ib(lstring(gtotal))
	ic(nf(total))
	ic('100%')
	return pr;
}

const NT = 4;
function countBridgeScore(contract, trump, tricks, doubleRedouble, vulnerable) {
	let i, j;
	let res = 0;
	let additionalTricks = tricks - contract - 6;
	const suitType = trump == NT ? 2 : (trump < 2 ? 1 : 0);
	const zone = vulnerable;

	if (additionalTricks >= 0) {
		//1 partial notation
		res = (suitType == 0 ? 20 : 30) * contract;
		if (suitType == 2) {
			res += 10;
		}
		if (doubleRedouble != 0) {
			res *= (doubleRedouble == 1 ? 2 : 4);
		}

		//2 premium for partial notation,game, small helmet and big helmet
		if (res < 100) {
			res += 50;
		}
		else {
			res += zone ? 500 : 300;
			if (contract == 6) {
				res += zone ? 750 : 500;
			}
			else if (contract == 7) {
				res += zone ? 1500 : 1000;
			}
		}

		//3 additional tricks above bidding
		if (additionalTricks > 0) {
			if (doubleRedouble == 0) {
				res += (suitType == 0 ? 20 : 30) * additionalTricks;
			}
			else {
				res += 100 * (zone + 1) * doubleRedouble * additionalTricks;
			}
		}

		//4 premium for contra & recontra
		res += 50 * doubleRedouble;
	}
	else { //lost contract
		j = -additionalTricks;
		if (doubleRedouble == 0) {
			res = -(zone ? 100 : 50) * j;
		}
		else {
			for (i = 1; i < j + 1; i++) {
				if (i == 1) {
					res -= zone ? 200 : 100;
				}
				else if (i == 2 || i == 3) {
					res -= zone ? 300 : 200;
				}
				else {
					res -= 300;
				}
			}
			if (doubleRedouble == 2) {
				res *= 2;
			}
		}
	}
	return res;
}

gs = [`struct HashItem {
  int32_t code[3];
  int16_t code3;
  int8_t f;
  int8_t v;
};

struct Hash{
  HashItem i[HASH_ITEMS];
  int32_t next;
};`, `struct Hash {
  int16_t code[3];
  int8_t f;
  int8_t v;
};`, `struct HashItem {
  int16_t code[3];
  int8_t f;
  int8_t v;
};

struct Hash{
  HashItem i[HASH_ITEMS];
  int32_t next;
};`]