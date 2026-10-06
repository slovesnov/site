data = [
	{ name: "index.html", size: 11254, date: '2023-11-01' },
	{ name: "index.js", size: 2472, date: '2023-12-12' },
	{ name: "index.css", size: 709, date: '2023-11-21' },
	{ name: "common.html", size: 8233, date: '2023-06-04' },
	{ name: "common.css", size: 253, date: '2023-07-04' },
	{ name: "common.js", size: 382, date: '2023-07-04' }
]
const columns = Object.keys(data[0]);
let state = new Array(columns.length).fill(true)
let re = new RegExp('')

function dialog() {
	showModal('please select columns', columns.reduce((a, e, i) => a
		+ `<tr><td><label><input type="checkbox" id="${e}" onclick="updateButtonState()"`
		+ (state[i] ? ' checked' : '') + `>${e}</label>`, '<table>')
		+ '</table>name filter (regex) <input type="text" id="r" '
		+ `onkeyup="updateButtonState()" value="${re.source.replace(/"/g, '&quot;')}">`
		, n => {
			if (n == 0) {
				let e = document.getElementById('r')
				re = new RegExp(e.value)
				state = columns.map(e => document.getElementById(e).checked)
				document.getElementById('p').innerHTML = data.filter(e => re.test(e.name)).reduce(
					(a, e) => a + '<tr>' + getRow(Object.values(e), false),
					'<table>' + getRow(columns, true)) + '</table>'
			}
			if (n == 1 || n == 2) {
				columns.forEach((e, i) => document.getElementById(e).checked = n == 2 || !i)
				updateButtonState()
			}
			else {
				closeModal();
			}
		}
		, ['ok', 'only name', 'all columns', 'cancel']
		, false
	)
}

function updateButtonState() {
	let e = document.getElementById('r'), b = true
	try {
		new RegExp(e.value)
	}
	catch {
		b = false;
	}
	e.style.color = b ? 'black' : 'red'
	getModalButton(0).disabled = !b || columns.every(e => !document.getElementById(e).checked)
}

function getRow(e, th) {
	const s = th ? '<th>' : '<td>'
	return '<tr>' + s + e.filter((e, i) => state[i]).join(s)
}

function show(n){
	if(n==1){
		showModal('title', '<table><tr><td>1<td>2<tr><td>a<td>b</table>')
	}
	else{
		showModal('title', 'input name <input type="text">', () => { }, ['ok','cancel'])
	}
}