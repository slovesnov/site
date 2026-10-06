/*combobox with html tags which allow use several comboboxes on one page

creation comboLanguageSelector=new Combobox ( div or span id
	,selected_index
	,html1 
	,html2
	,...
	,changeFunction
	,buttonTextFunction
);
changeFunction, buttonTextFunction - are optional parameters

or using object
comboLanguageSelector=new Combobox({
	id:
	,index:
	,data:['<img src="img/en.gif"> en', '<img src="img/ru.gif"> ru']
	,changeFunction:
	,buttonTextFunction:
})
	
//get selected index
comboLanguageSelector.index
*/

class Combobox {
	constructor(...a) {
		let i, j, o;

		if (typeof a[0] === 'object' && !Array.isArray(a[0])) {
			o = a[0]
		}
		else {
			if (Array.isArray(a[0])) {
				a = a[0]
			}
			i = a.findIndex(e => typeof e == 'function');
			o = {
				id: a[0]
				, index: a[1]
				, data: a.slice(2, i == -1 ? undefined : i)
			}
			const f = ['changeFunction', 'buttonTextFunction']
			if (i != -1) {
				for (j = 0; i < a.length && j < f.length; i++, j++) {
					o[f[j]] = a[i]
				}
			}
		}

		if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			document.getElementById(o.id).style.display='inline-block';
			document.getElementById(o.id).style.verticalAlign ='middle';
		}

		this.id = o.id;
		this.table = Array.isArray(o.data[0])
		if (this.table) {
			i = '<table class="comboboxinnertable">' + o.data.map(e => '<tr class="comboboxitem">' + e.map(e => '<td>' + e).join('') + '').join('') + '</table>'
		}
		else {
			i = o.data.map(e => '<div class="comboboxitem">' + e + '</div>').join('')
		}
		document.getElementById(this.id).innerHTML = '<table class="comboboxtable"><tr><td><button class="comboboxbutton"></button><tr><td><div class="comboboxcontent">' + i + '</div></table>'

		//set buttonTextFunction before this.setIndex
		this.buttonTextFunction = o.buttonTextFunction;
		this.setIndex(o.index);
		//set changeFunction after setIndex (to not call changeFunction()), because object isn't created
		this.changeFunction = o.changeFunction;
		document.addEventListener('click', this.click.bind(this));
	}

	getItem(i) {
		return document.getElementById(this.id).children[0].rows[i].cells[0].children[0];
	}

	getButton() {
		return this.getItem(0)
	}

	getDiv() {
		return this.getItem(1)
	}

	getIndex() {
		return this.index;
	}

	setIndex(index) {
		this.index = index;
		this.updateButton()
		if (typeof this.changeFunction == "function") {
			this.changeFunction(index);
		}
	}

	updateButton() {
		this.getButton().innerHTML = (this.buttonTextFunction ? this.buttonTextFunction(this.index)
			: this.getDiv().children[this.index].innerHTML) + ' &#9662;'
	}

	click(event) {
		let i, c, div = this.getDiv(), t = event.target;
		//t.parentElement click on image inside button
		if ([t, t.parentElement].includes(this.getButton())) {
			div.classList.toggle('comboboxshow');
		}
		else {
			c = div.children;
			if (this.table) {
				c = c[0].rows;
				t = t.parentElement
			}
			if(t!=null){//t==null html & this.table
				//t.parentElement image inside <img>
				i = [...c].findIndex(e => [t, t.parentElement].includes(e))
				if (i != -1) {
					this.setIndex(i);
				}
			}
			div.classList.remove('comboboxshow');
		}
	}
}