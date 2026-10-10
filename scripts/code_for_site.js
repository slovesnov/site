const outID = 'p1'
function load() {
	document.addEventListener('drop', drop)
	document.addEventListener('dragover', allowDrop)

	l = gLanguage == 'russian' ? [
		'ошибка копирования в буфер обмена'//0
		, 'скопировано в буфер обмена'//1
		, 'Скопируйте текст и нажмите ctrl+v в этом окне. Сжатый текст, автоматически скопируется в буфер обмена, чтобы его вставить нужно нажать ctrl+v в текстовом редакторе. Можно перетащить файл тогда имя переменной считывается из файла.'//2
		, 'перезаписывать скрипт даже если переменная не найдена'//3
		, 'копировать в буфер обмена'//4
		, 'не задано имя переменной при указанном файле'//5
		, 'переменная'//6
		, 'имя скрипта name или name.js'//7
		, 'должна быть одна переменная, найдено'//8
	]
		: [
			'error copying to clipboard'//0
			, 'copied to clipboard'//1
			, 'Copy text and press ctrl+v in this window. The zipped text will be automatically copied to the clipboard, to paste it press ctrl+v in the text editor. You can drag and drop a file to read the variable name from it.'//2
			, 'overwrite script even if variable is not found'//3
			, 'copy to clipboard'//4
			, 'variable name is not specified for the provided file'//5
			, 'variable'//6
			, 'name or name.js to change'//7
			, 'there must be one variable but found'//8
		]

	gShowFile = isLocal()
	el('p', l[2] + `<br>`
		+ ` <input type='text' placeholder='${l[6]}' id='v' style='width:100px'>`
		+ (gShowFile ? ` <input type='text' placeholder='${l[7]}' id='script' style='width:190px'><br><label><input type='checkbox' checked id='always_overwrite'>${l[3]}</label>` : '')
		+ `<p id='${outID}'></p>`
	)
	el('v').value = 'source'
	// if (gShowFile)
	// 	el('script').value = 'composers_wiki_data'

	document.addEventListener('paste', pasteEvent)
}

function pasteEvent(e) {
	t = typeof e == 'string' ? e : e.clipboardData.getData('text')
	len = t.length
	t = gzdeflate(t)
	v = el('v').value
	t = (v ? v + '=' : '') + `\`${t}\``
	copyToClipBoard(t, len)
}

function copyToClipBoard(t, lenBefore) {
	//add copy to clipboard button because sometimes can be unwaited clicked copy to clipboard from another program
	navigator.clipboard.writeText(t).then(() => {
		le = [lenBefore, t.length]
		m = le.map(e => formatString(e, ','))
		s = l[1] + '<button title="копировать в буфер обмена" class="comboboxbutton" onclick="copyToClipBoard()"><img src="img/jm/copy16.png"></button><br>'
			+ t .slice(0, 30) + `… `
			+  `${m[0]} ➔ ${m[1]}, zip ${formatNumber((le[0] - le[1]) / le[0] * 100, 0)}%`
		out(s)
		if (gShowFile) {
			if (script = el('script').value) {
				if (el('v').value) {
					fetchpost('../php/code_for_site.php', { script, t, gLanguage, always_overwrite: el('always_overwrite').checked }, s => out(s, 1))
				}
				else {
					out(l[5], 1)
				}
			}
		}
	}, () => out(l[0]));
}

function out(text, add = false) {
	let o = el(outID)
	o.innerHTML = (add ? o.innerHTML + '<br>' : '') + text
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
		s = reader.result
		m = [...s.matchAll(/(\w+)\s*=\s*(['"`])(.+?)\2/gs)]
		if (m.length != 1) {
			out(l[8] + ' ' + m.length)
			return
		}
		m = m[0]
		el('v').value = m[1]
		const radios = document.querySelectorAll(`input[name="o"]`);
		radios[2].checked = true;
		pasteEvent(m[3])
	}
	reader.onerror = () => console.log(reader.error)
	reader.readAsText(f.item(0));
}