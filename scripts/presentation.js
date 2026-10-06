/*aslov originally taken from https://webdesign.tutsplus.com/tutorials/how-to-create-presentation-slides-with-html-and-css--net-19870
and make a lot of modifications

support arrow keys to move next/previous slide
left or up previous
right or down next slide

*/
//two global variables
gScreenStatus = 0
gCurrentSlideNo = 0
const gShowHomeButton = 0
const gButtons = [8962, 9974, 9664, 9654].slice(+!gShowHomeButton);/*127968 127760 8962 home*/

function load(createTableOfContents = false, width, height, addon) {
	let s, i
	if (['multiplication2_presentation', 'multiplication3_presentation'].includes(gPageName)) {
		createTableOfContents = true
		//console.log(createTableOfContents)
	}
	if (gPageName == 'ladyfern_braising_presentation') {
		recipeLoad({
			p: `#рецепт
		кочедыжник 1300 бжу 4.6 0.4 5.5
		масло сливочное 5%
		соль 1%
		чеснок 2%`})
	}
	else if (gPageName == 'linden_tea_presentation') {
		[...document.getElementsByClassName('t')].forEach((e, i) => {
			e.rows[0].cells[0].innerHTML = `<a href="img/presentations/linden_tea${i}0.jpg" target="_blank"><img src="img/presentations/linden_tea${i}.jpg"></a>`
		})
	}
	i = el('presentation-area').style
	if (width !== undefined) {
		i.width = width + 'px'
	}
	if (width !== undefined || height !== undefined) {
		i.height = (height === undefined ? Math.floor(width / 2) : height) + 'px'
	}
	if (createTableOfContents) {
		i = '<li>титульная страница<li>содержание'
		document.querySelectorAll('.heading').forEach((e, j) => {
			if (j) {
				// i += '<p>' + e.innerHTML.trim()
				i += '<li>' + e.innerHTML.trim()
			}
		})
		s = document.createElement('div');
		ra(s, true, 'slide')
		s.innerHTML = '<div class="heading">содержание</div><div class="content grid center"><ol style="text-align:left;margin:0px;">' + i + '</ol></div>' + (addon === undefined ? '' : addon)
		i = getSlides()[1]
		i.parentElement.insertBefore(s, i)
	}
	if (gVideoStr.length) {
		getSlides()[0].children[0].innerHTML = gVideoStr
	}

	//add buttons after createTableOfContents
	s = '<section class="navigation_pages">'
	for (i = 0; i < getSlidesN(); i++) {
		s += '<button class="page_button" onclick="bclick(' + i + ')" id="b' + i + '">' + (i + 1) + '</button> '
	}
	s += '</section><section class="navigation">' + gButtons.reduce((a, e, i) =>
		a + `<button id="n${i}" class="btn" onclick="bclick(${-i - 1})">&#${e};</button>`, '') + '</section>'
	el('presentation-area').innerHTML += s

	window.addEventListener("keydown", keydown);
	//catch F11
	window.onresize = () => {
		//check only heigth allow works with debug mode is on
		let l = window.screen.height == window.innerHeight
		if (l != gScreenStatus) {
			gScreenStatus = l
			// console.log(gScreenStatus)
			ra(el('presentation-area'), gScreenStatus, 'full-screen');
		}
	}
	bclick(0)
}

function bclick(n) {
	if (n < 0) {
		if (n == -gButtons.length + 3) {
			location.href = "?index";
			return
		}
		if (n == -gButtons.length + 2) {
			gScreenStatus = !gScreenStatus
			// console.log(gScreenStatus)
			if (gScreenStatus) {
				openFullscreen()
			}
			else {
				closeFullscreen()
			}
			ra(el('presentation-area'), gScreenStatus, 'full-screen');
			return
		}
	}
	getCurrentSlide().classList.remove("show");
	ra(el('b' + gCurrentSlideNo), false, 'current')
	if (n < 0 && (n == -gButtons.length || n == -gButtons.length + 1)) {
		gCurrentSlideNo += (n == -gButtons.length ? 1 : -1);
	}
	else {
		gCurrentSlideNo = n;
	}
	getCurrentSlide().classList.add("show");
	for (i = 0; i < 2; i++) {
		el('n' + (i + gButtons.length - 2)).style.visibility = gCurrentSlideNo == (i ? getSlidesN() - 1 : 0) ? 'hidden' : 'visible'
	}
	ra(el('b' + gCurrentSlideNo), true, 'current')
}

function keydown(e) {
	let l, k = e.key
	//console.log(e)
	l = Number(k)
	if (l >= 1 && l <= getSlidesN()) {
		bclick(l - 1)
		return
	}
	l = ['ArrowLeft', 'ArrowUp'].includes(k);
	if (l && gCurrentSlideNo > 0 || ['ArrowRight', 'ArrowDown'].includes(k) && gCurrentSlideNo < getSlidesN() - 1) {
		bclick(-gButtons.length + l)
	}
}

function getSlides() {
	return document.querySelectorAll('.slide')
}

function getSlidesN() {
	return getSlides().length
}

function getCurrentSlide() {
	return getSlides()[gCurrentSlideNo]
}

function ra(e, add, name) {
	if (add) {
		e.classList.add(name)
	}
	else {
		e.classList.remove(name)
	}
}

function openFullscreen() {
	let e = document.documentElement;
	if (e.requestFullscreen) {
		e.requestFullscreen();
	} else if (e.webkitRequestFullscreen) { /* Safari */
		e.webkitRequestFullscreen();
	} else if (e.msRequestFullscreen) { /* IE11 */
		e.msRequestFullscreen();
	}
}

function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) { /* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE11 */
		document.msExitFullscreen();
	}
}
