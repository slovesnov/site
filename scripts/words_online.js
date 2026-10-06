gComboLocked = false;
gID = ['check', 'checkText']
gSet = []
onlyPhp = true

function submitFunction() {
	let i;
	let e = el("result");
	fetchpost(onlyPhp || comboProgramLanguage.getIndex() == 1 ? "words/words.php" : "cgi-bin/words", {
		searchType: el("searchType").selectedIndex
		, entry: el("entry").value
		, dictionary: getDictionary()
		, sortType: combosortType.getIndex()
		, sortOrder: combosortOrder.getIndex()
		, language: getLanguage()
		, combo0: comboPassValue(0)
		, combo1: comboPassValue(1)
		, combo2: comboPassValue(2)
		, check: (el("check").checked ? 1 : 0)
	}, callback, new Date());

	if (getSearchType() == 'DICTIONARY_STATISTICS') {
		/*Frequency of characters on keyboard too long string so make smaller font
		 It's also language dependent because russian alphabet size bigger than english*/
		i = getLanguage() == 0 ? 10 : 9;
	}
	else {
		i = 12
	}
	e.style.fontSize = i + "pt";
	e.innerHTML = '<img src="img/words/run.gif">';

	el('button').disabled = true;
	//Note 'enty' can set 'button' enable so disable it as well
	el('entry').disabled = true;

}

function load() {
	let i, j, k, o;
	let lng = getLanguage();

	j = ['sortType', 1]
	k = SORT_OPTION[lng]
	for (i = 0; i < k.length; i++) {
		j.push(k[i]);
	}
	combosortType = new Combobox(j);
	combosortType.getButton().style.width = '310px';//avoid new line

	j = ['sortOrder', 1];
	SORT_ORDER[0].forEach((e, i) => {
		j.push('<img src="img/words/' + e + '.png"> ' + SORT_ORDER[lng][i])
	});
	combosortOrder = new Combobox(j);
	combosortOrder.getButton().style.width = '175px';//avoid new line in combo in russian

	j = ['languageSelector', lng];
	for (i = 0; i < 2; i++) {
		k = i == 0 ? 'en' : 'ru'
		j.push('<img src="img/' + k + '.gif"> ' + k)
	}
	j.push(dictionaryChanged)
	comboDictionary = new Combobox(j);

	if (!onlyPhp)
		comboProgramLanguage = new Combobox('programLanguage', 0, 'c++', 'php');

	setText('dictionaryText', L_ENUM.dictionary);

	k = el('searchType');
	j = SEARCH_OPTION[lng];
	for (i = 0; i < j.length; i++) {
		if (j[i].charAt(0) == '#') {
			o = document.createElement('optgroup');
			o.label = j[i].substring(1);
		}
		else {
			o = document.createElement('option');
			o.innerHTML = j[i];
		}
		k.appendChild(o);
	}
	k.selectedIndex = 5; //set regex default search option because anagrams search is out of memory after dictionary was increased

	for (i = 0; i < 3; i++) {
		gID.push('combo' + i);
		gID.push('comboText' + i);
		refillCombo(i);
	}

	changeSearchType();

}

function refillCombo(i) {
	/*ie doesn't resize combo if eg select 'find pattern' and next
		find regular expression then will be ugly widht for 'select' tag
		the solution is full refill <td>
	*/
	let s = '<select id="combo' + i + '"';
	if (i != 2) {
		s += ' onchange="comboChanged(' + i + ')"';
	}
	s += '></select>'
	el('c' + i).innerHTML = s
}

function dictionaryChanged() {
	entryChanged();//highlight whether entry string is valid or not
}

//i=2 never happens not need to proceed
function comboChanged(i) {
	if (gComboLocked || ADJUST_COMBO.indexOf(getSearchType()) == -1) {
		return;
	}
	if (comboIndex(0) > comboIndex(1)) {
		gComboLocked = true;
		//comboIndex(i==0 ? 1 : 0)=comboIndex(i) doesn't work
		el("combo" + (i == 0 ? 1 : 0)).selectedIndex = comboIndex(i)
		gComboLocked = false;
	}
}

function changeSearchType() {
	let searchType = getSearchType();
	let lng = getLanguage();
	let i, j;

	i = ENTRY_ON.indexOf(searchType);
	j = i != -1;
	el('entry').style.display = j ? 'inline' : 'none';
	if (j) {
		el('entry').value = ENTRY_STRING[getDictionary()][i]
	}
	entryChanged();

	for (i = 0; i < gID.length; i++) {
		gSet[gID[i]] = 0;
	}

	if (searchType == 'ANAGRAM' || searchType == 'DOUBLE_WORD_SEQUENCE') {
		for (i = 0; i < 2; i++) {
			comboFill(i, 2
				, searchType == 'ANAGRAM' ? MAX_ANAGRAM_LENGTH : MAX_DOUBLE_WORD_SEQUENCE_LENGTH
				, searchType == 'ANAGRAM' ? 8 : 4);
		}
		setText(0, L_ENUM.LENGTH, L_ENUM.from);
		setText(1, L_ENUM.to);
		setText(2, L_ENUM.characters);
	}
	else if (searchType == 'PANGRAM') {
		comboFill(0, 10, MAX_PANGRAM_LENGTH, 15);
		setText(0, L_ENUM.minimum, L_ENUM.different_characters);
	}
	else if (searchType == 'TEMPLATE') {
		comboFill(0, 0, TEMPLATE_OPTION[lng]);
	}
	else if (searchType == 'REGULAR_EXPRESSIONS') {
		comboFill(0, 1, 10, 1);
		comboFill(1, 1, 10, 1);
		setText(0, L_ENUM.number_of_matches, L_ENUM.from);
		setText(1, L_ENUM.to);
	}
	else if (searchType == 'MODIFICATION') {
		gSet['check'] = 1;
		setText('checkText', L_ENUM.every_modification_changes_word);
		el("check").checked = true;//like in gtk
	}
	else if (searchType == 'CHARACTER_SEQUENCE') {
		comboFill(0, 0, PLACE_OPTION[lng]);
	}
	else if (searchType == 'WORD_SEQUENCE') {
		comboFill(0, 8, MAX_WORD_SEQUENCE_LENGTH, 8);
		comboFill(1, 8, MAX_WORD_SEQUENCE_LENGTH, 8);
		setText(0, L_ENUM.sequence, L_ENUM.from);
		setText(1, L_ENUM.to);
		setText(2, L_ENUM.characters);
	}
	else if (searchType == 'CONSONANT_VOWEL_SEQUENCE') {
		comboFill(0, 0, PLACE_OPTION[lng]);
		comboFill(1, 3, 10, 3);
		comboFill(2, 0, VOWELS_CONSONANTS_OPTION[lng]);
	}
	else if (searchType == 'DENSITY') {
		comboFill(0, 0, 25, 25);
		comboFill(1, 0, VOWELS_CONSONANTS_OPTION[lng]);
		setText(0, L_ENUM.maximum);
		setText(1, '%');
		setText(2, L_ENUM.characters);
	}

	for (i = 0; i < gID.length; i++) {
		j = gID[i];
		el(j).style.display = gSet[j] ? 'inline' : 'none';
	}

}

function entryChanged() {
	let e = el('entry');
	let a;
	let valid = true;
	let v = e.value;
	let searchType = getSearchType();
	let b = el('button');
	if (e.style.display == 'none') {
		b.disabled = false;
		return;
	}

	if (e.value.length == 0) {
		//e.style.color = "red";changes nothing
		b.disabled = true;
		return;
	}

	if (searchType == 'REGULAR_EXPRESSIONS') {
		try {
			new RegExp(v);
		}
		catch (ex) {
			valid = false;
		}
	}
	else {
		a = ALPHABET[getDictionary()]
		if (searchType == 'CROSSWORD') {
			a += '*';
		}
		else if (searchType == 'MODIFICATION') {
			//not full check but it's better than nothing
			a += '>+- ,l0123456789';
		}
		else if (searchType == 'CHAIN') {
			a += ' ';
		}
		for (i = 0; i < v.length; i++) {
			if (a.indexOf(v[i].toLowerCase()) == -1) {
				break;
			}
		}
		valid = i == v.length

		if (valid && searchType == 'CHAIN') {
			let sp = v.split(" ");
			let w = [];
			for (i = 0; i < sp.length; i++) {
				if (sp[i].length > 0) {
					w.push(sp[i])
				}
			}
			if (w.length != 2 || w[0] == w[1] || w[0].length != w[1].length) {
				valid = false;
			}
		}
	}
	e.style.color = valid ? "black" : "red";
	b.disabled = !valid
}

function comboFill(n, min, max, def) {
	let i, o, a;
	let id = 'combo' + n;
	refillCombo(n);
	let sel = el(id);
	//sel.length=0; combo created so don't need clear it
	let v = arguments.length == 3;
	a = max
	for (i = (v ? 0 : min); i < (v ? a.length : max + 1); i++) {
		o = document.createElement('option');
		o.innerHTML = v ? a[i] : i;
		sel.appendChild(o);
	}
	if (v) {
		sel.selectedIndex = min
	}
	else {
		//sel.value=def doesn't work ie
		sel.selectedIndex = def - min
	}
	gSet[id] = 1
}

function setText(i, s, s1) {
	let id = typeof i == 'string' ? i : 'comboText' + i
	let o = s == '%' ? s : getLS(s)
	if (arguments.length > 2) {
		o += ' ' + getLS(s1)
	}
	el(id).innerHTML = o
	gSet[id] = 1
}

function getLS(v) {
	return LANGUAGE_STRING[getLanguage()][v];
}

function getDictionary() {
	return comboDictionary.getIndex();
}

function getLanguage() {
	return gLanguage == 'russian' ? 1 : 0;
}

function getSearchType() {
	return SEARCH_TYPE[el("searchType").selectedIndex];
}

function comboIndex(i) {
	return el("combo" + i).selectedIndex
}

function comboPassValue(i) {
	let o = el("combo" + i);
	//no options in <select> it's ok. For example combo2 isn't used
	if (o.options.length == 0) {
		return 0;
	}
	let j = o.selectedIndex;
	//try to recognize all string not use parseInt()
	let v = Number(o.options[j].text);
	return isNaN(v) ? j : v;
}

/*aslov taken from my script calculator.js
changes spaces to underscore
ie error when try to proceed 'length' item of array, so change name
*/
function Enum(constantsList) {
	let s;
	for (let i in constantsList) {
		s = constantsList[i] + ''
		this[s == 'length' ? 'LENGTH' : s.replace(/ /g, '_')] = i;
	}
}

function callback(s, start) {
	let i, v
	if (typeof s == 'string') {
		v = ' / ' + ((new Date() - start) / 1000).toFixed(2);
		s = s.replace(/\r/g, '');//for windows
		i = s.indexOf('\n')
		if (i == -1) {
			s += v;
		}
		else {
			s = s.substr(0, i) + v + s.substr(i)
		}
		s = s.replace(/\n/g, '<br />');
	}
	else {
		s = '<p style="white-space:normal;">' + ERROR_MESSAGE[getLanguage()] + ' ' + s + '.';
	}
	el('result').innerHTML = s
	el('button').disabled = false;
	el('entry').disabled = false;
}


LANGUAGE_STRING = [
	[
		'dictionary', 'minimum', 'maximum', 'sequence', 'length'
		, 'from', 'to', 'number of matches', 'characters', 'different characters'
		, 'every modification changes word'
	], [
		'словарь', 'минимум', 'максимум', 'последовательность', 'длина'
		, 'от', 'до', 'число совпадений', 'букв', 'различных букв'
		, 'каждая операция меняет слово'//changed to avoid new line
	]
]

L_ENUM = new Enum(LANGUAGE_STRING[0])

//ERROR_MESSAGE too long so not add it to LANGUAGE_STRING
ERROR_MESSAGE = [
	'Server error. It can happen if found too many words. If error appears using php search try to use c++ search. Also you can change query to lower number of finding words. Error code'
	,
	'Ошибка на сервере. Это может случаться, когда находится слишком много слов. Если ошибка возникла при php поиске, попробуйте использовать c++. Также можно изменить запрос чтобы находилось меньше слов. Код ошибки'
]

TEMPLATE_OPTION = [
	[
		'words contain all of the pattern letters',
		'words contain part of the pattern letters',
		'words consist of only pattern letters'
	], [
		'слова содержат все буквы из шаблона',
		'слова содержат часть букв из шаблона',
		'слова состоят только из букв шаблона'
	]
]

PLACE_OPTION = [
	[
		'search in any place of the word',
		'search in beginning of the word',
		'search in end of the word'
	], [
		'поиск в любом месте слова',
		'поиск в начале слова',
		'поиск в конце слова'
	]
]

VOWELS_CONSONANTS_OPTION = [
	['vowels', 'consonants'],
	['гласных', 'согласных']
]

SEARCH_OPTION = [
	[
		'find anagrams',
		'find pangrams',
		'find pattern',
		'find palindromes',
		'find words for crossword',
		'find regular expressions',
		'find modifications of words',
		'find chains of words',
		'find characters sequence',
		'find sequence words',
		'find double sequence words',
		'find full sequence words',
		'find keyboard words (one row)',
		'find keyboard words (row + diagonals)',
		'find consonants or vowels sequences',
		'find words with low density of cons./vow.',//make abbreviation to avoid line breaks
		'#search words from two dictionaries',
		'matched words (simple)',
		'matched words (transliteration)',
		'keyboard words',
		'#additions',
		'dictionary statistics',
		'frequency of word length (descend)',
		'check dictionary',
		'two nearby characters distribution'
	], [
		'поиск анаграмм',
		'поиск панграмм',
		'поиск по шаблону',
		'поиск палиндромов',
		'поиск слов для кроссворда',
		'поиск регулярных выражений',
		'поиск модификаций слов',
		'поиск цепочек слов',
		'поиск последовательностей букв',
		'поиск слов последовательностей',
		'поиск двойных слов последовательностей',
		'поиск полных слов последовательностей',
		'поиск клавиатурных слов (один ряд)',
		'поиск клавиатурных слов (ряд + диагонали)',
		'поиск последовательностей гл./согл. букв',
		'поиск слов с низким процентом гл./согл. букв',//make abbreviation to avoid line breaks
		'#поиск слов в двух словарях',
		'совпадающие слова (обычные)',
		'совпадающие слова (транслит)',
		'клавиатурные слова',
		'#дополнительно',
		'статистика словаря',
		'частота длины слов по убыванию',
		'проверка словаря',
		'распределение последовательности двух букв'
	]
]

SORT_OPTION = [
	[
		'sort by alphabet',
		'sort by length',
		'sort by number of words',
		'sort by percent of vowels',
		'sort by percent of consonants',
		'sort by number of different characters'
	], [
		'сортировка по алфавиту',
		'сортировка по длине',
		'сортировка по числу слов',
		'сортировка по проценту гласных',
		'сортировка по проценту согласных',
		'сортировка по числу различных букв'
	]
]

SORT_ORDER = [
	['ascending', 'descending'],
	['по возрастанию', 'по убыванию']
]

SEARCH_TYPE = [
	'ANAGRAM',
	'PANGRAM',
	'TEMPLATE',
	'PALINDROME',
	'CROSSWORD',
	'REGULAR_EXPRESSIONS',
	'MODIFICATION',
	'CHAIN',
	'CHARACTER_SEQUENCE',
	'WORD_SEQUENCE',
	'DOUBLE_WORD_SEQUENCE',
	'WORD_SEQUENCE_FULL',
	'KEYBOARD_WORD_SIMPLE',
	'KEYBOARD_WORD_COMPLEX',
	'CONSONANT_VOWEL_SEQUENCE',
	'DENSITY',

	'TWO_DICTIONARIES_SIMPLE',
	'TWO_DICTIONARIES_TRANSLIT',
	'TWO_DICTIONARIES_KEYBOARD_WORD',

	'DICTIONARY_STATISTICS',
	'WORD_FREQUENCY',
	'CHECK_DICTIONARY',
	'TWO_CHARACTERS_DISTRIBUTION'
]

ENTRY_ON = [
	'TEMPLATE',
	'CROSSWORD',
	'REGULAR_EXPRESSIONS',
	'MODIFICATION',
	'CHAIN',
	'CHARACTER_SEQUENCE'
]
//match with ENTRY_ON
ENTRY_STRING = [
	['dfe', 'm***m', 'we$', '-2,L-4 a>e +L,d i>0', 'woman chick', 'mata']
	, ['або', '**б*з', 'зо$', '-2,L-3 о>а +L,л к>0', 'муха слон', 'уу']
]

ADJUST_COMBO = [
	'ANAGRAM',
	'REGULAR_EXPRESSIONS',
	'WORD_SEQUENCE',
	'DOUBLE_WORD_SEQUENCE'
]

//language dependent max values
MAX_ANAGRAM_LENGTH = 31;
MAX_PANGRAM_LENGTH = 20;
MAX_WORD_SEQUENCE_LENGTH = 21;
MAX_DOUBLE_WORD_SEQUENCE_LENGTH = 14;

ALPHABET = ['abcdefghijklmnopqrstuvwxyz', 'абвгдежзийклмнопрстуфхцчшщъыьэюя-']