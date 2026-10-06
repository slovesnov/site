const AP = '%'
/* (p-l)*100/(100-l)=(p-l)/(1-l/100)
(p-l)*100/(100-l)= k
100p-100l= 100k-kl
l=100*(p-k)/(100-k)=(p-k)/(1-k/100)
*/

function load() {
    ac = [8,	7.5,	40 //полюшко	
    //    8, 3, 53
    ]
    h = [0, 8, 12]
    d = ['влажность', ...'бжу', 'ккал']
    p = hu(ac)
    el('p').innerHTML = h.reduce((a, e, i) => {
        b = (p - e) / (1 - e / 100)
        k = 1 / (1 - b / 100)
        s1 = i ? '' : ['', ...ac, ''].map((e, i) => `<td rowspan=0>` + (i > 0 && i < 4 ? `<input type=text id=i${i - 1} value=${e} oninput=oinput()>` : e)).join('')
        return a + `<tr>` + [formatNumber(b, 1), '', e + AP, ...Array.from({ length: 4 }).fill('')].map(e => '<td>' + e).join('') + s1
    }, '<table id="t" class="table_color table_border"><thead><tr><th rowspan=2>потеря<br>массы<th rowspan=2>k<th colspan=5>конечные параметры<th colspan=5>начальные параметры<tr>' + d.map(e => '<th>' + e).join('').repeat(2) + '</thead>') + '</table>'
    oinput()
}

cc = ac => ac.reduce((a, e, i) => a + e * [4, 9, 4][i], 0)
hu = ac => 100 - ac.reduce((a, e) => a + e)
w = (i, j, v, p = 1, a = '') => el('t').rows[i + 2].cells[j].innerHTML = isNaN(v) ? '?' : formatNumber(v, p) + a

function oinput() {
    ac = []
    for (i = 0; i < 3; i++) {
        ac.push(+el('i' + i).value)
    }
    p = hu(ac)
    c1 = cc(ac)
    ac.push(c1)//after p
    w(0, 7, p, 1, AP)
    w(0, 11, c1)
    h.forEach((e, i) => {
        b = (p - e) / (1 - e / 100)
        k = 1 / (1 - b / 100)
        w(i, 0, b, 1, AP)
        w(i, 1, k, 2)
        ac.forEach((q, j) => w(i, j + 3, q * k))
    })
}