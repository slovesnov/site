/*чешуйки на голокучнике
Строго говоря, рахисы орляка имеют совсем мелкий пушок (то есть чешуйки как бы есть). Эти чешуйки исчезнут когда вайя развернется.

pteridiumAquilinum
matteucciaStruthiopteris
athyriumFilix-femina
dryopterisFilix-mas
dryopterisExpansa
dryopterisCarthusiana
gymnocarpiumDryopteris

aquilinum struthiopteris filix-femina filix-mas expansa carthusiana dryopteris
*/
const bracken = 'pteridium aquilinum'
const ostrich = 'matteuccia struthiopteris'
const lady = 'athyrium filix-femina'
const male = 'dryopteris filix-mas'
const wide = 'dryopteris expansa'
const cart = 'dryopteris carthusiana'
const oak = 'gymnocarpium dryopteris'
const ladyfernIndex = 2;

const ferns = [
	{ frname: 'орляк обыкновенный', lname: bracken, ename: 'bracken fern' },
	{ frname: 'страусник обыкновенный', lname: ostrich, ename: 'ostrich fern' },
	{ frname: 'кочедыжник женский', lname: lady, ename: 'lady-fern' },/*lady-fern with - from english wikipedia */
	{ frname: 'щитовник мужской', lname: male, ename: 'male fern' },
	{ frname: 'щитовник широкий<br>щитовник распростёртый', lname: wide, ename: 'northern buckler-fern<br>spiny wood fern' },
	{ frname: 'щитовник картузианский', lname: cart, ename: 'spinulose wood fern<br>narrow buckler-fern' },
	{ frname: 'голокучник обыкновенный', lname: oak, ename: 'oak fern' },
]

function load() {
	b = ferns.map(e => e.frname.replace(/<br>.*/, ''))
	a = getPlantsArray().filter(e => b.includes(e.name.toLowerCase()))
	data = []
	ferns.forEach((e, i) => {
		e.bush = ![bracken, oak].includes(e.lname)
		e.scales = ![bracken, oak, ostrich].includes(e.lname)
		e.form = ![ostrich, lady, male].includes(e.lname)
		b = e.lname.split(' ')
		c = b[1]
		e.n = b[0] + c[0].toUpperCase() + c.slice(1)
		e.rname = e.frname.split('<br>')[0]//short name
		n = a.find(e1 => e1.name.toLowerCase() == e.rname)
		data.push([[referenceFromPlant(n) + ' ' + e.frname, e.frname], e.lname, e.ename])
		if (i == 2) {
			//https://www.gardenia.net/plant/athyrium-filix-femina-lady-in-red
			data.push([[referenceFromPlant(n) + ' ' + e.frname + ' (девочка в красном)'], e.lname + ' var. angustum', 'lady in red lady-fern'])
		}
	});

	[[0, wide, ostrich, cart], [8, wide, cart, cart, cart], [12, wide, cart, cart, cart]].forEach((e, i) => {
		t = el('tc' + i)
		r = t.insertRow(-1)
		r1 = t.insertRow(-1)
		e.forEach((e1, i) => {
			if (i) {
				r.insertCell(-1).outerHTML = '<th>' + rname(e1) + '</th>'
				c = r1.insertCell(-1)
				c.id = 'c' + (e[0] + i - 1)
			}
		})

	});

	[24, 21, 25//0-2 щитовник широкий, страусник, щитовник картузианский
		, undefined //3 not used
		, null, null, null, null //4-7 нижний левый листочек вайи, орляк, страусник, кочедыжник
		, 44, null, null, 45, [null, 44], [null, 'c9'], [null, 'c10'], [null, 45], [null, 'c16'], [null, 'c17']
		//8-15 щитовник широкий и щитовник картузианский сравнение
		//c16,c17 - все вайи в одном масштабе
	].forEach((e, i) => {
		if (e === undefined) {
			return
		}
		b = Array.isArray(e)
		img = b ? e[0] : e
		if (img === null) {
			img = 'c' + i
		}
		r = b ? e[1] : null
		// console.log('c' + i,i,img,r)
		el('c' + i).innerHTML = ref(img,0,0, r)
	})

	title = ['русское название', 'латинское название', 'английское название']
	el('p1').innerHTML = new Table(title, data, "bcn").html()

	title = ['название вида', 'чешуйки на рахисе', 'вайя треугольная', 'растёт кустом']
	data = []
	ferns.forEach(e => {
		data.push([e.rname, yn(e.scales), yn(e.form), yn(e.bush)])
	});
	options = { class: "ar", o: "bc" }
	el('p2').innerHTML = new Table(title, data, options).html()

	n0 = ferns.map(e => e.rname)

	n4 = n0.slice()
	n4.splice(2, 0, n4[2])
	n4.splice(0, 0, n4[0])

	n3 = n0.slice()
	n3.splice(0, 0, n3[0])

	for (l = 0; l < 5; l++) {//table cycle
		t = el('t' + l)
		// console.log(t)
		title = l < 2 ? n4 : (l == 3 ? n3 : n0)
		m = title.length
		n = (m + m % 2) / 2
		a = [generateArray(0, n), generateArray(n, m - n)];
		a.forEach(e => {
			for (j = 0; j < 2; j++) {//rows cycle
				r = t.insertRow(-1)
				e.forEach(i => {//cells cycle
					o = r.insertCell(-1)
					if (j == 0) {
						o.outerHTML = '<th'
							//+ (l == 1 && i == 6 ? ' style="font-size:9.5pt;"' : '')
							+ '>' + title[i] + '</th>'
					}
					else {
						o.innerHTML = ref(l + '' + i)
					}
				})
			}
		})
	}
	el('f0').innerHTML = ref('fronds', 1920)
	for (i = 0; i < 16; i++) {
		j = [0, 9].indexOf(i)
		if (j != -1) {
			t = el('tf' + j)
			b = [['кочедыжник женский', 'щитовн. широкий', 'страусник'
				, 'буковник &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; обыкновенный'],
			['голокучник обыкнов.', 'щитовн. картузианский', 'щит. мужской', 'орляк обыкновенный', 'телиптерис']]
			c = [[5, 1, 1, 2], [1, 2, 1, 2, 1]]
			t.insertRow(-1).innerHTML = c[j].reduce((a, e, i) => a + '<th colspan=' + e + '>' + b[j][i], '')
			r = t.insertRow(-1)
		}
		o = r.insertCell(-1)
		o.innerHTML = ref('f' + i, null, 400)
	}
}

function yn(a) {
	return a ? 'да' : 'нет'
}

function ref(name, w, h, n) {
	return imageref('fern',name, w, h, n)
}

//generateArray =[start,start+1...] length of array = length 
function generateArray(start, length) {
	return Array.from({ length }, (v, k) => k + start);
}

function rname(s) {
	return ferns[ferns.findIndex(e => e.lname == s)].rname
}