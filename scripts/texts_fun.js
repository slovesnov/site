
function load() {
	cell = 100
	canvas = el("c");
	setCanvasSize(canvas,780,301)
	c = canvas.getContext("2d");
	lineheight = 22;
	c.font = lineheight + "px serif";

	c.beginPath();
	for (i = 0; i < 4; i++) {
		c.moveTo(.5, cell * i + .5);
		c.lineTo(cell * 3 + .5, cell * i + .5);
		c.moveTo(cell * i + .5, .5);
		c.lineTo(cell * i + .5, cell * 3 + .5);
	}
	for (i = 0; i < 2; i++) {
		c.moveTo(.5, cell * (2 - i) + .5);
		c.lineTo(cell * 3 + .5, cell * (i + 1) + .5);
	}
	c.stroke();

	x = cell * 3 + 180
	y = 62
	c.beginPath();
	c.moveTo(x + .5, y + .5);
	c.lineTo(x + .5, y + cell + .5);
	c.lineTo(x + cell + .5, y + 2 / 3 * cell + .5);
	c.lineTo(x + cell + .5, y + 1 / 3 * cell + .5);
	c.closePath();
	c.stroke();
	c.fillText("2", x + cell * .4, y + cell / 2 + lineheight / 4);

	y = 170
	c.beginPath();
	c.moveTo(x + .5, y + .5);
	c.lineTo(x + 2 * cell + .5, y + .5);
	c.lineTo(x + 2 * cell + .5, y + cell / 3 + .5);
	c.lineTo(x + 3 * cell / 2 + .5, y + cell / 2 + .5);
	c.closePath();
	c.stroke();
	c.fillText("4", x + cell * 1.4, y + cell / 4 + lineheight / 4);

	//x-=20
	y = 230
	c.beginPath();
	c.moveTo(x + .5, y + .5);
	c.lineTo(x + 3 * cell + .5, y + .5);
	c.lineTo(x + 2 * cell + .5, y + cell / 3 + .5);
	c.lineTo(x + 2 * cell + .5, y + 2 * cell / 3 + .5);
	c.closePath();
	c.stroke();
	c.fillText("4", x + cell * 1.4, y + cell / 4 + lineheight / 4);

	['прямоугольники\n1x1 9\n2x1 12\n3x1 6\n2x2 4\n2x3 4\n3x3 1\nитого 36\n\nодна диагональ\n1x 20 \n2x 12\n3x 4\nитого 36','две диагонали\n2 + 4 + 4\nитого 10'].forEach((e, j) => {
			e.split('\n').forEach((e, i) => {
				c.fillText(e, cell * 3 + (j ? 180 : 10), 12 + i * lineheight);
			})
		})
}
