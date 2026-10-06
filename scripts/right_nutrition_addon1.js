const d = [[
	'курица'
	, 'индейка'
	, 'свинина вырезка'
	, 'свиная шкурка'
	, 'говядина'
	, 'яйцо'
	, 'творог 9%'
	, 'молоко 3.2%'
	, 'сыр сулугуни'
	, 'сыр чанах бжу 21 26 0 b12 1.5'
	, 'минтай'
	, 'мойва'
	, 'печень говяжья'
	, 'печень свиная'
	, 'печень куриная'
]
	, ['хурма'
	, 'яблоки'
	, 'груши'
	, 'мандарины'
	, 'апельсины'
	, 'огурцы'
	, 'помидоры'
	//,'сыр чанах бжу 21 26 11 b12 1.5'
]]
/*average calories for protein foods 6 823.1/12=568
6 823.1 - total calories for protein food
12 - number of protein foods = d[0].length
*/
const protein = 60
const ccal = [800, 1100]
const count = 3
const columns = [['б.всего', 'ж.всего', 'у.всего', 'b12', 'b12.всего', 'кл.', 'кл.всего'], ['р/кг', 'р/1000кк', 'р всего', 'строка в чеке / дата чека']]

function load() {
	redirectUrl()
	/* 	a=d.map(e=>e.map(e=>{
			i= e.indexOf('|')
			return i==-1?e:e.slice(0,i)
		}))
	 */
	//console.log(a)
	fetchpost('../php/right_nutrition_addon1.php', { data: JSON.stringify(d) }, callback, new Date())
}

function callback(s, date) {
	try {
		a = JSON.parse(s)
		//console.log(a)
		p = '';
		for (i = 0; i <= ccal.length; i++) {
			for (m = 0; m < 2; m++) {
				l = +(i != 0)
				p += (l ? '#овощи/фрукты на ' + ccal[i - 1] + ' ккал' : '#белковые продукты') + ' на ' + [`1 из ${count} приёмов пищи`, 'сутки'][m] + '\n'
				a[l].forEach((e, j) => {
					n = d[l][j]
					k = n.indexOf(' бжу');
					if (k == -1) {
						k = n.length
					}
					p += n.slice(0, k) + ' ' + (i == 0 ? protein : ccal[i - 1]) * 100 + '/' + (count == 1 || m ? '' : count + '/') + e + n.slice(k) + '\n'
				});
			}
		}
		//subrecipes:0/1
		recipeLoad({ p, columns, subrecipes: 0, numbers: 1 })
	}
	catch (ex) {
		el('p').style.maxWidth = '800px'
		el('p').innerHTML = s + "<br>" + ex
	}
}