//for test
//gAdmin=0
const vowel = 'аеёиоуыэюя'
const columns = 5
const filterIndex=0
//if empty defaultFilter.source="(?:)" and need value for <input type="text" id="filter" so use array
const filtera=['','111111']
const defaultFilter= new RegExp(filtera[filterIndex], 'iu')
const invalidFilter= null
const changeCheck=0
gfilter=null

function load() {
	el('p').innerHTML = `всего шаблонов <span id="s0"></span>, типов <span id="s1"></span>, неклассифицировано <span id="s2"></span>
	<input type="text" id="filter" onkeyup="filterChanged()" placeholder="фильтр регулярное выражение" value="${filtera[filterIndex]}">`
	+(changeCheck ? '<label style="vertical-align: middle;"><input type="checkbox" id="cfilter" checked="" onclick="filterChanged()" style="vertical-align: middle;">\\ заменяется на |</label>':'')
	+`<p id="p1">`;
	gd=[gdata,yo2e(gdata)]
	update()
}

function update(filter=defaultFilter) {
	//const start = Date.now();
	const bs='<span class="filter">'
	const es='</span>'
	s=filter.toString()
	if(gfilter==s){
		return
	}
	gfilter=s
	//add brackets to split with separator
	i=0
	if(filter!=invalidFilter){
		if(/[её]/iu.test(filter.source)){
			i=1
		}
		//for replace all
		f=filter.flags
		if(f.indexOf('g')==-1){
			f+='g'
		}
		rf=new RegExp('('+filter.source+')',f)
		// console.log(rf)
	}
	d=gd[i]
	a = filter==invalidFilter ? []:d.trim().split(/(\n\s*\n)/g);
	r = new RegExp('(^[^/\n].*[^' + vowel + ']\\\\.*$)', 'gimu')
	if ((m=r.exec(d))!=null) {
		line=d.substring(0,m.index).match(/\n/g).length+1
		el('p').innerHTML = 'ошибка \\ не после гласной. ['+m[0]+'] строка '+line
		return
	}

	line = 2;
	unclassified =0
	map = new Map()
	ar = []
	a.forEach(e => {
		if (/^\s*$/.test(e)) {
			j=e.match(/\n/g).length
			if(j!=2){
				console.log(line,j,'more then 1 empty line')
			}
			line += j
			return
		}
		if(!filter.test(e.replaceAll('\\',''))){
			line+=e.match(/\n/g).length
			return
		}
		b = e.trim().split("\n");
		l = []
		a = []
		t2 = ''
		text = '<table class="t">'
		b.forEach((e, i) => {
			if (e != e.trim()) {
				console.log('e!=e.trim()',e, line+i)
			}

			if (i == 0) {
				if (e[0]=='/') {
					title = e.substring(1)
					j=title.indexOf('#')
					if(j!=-1){
						title=title.substring(0,j)
					}
					return
				}
				else {
					title = e.replaceAll("\\", "")
				}
				
				title = title.trimLeft().replace(/[., -]+$/,'');
			}
			else{
				re=/[a-z]/i;
				if ( (m=re.exec(e)) && /[а-яё]/iu.test(e) ) {
					console.log('mix russian & english chars',e.substring(m.index), line+i)
				}
			}

			t = [...e.match(new RegExp('[' + vowel + ']\\\\?', 'igu'))].reduce((a, e) => a + '-|'[e.length - 1], '')

			if (l.length == 0) {
				if (/^-*$/.test(t)) {
					unclassified++
					title += ' <i>неклассифицировано</i>'
				}
				t2 += t
			}
			l.push(t.length);

			text += '<tr><td>' + t + '<td>'
			if(filter==defaultFilter){
				text += e.replaceAll(/(.)\\/g, "<b>$1</b>")
			}
			else{
				//-i-1 because need a position of preceeding symbol and \\ will be removed
				indexes = [...e.matchAll(/\\/g)].map((a,i) => a.index-i-1);
				j=0;			
				e.replaceAll(/\\/g, "").split(rf).forEach((e,i)=>{
					if(i%2){
						text+=bs
					}
					for(k=0;k<e.length;k++){
						if(indexes[0]==j){
							indexes.shift()
							text+='<b>'+e[k]+'</b>'
						}
						else{
							text+=e[k]
						}
						j++
					}
					if(i%2){
						text+=es
					}
				})
			}
		})
		text += '</table>'
		t1 = l.reduce((a, e) => e + a * 100)
		t1s = l.join('-')
		if(filter.source!="(?:)"){
			title=title.replaceAll(rf,e=>bs+e+es)
		}
		ar.push({ title, t1, t2, text, line, t1s })

		j = map.get(t1)
		if (j === undefined) {
			j = 0
		}
		map.set(t1, j + 1)
		line += b.length - 1
	})

	//-map.get for descending order
	ar.forEach(e => e.n = -map.get(e.t1))
	k = ['n', 't1', 't2', 'line']
	ar.sort((a, b) => {
		let j, x, y
		k.some(e => {
			x = a[e]
			y = b[e]
			j = typeof x == 'string' ? x.localeCompare(y) : x - y
			return j
		})
		return j
	})

	s='<table class="single b"><tr>' + '<td>тип<td>количество'.repeat(columns)
	s1 = ''
	c = 0;
	j = 0
	ar.forEach((e, i, a) => {
		if (!i || e.t1 != a[i - 1].t1) {
			if ((c++) % columns == 0) {
				s += '<tr>'
			}
			s += '<td>' + createUrl('#' + e.t1s, e.t1s) + '<td>' + (-e.n)
			if (i) {
				s1 += '</div>'
			}
			s1 += '<br><div id="' + e.t1s + '"' + ((j++) % 2 ? ' class="c"' : '') + '>'
		}
		else if (e.t2 != a[i - 1].t2) {
			s1 += '<hr>'
		}
		s1 += proceedUrls(e.title, 1) + ' <b>' + e.t1s + '</b>'
			+ (gAdmin ? ' строка ' + e.line : '')
			+ e.text
	})
	s1 += '</div>'
	s += '</table>'

	m = new Map()
	map.forEach(v => {
		j = m.get(v)
		if (j === undefined) {
			j = 0
		}
		m.set(v, j + 1)
	});
	s += '<table class="single"><td>типов<td>кол-во' +
		[...m.entries()].sort((a, b) => {
			let i = b[1] - a[1]
			if (!i) {
				i = a[0] - b[0]
			}
			return i
		}).reduce((a, e) => a + '<tr><td>' + e[0] + '<td>' + e[1], '')
	+ '</table>'

	// console.log(`time: ${Date.now() - start}`,filter.source);
	;[ar.length,map.size,unclassified].forEach((e,i)=>el('s'+i).innerHTML=e)
	// console.log(`time: ${Date.now() - start}`,filter.source);
	el('p1').innerHTML = s+s1
	// console.log(`time: ${Date.now() - start}`,filter.source);
}

//from jm.js
function proceedUrls(s, o = 0) {
	/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement
	replacer(match, p1, p2, …,  pN, offset, string, groups)
	reference ends with \s space or < symbols http://ya.ru<br>
	*/
	return s.toString().replace(/https?:\/\/(www\.)?([^<\s]+)/giu,
		(m, g0, g1) => createUrl(m, o ? m : g1, o ? ' target="_blank"' : '')
	)
}

//from jm.js
function createUrl(url, text, add = '') {
	return '<a href="' + url + '"' + add + '>' + (text === undefined ? url : text) + '</a>'
}

function filterChanged(){
	c=el('filter')
	try {
		r=yo2e(c.value)
		if(r.length){
			if(changeCheck && el('cfilter').checked){
				r=r.replaceAll('\\','|')
			}
			filter = new RegExp(r, 'iu')
		}
		else{
			filter=defaultFilter
		}
		c.style.color='black';
	}
	catch (e) {
		filter = invalidFilter;
		c.style.color='red';
	}
	update(filter)
}

function yo2e(s){
	return s.replaceAll('ё','е').replaceAll('Ё','Е')
}