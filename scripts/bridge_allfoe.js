SPADES=0
HEARTS=1
DIAMONDS=2
CLUBS=3
NT=4
MIZER=5

SUITS='SHDC'
CARDS='AKQJT987'

SUITS_HTML=[
	"&spades;"
	,"<font color='red'>&hearts;</font>"
	,"<font color='red'>&diams;</font>"
	,"&clubs;"
	,"nt"
]

function Deal(deal, trump, first, player){
	if(trump==MIZER){
		this.mizer=true;
		this.trump=NT;
	}
	else{
		this.mizer=false;
		this.trump=trump;
	}
	this.first=first;
	this.player=player;
	this.preferansPlayer=[
		CARD_INDEX_WEST,
		CARD_INDEX_NORTH,
		CARD_INDEX_EAST,
	]
	var c=new Array(52);
	
	for(i=0;i<52;i++){
		c[i]=CARD_INDEX_ABSENT;
	}
	this.deal=deal.trim();
	v=deal.trim().split(/\s+/);
	this.v=v;
	PREFERANS = [
			CARD_INDEX_NORTH,
			CARD_INDEX_EAST,
			CARD_INDEX_WEST,
	];

	for(i=0;i<3;i++){
		k=0;
		var s=v[i];
		for(j=0;j<s.length;j++){
			if(s[j]=='.'){
				k++;
			}
			else{
				p=CARDS.indexOf(s[j]);
				if(p==-1){
					throw 0;
				}
				c[k*13+p]=PREFERANS[i];
			}
		}
	}
	this.c=c;
}

gdeal=["789T.789T.8#9.*J*Q", "789T.789T.8*9.#J*Q","#A*8*7.AKT.KJ.A987","AQJ8*T*7.KT8.KJ.9"];
gtrump=[5,5,3,0];
gfirst=[0,0,0,2];
//gresults for 20'000 nodes
gresults=["7978 2338 233 2062 5021 2308 60 0 0 0 0","906 13958 366 2054 2384 325 7 0 0 0 0"
			,"0 0 0 0 226 1643 11300 6799 32 0 0","0 0 0 0 12740 7222 38 0 0 0 0"];

function load(){
	if(PREFERANS_NODE_COUNT){//PREFERANS_NODE_COUNT defined in preferans.js
		s=f();
	}
	else{
		var s='<table border=1 style="border-collapse:collapse"><tr><th>results<th>time<th>nodes<th>N<th>kn/sec';

		gt=0;
		var n=20000
		for(var i=0;i<3/*gdeal.length*/;i++){
			s+=g(n,i)+"<br>";
		}
		i*=n;
		s+='<tr><th>total<th>'+gt.toFixed(2)+'<th>'+formatNumber(i)+'<th>-<th>'+(i/(gt*1000)).toFixed(2)
		s+="</table>"
	}
	document.getElementById('o').innerHTML=s;
}

function g(max,problem){
	var o=new Array(20);
	var ptr=new Array(52);
	RESULT_SIZE=11;
	min=0
	result=[];
	for(i=0;i<RESULT_SIZE;i++){
		result.push(0);
	}

	//check params at first
	i=gtrump[problem];
	trump=i>NT ? NT:i;
	mizer=i==NT+1;
	i=gfirst[problem];
	firstmove=i==2 ? 3  : i;

	//BEGIN parseDeal
	deal=gdeal[problem]
	var cards=new Array(10);
	var absent=new Array(2);
	var sorted=new Array(12);
	var suit=0;
	var c=cards;
	var a=absent;
	var ai=0,ci=0;
	var leadCard=-1;
	for(i=0;i<deal.length;i++){
		p=deal[i];
		if(p=='.'){
			if(suit==3){
				return "too many dots";
			}
			suit++;
			continue;
		}
		out=p=='*';
		lead=p=='#';
		if(out || lead){
			i++;
			p=deal[i];
		}
		q=CARDS.indexOf(p);
		if(q==-1){
			return "invalid symbol["+p+"]";
		}
		n=suit*13+q;
		if(out){
			if(ai==2){
				return "too many absent cards";
			}
			a[ai++]=n
		}
		else if(lead){
			if(firstmove!=0){
				return "error lead card found when player is not north";
			}
			if(leadCard!=-1){
				return "too many absent cards";
			}
			leadCard=n;
		}
		else{
			if(ci==10){
				return "too many player cards";
			}
			cards[ci++]=n;
		}
	}
	if(ai!=2){
		return "too few absent cards";
	}

	//const int pcards=c-cards;
	if( (leadCard!=-1 && ci!=9) || (leadCard==-1 && ci!=10) ){
		return "too few player cards";
	}

	sorted=[].concat(cards).concat(absent);
	if(sorted.length!=12){
		return "error153";
	}
	if(leadCard!=-1){
		sorted.push(leadCard);
	}

	sorted.sort(function(a, b){return a - b});
	for(i=sorted.length-1;i>0;i--){
		if(sorted[i]==sorted[i-1]){
			return "same card appears two or more times";
		}
	}
	//END parseDeal
	lead=leadCard
	
	for(i=j=k=0;i<52;i++){
		if(i%13>=8){//skip 2,3,4,5,6
			continue;
		}
		if(j<12 && sorted[j]==i){
			j++;
			continue;
		}
		if(k>=20){
			return "error190"
		}
		o[k++]=i;
	}
	if(k!=20){
		return "error195"
	}

	for(i=0;i<(lead==-1?10:9);i++){
		ptr[cards[i]]=CARD_INDEX_NORTH;
	}
	for(i=0;i<2;i++){
		ptr[absent[i]]=CARD_INDEX_ABSENT;
	}
	if(lead!=-1){
		ptr[lead]=CARD_INDEX_NORTH_INNER;
	}

	var p=new Permutations(10,20,Permutations.COMBINATION);

	position=new Preferans(false);
	var PLAYER = [CARD_INDEX_NORTH,CARD_INDEX_EAST,CARD_INDEX_SOUTH,CARD_INDEX_WEST ];
	var PREFERANS_PLAYER = [CARD_INDEX_WEST,CARD_INDEX_NORTH,CARD_INDEX_EAST];

	var start = new Date();
	for(j=0;j<min;j++){
		p.next();
	}
	for( ; j<max ; j++,p.next()){
		pi=p.getIndexes();
		for(i=0;i<20;i++){
			ptr[o[i]]=CARD_INDEX_EAST;
		}
		for(i=0;i<p.getK();i++){
			ptr[o[pi[i]]]=CARD_INDEX_WEST;
		}

		//firstmove index of player
		position.solve(ptr,trump,PLAYER[firstmove],CARD_INDEX_NORTH,mizer,PREFERANS_PLAYER,j==min);
		i=position.m_playerTricks;
		if(i<0 || i>10){
			return "error234";
		}
		result[i]++;
	}
	var s="<tr><td>"
	var s1="";
	for(i=0;i<RESULT_SIZE;i++){
		s1+=result[i]+" ";
	}
	s1+=s1==gresults[problem]+" " ? "ok" :"error"
	s+=s1;
	time = ((new Date() - start)/1000); //seconds
	gt+=time
	i=max-min
	j=i/(time*1000)
	s+="<td>"+time.toFixed(2)+"<td>"+formatNumber(i)+"<td>"+problem+"<td>"+j.toFixed(2);
	return s;
}

function f(){
	var s=''
	s+='<table border=1 style="border-collapse:collapse">'
	s+='<tr><th>deal<th>trump<th>e<th>cards<th>time<th>nodes<th>status'
	
	var a=[
		//first, player
		new Deal(" A98.AT98..T87 QT7.KQJ.A.KQJ KJ.7.KQJT9.A9 ",SPADES,CARD_INDEX_WEST,CARD_INDEX_EAST)//deal1 e=10
		,new Deal(" J9.97.8.87 87.KQ.KQ.J QT.A8.A97. ",SPADES,CARD_INDEX_NORTH,CARD_INDEX_EAST)//deal2 e=7
		,new Deal(" 87.KQ.KQ.J QT.A8.A97. J9.97.8.87 ",SPADES,CARD_INDEX_WEST,CARD_INDEX_NORTH)//deal2' e=7
		,new Deal(" QJT.J9.A97.KJ K9.Q87.QT8.QT A.AKT.KJ.A987 ",CLUBS,CARD_INDEX_WEST,CARD_INDEX_WEST)//deal3 e=7
		,new Deal("AJ98.87.87.87 .KT9.AQT.KQT9 KQT7.AQJ.KJ.A",SPADES,CARD_INDEX_WEST,CARD_INDEX_WEST)//deal4 e=4 time=53.6
		,new Deal(" T987.98.987.8 AK.AKQT.J.QJT QJ.J7.AKQT.97 ",MIZER,CARD_INDEX_WEST,CARD_INDEX_NORTH)//deal5
		,new Deal(" 8.T987.987.98 AT9.KQ.K.AQJT J7.AJ.AQJT.K7 ",MIZER,CARD_INDEX_WEST,CARD_INDEX_NORTH)//deal 6
		,new Deal("A8.AJ7.AJ8.KT QT.KT8.KT7.Q8 KJ7.Q9.Q9.AJ7",NT,CARD_INDEX_WEST,CARD_INDEX_NORTH)//deal7 e=7 time=240s
	]
	
	e=[10,7,7,7,4, 8,8, 7]
	var i,j
	
l281:
	for(j=0;j<2;j++){
		var p=new Preferans(j==0);
		t=0;
		n=0
		max=a.length
		//max=0
		for(i=0;i<max;i++){
			var d=a[i];
			var start = new Date();
			p.solve(d.c,d.trump,d.first,d.player,d.mizer,d.preferansPlayer,true);
			time = ((new Date() - start)/1000); //seconds
			ok=p.m_e==e[i];
			s+='<tr><td>'+d.deal+'<td>'+(d.mizer?"mizer":SUITS_HTML[d.trump])+'<td>'+p.m_e
			+'<td>'+p.m_cards+'<td>'+time.toFixed(3)+'<td>'+formatNumber(p.m_nodes)
			+'<td>'+(ok?"ok":"error");
			t+=time;
			n+=p.m_nodes
			if(!ok){
				break l281;
			}
		}
		
		s+='<tr><th>total<td><td><td><td>'+t.toFixed(3)+'<td>'+formatNumber(n)+'<td>'
		s+='<tr><th><td><td><td><th colspan=3>'+(j==0?'small hash':'big hash')
	}//for(j)
	s+='</table>'
	return s;
}

//debug only
function formatNumber(n){
	var s;
	if(typeof n=='string'){
		s=n;
	}
	else{
		s=n+'';
	}
	return s.replace( /\B(?=(\d{3})+$)/g , ",");
}
