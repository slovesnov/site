function load(){
	i=parseInt(gPageName.charAt(gPageName.length-1))
	s='<p><table width="100%"><tr>'
	a=gMobile?['\u23EA','содержание','\u23E9','скачать в формате word']:['назад','содержание','вперёд','скачать всю статью в формате word']
	if(i!=1){
		s+='<td><a href="?blackjack'+(i-1)+'">'+a[0]+'</a>'
	}
	s+='<td><a href="?blackjack">'+a[1]+'</a>'
	if(i!=9){
		s+='<td><a href="?blackjack'+(i+1)+'">'+a[2]+'</a>'
	}
	s+='<td><a href="articles/blackjack.doc">'+a[3]+'</a></table>'
	document.getElementById("b").innerHTML=document.getElementById("e").innerHTML=s;
}
