const w = ['save', 'delete', 'plus']
const h = 16;

function load() {
	gc = document.cookie.split(/;\s*/).sort((a, b) => a.localeCompare(b)).map(e => e.split('='))
	el('p').innerHTML = gc.reduce((a, e, i) => {
		return a + '<tr><td>' + e[0] + ta(i, 800, e[1].length < 100 ? h : 100, e[1])
			+ '<td>' + w.slice(0, 2).map((_, j) => bu(i, j)).join('')
	}, '<table class="table_border table_color"><tr>'
	+ ta(-2, 150, h, '', 'name')
	+ ta(-1, 800, h, '', 'value')
	+ '<td>' + bu(-1, 2))
		+ '</table>'
}

function bu(i, j) {
	return `<button onclick="bclick(${i},${j})"><img src="../img/jm/${w[j]}16.png"></button>`
}

function ta(i, w, h, v, ph) {
	return `<td><textarea id="ta${i}" style="width:${w}px;height:${h}px"${ph===undefined?'':` placeholder="${ph}"`}>${decodeURIComponent(v)}</textarea>`
}

function bclick(i, j) {
	n = i == -1 ? el('ta-2').value : gc[i][0]
	if (j == 1) {
		if (confirm('Do you really want to delete cookie?')) {
			deleteCookie(n)
		}
	}
	else {
		setCookie(n, el('ta' + i).value)
	}
	if (j) {
		load()
	}
}
