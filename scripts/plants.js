const edibleImage = ['edible_eat', 'edible', 'edible_noteat'
	, 'inedible'
	, 'skull', 'question', 'question1']
const edibleFullString = ['съедобные употребляю', 'съедобные не употребляю, не пробовал', 'съедобные не употребляю, не нравится'
	, ['растения с особенностями', 'ягоды с особенностями', 'несъедобные, неядовитые']
	, 'ядовитые', 'неизвестные', 'неизвестные съедобность не указана в книгах'];
const imageColumn = 4;
const maxCompare = 5;
//in common.js const edibleString = ['1', '0', '2','3', '-', '?', '??']

gShowBerryTable = 0

function load() {
	const todolist = 0
	const showUnrecognized = 0
	const sortNames = 1
	const letters = 5
	setn = new Set()
	map = new Map()
	todoPlants = 0
	unrecognized = []
	if (gPageName == 'plants') {
		fetchpost('../php/plants.php', {}, callback)
	}
	a = getPlantsArray(map)
	if (showUnrecognized) {
		console.log('unrecognized' + unrecognized.length + unrecognized.join('\n'))
	}

	if (sortNames || gPageName == 'food') {
		a.sort((a, b) => a.name.localeCompare(b.name))
	}

	gplants = a;

	//a is loaded
	if (gPageName == 'food') {
		loadFood()
		return
	}

	if (gPageName == 'plants_family') {
		map = new Map()
		gplants.forEach(e => {
			j = e.family
			i = map.get(j)
			if (!i) {
				i = []
			}
			i.push(e.name.toLowerCase())
			map.set(j, i)
		})
		el('p').innerHTML = [...map.entries()].sort().reduce((a, e) => a + '<b>' + e[0] + ' (' + e[1].length + ')</b>' + ': ' + e[1].join(', ') + '.<br>'
			, '')
		// s = '';
		// map.forEach((v, k) => {
		// 	s += '<b>' + k + ' ('+v.length+')</b>'+': ' + v.join(', ') + '.<br>'
		// })
		//el('p').innerHTML = s
		return
	}


	gplantsTable = []
	s = ''
	gp = []
	edibleStat = new Array(edibleImage.length).fill(0);

	a.forEach((e, i) => {
		refs = referenceFromPlant(e)

		b = [e.name, e.latinName].map(n => ['<a href="#' + e.latinName + '">' + n + '</a>', n])
		s = ime(e.edible)
		edibleStat[e.edible]++;

		b.push(refs, s, '', '<input type="checkbox" id="c' + i + '" onclick="cc(' + i + ')">')
		gplantsTable.push(b)
		gp.push('<hr><h4 id="' + e.latinName + '">' + e.name + ' ' + e.latinName + ' ' + refs + '</h4>'
			+ '<table>' + e.t + '</table>' + e[0] + e[1] + e.o)
		//console.log(e)
		if (todolist && e.o.length == 0) {
			console.log(todoPlants++, e.name)
		}
	})
	gs = '<td style="vertical-align:top;">' + [...map.entries()].sort().reduce((a, e, i) =>
		a + (i % letters ? '' : '<tr>') + '<td><button class="comboboxbutton" style="width:100%" onclick="lc(\'' + e[0] + '\')">' + e[0] + ' ' + e[1] + '</button>'
		, '<table style="margin-top:0;">') + '</table>'
		+ '<button class="comboboxbutton" onclick=\'window.open("?plants_images", "_blank").focus();\'>' + imagePlant('img') + '</button>'
		+ ' <button class="comboboxbutton" onclick=\'window.open("?plants_family", "_blank").focus();\'>по семействам</button>'
		//+' всего ' + a.length + ','
		+ ' букв ' + map.size
		+ edibleStat.reduce((q, e, i) => q + '<tr><td>' + ime(i) + '<td>' + e + '/' + a.length + ' = '
			+ formatNumber(e * 100 / a.length, 1) + '% ' + getEdibleString(i, 0)
			, '<table>') + '</table>'
		+ '<a href="?food" target="_blank">список растений, грибов и ягод</a>'
		+ '</table><span id="p1"></span>'
}

function ime(i) {
	return imagePlant(edibleImage[i])
}

function updateTable() {
	gtable = new Table(['русское название', 'латинское название'
		, referencePlant('https://pfaf.org', 'pfaf') + ' ' + referencePlant('https://www.plantarium.ru', 'plantarium')
		, '', ''
		, '<button id="bc" disabled class="comboboxbutton" onclick="cl(1)">' + imagePlant('scale') + '</button>']
		, gplantsTable, { o: "sc0n", arrowsColumns: [0, 1, 3, 4] });
	el('p').innerHTML = gd + '<table><tr><td>' + gtable.html() + gs
	cl(0)
}

function cc(n) {
	a = getCheckedIds()
	k = a.length
	if (el('c' + n).checked && k > maxCompare) {
		el('c' + a[k - 1 - (a[k - 1] == n)]).checked = false
		k--
	}
	el('bc').disabled = k < 2 || k > maxCompare
	//console.log(29)
}

function cl(n) {
	e = el('p1')
	if (n == 0) {
		e.innerHTML = gp.join('')
	}
	else if (n == 1) {
		a = getCheckedIds()
		e.innerHTML = '<table><tr>' + a.map(e => '<td style="vertical-align:top;">' + gp[e]).join() + '</table>'
		e.scrollIntoView();
	}
	//gtable.filter( e=> !el('onlyphoto').checked || e[imageColumn].v.length>0 )
}

function getCheckedIds() {
	let a = [], e, id
	for (e of el('__table0').tBodies[0].rows) {
		id = e.cells[e.cells.length - 1].children[0].id
		if (el(id).checked) {
			a.push(Number(id.slice(1)))
		}
	}
	return a
}

function lc(c) {
	for (let e of el('__table0').tBodies[0].rows) {
		if (c == e.cells[1].children[0].text.slice(0, 1)) {
			e.scrollIntoView();
			return;
		}
	}

}

function loadFood() {
	const wl = edibleFullString.length;
	const mushroomEnd = 1;
	const PLANTS = 'растения';
	const BERRIES = 'ягоды';
	const MUSHROOMS = 'грибы';
	const N = mushroomEnd && gShowBerryTable ? [PLANTS, BERRIES, MUSHROOMS] : [PLANTS, MUSHROOMS, BERRIES]
	const NID = mushroomEnd && gShowBerryTable ? ['plants', 'berries', 'mushrooms'] : ['plants', 'mushrooms', 'berries']
	const PI = N.indexOf(PLANTS);
	const BI = N.indexOf(BERRIES);
	const MI = N.indexOf(MUSHROOMS);
	if (mushroomEnd) {
		food = Array.from({ length: wl * (gShowBerryTable + 1) }, () => []).concat(gMushroom);
	}
	else {
		food = Array.from({ length: wl }, () => []).concat(gMushroom);
		if (gShowBerryTable) {
			food = food.concat(Array.from({ length: wl }, () => []));
		}
	}
	gplants.forEach(e => {
		n = e.name
		//use name in brackets if exists
		if (m = n.match(/\((.+)\)/)) {
			n = m[1]
		}
		food[(gShowBerryTable && e.berry ? (2 - mushroomEnd) * wl : 0) + e.edible].push(n.toLowerCase())
	})

	s = '';
	so = ''
	l = new Array(N.length).fill(0)
	p = []
	//console.log(f.length)
	food.forEach((e, i) => {
		e = e.filter(v => v != '');//remove empty strings
		c = Math.floor(i / wl)
		l[c] += e.length
	});

	food.forEach((e, i) => {
		e = e.filter(v => v != '');//remove empty strings
		e.sort((a, b) => a.localeCompare(b));//same result with collator
		/*https://en.wikipedia.org/wiki/Alphabetical_order. Capital letters (upper case) are generally considered to be identical to their corresponding lower case letters for the purposes of alphabetical ordering
		*/
		//e.sort(cs);//my sort function
		j = i - MI * wl
		if (j >= 0 && j < wl && gAdmin) {
			so += '<br>' + (j ? ',' : '<br>') + wrapSpan('/*' + getEdibleString(j, 2) + '*/') + ' ['
			e.forEach((e1, i) => {
				if (i != 0) {
					so += ","
				}
				so += "'" + e1 + "'"
				if (i % 5 == 4) so += '<br>'
			});
			if (e.length != 0) {
				so += ','
			}
			so += "'',".repeat(5) + "'']"
		}

		c = Math.floor(i / wl)
		cl = 'c' + i % wl
		k = formatNumber(e.length * 100 / l[c], 1) + '%'
		if (i % wl == 0) {
			//id="" reference need for Выживаю на минималках (введение) page> but still not working maybe because of dynamically loading
			s += '<h4 id="' + NID[c] + '">' + N[c] + (i ? '' : ' <label><input type="checkbox" onclick="berryClick()" id="berrycheck"' + (gShowBerryTable ? ' checked' : '') + '>ягоды отдельной таблицей</label>') + (i ? '' : ' <a href="?plants" target="_blank" style="margin-left:30px">растения Подмосковья</a>') + '</h4><table>'
		}
		s += '<tr class="' + cl + '"><th colspan=5>' + ime(i % wl) + ' ' + getEdibleString(i % wl, [PI, BI, MI].indexOf(c)) + ' ' + e.length + ' / ' + l[c] + ' = ' + k;//+' '+l[c]
		p.push(e.length, k)
		for (j = 0; j < e.length; j++) {
			if (j % 5 == 0) {
				s += '<tr class="' + cl + '">'
			}
			s += '<td>' + e[j]
		}
		j = j % 5;
		if (j != 0) {
			for (; j < 5; j++) {
				s += '<td>'//for outer table border
			}
		}
		if ((i + 1) % wl == 0) {
			s += '</table>'
		}
	});
	el('p').innerHTML = s;

	if (gAdmin) {
		a = []
		food.forEach(e =>
			e.forEach(e => {
				if (e.length && !e.match(/\s/)) {
					a.push(e)
				}
			})
		)
		s = a.length ? 'предупреждение название состоит из одного слова:[' + a.join(', ') + ']' : ''
		el('p1').innerHTML = s + so;
	}
}

function callback(s) {
	if (typeof s != "string") {
		console.log('error ' + s.message)
	}
	else {
		images = JSON.parse(s)
		gplantsTable.forEach(e => {
			if ((i = images.findIndex(e1 => e1.includes(e[0][1]))) != -1) {
				e[imageColumn] = '<a target="_blank" href="img/plants/' + images[i] + '">'
					+ imagePlant('img') + '</a>'
			}
		})
	}
	updateTable()
}

function wrapSpan(s, color = "green") {
	return '<span style="color:' + color + '">' + s + '</span>'
}

function berryClick() {
	gShowBerryTable = el('berrycheck').checked;
	loadFood()
}

function getEdibleString(i, j) {
	let e = edibleFullString[i];
	if (Array.isArray(e)) {
		e = e[j]
	}
	return e
}