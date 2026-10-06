function load(){
	la=gLanguage=='russian' ? ['знак','порядок','мантисса']
		:['sign','exponent','fraction']

	//v=0;
	l=Math.PI
	el('n').value=l;

	j=12;
	l=0;
	s=''
	for(k=0;k<2;k++){
		s+='<table>'
		s+='<tr>'
		if(k==0){
			s+='<td>'+la[l++]
		}
		
		s+='<td colspan='+(k?64-j:j-1)+' class="c">'+la[l++]
		s+='<tr>'
		d=k?j:0;
		u=k?64:j
		for(i=d;i<u;i++){
			s+='<td class="c"><input type="checkbox" onclick="checkClick()">'
		}
		if(k==0){
			s+='<td>&nbsp;&nbsp;&nbsp;'+la[1]+' : <span id="e"></span>'+
			',&nbsp; '+la[2]+' : <span id="f"></span>'
		}

		s+='<tr>'
		for(i=d;i<u;i++){
			s+='<td class="sm">'+i
		}
		s+='</table>'
	}

	document.getElementById('t').innerHTML=s;

	numberChanged()
}

//SI=1 because a[0] is input number
const SI=1;

function numberChanged(){
	e=el('n')
	v=e.value.toLowerCase()
	if(v=='nan'){
		v=NaN
	}
	else if(v=='inf' || v=='+inf'){
		v=Infinity
	}
	else if(v=='-inf'){
		v=-Infinity
	}
	else{
		v=Number(v);
		if(isNaN(v)){
			e.style.color = "red";
			return
		}
	}
	
	b=double2bytes(v)

	l=SI;
	a=document.getElementsByTagName("input");
	for(i=0;i<8;i++){
		k=b[i]
		for (j = 0; j < 8; j++){
			a[l++].checked = (k >> (7-j)) & 1
		}
	}
	
	updateFractionExponent(v,b)
	e.style.color = "black";	
}

function updateFractionExponent(v,b){
	if(!isFinite(v)){
		el('e').innerHTML=el('f').innerHTML="?"
		return;
	}

	k=0;
	for(i=1;i<12;i++){
		if(a[i+SI].checked){
			k|=1<<(11-i)
		}
	}
	
	bb=[...b];
	bb[0]=63;
	bb[1]=0xf0 | b[1]&0xf;
	
	el('e').innerHTML='2<sup>'+k+'-1023</sup>=2<sup>'+(k-1023)+'</sup>';
	el('f').innerHTML=bytes2Double(bb)
}

function checkClick(){
	l=SI;
	a=document.getElementsByTagName("input");
	b=[]
	for(i=0;i<8;i++){
		k=0
		for (j = 0; j < 8; j++){
			if(a[l++].checked){
				k |= 1<< (7-j)
			}
		}
		b.push(k)
	}
	
	v=bytes2Double(b)
	el('n').value=v;
	updateFractionExponent(v,b)
}

function bytes2Double(b){
	let buffer = new ArrayBuffer(8);
	let bytes = new Uint8Array(buffer);
	for(let i=0;i<8;i++){
		bytes[i] = b[i];
	}
	return new DataView(buffer).getFloat64(0, false);
}

function double2bytes(v){
	let buffer = new ArrayBuffer(8);
	let bytes = new Uint8Array(buffer);
	let d = new DataView(buffer)
	d.setFloat64(0,v);
	return bytes;
}
