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
		gs.forEach((e, i) => {
			el('s' + i).insertAdjacentHTML("afterend", codeString(e, gl[Math.floor(i / 2)], i == 1 ? 810 : 0) + '<h5>' + (b ? 'Вывод' : 'Output') + '</h5><p style="white-space:pre;">' + gout[i] + '</p>');
		});
		Prism.highlightAll();
	}
	else {
		g = gPageName == 'graph'
		i = g ? 1433 : 798
		el('sc').innerHTML = imageTag(gPageName + '/cpp_' + gLanguage.slice(0, 2) + '.png', i, g)
	}
}

gl = ['cpp', 'html', 'java', 'php']//use html as language instead of js
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

gs = [`#include <iostream>
#include "estimator/expressionEstimator.h"

int main() {
  try {
    const char *a[] = { "sin(pi/4)", "pow( sin(pi/10)*4+1 , 2)",
        "(sqrt(28/27)+1)^(1/3)-(sqrt(28/27)-1)^(1/3)",
        "sqrt(28/3)*sin(asin( sqrt(243/343)) /3 )" };
    for(auto e:a){
      std::cout << ExpressionEstimator::calculate(e) << std::endl;
    }
  } catch (std::exception &ex) {
    std::cout << ex.what() << std::endl;
  }
}`, `#include <iostream>
#include "estimator/expressionEstimator.h"

int main() {
  ExpressionEstimator e;
  double v;
  std::vector<double> d;
  std::vector<std::string> s;
  try {
    e.compile("x0+2*sin(pi*x1)");
    v = e.calculate(1, .25);
    std::cout << v << std::endl;
    d = { 1, 1. / 6 };
    v = e.calculate(d);
    std::cout << v << std::endl;
    e.compile("x0+2*X1"); // case insensitive variable names
    v = e.calculate( { 1, .25 });
    std::cout << v << std::endl;

    ExpressionEstimator e1("x0+2*x1");
    const double f[] = { 1, 3 };
    v = e1.calculate(f, std::size(f));
    std::cout << v << std::endl;

    e.compile("a+2*b", "a", "b"); // case sensitive variable names
    // or e.compile("a+2*b", std::vector<std::string> { "a", "b" });
    // or e.compile("a+2*b", { "a", "b" });
    // or std::string s[]={ "a", "b" }; e.compile("a+2*b", s, std::size(s));
    v = e.calculate(1, 1);
    std::cout << v << std::endl;

    ExpressionEstimator e2("a+2*A", "a", "A");// case sensitive variable names
    // or ExpressionEstimator e2("a+2*A", std::vector<std::string> { "a", "A" });
    // or ExpressionEstimator e2("a+2*A", { "a", "A" });
    // or std::string s[] = { "a", "A" }; ExpressionEstimator e2("a+2*A", s, std::size(s));
    v = e2.calculate(1, 2);
    std::cout << v << std::endl;

  } catch (std::exception &e) {
    std::cout << e.what() << std::endl;
  }
}`
	, `<html>

<head>
  <script src='estimator/expressionEstimator.js'></script>
  <script>
    function load() {
      try {
        s = ['sin(pi/4)'
          , 'pow( sin(pi/10)*4+1 , 2)'
          , '(sqrt(28/27)+1)^(1/3)-(sqrt(28/27)-1)^(1/3)'
          , 'sqrt(28/3)*sin(asin( sqrt(243/343)) /3 )'].map(
            e => ExpressionEstimator.calculate(e)).join('<br>')
      }
      catch (ex) {
        s = ex
      }

      document.getElementById('p').innerHTML = s
    }
  </script>
</head>

<body onload="load()">
  <p id='p'></p>
</body>

</html>`
	, `<html>

<head>
  <script src='estimator/expressionEstimator.js'></script>
  <script>
    function load() {
      s = '';
      e = new ExpressionEstimator()
      try {
        e.compile('x0+2*sin(pi*x1)')
        v = e.calculate(1, .25)
        s += v + '<br>'
        v = e.calculate([1, 1 / 6])
        s += v + '<br>'
        e.compile('x0+2*X1')//case insensitive variable names
        v = e.calculate(1, .25)
        s += v + '<br>'

        e = new ExpressionEstimator('x0+2*x1')
        v = e.calculate(1, 3)
        s += v + '<br>'

        e.compile('a+2*b', 'a', 'b')//or e.compile('a+2*b',['a','b'])
        v = e.calculate(1, 1)
        s += v + '<br>'

        e = new ExpressionEstimator('a+2*A', 'a', 'A')//case sensitive variable names
        //or e = new ExpressionEstimator('a+2*A',['a','A'])
        v = e.calculate(1, 2)
        s += v + '<br>'
      }
      catch (ex) {
        s += ex
      }

      document.getElementById('p').innerHTML = s
    }
  </script>
</head>

<body onload="load()">
  <p id='p'></p>
</body>

</html>`
	,
	`package demo;

import estimator.ExpressionEstimator;

public class Example1 {

  public static void main(String[] args) {
    final String a[] = { "sin(pi/4)"
        , "pow( sin(pi/10)*4+1 , 2)"
        , "(sqrt(28/27)+1)^(1/3)-(sqrt(28/27)-1)^(1/3)"
        , "sqrt(28/3)*sin(asin( sqrt(243/343)) /3 )" };

    try {
      for (String e : a) {
        System.out.println(ExpressionEstimator.calculate(e));
      }
    } catch (Exception ex) {
      System.out.println(ex.getMessage());
    }

  }

}`
	, `package demo;

import estimator.ExpressionEstimator;

public class Example2 {

  public static void main(String[] args) {
    String s = "";
    ExpressionEstimator e = new ExpressionEstimator();

    try {
      e.compile("x0+2*sin(pi*x1)");
      s += e.calculate(1, .25) + "\\n";
      double v[] = { 1, 1. / 6 };
      s += e.calculate(v) + "\\n";
      e.compile("x0+2*X1");// case insensitive variable names
      s += e.calculate(1, .25) + "\\n";

      e = new ExpressionEstimator("x0+2*x1");
      s += e.calculate(1, 3) + "\\n";

      e.compile("a+2*b", "a", "b");// case sensitive variable names
      // or e.compile("a+2*b", new String[] { "a", "b" });
      s += e.calculate(1, 1) + "\\n";

      e = new ExpressionEstimator("a+2*A", "a", "A");// case sensitive variable names
      // or e = new ExpressionEstimator("a+2*A", new String[] { "a", "A" });
      s += e.calculate(1, 2) + "\\n";

      System.out.println(s);
    } catch (Exception ex) {
      System.out.println(ex.getMessage());
    }
  }

}`
	, `<?php
include('estimator/expressionEstimator.php');

$a = [
  'sin(pi/4)'
    , 'pow( sin(pi/10)*4+1 , 2)'
    , '(sqrt(28/27)+1)^(1/3)-(sqrt(28/27)-1)^(1/3)'
    , 'sqrt(28/3)*sin(asin( sqrt(243/343)) /3 )'
];

foreach ($a as $s) {
  echo ExpressionEstimator::calculate($s) . "<br>";
}`
	, `<?php
include('estimator/expressionEstimator.php');

$e = new ExpressionEstimator();
$e->compile('x0+2*sin(pi*x1)');
$v = $e->calculate(1, .25);
echo "$v<br>";
$v = $e->calculate([1, 1 / 6]);
echo "$v<br>";

$e->compile('x0+2*X1'); //case insensitive variable names
$v = $e->calculate(1, .25);
echo "$v<br>";

$e = new ExpressionEstimator('x0+2*x1');
$v = $e->calculate(1, 3);
echo "$v<br>";

$e->compile('a+2*b', 'a', 'b'); //or $e->compile('a+2*b',['a','b']);
$v = $e->calculate(1, 1);
echo "$v<br>";

$e = new ExpressionEstimator('a+2*A', 'a', 'A'); //case sensitive variable names
//or $e = new ExpressionEstimator('a+2*A',['a','A']);
$v = $e->calculate(1, 2);
echo "$v<br>";`
]