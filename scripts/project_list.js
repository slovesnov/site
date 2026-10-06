function load() {
    d = [
        ['c++', 'вспомогательная библиотека для проектов', 'aslov', 'aslov', '-'],
        ['c++', 'библиотека для работы с большими числами', 'bignumber', 'biginteger', 'bigintegers'],
        ['c++', 'решатель задач по бриджу и преферансу', 'bridge', 'bridge', 'bridge-studio'],
        ['c++', 'вспомогательный проект для бриджа', '-', 'bridgetest', '-'],
        ['c++', 'калькулятор c++', 'calculator', 'calculator', 'sccalculator'],
        ['c++', 'библиотека для cgi c++', 'cgi', 'cgi', '-'],
        ['c++', 'парсер товаров', 'goods_parser', 'goodsparser', '-'],
        ['c++', 'построитель графиков c++', 'graph', 'graph', 'sccalculator'],
        ['c++', 'вспомогательный проект для теста библиотеки gtk', '-', 'gtktest', '-'],
        ['c++', 'программа просмотра изображений', 'imageviewer', 'imageviewer', 'imageviewergtk'],
        ['java', 'парсер выражений, калькулятор, плоттер', 'parser graph calculator', 'javaplottercalculator', 'xpressionparser sccalculator'],
        ['c++, java, js, php', 'парсер выражений, калькулятор, плоттер', 'parser graph calculator', 'parser', 'xpressionparser sccalculator'],
        ['c++', 'парсер выражений c++', 'parser', 'parser_cpp', 'xpressionparser'],
        ['c++, java, js', 'программа перебора сочетаний и размещений', 'permutations', 'permutations', '-'],
        ['c++', 'сбор информации о файлах, классах, функциях с++ кода в html', '-', 'projectinfo', '-'],
        ['c++', 'полное исседование пирамидки', 'pyramid', 'pyramid', '-'],
        ['c++', 'кратчайшие игры в реверси', 'reversi_shortest_games', 'reversishortgamessearch', '-'],
        ['html', 'сайт, версии программ', '-', 'slovesnov.github.io', '-'],
        ['c++', 'программа таймер / секундомер', 'stopwatch', 'stopwatch', 'gtkstopwatch'],
        ['-', '-', '-', 'test', '-'],
        ['-', '-', '-', 'vscode', '-'],
        ['c++', 'программа слова', 'words', 'words', 'javawords'],
        ['c++', 'оптимальные алгоритмы в играх быки-коровы и мастермайнд', 'bullscows', '-', 'bulls-cows'],
        ['c++', 'запоминание карт на yahoo.com', 'yahoo_card_capturer', '-', 'cardcapturer'],
        ['c++', 'цветные линии', 'lines', '-', 'colorlines'],
        ['c++', 'фрактальный хранитель экрана', 'fractals', '-', 'fractals-saver'],
    ].map(e => e.map((e, i) => r(e, i)))
    w = ["?index", "https://github.com/slovesnov", "https://sourceforge.net/u/slovesnov/profile"]
    t = ['globe', 'github', 'sourceforge'].map((e, i) => `<a href="${w[i]}"><img src='img/${e}16.png' class='va'> ${i ? e : 'сайт'}</a>`)
    t.unshift('язык', 'описание')
    el('p').innerHTML = new Table(t, d, 'csbrn').html()
}

const l = ['?', 'https://github.com/slovesnov/', 'https://sourceforge.net/projects/']

function r(e, i) {
    if (e == '-' || i < 2)
        return e
    return e.split(/ /).map(e => `<a href='${l[i - 2] + e}' target='_blank'>${e}</a>`).join(', ')
}