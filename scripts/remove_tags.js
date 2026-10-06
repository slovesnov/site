
const outID = 'p1'
function load() {
    el('p', `Вставьте текст чтобы убрать таги.<p id='${outID}'></p>`)
    document.addEventListener('paste', pasteEvent)
}

function pasteEvent(e) {
    t = e.clipboardData.getData('text')
    if (t) {
        el(outID, t.replace(/<[^>]+>/g, ' ').replace(/Сейчас в эфире/, '').replaceAll('&nbsp;', ' ').replace(/\s+/g, ' ').trim())
    }
    else {
        out('в буфере обмена нет текста')
    }
}

function out(text, add = false) {
    let o = el(outID)
    o.innerHTML = (add ? o.innerHTML + '<br>' : '') + text
}