function load() {
	el('c', codeString(`<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  <script>
    function uploadFiles() {
      let files = document.getElementById('selectfile').files
      gc = files.length
      ga = new Array(gc)
      document.getElementById('p').innerHTML = 'proceeding...'
      let f = (reader, i, j) => () => {
        Object.assign(ga[i], {
          ssize: j ? reader.result.length : 0
          , content: j ? reader.result.slice(0, 20) : ''
          , status: j ? 'ok' : reader.error
        })
        if (!--gc) {
          outResult()
        }
      }
      [...files].forEach((e, i) => {
        ga[i] = { name: e.name, type: e.type, size: e.size }
        let reader = new FileReader()
        reader.onload = f(reader, i, true)
        reader.onerror = f(reader, i, false)
        reader.readAsText(e)
      });
    }

    function objectToTableRow(o) {
      const from = "<>&"
      const to = ["&lt;", "&gt;", "&amp;"]
      return Object.values(o).reduce((a, e) => a + '<td>' +
        String(e).replace(new RegExp("[" + from + "]", 'g'), m => to[from.indexOf(m)]), '<tr>')
    }

    function outResult() {
      document.getElementById('p').innerHTML = ga.reduce((a, e) => a + objectToTableRow(e)
        , '<table><tr><th>' + Object.keys(ga[0]).join('<th>')) + '</table>'
    }
  </script>
</head>

<body>
  Drop or <input type="file" id="selectfile" multiple="" onchange="uploadFiles()">
  <p id="p"></p>
</body>

</html>`,'html', 850))
	Prism.highlightAll();
}

function uploadFiles() {
	let files = el('selectfile').files
	gc = files.length
	ga = new Array(gc)
	el('p').innerHTML = 'proceeding...'
	let f = (reader, i, j) => () => {
		Object.assign(ga[i], {
			ssize: j ? reader.result.length : 0
			, content: j ? reader.result.slice(0, 20) : ''
			, status: j ? 'ok' : reader.error
		})
		if (!--gc) {
			outResult()
		}
	}
	[...files].forEach((e, i) => {
		//e.type группа такая была
		ga[i] = { name: e.name, type: e.type, size: e.size }
		let reader = new FileReader()
		reader.onload = f(reader, i, true)
		reader.onerror = f(reader, i, false)
		reader.readAsText(e)
	});
}

function objectToTableRow(o) {
	const from = "<>&"
	const to = ["&lt;", "&gt;", "&amp;"]
	return Object.values(o).reduce((a, e) => a + '<td>' +
		String(e).replace(new RegExp("[" + from + "]", 'g'), m => to[from.indexOf(m)]), '<tr>')
}

function outResult() {
	el('p').innerHTML = '<table><tr><th>' + Object.keys(ga[0]).join('<th>')
		+ ga.map(e => objectToTableRow(e)).join('') + '</table>'
	// el('p').innerHTML = ga.reduce((a, e) => a + objectToTableRow(e)
	// 	, '<table><tr><th>' + Object.keys(ga[0]).join('<th>')) + '</table>'
}