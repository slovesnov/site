function load() {
	b = gLanguage == 'russian'
	r = [
		'parser_cpp'
		, 'calculator'
		, 'graph'
		, 'javaPlotterCalculator'
		, 'parser'
	].map(e => 'https://github.com/slovesnov/' + e)

	a = [
		['c++', 'java', 'javascript', 'php', b ? 'история версий' : 'versions history'],

		(b ? [
			'c++ парсер'
			, ['c++/gtk3 калькулятор', ', используется библиотека <a href=\'?aslov\'>aslov</a>']
			, ['c++/gtk3 плоттер', ', используется библиотека <a href=\'?aslov\'>aslov</a>']
			, 'java парсер/калькулятор/плоттер'
			, ['javascript/php', ' парсер js, php и js калькулятор/плоттер']

		] :
			[
				'c++ parser'
				, ['c++/gtk3 calculator', ', the <a href=\'?aslov\'>aslov</a> library is used']
				, ['c++/gtk3 plotter', ', the <a href=\'?aslov\'>aslov</a> library is used']
				, 'java parser/calculator/plotter'
				, ['javascript/php', ' parser js, php and js calculator/plotter']
			]).map(e => Array.isArray(e) ? e : [e, ''])

	]

	t = b ? ['Примеры', 'Исходный код'] : ['Examples', 'Source code']
	t = t.map(e => `<table><thead><h4 style="margin:0;padding:0">${e}</h4></thead>`)

	f = (e, i, j) => j ? `<a href='${r[i]}'>${e[0]}</a>` + e[1] : `<a href="${i == 4 ? '?parser_versions' : '#'+(i ? e : 'cpp')}">${e}</a>`

	q = a.map((e, j) => gPageName == 'parser' || j ? `<td${j ? '' : ` style='padding-right: 60px;'`}>` + e.reduce((a, e, i) => a + `<tr><td>` + f(e, i, j), t[j]) + `</table>` : '').join('')

	el('source', `<table><tr>${q}</table>`)

	if (gPageName == 'parser') {
		gsource.forEach((e, i) => {
			el('s' + i).insertAdjacentHTML("afterend", gzinflate(e) + '<h5>' + (b ? 'Вывод' : 'Output') + '</h5><p style="white-space:pre;">' + gout[i] + '</p>');
		});
		setSourceCodeButtons()
	}
	else {
		g = gPageName == 'graph'
		i = g ? 1433 : 798
		el('sc').innerHTML = imageTag(gPageName + '/cpp_' + gLanguage.slice(0, 2) + '.png', i, g)
	}
}
//c++ js java php
gout = [`0.707107
5
1
1`,
	`2.41421
2
1.5
7
3
5`

	, `0.7071067811865475
5.000000000000001
0.9999999999999998
1`, `2.414213562373095
2
1.5
7
3
5`

	, `0.7071067811865475
5.000000000000001
0.9999999999999998
1.0`
	, `2.414213562373095
2.0
1.5
7.0
3.0
5.0`

	, `0.70710678118655
5
1
1`, `2.4142135623731
2
1.5
7
3
5`
]

gsource = ['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']