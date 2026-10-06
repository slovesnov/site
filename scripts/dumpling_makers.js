function load() {
	const w = 400
	const h = Math.ceil(w * Math.cos(Math.PI / 6))
	c = el("c");
	setCanvasSize(c, w, h)
	c = c.getContext("2d")

	const R = 1.4
	const D = 3.5 / 2
	const A = D / Math.cos(Math.PI / 6);
	//A*m=w/2
	const m = Math.floor(w / 2 / A)

	c.translate(w / 2, h / 2)

	c.beginPath()
	for (i = 0; i < 1; i++) {
		c.beginPath()
		c.arc(0, 0, (i ? r : R) * m, 0, 2 * Math.PI)
		c.stroke()
	}

	c.beginPath()
	for (i = 0; i < 6; i++) {
		c.moveTo(A / 2 * m, - D * m)
		c.lineTo(-A / 2 * m, - D * m)
		c.rotate(2 * Math.PI / 6)
	}
	c.font = "32px serif";
	ro = [0, -1 / 4, -1 / 2];
	mu = [[1, 0], [-Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)], [0, -1]];
	ad = ['a', 'r', 'd'];
	[A, R, D].forEach((e, i) => {
		c.moveTo(0, 0)
		c.lineTo(mu[i][0] * e * m, mu[i][1] * e * m)

		c.rotate(ro[i] * Math.PI);
		t = ad[i] + ' ' + (i ? '=' : '≈') + ' ' + e.toFixed(2)
		c.fillText(t, ((i == 1 ? -1 : 1) * e * m - c.measureText(t).width) / 2, -5);
		c.rotate(-ro[i] * Math.PI);
	});

	c.stroke()
}
