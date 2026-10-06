function load() {
	s = '<table><tr>'
	for (i = 1; i < 3; i++) {
		s += '<td>' + imageref('fireweed', i, null, 410)
	}
	el('p').innerHTML = s + '</table>'
}
