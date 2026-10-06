function load() {
	a = gzinflate(gd).split(/\n/)
	if (gPageName == 'p2_1') {
		al = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
		a = a.map(e => {
			return [...e].reduce((a, e) => a +
				([' ', '{', '}'].includes(e) ? e : al[e.charCodeAt(0) - 'A'.charCodeAt(0)])
				, '');
		})
	}
	el('t').innerHTML = a.reduce((a, e) => a + '<tr><td>' + e, '')
}
