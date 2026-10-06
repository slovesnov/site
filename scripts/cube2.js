function load() {
    //https://oeis.org/A080602/list https://oeis.org/A080601/list
    show2bf = 0
    n = 43252003274489856000n;
    [[1n, 12n, 114n, 1068n, 10011n, 93840n, 878880n, 8221632n,
        76843595n, 717789576n, 6701836858n, 62549615248n,
        583570100997n, 5442351625028n, 50729620202582n,
        472495678811004n, 4393570406220123n,
        40648181519827392n, 368071526203620348n],
    [1n, 18n, 243n, 3240n, 43239n, 574908n, 7618438n, 100803036n,
        1332343288n, 17596479795n, 232248063316n, 3063288809012n,
        40374425656248n, 531653418284628n, 6989320578825358n,
        91365146187124313n]].forEach((a, j) => {
            sum = a.reduce((a, e) => a + e, 0n)
            c = j ? [12n, 18n] : [8n, 12n, 8n, 2n]
            b = a.slice(0, c.length + 1)
            l = a.length
            for (i = c.length + 1; i <= l; i++) {
                b.push(c.reduce((a, e, k) => a + e * b[i - k - 1], 0n))
            }
            el(j).innerHTML += '<table class="table_border table_color" width="100%"><thead>' + tr('th', '№', 'точная оценка', 'приближённая оценка', 'bf', 'разница между точной и<br>приближённой оценкой') + '</thead><tbody>'
                + a.map((e, i) => tr('td', i, fs(e), fs(b[i])
                    , i ? (Number(e) / Number(a[i - 1])).toFixed(2) + (show2bf ? ' / ' + (Number(b[i]) / Number(b[i - 1])).toFixed(2) : '') : '-'
                    , (100 * (Number(b[i]) / Number(e) - 1)).toFixed(2) + '%')).join('')
                + tr('td', l, '?', fs(b[l]), '?', '?') + `</tbody></table>Общее число позиций n = ${fs(n)} = 8! &times; 3<sup>7</sup> &times; 12!/2 &times; 2<sup>11</sup>.<br>sum = ${a[0]}+${a[1]}+&hellip;+${fs(a[l - 1])} = ${fs(sum)}. sum/n = ${(Number(sum) / Number(n) * 100).toFixed(2)}%.`
        })
}

function fs(e) {
    return formatString(e, ',', 6)
}

function tr(p, ...a) {
    return a.reduce((a, e) => a + `<${p} align="${p == 'th' ? 'center' : 'right'}">` + e, '<tr>')
}