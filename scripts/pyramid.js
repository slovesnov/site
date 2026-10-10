ln = gLanguage == 'russian' ? ['слой', 'позиций', 'всего позиций', 'среднее', 'ходов'
    , 'период', 'количество ходов для позиций с этим периодом', 'средний период'] :
    ['layer', 'positions', 'total positions', 'average', 'moves'
        , 'period', 'number of moves for positions with this period', 'average period']
function load() {
    //    up         down      left      right
    a = [[93, 0], [80, 217], [0, 98], [182, 112]];
    mx = []
    for (i = 0; i < 2; i++)
        mx[i] = Math.max(...a.map(e => e[i]))

    f = (i, j, t, l) => {
        let r = [], k;
        if (!Array.isArray(i)) {
            i = a[i]
            j = a[j]
        }
        for (k = 0; k < 2; k++)
            r.push(i[k] + t * (j[k] - i[k]))

        if (l > 0)
            ctx.lineTo(r[0], r[1])
        else if (l == 0)
            ctx.moveTo(r[0], r[1])
        return r
    }

    ar = i => i < 2 ? [2, i ? 0 : 1, 3] : [0, 1]

    avg = (...v) => {
        let r = [], k
        if (!Array.isArray(v[0])) {
            v = v.map(e => a[e])
        }
        for (k = 0; k < 2; k++) {
            r.push(v.reduce((a, e) => e[k] + a, 0) / v.length)
        }
        return r
    }

    for (d = 0; d < 3; d++) {
        canvas = el('c' + d);
        canvas.style = "float:left;margin-right: 3px;"
        ctx = canvas.getContext('2d');
        canvas.width = mx[0];
        canvas.height = mx[1];
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        for (i = 0; i < 2; i++) {
            ctx.beginPath()
            ctx.moveTo(a[0][0], a[0][1]);
            (i ? [1, 3] : [1, 2]).forEach(i => ctx.lineTo(a[i][0], a[i][1]))
            ctx.closePath()
            ctx.fillStyle = COLOR[2 * i];
            ctx.fill()
            ctx.stroke()
        }
        [1 / 3, 2 / 3].forEach((e, w) => {
            if (d == 1 && !w)
                return
            for (i = 0; i < 4; i++) {
                ctx.beginPath()
                ar(i).forEach((j, l) => f(i, j, e, l))
                ctx.stroke()
            }
        })

        if (d == 1) {
            ctx.strokeStyle = "#34C924"
            for (i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(a[i][0], a[i][1]);
                ar(i).forEach((j, l) => {
                    b = f(i, j, 1 / 3, 1)
                    if (i < 2 && l == 1) {
                        m = b
                    }
                }
                )
                ctx.closePath()
                if (i < 2)
                    ctx.lineTo(m[0], m[1]);
                ctx.stroke()
            }
        }
        else if (d == 2) {
            ctx.strokeStyle = "purple";
            ctx.beginPath();
            f(0, 1, 1 / 3, 0)
            m1 = f(0, 1, 2 / 3, 1)
            m = f(0, 3, 2 / 3, -1)
            f(m1, m, .5, 1)
            ctx.closePath()
            m2 = f(0, 2, 2 / 3, -1)
            f(m2, m1, .5, 1)
            ctx.lineTo(m1[0], m1[1]);
            ctx.stroke()

            r = 10
            r1 = 70
            for (j = 2; j < 4; j++) {
                b = [0, 1, j];
                v = avg(...b)
                b.forEach((e, i) => {
                    m1 = f(e, b[(i + 1) % 3], 1 / 3, -1)
                    m2 = f(e, b[(i + 2) % 3], 1 / 3, -1)
                    m = avg(m1, m2, v)
                    ctx.strokeStyle = ctx.fillStyle = ['blue', 'black', j == 2 ? 'green' : '#008B8B'][i]
                    i1 = i == 1 ? 0 : 1
                    an = Math.atan2(a[j][1] - a[i1][1], a[j][0] - a[i1][0])
                    d = [Math.cos(an), Math.sin(an)]
                    q = [m[0] + d[0] * r1, m[1] + d[1] * r1]
                    arrow(q[0], q[1], m[0], m[1], r)
                    ctx.beginPath();
                    ctx.moveTo(q[0], q[1]);
                    ctx.lineTo(m[0] + d[0] * r, m[1] + d[1] * r);
                    //ctx.lineTo(m[0] - d[0] * 3 * r1, m[1] - d[1] * 3 * r1);
                    ctx.stroke()
                })
            }
        }
    }

    a = [1, 8, 48, 288, 1728, 9896, 51808, 220111, 480467, 166276, 2457, 32]
    q = a.reduce((a, e) => a + e, 0)
    t = avg = 0
    s = a.reduce((a, e, i, r) => {
        t += e
        pr = e / q
        avg += pr * i
        return a + tr('td', i, fs(e), i ? (e / r[i - 1]).toFixed(3) : '-', (pr * 100).toFixed(3) + '%', '', fs(t), (t * 100 / q).toFixed(3) + '%')
    }, '<table class="table_border table_color"><thead>' +
    tr('th', ln[0], ln[1], 'bf', '%', '', ln[2], '%') + '</thead><tbody>') +
        `</tbody></table>${ln[3]} ` + formatNumber(avg, 3) + ' ' + ln[4]

    o = { 1: { 0: 1 }, 2: { 7: 123, 8: 195, 9: 52, 10: 21 }, 3: { 1: 8, 3: 48, 4: 72, 5: 744, 6: 3648, 7: 14328, 8: 33876, 9: 11820, 10: 330, 11: 6 }, 4: { 6: 48, 7: 312, 8: 1632, 9: 492, 10: 36 }, 5: { 6: 432, 7: 864, 8: 912, 9: 96 }, 6: { 3: 72, 4: 360, 5: 1424, 6: 8704, 7: 39340, 8: 88124, 9: 34944, 10: 846, 11: 26 }, 8: { 6: 144, 7: 504, 8: 456, 9: 336 }, 10: { 6: 48, 7: 216, 8: 1272, 9: 744, 10: 24 }, 12: { 4: 240, 5: 2520, 6: 10680, 7: 48912, 8: 106680, 9: 32304, 10: 264 }, 15: { 2: 48, 3: 48, 4: 456, 5: 2616, 6: 11352, 7: 43920, 8: 92616, 9: 32640, 10: 624 }, 24: { 3: 96, 4: 384, 5: 1368, 6: 6960, 7: 28728, 8: 57144, 9: 20400, 10: 120 }, 30: { 3: 24, 4: 216, 5: 1224, 6: 9792, 7: 42864, 8: 97560, 9: 32448, 10: 192 } }

    //q is used
    en = Object.entries(o)
    avg = 0
    s1 = en.reduce((a, e) => {
        s2 = Object.keys(e[1]).join(' ')
        sum = Object.values(e[1]).reduce((a, e) => a + e, 0)
        pr = sum / q
        avg += pr * e[0]
        return a + tr('td', e[0], fs(sum), (pr * 100).toFixed(3) + '%', s2)
    }, '<table class="table_border table_color"><thead>' +
    tr('th', ln[5], ln[1], '%', `<span style="font-size:11pt">${ln[6]}</span>`) + '</thead><tbody>') + '</tbody></table><span style="margin-left:30px">' + ln[7] + ' ' + formatNumber(avg, 3) + ' ' + ln[4] + '</span>'
    el('p').innerHTML = `<table><tr><td style="vertical-align:top">${s}<td>${s1}</table>`

    w = 395
    fontsize = 20
    size = 20;
    gh = size * Math.sqrt(3) / 2;
    [
        ["bybybyrwrwrwwrwrwrybybyb yryw'br'ywb'", "yrybywwywbwrrwrbrybrbwby ywb'y'r'wyr'w'b'"],
        ["rwwrbbyrrybbwyywbbryyrww ywyw'yr'w'r'y'rb'",
            "rywybbywrybbwrywbrrbyrww ywywr'w'b'rw'br'",
            "rywbbwywrbbwwryrbyrrybwy ywywr'b'wbywr'",
            "rywybwywrbbrwrybbrrbywwy ywywr'ywbyb'r'",
            "rywrbbywrybwwryrbbryybww ywywr'by'rb'y'r'",
            "yrybybwywywbrwrwrybrbrbw ywyr'yw'bry'r'w",
            "yryrybwywywrrwrbrbbybwbw ywyr'w'rby'wr'w",
            "rywbbyywrwbrwrybbyrrywwb ywrbwyb'yw'yr'",
            "rrwbbwyyrbbrwwybbyrrywwy ywywrb'ry'w'r'b'",
            "rrwybbyyrybwwwyrbrrbybww ywyw'rw'yw'rbw'",
            "rwwybwyrrbbwwyyrbrrbybwy ywyw'rbw'yw'bw'",
            "ywyrywwrwbwrryrbrbbybwby ywywb'wy'rbw'b'",
            "rwwybyyrrwbbwyywbrrbyrwb ywyb'rw'br'w'b'w",
            "ywybywwrwbwbryrwrybrbrby ywywb'y'brw'yb'",
            "rywybbywrybrwrybbrrbywww ywrw'brw'bw'bw'",
            "rwwrbyyrrwbwwyyrbbryybwb ywyb'y'r'by'rb'w",
            "rrwybyyyrwbrwwybbrrbywwb ywyr'bwrbwy'b'",
            "rrwbbyyyrwbwwwyrbyrrybwb ywyb'wyrwr'b'w",
            "rwwybyyrrwbrwyybbrrbywwb ywr'wy'br'bwyr'",
            "rwwbbyyrrwbwwyyrbyrrybwb ywr'wybr'bw'yr'",
            "rywrbyywrwbbwrywbbryyrwb ywywb'w'yb'wy'b'",
            "rywybwywrbbbwrywbrrbyrwy ywyr'b'w'r'b'rb'r'",
            "rwwybbyrrybwwyyrbrrbybww yryrb'wy'bw'y'b'",
            "rywbbbywrybwwryrbyrrybww ywy'by'by'rby'r",
            "rywrbwywrbbwwryrbbryybwy ywy'bwy'by'by'r",
            "yryrywwywbwbrwrwrbbybrby yryrw'y'wbr'yw'",
            "rrwrbyyyrwbwwwyrbbryybwb ywrywb'r'b'wyw'",
            "rrwybyyyrwbbwwywbrrbyrwb ywyb'r'br'b'w'r'b'",
            "rywrbyywrwbrwrybbbryywwb ywb'rb'wb'rbrb'",
            "rywbbyywrwbbwrywbyrryrwb ywb'rbrb'yb'rb'",
            "ywybybwrwywrryrbrybrbwbw ywy'b'rw'yw'r'w'r'",
            "rrwybwyyrbbwwwyrbrrbybwy ywbyr'b'ryrw'b"]
    ].forEach((p, l) => {
        pl = (p.length + p.length % 2) / 2
        canvas = el('c' + (l + 3));
        setCanvasSize(canvas, 2 * w, Math.floor(3 * gh * pl) + 1)
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.font = fontsize + "px serif";
        p.forEach((s, n) => {
            d = gh * 3 * (n % pl)
            ax = n >= pl ? w : 0
            if (l) {
                ctx.textBaseline = "top"
                ctx.fillText(n + 1, ax, d + 2);
            }
            q = s.slice(25)
            CSHORT.forEach((e, i) => {
                drawEdge(size * (3 * i + 1) + ax, gh + d, e + s.slice(6 * i, 6 * i + 3) + e + s.slice(6 * i + 3, 6 * i + 6) + e)
                if (gLanguage == 'russian')
                    q = q.replaceAll(e, CR[i])
            });
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.fillText(q, size * 12 + ax, d + gh * 3 / 2);
        })
    })
    el('c', codeString(gs, 'cpp'))
    Prism.highlightAll();
}

function fs(e) {
    return formatString(e, ',', 3)
}

function tr(p, ...a) {
    return a.reduce((a, e) => a + `<${p} align="${p == 'th' ? 'center' : 'right'}">` + e, '<tr>')
}

//https://htmlcolorcodes.com/colors/shades-of-red/
const CSHORT = [...'ywrb']//order is important
const CR = 'жбкс'
const COLOR = ['yellow', 'white', 'red', '#0096FF']
// const COLOR = ['#FFEA00', 'white', '#880808', '#0096FF']

function drawTriangle(x, y, color, inverted) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / 2, y + (inverted ? 1 : -1) * gh);
    ctx.lineTo(x + size, y);
    ctx.closePath();
    ctx.fillStyle = COLOR[CSHORT.indexOf(color)];
    ctx.fill();
    ctx.stroke();
}

function drawEdge(x, y, s) {
    let i, j, k
    for (j = 0; j < 3; j++) {
        k = [0, 1, 4][j];
        if (j) {
            x -= size * (j == 1 ? 1 : 2)
            y += 2 * gh
        }
        for (i = 0; i < 2 * j + 1; i++, x += size / 2, y += gh * (i % 2 ? -1 : 1)) {
            drawTriangle(x, y, s[i + k], i % 2)
        }
    }
}

function arrow(fx, fy, tx, ty, r) {
    let i, a = Math.atan2(ty - fy, tx - fx)
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.translate(tx - r * Math.cos(a), ty - r * Math.sin(a))
    for (i = 0; i < 2; i++) {
        a += 2 / 3 * Math.PI
        ctx.lineTo(r * Math.cos(a), r * Math.sin(a))
    }
    ctx.closePath()
    ctx.fill()
    ctx.resetTransform()
}

gs = `int code= (27 * sy + 9 * sw + 3 * sb + sr + 81 * pe) << 5;
for(i = 0; i < 5; ++i){
  if(o[i])
    code |= 1 << i;
}`