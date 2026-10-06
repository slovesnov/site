function load() {
    const SHOWINFO = 0
    const BASE = 'https://ru.wikipedia.org/wiki/'
    const UNKNOWN = Infinity
    const PARSE_DATE = '2026-07-29'
    const BIRTH_INDEX = 1;
    const DEATH_INDEX = 2;
    ['data', 'source'].forEach(e => window[e] = gzinflate(window[e]))
    live = 0
    a = data.split('\n')//.slice(0, 333)
    data = []
    a.forEach(e => {
        b = e.split('#')
        if (!SHOWINFO) {
            b.pop()
        }
        name = b[0].replace(/\((пианист|композитор|музыкант|певец|скрипач|поэт|певица|юрист|гитарист|актёр|дирижёр|деятель_искусства|диджей|виолончелист|музыковед|продюсер|искусствовед|политик|органист|джазмен|сценарист|кинорежиссёр)\)/, '').trim()
        // if(m=name.match(/\((.+)\)/)){
        //     if(!['младший','старший','отец','сын'].includes(m[1]))
        //     console.log(name)
        // }

        blive = 0
        b[0] = `<a href='${BASE + b[0]}' target='_blank' class='a'>${name.replaceAll(',', '').replaceAll('_', ' ')}</a>`
        addQuestion = 0
        d = []
        b = b.map((e, i) => {
            if (!(i == BIRTH_INDEX || i == DEATH_INDEX)) {
                return e
            }
            if (typeof e == 'string' && e.startsWith('[')) {
                e = JSON.parse(e)
                v = ye(e[1])
                e[1] = Array.isArray(v) ? v[1] : String(e[1])
                addQuestion = 1
            }
            else {
                if (!isNaN(+e)) {
                    e = ye(e)
                }
            }

            if (i == DEATH_INDEX && e == '?') {//died PARSE_DATE or later
                blive = 1
                e = [e, PARSE_DATE]
            }
            d.push(Array.isArray(e) ? e[1] : e)
            return e
        })

        if (!blive && d.every(e => e.match(/^[-\d]+$/))) {
            di = (new Date(d[1]) - new Date(d[0])) / (365.2425 * 24 * 3600 * 1000)
            v = [di.toFixed(2) + (addQuestion ? '?' : ''), di]
        }
        else {
            v = ['?', UNKNOWN]
        }
        b.splice(BIRTH_INDEX + 2, 0, v)

        if (blive)
            live++
        data.push(b)
    });
    title = ['имя', 'рождение', 'смерть', '&Delta;']
    if (SHOWINFO) {
        title.push('файл')
    }
    comparator = Array.from({ length: 3 }, (_, i) => [, , (a, b) => String(a[i].s).length - String(b[i].s).length])
    // additionalSortTitle = Array.from({ length: 3 }, (_, i) => [i ? 'длина строки' : 'длина строки'])
    additionalSortTitle = Array(3).fill(['длина строки'])

    el('p', `Строк ${data.length}, живых ${live}, умерших ${data.length - live}${a.length == data.length ? '' : `, отфильтровано ` + (a.length - data.length)}. <a href='#s'>Исходный код.</a> Чтобы перейти к странице композитора в википедии нажмите на его имя.`
        + new Table(title, data, { o: "bcs0", additionalSortTitle }, comparator).html()
        + `<h3 id='s'>Исходный код.</h3>` + source)
}

function ye(e) {
    let a = String(e).split('-').map((e, i) => {
        let n = +e, j = i ? 2 : 4
        return isNaN(n) || e.length >= j ? e : e.padStart(j, '0')
    }).join('-')
    return a == String(e) ? e : [e, a];
}
