function load() {
	ctx = el('canvas').getContext('2d');
	const r = 100;
	const ma = 10
	R = 3.25 * r
	xc = ma + 3 * r
	y1 = ma + 1.5 * r + R
	f = Math.acos(8 / 17)
	f1 = Math.PI - 2 * f

	ctx.font = "40px serif";
	ctx.fillStyle = "#000000";
	["A", "B", "C"].forEach((e, i) => {
		ctx.fillText(e, 90 + i * 2 * r, 100);
	});
	ctx.fillText('D', 90 + 2 * r + 40, 100 + r / 2 + R + 20);
	ctx.fillText('E', 90 + r * Math.cos(f), 90 + r * Math.sin(f) + 60);
	ctx.fillText('F', 90 + 2 * r - 7, 90 + r * Math.sin(f) + 20);

	for (i = 0; i < 3; i++) {
		ctx.setLineDash(i == 1 ? [5, 5] : []);
		ctx.beginPath();
		ctx.arc(ma + (2 * i + 1) * r, ma + r, r, 0, 2 * Math.PI);
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.moveTo(xc, y1)
	ctx.lineTo(ma + r + .5, ma + r + .5)
	ctx.lineTo(ma + 5 * r + .5, ma + r + .5)
	ctx.closePath()
	ctx.lineTo(xc, ma + r)
	ctx.stroke();

	ctx.fillStyle = "#00d";
	ctx.beginPath();
	ctx.moveTo(ma + r, ma + r);
	ctx.arc(ma + r, ma + r, r - 3, f, Math.PI);
	ctx.closePath()
	ctx.fill()

	for (i = 0; i < 3; i++) {
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#d0d";
		ctx.beginPath();
		ctx.arc(ma + r, ma + r, r, f, 2 * Math.PI - f);
		ctx.arc(xc, ma + .5 * r - R, R, Math.PI / 2 + f1 / 2, Math.PI / 2 - f1 / 2, 1);
		ctx.arc(ma + 5 * r, ma + r, r, Math.PI + f, Math.PI - f);
		ctx.arc(xc, ma + 1.5 * r + R, R, -Math.PI / 2 + f1 / 2, -Math.PI / 2 - f1 / 2, 1);
		ctx.stroke();

		if (i) {
			/* 			ctx.beginPath();
						ctx.moveTo(xc,ma+r/2)
						ctx.lineTo(xc,ma+3*r/2)
						ctx.moveTo(ma,ma+r)
						ctx.lineTo(ma+6*r,ma+r)
						ctx.stroke();	
			 */
			a = [xc, ma + r / 2, xc, ma + r / 2 + 30,
				xc, ma + 3 * r / 2, xc, ma + 3 * r / 2 - 30
				, ma, ma + r, ma + 30, ma + r, ma + 6 * r, ma + r, ma + 6 * r - 30, ma + r
			];
			//red,blue,green,cyan
			b = [2, 3, 1, 0]
			ctx.lineWidth = 15;
			c = ["#d00", "#00d", "#0d0", "#0dd"]
			c.forEach((_, j) => {
				ctx.beginPath();
				ctx.strokeStyle = c[i == 1 ? j : b[j]]
				ctx.moveTo(a[4 * j], a[4 * j + 1])
				ctx.lineTo(a[4 * j + 2], a[4 * j + 3])
				ctx.stroke();
			})
		}
		if (i) {
			//horiz
			ctx.setTransform(.35, 0, 0, .35, 54, 440)
		}
		else {
			ctx.setTransform(0, .35, .35, 0, 0, 370)
		}
	}


	//second canvas
	canvas = el('c1');
	ctx = canvas.getContext('2d');
	//https://www.youtube.com/watch?v=NBw_ArYDsoo&list=PL5IJE4Sb2T6kiIsYlqJBzOcItxf5MO8Wy&index=12
	const sx = 30.5, sy = 30.5
	n = 4//колво сегментов
	L = 800//длина окружности
	R = L * n * (1 / 16 + 1 / (4 * n * n))
	// ctx.strokeStyle = "black";
	//ctx.rect(sx, sy, L / n, L / 2)

	a = [L / n / 2, 0
		, L / n / 2, L / 2
		, 0, L / 4
		, L / n / 2, L / 4
		, R, L / 4
		, L / n - R, L / 4
	];
	a.forEach((e, i) => a[i] += i % 2 ? sy : sx)
	ctx.moveTo(a[0], a[1])
	for (i = 0; i < 2; i++) {
		ctx.lineTo(a[2 * i + 2], a[2 * i + 3]);
	}
	ctx.closePath()

	ctx.moveTo(a[4], a[5])
	ctx.lineTo(a[6], a[7]);
	ctx.stroke();

	ctx.font = "40px serif";
	["A", "B", "C", 'D'].forEach((e, i) => {
		ctx.fillText(e, a[2 * i] + (i == 2 ? -30 : 0), a[2 * i + 1] + [-5, 30, 10, 10][i]);
	});

	p = Math.atan2(L / 4, R - L / n / 2)
	for (i = 0; i < 2; i++) {
		ctx.beginPath();
		ctx.arc(a[8 + 2 * i], a[9 + 2 * i], R, (i ? 0 : Math.PI) - p, (i ? 0 : Math.PI) + p);
		ctx.stroke();
	}
	// ctx.fillStyle = "black";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	//third canvas
	canvas = el('c');
	ctx = canvas.getContext('2d');
	L = 600
	n = 4
	R = L * n * (1 / 16 + 1 / (4 * n * n))
	D = L / 2 / 10;//1/10 of height(L/2) припуск
	W = (L + 3 * D) * Math.SQRT2 / 2
	a = Math.asin((L / 4) / R)
	//console.log(a,a*180/Math.PI)
	ctx.rect(.5, .5, W, W)
	ctx.stroke();
	// ctx.moveTo(0, 0)
	// ctx.lineTo(W, W)
	// ctx.moveTo(0, W)
	// ctx.lineTo(W, 0)
	// ctx.stroke();
	for (j = 0; j < 4; j++) {
		ctx.resetTransform()
		// ctx.rect(.5, .5, D * Math.SQRT1_2, D * Math.SQRT1_2)
		// ctx.rect(D * Math.SQRT1_2, D * Math.SQRT1_2, L * Math.SQRT1_2 / 2, L * Math.SQRT1_2 / 2)
		// ctx.stroke();

		ctx.translate(W / 2, W / 2)
		ctx.rotate(Math.PI / 4 + j * Math.PI / 2)
		ctx.translate(-L / n / 2, -L / 2 - D * Math.SQRT1_2 * 2 / 3)

		for (i = 0; i < 2; i++) {
			ctx.beginPath();
			ctx.arc(i ? L / n - R : R, L / n, R, (i ? 0 : Math.PI) - a, (i ? 0 : Math.PI) + a);
			ctx.stroke();
			// ctx.beginPath();
			// ctx.arc(i ? L / n - R : R, L / n, 2,0,2*Math.PI);
			// ctx.stroke();
		}
	}
	/*
	ctx.strokeStyle = "red";
	Q = D * Math.SQRT1_2
	for (j = 0; j < 4; j++) {
		ctx.resetTransform()
		ctx.translate(W / 2, W / 2)
		ctx.rotate(j * Math.PI / 2)
		ctx.translate(-W / 2, -W / 2)

		ctx.beginPath();
		ctx.arc(W / 2 - Q / 2, Q, W / 2 - 3 * Q / 2, Math.PI / 2, Math.PI)
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(Q, W / 2 - Q / 2, W / 2 - 3 * Q / 2, -Math.PI / 2, 0)
		ctx.stroke();
	}*/
}