class DigitalFont {
	//fontType=0 or 1
	constructor(width, height, s, fontType = 0) {
		this.fontType = fontType
		let a = this.getK(s);
		this.init(Math.min(width / a[0], height / a[1]));
	}

	initFull(size, thickness, symbolMargin, angleMargin) {
		this.thickness = thickness;
		this.angleMargin = angleMargin === undefined ? DigitalFont.defaultAngleMargin : angleMargin;
		this.symbolMargin = symbolMargin;
		if (this.fontType == 1) {
			this.width = 3 * size;
			this.height = 5 * size;
		}
		else {
			this.width = size + 2 * thickness;
			this.height = 2 * size + 3 * thickness;
		}
	}

	init(size, angleMargin) {
		this.initFull(size, size * DigitalFont.kThickness[this.fontType], size * DigitalFont.kSymbolMargin, angleMargin);
	}

	//get coefficents in sizes return [k_width, k_height]. Full string size [size*k_width,size*k_height]
	getK(_s) {
		let s = String(_s)
		let kt = DigitalFont.kThickness[this.fontType];
		let ks = DigitalFont.kSymbolMargin;
		let colon = (s.match(/:/g) || []).length;
		let length = s.length;
		if (this.fontType == 1) {
			return [length * 3 + ks * (length - 1), 5]
		}
		else {
			/*
			thickness=size*kt;
			symbolMargin=size*ks;
			width=size+2*thickness=size*(1+2*kt);
			height=2*size+3*thickness=size*(2+3*kt);

			r.x = (length-colon)*width+colon*thickness+(length-1)*symbolMargin <=
			(length-colon)*size*(1+2*kt)+colon*size*kt+(length-1)*size*ks =
			size*( (length-colon)*(1+2*kt)+colon*kt+(length-1)*ks )

			r.y = 2*size+3*thickness <= size*(2+3*kt) <=height
			*/
			return [(length - colon) * (1 + 2 * kt) + colon * kt + (length - 1) * ks,
			2 + 3 * kt]
		}
	}

	drawDigit(n, c) {
		let h = this.height * [.5, .2][this.fontType];
		let i, j, x, y, a = n == ':' ? 11 : (n == '-' ? 10 : n);
		let b = DigitalFont.digitCode[this.fontType][a];
		if (this.fontType == 1) {
			const space = 1
			for (i = 0; i < 15; i++, b >>= 1) {
				if (b & 1) {
					c.fillRect((i % 3) * h + space, Math.floor(i / 3) * h + space, h - space, h - space)
				}
			}
			return
		}

		/*bits - in cycle
		up horizontal
		down horizontal
		center horizontal
		left-up vertical
		left-down vertical
		right-up vertical
		right-down vertical

		bits in b - array (inverse order)
		*/
		for (i = 0; i < 7; i++,b>>=1) {
			if (i == 3) {
				//left-up vertical
				a = [0, this.angleMargin,
					0, h - this.thickness / 2 - this.angleMargin,
					this.thickness / 2, h - this.angleMargin / 2,
					this.thickness, h - this.thickness / 2 - this.angleMargin,
					this.thickness, this.thickness + this.angleMargin
				];
			}
			else if (i == 0 || i == 2) {
				//i=0 up horizontal, i=2 center horizontal
				a = i == 0 ? [
					this.thickness + this.angleMargin, this.thickness,
					this.angleMargin, 0
				] : [
					this.thickness + this.angleMargin, h + this.thickness / 2,
					this.thickness / 2 + this.angleMargin, h,
					this.thickness + this.angleMargin, h - this.thickness / 2
				];

				for (j = a.length - 1; j >= 0; j -= 2) {
					a.push(this.width - a[j - 1]);
					a.push(a[j]);
				}
			}

			if (b & 1) { //precedence ok
				//draw edge
				c.beginPath();
				for (j = 0; j < a.length; j += 2) {
					x = a[j];
					if (i > 4) {//symmetry x
						x = this.width - x;
					}
					y = a[j + 1];
					if (i == 1 || i == 4 || i == 6) {//symmetry y
						y = 2 * h - y;
					}
					if (j == 0) {
						c.moveTo(x, y);
					}
					else {
						c.lineTo(x, y);
					}
				}
				c.closePath();
				c.fill();
			}
		}
	}

	drawString(s, c) {
		let i, n;
		c.save()
		for (n of String(s)) {
			if (n == ':' && this.fontType == 0) {
				for (i = 0; i < 2; i++) {
					c.beginPath();
					c.arc(this.thickness / 2, (2 * i + 3) * this.height / 8, this.thickness / 2, 0, 2 * Math.PI);
					c.fill();
				}
				c.translate(this.thickness + this.symbolMargin, 0);
			}
			else {
				this.drawDigit(n, c);
				c.translate(this.width + this.symbolMargin, 0);
			}
		}
		c.restore()
	}

	drawStringInPoint(x, y, s, c) {
		let a = this.getStringSize(s);
		c.save()
		c.translate(x - a[0] / 2, y - a[1] / 2);
		this.drawString(s, c);
		c.restore()
	}

	//string size in pixels
	getStringSize(s) {
		let d = this.getSize();
		return this.getK(s).map(e => e * d);
	}

	//square size
	getSize() {
		if (this.fontType == 1) {
			return this.width / 3;
		}
		else {
			return this.width - 2 * this.thickness;
		}
	}

}
//ff compatibility, constans out of class
//width - full width, height -  full height
//double width, height, angleMargin, thickness, symbolMargin;
DigitalFont.kThickness = [.35, 0]; //.125;
DigitalFont.kSymbolMargin = .2; //.25;
DigitalFont.defaultAngleMargin = 2;
//0,1,2,3,4,5,6,7,8,9,-,:(for fontType=1)
DigitalFont.digitCode = [
	[123, 96, 55, 103, 108, 79, 95, 97, 127, 111, 4],
	[31599, 29850, 29671, 31207, 18925, 31183, 31695, 18727, 31727, 31215, 448, 1040]
]
