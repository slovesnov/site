function load() {
	const langMap = new Map([
		['table header', 'заголовок таблицы'],
		['2nd row', '2ая строка'],
		['abc', 'абв'],
		['column', 'колонка'],
		['summary', 'итог'],
		['one more summary', 'еще итог']
	]);

	const regex = new RegExp(`(${[...langMap.keys()].join('|')})`, 'g');

	gs.forEach((e, i) => {
		if (gLanguage == 'russian') {
			e = e.replace(regex, match => langMap.get(match))
		}
		el('c' + i, codeString(e, gsl[i]))
	});
	Prism.highlightAll();

	for (n = 0; n < 3; n++) {
		if (n == 0) {
			data = [['help.txt', 1000, 'ok'], ['table.js', 8654, 'ok'], ['table.css', 54, 'ok']]
			title = ['filename', 'size', 'status']
			options = { sort: 1, color: 1, border: 1 }
			comparator = undefined
		}
		else if (n == 1) {
			data = [['help.txt', ['1 000', 1000], 'ok'], ['table.js', ['8 654', 8654], 'ok'], ['table.css', 54, 'ok']]
			title = { up: ['filename', 'size', 'status'], down: ['total', '9 708'] }
			options = { sort: 1, color: 1, border: 1 }
			comparator = undefined
		}
		else {
			title = ['name', 'birth date', 'death date', 'age']
			data = [
				['Vera Francevna Menchik', '16-02-1906', '26-06-1944', false]
				, ['Judit Polgár', '23-07-1976', null, false]
				, ['Garry Kimovich Kasparov', '13-04-1963', null, true]
				, ['Robert James Fischer', '09-03-1943', '17-01-2008', true]
				, ['Vladimir Borisovich Kramnik', '25-06-1975', null, true]
				, ['Vasily Vasilyevich Smyslov', '21-03-1921', '27-03-2010', true]
				, ['Alexandra Konstantinovna Kosteniuk', '23-04-1984', null, false]
				, ['Lyudmila Vladimirovna Rudenko', '27-07-1904', '04-03-1986', false]
			]
			d = []
			data.forEach(e => {
				b = e[0].split(/\s+/)
				e[0] = [e[0], b[b.length - 1]]//for correct sort by surname
				live = e[2] == null
				for (i = 1; i < 3; i++) {
					d[i] = e[i] ? new Date(e[i].split('-').reverse().join('-')) : new Date()
					e[i] = [e[i] ? d[i].toLocaleDateString('en-en', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					}) : '?', d[i]]
				}
				sub = d[2].getMonth() < d[1].getMonth()
					|| d[2].getMonth() == d[1].getMonth() && d[2].getDay() <= d[1].getDay()
				e.splice(3, 0, d[2].getFullYear() - d[1].getFullYear() - sub)
				e.push(live)
				//e = [ [name,surname], [birth date as text, birth date as Date]
				//, [death date as text, death date as Date], age in year, woman(hidden), live(hidden)]
			})
			comparator = []
			comparator[0] = [undefined, undefined, '5d', '5', '4', '4d']
			options = {
				o: 'cns0', class: 't' + n, additionalSortTitle: [['live', 'woman']]
			}
		}
		el('t' + n).innerHTML = new Table(title, data, options, comparator).html()
	}

}

gsl = ["html", "js", "js", "js", "js", "js", "js", "html", "js", "html"];
gs = [`<link rel="stylesheet" type="text/css" href="https://slovesnov.rf.gd/css/table.css">
<script src="https://slovesnov.rf.gd/scripts/table.js"></script>`, `data = [['help.txt', 1000, 'ok'], ['table.js', 8654, 'ok'], ['table.css', 54, 'ok']]
title = ['filename', 'size', 'status']
options = { sort: 1, color: 1, border: 1 }
t = new Table(title, data, options);
document.getElementById('t').innerHTML = t.html()`, `data = [['help.txt', ['1 000', 1000], 'ok']
  , ['table.js', ['8 654', 8654], 'ok'], ['table.css', 54, 'ok']]
title = { up: ['filename', 'size', 'status'], down: ['total', '9 708'] }
options = { sort: 1, color: 1, border: 1 }
t = new Table(title, data, options);
document.getElementById('t').innerHTML = t.html()`, `title = [
  [["table header", 3]]
  , ["2nd row", ["abc", 2]]
  , ["column1", "column2", "column3", "column4"]
]`, `title = {
  up: [
    [["table header", 3]]
    , ["2nd row", ["abc", 2]]
    , ["column1", "column2", "column3", "column4"]
  ]
  , down: [
    ["summary1", ["summary2", 2]]
    , [["summary", 3]]
    , [["one more summary", 2], "abc", "abc"]
  ]
}`, `data = [['help.txt', 1000, 'ok']
  , ['table.js', 8654, 'ok']
  , ['table.css', 54, 'ok']]`, `data = [['help.txt', ['1 000', 1000], 'ok']
  , ['table.js', ['8 654', 8654], 'ok']
  , ['table.css', 54, 'ok']]`, `<style>
  .red {
    background-color: red;
  }

  .green {
    background-color: green;
  }
</style>
<script>
  data = [['help.txt', ['1 000', 1000], 'ok']
    , ['table.js', ['8 654', 8654], 'ok'], ['table.css', 54, 'ok']]
  data[0].class = "red"
  data[1].class = "green"
  //...
  data = [{ 0: 'help.txt', 1: ['1 000', 1000], 2: 'ok', class: 'green' }
    , { 0: 'table.js', 1: ['8 654', 8654], 2: 'ok', class: 'red' }
    , ['table.css', 54, 'ok']]
</script>`, `data = [['help.txt', ['1 000', 1000], 'ok']
  , ['table.js', ['8 654', 8654], 'ok'], ['table.css', 54, 'ok']]
title = ['filename', 'size', 'status']
options = { sort: 1, color: 1, border: 1, filter: e => e[1].v > 1024 }
t = new Table(title, data, options);
document.getElementById('t').innerHTML = t.html()`, `<!DOCTYPE html>
<meta http-equiv='Content-Type' content='text/html;charset=utf-8'>
<link rel="stylesheet" type="text/css" href="https://slovesnov.rf.gd/css/table.css">
<script src="https://slovesnov.rf.gd/scripts/table.js"></script>
<style>
  .t td:nth-child(n+3) {
    text-align: right;
  }
</style>

<script>
  function load() {
    title = ['name', 'birth date', 'death date', 'age']
    data = [
      ['Vera Francevna Menchik', '1906-02-16', '1944-06-26', false]
      , ['Judit Polgár', '1976-07-23', null, false]
      , ['Garry Kimovich Kasparov', '1963-04-13', null, true]
      , ['Robert James Fischer', '1943-03-09', '2008-01-17', true]
      , ['Vladimir Borisovich Kramnik', '1975-06-25', null, true]
      , ['Vasily Vasilyevich Smyslov', '1921-03-21', '2010-03-27', true]
      , ['Alexandra Konstantinovna Kosteniuk', '1984-04-23', null, false]
      , ['Lyudmila Vladimirovna Rudenko', '1904-07-27', '1986-03-04', false]
    ]
    d = []
    data.forEach(e => {
      b = e[0].split(/\s+/)
      e[0] = [e[0], b[b.length - 1]]//for correct sort by surname
      live = e[2] === null
      for (i = 1; i < 3; i++) {
        d[i] = e[i] ? new Date(e[i]) : new Date()
        e[i] = [e[i] ? d[i].toLocaleDateString('en-en',
          { year: 'numeric', month: 'long', day: 'numeric' }) : '?', d[i]]
      }
      sub = d[2].getMonth() < d[1].getMonth()
        || d[2].getMonth() == d[1].getMonth() && d[2].getDay() <= d[1].getDay()
      e.splice(3, 0, d[2].getFullYear() - d[1].getFullYear() - sub)//insert age
      e.push(live)
      //e = [ [name,surname], [birth date as text, birth date as Date]
      //, [death date as text, death date as Date], age in year, woman(hidden), live(hidden)]
    })
    comparator = [[]]
    comparator[0][2] = '5d'
    comparator[0][4] = '4'

    document.getElementById('p').innerHTML = new Table(title, data, {
      o: 'cns0', class: 't', additionalSortTitle: [['live', 'woman']]
    }, comparator).html()
  }


</script>
</head>

<body onload='load()'>
  <p id='p'></p>
</body>

</html>`];