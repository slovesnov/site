function load(){
	p=el('t').value
	const recipeObject = {
		p
		, calorie: 1
		//,showcomment: !table
		, title: 1
		, roublekgformula: false
		, table:1
	}

	s=window.location.origin+'/index.php?calorie_recipe,,'+new URLSearchParams(recipeObject)
	el('pd').value=s

	// navigator.clipboard.writeText(s);
	a=document.activeElement
	e = el("pd");
	e.focus();
	e.select();
	e=document.execCommand('copy');
	if(a){
		a.focus()
	}
	//console.log(window.location.origin) 
}
