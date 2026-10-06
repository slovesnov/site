function load() {
	s = (gLanguage == 'russian' ? 'Нажмите на картинку для увеличения.' : 'Click on picture to enlarge') + '<table>'
	m = gPageName == 'fractals'
	for (i = 0; i < (m ? 12 : 246); i++) {
		if (i % 3 == 0) {
			s += '<tr>'
		}
		p = (m ? '' : 'g') + i + '.jpg'
		s += '<td><img src="img/fractals/s' + p + '" width=261 style="display:block;" onclick="iclick(\'' + p + '\')">'
	}
	s += '</table>'
	el('p').innerHTML = s
}

function iclick(p) {
	showModal('&nbsp;', '<img src="img/fractals/' + p + '" style="height:630px;">', {}, [], true, 0)
}
