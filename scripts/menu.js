function menuAdjust(t,level){
	let a=t.children,q,x,r
	for(q of a){
		if(q.tagName=='UL'){
			/* window.document.body.clientWidth 
			using window.innerWidth instead of window.document.body.clientWidth  is not valid because it's extended 
			when menu is out of screen on mobile so window.innerWidth will be greater than screen width
			*/
			r = q.getBoundingClientRect();
			x=Math.round(window.document.body.clientWidth-r.right)
			if(x<0){
				if(level>1){
					x = Math.round(r.width);
					q.style.left=(-x)+'px';
					q.style.width=x+'px';
				}
				else{
					q.style.left=x+'px';
				}
			}
			break;
		}
	}
}
