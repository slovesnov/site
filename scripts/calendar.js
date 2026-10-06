/*new Calendar (id, date='', changeFunction=undefined, language=0, format=0,imagePath=undefined)
date='2017-12-31' mysql date format
date='' means current date

imagePath=0 use text instead of icons
imagePath='img/calendar' can be local if you copy images to localhost
*/
class Calendar {
	static simagePath = 'http://slovesnov.rf.gd/img/calendar'

	constructor(id, date = '', changeFunction = null, format = '%F', language = 0, imagePath = undefined) {
		let i, j, k, l;
		if (typeof language == 'boolean') {
			language = language ? 1 : 0
		}

		if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			document.getElementById(id).style.display = 'inline-block';
			document.getElementById(id).style.verticalAlign = 'middle';
		}

		this.id = id;
		if (date instanceof Date) {
			this.d = new Date(date);
			this.startDate = new Date(date);
		}
		else if (date == '') {
			this.d = new Date();
			this.startDate = new Date();//another to avoid copy reference
		}
		else {
			i = parseInt(date.substring(8));
			j = parseInt(date.substring(5, 7) - 1)
			k = parseInt(date.substring(0, 4))
			this.d = new Date(k, j, i);
			this.startDate = new Date(k, j, i);//another to avoid copy reference
		}
		this.a = new Array(7);
		this.changeFunction = changeFunction;
		this.language = language;
		this.format = format;
		this.imagePath = imagePath === undefined ? Calendar.simagePath : imagePath

		j = '<table class="comboboxtable"><tr><td><button class="comboboxbutton"></button><tr><td><div class="comboboxcontent calendar"><table>';
		for (l = 0; l < 8; l++) {
			j += '<tr>'
			if (l == 0) {
				j += '<td colspan=7 class="calendarTop"><table class="calendarbuttonstable"><tr>'
				for (i = 0; i < 6; i++) {
					j += '<td>' + this.imgTag(i)
					if (i == 1) {
						j += '<td style="vertical-align:middle;"><span></span>';
					}
				}
				j += '</table>'
			}
			else if (l == 1) {
				for (i = 0; i < 7; i++) {
					j += '<td class="em">' + Calendar.getDateFormat(new Date(2021, 10, 1 + i), '%a', language);
				}
			}
			else {
				j += '<td>'.repeat(7)
			}
		}
		j += '</table></div></table>'
		document.getElementById(this.id).innerHTML = j;

		this.getDiv().style.display = 'none'

		this.updateButton()

		this.getButton().addEventListener('click', this.clickButton.bind(this, false));
		for (i = 0; i < 6; i++) {
			for (j = 0; j < 7; j++) {
				this.getTD(i + 2, j).addEventListener('click', this.selectDate.bind(this));
			}
		}
		for (i = 0; i < 7; i++) {
			j = this.getTop(i)
			if (j.nodeName == "BUTTON") {
				j.addEventListener('click', this.click.bind(this));
			}
		}
		this.updateTable();
	}

	imgTag(i) {
		//Note if rename dir from calendar to 'calendar' then sourceforge don't see images in dir with that name, even if use direct url from browser
		let p, s
		if (this.imageButtons()) {
			s = ' calendarimagebutton'
			p = '<img src="' + this.imagePath + '/' + ['left2', 'left', 'right', 'right2', 'ok', 'cancel'][i] + '.png">'
		}
		else {
			s = ''
			// p = ['<<', '<', '>', '>>', 'ok', 'X'][i]
			p = ['&#9664;', '&#9666;', '&#9656;', '&#9654;', '&check;', '&cross;'][i]
			// p=['&lArr;','&larr;', '&rarr;',  '&rArr;', '&check;','&cross;'][i]
		}
		return '<button class="comboboxbutton' + s + '">' + p + '</button>'
	}

	imageButtons() {
		return this.imagePath !== 0
	}

	getItem(i) {
		return document.getElementById(this.id).children[0].rows[i].cells[0].children[0]
	}

	getButton() {
		return this.getItem(0);
	}

	getDiv() {
		return this.getItem(1);
	}

	getTable() {
		return this.getDiv().children[0];
	}

	getTD(row, cell) {
		return this.getTable().rows[row].cells[cell];
	}

	getTop(i) {//0..7 buttons left, right,TEXT, left2, right2, ok, cancel
		return this.getTD(0, 0).children[0].rows[0].cells[i].children[0]
	}

	updateTable() {
		let i, j, k, t, a, c, d, wd;
		let day = this.d.getDate();
		this.d.setDate(1);//set day

		i = this.d.getDay();
		wd = i == 0 ? 6 : i - 1;
		i = new Date(this.d);//store with 1st day to
		Calendar.setPrevNextMonth(i, true)
		let prevMonthDays = Calendar.getDaysInMonth(i);
		this.d.setDate(day);

		let monthDays = Calendar.getDaysInMonth(this.d);

		for (k = 0, i = 1; k < 6; k++) {
			for (j = 0; j < 7; j++) {
				t = this.getTD(k + 2, j)
				a = true;
				if (i == 1 && j < wd) {
					this.a[k * 7 + j] = -1;
					d = prevMonthDays + j - wd + 1;
				}
				else if (i > monthDays) {
					this.a[k * 7 + j] = 1;
					d = i - monthDays;
					i++;
				}
				else {
					this.a[k * 7 + j] = 0;
					a = false;
					d = i++;
				}
				t.innerHTML = d;
				c = t.classList.contains("anotherMonth");
				if (c != a) {
					t.classList.toggle("anotherMonth");
				}

				a = i == day + 1;
				c = t.classList.contains("em");
				if (c != a) {
					t.classList.toggle("em");
				}
			}
		}
		this.getTop(2).innerHTML = this.getDateFormat("%B %Y")
	}

	updateButton() {
		this.getButton().innerHTML = this.getDateFormat() + ' &#9662;';
	}

	clickButton(ok) {
		if (ok) {
			this.startDate = new Date(this.d);//another Date to remove copy reference
			this.updateButton();
			if (typeof this.changeFunction == "function") {
				this.changeFunction(this.d);
			}
		}
		else {
			this.d = new Date(this.startDate);//another Date to remove copy reference
		}
		let i = this.getDiv().style.display == 'none';
		this.getDiv().style.display = i ? 'block' : 'none';
		if (i) {
			this.updateTable();
		}
	}

	setDate(date, closeCalendar = 1) {
		this.d = date;
		this.updateButton()
		this.clickButton(true);
		if (closeCalendar) {
			this.getDiv().style.display = 'none';
		}
	}

	getDate() {
		return this.d
	}

	selectDate(event) {
		this.click(event);
		this.clickButton(true);
	}

	click(event) {
		let i, j, k, l;
		for (i = 0; i < 7; i++) {
			//even if image inside button (ok, cancel) event.target=image
			if (this.getTop(i) == event.target || this.getTop(i).children.length == 1 && this.getTop(i).children[0] == event.target) {
				if (i == 1 || i == 3) {
					Calendar.setPrevNextMonth(this.d, i == 1);
					this.updateTable();
				}
				else if (i == 0 || i == 4) {
					//if current year is leap then next & previous is not leap, correct date
					if (this.d.getDate() == 29 || this.d.getMonth == 1) {
						this.d.setDate(28);
					}
					this.d.setFullYear(this.d.getFullYear() + (i == 0 ? -1 : 1));
					this.updateTable();
				}
				else {//ok, cancel buttons i==5,6
					this.clickButton(i == 5);
				}
				return;
			}
		}

		for (i = 0; i < 6; i++) {
			for (j = 0; j < 7; j++) {
				if (this.getTD(i + 2, j) == event.target) {
					l = this.getTD(i + 2, j).innerHTML
					k = this.a[i * 7 + j];
					if (k != 0) {
						Calendar.setPrevNextMonth(this.d, k == -1);
					}
					//set date after set month, because can click on prev month 31 oct if current month is nov 
					//(31 of nov is not exist so set date 31 after set month)
					this.d.setDate(l);
					this.updateTable();
					return;
				}
			}
		}
	}

	getDateFormat(format, language) {
		return Calendar.getDateFormat(this.d, format ? format : this.format, language ? language : this.language)
	}

	static getDaysInMonth(date) {
		let m = date.getMonth();
		let i = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
		let k = date.getFullYear();
		if (m == 1 && (k % 4 == 0 && (k % 100 != 0 || k % 400 == 0))) {
			i++;
		}
		return i;
	}

	//date is changed
	static setPrevNextMonth(date, prev) {
		let m = date.getMonth();
		let y = date.getFullYear();
		if (prev) {
			if (m == 0) {
				m = 11;
				y--;
			}
			else {
				m--;
			}
		}
		else {
			if (m == 11) {
				m = 0;
				y++;
			}
			else {
				m++;
			}
		}
		//adjust day. eg. if switch from 31 dec to november should correct day
		let i = Calendar.getDaysInMonth(new Date(y, m, 1))
		if (i < date.getDate()) {
			date.setDate(i)
		}
		date.setMonth(m);
		date.setFullYear(y);
		return date
	}

	/*
	https://www.cplusplus.com/reference/ctime/strftime/
	%a	Abbreviated weekday name *	Thu
	%A	Full weekday name *	Thursday
	%b	Abbreviated month name *	Aug
	%B	Full month name *	August
	%C	Year divided by 100 and truncated to integer (00-99)	20
	%d	Day of the month, zero-padded (01-31)	23
	%D	Short MM/DD/YY date, equivalent to %m/%d/%y	08/23/01
	%e	Day of the month, space-padded ( 1-31)	23
	%F	Short YYYY-MM-DD date, equivalent to %Y-%m-%d	2001-08-23
	%h	Abbreviated month name * (same as %b)	Aug
	%m	Month as a decimal number (01-12)	08
	%u	ISO 8601 weekday as number with Monday as 1 (1-7)	4
	%w	Weekday as a decimal number with Sunday as 0 (0-6)	4
	%y	Year, last two digits (00-99)	01
	%Y	Year	2001
	%%	A % sign	%
	*/
	static getDateFormat(d, format = '%F', language = 0) {
		let r = '', e, b = false, a;
		let l = typeof language == 'string' ? language : (language ? 'ru-RU' : 'en-EN')
		for (e of format) {
			if (b) {
				switch (e) {
					case 'a':
						r += d.toLocaleDateString(l, { weekday: 'short' });
						break;
					case 'A':
						r += d.toLocaleDateString(l, { weekday: 'long' });
						break;
					case 'b':
					case 'h':
						r += d.toLocaleDateString(l, { month: 'short' });
						break;
					case 'B':
						r += d.toLocaleDateString(l, { month: 'long' });
						break;
					case 'C':
						r += Math.floor(d.getFullYear() / 100);
						break;
					case 'd':
						r += String(d.getDate()).padStart(2, '0');
						break;
					case 'D':
						r += Calendar.getDateFormat(d, '%m/%d/%y', l);
						break;
					case 'e':
						r += String(d.getDate()).padStart(2, ' ');
						break;
					case 'F':
						r += Calendar.getDateFormat(d, '%Y-%m-%d', l);
						break;
					case 'm':
						r += String(d.getMonth() + 1).padStart(2, '0');
						break;
					case 'u':
						a = d.getDay()
						r += a ? a : 7;
						break;
					case 'w':
						r += d.getDay();
						break;
					case 'y':
						r += String(d.getFullYear() % 100).padStart(2, '0');
						break;
					case 'Y':
						r += d.getFullYear();
						break;
					case '%':
						r += '%';
						break;
					default:
						throw new Error("Invalid format %" + e)
				}
				b = false
			}
			else {
				b = e == '%'
				if (!b) {
					r += e;
				}
			}
		}
		return r;
	}

	static setLocalImagePath(absolute = false) {
		//console.log("Calendar.setLocalImagePath()")
		Calendar.simagePath = (absolute ? '/' : '') + "img/calendar"
	}

}