class Complex {
	static get normal() {
		return 0;
	}
	static get polar() {
		return 1;
	}

	static get EPS() {
		return 1e-14
	}

	constructor(x, y = 0, type = Complex.normal) {
		if (x instanceof Complex) {
			this.x = x.x
			this.y = x.y
		}
		else if (type == Complex.normal) {
			this.x = x;
			this.y = y;
		}
		else {
			this.x = x * Math.cos(y)
			this.y = x * Math.sin(y)
		}
	}

	conjugate() {
		return new Complex(this.x, -this.y)
	}

	unaryMinus() {
		return new Complex(-this.x, -this.y)
	}

	r2() {
		return this.x * this.x + this.y * this.y
	}

	r() {
		return Math.sqrt(this.r2())
	}

	phi() {
		return Math.atan2(this.y, this.x)
	}

	eq(c) {
		if (!(c instanceof Complex)) {
			c = new Complex(c)
		}
		this.x = c.x
		this.y = c.y
	}

	add(c) {
		if (!(c instanceof Complex)) {
			c = new Complex(c)
		}
		return new Complex(this.x + c.x, this.y + c.y)
	}

	addEq(c) {
		this.eq(this.add(c))
	}

	sub(c) {
		if (!(c instanceof Complex)) {
			c = new Complex(c)
		}
		return new Complex(this.x - c.x, this.y - c.y)
	}

	subEq(c) {
		this.eq(this.sub(c))
	}

	mul(c) {
		if (!(c instanceof Complex)) {
			c = new Complex(c)
		}
		return new Complex(this.x * c.x - this.y * c.y, this.x * c.y + this.y * c.x)
	}

	mulEq(c) {
		this.eq(this.mul(c))
	}

	div(c) {
		if (!(c instanceof Complex)) {
			c = new Complex(c)
		}
		let cn = this.mul(c.conjugate())
		let r2 = c.r2()
		if (r2 == 0) {
			throw new Error('zero division');
		}
		cn.x /= r2;
		cn.y /= r2;
		return cn
	}

	divEq(c) {
		this.eq(this.div(c))
	}

	root(n) {//pow(c,1/n)
		let r = Math.pow(this.r(), 1 / n)
		let phi = this.phi()
		let i, a = []
		for (i = 0; i < n; i++) {
			a.push(new Complex(r, (phi + 2 * Math.PI * i) / n, Complex.polar))
		}
		return a
	}

	pow(n) {
		let r = Math.pow(this.r(), n)
		let phi = this.phi() * n
		return new Complex(r, phi, Complex.polar)
	}

	toString() {
		let r = '', s
		if (isNaN(this.x) || isNaN(this.y)) {
			return 'nan';
		}
		if (Math.abs(this.x) >= Complex.EPS) {
			r += formatNumber(this.x, 5)
		}
		if (Math.abs(this.y) >= Complex.EPS) {
			s = formatNumber(this.y, 5)
			if (s != 0) {
				if (Math.sign(this.y) == 1 && r != '') {
					r += '+'
				}
				r += (s == '1' ? '' : (s == '-1' ? '-' : s)) + 'i'
			}
		}
		if (r == '') {
			r = '0'
		}
		return r
	}

	isZero() {
		return Math.abs(this.x) < Complex.EPS && Math.abs(this.y) < Complex.EPS
	}

	hasTwoParts() {
		return Math.abs(this.x) >= Complex.EPS && Math.abs(this.y) >= Complex.EPS
	}

}