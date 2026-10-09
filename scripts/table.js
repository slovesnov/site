//help https://slovesnov.rf.gd/?table_javascript,russian

class Table {
	static #count = 0;
	static tables = [];
	static imagePath = 'https://slovesnov.rf.gd/img/jm/'

	constructor(title, data, options = {}, comparator = []) {
		let i, j, k, l, m, t, o = {}
		//create another object to not change options
		const a1 = ['border', 'color', 'horizontal', 'number', 'sort', 'resetButton']
		const a2 = a1.concat(['id', 'class', 'filter', 'sortColumn', 'sortOrder', 'nstring', 'arrowsColumns', 'visible', 'additionalSortTitle'])
		this.n = Table.#count++
		Table.tables[this.n] = this
		if (typeof options == 'object' && options.permutation) {
			t = options.permutation.map((e, i) => e == -1 ? i : e)
			if (t.sort((a, b) => a - b).some((e, i) => e != i))
				throw new Error('error invalid permutation')
			t = []
			for (i = 0; i < options.permutation.length; i++) {
				t[options.permutation[i] == -1 ? i : options.permutation[i]] = (Array.isArray(title) ? title : title.up)[i]
			}
		}
		else {
			t = Array.isArray(title) ? title : title.up
		}

		t = this.getUpDown(t, true)
		this.title = t
		this.arrowsRow = options.arrowsRow === undefined ? this.title.length - 1 : options.arrowsRow
		this.columns = this.checkRowsGetNumberOfColumns(true)
		this.id = options.id === undefined ? '__table' + this.n : options.id;

		if (options.arrowsRow !== undefined) {
			if (typeof options.arrowsRow == 'number') {
				if (Number.isInteger(options.arrowsRow)) {
					if (options.arrowsRow < 0 || options.arrowsRow >= this.title.length) {
						throw new Error(`options.arrowsRow must be in range [0, ${this.title.length - 1}]`)
					}
				}
				else {
					throw new Error('options.arrowsRow must be a integer')
				}
			}
			else {
				throw new Error('typeof options.arrowsRow must be a number')
			}
		}

		i = Array.isArray(t[0]) ? t[t.length - 1] : t;
		j = typeof options.o == 'string'
		if (typeof options == 'string' || j) {
			i = j ? options.o : options
			a1.forEach(e => {
				o[e] = i.includes(e[0])
			})
			j = i.match(/\d+/)
			if (j) {
				j = j[0]
				if (j.length == 1) {
					j += '0'
				}
				o.sortColumn = Number(j.slice(0, -1))
				o.sortOrder = Number(j.slice(-1))
				if (o.sortColumn >= this.columns) {
					throw new Error('Number of sortColumn should be less than columns')
				}
				if (o.sortOrder > 1) {
					throw new Error('Sort order should be 0 or 1')
				}
			}
		}

		a2.forEach((e, i) => {
			j = options[e]
			if (j !== undefined) {
				if (i < a1.length || ['sortOrder', 'visible'].includes(e)) {
					if (![0, 1, true, false].includes(j)) {
						throw new Error(e + '=' + j + " should be only 0,1,true,false,undefined")
					}
				}
				else if (e == 'id' || e == 'class') {
					if (typeof j != 'string' && typeof j != 'number') {
						throw new Error(e + " should be a function")
					}
				}
				else if (e == 'sortColumn') {
					if (typeof j != 'number' || !Number.isInteger(j) || j < 0 || j >= this.columns) {
						throw new Error("Sort column should be integer number from 0 to number of columns")
					}
				}
				else if (e == 'filter') {
					if (typeof j != 'function') {
						throw new Error("Filter should be a function")
					}
				}
				else if (e == 'arrowsColumns') {
					if (typeof j == 'number' || Array.isArray(j) && j.every(e => typeof e == 'number')) {
					}
					else {
						throw new Error("arrowsColumns should be a number or array of numbers")
					}
				}
				o[e] = j
			}
		})

		this.color = o.color
		this.nstring = o.nstring === undefined ? 'N' : o.nstring
		this.number = +(o.number ?? 0); //always 1 or 0,before checkRowsGetNumberOfColumns(false)
		this.horizontal = o.horizontal
		this.visible = o.visible === undefined ? 1 : o.visible
		this.resetButton = o.resetButton

		if (Array.isArray(title)) {
			t = undefined
		}
		else {
			if (typeof options == 'object' && options.permutation) {
				t = []
				for (i = 0; i < options.permutation.length; i++) {
					t[options.permutation[i] == -1 ? i : options.permutation[i]] = title.down[i]
				}
				if (title.down.class)
					t.class = title.down.class
			}
			else {
				t = title.down
			}
		}
		// t = Array.isArray(title) ? undefined : title.down
		if (Array.isArray(t)) {
			t = this.getUpDown(t, false)
		}
		else if (t != undefined) {
			throw new Error("Title.down invalid type");
		}
		this.downRows = t
		if (this.downRows !== undefined) {
			this.checkRowsGetNumberOfColumns(false)
		}
		if (!Array.isArray(o.additionalSortTitle) && o.additionalSortTitle !== undefined) {
			throw new Error("additionalSortTitle should be an array or undefined");
		}
		this.additionalSortTitle = o.additionalSortTitle;

		//before comparator
		if (data instanceof Map || data instanceof Set) {
			i = [...data]
		}
		else if (Array.isArray(data)) {
			i = data
		}
		else {
			throw new Error('data should be array or map or set');
		}
		if (i.length) {
			if (typeof i[0] !== 'object' || i[0] === null) {
				throw new Error('data[0] should be object or array');
			}
			for (j = 0; ; j++) {//not always array
				if (!Object.hasOwn(i[0], j)) {
					break;
				}
			}
			this.datalength = j
		}
		else {
			this.datalength = 0
		}

		this.data = i.map((e, index) => {
			let a = [];
			//not cut data, e is not always array
			for (j = 0; j < this.datalength; j++) {
				if (typeof options == 'object' && options.permutation) {
					k = options.permutation[j] == -1 ? j : options.permutation[j]
				}
				else {
					k = j
				}
				a[k] = Table.getObject(e[j])
			}
			a.visible = 1;//f===undefined? 1:f(a,i)
			a.class = e.class//css class
			a.index = index;//for reset button
			return a;
		})

		this.comparator = []
		if (!Array.isArray(comparator)) {
			throw new Error('Comparator should be an array')
		}
		if (comparator.length > this.columns) {
			throw new Error('Comparator array length' + comparator.length + ' should not exceed number of columns=' + this.columns)
		}
		for (i = 0; i < this.columns; i++) {
			if ((m = comparator[i]) == undefined) {
				j = [undefined, undefined];
			}
			else {
				if (!Array.isArray(m)) {
					m = [m]
				}
				l = ((this.additionalSortTitle === undefined || this.additionalSortTitle[i] === undefined ? [] : this.additionalSortTitle[i]).length + 1) * 2
				if (j.length > l) {
					throw new Error(`Comparator for column ${i} should be array with max length ${l}, length set ${j.length}`);
				}
				//if not set manually undefined then anyway fill.  [empty × 2, '5d', empty, '4']
				j = []
				for (k = 0; k < l; k++) {
					j.push(m[k])
				}
			}
			k = []

			//create functions for nonempty strings
			j = j.map(e => typeof e == 'string' && e ? Table.createComparator(Table.parse(e, this.datalength)) : e)
			j.forEach((e, i1) => {
				if (!e) {//falsy
					if (i1 % 2) {
						//invert previous function for odd numbers
						m = Table.invertFunction(m)
					}
					else {
						l = j[i1 + 1]
						if (typeof l == 'function') {//next item is valid
							m = Table.invertFunction(l)
						}
						else
							m = Table.createComparator([i, 0])
					}

				}
				else if (typeof e == 'function') {
					m = e
				}
				else {
					throw new Error(`Comparator item is not function or string or falsy expression. Type - ${t}, value - ${e}`);
				}
				k.push(m);
			})

			this.comparator.push(k)
		}

		j = o.arrowsColumns
		this.arrows = typeof j == 'number' ? [j] : j

		this.arrow = o.sort === undefined ? 1 : o.sort
		k = ['table_common'];
		if (o.class) {
			k.push(o.class)
		}
		;['border', 'color'].forEach((e, i) => {
			if (o[e]) {
				if (i == 1 && this.horizontal) {
					k.push('table_h' + e);
				}
				else {
					k.push('table_' + e);
				}
			}
			else if (i == 0) {
				k.push('table_noborder');
			}
		})
		this.class = ' class="' + k.join(' ') + '"'
		i = options.filter
		if (typeof i == 'function') {
			this.filter(i, false)
		}
		else if (typeof i != 'undefined') {
			throw new Error("filter isn't function")
		}
		if (o.sortColumn !== undefined) {
			this.sortc(o.sortColumn, o.sortOrder ? 1 : 0, false)
		}
	}

	getUpDown(t, up) {
		if (Array.isArray(t)) {
			//if all t[i] is arrays then it's rows
			return t.some(e => !Array.isArray(e)) ? [t] : t
		}
		else {
			throw new Error(`${up ? 'up' : 'down'} must be an array`)
		}
	}

	html() {
		let i = '<table id="' + this.id + '"'
			+ (this.class == '' ? '' : ' ' + this.class)
			+ (this.visible ? '' : 'style="display:none"') + '>'
		if (this.horizontal) {
			return i + '<tbody>' + this.body() + '</tbody></table>'
		}
		return i + this.upDown(true)
			+ '<tbody>'
			+ this.body() + '</tbody>' + this.upDown(false) + '</table>'
	}

	body() {
		let s = '', i, j, v, d
		if (this.horizontal) {
			v = this.getVerticalHeads(this.title, true)
			if (this.downRows) {
				d = this.getVerticalHeads(this.downRows, false)
			}
			if (this.number) {
				s += '<tr>'
				s += v[0]
				for (j = 0; j < this.data.length; j++) {
					s += '<td>' + (j + 1)
				}
				if (this.downRows) {
					s += d[0]
				}
			}
			for (i = 0; i < this.columns; i++) {
				s += '<tr>'
				s += v[i + this.number]
				//should use classes because of rowspan td:nth-child(...) is different for same column
				j = 0;
				this.data.forEach(e => {
					if (e.visible) {
						s += '<td' + (e.class || this.color ? ' class="'
							+ (this.color ? 'table_tdc' + (++j) % 5 : '')
							+ (e.class ? (this.color ? ' ' : '') + e.class : '')
							+ '"' : '') + '>' + e[i].s
						// s += '<td' + (this.color ? ' class="table_tdc' + (++j) % 5 + '"' : '') + '>' + e[i].s
					}
				})
				if (this.downRows) {
					s += d[i + this.number]
				}
			}
		}
		else {
			i = 1
			this.data.forEach(e => {
				if (e.visible) {
					s += '<tr' + (e.class ? ' class="' + e.class + '"' : '') + '>' + (this.number ? '<td>' + (i++) : '') + '<td>' + e.slice(0, this.columns).map(e => e.s).join('<td>')
				}
			})
		}
		return s;
	}

	fill() {
		document.getElementById(this.id).tBodies[0].innerHTML = this.body()
	}

	sort(f, fill = true) {
		this.data.sort(f)
		if (fill) {
			this.fill()
		}
	}

	sortc(column, o = 0, fill = true, subcolumn = 0) {
		this.sort(this.comparator[column][subcolumn * 2 + o], fill)
	}

	filter(f, fill = true) {
		this.data.forEach((e, i, a) => e.visible = f(e, i, a))
		if (fill) {
			this.fill()
		}
	}

	filterSort(f, column, o = 0, fill = true, subcolumn = 0) {
		this.filter(f, false)
		this.sortc(column, o, fill, subcolumn)
	}

	upDown(up) {
		if (!up && !this.downRows) {
			return ''
		}
		let title = up ? this.title : this.downRows
		let b, j, k, s, c, st
		return title.reduce((a, e, i) => {
			b = up && i == this.arrowsRow
			j = 0
			if (b) {
				st = '<tr>' + (this.number ? '<th>' + this.nstring : '')
			}
			else {
				st = '<tr' + (e.class ? ' class="' + e.class + '"' : '') + '>'
			}
			return a + e.reduce((a, e, ir) => {
				if (Array.isArray(e)) {
					c = e.length > 1 ? e[1] : 1
					e = e[0]//after c
				}
				else {
					c = 1
				}
				s = e
				j += c
				if (this.arrow && b) {
					if (this.resetButton && !ir) {
						e = Table.tc(this.n) + ' ' + e
					}
					if (this.arrows === undefined || this.arrows.includes(i)) {
						s = '<table width="100%" class="table_noborder"><tr>'
						this.createATA(e, ir).forEach((e, i1) => {
							s += '<td><table align="center" class="table_noborder"><tr>' + Table.th(2) + e;
							for (k = 0; k < 2; k++) {
								s += '<td>' + Table.tc(this.n, ir, k, false, i1) + (k ? '</table>' : '<tr>')
							}
						});
						s += '</table>'
					}
				}
				return a + Table.th(c, false) + s
			}, st) + '<th>'.repeat(this.columns - j + (this.number && !b))
		}, '<thead>') + '<thead>'
	}

	static th(c, rowspan = true) {
		return '<th' + (c == 1 ? '' : ` ${rowspan ? 'row' : 'col'}span="` + c + '"') + '>'
	}

	get(row, column) {
		return this.data[row][column]
	}

	set(row, column, data) {
		let o = Table.getObject(data)
		this.data[row][column] = o
		document.getElementById(this.id).tBodies[0].rows[row].cells[column].innerHTML = o.s
	}

	static getObject(data) {
		let s, v;
		if (Array.isArray(data)) {
			s = data.length >= 1 ? data[0] : ''
			v = data.length >= 2 ? data[1] : s
		}
		else {
			s = v = data
		}
		return { s, v }
	}

	static tc(n, i, j, horizontal = false, subcolumn = 0) {
		let reset = i === undefined//reset button
		return '<img class="table_arrow"'
			+ (reset ? ' style="vertical-align: middle;"' : (2 * j == horizontal ? '' : ' style="transform: rotate(' + (2 * j - horizontal) * 90 + 'deg)"'))
			+ ' src="' + Table.imagePath + (reset ? 'refresh16.png' : 'up8.png')
			+ '" onclick="'
			+ (reset ? 'Table.reset(' + n + ')' : 'Table.sort(' + [n, i, j, subcolumn].join(',') + ')')
			+ '">'
	}

	static reset(n) {
		let t = Table.tables[n];
		t.sort((a, b) => a.index - b.index, true)
	}

	static sort(n, c, o, subcolumn) {
		let t = Table.tables[n];
		t.sortc(c, o, true, subcolumn)
	}

	static parse(s, datalength) {
		let n = [], r, i = 0, j
		s = s.trim()
		for (r of s.matchAll(/(\d+)\s*(asc|desc|a|d)?\s*/ig)) {
			if (r.index != i) {
				throw new Error("Invalid sort string [" + s.substring(i, r.index) + "] full string [" + s + "]")
			}
			j = Number(r[1])
			if (j >= datalength) {
				throw new Error("too big column value " + j)
			}
			n.push(j, r[2] !== undefined && r[2][0] == 'd' ? 1 : 0)
			i = r.index + r[0].length
		}
		if (i != s.length) {
			throw new Error("Invalid sort string [" + s.substring(i) + "] full string [" + s + "]")
		}
		return n
	}

	static createComparator(n) {
		return (a, b) => {
			let i, v, x, y
			for (i = 0; i < n.length; i += 2) {
				x = a[n[i]].v
				y = b[n[i]].v
				v = typeof x == 'string' ? x.localeCompare(y) : x - y
				if (v != 0) {
					return n[i + 1] ? -v : v
				}
			}
			return 0
		}
	}

	static invertFunction(f) {
		return (a, b) => -f(a, b)
	}

	//if up=true check& count number of columns as max(column for each row)
	//if up=false check with additional check for number of columns
	checkRowsGetNumberOfColumns(up) {
		const c = this.columns + this.number
		let t = up ? this.title : this.downRows
		return Math.max(...t.map((e, ind) => {
			if (!Array.isArray(e)) {
				throw new Error('Title' + ind + ' should be array')
			}
			let i = 0
			e.forEach((e, ii) => {
				if (Array.isArray(e)) {
					if (e.length == 1) {
						i++;
					}
					else if (e.length == 2) {
						if (typeof e[1] != 'number' || e[1] <= 0 || !Number.isInteger(e[1])) {
							throw new Error('Title[' + ind + '][' + ii + '][1] should be integer positive number')
						}
						i += e[1]
					}
					else {
						throw new Error('Title[' + ind + '][' + ii + '] should be array with length 1 or 2')
					}
				}
				else {
					i++;
				}
			})
			if (!up) {//additional check 
				if (i > c) {
					throw new Error('Number of columns of title[' + ind + '] exceeds number of columns' + i + ' ' + c)
				}
			}
			return i
		}))
	}

	getVerticalHeads(title, top = false) {
		let i, j, k, ne, fi, a = [], s1, rs, s, t
		if (!Array.isArray(title[0])) {
			title = [title]
		}
		ne = new Array(title.length).fill(0)
		fi = new Array(title.length).fill(0)
		if (this.number && top) {
			title[title.length - 1].unshift(this.nstring)
		}
		for (i = 0; i < this.columns + this.number; i++) {
			s1 = ''
			for (j = 0; j < title.length; j++) {
				t = title[j][fi[j]]
				if (ne[j] == i) {
					if (Array.isArray(t)) {
						s = t[0]
						rs = t.length > 1 ? t[1] : 1;
					}
					else {
						//undefined, string, number...
						s = typeof t == 'undefined' ? '' : t
						rs = 1
					}
					ne[j] += rs
					fi[j]++
					s1 += Table.th(rs)
					if (top && this.arrow && j == this.arrowsRow && (!this.number || i)) {
						this.createATA(s, i - this.number).forEach((e, i1) => {
							s1 += '<table align="center" class="table_noborder"><th>' + e;
							for (k = 0; k < 2; k++) {
								s1 += '<td class="table_tdp0">' + Table.tc(this.n, i - this.number, k, true, i1)
							}
							s1 += '</table>'
						})
					}
					else {
						s1 += s
					}

				}
			}
			a.push(s1)
		}
		if (this.number && top) {
			title[title.length - 1].shift()
		}
		return a
	}

	static setLocalImagePath(absolute = false) {
		//console.log("Table.setLocalImagePath()")
		Table.imagePath = (absolute ? '/' : '') + "img/jm/"
	}

	setVisible(v = true) {
		//if do v?'block':'none' uwaited black line if table has border and visible 
		document.getElementById(this.id).style.display = v ? 'table' : 'none'
	}

	createATA(e, i) {
		let b = [e]
		if (this.additionalSortTitle !== undefined && this.additionalSortTitle[i] !== undefined) {
			if (Array.isArray(this.additionalSortTitle[i])) {
				b = b.concat(this.additionalSortTitle[i])
			}
			else {
				b.push(this.additionalSortTitle[i])
			}
		}
		return b;
	}
}
