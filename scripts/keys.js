t = ['type', 'code', 'key', 'keyCode']
ev = ["keydown", "keyup"]
ch = [true, true]

ln = gLanguage == 'russian' ? ['нажмите любую клавишу для просмотра события', 'очистить'] : ['press any key to view event', 'clear']

function f(p) {
	if (ch[ev.indexOf(p.type)])
		el('t').tBodies[0].insertRow(0).innerHTML = t.reduce((a, e) => a + '<td>' + p[e] + (e == 'keyCode' ? ' 0x' + p[e].toString(16) : ''), '<tr>')
}

function cc(e, i) {
	ch[i] = e.checked
}

function load() {
	el('p').innerHTML = ln[0] + ` <button onclick="clear1()" class="comboboxbutton">${ln[1]}</button>`
		+ ev.reduce((a, e, i) => a + `<label><input type="checkbox" style="vertical-align: middle;" onclick="cc(this,${i})"${ch[i] ? ' checked' : ''}>${e}</label>`, '')
		+ `<table id="t" class='table_border table_color'><thead><tr>`
		+ '<th>' + t.join('<th>')
		+ `</tr></thead><tbody></tbody></table>`;
	ev.forEach(e => addEventListener(e, f))
}

function clear1() {
	el('t').tBodies[0].innerHTML = ''
}