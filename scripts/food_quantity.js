GOODS = `курица 16 14 0
говядина	18.9	12.4	0
минтай 19.44 0.98 0
сельдь	18.4	11.7	0
печень говяжья	17.9	3.7	5.3
печень свиная	18.8	3.8	4.7
печень цыпленка бройлера	18	10	0
яйцо	12.7	11.5	0.7
молоко 3.2%	2.9	3.2	4.7
творог 9%	16	9	3
сыр маасдам	25.4	26.1	0
семечки подсолнечника	20.7	52.9	3.4
арахис	26.8	50	12.3
семечки тыквы	29	46.7	13.1
горох 23 1.6 48.1
гречка 12.6 3.3 60.7
рис	7	1	71
сухари белые	11.6	1.2	74.7
сухари черные	11	1.9	67.3
картофель	2	0.4	18.1
сахар 0 0 100
огурцы	0.8	0.1	2.8
яблоко 0.4 0.4 9.8
банан	1.5	0.5	
грибы	2.2	1.2	0.5
масло подсолнечное	0	99.9	0`
    .split(/\n/).map(e => {
        a = e.split(/\s+/)
        return [a.slice(0, -3).join(' '), ...a.slice(-3).map(e => +e)]
    })

/*  
SI = '0 минтай рис 10'
SI = '0  1 6 9 10'
кур минтай рис яблоко
кур минтай гречка яблоко
кур минтай банан
курица минтай рис картофель масло - есть решение 1:1:4.5
*/
SI = `минтай курица рис картофель яблоко масло_подсолнечное`.split(/\s+/)
MAXSOVLE = SI.length
STEP = [1, 5, 10]
RATIO = [1.6, 1, 4.5]
M = 75
CHAIN = 25
PFC = [4, 9, 4]
NAMES = ['№', 'название', 'белки', 'жиры', 'углеводы', 'калории']
NAMES1 = NAMES.slice(2, 6)
PFCC = NAMES1.map(e => e[0])
GOODS_CHAIN = Math.ceil(GOODS.length / 2)
ADD = 1

function load() {
    SI = SI.map(e => /^\d+$/.test(e) ? e : fgi(e) + ADD).join(' ')
    t = `<thead><tr>` + NAMES.map(e => '<th>' + e).join('') + `</thead><tbody>`
    s = `<table class='t'><tr><td>`
    s += `<table>` + t
    for (i = 0; i < MAXSOVLE; i++) {
        s += `<tr><td>${i + 1}`
        for (j = 0; j < 4; j++) {
            s += `<td><input type='text' id=i${i + '' + j} class=${'ni'[j ? 1 : 0]} oninput=goodChanged(${i}) onkeydown=kd(event,${i})>`
        }
        s += `<td><span id=i${i + '' + j}>`
        s += '<tr><td>'
        for (j = 0; j < 5; j++) {
            s += `<td class=ac><span id=_i${i + '' + j}>`
        }
        s += `<tr><td class=ac colspan=6><span id=__i${i}>`//common error
    }

    s += `<tr><td colspan=2>масса <input type="text" value=${M} id=m oninput=massChanged()> на кг`
    for (j = 0; j < 3; j++) {
        s += `<td><input type='text' id=j${j + 1} class=i value=${RATIO[j]} oninput=totalChanged()>`
    }
    s += `<td class=ar><span id='j'>`
    s += '<tr><td><td>всего'
    for (j = 0; j < 4; j++) {
        s += `<td${j == 3 ? ` class='ar'` : ''}><span id=${j == 3 ? '' : '_'}j${j + 1}>`
    }
    b = (t, c) => `<button class='comboboxbutton' onclick=${c}>${t}</button>`

    w = [`<label><input type='checkbox' id='c'>режим добавления</label>`, b('очистить результаты', "el('o','')")]
    s += `<tr><td colspan=6>${b('номера и/или имена', 'setGoods()')} <input type='text' id='i' value='${SI}' onkeydown=kd(event)>` +
        [['k', 'kClicked()'], ['A<sup>-1</sup>', 'solveClicked(0,1)'], ['сброс', 'resetGoods()']].map(e => ' ' + b(...e)).join(' ')
    for (i = 0; i < MAXSOVLE - 2; i++) {
        s += `<tr><td colspan=2>${b(`найти ${i + 3} товар${i < 2 ? 'a' : 'ов'}`, `solveClicked(${i})`)}<td>`
        if (i) {
            s += `<input type=number value=${STEP[i - 1]} oninput=oi(event) id=n${i - 1} min=1>`
        }
        if (i < w.length) {
            s += `<td colspan=3>` + w[i]
        }
    }
    s += '</table>'
    for (j = 0; j < GOODS.length; j += GOODS_CHAIN) {
        s += GOODS.slice(j, j + GOODS_CHAIN).reduce((a, e, i) => a + `<tr>` + [j + i + ADD, ...e, kcal(e, 1)].map(e => '<td>' + e).join('')
            , `<td style='padding-left:20px'><table class='table_color'>` + t) + '</table>'
    }

    s += `</table><p id='o'></p>`
    el('p', s)

    setGoods()
    //resetGoods()
    totalChanged()
}

fgi = s => GOODS.findIndex(e => e[0] == s.replaceAll('_', ' '))
kcal = (r, f = 0, d = 1, p = 1) => ns(PFC.reduce((a, e, i) => a + e * r[i + f], 0) / d, p)
ug = (a, i) => {
    a.forEach((e, j) => el('i' + i + j).value = e)
    goodChanged(i)//update kcal & remove errors if were
}
goodChanged = r => rowChanged('i' + r, true)
totalChanged = () => rowChanged('j', false)
valid = (v, b) => v !== false && isFinite(v) && v >= 0 && (!b || v <= 100)
ns = (v, p) => isFinite(v) ? formatNumber(v, p) : (isNaN(v) ? '?' : ((v < 0 ? '-' : '') + '&infin;'))
sg = (e, i) => {
    n = /^\d+$/.test(e) ? e - ADD : fgi(e)
    if (n >= 0 && n < GOODS.length)
        ug(GOODS[n], i)
}
st = s => el('o', (el('c').checked ? el('o').innerHTML : '') + s)

function oi(e) {
    e = e.target
    i = +e.id.slice(1)
    v = e.value
    if (v >= 1)
        STEP[i] = +v
    // else//bad
    //     e.value = STEP[i]
}

function kClicked() {
    b = el('i').value.trim().split(/\s+/).slice(0, MAXSOVLE)
    if (!(a = getA(b.length))) {
        return
    }
    pfc = [0, 0, 0]
    b.forEach((e, j) => {
        for (i = 0; i < 3; i++) {
            pfc[i] += e * a[j][i + 1] / 100
        }
    })
    s = ['на кг', 'всего'].reduce((a, e, i) => a + [...pfc.map(e => ns(e / (i ? 1 : M), 2 - i)), kcal(pfc, 0, i ? 1 : M, 2 - i)].reduce((a, e) => a + '<td>' + e, `<tr><th>${e}`),
        NAMES1.reduce((a, e) => a + '<th>' + e, `<table class='table_border table_color'><thead><tr><th>`) + `</thead><tbody>`) + `</table>`
    // s = ['всего', 'на кг'].reduce((a, e, i) => a + [...pfc.map(e => ns(e / (i ? M : 1), i + 1)), kcal(pfc, 0, i ? M : 1, i + 1)].reduce((a, e) => a + '<td>' + e, `<tr><th>${e}`),
    //     NAMES1.reduce((a, e) => a + '<th>' + e, `<table class='table_border table_color'><thead><tr><th>`) + `</thead><tbody>`) + `</table>`
    st(s)
}

function massChanged() {
    v = evaluateString(el('m').value)
    M = v === false ? NaN : v
    totalChanged()
}

function kd(e, p) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (p === undefined)
            setGoods()
        else
            sg(el('i' + p + 0).value, p)
    }
}

function setGoods() {
    el('i').value.trim().split(/\s+/).slice(0, MAXSOVLE).forEach((e, i) => sg(e, i))
}

function resetGoods() {
    //let prevents goodChanged
    for (let i = 0; i < MAXSOVLE; i++)
        ug([`товар` + (i + 1), 0, 0, 0], i)
}

function solveClicked(n, p) {
    n += 3
    b = []
    for (i = 0; i < 3; i++) {
        v = 100 * el('_j' + (i + 1)).innerHTML
        if (!isFinite(v)) {
            st(`ошибка неверное значение всего ${NAMES[i + 2]}`)
            return
        }
        b.push(v)
    }
    if (!(a = getA(n)))
        return
    st(solve(a, b, p))
}

function getA(n) {
    let a = [], b, i, j, v, v1
    for (i = 0; i < n; i++) {
        b = []
        for (j = 0; j < 4; j++) {
            v = el('i' + i + j).value
            if (j) {
                v1 = evaluateString(v)
                if (v1 === false) {
                    st(`ошибка неверное значение строка ${n}, колонка ${NAMES[j + 2]}, значение ${v}`)
                    return false
                }
                v = v1
            }
            b.push(v)
        }
        a.push(b)
    }
    return a
}

function rowChanged(id, good) {
    a = []
    ok = 1
    for (i = 1; i < 4; i++) {
        s = el(id + i).value.trim()
        v = evaluateString(s)
        ok &= j = valid(v, good)
        if (!good) {
            v *= M
        }
        a.push(v)
        b = /^[+-]?[\d.]+$/.test(s)
        el('_' + id + i, j ? (good && b ? '' : ns(v, 1)) : 'ошибка')
    }
    if (good) {
        ok &= j = a.reduce((a, e) => a + e) <= 100
        el('__' + id, j ? '' : 'ошибка белки + жиры + углеводы > 100')
    }
    else {
        if (isNaN(M)) {
            ok = false
            // el('__' + id, 'ошибка неверная масса')
        }
        el(id, ok ? kcal(a, 0, M, 2) : '')
    }
    el(id + i, ok ? kcal(a) : '')
}

function solve(a, b, p) {
    //a[i] - i-й товар
    startTime = performance.now();
    s = ''
    l190: for (i = 0; i < a.length; i++) {
        for (j = i + 1; j < a.length; j++) {
            for (k = 1; k < 4 && a[i][k] == a[j][k]; k++);
            if (k == 4) {
                s = `предупреждение: строки ${i + 1} и ${j + 1} совпадают<br>`
                break l190
            }
        }
    }

    u = []
    a.forEach((e, i) => {
        v = Math.min(...b.map((q, j) => q / e[j + 1]))
        u.push([i, v])
        s += ` ${e[0]} &le; ` + ns(v, 0) + ', '
    })

    s1 = `<table><tr><td><table class=s>`;
    [[0, 1], [2, 0], [2, 1]].forEach(q => {
        //Nan=0/0 не участвует в соотношении
        f = a.map(e => e[q[0] + 1] / e[q[1] + 1]).filter(e => !isNaN(e))
        min = Math.min(...f)
        max = Math.max(...f)
        v = b[q[0]] / b[q[1]]
        s1 += `<tr>` + [PFCC[q[0]] + '/' + PFCC[q[1]], ns(min, 1), '&le;', ns(v, 1), '&le;', ns(max, 1), min <= v && v <= max ? 'ok' : 'выход за границы'].map(e => '<td>' + e).join('')
    })
    s1 += `</table>`
 
    d = a.map(e => e.join(' ')).join('\n')
    //console.log(d)
    s1+="<td><table class='table_border table_color'>"
    for (i = 0; i < 2; i++)
        s1 += '<tr><td>' + ds(d, b, i).join('<td>')
    s1+='</table></table>'
    

    if (a.length == 3 && !p) {
        s += s1
        try {
            A = math.transpose(a.slice(a.length - 3).map(e => e.slice(1)))
            solution = math.lusolve(A, b)
            s += solution.some(e => e < 0) ? 'решений нет' : solution.reduce((_a, e, i) => _a + `<tr><td>` + a[i][0] + '<td>' + formatNumber(e, 0), `<table class='table_border table_color'>`) + '</table>'
        } catch (error) {
            s = 'ошибка вырожденная матрица'
        }
        return s
    }

    u.sort((a, b) => a[1] - b[1])//asc
    //u.sort((a, b) => b[1] - a[1])//desc
    m = 0
    pe = new Permutations(a.length - 3, u.length, Permutations.PERMUTATIONS_WITHOUT_REPLACEMENTS)
    for (const e of pe) {
        d = e.map(e => u[e][0])
        q = a.slice()
        d.sort((a, b) => b - a).forEach(e => q.splice(e, 1))
        A = q.map(e => e.slice(1))
        if (math.det(A)) {
            m = e.map(e => u[e][1])
            break
        }
    }
    if (!m) {
        return p ? `вырожденая матрица` : `ошибка все подматрицы вырождены`
    }
    invA = math.inv(math.transpose(A))
    if (p) {
        const z = 10 ** -Math.floor(Math.log10(Math.abs(invA[0][0])))
        s += '<table>'
        for (i = 0; i < 2; i++) {
            s += invA.reduce((a, e) => a + '<tr>' + e.map(e => '<td>' + (i ? e.toExponential() : formatNumber(e * z, 4))).join(''),
                `<tr><td${i ? ' colspan=2' : ''}><table class="table_border table_color">`) + '</table>' + (i ? '' : '<td>мультипликатор ' + z)
        }
        s += '</table>'
        return s
    }

    so = Array.from(a, (_, i) => i).filter(e => !d.includes(e))
    tr = d.concat(so)

    so = Array.from(a, () => [])
    w = STEP[a.length - 4]
    m = m.concat(Array.from({ length: 3 - m.length }).fill(0))
    for (k2 = 0; k2 <= m[2]; k2 += w) {
        b2 = b.map((e, i) => e - k2 * a[tr[2]][i + 1])
        for (k1 = 0; k1 <= m[1]; k1 += w) {
            b1 = b2.map((e, i) => e - k1 * a[tr[1]][i + 1])
            if (b1.some(e => e < 0))
                break
            for (k0 = 0; k0 <= m[0]; k0 += w) {
                b0 = b1.map((e, i) => e - k0 * a[tr[0]][i + 1])
                f = 0
                solution = math.multiply(invA, b0)
                if (solution.some(e => e < 0)) {
                    if (f)
                        break
                }
                else {
                    f = 1
                    for (i = 0; i < a.length - 3; i++) {
                        so[tr[i]].push([k0, k1, k2][i])
                    }
                    solution.forEach((e, i) => so[tr[i + a.length - 3]].push(e))
                }
            }
        }
    }

    ts = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false // Use true for AM/PM format
    })
    s += ' решений ' + (so[0].length ? formatNumber(so[0].length) : 'нет') + `, время ${formatNumber((performance.now() - startTime) / 1000, 3)}` + ' ' + ts + s1;
    if (so[0].length) {
        s += `<table class='table_border table_color'><thead></thead>`//do not remove <thead></thead>
        for (j = 0; j < so[0].length; j += CHAIN) {
            s += so.reduce((_a, e, i) => _a + e.slice(j, j + CHAIN).reduce((a, e) => a + '<td>' + formatNumber(e, 0), '<tr><td>' + a[i][0])
                , (j ? `<thead><tr><td colspan=${CHAIN + 1} style="padding-top:10px;"></thead>` : ``) + `<tbody>`) + `</tbody>`

        }
        s += `</table>`
    }
    //console.log((performance.now() - startTime) / 1000)
    return s
}

function determinants(matrix) {
    const size = matrix.length;
    let i, j, d = []
    for (i = 1; i <= size; i++) {
        j = matrix.slice(0, i).map(row => row.slice(0, i));
        d.push(math.det(j))
    }
    return d;
}

function ds(d, pfc, type = 0, al = [1, 1, 1]) {
    let s, i, j, r, Dmat, dvec, Amat, bvec
    let ccal = a => a.reduce((a, e, i) => a + e * PFC[i], 0)
    let a = d.split('\n').map(e => {
        i = e.trim().split(/\s+/)
        if (i.length > 4) {
            i = [i.slice(0, -3).join(' '), ...i.slice(-3)]
        }
        return i.map((e, i) => i ? +e : e)
    })
    let l = a.map(e => ccal(e.slice(1)))
    //let min = pfc.reduce((a, e) => a + e * e, 0)

    if (type) {
        i = ccal(pfc)
        Dmat = l.map(q => l.map(e => e * q * 2))
        //dvec = l.map(e => 2 * i * e)//-dvec
    }
    else {
        Dmat = Array.from({ length: l.length }, () => Array.from({ length: l.length }))
        for (i = 0; i < l.length; i++)
            for (j = i; j < l.length; j++)
                Dmat[i][j] = Dmat[j][i] = (al.reduce((q, e, k) => q + a[i][k + 1] * a[j][k + 1] * e, 0)) * 2

        //dvec = a.map(q => pfc.reduce((a, e, i) => a + 2 * e * q[i + 1] * al[i], 0))//-dvec
    }
    //console.log(Dmat)
    return determinants(Dmat)
    // Amat = l.map((_, i) => l.map((_, j) => +(i == j)))
    // bvec = Array.from(l).fill(0);
}
