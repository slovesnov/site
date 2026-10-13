const ln = gLanguage == 'russian' ? ['Примеры', 'Исходный код (разбит на несколько проектов)', 'история версий', 'Вывод', 'парсер', 'калькулятор', 'плоттер'
  , 'Вычисление выражения', 'Чтобы вычислить выражение, необходимо вызвать статическую функцию calculate() класса ExpressionEstimator.', 'Создание и вычисление формулы', 'Если необходимо создать формулу, которая может содержать переменные x0, x1..., то сначала ее нужно скомпилировать, используя функциию compile(). Переменные не зависят от регистра x0 и X0 означает одно и то же. Затем вызвать функцию calculate(), передав значения неизвестных одним из способов. Также можно создавать формулу прямо в конструкторе. Можно создавать формулы со списком переменных в конструкторе или с помощью compile(). В этом случае переменные зависят от регистра.'
]
  : ['Examples', 'Source code (split into multiple projects)', 'versions history', 'Output', 'parser', 'calculator'/*5*/, 'plotter'
    , 'Calculating an expression'/*7*/, 'To calculate an expression, call the static function calculate() of the ExpressionEstimator class.', 'Creating and calculating a formula', 'If it is necessary to create a formula that can contain variables x0, x1..., it should first be compiled using compile(). The variables are case insensitive x0 and X0 mean the same. Then call calculate(), passing values of variables in one of the ways. You can also create a formula directly in the constructor. It is possible to create formulas with a list of variables in the constructor or using compile(). In this case, the variables are case-sensitive.'
  ]
const lng = ['c++', 'java', 'javascript', 'php'];
const aslovref = ' <a href="?aslov">aslov</a>'
const lref = `, ` + (gLanguage == 'russian' ? `используется библиотека${aslovref}` : `the${aslovref} library is used`)
lngid = e => e == lng[0] ? 'cpp' : e
capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

function load() {
  r = [
    'parser_cpp'
    , 'calculator'
    , 'graph'
    , 'javaPlotterCalculator'
    , 'parser'
  ].map(e => 'https://github.com/slovesnov/' + e)

  re = gLanguage == 'russian' ? [
    'java парсер/калькулятор/плоттер'
    , ['javascript/php', ' парсер js, php и js калькулятор/плоттер']
  ] : [
    , 'java parser/calculator/plotter'
    , ['javascript/php', ' parser js, php and js calculator/plotter']
  ]
  b = [lng[0] + ' ' + ln[4], ...ln.slice(5, 7).map(e => ['c++/gtk3 ' + e, lref])].concat(re)
  a = [[...lng, ln[2]], b.map(e => Array.isArray(e) ? e : [e, ''])]

  t = ln.slice(0, 2).map(e => `<table><thead><h4 style="margin:0;padding:0">${e}</h4></thead>`)

  f = (e, i, j) => j ? wrap(`a href="${r[i]}"`, e[0]) + e[1] : wrap(`a href="${i == lng.length ? '?parser_versions' : '#' + lngid(e)}"`, e)
  f1 = (e, j) => e.reduce((a, e, i) => a + `<tr><td>` + f(e, i, j), t[j])
  f2 = (e, j) => `<td${j ? '' : ` style='padding-right: 60px;'`}>` + f1(e, j)

  q = a.reduce((a, e, j) => a + (gPageName == 'parser' || j ? f2(e, j) + `</table>` : ''), '<table><tr>') + `</table>`
  el('source', q)

  if (gPageName == 'parser') {
    el('p', lng.reduce((a, e, i) => {
      a += wrap(`h3 id="${lngid(e)}"`, capitalize(e) + ' ' + ln[4])
      for (j = 0; j < 2; j++) {
        k = 2 * j + 7
        n = i * 2 + j
        a += wrap('h4', ln[k], 'p', ln[k + 1], 'p', gCode[n], 'h5', ln[3], 'p class="pre"', gout[n])
      }
      return a
    }, ''))
    Prism.highlightAll();
  }
  else {
    g = gPageName == 'graph'
    i = g ? 1433 : 798
    el('sc', imageTag(gPageName + '/cpp_' + gLanguage.slice(0, 2) + '.png', i, g))
  }
}

function wrap(...a) {
  let i, j, f, r = '', tag
  for (i = 0; i < a.length; i += 2) {
    f = a[i]
    j = f.indexOf(' ')
    tag = j == -1 ? f : f.slice(0, j)
    r += `<${f}>${a[i + 1]}</${tag}>`
  }
  return r
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
1.0`
  , `2.414213562373095
2.0
1.5
7.0
3.0
5.0`

  , `0.7071067811865475
5.000000000000001
0.9999999999999998
1`, `2.414213562373095
2
1.5
7
3
5`

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