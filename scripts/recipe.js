let gRecipes = [['pancakes', 'оладьи']
	, ['sauerkraut', 'квашеная капуста']
	, ['chicken', 'курица']
	, ['pastila_rhubarb', 'пастила (смоква) из ревеня']
	, ['linden_tea_presentation', 'чай из ферментированных листьев липы']
	, ['ladyfern_braising_presentation', 'тушёный кочедыжник женский']
	, ['apple_icecream', 'яблочное мороженое']
	, ['fireweed', 'иван-чай']
	, ['russula_foetens', 'валуи солёные (квашеные) холодным способом']
	, ['noodles', 'лапша']
	, ['pickled_mushrooms', 'маринованные грибы']
	, ['braised_mushrooms', 'тушёные грибы']
	, ['beet', 'свёкла в микроволновке']
	, ['chebureki', 'чебуреки']
	, ['brackenfern_braised', 'тушёный орляк']
	, ['watermelon_seeds', 'арбузные семечки в микроволновке']
	, ['lard', 'Смалец']
	, ['pickledhot_mushrooms', 'солёные грибы горячим способом']
	, ['macaroni', 'Макароны в микроволновой печи']
	, ['eggs_microwave', 'Яйца в микроволновой печи']
	, ['peanut', 'арахис в микроволновке']
	/*
	 ,['','']
	 */
]

function load() {
	if (gPageName == 'recipe') {
		gRecipes = gRecipes.map(e => [e[0], e[1].toLowerCase()]).sort((a, b) => a[1].localeCompare(b[1]))
		p = gRecipes.map(e => "'" + e[0] + "'").join(',')
		//console.log(p)
		fetchpost('php/recipe.php', { p }, recipeCallback)
		return
	}

	if (gPageName == 'chicken') {
		table("t1", 1, 2, 0, 3, 4);
		gc = 36;
	}
	else if (gPageName == 'peanut') {
		table("t1", 1, 2, 0, 3, 4);
		table("t2", 1, 5);
		table("t3", 6, 7);
	}

	if (typeof gc != 'undefined') {
		inputChanged()
	}

}

function filterrecipe() {
	f = e => e.replace(/ё/gi, 'е')
	c = el('filter')
	//from jm.js
	try {
		r = f(c.value)
		filter = new RegExp(r, 'iu')
		c.style.color = 'black';
		el('ctout').innerHTML = '';
	}
	catch (e) {
		filter = new RegExp('', 'iu');//every string match
		c.style.color = 'red';
		el('ctout').innerHTML = e;
	}

	el('p').innerHTML = gRecipes.filter(e => filter.test(f(e[1])))
		.reduce((a, e, i) => a + '<a href="?' + e[0] + '">' + (i + 1) + '. ' + e[1] + '</a>' + (e[2] ? ' <img class="va" src="img/admin_only16.png">' : '') + '\n', '')
}

function recipeCallback(s) {
	//console.log(s)
	a = JSON.parse(s)
	gRecipes = gRecipes.map((e, i) => [...e, a[i]])
	if (!gAdmin) {
		gRecipes = gRecipes.filter(e => !e[2])
	}
	filterrecipe()
}

function inputChanged() {
	a = trhasError(mass, massresult, 1)
	if (a[0]) {
		timeresult.innerHTML = '?? минут или ??:??';
	}
	else {
		m = a[1] / gc
		timeresult.innerHTML = a[1] + '/' + gc + '=' + m.toFixed(2) + ' минут или ' + timeToString(Math.floor(m * 60));
	}
}

function table(id) {
	var i, s = '<tr>';
	for (i = 1; i < arguments.length; i++) {
		if (arguments[i] == 0) {
			s += '<tr>';
		}
		else {
			s += '<td>' + ref(arguments[i])
		}
	}
	document.getElementById(id).innerHTML = s;
}

function ref(n) {
	var a = gPageName + n;
	return '<a href="img/f/' + a + '.jpg"><img src="img/f/' + a + '-393.jpg"></a>'
}
