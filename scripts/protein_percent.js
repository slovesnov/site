const PR = [3, 2]
const WI = [55, 50, 85, 66, 50]
const CL = [4, 9, 4]
const SE = '_'
const MASS = 75
/*мои замеры 
багет маленький 115
чиабатта маленькая 103
чиабатта большая 298
хлеб черный круглый320
улитка греческая с мясом121
*/
s = String.raw`гречка 12.6 3.3 60.7
хлеб чёрный 6.8 1.2 41.7#
хлеб белый 9.7 4 65.1#
колбаса 26 26 1#
 сыр плавленный 9 20 11#
 шоколад 8.3 35.5 51.2#
 картофель 2 0.4 18.1
 яблоко 0.4 0.4 9.8
 мандарин 0.8 0.2 7.5
 арахис 26.8 50 12.3
 грибы	2.2	1.2	0.5
 ржаной край 6 1 50 /300
 краюшки 8 1 42 /240
 даниловский зерновой 9.5 6 46 /300
дарницкий селяночка 320 бжу7 1 41
дарницкий коломенский 350 бжу7 1 41
 дарницкий формовой 160 бжу 6.5 1 41
батон нарезной 7.5 2.9 51.4
 батон нарезной 400 бжу7.5 2.9 51.4
 молоко 3.2%	2.9	3.2	4.7		
 горох зелёный 5.0 0.2 13.8
горох 23 1.6	48.1
 орляк4.5 0.4	5.5
семечки тыквы сырые в скорлупе	29	46.7	13.1
семечки подсолнечника	20.7	52.9	3.4
бананы1.5 0.5	21
улитка с корицей 5.6 26.8 45.4 https://5ka.ru/product/ulitka-s-koritsey-80g--78031990/
багет пшеничный 8 2.5 53 https://5ka.ru/product/baget-pshenichnyy-200g--78036070/
багет мини 120 бжу7.5 2.9 51.4 https://5ka.ru/product/baget-mini-120g--3383605/
багет ржаной чесночный 180 бжу6.5 14 45.1 https://5ka.ru/product/baget-rzhanoy-chesnochnyy-180g--78030125/
чиабатта пшеничная 6 0.6 46 https://5ka.ru/product/chiabatta-pshenichnaya-100g--78030792/
багет фитнес(с семенами) 12 5.5 42 https://irecommend.ru/content/khleb-s-morkovkoi-kotorym-ubit-mozhno-budu-pokupat-poka-ne-nadoest-ili-zub-ne-slomayu#&gid=gallery_node10514016field_imgf1&pid=1 200г
улитка греческая с мясом 8 18.5 36 https://5ka.ru/product/ulitka-grecheskaya-s-myasom-130g--78036560/
 улитка греческая с мясом 9.3 7.7 31.6 https://5ka.ru/product/ulitka-grecheskaya-s-myasom-160g--3368414/
пиццетта пикантная 8 6.5 24 https://5ka.ru/product/pitstsetta-pikantnaya-85g--78033549/?utm_referrer=https%3a%2f%2fwww.google.com%2f
булочка с сырной начинкой 7.7 20.9 37.8 https://5ka.ru/product/bulochka-s-syrnoy-nachinkoy-104g--78030362/
пирог домашний с творожной начинкой 96 бжу7 10 48 https://5ka.ru/product/pirog-domashniy-s-tvorozhnoy-nachinkoy-96g--78033558/
хлеб авторский зерновой на закваске 300 бжу10.5 3.5 60 https://megamarket.ru/catalog/details/hleb-pyaterochka-kafe-avtorskiy-zernovoy-na-zakvaske-zamorozhennyy-300-g-100074496285_43320/#?exclusiveMerchantId=
халва 11 34 48 https://5ka.ru/product/khalva-krasnaya-tsena-podsolnechnaya-250g--3282750/?utm_referrer=https%3a%2f%2fwww.google.com%2f
козинаки 15	43	34
мороженое 4 11.5 25
птичка 4.3 19.7 59.2
суповой набор 12 20 0
батон полюшко 300 бжу8 7.5 40
колбаса 10 30 0
сухая смесь агуша 350 бжу11.4 26.5 53
молоко 3.2%	2.9	3.2	4.7
`
/*
s=`батон полюшко 300 бжу8 7.5 40
батон полюшко 1300 8 7.5 40
`
//*/
/*
s = String.raw`минтай 19 1 0
пангасиус 15 3 0 https://calorizator.ru/product/sea/pangasius
навага 16.1 1 0 https://calorizator.ru/product/sea/navaga-3
тиляпия 20.1 1.7 0 https://calorizator.ru/product/sea/tilapia-1
треска 17.7 .7 0 https://calorizator.ru/product/sea/cod-1
путассу 16.1 0.9 0 https://calorizator.ru/product/sea/poutassou
карась 17.7 1.8 0 https://calorizator.ru/product/sea/crucian-2
кефаль 21 .4 0 https://calorizator.ru/product/sea/grey-mullet
карп 16 5.3 0 https://calorizator.ru/product/sea/carp-1
палтус 18.9 3 0 https://calorizator.ru/product/sea/halibut-2
лемонема 15.9 .4 0 https://calorizator.ru/product/sea/lemonema
окунь 18.5 .9 0 https://calorizator.ru/product/sea/perch-5
тунец 23 1 0 https://calorizator.ru/product/sea/tuna-1
хек 16.6 2.2 0 https://calorizator.ru/product/sea/hake-1
пикша 17.2 .2 0 https://calorizator.ru/product/sea/haddock
камбала 16.5 1.8 0 https://calorizator.ru/product/sea/sole-1
сайда 19.4 .9 0 https://calorizator.ru/product/sea/pollack-7
судак 19.2 .7 0 https://calorizator.ru/product/sea/zander-1
щука 18.4 .8 0 https://calorizator.ru/product/sea/pike-1
`
*/
function load() {
	t = ['название', 'белки', 'жиры', 'углеводы', 'ккал', 'б/(ж+4y/9)', 'б%', 'ж%', 'у%']
	q = Array.from({ length: 3 }, () => String.raw`(\d+\.?\d*|\.\d+)`).join('\\s+')
	re = new RegExp(String.raw`^(.+?)\s*(\d+\s+)?(бжу)?\s*` + q + String.raw`(\S?)\s*(http[\S]+)?`, 'i')
	// re = new RegExp(String.raw`^\s*(.+?)\s*(\d+\s+)?(бжу)?\s*` + q + String.raw`(\S?)\s*(http[\S]+)?`, 'i')
	const sg = 4
	o = ''
	// d = s.split('\n').filter(e => /^\s*[а-яё]/i.test(e)).reduce((a, e) => {
	d = s.split('\n').filter(e => /^[а-яё]/i.test(e)).reduce((a, e) => {
		if (m = re.exec(e)) {
			//console.log(m)
			x = m.slice(sg, sg + 3)
			url = m[sg + 4]
			mass = 0
			if (url) {
				if (p = /-(\d+)g--/.exec(url)) {
					mass = p[1]
				}
			}
			else if (m[2]) {
				mass = m[2].trim()
			}
			o += m[1] + `${mass ? ' ' + mass : ''} бжу${x.map(e => e.startsWith('0.') ? e.slice(1) : e).join(' ')}\n`
			x = x.map(e => +e)
			p = pa(x).map(e => f(...e))
			if (m[sg + 3])
				x = x.map((e, i) => [inp(e, a.length + SE + (i + 1), r, i), e])
			b = m[1].length > 25
			if (url || b) {
				m[1] = `<span${(url ? ` onclick="window.open('${url}','_blank')"` : '')} style='${(url ? 'cursor:pointer;' : '') + (b ? 'font-size:12px;' : '')}'>${m[1]}</span>`
			}
			a.push([m[1], ...x, ...p])
		}
		else {
			console.log(e)
		}
		return a
	}, [])
	gt = new Table(t, d, "bcs")
	//console.log(o)

	n = 4
	ts = `<tr><th colspan=${n} style="text-align:center;">на килограмм в сутки<th rowspan=2>на ${MASS}кг<br>в сутки` +
		t.slice(-3).map(e => `<th rowspan=2>` + e).join('') + '<tr><th>'
		+ t.slice(1, n + 1).join('<th>')
	/*
	(2510 / 73.4 - (1.6 * 4 + 9)) / 4=4.699046321525886
	(1872 / 62 - (1 * 4 + 9)) / 4=4.298387096774194
	*/
	s = [[1, 1, 4], [1, 1, 4.3], [1.6, 1, 4.7]
		//https://youtu.be/kGp2rJ_akSw?t=382
		, [190 / 67, 120 / 67, 500 / 67]].reduce((a, e) => {
			c = ca(e)
			b = [...e, c, c * MASS]
			for (let i = 0; i < 3; i++)
				b.push(e[i] * CL[i] * 100 / c)
			return a + b.reduce((a, e, i) => a + '<td>' + formatNumber(e, i == n ? 0 : 1), '<tr>')
		}
			, '<table class="table_border table_color t"><thead>' + ts + '<tbody>') + '</table>'
	el('p').innerHTML = gt.html() + s
	//after set 5 column values
	gt.sortc(5, 1)

	a = [1.6, 1.2, 1, fi(30), .8, 1, fi(30)]
	gc = a.length
	el('t').innerHTML = a.reduce((a, e, i) => a + `<tr><td>${i == gc - 2 ? inp(e, i, w, 3) : formatNumber(e, PR[0])}<td>${(i == gc - 1 ? inp(fr(e), i, w, 4) : formatNumber(fr(e), PR[1])) /*+ '%'*/}`
		, '<table class="table_border table_color t" style="margin-top:0;margin-right:10px"><thead><tr><th>' + t.slice(-4, -2).join('<th>') + '<tbody>') + '</table>'
}

fr = k1 => 400 / (4 + 9 / k1)
fi = k2 => 9 / (400 / k2 - 4)
ca = e => e.reduce((a, e, i) => a + e * CL[i], 0)
inp = (v, i, f, n) => `<input type='text' value='${v}' id='${i}' oninput='${f.name}(this)' style='width:${WI[n]}px' onpaste='paste(event)'>`

function paste(e) {
	e.preventDefault()
	x = e.target
	x.value = e.clipboardData.getData("text")
	r(x)
}

function w(e) {
	b = +(e.id % 2 == 1)
	el('t').children[0].tBodies[0].rows[e.id].cells[b].innerHTML = formatNumber((b ? fr : fi)(e.value), PR[b]) //+ (b ? '%' : '')
}

function r(e) {
	tr = e.parentElement.parentElement
	x = [...el('p').children[0].tBodies[0].rows].findIndex(e => e == tr)
	a = e.value.trim().split(/\s+/)
	b = e.id.split(SE)
	sr = b[0] + SE
	z = (i, e) => gt.data[x][i] = { s: gt.get(x, i).s.replace(/value='.*?'/, `value='${e}'`), v: +e }

	if (a.length == 3) {
		a.forEach((e, i) => {
			el(sr + (i + 1)).value = e
			z(i + 1, e)
		})
	}
	else {
		z(b[1], e.value)
	}
	v = []
	for (i = 0; i < 3; i++) {
		n = evaluateString(el(sr + (i + 1)).value)
		v.push(n === false || n < 0 ? NaN : n)
	}
	pa(v).forEach((e, i) => gt.set(x, i + 4, f(...e)))
}

function pa(v) {
	let c = ca(v), a = [[c, 1], [v[0], v[1] + 4 * v[2] / 9]];
	for (let i = 0; i < 3; i++)
		a.push([v[i] * CL[i] * 100, c])
	return a
}

function f(a, b) {
	let r;
	if (isNaN(a) || isNaN(b))
		r = ['?', 0]
	else if (b == 0)
		r = a == 0 ? ['0/0', 0] : [((a < 0 ? '-' : '') + '&infin;'), a < 0 ? -Infinity : Infinity]
	else
		r = [formatNumber(a / b, 1), a / b]
	return r
}
