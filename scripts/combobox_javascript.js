const type = ['flag', 'order', 'language', 'degree']
const d = [['en', 'ru'], ['ascending', 'descending'], ['c++', 'php', 'js', 'mysql'], [2, 3, 5, 10]]

function load() {
	comboLanguage = new Combobox('language', 0
		, '<img src="img/en.gif"> en'
		, '<img src="img/ru.gif"> ru');

	comboOrder = new Combobox('order', 1
		, '<img src="img/words/ascending.png"> ascending'
		, '<img src="img/words/descending.png"> descending'
		, orderSelectedChanged);

	combo = new Combobox({
		id: 'combo'
		, index: 0
		, data: type.map((e, i) => d[i].reduce((a, e, j) =>
			a + '<label><input type="radio" name="g' + i + '"' + (j ? '' : ' checked')
			+ ' onclick="combo.setIndex(' + i + ')">' + label(e, i) + '</label>'
			, e))
		, changeFunction: callback
		, buttonTextFunction: buttonText
	})

	const charType = [['letter', 'a', 'b', 'c']
		, ['digit', 1, 2, 3]
		, ['punctuation', 'colon', 'dot', 'ellipsys']
		, ['regex wild chars', 'asterisk', 'plus', 'question mark']
	]
	comboChar = new Combobox({
		id: 'combochar'
		, data: charType.map(e => e.map((e, i) =>
			i ? '<label><input type="radio" name="gc" onclick="comboChar.updateButton()">'
				+ e + '</label>' : '<b>' + e
		))
		, buttonTextFunction: () => {
			let e = document.querySelector('input[name=gc]:checked');
			return e ? 'selected ' + e.nextSibling.textContent : 'please select symbol';
		}
	})

}

function orderSelectedChanged() {
	document.getElementById('out').innerHTML =
		"language" + comboLanguage.getIndex()
		+ " order" + comboOrder.getIndex();
}

function label(e, i) {
	if (i < 2) {
		return '<img src="img/' + ['', 'words/'][i] + e + '.' + ['gif', 'png'][i] + '">' + ' ' + e
	}
	else {
		return i == 2 ? e : 'x<sup>' + e + '</sup>';
	}
}

function getColumn(i) {
	return [...document.querySelectorAll('input[name=g' + i + ']')].findIndex(e => e.checked)
}

function callback(i) {
	document.getElementById('o').innerHTML = 'row' + i + ' column' + getColumn(i)
}

function buttonText(i) {
	return type[i] + ' ' + label(d[i][getColumn(i)], i)
}
