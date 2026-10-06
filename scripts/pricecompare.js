/*https://www.w3schools.com/colors/colors_names.asp
Azure #F0FFFF
Beige #F5F5DC
*/
const inputs=10

function load() {
	t=el("t")
	for(i=0;i<inputs;i++){
		r=t.insertRow(-1)
		r.innerHTML='<td><input type="text" id="t'+i+'" oninput="com()" placeholder="введите цену"><td class="c'+i+'">=<td><td>'
		r.style.backgroundColor=dc(i)
	}
	com()
}

function dc(i){
	return i%2==0 ? 'Beige':'Azure'
}

function com(){
	b=[]
	t=el("t");
	const f = (i) => el('t'+i)

	for(i=0;i<inputs;i++){
		ev=el('t'+i).value
		v=Infinity
		if(ev.length!=0){
			try{
				v=eval(ev)
			}
			catch(_e){
			}
		}
		const f1 = () => f(i)
		v=st([v],f1)
		b.push(v)
		t.rows[i].cells[3].innerHTML=v==Infinity ? '?' : v.toFixed(3)

	}

	st(b,f);
}

function st(b,f){
	let m=Math.min(...b)
	b.forEach ( (e,i)=>{
		let el=f(i)
		let style=el.style,s;
		if(el.tagName=='INPUT'){
			s='transparent';
			if(e==Infinity){
				style.color = 'red';
			}
			else{
				style.color = 'black';
				if(e==m){
					s='#0f0';
				}
			}
		}
		else{
			s = e==m && m!=Infinity ? '#0f0': '';
		}
		style.backgroundColor = s;
	})
	return m
}