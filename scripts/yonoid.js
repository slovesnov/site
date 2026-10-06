function load() {
	y = (i) => '<img src="../img/yonoid/' + i + '.png">'

	w = (gMobile ? window.screen.width : 800) + 'px'

	l = gLanguage == 'russian' ?
		['Уровень', '<i>Примечание.</i> Двигающиеся платформы перемещаются быстрее здания, поэтому их нельзя вывести на один рисунок вместе с ним или нужно искусственно увеличивать высоту здания. Поэтому платформы показаны на отдельном рисунке и затем подложен фон здания с большей высотой. Из-за этого получается несоответствие стационарных фиолетовых платформ и окон здания.'] :
		['Level', '<i>Note.</i> Moving platforms move faster than the building, so they cannot be displayed in the same image together with it or it is necessary to increase the height of the building artificially. That\'s why the platforms are shown in a separate image and then the background of the building with a higher height is underlaid. Because of this there is a mismatch between the stationary purple platforms and the windows of the building.']

	v = '';
	for (i = 1; i < 15; i++) {
		v += '<a href="#l' + i + '">' + l[0] + ' ' + i + '</a><br>'
	}
	for (i = 1; i < 15; i++) {
		v += '<h3 id="l' + i + '">' + l[0] + ' ' + i + '</h3><p style="width:' + w + '">';
		if (i == 13) {
			v += l[1] + '<table><tr><td>' + y(i) + '<td style="vertical-align:top">' + y(131) + '</table>'
		}
		else {
			v += y(i);
		}
	}

	document.getElementById('p').innerHTML = v;

	//too wide content so make menu & title screen width
	document.getElementsByClassName("topmenu")[0].style.width =
		document.getElementsByClassName("content")[0].childNodes[0].style.width = w;

}