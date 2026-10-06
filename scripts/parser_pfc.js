function load() {
	//https://stackoverflow.com/questions/28983016/how-to-paste-rich-text-from-clipboard-to-html-textarea-element
	document.addEventListener('paste', e => {
		s = e.clipboardData.getData('Text')
		a = getPFCFromString(s)
		if (a === null) {
			el('p').innerHTML = 'ошибка неверная строка'
			return
		}
		gs = 'бжу ' + a.slice(0, 3).join(' ')
		if (a.length > 3) {
			gs += ' клетчатка ' + a[3]
		}
		//console.log(gs)
		navigator.clipboard.writeText(gs).then(() => op('текст скопирован в буфер'), () => op('ошибка копирования в буфер'));
	});
}

function op(s) {
	el('p').innerHTML = gs + ' ' + s
}