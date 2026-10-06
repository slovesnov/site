function load() {
	canvas = el("canvas");
	ctx = canvas.getContext("2d");
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
}

function resizeCanvas() {
	gw = window.innerWidth
	gh = window.innerHeight
	setCanvasSize(canvas, gw, gh)
	draw();
}

function draw() {
	let w = canvas.width
	let h = canvas.height

	minX = -1.7
	maxX = 0.5

	maxY = 1.17
	minY = -maxY

	mx = w;
	my = h / 2;

	let imgData = ctx.getImageData(0, 0, w, h);
	t = performance.now()

	j = 0;
	k = (h - 1) * w * 4
	for (y = 0; y < my; y++) {
		for (x = 0; x < mx; x++) {
			zx = cx = minX + (maxX - minX) * x / (w - 1);
			zy = cy = minY + (maxY - minY) * y / (h - 1);

			x2 = zx * zx
			y2 = zy * zy
			for (i = 0; i < 255 && x2 + y2 < 4; i++) {
				xt = zx * zy;
				zx = x2 - y2 + cx;
				zy = 2 * xt + cy;
				x2 = zx * zx
				y2 = zy * zy
			}
			//color=i.toString(16);
			// ctx.fillStyle ='#'+color+color+color;
			////1 -> 11,2->22...f->ff
			if (i < 16) {
				i = i * 17;
			}
			imgData.data[j++] = i;
			imgData.data[j++] = i;
			imgData.data[j++] = i;
			imgData.data[j++] = 255;

			imgData.data[k++] = i;
			imgData.data[k++] = i;
			imgData.data[k++] = i;
			imgData.data[k++] = 255;
		}
		k -= 2 * w * 4
	}

	ctx.putImageData(imgData, 0, 0);

	t = (performance.now() - t) / 1000;//seconds

	i = gMobile ? 16 : 24
	ctx.textBaseline = "bottom";
	ctx.textAlign = "left";
	ctx.fillStyle = '#007070';
	ctx.font = "bold " + i + "px Times New Roman";
	x = gw * .5
	y = gh / 2
	ctx.fillText("time" + formatNumber(t,2) + ' kpts/sec' + ((mx * my) / t / 1000 / 2).toFixed(2), x, y)
	ctx.fillText(w + 'x' + h + ' kpts' + (mx * my / 1000).toFixed(2), x, y + i)
}
