//global object
__DialogObject = {
	id: '__modal',
	f: e => {
		e = e.target
		if (e.nodeName != 'BUTTON' && !e.id.startsWith(__DialogObject.id)) {//fixed allow image inside button 9jan2026 http://localhost/php/siteupdate.php?calorie;e.id.startsWith(__DialogObject.id) = close cross in dialog
			e = e.parentElement
		}
		let i = e.id.slice(__DialogObject.id.length)
		i = i.length ? +i : -2
		__DialogObject.callback(i);
		if (i < 2 && __DialogObject.addclose) {
			closeModal()
		}
	}
}

//names[i]='' means break line
//allow showModal(header, body, params)
function showModal(header, body, callback = () => { }, names = [], addclose = true, paddingTop = '100px') {
	let i, j, id = __DialogObject.id
	if (typeof callback == 'object') {
		i = callback
		callback = typeof i.callback == 'undefined' ? () => { } : i.callback;
		names = i.names ?? []
		addclose = i.addclose ?? true
		paddingTop = i.paddingTop ?? '100px'
	}
	else if (typeof callback != 'function') {
		callback = () => { }
		//throw new Error('callback argument should be a function')
	}
	if (!Array.isArray(names)) {
		throw new Error('names argument should be an array')
	}
	if (names.some(e => typeof e != 'string')) {
		throw new Error('names argument should be an array of strings')
	}
	__DialogObject.callback = callback;
	__DialogObject.addclose = addclose;

	if (!document.getElementById(id)) {//add only one time
		i = document.createElement('div');
		i.setAttribute('id', id);
		document.body.appendChild(i);
		window.addEventListener('click', e => { if (e.target.id == id) __DialogObject.f(e) });
	}
	const q = '<table style="width:100%"><tr>'
	j = -1;
	document.getElementById(id).innerHTML = `<div><div>${header}<span id="${id + -1}">&times;</span></div><div>` + body + names.reduce((a, e) => {
		b = e == ''
		if (!b) {
			j++
		}
		return a
			+ (b ? '</table>' + q : `<td style="text-align: center;"><button id="${id + j}" class="dialogbutton">` + e + '</button>')
	}, q) + '</table></div>'
	document.getElementById(id).style.display = 'block';
	document.getElementById(id).style.paddingTop = paddingTop;
	for (i = -1; i < names.length; i++) {
		j = document.getElementById(id + i)
		if (j) {
			j.addEventListener('click', __DialogObject.f)
		}
	}
}

function closeModal() {
	document.getElementById(__DialogObject.id).style.display = 'none'
}

function isModalVisible() {
	let e = document.getElementById(__DialogObject.id)
	return e !== null && e.style.display != 'none'
}

function getModalButton(i) {
	return document.getElementById(__DialogObject.id + i)
}
