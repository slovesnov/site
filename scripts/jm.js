gSumEq = gAddons['sum_eq']
gImage = ['edit']
gLanguageString = [[
	'In Globus for weight goods the cheque is written "weight*price per kg", in Pyaterochka and Magnet it is written "price per kg*mass". When writing the receipt, leave everything as it is, there is no need to change anything. The same applies to goods for which the price is given by the piece, the Globus is written as "1 * 29.79", Pyaterochka and Magnet "29.79". For clarification you can look at previous entries in the database.<br>If there are characters ' + wrapColorSpan('//') + ' in the string, it is a single-line comment, everything after them is ignored. You can use the comment ' + wrapColorSpan('/*...*/') + ', which can be either single-line or multi-line. If there is no closing ' + wrapColorSpan('*/') + ', then it is a comment to the end of the record. Comments are needed, for example, to record the current price of an unbought goods.<br>In the check you can specify the parameter ' + gSumEq + '123. It means the amount paid, in the case of underweight or overweight, such as "sunflower seeds 0.928 * 65.00 sum = 64". 0.928 * 65.00 = 60.32 and actually paid 64 rubles.<br>If for some reason you do not need to parse the line in the check, and use only the sum, then you must write SKIP_ROW in this line.'
	, '<ul><li>All errors are ignored, to find them use one of parsing option on main page<li>Goods with same name and id counts only one time, so count is differ with parse option output<li>For r/kgLiter table price per kilogram/liter count without mass loss and density<li>For r/mcgB12 table count with mass loss and density</ul>'
	, '<ul><li>' + wrapColorSpan('flour globus 2kg 54.99') + ' - there was no purchase. The line was found in the commentary.<li>' + fontRed('no price set') + ' ' + wrapColorSpan('/*<b>millet</b> 53/900g') + ' - parsing error. The string is found in the comment.<li>When searching, program have to parse the string in whole, including comments, so errors may occur, which will disappear when you parse strings without considering comments.</ul>'
	, '<b>Mass equivalent, column - #0.</b> Calculates how many kilograms of product it takes to get the same calories as from one kilogram of product set by the user. Weight loss is considered.<br><b> Equivalent price, column - #1.</b> Calculates how much the product should cost so that the parameter #2 for the given product equals the product specified by the user. Weight loss is considered.'
	, 'In case of errors mass and pure mass may be different in common table and summary tables. Number of good<br>and skipped rows equals to total in summary tables. Row good #0, skipped #1, bad #2.'
	, 'Total checks #0 (food and not food). One checks per #1 day(s)'
	, 'statistics for period days:#0 or years:#1 from #2 to #3 and man mass #4 kg'
	, '<i>Note.</i> Protein/fat/carbohydrates for canned foods are written on the cans for gross weight with brine/fill, and the vitamin b12 amount must be recalculated to the net weight.'//7
	, 'Do you really want to delete record?'//8
	, 'Parameter <b>round</b> specifies how the amount is rounded in the check. 0 - without rounding. 1 - rounding to a lower dollar, the amount of 56.89 will be rounded to 56 dollars. 2 - rounding to 50 cents down, 56.89 will be rounded to 56.50, 12.34 will be rounded to 12. Parameter <b>food</b> specifies the categories of checks among which there can be food. Parameter <b>empty text</b> defines how the check will be filled when selecting this product category, if the check contains blank text.'//9
	, 'Select one or more tables and click save.'
	, '1000 kilocalories', 'kilogram', 'gram of protein', 'microgram of B12'
	, 'notes on filling in the checks', 'source code', 'Common table.'
	, 'size', 'lines', 'modified', 'total', 'rows', 'text'
	, 'parse', 'show', 'average consumption period', 'last', 'from', 'to', 'show errors only', 'month', 'months'
	, 'goods stats', 'data as text'
	, 'price', 'equivalent', 'search', 'category', 'identifier', 'identifier(s)', 'whole word', 'food checks'
	, 'mass loss', 'select goods from list', 'case sensitive'
	, 'date', 'sum', 'comment', 'not found', 'error', 'message'
	, 'statistics', 'show', 'edit', 'money', 'goods', 'categories', 'addons'
	, 'charts and prices of goods', 'go to table', 'table'
	, 'total rows', 'food', 'not food', 'count', 'average'
	, 'name', 'round', 'alias', 'mass', '&rho;'/* 'density' */, 'mass loss', 'total (checks)'
	, 'protein', 'fat', 'carbohydrate', 'carb'
	, 'r', 'kcal', 'mcg', 'g', 'kg', 'liter', 'gProtein', 'gram', 'kc'
	, 'Note.', 'Notes.', 'draw graphs for selected items', 'uncheck all', 'hide graphs'
	, 'roubles', 'empty text', 'day', 'or'
	, 'Summary tables for the period', 'current one is excluded'
	, 'Different options.', 'Summary table group by type.'
	, 'options', '% of total',
	, 'no data selected for graphs', 'N', 'mass pure', 'massKg', 'quantity'
	, 'roubles / 1000 kilocalories'
	, 'last price', 'less is better', 'kilocalories', 'with mass loss', 'user goods'
	, 'error invalid number of arguments'
	, 'error invalid price/mass_kg should be >0'
	, 'error argument # is not a formula'
	, 'error argument # is not a number'
	, 'error invalid calorie should be >0'
	, 'error invalid mass loss should be >=0 & <1'
	, 'error DATE FROM should be before DATE TO'
	, 'parameter', 'value', 'per day', 'per day/kg', 'counter'
	//Note 'Summary union table by aliases.' should goes immediately after 'Summary table.'
	, 'Summary table.', 'Summary union table by aliases.', 'Summary tables.'
	, 'table as text', 'test'
	, 'Warning. Check date is today. Do you really want to save note?'
	, 'good not found'
	, 'no price set'
	, 'mass set two or more times'
	, 'negative or zero mass set'
	, 'negative mass set'
	, 'price'
	, 'no eggs count set'
	, 'two or more eggs count set'
	, 'no eggs category set'
	, 'two or more eggs category set'
	, 'invalid eggs category'
	, 'no mass set'
	, 'check count'
	, 'bread\\loaf\\flour\\pasta'
	, 'food categories', 'not food categories'
	, 'only food', 'all except food'
	, 'select or create new'
	, 'Warning. Record date is today. Do you really want to save?'
	, 'reorded identifiers', 'login', 'logout', 'sign up', 'password', 'cancel', 'repeat password'
	, 'remember me', 'Please fill in this form to create an user.', 'forgot', 'email'
	, 'error invalid login and/or password', 'password and repeat password should be the same'
	, 'invalid email'
	, 'user already exists please select another login'
	, 'an invalid character in the username was found'
	, 'manage users', 'save tables', 'enter as user', 'delete', 'format'
	, 'It is impossible to delete/modify a category while one of the checks contains it.'
	, 'The starting date must be no later than the earliest check.'
	, 'draw graphs for selected categories'
	, 'live journal'
	, 'Warning. Empty category field. Do you really want to save?'
	, 'string', 'filter', 'regular expression', '\\ is replaced by |', 'percent', 'with filter', 'has check'
	, 'Daily calorie intake'
	, 'animal protein', 'saturated fat', 'fiber'
], [
	'В глобусе для весовых товаров в чеке указано "масса*цену за кг", в пятерочке и магните указано "цена за кг*массу". При записи чека оставлять все как есть, ничего менять местами не надо. То же самое касается и товаров для которых цена указана поштучно, в глобусе это записывается в виде "1*29.79", в пятерочке и магните "29.79". Для уточнения можно посмотреть предыдущие записи в базе данных.<br>Если в строке встречаются символы ' + wrapColorSpan('//') + ', то это однострочный комментарий, всё после них игнорируется. Можно использовать комментарий ' + wrapColorSpan('/*...*/') + ', который может быть как однострочным так и многострочным. Если нет закрывающей части ' + wrapColorSpan('*/') + ', то это комментарий до конца записи. Комментарии нужны, например, для записи текущей цены некупленного товара.<br>В чеке можно указывать параметр ' + gSumEq + '123. Он означает заплаченную сумму, в случае недовеса или перевеса например "семечки 0.928*65.00 ' + gSumEq + '64". 0.928*65.00=60.32 при этом реально было заплачено 64 рубля.<br>Если по какой-то причине не нужно разбирать строку в чеке, а использовать только сумму, то в этой строке нужно написать SKIP_ROW.'
	, '<ul><li>Все ошибки игнорируются, чтобы найти их используйте одну из опций парсинга на главной странице<li>Товары с одинаковым именем и идентификатором считаются один раз, то есть результаты отличаются от полученных при парсинге<li>Для таблицы r/kgLiter цена за килограмм/литр считается без потери массы и плотности<li>Для таблицы r/mcgB12 все считается без потери массы и плотности</ul>'
	, '<ul><li>' + wrapColorSpan('мука глобус 2кг 54.99') + ' - покупки не было. Строка найдена в комментарии.<li>' + fontRed('не задана цена') + ' ' + wrapColorSpan('/*<b>пшено</b> 53/900г') + ' - ошибка парсинга. Строка найдена в комментарии.<li>При поиске нужно разбирать строку полностью, включая комментарий, поэтому могут появляться ошибки, которые исчезнут, когда будет разбор строк без учета комментариев.</ul>'
	, '<b>Эквивалентная масса, колонка - #0.</b> Считается сколько килограмм продукта нужно чтобы получить такую же калорийность как из одного килограмма продукта, заданного пользователем. При этом учитывается потеря массы.<br><b>Эквивалентная цена, колонка - #1.</b> Считается сколько должен стоить продукт, чтобы параметр #2 для данного товара совпадал с продуктом заданным пользователем. При этом учитывается потеря массы.'
	, 'В случае ошибок масса и чистая масса могут различаться в общей и итоговой таблицах. Число распознанных и<br>пропущенных строк равно общему числу строк в итоговых таблицах. Строк распознанных #0, пропущенных #1, плохих #2.'
	, 'Всего чеков #0 (пищевых и непищевых). Один чек за #1 дня.'
	, 'Статистика за период дней:#0 или лет:#1 с #2 по #3 и массой человека #4 кг'
	, '<i>Примечание.</i> Белки/жиры/углеводы для консервов на банках написаны для массы брутто с рассолом/заливкой, при этом содержание витамина b12 нужно пересчитывать на массу нетто.'//7
	, 'Вы действительно хотите удалить запись?'//8
	, 'Параметр <b>округление</b> указывает как огругляется сумма в чеке. 0 - без округления. 1 - округление до рубля в меньшую сторону, сумма 56.89 округлится до 56 рублей. 2 - округление до 50 копеек в меньшую сторону, 56.89 округлится до 56.50, 12.34 округлится до 12. Параметр <b>еда</b> указывает категории чеков среди которых может быть еда. Параметр <b>пустой текст</b> указывает как будет заполняться чек при выборе данной категории товара, если чек содержит пустой текст.'//9
	, 'Выберите одну или несколько таблиц и нажмите сохранить.'
	, '1000 килокалорий', 'килограмм', 'грамм белка', 'микрограмм B12'
	, 'примечания по заполнению чеков', 'исходный код', 'Общая таблица.'
	, 'размер', 'строк', 'посл. изменения', 'всего', 'строк', 'текст'
	, 'разобрать', 'показать', 'среднее потребление за период', 'последние', 'от', 'до', 'показывать только ошибки', 'месяц', 'месяцы'
	, 'стат.товаров', 'данные текстом'
	, 'цена', 'эквивалент', 'поиск', 'категория', 'идентификатор', 'идентификатор(ы)', 'слово целиком', 'пищевые чеки'
	, 'потеря массы', 'выбрать товары из списка', 'учитывать регистр'
	, 'дата', 'сумма', 'комментарий', 'не найдено', 'ошибка', 'сообщение'
	, 'статистика', 'смотреть', 'редактировать', 'деньги', 'товары', 'категории', 'дополнительно'
	, 'графики и цены на товары', 'перейти к таблице', 'таблица'
	, 'всего строк', 'еда', 'не еда', 'количество', 'среднее'
	, 'имя', 'округление', 'алиас', 'масса', '&rho;'/* 'плотность' */, 'п.массы', 'всего (чеков)'
	//, 'белки', 'жиры', 'углеводы', 'углев'
	, 'б', 'ж', 'у', 'у'
	, 'р', 'ккал', 'мкг', 'г', 'кг', 'литр', 'гБелка', 'грамм', 'кк'
	, 'Примечание.', 'Примечания.', 'нарисовать графики для выбранных товаров', 'снять все отметки', 'скрыть графики'
	, 'рублей', 'пустой текст', 'день', 'или'
	, 'Сводные таблицы за период', 'текущий исключен'
	, 'Разные опции.', 'Сводная таблица по категориям.'
	, 'опции', '% от всего',
	, 'не выбраны данные для графиков', '№', 'масса чистая', 'массаКг', 'количество'
	, 'рубли / 1000 килокалорий'
	, 'последняя цена', 'чем меньше тем лучше', 'килокалории', 'с потерей массы', 'товар пользователя'
	, 'ошибка неверное число аргументов'
	, 'ошибка неверный параметр цена/массаКг должно быть >0'
	, 'ошибка аргумент # не формула'
	, 'ошибка аргумент # не число'
	, 'ошибка неверно заданы калории должно быть >0'
	, 'ошибка неверно задана потеря массы должно быть >=0 & <1'
	, 'ошибка ДАТА ДО должна быть раньше чем ДАТА ОТ'
	, 'параметр', 'значение', 'в день', 'в день/кг', 'счетчик'
	, 'Итоговая таблица.', 'Итоговая объединенная таблица по алиасам.', 'Итоговые таблицы.'
	, 'таблица текстом', 'тест'
	, 'Предупреждение. Дата чека - сегодняшний день. Вы действительно хотите сохранить?'
	, 'товар не найден'
	, 'не задана цена'
	, 'масса задана два или более раз'
	, 'задана отрицательная или нулевая масса'
	, 'задана отрицательная масса'
	, 'цена'
	, 'не задано количество яиц'
	, 'количество яиц задано два или больше раз'
	, 'не задана категория яиц'
	, 'категория яиц задана два или больше раз'
	, 'неверная категория яиц'
	, 'не задана масса'
	, 'количество чеков'
	, 'хлеб \\ батон \\ мука\\макароны'
	, 'пищевые категории', 'непищевые категории'
	, 'только еда', 'все кроме еды'
	, 'выберите или создайте новую'
	, 'Предупреждение. Дата чека - это сегодня. Вы действительно хотите сохранить?'
	, 'переупорядочить идентификаторы', 'войти', 'выйти', 'регистрация', 'пароль', 'отмена', 'повтор пароля'
	, 'запомнить меня', 'Заполните форму чтобы создать пользователя.', 'забыли', 'почта'
	, 'ошибка неверный логин и/или пароль', 'пароль и повтор пароля должны совпадать'
	, 'неправильный адрес почты'
	, 'пользователь уже существует, выберите другой логин'
	, 'найден неверный символ в имени пользователя'
	, 'управление пользователями', 'сохранить таблицы', 'войти как пользователь', 'удалить', 'формат'
	, 'Невозможно удалить/изменить категорию пока один из чеков ее содержит.'
	, 'Стартовая дата должна быть не позже чем самый ранний чек.'
	, 'нарисовать графики для выбранных категорий'
	, 'живой журнал'
	, 'Предупреждение. Пустое поле категория. Вы действительно хотите сохранить?'
	, 'строка', 'фильтр', 'регулярное выражение', '\\ заменяется на |', 'процент', 'с фильтром', 'чек'
	, 'Суточных норм по калориям'
	, 'ж.белок', 'н.жир', 'клетч.'
]];

const MGCA = ['money', 'goods', 'categories', 'addons']
const MGCAJ = [...MGCA, 'live journal']
const form0 = 'form0';
const gNonEditVariables = ["egg_purified_mass_grams_by_category", "mass", "show_delete_button_for_money_table", "show_delete_warning", "show_money_rows", "skip_row", "start_date", "sum_eq"]
const gNonEditVariablesShow = [
	["egg purified mass grams by category", "your mass", "show delete button for money table", "show delete warning"
		, "number of rows in money table", "skip row label", "start date", "exact summa label"]
	, ["масса очищенных яиц в граммах по категориям", "ваша масса", "показывать кнопку удалить для таблицы деньги", "показывать предупреждение при удалении"
		, "число строк в таблице деньги", "метка неразбираемой строки", "стартовая дата", "метка точной суммы"]
]

const DUMP_FORMAT = ['csv', 'sql'];
const LANGUAGE_ID = {};
const SUM_SEPARATOR = ' / '
const defaultInputType2 = 5
const maxInputType2 = 10
const pfcCalorie = [4, 9, 4]
const gDefaultGoodName = '';
const gEdibleCategories = ['глобус', 'пятерочка', 'магнит', 'рынок', 'светофор', 'дикси', 'ашан'];

//begin start init
gLanguageString[0].forEach((e, i) => {
	LANGUAGE_ID[e] = i
});
lr=+(gLanguage == 'russian')

gLanguageString[lr][2] = '<b>' + getLanguageString('Notes.') + '</b>' + getLanguageString(2)

a = ['mass equivalent', 'price / kg equivalent', 'roubles / 1000 kilocalories']
s = getLanguageString(3)
for (i = 0; i < 3; i++) {
	j = getLanguageString(a[i])
	if (i == 2) {
		j = '<i>' + j + '</i>'
	}
	s = s.replace('#' + i, j)
}
gLanguageString[lr][3] = s

if (typeof gR != 'undefined') {
	j = 4
	s = '<b>' + getLanguageString('Note.') + '</b> ' + getLanguageString(j)
	for (i = 0; i < 3; i++) {
		s = s.replace('#' + i, gR[i])
	}
	gLanguageString[lr][j] = s

	j++
	s = '<b>' + getLanguageString('Common table.') + '</b> ' + getLanguageString(j)
	for (i = 0; i < 2; i++) {
		s = s.replace('#' + i, i == 0 ? gR[3] : gDays + '/' + gR[3] + '=' + normalize(gDays / gR[3], 2))
	}
	gLanguageString[lr][j] = s + " " + getLanguageStringUF('average') + ' '
		+ getLanguageString('roubles/1000kcal') + '=' + (gR[gR.length - 1] * 1000 / gR[6]).toFixed(2) + '.'
		+ "<br>" + getLanguageString('Daily calorie intake') + ' ' + formatNumber(gR[6], 2) + "/(29*" + gAddons['mass'] + ')='
		+ formatNumber(gR[6] / (29 * gAddons['mass']), 2) + '.'

	j++
	s = getLanguageString(j)
	for (i = 0; i < 5; i++) {
		if (i == 0) {
			k = gDays
		}
		else if (i == 1) {
			k = (gDays / 365.25).toFixed(2)
		}
		else if (i == 2 || i == 3) {
			k = df(gR[i + 2], '%e %B %Y')
		}
		else {
			k = gAddons["mass"];
		}
		s = s.replace('#' + i, k)
	}
	gLanguageString[lr][j] = s

}

gMessage = 1;
gMaxMonth = parseInt((new Date() - new Date(gAddons['start_date'])) / (1000 * 60 * 60 * 24 * 30), 10);
if (gMaxMonth == 0) {
	gMaxMonth = 1;
}
//end start init

function getLanguageString(s) {
	let i, v
	if (['b12', 'B12', '/', ''].includes(s)) {
		return s
	}
	if (s == 'kgLiter') {
		return getLanguageString('kg') + getLanguageStringUF('liter')
	}
	if (s == 'mcgB12') {
		return getLanguageString('mcg') + 'B12'
	}
	if (s == 'name0' || s == 'name1') {
		return getLanguageString('name') + s.substr(4)
	}
	if (s == '&Sigma;massKg*quantity') {
		i = s.indexOf('*')
		return s.substr(0, 7) + getLanguageString(s.substring(7, i)) + '*' + getLanguageString(s.substr(i + 1))
	}
	if (s == 'r<sub>kg</sub>') {
		return getLanguageString('r') + '<sub>' + getLanguageString('kg') + '</sub>'
	}

	//'error invalid login and/or password'
	if (typeof s == 'string' && s.length < 30 && !['roubles / 1000 kilocalories', 'per day', 'per day/kg'].includes(s)
		&& (s.includes('/') || s.includes('<br>') || s == 'kg or liter' || s == 'mass equivalent')) {
		//to keep delimiter use brackets () in split function
		return s.split(/([\s\/]+\d*|<br>)/).reduce((a, e, i) => a += (i % 2 ? e : getLanguageString(e)), '')
	}

	if (s == 'density') {
		s = '&rho;'
	}

	i = typeof s == 'number' ? s : LANGUAGE_ID[s]
	v = gLanguageString[+(gLanguage == 'russian')][i]
	if (v === undefined) {
		console.log("[" + s + "]", i)
		throw 0;
	}
	return v
}

function load(reload) {
	gLanguage = getCookie('language');
	if (!gJournal) {
		gDateSumType = [gKeys[1], 'sum', gKeys[2]];
		for (i = 1; i < gData.length; i++) {
			o = gData[i]
		}
	}

	if (!reload) {
		Calendar.setLocalImagePath(true);
		s = '<div style="float:left;text-align:left;">'
			+ btn("location.href='../?index'", 'globe')
		if (gAdmin) {
			s += ' ' + btn("toggleEdit(this)", undefined, 'bPlusMinus', "plusMinus")
		}
		s += ' ' + btn(refresh, 'refresh')
		if (gAdmin) {
			s += ' ' + btn("location.href='jm.php" + (gJournal ? '' : '?j') + "'", gJournal ? 'money' : 'edit')
		}
		s += ' <span id="rows"></span>'
			+ '</div>'
			+ '<div style="float:right;text-align:right;" id="language">'
			+ '</div>'

		el('tdRows').innerHTML = s

		gComboLanguage = new Combobox('language', gLanguage == 'english' ? 0 : 1
			, '<img src="../img/en.gif"> en', '<img src="../img/ru.gif"> ru'
			, changeLanguage);

		if (gJournal) {
			gImage = gImage.concat(['delete', 'up2', 'up', 'down', 'down2']);
		}
		else {
			if (addon('show_delete_button_for_money_table')) {
				gImage.push('delete')
			}
		}
	}
	// el('blogin').innerHTML=getLanguageString('login');

	if (!gJournal) {
		s = '<table class="c nb np">'

		a = ['', '', (gAdmin ? 'show / edit' : 'show'), 'statistics']
		b = [['sign up', 'login', 'logout'], ['charts and prices of goods'], ['goods', 'categories', 'addons'], ['money', 'categories'], MGCA];
		if (gAdmin == 2) {
			b[0].push('manage users')
		}
		c = ['', '', '_viewedit', '_statistics']
		for (j = 0; j < a.length; j++) {
			s += '<tr><td>'
			if (j != 0) {
				s += getLanguageString(a[j]) + ' '
			}
			q = [];
			b[j].forEach(e => {
				if (e == 'sign up') {
					l = 'signup';
				}
				else {
					l = e.replace(/ /g, '_')
				}
				if (j == 0) {
					q.push(clickableText(l + '()', e))
				}
				else {
					q.push(createUrl('jm.php?' + l + c[j], getLanguageString(e)))
				}
			});

			if (j == 1) {
				q.push(clickableText('showDialogId(0,"message")', 'notes on filling in the checks'))
			}
			s += q.join(", ");
		}

		s += '<tr><td><table class="a"><tr><td>'
			+ formbutton('csFill', 'parse', '', 'form1')
			+ '<input type="hidden" id="dateFrom" name="dateFrom">'
			+ '<input type="hidden" id="dateTo" name="dateTo">'
			+ '</form>'
			+ getLanguageString('from') + ' <span id="calendarFrom"></span> ' + getLanguageString('to') + ' <span id="calendarTo"></span>'
			+ '<td><table class="nb">'
			+ '<tr><td>' + wrapInputVAligned('<input type="checkbox" checked name="show errors only" form="form1">' + getLanguageString('show errors only'))
			+ '<tr><td>' + getLanguageString('last') + ' ' + getLanguageString('months') + ' ' + selectInput(0)
			+ '</table>'
			+ '</table>'
			+ '<tr><td>' + formbutton('eformCheck', 'price/kg<br>equivalent', '<table class="a"><tr><td>')
			+ '<td><input type="text" name="equivalent" value="199.99 363 0.4">'
			+ ' ' + getLanguageString('price/kg kcal/100g') + ' ' + getLanguageString('mass loss')
			+ '<br/><select id="ggoodsSelect" onchange="ggoodsChanged()" style="margin-top:2px;"><option value="" selected disabled hidden>' + getLanguageString('select goods from list') + '</option>'
			+ ops(gGoods) + '</select></table></form>'

		for (j = 0; j < 3; j++) {
			s += '<tr><td>' + formbutton(undefined, j == 2 ? 'parse' : 'show') + getLanguageString(j == 0 ? 'average consumption period' : 'last') + ' <input type="number" name="' + ['ma', 'anyQuantity', 'foodQuantity'][j] + '" min="1" max="10000" value="' + [30, gAddons['show_money_rows'], 2][j] + '"> '
			if (j == 2) {
				s += '(' + getLanguageString('food checks') + ')'
			}
			s += '</form>'
		}

		a = [
			undefined, 'search', ''
			, 'showIdCheck', 'show', 'identifier(s)', 'id', '10 39 44'
			, undefined, 'search', 'category', 'type', ''
			, undefined, 'count', 'goods', 'count', 'носки \\ трусы\\мыло'
		]
		const ik2 = 1;
		for (j = k = 0; j < a.length; k++) {
			l = formbutton(a[j++], a[j++], '', k == 0 ? form0 : undefined)
			if (k != 0) {
				s += '<tr><td>' + l;
				if (k == ik2) {
					s += tag({
						tag: 'button',
						type: 'submit',
						name: 'parseid',
						innertext: getLanguageString('parse')
					}) + ' '
				}
				s += getLanguageString(a[j]) + ' '
			}
			j++;

			if (k == 2) {
				s += '<select name="' + a[j++] + '">' + ops(gType) + '</select>'
				j++;
			}
			else {
				if (k == 0) {
					s += '<tr><td><table class="a"><tr><td>' + l + '<td>' + selectInput(1) + '<td>';
					['whole word'/* ,'case sensitive' */].forEach((e, i) => {
						s += wrapInputVAligned('<input type="checkbox" name="' + e + '" form="' + form0 + '">' + getLanguageString(e))
					})
					s += '</table>';
				}
				else {
					s += '<input type="text" name="' + a[j++] + '" value="' + a[j++] + '" style="width:' + (k == ik2 ? 230 : 377) + 'px">';
				}
			}
			s += '</form>';
		}
		s += '<tr><td>';
		s += ' ' + clickableText('saveTables()', 'save tables')
		if (gAdmin) {
			s += ', ' + clickableText('reorderIds()', 'reorded identifiers')
		}
		if (gAdmin == 2) {
			s += '<tr><td>';
			s += ' ' + tag({ tag: 'button', onclick: "test()", innertext: getLanguageString('test') })
				+ ' ' + createUrl('jm.php?ksort1', 'ksort1')
				+ ' ' + createUrl('jm.php?ksort2', 'ksort2')
				+ ' ' + createUrl('jm.php?type12', 'type12')
		}
		s += '</table>';

		s += '<table style="margin:0;" class="ms"><tr><th>' + getLanguageString('source code');
		gFileName.forEach(e => {
			j = e.lastIndexOf('/');
			s += '<th>' + createUrl('jm.php?' + e, e.substring(j + 1))
		})
		s += '<th>' + getLanguageString('total')

		j = ['size', 'lines', 'modified'];
		k = Math.floor(gFileInfo.length / gFileName.length)
		for (l = 0; l < k; l++) {
			s += '<tr><th>' + getLanguageString(j[l]);
			v = 0
			for (i = 0; i < gFileName.length; i++) {
				m = gFileInfo[k * i + l];
				s += '<td>'
				if (l == 2) {
					s += df(m, '%e%b%y')
				}
				else {
					s += formatStringL(m)
					v += m
				}
			}
			s += '<td>';
			if (l + 1 < k) {
				s += formatStringL(v)
			}
		}
		s += '</table>';
		el('note').innerHTML = s
		//after add tags
		i = gLanguage == 'russian'
		gCalendarFrom = new Calendar('calendarFrom', gAddons['start_date'], null, '%e%b%y', i);
		gCalendarTo = new Calendar('calendarTo', '', null, '%e%b%y', i);//'' - current date
	}

	for (i = 0; i < gData.length; i++) {
		insertRow(i);
	}
	updateTableInfo();
	//need to call even if !gAdmin to hide 1st row of table
	setPlusMinus(false)
}

function monthChanged() {
	v = el('months').value
	v = parseInt(v);
	if (isNaN(v) || v <= 0 || v > gMaxMonth) {
		return;
	}
	t = new Date();
	f = subMonths(t, v);
	gCalendarFrom.setDate(f);
	gCalendarTo.setDate(t);
}

function selectInput(p) {
	let a, name, form, value, ph, inputid, cf = '';
	if (p == 0) {
		a = ['', 12, 9, 6, 3]
		cf = 'monthChanged()'
	}
	else if (p == 1) {
		a = gGoodsZ
		name = 'search'
		form = form0;
		value = 'bread\\loaf\\flour\\pasta'
	}
	else {
		a = gType
		ph = 'select or create new'
		inputid = 'category'
		cf = 'typeChanged()'
	}

	name = name ? ' name="' + name + '"' : ''
	//v=value? getLanguageString(value):
	value = value ? ' value="' + getLanguageString(value) + '"' : ''
	form = form ? ' form="' + form + '"' : ''
	ph = ph ? ' placeholder="' + getLanguageString(ph) + '"' : ''
	inputid = inputid ? ' id="' + inputid + '"' : ''
	cfi = cf.length > 0 ? ' oninput="' + cf + '"' : ''

	//need to add op('') for select p=0 otherwise on selection of very first item '12' no changes
	//the same for p=0 
	return '<div class="select-editable se' + (p == 0 ? 0 : 1) + '">'
		+ '<select onchange="this.nextElementSibling.value=this.value;' + cf + '">' + op('') + ops(a) + '</select>'
		+ (p != 0 ? '<input type="text"' + name + value + form + ph + inputid + cfi + '>' :
			'<input type="number" id="months" min="1" max="' + gMaxMonth + '" oninput="' + cf + '">')
		+ '</div>'
}

function wrapLabel(s) {
	return '<label>' + s + '</label>'
}

/*
o=0 cut link (remove http?s://www.) & target in the same window
o=1 for journal full link & target blank
o=2 cut link (remove http?s://www.) & target blank
support russian characters in url

support strange characters in txt files ·=\xc2\xb7 in js string ·=\xb7
https://lyricstranslate.com/ru/red-army-choir-pesnya-pro-sovet·skiy-atom-lyrics.html
*/
function proceedUrls(s, o = 0) {
	/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement
	replacer(match, p1, p2, …,  pN, offset, string, groups)
	reference ends with \s space or < symbols http://ya.ru<br>
	*/
	return s.toString().replace(/https?:\/\/(www\.)?([^<\s]+)/giu,
		(m, g0, g1) => createUrl(m, o == 1 ? m : g1, o != 0 ? ' target="_blank"' : '')
	)
}

function createUrl(url, text, add = '') {
	return '<a href="' + url + '"' + add + '>' + (text === undefined ? url : text) + '</a>'
}

function insertRow(i) {
	let j, k, s;
	let fromSubmit = typeof i == 'boolean';
	if (fromSubmit) {
		i = 1;
	}
	let o = gData[i]
	let table = getTable()
	r = table.insertRow(fromSubmit ? 1 : -1);

	s = '<td style="white-space:pre;">'
	if (!gJournal) {
		s += '<td><table class="itable">'
		for (j = 0; j < gDateSumType.length; j++) {
			//2nd <td  style="white-space: nowrap;"> remove breaks which appears after gNotes
			s += '<tr><td>' + getLanguageString(gDateSumType[j]) + '<td style="white-space:nowrap;">'
		}
		s += '</table>'
	}
	if (i != 0) {
		s += '<td>'
		if (!gJournal && gEdibleCategories.includes(o.category)) {
			s += btn('openAsRecipe(this)', 'edible32')
		}
		if (gAdmin) {
			s += '<div>' + btn('toggleEdit(this)', gImage[0]) + '</div>'
			// s += '<div style="margin-top:3px;">' + btn('toggleEdit(this)', gImage[0]) + '</div>'
		}
		gImage.slice(1).forEach(e => {
			k = "submitFunction(this,'" + e + "')";
			s += '<td>' + btn(k, e);
		})
		s += '<td>' + o.id;
	}
	r.innerHTML = s;
	// console.log(s)

	fillRow(i, false)
}

function setPlusMinus(edit) {
	//edit=true if text area is visible
	let i, j;

	setRow0Visible(edit);

	let a = gImage.length + 1;
	let r = getTable().rows[0];
	if (edit) {
		/*prolong horizontal row for border
		Note If modify r.innerHTML+='<td>&nbsp;' then Calendar became NOT CLICKABLE
		so use insertCell
		*/
		for (i = 0; i < a; i++) {
			j = r.insertCell(-1);
			j.innerHTML = '&nbsp;';
		}
		getTA().value = "";
	}
	else {
		if (r.cells.length > a) {
			for (i = 0; i < a; i++) {
				r.deleteCell(-1);
			}
		}
	}
	setPlusMinusImage()
}

function setPlusMinusImage() {
	//in case of edit money or journal getTA()!==null in case of show / edit goods, categories, addons el('e0')!==null
	let m = getTA() !== null || el('e0') !== null;
	let e = el('plusMinus')
	if (e) {
		e.src = getImageString(m ? "minus" : "plus");
	}
}

function setRow0Visible(visible) {
	for (i = 0; i < (gJournal ? 1 : 2); i++) {
		getTable().rows[0].cells[i].style.display = (visible ? 'table-cell' : 'none')
	}
}

function getImageString(n) {
	return '../img/jm/' + n + '.png';
}

function refresh() {
	window.location.reload();
}

function updateTableInfo() {
	//gData.length-1 because first row in table consist of "+" "refresh" buttons and "rows" element
	let i, j, k, s, b, d;
	s = getLanguageString('rows') + ":" + (gData.length - 1);

	if (gJournal) {
		k = 0;
		for (k = 0, i = 1; i < gData.length; i++) {
			for (j = 3; j < 7; j++) {
				d = k < 2 || k + 2 >= (gData.length - 1) * 4;
				b = getTD(i, j).children[0];
				b.children[0].src = getImageString(gImage[j - 1] + (d ? 'd' : ''));
				b.disabled = d;
				k++;
			}
		}
	}
	else {
		i = j = 0;
		gData.forEach((e, ind) => {
			if (ind != 0) {
				k = e.sum.toString().split(SUM_SEPARATOR);
				if (k.length > 1) {
					i += Number(k[0].replaceAll(' ', ''));
					j += Number(k[1].replaceAll(' ', ''));
				}
			}
		})

		if (i != 0) {
			s += ' ' + formatNumber(i, 1) + SUM_SEPARATOR + formatNumber(j, 2) + SUM_SEPARATOR + formatNumber(j / i, 2);
		}
	}
	el("rows").innerHTML = s;
}

function toggleEdit(e) {
	let i, r;
	if (e.id == 'bPlusMinus' && getTA() !== null) {//if edit just close
		el('delete').click();
		return;
	}

	if (typeof e == 'number') {
		r = e;
	}
	else {
		r = getRow(e);
	}

	let edit = isEdit(r);//true switch to edit mode, otherwise turn off edit mode
	//hide if another row is in edit mode
	if (edit) {
		i = getTA();
		if (i !== null) {
			i = getRow(i);
			setPlusMinus(false);
			//isEdit check whether textarea in table so use fillRow(i,false); always
			fillRow(i, false);
		}
	}

	fillRow(r, edit);
	if (r == 0) {
		setPlusMinus(edit)
	}
	setPlusMinusImage()
}

//true switch to edit mode, otherwise turn off edit mode
function isEdit(r) {
	let i = getTextField(r).children;
	if (i.length == 0) {
		return true;
	}
	else {//field 0 has children but it's not textarea e.g. anchor "<a href=..."
		return i[0].nodeName != "TEXTAREA";
	}
}

function findCategory(n) {
	return gCategories.find(e => e[0] == n)
}

function typeChanged() {
	//textAreaChanged() used j so use "let j"
	let i, j = getTA(), k, c;
	textAreaChanged();//recound sum & update save button
	k = findCategory(el('category').value)//if user enter new category then k==undefined
	if (k) {
		c = k[2];
		if (j.value.length == 0) {
			k = 1;
		}
		else {
			for (i = 0; i < gCategories.length; i++) {
				if (j.value == gCategories[i][2] + ' ') {
					break;
				}
			}
			k = i < gCategories.length;
		}
		if (k) {
			j.value = (c.length == 0 ? '' : c + ' ')
		}
	}
}

function countSum(o) {
	let i, r, sum = [0, 0], d = [], sp, b, v = []
	//i=1 at first
	for (i = 1; i >= 0; i--) {
		sp = o.text
		if (i == 1) {
			sp = getTextWithoutComments(sp)
		}
		sp.split("\n").forEach((e, j) => {
			r = countSumWithTextInner(e);
			b = e.includes('@');
			if (b || i == 1) {
				sum[b ? 1 : 0] += r[0]//need to leave b?1:0
				d[j] = (b ? "@ " : "") + r[1]
			}
		})
	}
	for (i = 0; i < 2; i++) {
		v[i] = normalize(roundSum(sum[i].toFixed(2), o.category));
	}
	r = v[0]
	b = d.join("\n") + "\n" + getLanguageString('sum') + '=' + r
	if (sum[1] != 0) {
		r = formatNumber(v[0], 1) + SUM_SEPARATOR + formatNumber(Number(v[1]), 1)
			+ SUM_SEPARATOR + (sum[0] == 0 ? '&infin;' : formatNumber(sum[1] / sum[0], 2))
		b += "\n" + getLanguageString('sum') + '@=' + v[1]
	}
	return [r, b, sum[1]];
}

function countSumWithTextInner(q) {
	//at least one digit then dot then al least one digit
	let j, k, s = '', sum = 0;
	if (q.match(/^\s*$/)) {
		s += '----';//can be comment or empty
	}
	else {
		if ((j = q.indexOf(gSumEq)) != -1) {
			k = parseFloat(q.substr(j + gSumEq.length));
			s += '' + k
			sum += k;
		}
		else {
			//float*float, float*int, int*float, float, int. int needs for "жкх 5400" or "интернет 1000"
			//яйцо ваш выбор C2 30 штук 132.99 -> 132.99 not 30 so cann't use universal regexp
			//"ageStar SSMR2S шасси для 2.5 SATA HDD 412.00". Two numbers 2.5 and 412.00 need second one so search float with at least two digits fist
			k = [
				/(\t| |^)\d+\*\d+(\.\d+)?(?=\t| |$)/, //int*something
				/(\t| |^)\d+\.\d{2,}(\*\d+(\.\d+)?)?(?=\t| |$)/, //float or float*something with 2+ digits after point, "ageStar SSMR2S шасси для 2.5 SATA HDD 412.00"
				/(\t| |^)\d+\.\d+(\*\d+(\.\d+)?)?(?=\t| |$)/, //float or float*something
				/(\t| |^)\d+(\.\d+)?(\*\d+(\.\d+)?)?(?=\t| |$)/ //all others
			]
			for (j = 0; j < k.length; j++) {
				if (match = q.match(k[j])) {
					break;
				}
			}
			if (j == k.length) {
				s += getLanguageString('not found')
			}
			else {
				try {
					k = eval(match[0]);
					s += k.toFixed(2)
					sum += k;
				}
				catch (e) {
					s += getLanguageString('error')
				}
			}
		}
	}
	return [sum, s];
}

function roundSum(sum, type) {
	let i, j, r, round
	sum = Number(sum)
	if (type == '') {
		round = 0;
	}
	else {
		i = findCategory(type);//if use enter new category then undefined
		round = i ? i[1] : 0;
	}
	if (round == 0) {
		r = sum.toFixed(2);
	}
	else if (round == 1) {
		r = Math.floor(sum);
	}
	else {
		i = sum.toString();
		j = i.indexOf(".");
		if (j == -1) {
			r = i;
		}
		else {
			r = i.substring(0, j);
			if (i.charAt(j + 1) >= '5') {
				r += ".50"
			}
		}
	}
	return r;
}

function textAreaChanged() {
	if (!gJournal) {
		let t = getFieldValue(0);
		let sp = t.split("\n");
		if (sp.length > 0) {
			let o = {};
			o.text = t;
			o.category = el('category').value;
			let r = countSum(o)
			el('sum').innerHTML = r[0]
			el('text_total').value = r[1];
		}
	}
	updateSaveButton();
}

function updateSaveButton() {
	let s, disabled, o = createEditObject();
	disabled = o.text == '' || /^\s+|\s+$/.test(o.category) || isObjectsEqual(gData[gRow], o);
	if (!gJournal && !disabled) {
		if (o.type == '') {
			disabled = true
		}
		else {
			s = countSum(o);
			s[0] = s[0].toString().split(SUM_SEPARATOR)[0].replaceAll(' ', '');
			disabled = isNaN(s[0]) || s[0] < 0 || isNaN(s[2]) || s[2] < 0 || s[0] == 0 && s[2] == 0;
		}
	}

	s = 'save'
	if (disabled) {
		s += 'disabled';
	}
	el('savei').src = getImageString(s);
	el('savei1').src = getImageString(s + '1');
	el('save').disabled = disabled;
	el('save1').disabled = disabled;
}

//fill row data without id
function fillRow(r, edit) {
	let o = gData[r], i, a, s;
	if (edit) {
		i = gJournal ? 20 : 10;
		s = '<textarea id="text" rows="' + i + '" cols="' + (gJournal ? 100 : 60) + '" oninput="textAreaChanged()"></textarea>'
		if (!gJournal) {
			//"globus=000.00".length=13
			s += '<textarea id="text_total" disabled style="resize:none;" rows="' + i + '" cols="13"></textarea>'
		}
		s += '<br>'
		if (!gJournal) {
			//id=globusCheckParse for css
			s += btn("globusCheckParse()", 'refresh', 'globusCheckParse') + ' <input type="number" id="numbertype2" min="0" max="' + maxInputType2 + '" value="' + defaultInputType2 + '"> '
		}
		s += btn("submitFunction(this,'save')", 'save', 'save', 'savei')
			+ btn("submitFunction(this,'save1')", 'save1', 'save1', 'savei1')
			+ btn('toggleEdit(this)', 'delete', 'delete', 'deletei');
	}
	else {
		s = o.text;
		if (gJournal) {
			s = proceedUrls(tag2text(s), 1);
		}
		else {
			s = getColoredText(s);
		}
	}
	getTextField(r).innerHTML = s

	if (!gJournal) {
		o.sum = countSum(o)[0]
		a = ['<span id="calendar"></span>', '<p id="sum"></p>', selectInput(2)]
		for (i = 0; i < gDateSumType.length; i++) {
			if (edit) {
				s = a[i]
			}
			else {
				m = gDateSumType[i]
				s = o[m]
				if (m == 'date') {
					s = df(s, '%e %B %Y')
				}
				else if (m == 'sum') {
					s = formatString(s)
				}
			}
			getField(r, i).innerHTML = s
		}

		if (edit) {
			gCalendar = new Calendar('calendar', o.date, updateSaveButton, '%e %B %Y %A', gLanguage == 'russian');
			if (o.date == '') {//id edit row0 to correct compare editObject with gData[gRow]
				o.date = gCalendar.getDateFormat('%F');
			}
			el('sum').innerHTML = o.sum;
			if (o.category == '') {
				el('category').selectedIndex = -1
			}
			else {
				el('category').value = o.category
			}
		}
	}

	//after all fields created
	if (edit) {
		gRow = r;
		getTA().value = o.text;
		textAreaChanged();
	}
}

function getFieldValue(i) {
	if (gKeys[i] == 'date') {
		return gCalendar.getDateFormat('%F');
	}
	else {
		return el(gKeys[i]).value;
	}
}

//comments are highlighted
function getColoredText(s) {
	return gct(s, true)
}

function getTextWithoutComments(s) {
	return gct(s, false)
}

function gct(s, full) {
	let i = 0, j, k, l, m, r = '', q;
	const re = /\/\/[^\n]*|\/\*[\S\s]*?(\*\/|$)/g
	while (m = re.exec(s)) {
		j = m.index
		l = j + m[0].length
		r += s.substring(i, j)
		q = s.substring(j, l)
		if (full) {
			r += wrapColorSpan(q)
		}
		else {
			for (k = 0; k < q.split("\n").length - 1; k++) {
				r += "\n";
			}
		}
		i = re.lastIndex;
	}
	return r + s.substring(i);
}

function wrapNBSpan(s) {
	return wrapSpanClass(s, 'nb')
}

function wrapNBSmallSortSpan(s) {
	return wrapSpanClass(s, 'nb smallsort')
}

function wrapColorSpan(s) {
	return wrapSpanClass(s, 'c')
}

function wrapSpanClass(s, c) {
	return '<span class="' + c + '">' + s + '</span>'
}

function getRow(e) {
	let i, p = e;
	if (e.id == 'bPlusMinus') {
		return 0;
	}
	do {
		p = p.parentElement;
		if (p.nodeName == 'BODY') {
			throw 0;
		}
	} while (p.nodeName != 'TR' || p.parentElement.parentElement.id != 't0')

	i = [...getTable().rows].findIndex(e => p == e);
	if (i == -1) {
		throw 0;
	}
	return i;
}

function getGDIndex(r) {
	let j = getTable().rows[r].cells[0].innerText
	let i = gd[0].findIndex(e => j == e[0])
	if (i == -1) {
		throw 0;
	}
	return i
}

//return -1 if not found it's ok because sometimes filter is using http://localhost/php/jm.php?goods_viewedit
function getTableRow(s) {
	return [...getTable().rows].findIndex(e => s == e.cells[0].innerText);
}

function getTA() {
	return el("text");
}

function getTD(r, n) {
	return getTable().rows[r].cells[n]
}

function getTable() {
	return el('t0');
}

function getInnerTable(r) {
	return getTD(r, 1).children[0];
	//doesn't work return el("itable");
}

function getTextField(r) {
	return getTD(r, 0);
}

//only for money 0-date, 1-sum, 2-type
function getField(r, index) {
	return getInnerTable(r).rows[index].cells[1];
}

/*
function sleepFor( sleepDuration ){
	let now = new Date().getTime();
	while(new Date().getTime() < now + sleepDuration){ }
}
*/

function createEmptyObject() {
	let i;
	let o = {};
	for (i = 0; i < gKeys.length; i++) {
		o[gKeys[i]] = '';
	}
	return o;
}

function createEditObject() {
	if (getTA() === null) {
		return createEmptyObject();
	}
	let o = {};
	let i;
	for (i = 0; i < gKeys.length - 1; i++) {
		o[gKeys[i]] = getFieldValue(i);
	}
	return o;
}

function isObjectsEqual(a, b) {
	let i;
	for (i = 0; i < gKeys.length - 1; i++) {
		if (a[gKeys[i]] != b[gKeys[i]]) {
			return false;
		}
	}
	return true;
}

function assign(index, a) {
	let o = gData[index];
	let i
	for (i = 0; i < gKeys.length; i++) {
		o[gKeys[i]] = a[gKeys[i]];
	}
}

function getMinMaxIndex(max) {
	if (typeof gData == 'undefined' || gData.length == 1 && gData[0].id == '') {
		return 0;
	}
	id = gData[max ? 1 : gData.length - 1].id;
	if (max) {
		id++;
	}
	else {
		id--;
	}
	return id;
}

function submitFunction(e, command) {
	let r = getRow(e);
	let o = createEditObject();
	o.text = o.text.trim();
	//console.log(o,command)

	if (command == 'delete') {
		if (gMessage && addon('show_delete_warning')) {
			confirmId('Do you really want to delete record?', submitFunction, arguments);
			return;
		}
	}
	else if (!gJournal && command == 'save') {
		//warning if record date is today
		if (gMessage) {
			let w = [gCalendar.getDateFormat('%F') == Calendar.getDateFormat(new Date()), o.category.length == 0];
			let s = ['Warning. Record date is today. Do you really want to save?', 'Warning. Empty category field. Do you really want to save?'];
			let cw = w[0] + w[1]
			if (cw == 2) {//two warnings
				confirmId(s, submitFunction, arguments);
				return;
			}
			else if (cw == 1) {
				confirmId(w[0] ? s[0] : s[1], submitFunction, arguments);
				return;
			}
		}

	}

	let id1 = '';
	if (gJournal) {
		if (command == 'up' || command == 'down') {
			id1 = gData[r + (command == 'up' ? -1 : 1)].id;
		}
	}
	// let o=createEditObject(); need to do some checks upper
	o.id = gData[r].id;

	if (command == 'save1') {
		command = 'save';
		o.text = splitl(o.text)
	}
	if (command == 'save') {//update || insert
		command = r == 0 ? 'insert' : 'update'
	}
	o.command = command;
	o.table = gJournal ? 'journal' : 'money'
	if (gJournal) {
		o.id1 = id1;
	}

	e.disabled = true;

	//should be defined inside submit function cause use e,command variables
	let f = (re) => {
		if (typeof re == 'object') {
			showDialogE(re.message, 1098);
			return;
		}
		let s = 'OK';
		let s1 = ''
		if (!re.startsWith(s)) {
			showDialogE(re, 1104);
			return;
		}

		if ((command == 'insert' || command == 'update') && !gJournal) {
			s1 = re.substring(s.length);
			i = re.indexOf(' ');
			s1 = i == -1 ? '' : re.substring(i + 1)
			if (command == 'insert') {
				o.id = Number(re.substring(s.length, i == -1 ? re.length : i))
			}
			if (s1 != '') {
				showDialogE(translateErrors(s1), 1116);
			}
		}

		if (command == 'insert') {
			if (gJournal) {
				o.id = getMinMaxIndex(true);
			}
			assign(0, o);
			toggleEdit(e)//gData.unshift after toggleEdit
			gData.unshift(createEmptyObject());
			insertRow(true)
			updateTableInfo();
			if (s1 != '') {
				toggleEdit(1)
			}
		}
		else if (command == 'update') {
			if (s1 == '') {
				toggleEdit(e);
			}
			assign(r, o);//change data
			if (s1 == '') {
				fillRow(r, false);
			}
		}
		else if (command == 'delete') {
			getTable().deleteRow(r);
			gData.splice(r, 1);
			updateTableInfo();
		}
		else if (command == 'down' || command == 'up') {
			moveTableRow(r, command);
		}
		else if (command == 'down2' || command == 'up2') {
			//DO NOT USE o NAME INFLUENCE ON outer object
			let o1 = gData[r];
			gData.splice(r, 1);
			if (command == 'up2') {
				o1.id = getMinMaxIndex(true);
				assign(0, o1)
				gData.unshift(createEmptyObject());
			}
			else {
				o1.id = getMinMaxIndex(false);
				gData.push(o1);
			}
			for (i = 1; i < gData.length; i++) {
				fillRow(i, false);
				//also set id for last cell in a row
				getTD(i, gImage.length + 1).innerHTML = gData[i].id;
			}
			setRow0Visible(false);
		}
		e.disabled = false;
	}
	fetchpost("jm.php", o, f)
}

//===== BEGIN special for journal =====
function moveTableRow(r, command) {
	let r1 = r + (command == 'down' ? 1 : -1);
	//id's left the same
	let t = gData[r].text;
	gData[r].text = gData[r1].text;
	gData[r1].text = t;

	//ids of last columns leaves the same
	let a = getTextField(r);
	let b = getTextField(r1);
	t = a.innerHTML;
	a.innerHTML = b.innerHTML;
	b.innerHTML = t;
}
//===== END special for journal =====

//===== BEGIN calorie functions =====
//for click on cell in money search, calorie, goods statistics
function clickID(id) {
	document.forms[0].id.value = id;
	document.forms[0].submit();
}

function idReference(id, text) {//also for goods statistics
	if (text === undefined) {
		text = id;
	}
	else {
		text = df(text, '%e' + df(text, '%b').substring(0, 3) + '%y')
		// text=df(text,'%e%b%y')
	}
	return clickableText('clickID(' + id + ')', text, false)
}

function clickableText(f, text, translate = true) {
	return "<a href='#' onclick='" + f + "'>"
		+ (translate ? getLanguageString(text) : text)
		+ "</a>"
}

//calorie load
gca = ['N', 'text', 'kcal/100g', 'category', 'total', '', 'kilocalories', 'roubles', '/', '1000 kilocalories', 'date', 'identifier'];
gc = ['name', 'count', '&Sigma;massKg*quantity', 'mass pure', 'g/day', 'protein', 'fat', 'carb', 'kcal', 'b12', 'comment']

function cload() {
	//~ startTime = new Date();
	let i;//fillTable modify i so i define here as inner variable
	gz = [];
	for (i = 0; i < gd.length; i++) {
		gz[i] = []
	}
	if (gd[0].length != 0) {//only statistics & no errors
		fillTable(0, gca, ['N', '1000 kilocalories', 'identifier']);
		cfill(0, true);
	}

	for (i = 1; i < 3; i++) {
		fillTable(i, gc, gc);
		cfill(i, true);
	}
	//outElapsedTime();

	s = ''
	k = LANGUAGE_ID['Summary table.']
	for (i = 0; i < 2; i++) {
		s += "<a style='margin-right:20px;' href='#s" + i + "'>" + getLanguageString(k + i) + "</a>";
	}
	el('p0').innerHTML = s + '<br>' + getLanguageString(4)

	el('p1').innerHTML = getLanguageString(5)

	t = el('ta')
	th = ['kilocalories', 'mass', 'mass pure', 'protein', 'fat', 'carbohydrate', 'b12', 'roubles']

	s = '<tr><th colspan=' + (th.length + 1) + '>' + getLanguageString(6) + '<tr><th>';
	th.forEach((e, i) => {
		s += '<th>' + getLanguageString(e)
		if (i != 0 && i != 7) {
			if (i < 3) {
				j = 'kg'
			}
			else {
				j = i == 6 ? 'mcg' : 'g'
			}
			s += ' (' + getLanguageString(j) + ')'
		}
	});
	t.tHead.innerHTML = s
	s = ''
	c = []
	const proteinIndex = 3;
	['total', 'per day', 'per day/kg', 'percent'].forEach((e, i) => {
		s += '<tr><th>' + getLanguageString(e)
		for (j = 0; j < th.length; j++) {
			k = gR[j + 6];
			if (i == 3) {
				if (j >= proteinIndex && j < proteinIndex + 3) {
					k = formatNumber(c[j] / c[0] * 100 * pfcCalorie[j - proteinIndex], 1) + '%';
				}
				else {
					k = '&nbsp;'
				}
			}
			else {
				if (i != 0) {
					k /= gDays;
					if (i == 2) {
						k /= gAddons["mass"];
						c.push(k)
					}
				}
				k = formatNumber(k, 2)
			}
			s += '<td>' + k
		}
	});
	t.tBodies[0].innerHTML = s
}

function outElapsedTime() {
	el('out').innerHTML = ' jsTime=' + ((new Date() - startTime) / 1000).toFixed(2)
}

function cafill(first) {
	table = el('goods0');
	data = gz[0];
	data.forEach((e, index) => {
		r = table.rows[index + 1]
		j = 0;
		for (key in e) {
			if (key == 'rkcv') {
				continue;
			}
			v = e[key]

			if (key == 'id') {
				v = idReference(v)
			}
			else if (typeof v == "number" && v >= 1000) {
				v = formatString(v);
			}

			if (['totalK', 'rkc'].indexOf(key) != -1) {
				if (typeof v == "string" && v.indexOf('?') != -1) {
					i = '?'
				}
				else {
					if (typeof v == 'string') {
						i = meval(v);
					}
					else {
						i = v
					}
					if (i == Infinity) {
						i = "+&infin;"
					}
					else {
						i = formatString(i);
					}
				}
				r.cells[j++].innerHTML = i;
				r.cells[j++].innerHTML = '=';
			}
			r.cells[j++].innerHTML = v
		}
	});

	if (first) {
		//fill rkcv for sort function
		data.forEach((e) => {
			v = e['rkc']
			if (typeof v == "string" && v.indexOf('?') != -1) {
				i = '?'
			}
			else {
				i = eval(v)
			}
			e['rkcv'] = i;
		});
	}
}

function cgetRow(e) {
	let r = []
	skip = e['mass'] == 0;
	if (skip) {
		//use global variable skips
		skips++;
	}
	for (key in e) {
		if (['massv', 'massPurev'].indexOf(key) != -1) {
			continue;
		}

		if (skip && ['mass', 'massPure', 'grday', 'protein', 'fat', 'carbohydrate', 'calorie', 'b12'].indexOf(key) != -1) {
			v = '-'
		}
		else {
			v = e[key]
			if ((i = m.indexOf(key)) != -1) {
				if (typeof v == 'string' && (v.includes('*') || v.includes('+'))) {
					v = (v.includes('?') ? '?' : meval(v)) + "=" + v;
				}
			}
		}
		if (key == 'mass' && v.length > 30) {
			v = '<font class="sm">' + v + '</font>'
		}
		r.push(v)
	}
	return r;
}

function cfill(n, first) {
	if (n == 0) {
		cafill(first);
		return;
	}
	table = el('goods' + n);
	m = ['mass', 'massPure'];
	a = ['c'].concat(m);
	t = []
	sum = []
	a.forEach((e) => { t[e] = 0; });
	data = gz[n];
	skips = 0
	data.forEach((e, index) => {
		r = table.rows[index + 1];
		cgetRow(e).forEach((v, index) => {
			r.cells[index].innerHTML = v
		});
	});

	if (first) {
		//fill massv & massPurev for sort functions
		data.forEach((e, index) => {
			m.forEach((k) => {
				i = e[k];
				if (typeof i == 'string' && i.indexOf('?') != -1) {
					i = '?'
					j = 0;
				}
				else {
					i = j = eval(i);
				}
				e[k + 'v'] = i;
				t[k] += j;
			});

			i = e['c'];
			t['c'] += i;

			if (typeof sum[i] == 'undefined') {
				sum[i] = 0;
			}
			sum[i]++;
		});

		k = LANGUAGE_ID['Summary table.'] + n - 1
		j = '<b>' + getLanguageString(k) + '</b>' + ' ' + getLanguageStringUF('quantity') + ':' + getLanguageString('counter');
		for (k in sum) {
			j += ' ' + k + ':' + sum[k];
		}
		el('s' + (n - 1)).innerHTML = j

		r = table.rows[data.length + 1];
		j = 0;
		r.cells[j++].innerHTML = "<b>" + getLanguageString('rows') + ":" + data.length
			+ " " + getLanguageString('food') + ":" + (data.length - skips)
			+ "<br>" + getLanguageString('not food') + ":" + skips;
		a.forEach((e) => {
			v = t[e]
			if (e != 'c') {
				v = v.toFixed(2);
			}
			r.cells[j++].innerHTML = "<b>" + v;
		});

		r.cells[j++].innerHTML = "<b>" + wrapNBSpan(formatString((t.massPure * 1000 / gDays).toFixed(2)));

		for (; j < gc.length;) {
			r.cells[j++].innerHTML = "<b>-"
		}
	}
}

//sort function
function csort(n, c, o) {
	//startTime = new Date();
	if (n == 0) {
		let key = gca[c];
		if (key == '1000 kilocalories') {
			key = 'rkcv';
		}
		gz[0].sort((a, b) => {
			if (a[key] == b[key]) {
				v = 0;
			}
			else {
				//all errors up always
				if (a.rkcv == '?') {
					return -1;
				}
				if (b.rkcv == '?') {
					return 1;
				}
				v = a[key] > b[key] ? 1 : -1;
			}
			if (o) {
				v = -v;
			}
			return v;
		});
	}
	else {
		a = ['name', 'c', 'massv', 'massPurev', 'grday', 'protein', 'fat', 'carbohydrate', 'calorie', 'b12', 'comment'];
		col = a[c];
		gz[n].sort((a, b) => {
			if (col == 'name' || col == 'comment') {
				v = a[col].localeCompare(b[col]);
			}
			else {
				if (a[col] == b[col]) {
					return 0;
				}
				if (typeof a[col] == 'string') {
					return 1;
				}
				if (typeof b[col] == 'string') {
					return -1;
				}
				v = a[col] > b[col] ? 1 : -1;
			}
			if (o) {
				v = -v;
			}
			return v;
		});
	}
	cfill(n, false);
	//outElapsedTime();
}

function getCSVString(head, body) {
	const sep = ';';
	let s = head.join(sep)
	body.forEach(e => {
		s += "\n"
		e.forEach((e, i) => {
			if (i) {
				s += sep;
			}
			if (typeof e == 'string') {
				//it's good way to change "\r"",\n" to \\r \\n because need to story table comments in one row
				e = e.replaceAll(/\n/g, "\\n").replaceAll(/\r/g, "\\r")
				if (e.includes(sep) || e.includes('"')) {
					e = '"' + e.replaceAll('"', '""') + '"'
				}
			}
			s += e;
		})
	})
	return s;
}

function saveTables() {
	s = getLanguageString('Select one or more tables and click save.') + '<br><br><table><tr><td>';
	MGCAJ.forEach((e, i) => {
		s += checkboxWithTextVAligned(i, getLanguageString(e), true, true, checksaveClick)
	})
	s += '<td style="padding-left:40px">' + getLanguageString('format')
	for (i = 0; i < 2; i++) {
		//radio centered in jm.css
		s += '<br>' + wrapLabel('<input type="radio" name="g" id="r' + i + '"' + (i == 0 ? 'checked="checked"' : '') + '></input>' + DUMP_FORMAT[i]);
	}
	s += '</table><br>' + btn('saveTablesClick(1)', 'save') + ' ' + btn('saveTablesClick(0)', 'delete')
	showDialog(s, 'message')
}

function checksaveClick() {
	j = 0;
	MGCAJ.forEach((q, i) => {
		e = el('c' + i)
		if (e.checked) {
			j++
			d = e;
			d.disabled = false;
		}
	});
	if (j == 1) {
		d.disabled = true;
	}
}

function saveTablesClick(p) {
	closeModal()
	if (!p) {
		return;
	}
	gformat = DUMP_FORMAT[el('r0').checked ? 0 : 1];
	o = { dump_format: gformat }
	MGCAJ.forEach((q, i) => {
		e = el('c' + i)
		if (e.checked) {
			o[q] = 1;
		}
	})
	fetchpost('jm.php', o, saveTablesCallback);
}

function saveTablesCallback(s) {
	if (typeof s != 'string' || s.startsWith('error')) {
		showDialogE(s, 1584);
		return
	}
	v = ''
	if (gformat == 'sql') {
		v = s;
	}
	else {
		p = JSON.parse(s)

		f = ['id']
		t = ['identifier']

		for (j of p) {
			if (Array.isArray(j)) {
				if (j.length == 0) {
					continue;
				}
				h = Object.keys(j[0]).map(e => {
					i = f.indexOf(e)
					return getLanguageString(i == -1 ? e : t[i])
				})
				b = []
				for (i of j) {
					b.push(Object.values(i))
				}
				v += getCSVString(h, b) + "\n;\n"
			}
			else {
				v += getLanguageString('table') + ' ' + j.table + "\n"
			}
		}
	}
	edownload(v);
}

function saveTable(n) {
	h = []
	gc.forEach(e => {
		const si = '&Sigma;'
		v = getLanguageString(e)
		if (v.startsWith(si)) {
			v = getLanguageString('sum') + ' ' + v.substr(si.length)
		}
		h.push(v)
	});

	a = [];
	t = el('goods' + n);
	[...t.rows].slice(1).forEach(e => a.push([...e.cells].map(e => e.textContent)))

	c = getCSVString(h, a)
	gformat = 'csv'
	edownload(c);
}

function edownload(c) {
	fn = 'tables.' + gformat
	if (gformat == 'csv') {
		a = toCP1251(c)
		downloadCP1251(fn, new Uint8Array(a).buffer)
	}
	else {
		downloadUTF8(fn, c)
	}
}

function toCP1251(c) {
	let a = []
	let i, k;
	const j = 'А'.charCodeAt(0);
	//to cp1251
	for (i = 0; i < c.length; i++) {
		if (c[i] == 'Ё') {
			k = 0xa8
		}
		else if (c[i] == 'ё') {
			k = 0xb8
		}
		else {
			k = c.charCodeAt(i);
			if (k >= j && k < j + 64) {
				k += 0xc0 - j;
			}
		}
		a.push(k);
	}
	return a;
}

function downloadCP1251(filename, text) {
	let mimeType = 'text/csv';
	let a = document.createElement('a');

	if (navigator.msSaveBlob) { // IE10
		navigator.msSaveBlob(new Blob([text], {
			type: mimeType
		}), filename);
	}
	else if (URL && 'download' in a) { //html5 A[download]
		a.href = URL.createObjectURL(new Blob([text], {
			type: mimeType
		}));
		a.setAttribute('download', filename);
		a.click();
		//a.dispatchEvent(new MouseEvent("click", {}));
	}
	else {
		location.href = 'data:application/octet-stream,' + encodeURIComponent(text); // only this mime type is supported
	}
}

function fillTable(n, captions, sortColumns) {
	id = 'goods' + n
	s = gz[n]
	j = gd[n];
	k = gk[n];
	//if n>0 +1 row for total
	rows = n == 0 ? 0 : 1;

	for (i = 0; i < j.length;) {
		o = {};
		k.forEach(e => o[e] = j[i++]);
		if (n == 0) {
			o.date = df(o.date, '%d %B %Y')
			o.text = translateErrors(o.text);
			o.identifier = idReference(o.identifier)
		}
		else {
			o.comment = proceedUrls(o.comment, 0);
		}
		if (n != 2 || o.c > 0) {
			s.push(o);
		}
	}
	rows += s.length;
	table = el(id);
	for (i = 0; i < rows; i++) {
		r = table.insertRow(-1);
		for (j = 0; j < captions.length; j++) {
			r.insertCell(-1);
		}
	}

	s1 = ''
	captions.forEach((e, j) => {
		if (sortColumns.indexOf(e) == -1) {
			s = '<th>';
			if (e != '') {
				s += getLanguageString(e);
			}
		}
		else {
			s = sortColumn(n != 0, e, csort, n, j, 2, true, false, n != 0);
		}
		s1 += s;
	});

	//even if tHead has no <tr> tag inside, if make r.innerHTML='some string' it's automatically increment number of rows
	//and table.rows[0] - is in thead
	table.tHead.innerHTML = s1;
}

function formatStringL(n) {
	return formatString(n, gLanguage == 'russian' ? ' ' : ',')
}

/*eval(0.8*3+0.9*12)=13.200000000000001
meval(0.8*3+0.9*12)=13.2
*/
function meval(s) {
	//add eval() safety only digits or +-*/().
	//In a square brackets any character except ^, -, ] or \ is a literal.
	if (!/^[\s\d+\-*\/().]+$/.test(s)) {
		console.log('error meval(' + s + ')')
		return 0;
	}

	let r = s.match(/\.\d+/g);
	r = r ? Math.max(...r.map(e => e.length)) - 1 : 0;
	return formatNumber(eval(s), r);
}

function sortColumn(alignCenter, name, sortf, i, j, ao, encode = true, smallFont = false, saveTableButton = false, checkBox = false) {
	let s = "<th>";
	let k;
	if (j != 0) {//only on first column
		saveTableButton = false
	}
	if (saveTableButton) {
		s += "<table width='100%' class='nb'><tr><td>"
			+ btn('saveTable(' + i + ')', 'save16') + "<td>"
	}
	s += "<table ";
	if (alignCenter) {
		s += "align='center' ";
	}
	s += "class='nb sort'>";

	let f = (a, fn, ao, blue) => {
		let j = a[1]
		let k = a[2]
		return "<td><img" + (ao == 1 && j > 2 ? " style='margin-" + (k == 0 ? 'top' : 'bottom') + ":5px;'" : '') +
			" src='../img/jm/" + (k == 0 ? 'up' : 'down') + "8" + (blue ? "b" : "") + ".png' onclick='" + fn.name + "(" + a.slice(0, fn.length).join(',') + ")'>"
	}

	for (k = 0; k < 2; k++) {
		s += "<tr>";
		if (ao == 3) {
			s += f([i, j, k, 1], sortf, ao, true)
		}
		if (k == 0) {
			s += "<th rowspan=2>";
			v = encode ? getLanguageString(name) : name
			if (checkBox) {
				s1 = checkboxWithTextVAligned(j - 1, v)
				if (smallFont) {
					s += wrapNBSmallSortSpan(s1)
				}
				else {
					s += s1;
				}
			}
			else {
				if (smallFont) {
					s += wrapNBSmallSortSpan(v)
				}
				else {
					s += wrapNBSpan(v)
				}
			}
		}
		s += f([i, j, k, 0], sortf, ao)
	}

	if (saveTableButton) {
		s += '</table>'
	}
	s += '</table>'
	return s;
}
//===== END calorie functions =====

//===== BEGIN goods statistics functions (jm.php?goods_stats) =====
function gload() {
	gz = []
	gm = 10;
	gpid = ['price', 'priceKgL', 'price1gProtein', 'b12', 'id', 'date'];//also uses in gcfill

	//cann't call on init gLanguage isn't defined
	s = gLanguageString[1][1];
	['r/mcgB12', 'r/kgLiter'].forEach((e) => s = s.replace(e, getLanguageString(e, 1)));
	gLanguageString[1][1] = s

	j = "<b>" + getLanguageString('Notes.') + "</b>" + getLanguageString(1)
	for (i = 0; i < gpid.length - 2; i++) {
		j += divGraph(i)
	}
	j += drawGraphsUncheckAllButtons(ggraph, true) + "<p>"
	gtn = ["r/1000kcal", "r/kgLiter", "r/gProtein", "r/mcgB12"];
	gtn.forEach((e, i) => {
		j += "<a style='margin-right:20px;' href='#gt" + i + "'>" + getLanguageString('go to table') + " " + getLanguageString(e);
	});


	el('notes').innerHTML = j
	//gz may be defined earlier so define them inside of function

	for (k = 0; k < gd.length;) {
		o = {};
		o.name = gd[k++];
		o.d = []
		while (typeof gd[k] == 'number') {
			oi = {};
			gpid.forEach((e) => {
				oi[e] = gd[k++];
			});
			d = new Date(oi.date);
			oi.daten = (d.getFullYear() * 100 + (d.getMonth() + 1)) * 100 + d.getDate()
			o.d.push(oi)
		}
		gz.push(o);
	}

	for (n = 0; n < gpid.length - 2; n++) {
		table = el('gt' + n);
		for (i = 0; i < gz.length; i++) {
			r = table.insertRow(-1);
			for (j = 0; j < gm + 2; j++) {
				r.insertCell(-1);
			}
		}
		s = ''
		for (j = 0; j < gm + 2; j++) {
			if (j == 0) {
				k = "name"
			}
			else if (j == 1) {
				k = "count"
			}
			else {
				k = gtn[n];
			}
			s += sortColumn(1, k, gsort, n, j, j == 2 ? 3 : undefined)
		}
		table.tHead.innerHTML = s;
		gcfill(n);
	}
}

function ghidegraphs() {
	let i;
	if (typeof gType == 'undefined') {
		i = gpid.length - 2;
	}
	else {
		i = 1;
	}
	for (n = 0; n < i; n++) {
		el("dc" + n).style.display = 'none';
	}
}

function gcfill(n) {
	table = el('gt' + n);
	gz.forEach((el, i) => {
		r = table.rows[i + 1];
		j = 0;
		k = el.name;
		if (n == 0) {
			k = checkboxWithTextVAligned(i, k, false)
		}
		r.cells[j++].innerHTML = k;
		r.cells[j++].innerHTML = el.d.length;
		for (l = 0; l < gm && l < el.d.length; l++) {
			e = el.d[l]
			k = e[gpid[n]];
			if (k === Infinity) {
				k = '+&infin;'
			}
			else if (typeof k == "number" && k >= 1000) {
				k = formatString(k);
			}
			r.cells[j++].innerHTML = k + " " + idReference(e['id'], e['date'])
		}

		for (; j < r.cells.length;) {//clear recent cells
			r.cells[j++].innerHTML = ''
		}
	});
}

function ggraph() {
	table = el('gt0');

	if ((j = createGraphCheckArray(gz.length)) === false) {
		return
	}

	/* 	Note if select some goods for graphs and then reorder by one of the tables 
		(any except first) r/kgLiter, r/gProtein, r/mcgB12 then order became invalid
		so find valid indexes
	*/
	i = []
	j.forEach(e => {
		v = el('gt0').rows[e + 1].cells[0].innerHTML;
		r = v.match(/<span>([^<]+)/)
		i.push(gz.findIndex(e => e.name == r[1]));
	});
	j = i

	for (n = 0; n < gpid.length - 2; n++) {
		el("dc" + n).style.display = 'block';

		o = []
		j.forEach((e, k) => {
			o1 = createGraphO1(gz[e].name, k)
			gz[e].d.forEach(k => {
				o1.data.push({ x: k.date, y: k[gpid[n]] });
			});
			o.push(o1);
		});
		createGraphJM(n, o, getLanguageString('roubles') + ' / '
			+ getLanguageString(["1000 kilocalories", "kilogram", "gram of protein", "microgram of B12"][n])
		)
	}
}

function createGraphJM(n, o, title) {
	return createGraph(n, o, title, 'line', typeof gType == 'undefined' ? 'YYYY-MM-DD' : 'YYYY-MM')
}

function createGraphCheckArray(len) {
	j = []
	for (i = 0; i < len; i++) {
		if (el('c' + i).checked) {
			j.push(i);
		}
	}
	if (j.length == 0) {
		showDialogId('no data selected for graphs');
		return false;
	}
	return j;
}

//sort function
function gsort(n, c, o, d) {
	/*
	n - gpid number
	c - column number
	o - order type
	d - 0-normal, 1-by date
	*/
	let k = d == 1 ? 'daten' : gpid[n]
	gz.sort((a, b) => {
		if (c == 0) {
			v = a.name.localeCompare(b.name);
		}
		else {
			if (c == 1) {
				x = a.d.length;
				y = b.d.length;
			}
			else {
				x = a.d[c - 2];
				y = b.d[c - 2];
				if (x === undefined) {
					return 1;
				}
				if (y === undefined) {
					return -1;
				}
				x = x[k];
				y = y[k];
			}
			v = x - y;
		}
		if (o) {
			v = -v;
		}
		return v;
	});
	gcfill(n)
}
//===== END goods statistics functions =====

//===== BEGIN equivalent functions =====
function eload() {
	el('p').innerHTML = getLanguageString(3);

	a = ['name', 'kcal/100g', 'mass loss', 'roubles / 1000 kilocalories<br>with mass loss for all rows', ''
		, 'mass<br>equivalent', 'price / kg<br>equivalent', ''];
	table = el('et');

	for (i = 0; i < edata.length; i++) {
		r = table.insertRow(-1);
		for (j = 0; j < a.length; j++) {
			r.insertCell(-1);
		}
	}

	//AFTER table.insertRow & insertCell otherwise all rows of table will be inside thead tag
	s = '<tr>'
	a.forEach((e, i) => {
		n = 0;
		if (i == 3) {
			e = getLanguageString('roubles / 1000 kilocalories') + '<br>' + getLanguageString('with mass loss')
		}
		else if (i == 4) {
			e = getLanguageString('kilocalories') + ' / ' + getLanguageString('kg') + '<br>' + getLanguageString('with mass loss')
		}
		else if (i == a.length - 1) {
			e = '<span style="font-size:12px">' + getLanguageString('last price') + '/(' + getLanguageString('price') + '/' + getLanguageString('kg') + ')<sub>'
				+ getLanguageString('equivalent') + '</sub></span><br>' + getLanguageString('less is better')
		}
		else {
			n = 1
		}
		s += sortColumn(1, e, esort, 0, i, 1, n);
	});
	s += '<tr>'
	edata0.forEach((e, j) => {
		k = e;
		if (j == 0) {
			k = getLanguageString('user goods') + efci(e.includes('=') ? e : meval(e));
		}
		else if (j == 3 || j == 4) {
			k = meval(k) + '=' + k
		}
		s += '<td>' + k
	});
	table.tHead.innerHTML = s;

	efill();

}

function efci(s) {
	return ' <font color=indigo>' + s + getLanguageString('r<sub>kg</sub>') + '</font>'
}

//sort function
function esort(dummy, i, o) {
	edata.sort((a, b) => {
		if (i == 0) {
			v = a[i].localeCompare(b[i]);
		}
		else {
			v = a[i] - b[i];
		}
		if (o) {
			v = -v;
		}
		return v;

	});
	efill();
}

function efill() {
	edata.forEach((e, i) => {
		r = table.rows[i + 2];
		for (j = 0; j < a.length; j++) {
			k = e[j];
			if (j == 3) {
				k += efci(e[a.length]) + ' ' + idReference(e[a.length + 1], e[a.length + 2])
			}
			else if (j == 4) {
				k = meval(k) + '=' + k
			}
			r.cells[j].innerHTML = k
		}
	});
}

function ggoodsChanged() {
	i = el("ggoodsSelect").selectedIndex;
	//  console.log(i,gGoodsS[i])
	document.getElementsByName("equivalent")[0].value = gGoodsS[i]
}

function eformCheck() {
	i = splitName("equivalent");
	if (![2, 3].includes(i.length)) {
		showDialogId('error invalid number of arguments')
		return false;
	}

	for (j = 0; j < i.length; j++) {
		if (j == 0) {
			try {
				k = i[j];
				//eval(123*j) - valid because j - is defined so allow only digits and .+-/*
				if (k.match(/^[0-9\.\*\+\/-]+$/) == null) {
					throw 0;
				}
				if (eval(k) <= 0) {
					showDialogId('error invalid price/mass_kg should be >0')
					return false;
				}
			}
			catch (e) {
				showDialogId('error argument # is not a formula', j + 1)
				return false;
			}
		}
		else if (isNaN(i[j])) {//do not allow "363dd 0.4"
			showDialogId('error argument # is not a number', j + 1)
			return false;
		}
	}
	if (i[1] <= 0) {
		showDialogId('error invalid calorie should be >0')
		return false;
	}
	if (i[2] < 0 || i[2] >= 1) {
		showDialogId('error invalid mass loss should be >=0 & <1')
		return false;
	}
	return true;
}
//===== END equivalent functions =====

//===== BEGIN calorie statistics functions =====
function csFill() {
	v = el('months').value;
	f = gCalendarFrom.getDateFormat('%F');
	t = gCalendarTo.getDateFormat('%F');
	a = parseInt(f.replace(/-/g, ''));
	b = parseInt(t.replace(/-/g, ''));
	if (a > b) {
		showDialogId('error DATE FROM should be before DATE TO');
		return false;
	}
	el('dateFrom').value = f;
	el('dateTo').value = t;
	return true;
}
//===== END calorie statistics functions =====

function showIdCheck() {
	i = splitName("id");
	for (j = 0; j < i.length; j++) {
		if (isNaN(i[j])) {//only numbers are allowed
			showDialogId('error argument # is not a number', j + 1)
			return false;
		}
	}
	return true;
}

function splitName(name) {
	return document.getElementsByName(name)[0].value.trim().split(/\s+/);
}

function showDialogId(s, titleid = 'error') {
	let i = typeof titleid == 'number';
	let b = getLanguageString(s)
	if (i) {
		b = b.replace("#", titleid)
	}
	showDialog(b, i ? 'error' : titleid)
}

function showDialogE(s, line) {
	showDialog(getLanguageString('error') + line + ' ' + s);
}

function showDialog(s, titleid = 'error') {
	showModal(getLanguageString(titleid), s)
}

function ops(a) {
	return a.reduce((a, e) => a + op(e), '')
}

function op(e) {
	return '<option value="' + e + '">' + e + '</option>'
}

function subMonths(da, v) {//sub v months from da
	let d = da.getDate()
	let m = da.getMonth()//0 - jan, 1 -feb
	let y = da.getFullYear()
	let a = Math.floor(v / 12)
	if (a > 0) {
		y -= a;
		v -= a * 12
	}

	m -= v;
	if (m < 0) {
		m += 12
		y--
	}

	//30apr sub 2 months = 29feb not 30feb
	let i = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]
	if (m == 1 && ((y % 100 == 0 && y % 400 == 0) || (y % 100 != 0 && y % 4 == 0))) {
		i++;
	}
	if (i < d) {
		d = i;
	}
	return new Date(y + "-" + (m + 1) + "-" + d)
}

function goodHasAliases(name) {
	return !gd[0].every(e => e[3] != name)
}

function editCopyDeleteButtons(r) {
	let a = ['edit', 'copy']
	let ad = 1, e0 = r.cells[0].innerHTML;
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		/*if has some alias cann't be removed*/
		ad = !goodHasAliases(e0);
	}

	if (gType == gaddons_viewedit && gNonEditVariables.includes(addonShowColumnInvert(e0))) {
		ad = 0
	}

	if (ad) {
		a.push('delete')
	}
	return '<span class="nb">' + a.map(e => btn("ctClick(this,'" + e + "')", e + '16')).join(' ') + '</span>';
}

/*o=0 only fill
o=1 add rows/colums and fill table
o=2 clear table then add rows/colums and fill table
*/
//create=true add rows/colums and fill table. if create=false only fill table
function ctfill(table, o) {
	let i = 0, j, c, r, filter, v, rf, ef, columns;
	let t = el('t' + table).tBodies[0];

	c = el('filter')
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		try {
			r = c.value
			if (el('cfilter').checked) {
				r = r.replaceAll('\\', '|')
			}
			filter = new RegExp(r, 'iu')
			c.style.color = 'black';
			el('ctout').innerHTML = '';
		}
		catch (e) {
			filter = new RegExp('', 'iu');//every string match
			c.style.color = 'red';
			el('ctout').innerHTML = e;
		}
		j = filter.flags
		if (j.indexOf('g') == -1) {
			j += 'g'
		}
		rf = new RegExp(filter.source, j)
		ef = filter.source == "(?:)"
	}

	if (o == 2) {
		//clear table
		t.innerHTML = "";
	}

	//Note gn[table].length not always = data.length, because sometimes needs to add some fields for sorting
	columns = gn[table].length
	const fi = gn[0].indexOf('food')
	gd[table].forEach(e => {
		if (![ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)
			|| filter.test(e[0]) && (c == null || !el('ffilter').checked || e[fi])) {
			r = o ? t.insertRow(-1) : t.rows[i++];
			for (j = 0; j < columns; j++) {
				c = o ? r.insertCell(-1) : r.cells[j];
				v = formatter(e[j], table, j)
				if (!ef && [ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType) && j == 0) {
					v = v.replace(rf, '<span style="background: #01F9C6;">$&</span>')
				}
				c.innerHTML = v
			}
			if (gAdmin && o && gType != gcategories_statistics && gType != gMS_TYPE) {
				c = o ? r.insertCell(-1) : r.cells[j];
				c.innerHTML = editCopyDeleteButtons(r);
			}
		}
	})

	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		cUpdateTableInfo()
	}
}

//c - column, o - order
function ctsort(table, c, o) {
	ctCancelEdit()

	//console.log(gType==gMS_TYPE,table,c)
	if (gType == gMS_TYPE && table == 0) {
		c += gn[table].length
	}
	//console.log(c,gType)
	bo = [ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType) && c == 8 //default mass some fields are Number some ''
	n = typeof gd[table][0][c] == 'number' || bo;
	gd[table].sort((a, b) => {
		x = a[c]
		y = b[c]
		if (bo) {
			x = Number(x)
			y = Number(y)
		}
		v = n ? x - y : x.localeCompare(y)
		return o ? -v : v
	});

	ctfill(table, [ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType) ? 2 : 0);
}

function formatter(e, table, column) {
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		if (column == 14) {
			return proceedUrls(e.toString().replaceAll(/\n/g, "<br>"), 2)
		}
	}
	else if (gType == gaddons_viewedit && column == 0) {
		return addonShowColumn(e)
	}
	else if (gType == gMS_TYPE) {
		if (table == 0) {
			if (e == '0 (0)') {
				return '-'
			}
			if (column == 0) {
				return ctZeroMonthStatistics() ? '' : date3(e)
			}
			if (column == 1 || column == 2) {
				return '<b>' + e
			}
		}
		else {
			if (column != 0) {
				//always 0 at the end for alignment
				let a = formatString(e.toFixed(1))
				if (table == 1 && column == 3) {
					a += '%'
				}
				return a
			}
		}
	}
	return e
}

function ctZeroMonthStatistics() {
	return gP[0] == 0;//gP[0]=0 statistics for 0 month, if just registered user
}

//for goods_viewedit, categories_statistics, categories_viewedit, money_statistics.
function ctload(type) {
	gType = type;
	j = [ggoods_viewedit, ggoods_viewedit_foodonly].indexOf(gType)
	if (j != -1) {
		s = "<input type='text' id='filter' oninput='ctfill(0,2)'>"
		for (i = 0; i < 2; i++) {
			s += "<label style='vertical-align: middle;'><input type='checkbox' id='" + ['cfilter', 'ffilter'][i]
				+ "'" + (i == 0 || i == 1 && j == 1 ? " checked" : "")
				+ " onclick='ctfill(0,2)' style='vertical-align: middle;'>"
				+ getLanguageString(['\\ is replaced by |', 'only food'][i])
				+ '</label>'
		}
		el('sfilter').innerHTML = s
		el('filter').placeholder = getLanguageString('filter') + ' ' + getLanguageString('regular expression') + ' ' + '\\p{L}'
	}

	if ([ggoods_viewedit, ggoods_viewedit_foodonly, gcategories_viewedit].includes(gType)) {
		el('p0').innerHTML = getLanguageString(gType == gcategories_viewedit ? 9 : 7)
		if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
			el('p0').style.maxWidth = '100%'
		}
	}
	if (gType == gMS_TYPE) {
		if (ctZeroMonthStatistics()) {
			el('p0').innerHTML = getLanguageString('Summary tables.')
		}
		else {
			el('pb').innerHTML = divGraph(0) + drawGraphsUncheckAllButtons(ctgraphs, true);
			el('p0').innerHTML = getLanguageString('Summary tables for the period') + ' ' + date3(gP[1]) + ' - ' + date3(gP[2]) + '. '
				+ getLanguageStringUF('months') + ' ' + gP[0] + ', ' + getLanguageString('current one is excluded') + '.'
		}
		el('p1').innerHTML = getLanguageString('Different options.')
		el('p2').innerHTML = getLanguageString('Summary table group by type.')
	}

	if (gAdmin && gType != gcategories_statistics && gType != gMS_TYPE) {
		el('pt').innerHTML = ' ' + btn("ctClick(this,'plus')", 'plus', undefined, 'plusMinus');
	}

	for (i = 0; i < (gType == gMS_TYPE ? 3 : 1); i++) {
		d = gd[i]
		n = gn[i]
		//add sorting columns
		avg = []
		if (gType == gMS_TYPE) {
			if (i == 0) {
				for (j = 0; j < n.length - 1; j++) {
					avg.push(0)
				}
				d.forEach((e, i) => {
					da = new Date(e[0]);
					a = [e[0]]
					b = [da.getFullYear() * 100 + da.getMonth()]
					for (j = 1; j < e.length; j++) {
						s = e[j]
						k = parseFloat(s)
						a.push(formatString(k) + " " + s.substr(s.indexOf('(')))
						b.push(k)
						avg[j - 1] += k
					}
					d[i] = a.concat(b)
				});
			}
			else if (i == 1) {
				d.forEach((e, i) => {
					d[i][0] = getLanguageString(e[0])
				})
			}
		}

		ctfill(i, 1)

		s = ''
		n.forEach((e, j) => {
			if (gType == gaddons_viewedit && j == 1) {
				v = getLanguageString(e)
				s += '<th><b>' + v + '<b>';
			}
			else {
				en = 1
				if (gType == gMS_TYPE) {
					if (i == 0 && j >= 3) {
						// 'ашан', 'пятерочка'
						en = 0
					}
				}
				checkbox = i == 0 && j != 0 && gType == gMS_TYPE && !ctZeroMonthStatistics()
				smallfont = [ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType) || i == 0 && gType == gMS_TYPE
				s += sortColumn(true, e, ctsort, i, j, 0, en, smallfont, false, checkbox);
			}
		})
		if (gType == gMS_TYPE && i == 0) {
			s += avg.reduce((a, e) =>
				a + '<th>' + formatNumber(e / d.length, 1)
				, '<tr><th><b>' + getLanguageString('average'))
		}
		if (gAdmin && gType != gcategories_statistics && gType != gMS_TYPE) {
			s += '<td>'
		}
		el('t' + i).tHead.innerHTML = s;
		cUpdateTableInfo()
	}
}

function ctgraphs() {
	//At first sort by date (if user did some sortining) for graph increasing by date
	ctsort(0, 0, 0)
	let columns = gn[0].length - 1

	if ((j = createGraphCheckArray(columns)) === false) {
		return
	}

	n = 0;
	el("dc" + n).style.display = 'block';
	let o = []
	j.forEach((e, k) => {
		b = gd[0]
		let name = gn[0][e + 1]
		if (e == 0 || e == 1) {
			//e==0 total checks, e==1 food
			if (e == 0) {
				name = 'total'
			}
			name = getLanguageString(name)
		}
		o1 = createGraphO1(name, k)
		for (k = 0; k < b.length; k++) {
			a = b[k]
			v = parseFloat(a[e + 1].replace(' ', ''))
			o1.data.push({ x: a[0], y: v });
		}
		o.push(o1);
	});
	createGraphJM(n, o, getLanguageString('roubles'))
}

function cUpdateTableInfo() {
	if (gType != gMS_TYPE) {
		let i, s, d
		d = gd[0]
		s = getLanguageString('total rows') + ':' + d.length
		if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
			s += ' (' + getLanguageString('with filter') + ':' + el('t0').tBodies[0].rows.length + ')'
			const fi = gn[0].indexOf('food')
			i = d.reduce((a, e) => a += parseInt(e[fi]), 0)
			s += ', ' + getLanguageString('food') + ':' + i
				+ ', ' + getLanguageString('not food') + ':' + (d.length - i)
		}
		else if (gType == gcategories_statistics) {
			i = d.reduce((a, e) => a += e[1], 0)
			s += ', ' + getLanguageString('check count') + ':' + i
		}
		el('rows').innerHTML = s
	}
}

function addDays(date, days) {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function maload() {
	t = el('t');
	const cells = 5;
	el('p').innerHTML = drawGraphsUncheckAllButtons(mag, 0) + divGraph(0)

	//because of aliases items not sortered
	gz.sort((a, b) => a[0].localeCompare(b[0]))

	gz.forEach((e, i) => {
		if (i % cells == 0) {
			r = t.insertRow(-1)
		}
		c = r.insertCell(-1);
		c.innerHTML = checkboxWithTextVAligned(i, e[0], true)
	});

	gd = [];
	d = new Date(gAddons['start_date']);
	d = addDays(d, gMAPeriod)
	for (i = 0; i < gz[0].length - 1; i++) {
		gd.push(Calendar.getDateFormat(d))
		d = addDays(d, 1)
	}
}

function mag() {
	table = el('t')
	if ((j = createGraphCheckArray(gz.length)) === false) {
		return
	}

	n = 0;
	el("dc" + n).style.display = 'block';
	let o = []
	j.forEach((e, k) => {
		b = gz[e]
		o1 = createGraphO1(b[0], k)
		for (k = 0; k < b.length; k++) {
			o1.data.push({ x: gd[k], y: b[k + 1] });
		}
		o.push(o1);
	});
	createGraphJM(n, o, getLanguageString('gram') + ' / ' + getLanguageString('day'))
}

function searchload() {
	el('p').innerHTML = getLanguageString(2)

	s = gn.reduce((a, e) =>
		a + '<th>' + getLanguageString(e)
		, ''
	)
	t = el('mf')
	t.tHead.innerHTML = s;

	ro = t.tBodies[0].rows;
	translateRowsErrors(ro, 1)
	for (i = 0; i < ro.length; i++) {
		r = ro[i]
		r.cells[8].innerHTML = df(r.cells[8].innerHTML, '%d %B %Y')
	}
}

function countload() {
	a = document.getElementsByTagName("table")
	s = ''
		;['string', 'quantity', 'date', 'identifier'].forEach(e => s += '<th>' + getLanguageString(e))
	for (t of a) {
		t.tHead.innerHTML = s

		ro = t.tBodies[0].rows;
		translateRowsErrors(ro, 0)
	}
}

//gload + maload + ctload
function drawGraphsUncheckAllButtons(fn, o) {
	let a = [typeof gType == 'undefined' ? 'draw graphs for selected items' : 'draw graphs for selected categories'
		, 'uncheck all', 'hide graphs']
	let f = [fn.name, 'uncheckall', 'ghidegraphs']
	let i;
	let s = '';
	for (i = 0; i < (o ? 3 : 2); i++) {
		s += "<button onclick='" + f[i] + "()' style='margin-left:10px'>" + getLanguageString(a[i]) + "</button>"
	}
	return s
}

function uncheckall() {
	for (i = 0; i < (typeof gType == 'undefined' ? gz.length : gn[0].length - 1); i++) {
		el('c' + i).checked = false
	}
}

function popupClose() {
	closeModal()
	gMessage = 1;
}

function upFirst(s) {
	return s.substr(0, 1).toUpperCase() + s.substr(1)
}

function getLanguageStringUF(s) {
	return upFirst(getLanguageString(s))
}

//2021-03 -> mar 2021
function date3(s) {
	return new Date(2021, s.substr(5) - 1).toLocaleDateString(gLanguage == 'russian' ? 'ru-RU' : 'en-EN', { month: 'long' }).substr(0, 3) + ' ' + s.substr(0, 4)
}

function fontRed(a) {
	return font(a, 'red');
}

function font(a, c) {
	return "<font style='color:" + c + ";'>" + a + "</font>";
}

function df(s, f) {
	let d = s == '' ? new Date() : new Date(s);
	return Calendar.getDateFormat(d, f, gLanguage == 'russian')
}

function changeLanguage() {
	gLanguage = (gLanguage == 'russian' ? 'english' : 'russian')
	setCookie('language', gLanguage, 30);
	el('t0').innerHTML = ""
	load(true);
}

function translateErrors(s) {
	let m, r = '', i = 0, re = /\x01[^\x01]+\x01/g;
	while (m = re.exec(s)) {
		r += s.substring(i, m.index)
		//remove \x01, so +1 & -1
		r += getLanguageString(s.substring(m.index + 1, re.lastIndex - 1))
		i = re.lastIndex
	}
	return r + s.substring(i);
}

function translateRowsErrors(ro, n) {
	for (let i = 0; i < ro.length; i++) {
		let r = ro[i].cells[n]
		r.innerHTML = translateErrors(r.innerHTML)
	}
}

function formbutton(submit, buttonText, innertext, formid) {
	let o = {
		tag: 'form',
		action: 'jm.php',
		method: 'post',
		style: 'display:inline;',
		innertext
	}
	if (formid) {
		o.id = formid
	}
	if (submit) {
		o.onsubmit = 'return ' + submit + '()'
	}
	return tag(o) + tag({
		tag: 'button',
		type: 'submit',
		form: formid,
		innertext: getLanguageString(buttonText)
	}) + ' ';//need space after
}

function btn(f, s, id, imgid) {
	let im = tag({
		tag: 'img',
		id: imgid,
		src: s === undefined ? s : getImageString(s)
	});
	return tag({
		tag: 'button',
		id,
		onclick: typeof f == 'function' ? f.name + '()' : f,
		innertext: im
	})
}

function tag(o) {
	let s = '<' + o.tag
	for (const [key, value] of Object.entries(o)) {
		if (!['tag', 'innertext'].includes(key) && value !== undefined) {
			s += ' ' + key + '="' + value + '"'
		}
	}
	s += '>';
	if (o.innertext !== undefined) {
		s += o.innertext
	}
	if (o.tag == 'button') {
		s += '</' + o.tag + '>'
	}
	return s
}

function ctCancelEdit() {
	//simulate click on cancel button if has edit row
	let b = el('delete16');
	if (b) {
		b.click();
	}
	return b;
}

function confirmId(id, f, a) {
	gf = f;
	ga = a;
	if (id instanceof Array) {
		s = getLanguageString(id[0]) + '<br><br>' + btn('cc(0,\'' + id[1] + '\')', 'ok') + ' ' + btn('cc(1,\'' + id[1] + '\')', 'delete')
	}
	else {
		s = getLanguageString(id) + '<br><br>' + btn('cc(0)', 'ok') + ' ' + btn('cc(1)', 'delete')
	}
	showDialog(s, 'message')
}

function cc(v, id) {
	popupClose();//gMessage changes here
	if (v == 0) {
		if (id) {
			confirmId(id, gf, ga)
		}
		else {
			gMessage = 0;
			gf.apply(null, ga);
			gMessage = 1;
		}

	}
}

function ctClick(e, s) {
	b = ctCancelEdit()
	if (s == 'plus' && b) {
		return
	}

	if (s == 'delete') {
		if (gMessage && addon('show_delete_warning')) {
			confirmId('Do you really want to delete record?', ctClick, arguments)
			return
		}

		r = getRow(e)
		i = getGDIndex(r)
		o = gd[0][i]
		gEditable = { command: s, row: r, o: o, table: gType, where: o[0], gdi: i }
		ctfetch(gEditable)
		return
	}
	//s=='edit' || s=='copy' || s=='plus'
	if (s == 'plus') {
		r = 1
		if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
			o = [gDefaultGoodName, gNullString, gNullString, gNullString, 0, 0, 0, 0, 0, 1, 0
				//fiber,food, check, animal protein, saturated fat, comment
				, 0, 1, 2, 0, 0, gNullString]
		}
		else if (gType == gaddons_viewedit) {
			o = ["", ""]
		}
		else {//2
			o = gDefaultCategory;
		}
		i = 0;
	}
	else {
		r = getRow(e)
		i = getGDIndex(r)
		o = gd[0][i]
	}
	gEditable = { command: s, row: r, o, gdi: i }
	if (s != 'edit') {
		getTable().insertRow(r)
	}
	ctCreateTR(gEditable)
	setPlusMinusImage()
}

function ctClick1(e) {
	s = gEditable.command;
	if (e.id == 'delete16') {
		if (s == 'edit') {
			ctFixRow(false);
		}
		else {
			ctDeleteRow(false)
		}
		setPlusMinusImage()
		return;
	}

	//save
	a = ctCreateEditObject()
	a.command = s == 'edit' ? 'update' : 'insert';
	a.table = gType;
	if (a.command != 'insert') {
		a.where = o[0]
	}
	a[gn[0].length] = Calendar.getDateFormat(new Date())
	ctfetch(a);
}

function ctFixRow(fromEdit) {
	let table = getTable();
	let r = gEditable.row
	let gdi = gEditable.gdi;
	o = fromEdit ? ctCreateEditObject(true) : gd[0][gdi]

	o.forEach((e, i) => {
		table.rows[r].cells[i].innerHTML = formatter(e, 0, i)
	})
	table.rows[r].cells[o.length].innerHTML = editCopyDeleteButtons(table.rows[r])

	if (fromEdit) {
		if (gEditable.command == 'edit') {
			gd[0][gdi] = o;
		}
		else {
			gd[0].splice(gdi, 0, o);//insert & gdi
		}
		cUpdateTableInfo()
	}
}

function ctDeleteRow(withData) {
	let table = getTable();
	let r = gEditable.row
	table.deleteRow(r);
	if (withData) {
		gd[0].splice(gEditable.gdi, 1);//delete from array by index
		cUpdateTableInfo()
	}
}

function ctgetValue(id) {
	let e = el(id)
	let j = e.tagName
	if (j == 'SPAN') {
		j = e.innerHTML
	}
	else if (j == 'INPUT') {
		if (e.type == 'text') {
			j = e.value
		}
		else if (e.type == 'checkbox') {
			j = e.checked ? 1 : 0
		}
		else {
			console.log(e.type)
			throw 0;
		}
	}
	else if (j == 'SELECT') {
		// if(e.selectedIndex==-1){
		// 	j=""
		// }
		// else{
		// }
		j = e.options[e.selectedIndex].value;
	}
	else if (j == 'TEXTAREA') {
		j = e.value
	}
	else {
		console.log(j)
		throw 0;
	}
	if (gType == gaddons_viewedit && id == 'e0') {
		j = addonShowColumnInvert(j);
	}
	return j;
}

function ctCreateEditObject(array = false) {
	let i, j, a = [];
	for (i = 0; i < gn[0].length; i++) {
		a.push(ctgetValue('e' + i))
	}

	if (a[0] == 'start_date' && gType == gaddons_viewedit) {
		//correct date, month and day should have two digits
		i = a[1];
		j = i.split('-');
		if (j.length == 3) {//if user add new entiry and enter manually on name start_date then length can be !=3
			for (k = 1; k < 3; k++) {
				if (j[k].length < 2) {
					j[k] = '0' + j[k]
				}
			}
			a[1] = j.join('-')
		}
	}

	if (array) {
		return a
	}
	else {
		return { ...a }
	}
}

function ctfetch(a) {
	fetchpost('jm.php', a, ctCallback);
}

function ctCallback(a) {
	let s, table
	if (typeof a != 'string') {
		a = a.message
	}
	if (!a.startsWith('OK')) {
		if (a.startsWith(String.fromCharCode(1))) {
			a = translateErrors(a)
		}
		showDialogE(a, 2929);
		return;
	}
	c = gEditable.command


	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		a = [String(gEditable.o[3])];//old alias
	}

	if (c == 'delete') {
		ctDeleteRow(true)
	}
	else {
		if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
			a.push(String(ctgetValue('e3')));//new alias
		}
		ctFixRow(true)
	}

	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		//update row with aliases
		table = getTable();
		gd[0].forEach(e => {
			s = String(e[0]);
			//[1].includes("1") = false, so always compare strings
			if (a.includes(s)) {
				r = getTableRow(s);
				if (r != -1) {//if row is visible
					table.rows[r].cells[o.length].innerHTML = editCopyDeleteButtons(table.rows[r])
				}
			}
		})
	}

	setPlusMinusImage()
}

function ctUpdateSave() {
	a = ctgetValue('e0')
	//cann't be empty & start or end on \s symbol
	if (a.length == 0 || /^\s+|\s+$/.test(a)) {
		enable = 0
	}
	else {
		enable = 1;
		if (gEditable.command == 'edit') {
			//if select globus then value can be globus but cann't equal other values internet, electricity etc.
			o = gEditable.o
			skip = o[0]
			b = ctCreateEditObject(1)
			for (i = 0; i < b.length; i++) {
				if (b[i] != o[i]) {
					if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType) && i == 7) {
						continue;
					}
					break;
				}
			}
			enable = i != b.length
		}
		else {
			skip = null
		}

		if (enable) {
			for (let v of gd[0]) {
				b = v[0]
				if (b == a && b != skip) {
					enable = 0;
					break;
				}
			}
		}
	}
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		if (a == gNullString) {//name = '-' is impossible because of alias
			enable = false;
		}
		j = 0;
		sv = 0
		ek = 1;
		el1 = (e, add = 0) => el('e' + (add + gn[0].indexOf(e)))
		eln = (e, add = 0) => {
			let v = el1(e, add).value;
			return v.length ? Number(v) : NaN;
		}

		for (i = 0; i < 3; i++) {
			v = eln('protein', i)
			if (isNaN(v) || v < 0 || v > 100) {
				ek = enable = false;
				break;
			}
			sv += v
			j += v * pfcCalorie[i]
		}
		if (sv > 100) {
			ek = enable = false
		}
		el1("kc/100g").innerHTML = ek ? j.toFixed(1) : "";

		v = eln('mass loss')
		if (isNaN(v) || v < 0 || v >= 1) {
			enable = false;
		}

		v = eln('density')
		if (isNaN(v) || v <= 0) {
			enable = false;
		}

		v = eln('b12')
		if (isNaN(v) || v < 0) {
			enable = false;
		}

		v = eln('fiber')
		if (isNaN(v) || v < 0 || v > 100) {
			enable = false;
		}

		v = eln('has check')
		if (isNaN(v) || !Number.isInteger(v) || v < 0 || v > 2) {
			enable = false;
		}

		//animal protein, saturated fat
		for (i = 0; i < 2; i++) {
			v = eln('animal protein', i)
			if (isNaN(v) || v < 0 || v > 1) {
				enable = false;
			}
		}

	}

	if (gType == gaddons_viewedit && enable) {
		t = ctgetValue('e0')
		v = ctgetValue('e1')
		if (v.length == 0) {//Number('')=0
			enable = false;
		}
		if (t == "egg_purified_mass_grams_by_category") {
			enable = 0
			v = v.split(" ");
			pj = 0;
			if (v.length == 5) {
				for (i = v.length - 1; i >= 0; i--) {
					j = Number(v[i])
					if (isNaN(j) || j <= pj) {
						break;
					}
					pj = j;
				}
				if (i == -1) {
					enable = 1
				}
			}
		}
		else if (t == "mass") {
			v = Number(v)
			if (isNaN(v) || v < 20 || v > 500) {
				enable = false;
			}
		}
		else if (t == "show_money_rows") {
			v = Number(v)
			if (isNaN(v) || !Number.isInteger(v) || v <= 0) {
				enable = false;
			}
		}
		else if (t == "skip_row" || t == "sum_eq") {
			if (/^\s+|\s+$/.test(v)) {
				enable = 0
			}
		}
		else if (t == "start_date") {
			enable = 0
			v = v.split("-");
			if (v.length == 3) {
				a = []
				for (i = 0; i < 3; i++) {
					j = Number(v[i])
					if (isNaN(j) || j <= 0 || !Number.isInteger(j)) {
						break;
					}
					a.push(j)
				}
				if (i == 3 && a[0] > 2016 && a[1] >= 1 && a[1] <= 12) {
					d = new Date(a[0] + '-' + a[1] + '-1')
					j = Calendar.getDaysInMonth(d)
					enable = a[2] <= j
				}
			}
		}

	}

	el('isave16').src = getImageString('save' + (enable ? '' : 'disabled') + '16')
	el('save16').disabled = !enable
}

function ctCreateTR(p) {
	o = p.o;
	j = ''
	for (i = 0; i < 3; i++) {
		j += '<option' + (i == o[1] ? ' selected' : '') + '>' + i + '</option>'
	}
	//make ids save16, delete16 not save & delete needs for css
	f = (a) => btn("ctClick1(this)", a, a, 'i' + a)
	f1 = (i, o) => {
		let column = gn[0][i]
		let b = ['protein', 'fat', 'carbohydrate'].includes(column)
		return '<input type="text" id="e' + i + '" value="' + o + '" style="width:' + (i == 0 ? 85 : 30)
			+ `px" oninput="ctUpdateSave()"${b ? ' onpaste="pastePFC(event)"' : ''}>`
	}
	s = '<td>' + f('save16') + ' ' + f('delete16') + ' '

	if (gType == gaddons_viewedit && (p.command == 'edit' || p.command == 'copy') && gNonEditVariables.includes(o[0])) {
		i = addonShowColumn(o[0])
		if (p.command == 'edit') {
			s += '<span id=e0>' + i + '</span>'
		}
		else {
			s += '<input type="text" id=e0 value="' + i + '" oninput="ctUpdateSave()">'
		}
	}
	else {
		if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
			i = 0
			//11may23 if p.command=='copy' can be edible 
			if (o[i] != gDefaultGoodName && p.command == 'edit' && goodHasAliases(o[i])) {
				s += '<span id="e' + i + '">' + o[i] + '</span>'
			}
			else {
				s += f1(i, o[i])
			}
		}
		else {
			s += '<input type="text" id=e0 value="' + o[0] + '" oninput="ctUpdateSave()">'
		}
	}
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {
		for (i = 1; i < o.length; i++) {
			column = gn[0][i]
			s += '<td>'
			if ('kc/100g' == column) {
				s += '<span id="e' + i + '"></span>'
			}
			else if ('alias' === column) {
				d = gd[0]
				j = op(gNullString);
				for (k = 0; k < d.length; k++) {
					v = d[k][0];
					//for copy command name will be changed so alias can be on any name
					if (v != o[0] || p.command == 'copy') {//exclude alias to itself
						j += op(v)
					}
				}
				s += '<select class="selectalias" id="e' + i + '" onchange="ctUpdateSave()">' + j + '</select>'
			}
			else if ('food' === column) {
				s += '<input id=e' + i + ' type="checkbox"' + (o[i] ? ' checked' : '') + ' onclick="ctUpdateSave()">'
			}
			else if ('comment' == column) {
				s += '<textarea id="e' + i + '" oninput="ctUpdateSave()" style="width:100%;height:100px;"></textarea>'
			}
			else {
				s += f1(i, o[i])
			}
		}

	}
	else if (gType == gaddons_viewedit) {
		s += '<td>'
		i = 1;
		if (['show_delete_warning', 'show_delete_button_for_money_table'].includes(o[0])) {
			s += '<input id=e' + i + ' type="checkbox"' + (o[i] ? ' checked' : '') + ' onclick="ctUpdateSave()">'
		}
		else {
			s += '<input type="text" id=e1 value="' + o[1] + '" oninput="ctUpdateSave()">'
		}
	}
	else {
		s += '<td><select id=e1 onchange="ctUpdateSave()">' + j + '</select>'
			+ '<td><input id=e2 type="checkbox"' + (o[2] ? ' checked' : '') + ' onclick="ctUpdateSave()">'
			+ '<td><input type="text" id=e3 value="' + o[3] + '" oninput="ctUpdateSave()">'
	}

	getTable().rows[p.row].innerHTML = s + '<td>'
	if ([ggoods_viewedit, ggoods_viewedit_foodonly].includes(gType)) {//set textarea text
		i = o.length - 1
		el('e' + i).value = o[i];

		//alias
		el('e3').value = o[3];
	}
	ctUpdateSave()
}

function reorderIds() {
	fetchpost('jm.php?reorderIds', null, reorderIdsCallback);
}

function reorderIdsCallback(a) {
	if (typeof a != 'string') {
		a = a.message
	}
	if (!a.startsWith('OK')) {
		showDialogE(a, 3173);
		return;
	}
	else {
		refresh()
	}
}

function loginClick() {
	user = el('user').value
	password = el('password').value
	rememberme = el('rememberme').checked;
	o = { user, password, rememberme }
	fetchpost('jm.php', o, lsClickCallback);
}

function lsClickCallback(s) {
	if (s == 'OK') {
		location.href = 'jm.php'
	}
	else {
		el('o').innerHTML = fontRed(getLanguageString(s));
	}
}

function signupClick() {
	email = el('email').value
	user = el('user').value
	password = el('password').value
	rpassword = el('password_repeat').value;
	rememberme = el('rememberme').checked;

	if (password != rpassword) {
		lsClickCallback('password and repeat password should be the same')
	}
	else if (!/^[\w \-а-яА-ЯёЁ]+$/.test(user)) {
		lsClickCallback('an invalid character in the username was found')
	}
	else if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
		lsClickCallback('invalid email')
	}
	else {
		o = { user, password, email, rememberme }
		fetchpost('jm.php', o, lsClickCallback);
	}
}

function login() {
	s = '<div class="container">'
		+ '    <label><b>' + getLanguageStringUF('name') + '</b></label>'
		+ '    <input class="login" type="text" placeholder="' + getLanguageString('name') + '" id="user" required>'
		+ '    <label><b>' + getLanguageStringUF('password') + '</b></label>'
		+ '    <input class="login" type="password" placeholder="' + getLanguageString('password') + '" id="password" required>'
		+ '    <span id="o"></span>'
		+ '    <button class="login" onclick="loginClick()">' + getLanguageStringUF('login') + '</button>'
		+ wrapInputVAligned('<input class="login" type="checkbox" checked="checked" id="rememberme"> ' + getLanguageString('remember me'))
		// +'    <label>'
		// +'      <input class="login" type="checkbox" checked="checked" id="rememberme"> '+getLanguageStringUF('remember me')
		// +'    </label>'
		+ '  </div>'
		+ '  <div class="container">'
		+ '    <button class="cancelbtn" onclick="popupClose()">' + getLanguageStringUF('cancel') + '</button>'
		+ '    <span class="psw">' + getLanguageStringUF('forgot') + ' <a href="#">' + getLanguageString('password') + '?</a></span>'
		+ '  </div>'
	showDialog(s, 'message')
}

function signup() {
	s = '  <div class="container">'
		+ '    <h1 style="margin-top:0">' + getLanguageStringUF('sign up') + '</h1>'
		+ '    <p>' + getLanguageStringUF('Please fill in this form to create an user.') + '</p>'
		+ '    <hr>'
		+ '    <label><b>' + getLanguageStringUF('name') + '</b></label>'
		+ '    <input class="login" type="text" id="user" placeholder="' + getLanguageString('name') + '" required>'
		+ '    <label><b>' + getLanguageStringUF('password') + '</b></label>'
		+ '    <input class="login" type="password" placeholder="' + getLanguageString('password') + '" id="password" required>'
		+ '    <label><b>' + getLanguageStringUF('repeat password') + '</b></label>'
		+ '    <input class="login" type="password" placeholder="' + getLanguageString('repeat password') + '" id="password_repeat" required>'
		+ '    <label><b>' + getLanguageStringUF('email') + '</b></label>'
		+ '    <input class="login" type="text" id="email" placeholder="' + getLanguageString('email') + '" required>'
		+ wrapInputVAligned('<input type="checkbox" checked="checked" id="rememberme"> ' + getLanguageString('remember me'))
		// +'    <label>'
		// +'      <input type="checkbox" checked="checked" id="rememberme" style="margin-bottom:15px"> '+getLanguageStringUF('remember me')
		// +'    </label>'
		//+'    <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>'
		+ '<br><span id="o"></span>'
		+ '<div>'
		+ '<button class="cancelbtn" onclick="popupClose()">' + getLanguageStringUF('cancel') + '</button>'
		+ ' <button class="signupbtn" onclick="signupClick()">' + getLanguageStringUF('sign up') + '</button>'
		+ '</div'
		+ '  </div>'
	showDialog(s, 'message')
}

function logout() {
	location.href = 'jm.php?logout'
}

function manage_users() {
	s = '';
	gUsers.forEach((e, i) => {
		//Note use checkboxWithTextVAligned or wrapInputVAligned is better for charactes  (if username='slo') but worse for digits (if username='1')
		//s+=checkboxWithTextVAligned(i,e,true);
		//s+=wrapInputVAligned('<input type="checkbox" checked="checked" id="e'+i+'"> '+e)
		s += wrapLabel('<input type="checkbox" checked="checked" id="e' + i + '"> ' + e) + '<br>'
	})
	s += '<br>' + tag({ tag: 'button', onclick: "manageUsersClick()", innertext: getLanguageString('delete') }) + ' '
		+ tag({ tag: 'button', onclick: "enterasClick()", innertext: getLanguageString('enter as user') })
	showDialog(s, 'message')
}

function enterasClick() {
	//as first selected user
	for (i = 0; i < gUsers.length; i++) {
		if (el('e' + i).checked) {
			popupClose();
			//post and redirect		
			redirectPost('jm.php', { loginas: gUsers[i] })
			break;
		}
	}
}

function manageUsersClick() {
	o = { deleteusers: 1 };
	gUsers.forEach((e, i) => {
		if (el('e' + i).checked) {
			o[e] = 1;
		}
	})
	popupClose();
	fetchpost('jm.php', o, manageUsersClickCallback);
}

function manageUsersClickCallback(s) {
	alert(s)
	//after alert
	refresh();
}

function addon(s) {
	//Note. if("0"){goes here}
	return gAddons[s] == "1";
}

function arrayTwoAnother(a, b, s) {
	let i = a.indexOf(s)
	return i == -1 ? s : b[i];
}

function addonShowColumn(s) {
	return arrayTwoAnother(gNonEditVariables, gNonEditVariablesShow[+(gLanguage == 'russian')], s)
}

function addonShowColumnInvert(s) {
	return arrayTwoAnother(gNonEditVariablesShow[+(gLanguage == 'russian')], gNonEditVariables, s)
}

function checkboxWithTextVAligned(checkboxnumber, text, textAfterCheck = true, checked = false, fn = undefined) {
	let s = '<input type="checkbox" id="c' + checkboxnumber + '"' + (checked ? ' checked' : '') + (fn ? ' onclick="' + fn.name + '()"' : '') + '>';
	if (textAfterCheck) {
		s += text;
	}
	else {
		s = text + s;
	}
	return wrapInputVAligned(s)
}

function wrapInputVAligned(s) {
	return '<div class="checkboxes"><label><span>' + s + '</span></label></div>'
}

function test() {
	location.href = 'jm.php?test'
}

function globusCheckParse() {
	const r = /(\d+(\.\d+)?) x (\d+(\.\d+)?)/
	const rd = /(\d{2})\.(\d{2})\.(\d{2})/
	const b = [
		['сем подсол', 'семечки подсолнечника '],
		['семечки подсолн\\.', 'семечки подсолнечника '],
		['БАТОН ТРАДИЦИОН.', 'батон традиционный '],
		['хлеб украинский', 'хлеб украинский новый'],
		['крупа перловая', 'перловка'],
		['МАК ИЗД ВВ РОЖКИ 400 ', 'макароны рожки ваш выбор 400Г '],
		['\\s+л\\s', 'л '],//before шт
		['\\s+мл\\s', 'мл '],//before шт
		['\\s+г\\s', 'г '],//before шт
		['\\s+кг\\s', 'кг '],//before шт
		['(\\sшт)? ; шт.', ''],
	];
	let a = getTA().value.trim(), t = '', c, m;
	b.forEach(e => a = a.replace(new RegExp(e[0], "ig"), e[1]))
	a = a.split("\n");
	a = a.filter(e => e != "[М]");
	a.forEach((e, i) => {
		if (e.includes('КАССОВЫЙ ЧЕК') && (m = rd.exec(e))) {
			c = new Date(20 + m[3], m[2] - 1, m[1])
			// c=m.slice(1,4).reverse()
			// c[0]=20+c[0]
			// c=new Date(c.join('-'))
			gCalendar.setDate(c)
		}
		else if (m = r.exec(e)) {
			//1.71 x 59.99 => 1.710*59.99 additional zero
			c = m[2] !== undefined && m[2].length < 4 ? "0" : ""
			t += a[i - 1] + " " + m[1] + c + "*" + m[3] + "\n"
		}
	})
	//replace with /g flag = replaceAll
	t = t.replace(/[ \t]{2,}/g, ' ');
	try {
		a = Number(el('numbertype2').value)
		a = Math.min(maxInputType2, a)
		a = Math.max(0, a)
	}
	catch {
		a = defaultInputType2;
	}
	getTA().value = t.toLowerCase() + "/*" + "@\n".repeat(a)

	el('category').value = 'глобус'
	typeChanged()
	//textAreaChanged() called inside typeChanged()
}

function openAsRecipe(e) {
	let o = gData[getRow(e)]
	window.open('../index.php?calorie_recipe,,' + new URLSearchParams({ p: o.text, check: 1, addon: 1 }) + '', '_blank').focus()
}

function splitl(p) {
	return p.split(/\n/).map(e => splitlOneLine(e)).join('\n')
}

function splitlOneLine(p) {
	let s1 = '', s = '', l = 100;
	p.split(/(\s+)/).forEach(e => {
		if (e.match(/^\s+$/)) {
			return
		}
		if (s1.length + e.length > l) {
			s += s1 + "\n";
			s1 = ''
		}
		s1 += e + ' '
	})
	return s + s1;
}

function pastePFC(e) {
	// Stop data actually being pasted into div
	let s = e.clipboardData.getData('Text'), a = getPFCFromString(s)
	if (a !== null) {
		//next two lines only if text which can be parsed
		e.stopPropagation();
		e.preventDefault();
		//console.log(gn[0])
		const b = ['protein', 'fat', 'carbohydrate', 'fiber']
		a.forEach((e, i) => {
			el('e' + gn[0].indexOf(b[i])).value = e
		})
	}
	//else normal paste
	ctUpdateSave()
}