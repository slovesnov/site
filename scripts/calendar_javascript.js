function load() {
	gCalendar = new Calendar('calendar', '', updateCalendar, '%d %B %Y', gLanguage == 'russian', Calendar.simagePath);
	t = el('t')
	d = new Date(2017, 11, 3);
	['%a'
		, '%A'
		, '%b'
		, '%B'
		, '%C'
		, '%d'
		, '%D'
		, '%e'
		, '%F'
		, '%h'
		, '%m'
		, '%u'
		, '%w'
		, '%y'
		, '%Y'
		, '%%'
	].forEach(e => {
		r = t.insertRow(-1)
		r.insertCell(-1).innerHTML = e
		for (j = 0; j < 2; j++) {
			r.insertCell(-1).innerHTML = Calendar.getDateFormat(d, e, j)
		}
	});
	s = ''
		;['left2', 'left', 'right', 'right2', 'ok', 'cancel'].forEach((e, i) => {
			s += (i ? ', ' : '') + '<img style="vertical-align:middle" src="' + Calendar.simagePath + '/' + e + '.png">' + e + '.png'
		})
	el('icons', s)

	gs.forEach((e, i) => {
		el('c' + i, codeString(e, i ? "html" : "js", i ? 800 : undefined));
	});
	Prism.highlightAll();

}

function updateCalendar() {
	document.getElementById('out').innerHTML = gCalendar.getDateFormat('%F');
}

gs = [`gCalendar = new Calendar(id, date, callbackFunction, format, language, imagePath);`, `<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="stylesheet" type="text/css" href="https://slovesnov.rf.gd/css/calendar.css">
  <script src="https://slovesnov.rf.gd/scripts/calendar.js"></script>
  <script>
    function load() {
      gCalendar = new Calendar('calendar', '', updateCalendar, '%d %B %Y', 0);
    }

    function updateCalendar(date) {
      //date === gCalendar.getDate()
      document.getElementById('out').innerHTML = gCalendar.getDateFormat('%F');
    }
  </script>
</head>

<body onload="load()">
  <div id="calendar"></div><!-- or <span id="calendar"></span> -->
  <p id="out">
</body>

</html>`]