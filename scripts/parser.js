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

  t = b ? ['Примеры', 'Исходный код (разбит на несколько проектов)'] : ['Examples', 'Source code (split into multiple projects)']
  t = t.map(e => `<table><thead><h4 style="margin:0;padding:0">${e}</h4></thead>`)

  f = (e, i, j) => j ? `<a href='${r[i]}'>${e[0]}</a>` + e[1] : `<a href="${i == 4 ? '?parser_versions' : '#' + (i ? e : 'cpp')}">${e}</a>`

  q = a.map((e, j) => gPageName == 'parser' || j ? `<td${j ? '' : ` style='padding-right: 60px;'`}>` + e.reduce((a, e, i) => a + `<tr><td>` + f(e, i, j), t[j]) + `</table>` : '').join('')

  el('source', `<table><tr>${q}</table>`)

  if (gPageName == 'parser') {
    gout.forEach((e, i) => el('s' + i, '<h5>' + (b ? 'Вывод' : 'Output') + '</h5><p style="white-space:pre;">' + e + '</p>'))
  }
  else {
    g = gPageName == 'graph'
    i = g ? 1433 : 798
    el('sc').innerHTML = imageTag(gPageName + '/cpp_' + gLanguage.slice(0, 2) + '.png', i, g)
  }
}

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