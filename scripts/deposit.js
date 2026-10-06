function compute(){
	rate = parseFloat(document.getElementById('trate').value)
	month = parseFloat(document.getElementById('tmonth').value)
	type=document.getElementById('toption').value
	bonus=(1+parseFloat(document.getElementById('bonus').value)/100)
	if(type=='none'){//none
		fullpercent=1+rate*month/1200
	}
	else	if(type=='month'){
		fullpercent=Math.pow(1+rate/1200,month)
	}
	else if(type=='year'){
			fullpercent=Math.pow(1+rate/100,month/12)
	}
	fullpercent=(fullpercent*bonus-1)*100
	document.getElementById('tfull').value=fullpercent.toFixed(4)
	document.getElementById('tcnone').value=(fullpercent*12/month).toFixed(4)
	document.getElementById('tcyear').value=((Math.pow(1+fullpercent/100,12/month)-1)*100).toFixed(4)
	document.getElementById('tcmonth').value=((Math.pow(1+fullpercent/100,1/month)-1)*1200).toFixed(4)
}

function load(){
	document.getElementById('trate').focus()
	compute()
}