// "use strict";
class ExpressionEstimator {
	/* 	m_expression;
		m_tokenValue;
		m_operator;
		m_position;
		m_argument;
		m_arguments;
		m_root;
	 */
	#isLetter() {
		return /[A-Z]/.test(this.m_expression[this.m_position]);
	}

	#isDigit() {
		return /\d/.test(this.m_expression[this.m_position]);
	}

	#isPoint() {
		return this.m_expression[this.m_position] == '.';
	}

	#isDigitOrPoint() {
		return this.#isDigit() || this.#isPoint();
	}

	#isFunctionSymbol() {
		return /\w/.test(this.m_expression[this.m_position]);
	}

	static CONSTANT_NAME = [
		"PI", "E", "SQRT2", "SQRT1_2", "LN2",
		"LN10", "LOG2E", "LOG10E"
	];
	static CONSTANT_VALUE = [
		Math.PI, Math.E, Math.SQRT2, Math.SQRT1_2, Math.LN2, Math.LN10,
		Math.LOG2E, Math.LOG10E
	];

	static FUNCTION = [
		"POW", "ATAN2", "MIN", "MAX", "SIN", "COS",
		"TAN", "COT", "SEC", "CSC", "ASIN", "ACOS", "ATAN", "ACOT", "ASEC",
		"ACSC", "SINH", "COSH", "TANH", "COTH", "SECH", "CSCH", "ASINH",
		"ACOSH", "ATANH", "ACOTH", "ASECH", "ACSCH", "RANDOM", "CEIL", "FLOOR",
		"ROUND", "ABS", "SIGN", "EXP", "LOG", "SQRT"
	];

	static T = "+-*/()[]{},^";
	static R = '#';

	#getToken() {
		let i, j, c, d, n, p, r, token, er
		if (this.m_position == this.m_expression.length) {
			this.m_operator = OPERATOR_ENUM.END;
		} else if ((p = ExpressionEstimator.T.indexOf(this.m_expression[this.m_position])) != -1) {
			this.m_position++;
			this.m_operator = p;
		} else if (this.#isLetter()) {
			for (
				i = this.m_position++;
				this.m_position < this.m_expression.length && this.#isFunctionSymbol();
				this.m_position++
			);
			token = this.m_expression.substring(i, this.m_position);

			if (token[0] == 'X' && token.length > 1 && /\d/.test(token[1])) {
				j = parseInt(token.substring(1));
				if (this.m_arguments < j + 1) {
					this.m_arguments = j + 1;
				}
				this.m_operator = OPERATOR_ENUM.X;
				this.m_tokenValue = j;
			} else {
				i = ExpressionEstimator.FUNCTION.indexOf(token);
				if (i == -1) {
					i = ExpressionEstimator.CONSTANT_NAME.indexOf(token);
					if (i == -1) {
						throw new Error(`unknown keyword ${token}`);
					}
					this.m_tokenValue = ExpressionEstimator.CONSTANT_VALUE[i];
					this.m_operator = OPERATOR_ENUM.NUMBER;
				} else {
					this.m_operator = i + OPERATOR_ENUM.POW;
				}
			}
		} else if (this.#isDigitOrPoint()) {
			this.m_operator = OPERATOR_ENUM.NUMBER;
			p = this.m_expression.substring(this.m_position);
			//binary, octal, hex numbers
			if (
				p[0] == '0' && this.m_position + 1 < this.m_expression.length
				&& (n = "BOX".indexOf(p[1])) != -1
			) {
				r = [2, 8, 16][n];
				er = false;
				token = ['', ''];
				i = 0;
				for (
					this.m_position += 2;
					this.m_position < this.m_expression.length && (this.#isFunctionSymbol() || this.#isPoint());
					this.m_position++
				) {

					if (this.#isPoint()) {
						if (++i > 1) {
							er = true;
							break;
						}
					} else {
						c = this.m_expression[this.m_position];
						//intval("1ff",8)=1
						if (r == 16 && !/[\dA-F]/.test(c) || r != 16 && c.charCodeAt(0) - '0'.charCodeAt(0) >= r) {
							er = true;
							break;
						}
						token[i] += c;
					}
				}
				if (er || (token[0] == '' && token[1] == '')) {
					throw new Error("invalid " + ["binary", "octal", "hex"][n] + " constant");
				}
				this.m_tokenValue = 0;
				for (i = 0; i < 2; i++) {
					if (token[i] != '') {
						d = i ? r ** token[1].length : 1;
						this.m_tokenValue += parseInt(token[i], r) / d;
					}
				}
			} else {
				c = /^(\d+\.?\d*|\.\d+)(E[+-]?\d+)?/.exec(this.m_expression.substring(this.m_position))
				if (c === null) {
					throw new Error("invalid number");
				}
				c = c[0];
				this.m_tokenValue = parseFloat(c);
				this.m_position += c.length;
			}
		} else {
			throw new Error("unknown symbol ".this.m_expression[this.m_position]);
		}
	}

	#parse(n = 0) {
		let node
		const a = [[OPERATOR_ENUM.PLUS, OPERATOR_ENUM.MINUS], []
			, [OPERATOR_ENUM.MULTIPLY, OPERATOR_ENUM.DIVIDE], [OPERATOR_ENUM.POW]]
		if (n == 1) {
			if (this.m_operator == OPERATOR_ENUM.MINUS) {
				this.#getToken();
				return new Node(this, OPERATOR_ENUM.UNARY_MINUS, this.#parse(n + 1));
			} else {
				if (this.m_operator == OPERATOR_ENUM.PLUS) {
					this.#getToken();
				}
				return this.#parse(n + 1);
			}
		}
		if (n == 4) {
			return this.#parse4()
		}
		node = this.#parse(n + 1);
		while (a[n].includes(this.m_operator)) {
			node = new Node(this, this.m_operator, node);
			this.#getToken();
			if (a[0].includes(this.m_operator)) {//here a[0]
				throw new Error("two operators in a row");
			}
			node.m_right = this.#parse(n + 1);
		}
		return node;
	}

	#parse4() {
		let args, node, open;
		if (this.m_operator >= OPERATOR_ENUM.POW && this.m_operator <= OPERATOR_ENUM.SQRT) {
			if (this.m_operator <= OPERATOR_ENUM.MAX) {
				args = 2;
			} else {
				args = this.m_operator == OPERATOR_ENUM.RANDOM ? 0 : 1;
			}

			node = new Node(this, this.m_operator);
			this.#getToken();
			open = this.m_operator;
			if (
				this.m_operator != OPERATOR_ENUM.LEFT_BRACKET
				&& this.m_operator != OPERATOR_ENUM.LEFT_SQUARE_BRACKET
				&& this.m_operator != OPERATOR_ENUM.LEFT_CURLY_BRACKET
			) {
				throw new Error("open bracket expected");
			}
			this.#getToken();

			if (args > 0) {
				node.m_left = this.#parse();

				if (args == 2) {
					if (this.m_operator != OPERATOR_ENUM.COMMA) {
						throw new Error("comma expected");
					}
					this.#getToken();
					node.m_right = this.#parse();
				}
			}
			this.#checkBracketBalance(open);
		} else {
			switch (this.m_operator) {

				case OPERATOR_ENUM.X:
				case OPERATOR_ENUM.NUMBER:
					node = new Node(this, this.m_operator, this.m_tokenValue);
					break;

				case OPERATOR_ENUM.LEFT_BRACKET:
				case OPERATOR_ENUM.LEFT_SQUARE_BRACKET:
				case OPERATOR_ENUM.LEFT_CURLY_BRACKET:
					open = this.m_operator;
					this.#getToken();
					node = this.#parse();
					this.#checkBracketBalance(open);
					break;

				default:
					throw new Error("unexpected operator");
			}
		}
		this.#getToken();
		return node;
	}

	static calculate(e) {
		return new ExpressionEstimator(e).calculate();
	}

	compile(expression, ...variables) {
		variables = Array.isArray(variables[0]) ? variables[0] : variables;
		let v = variables, t, m;
		let s = expression.replace(/\s+/g, "").replace(/\*{2}/g, "^");
		if (s.includes(ExpressionEstimator.R)) {
			throw new Error(ExpressionEstimator.R + " found in string");
		}
		if (v.length) {
			//make copy
			v.slice().sort().forEach((e, i, a) => {
				t = e.toUpperCase();
				if (ExpressionEstimator.CONSTANT_NAME.includes(t) || ExpressionEstimator.FUNCTION.includes(t)) {
					throw new Error(
						`reserved word \"${t}\" is used as variable`
					);
				}
				//also check empty
				if (!/^_*[A-Za-z]\w*/.test(e)) {
					throw new Error(`invalid variable name "${e}"`);
				}
				if (i > 0 && e == a[i - 1]) {
					throw new Error(`repeated variable "${e}" in list`);
				}
			});

			variables.forEach((e, i) => s = s.replace(new RegExp("\\b" + e + "\\b", 'g'), ExpressionEstimator.R + i))

			if ((m = /\b[xX]\d*\b/.test(s))) {
				throw new Error(`unknown variable \"${m[0]}\"`);
			}

			s = s.replaceAll(ExpressionEstimator.R, 'X');
		}
		this.m_position = 0;
		this.m_arguments = v.length;
		this.m_expression = s.toUpperCase();
		this.m_root = null;
		this.m_argument = null;

		t = variables.find(e => typeof e != 'string')
		if (t !== undefined) {
			throw new Error(`variable ${t} is not a string`);
		}

		this.#getToken();
		if (this.m_operator == OPERATOR_ENUM.END) {
			throw new Error("unexpected end of expression");
		}
		this.m_root = this.#parse();
		if (this.m_operator != OPERATOR_ENUM.END) {
			throw new Error("end of expression expected");
		}
	}

	calculate(...a) {
		let v = Array.isArray(a[0]) ? a[0] : a;
		this.m_argument = v;
		if (typeof this.m_root == 'undefined') {
			throw new Error('Expression is not compiled or compiled with error');
		}
		if (v.length != this.m_arguments) {
			throw new Error('Invalid number of arguments');
		}
		return this.m_root.calculate(...v);
	}

	#checkBracketBalance(open) {
		if (this.m_operator != open + 1) {
			throw new Error(
				"close bracket expected or another type of close bracket"
			);
		}
	}

	constructor(...a) {
		if (a.length) {//check for non empty constructor
			this.compile(...a)
		}
	}

	getArgument(n) {
		return this.m_argument[n];
	}

}

/*
notes for OPERATOR_ENUM 
PLUS should be first in enum. Common operators should go in a row. Order is important. 
POW, ATAN2, MIN, MAX should go in a row see parse3 function
PLUS-POW should go in row getToken()
POW-SQRT should go in row from parse3()
finally PLUS should be first, PLUS-SQRT should goes in row
*/
class OPERATOR_ENUM {
	static get PLUS() { return 0; }
	static get MINUS() { return 1; }
	static get MULTIPLY() { return 2; }
	static get DIVIDE() { return 3; }
	static get LEFT_BRACKET() { return 4; }
	static get RIGHT_BRACKET() { return 5; }
	static get LEFT_SQUARE_BRACKET() { return 6; }
	static get RIGHT_SQUARE_BRACKET() { return 7; }
	static get LEFT_CURLY_BRACKET() { return 8; }
	static get RIGHT_CURLY_BRACKET() { return 9; }
	static get COMMA() { return 10; }
	static get POW() { return 11; }
	static get ATAN2() { return 12; }
	static get MIN() { return 13; }
	static get MAX() { return 14; }
	static get SIN() { return 15; }
	static get COS() { return 16; }
	static get TAN() { return 17; }
	static get COT() { return 18; }
	static get SEC() { return 19; }
	static get CSC() { return 20; }
	static get ASIN() { return 21; }
	static get ACOS() { return 22; }
	static get ATAN() { return 23; }
	static get ACOT() { return 24; }
	static get ASEC() { return 25; }
	static get ACSC() { return 26; }
	static get SINH() { return 27; }
	static get COSH() { return 28; }
	static get TANH() { return 29; }
	static get COTH() { return 30; }
	static get SECH() { return 31; }
	static get CSCH() { return 32; }
	static get ASINH() { return 33; }
	static get ACOSH() { return 34; }
	static get ATANH() { return 35; }
	static get ACOTH() { return 36; }
	static get ASECH() { return 37; }
	static get ACSCH() { return 38; }
	static get RANDOM() { return 39; }
	static get CEIL() { return 40; }
	static get FLOOR() { return 41; }
	static get ROUND() { return 42; }
	static get ABS() { return 43; }
	static get SIGN() { return 44; }
	static get EXP() { return 45; }
	static get LOG() { return 46; }
	static get SQRT() { return 47; }
	static get X() { return 48; }
	static get NUMBER() { return 49; }
	static get UNARY_MINUS() { return 50; }
	static get END() { return 51; }
}

class Node {
	//m_estimator;
	//m_operator;
	//m_value;
	//m_left, m_right;

	constructor(estimator, _operator, p = null) {
		if (typeof p == 'number') {
			this.init(estimator, _operator, p, null);
		} else {
			this.init(estimator, _operator, 0, p);
		}
	}

	init(
		estimator,
		_operator,
		value,
		left
	) {
		this.m_estimator = estimator;
		this.m_operator = _operator;
		this.m_value = value;
		this.m_left = left;
		this.m_right = null;
	}

	calculate() {
		let l = this.m_left ? this.m_left.calculate() : 0;
		let r = this.m_right ? this.m_right.calculate() : 0;
		switch (this.m_operator) {

			case OPERATOR_ENUM.NUMBER:
				return this.m_value;

			case OPERATOR_ENUM.PLUS:
				return l + r;

			case OPERATOR_ENUM.MINUS:
				return l - r;

			case OPERATOR_ENUM.MULTIPLY:
				return l * r;

			case OPERATOR_ENUM.DIVIDE:
				return l / r;

			case OPERATOR_ENUM.UNARY_MINUS:
				return -l;

			case OPERATOR_ENUM.SIN:
				return Math.sin(l);

			case OPERATOR_ENUM.COS:
				return Math.cos(l);

			case OPERATOR_ENUM.TAN:
				return Math.tan(l);

			case OPERATOR_ENUM.COT:
				return 1 / Math.tan(l);

			case OPERATOR_ENUM.SEC:
				return 1 / Math.cos(l);

			case OPERATOR_ENUM.CSC:
				return 1 / Math.sin(l);

			case OPERATOR_ENUM.ASIN:
				return Math.asin(l);

			case OPERATOR_ENUM.ACOS:
				return Math.acos(l);

			case OPERATOR_ENUM.ATAN:
				return Math.atan(l);

			case OPERATOR_ENUM.ACOT:
				return Math.PI / 2 - Math.atan(l);

			case OPERATOR_ENUM.ASEC:
				return Math.acos(1 / l);

			case OPERATOR_ENUM.ACSC:
				return Math.asin(1 / l);

			case OPERATOR_ENUM.SINH:
				return Math.sinh(l);

			case OPERATOR_ENUM.COSH:
				return Math.cosh(l);

			case OPERATOR_ENUM.TANH:
				return Math.tanh(l);

			case OPERATOR_ENUM.COTH:
				return 1 / Math.tanh(l);

			case OPERATOR_ENUM.SECH:
				return 1 / Math.cosh(l);

			case OPERATOR_ENUM.CSCH:
				return 1 / Math.sinh(l);

			case OPERATOR_ENUM.ASINH:
				return Math.asinh(l);

			case OPERATOR_ENUM.ACOSH:
				return Math.acosh(l);

			case OPERATOR_ENUM.ATANH:
				return Math.atanh(l);

			case OPERATOR_ENUM.ACOTH:
				return Math.atanh(1 / l);

			case OPERATOR_ENUM.ASECH:
				return Math.acosh(1 / l);

			case OPERATOR_ENUM.ACSCH:
				return Math.asinh(1 / l);

			case OPERATOR_ENUM.RANDOM:
				return Math.random();

			case OPERATOR_ENUM.CEIL:
				return Math.ceil(l);

			case OPERATOR_ENUM.FLOOR:
				return Math.floor(l);

			case OPERATOR_ENUM.ROUND:
				return Math.round(l);

			case OPERATOR_ENUM.ABS:
				return Math.abs(l);

			case OPERATOR_ENUM.SIGN:
				return Math.sign(l);

			case OPERATOR_ENUM.EXP:
				return Math.exp(l);

			case OPERATOR_ENUM.LOG:
				return Math.log(l);

			case OPERATOR_ENUM.SQRT:
				return Math.sqrt(l);

			case OPERATOR_ENUM.POW:
				return Math.pow(l, r);

			case OPERATOR_ENUM.ATAN2:
				return Math.atan2(l, r);

			case OPERATOR_ENUM.MIN:
				return Math.min(l, r);

			case OPERATOR_ENUM.MAX:
				return Math.max(l, r);

			case OPERATOR_ENUM.X:
				return this.m_estimator.getArgument(this.m_value);

			default:
				throw new Error('Node.calculate error');
		}
	}
}