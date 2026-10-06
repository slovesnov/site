function load() {
	//a = ['', '', '', '','', ''];
	c = ['жизнь', 'домен', 'царство', 'тип', 'класс', 'порядок', 'семейство', 'род', 'вид']
	ca = [
		//животные https://ru.wikipedia.org/wiki/Человек_разумный
		['', 'эукариоты', 'животные', '', '', 'отряд', '', '', '']

		//растения https://ru.wikipedia.org/wiki/Орляк_обыкновенный
		, ['', 'эукариоты', 'растения', 'отдел', '', '', '', '', '']

		//грибы https://ru.wikipedia.org/wiki/Опёнок_зимний
		, ['', 'эукариоты', 'грибы', 'отдел', '', '', '', '', '']

		//бактерии https://ru.wikipedia.org/wiki/Clostridium_botulinum
		, ['', 'бактерии', 'бактерии', '', '', '', '', '', '']
		
		//археи https://ru.wikipedia.org/wiki/Sulfolobaceae
		, ['', 'археи', 'археи', '', '', '', '', '', '']

		//вирусы https://ru.wikipedia.org/wiki/SARS-CoV-2
		, ['вирусы', 'реалм', '', '', '', '', '', '', '']
	]

	el('p').innerHTML = '<table class="s">' + c.reduce((a, e) => a + '<th>' + e, '<tr>'/* +'<th>' */)
		+ ca.map((e, i) => e.reduce((a, e, j) => a + '<td>' + wrap(e, i, j), '<tr>' /* '<th>' + a[i] */)).join('')
		+ '</table>'
}

function wrap(e, i, j) {
	if ([0,2].includes(j) || j == 1 && i != ca.length-1) {
		return e
	}
	else {
		return '<b>' + e + '</b>'
	}
}
