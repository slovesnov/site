const outID = 'p1'
function load() {
	if (gPageName == 'p5') {
		setSourceCodeButtons()
	}
	document.addEventListener('drop', drop)
	document.addEventListener('dragover', allowDrop)

	l = gLanguage == 'russian' ? [
		'ошибка копирования в буфер обмена'//0
		, 'скопировано в буфер обмена'//1
		, 'Скопируйте текст из vs code и нажмите ctrl+v в этом окне. Перекодированный текст, автоматически скопируется в буфер обмена, чтобы его вставить  нужно нажать ctrl+v в текстовом редакторе. Можно перетащить файл тогда применяется опция zip text и имя переменной считывается из файла.'//2
		, 'в буфере обмена нет html текста'//3
		, 'копировать в буфер обмена'//4
		, 'не задано имя переменной при указанном файле'//5
		, 'переменная'//6
		, 'имя скрипта name или name.js'//7
		, 'должна быть одна переменная, найдено'//8
		, 'перезаписывать скрипт даже если переменная не найдена'//9
	]
		: [
			'error copying to clipboard'//0
			, 'copied to clipboard'//1
			, 'Copy text from vs code and press ctrl+v in this window. The converted text will be automatically copied to the clipboard, to paste it press ctrl+v in the text editor. If you drag and drop a file, the “zip text” option is applied, and the variable name is read from the file.'//2
			, 'there is no html text on the clipboard'//3
			, 'copy to clipboard'//4
			, 'variable name is not specified for the provided file'//5
			, 'variable'//6
			, 'name or name.js to change'//7
			, 'there must be one variable but found'//8
			, 'overwrite script even if variable is not found'//9
		]

	gShowFile = isLocal() && gPageName != 'p5'
	el('p', l[2] + `<br>`
		+ ['vscode', 'zip vscode', 'zip text'].map((e, i) => `<label><input type="radio" name="o"${i == 1 ? ' checked' : ''}> ${e}</label>`).join('')
		+ ` <input type='text' placeholder='${l[6]}' id='v' style='width:100px'>`
		+ (gShowFile ? ` <input type='text' placeholder='${l[7]}' id='script' style='width:190px'><br><label><input type='checkbox' checked id='always_overwrite'>${l[9]}</label>` : '')
		+ `<p id='${outID}'></p>`
	)
	el('v').value = 'source'
	// if (gShowFile)
	// 	el('script').value = 'composers_wiki_data'

	document.addEventListener('paste', pasteEvent)
}

function pasteEvent(e) {
	[text, zip] = params()
	t = typeof e == 'string' ? e : e.clipboardData.getData(text ? 'text' : 'text/html')
	if (text || (t = t.match(/<div.*<\/div>/))) {
		if (!text) {
			t = t[0]
		}
		len = t.length
		t = zip ? gzdeflate(t) : t.replace(/[\\`$]/g, `\\$&`)
		v = el('v').value
		t = (v ? v + '=' : '') + `\`${t}\``
		copyToClipBoard(t, len)
	}
	else {
		out(l[3])
	}

}

function copyToClipBoard(t, lenBefore) {
	//add copy to clipboard button because sometimes can be unwaited clicked copy to clipboard from another program
	navigator.clipboard.writeText(t).then(() => {
		le = [lenBefore, t.length]
		m = le.map(e => formatString(e, ','))
		s = l[1] + getSourceCodeButtons("copyToClipBoard()") + "<br>"
			+ (zip ? t : tag2text(t)).slice(0, 30) + `… `
			+ (zip ? `${m[0]} ➔ ${m[1]}, zip ${formatNumber((le[0] - le[1]) / le[0] * 100, 0)}%` : m[1])
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

function params() {
	let i = rindex()
	return [i == 2, i != 0]
}

function rindex() {
	const radioList = document.querySelectorAll('input[name="o"]');
	const checkedRadio = document.querySelector('input[name="o"]:checked');
	return [...radioList].indexOf(checkedRadio);
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