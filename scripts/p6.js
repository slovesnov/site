function load() {
	const eps = 1e-10
	COLUMNS = 12
	se = new Map();
	//s = ''
	[[1, 2], [1, -1], [2, 1]].forEach(e => {
		n = e[0]
		fn = e[1]
		l = 11 * fn - 719 * n
		for (z = 0; z <= 11; z++) {
			for (k = 0; k < 60; k++) {
				r = 12 * (fn * z - n * (60 * z + k)) / l - z - k / 60
				if (r + eps >= 0 && r < 1 / 60 + eps) {
					t = z + k / 60 + r
					phi = (360 * (t - Math.floor(t)) - 30 * t) / n
					//phi1 = (360 * (60 * t - Math.floor(60 * t)) - 30 * t) / fn
					// if (Math.abs(phi - Math.round(phi)) < 1e-6) {
					//   console.log(phi.toFixed(3),phi1.toFixed(3),t)
					// }
					se.set(t, phi)
				}
				else {
				}
			}
		}

	})
	a = [...se].sort((a, b) => a[1] - b[1]).map(e => e[0].toFixed(3) + ' ' + e[1].toFixed(3))
	// a=[]
	// for(i=0;i<17;i++){
	//   a.push(i)
	// }

	s = '<table id="t">'
	//vertical
	chain = Math.floor(a.length / COLUMNS) + (+(a.length % COLUMNS != 0))
	for (j = 0; j < chain; j++) {
		s += '<tr>'
		for (i = 0; i < COLUMNS; i++) {
			if (j + i * chain < a.length) {
				s += '<td>' + a[j + i * chain]
			}
		}
	}
	//horizontal
	// for (j = 0; j < a.length; j += COLUMNS) {
	//   s += '<tr>'
	//   for (i = 0; i < Math.min(COLUMNS, a.length - j); i++) {
	//     s += '<td>' + a[j + i]
	//   }
	// }
	s += '</table>'
	el('p').innerHTML = "решений: " + se.size + ", таблица пар t, phi, колонок: " + COLUMNS + s
	canv([7.364, 4.636, 2.910, 1.2, 2.4, 3.6, 4.8, 7.2]);
}

function canv(a) {
	c = el('c')
	const R = 80
	const FS = 160;
	const K = [0.9, 0.85, 0.8];
	h = 2 * R
	w = h * a.length
	setCanvasSize(c, w, h)
	c = c.getContext("2d")

	c.lineWidth = 1;
	c.textBaseline = "middle";
	c.textAlign = "center";

	c.translate(h / 2, h / 2)
	k = FS * h / 2 / 700;
	c.font = "bold " + k + "px Times New Roman";
	a.forEach(t => {
		c.beginPath()
		c.arc(0, 0, h / 2, 0, 2 * Math.PI)
		c.stroke()

		for (i = 0; i < 3; i++) {
			c.beginPath()
			c.lineWidth = (2 - i) * 3 + 1;
			c.moveTo(0, 0)
			p = [30, 360, 360 * 60][i] * t * Math.PI / 180 - Math.PI / 2
			r = [.5, .75, .9][i] * R
			c.lineTo(r * Math.cos(p), r * Math.sin(p))
			c.stroke()
		}

		r = h / 2
		for (i = 0; i < 60; i += 5) {
			c.moveTo(0, -r);
			c.lineTo(0, -r * K[1]);
			c.stroke();
			l = r * K[1] - k
			c.fillText((i == 0 ? 12 : i / 5).toString(), 0, -r * K[2] + k / 2);
			c.rotate(2 * 5 * Math.PI / 60);
		}
		c.fillText('t=' + normalize(t, 3), 0, -h * .1)
		c.translate(h, 0)
	})
}