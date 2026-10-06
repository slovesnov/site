class Fraction {
	static bigint = 1

	//a, b can be int, bigint, string "0x10", "0b101", "0o12"
	constructor(a = 1, b = 1, norm = true) {
		if (a instanceof Fraction) {
			this.assign(a)
			return
		}
		this.a = Fraction.toType(a)
		this.b = Fraction.toType(b)
		if (norm) {
			this.normalize()
		}
		if (this.b == 0) {
			throw new Error('invalid fraction(' + a + ', ' + b + ')')
		}
	}

	assign(f) {
		this.a = f.a
		this.b = f.b
	}

	static toType(a) {
		if (Fraction.bigint) {
			return typeof a == 'bigint' ? a : BigInt(a)
		}
		if (typeof a != 'number') {
			a=Number(a)
		}
		//Infinity -Infinity NaN or not integer
		if(!Number.isFinite(a) || !Number.isInteger(a)){
			throw new Error('Invalid number('+a+')')
		}
		return a
	}

	isEqual(a, b = 1) {
		if (a instanceof Fraction) {
			return this.a == a.a && this.b == a.b
		}
		else {
			if (a == 0) {
				if (b == 0) {
					return false
				}
				else {
					return this.a == 0
				}
			}
			else {
				//Fraction(1/2).isEqual(3,6)=true
				return this.a * b == this.b * a
			}
		}
	}

	toFracString(plussign = false) {
		return this.signString(plussign) +
			(this.b == 1 ? Fraction.abs(this.a) : '\\frac{' + Fraction.abs(this.a) + '}{' + Fraction.abs(this.b) + '}')
	}

	toString(plussign = false) {
		return this.signString(plussign) + Fraction.abs(this.a) + (this.b == 1 ? '' : '/' + Fraction.abs(this.b))
	}

	static abs(a) {
		return a >= 0 ? a : -a;
	}

	signString(plussign = false) {
		return this.a >= 0 && this.b > 0 || this.a <= 0 && this.b < 0 ? (plussign ? '+' : '') : '-'
	}

	add(a, b = 1) {
		let c, d;
		if (a instanceof Fraction) {
			b = a.b
			a = a.a
		}
		else {
			if (b == 0) {
				throw new Error('invalid fraction in add(' + a + ', ' + b + ')')
			}
		}
		a = Fraction.toType(a)
		b = Fraction.toType(b)
		c = this.a
		d = this.b
		return new Fraction(a * d + b * c, b * d)
	}

	sub(a, b = 1) {
		if (a instanceof Fraction) {
			b = a.b
			a = a.a
		}
		else {
			if (b == 0) {
				throw new Error('invalid fraction in sub(' + a + ', ' + b + ')')
			}
		}
		return this.add(-a, b)
	}

	mul(a, b = 1) {
		if (a instanceof Fraction) {
			b = a.b
			a = a.a
		}
		else {
			if (b == 0) {
				throw new Error('invalid fraction in mul(' + a + ', ' + b + ')')
			}
		}
		a = Fraction.toType(a)
		b = Fraction.toType(b)
		let g = Fraction.gcd(a, b), g1
		a /= g
		b /= g
		g = Fraction.gcd(b, this.a)
		g1 = Fraction.gcd(a, this.b)
		a = (a / g1) * (this.a / g)
		return new Fraction(a, (b / g) * (this.b / g1), false)
	}

	div(a, b = 1) {
		if (a instanceof Fraction) {
			b = a.b
			a = a.a
		}
		else {
			if (a == 0) {
				throw new Error('invalid fraction in div(' + a + ', ' + b + ')')
			}
		}
		return this.mul(b, a)
	}

	addEquals(a, b = 1) {
		this.assign(this.add(a, b))
	}

	subEquals(a, b = 1) {
		this.assign(this.sub(a, b))
	}

	mulEquals(a, b = 1) {
		this.assign(this.mul(a, b))
	}

	divEquals(a, b = 1) {
		this.assign(this.div(a, b))
	}

	normalize() {
		let g = Fraction.gcd(this.a, this.b)
		this.a /= g
		this.b /= g
	}

	static gcd(a, b) {
		let t
		while (b) {
			t = b;
			b = a % b;
			a = t;
		}
		return a;
	}
}
