const opt = 4
const dragdrop = 12

function load() {
	//drop not ondrop, dragover not ondragover, need document.addEventListener('dragover', e=>allowDrop(e)) for firefox
	document.addEventListener('drop', drop)
	document.addEventListener('dragover', allowDrop)

	i = lnLeastSquares.slice(1, 4).map(e => '<option>' + e + '</option>').join('')
	el('p').innerHTML = `<table><tr><td style="vertical-align:top"><textarea id="t" onkeyup="c()" rows="35" cols="18"></textarea><td style="vertical-align:top">${lnLeastSquares[0]} <select id="c" onchange="c()">${i}</select> ${lnLeastSquares[dragdrop]}<div id="o" style="margin-top:5px"></div>`
	c()
}

function c() {
	n = el('c').selectedIndex
	el('t').placeholder = [`x1 y1\nx2 y2\n...\nxn yn`, `m1 c1\nm2 c2\n...\nmn cn\nm_{n+1} ${lnLeastSquares[opt]} c_{n+1}`, `m1 t1\nm2 t2\n...\nmn tn`][n]
	o = getLeastSquaresData('t', n)
	el('o').innerHTML = getLeastDataTableString(o, n)
}

function allowDrop(e) {
	e.preventDefault();
}

function drop(e) {
	e.preventDefault();
	let f = e.dataTransfer.files
	if (f.length == 0) {
		return
	}
	let reader = new FileReader();
	reader.onload = () => {
		el('t').value = reader.result
		c()
	}
	reader.onerror = () => console.log(reader.error)
	reader.readAsText(f.item(0));
}