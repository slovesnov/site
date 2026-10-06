CARD_INDEX_INVALID = -1,
CARD_INDEX_ABSENT=0,
CARD_INDEX_NORTH=1,
CARD_INDEX_EAST=2,
CARD_INDEX_SOUTH=3,
CARD_INDEX_WEST=4,
CARD_INDEX_NORTH_INNER=5,
CARD_INDEX_EAST_INNER=6,
CARD_INDEX_SOUTH_INNER=7,
CARD_INDEX_WEST_INNER=8;

PREFERANS_NODE_COUNT=false;

HASH_EXACT = 0;
HASH_ALPHA = 1;
HASH_BETA  = 2;

class Preferans{
constructor(smallHash){
	var hashBits=smallHash? 18+1:18+5;
	this.m_hashSize=1<<hashBits;
	this.m_andKey=this.m_hashSize-1;
}

solve(c,trump,first,player,mizer,preferansPlayer,trumpChanged) {
	var a, i, j, k, m, n, fi;
	var pi=new Array(CARD_INDEX_WEST + 1)
	var l, first1,p;
	var suit = -1, card = -1, suit1 = -1, card1 = -1;
	this.m_code=new Array(4)
	
	for (i = 0; i < 3 && preferansPlayer[i] != player; i++)
		;
	for (j = 0; j < 3; j++, i++) {
		pi[preferansPlayer[i % 3]] = j;
	}

	//Note. Inner representation player always=0
	if (mizer) {
		this.m_trump = NT;
		this.m_mizer = true;
	}
	else {
		this.m_trump = trump;
		this.m_mizer = false;
	}
	fi = pi[first];

	for (i = 0; i < 3 && preferansPlayer[i] != first; i++)
		;
	first1 = preferansPlayer[(i + 1) % 3];

	n = 0;
	for (i = 0; i < 4; i++) {
		m = 0;
		k = 0;
		//p = c + i * 13;
		a = 0;
		for (j = 0; j < 8; j++) {
			l = c [j+ i * 13];

			if (l == CARD_INDEX_ABSENT) {
				a++;
			}
			else {
				if (l == first + CARD_INDEX_NORTH_INNER - CARD_INDEX_NORTH) {
					l = first;
					suit = i;
					card = j - a;
				}
				else if (l == first1 + CARD_INDEX_NORTH_INNER - CARD_INDEX_NORTH) {
					l = first1;
					suit1 = i;
					card1 = j - a;
				}
				m |= pi[l] << k;
				k += 2;
			}
		}
		n += k;
		m |= 3 << k;
		this.m_code[i] = m;
	}

	//cards in each hand
	this.m_depth = this.m_cards = Math.floor(n / 6);

	if (trumpChanged) {
		this.m_hashTable=[]
	}
	if(PREFERANS_NODE_COUNT){ 
	this.m_nodes=0;
 	}

	this.m_best = -1;

	if (suit == -1 && this.m_cards != 1) {
		i = this.g(fi, -this.m_cards, this.m_cards, true);
	}
	else {
		i = this.f(fi, -this.m_cards, this.m_cards, suit, card, suit1, card1);
	}
	//assert(this.m_best != -1);

	if (this.m_mizer) {
		this.m_e = Math.floor((this.m_cards - i) / 2);
	}
	else {
		this.m_e = Math.floor((this.m_cards + i) / 2);
	}

	//cards on table
	n = suit == -1 ? 0 : (suit1 == -1 ? 1 : 2);
	if ((fi + n) % 3 == 0) {
		this.m_playerTricks = this.m_e;
	}
	else {
		this.m_playerTricks = this.m_cards - this.m_e;
	}

	//adjust best card rank
	i = this.m_best % 13;
	a = 0;
	for (j = 0; j < 8; j++) {
		p = c [ Math.floor(this.m_best / 13) * 13+j];
		if (p == CARD_INDEX_ABSENT) {
			a++;
		}
		else {
			if (i-- == 0) {
				this.m_best += a;
				break;
			}
		}
	}

}

removeCard(suit,pos) {
	pos <<= 1;
	var c = this.m_code[suit];
	this.m_code[suit] = ((c >> (pos + 2)) << pos) | (c & ((1 << pos) - 1));
}

restoreCard(suit,pos,w) {
	pos <<= 1;
	var c = this.m_code[suit];
	this.m_code[suit] = ((c >> pos) << (pos + 2)) | (w << pos)
			| (c & ((1 << pos) - 1));
}


getW(suit,pos) {
	pos <<= 1;
	var c = this.m_code[suit];
	return (c >> pos) & 3;
}


compare(suit1,card1,suit2,card2) {
	return suit1 == suit2 ? card1 < card2 : suit2 != this.m_trump;
	//return suit1==suit2 ? card1>card2 : suit2!=this.m_trump;
}

g(ww,a,b,storebest) {
	var i, j, t, v, suit, card, c;
	var w= [ ww, (ww + 1) % 3, (ww + 2) % 3 ];

	if(PREFERANS_NODE_COUNT){ 
	this.m_nodes++;
 	}

	if (this.m_depth == 1) {
		var card1, suit1, card2, suit2;

		//prevents gcc warnings
		suit = card = card1 = suit1 = card2 = suit2 = 0;


		for (i = 0; i < 4; i++) {
			for (j = 0, c = this.m_code[i]; c != 3; c >>= 2, j++) {
				t = c & 3;
				if (t == w[0]) {
					card = j;
					suit = i;
				}
				else if (t == w[1]) {
					card1 = j;
					suit1 = i;
				}
				else {
					card2 = j;
					suit2 = i;
				}
			}
		}

		if (this.compare(suit, card, suit1, card1)) {
			t = this.compare(suit, card, suit2, card2) ? 0 : 2;
		}
		else {
			t = this.compare(suit1, card1, suit2, card2) ? 1 : 2;
		}

		v = t == 0 || (t == 1 && w[2] == 0) || (t == 2 && w[1] == 0) ? 1 : -1;
		if (this.m_mizer) {
			v = -v;
		}
		return v;
	}

	if (a >= this.m_depth) {
		return a;
	}
	if (b <= -this.m_depth) {
		return b;
	}
	if (a < -this.m_depth) {
		a = -this.m_depth;
	}
	if (b > this.m_depth) {
		b = this.m_depth;
	}

	//probeHash
	if (!storebest) {
		var h=this.m_hashTable[this.hashIndex(w[0])];
		if(typeof h!='undefined'){
			for(i=0;i<3 && h.code[i]==this.m_code[i];i++);
			if(i==3){
				if(h.f==HASH_EXACT){
					return  h.v;
				}
				if(h.f==HASH_ALPHA && h.v <= a){
					return a
				}
				if(h.f==HASH_BETA  && h.v >=  b){
					return b;
				}
			}
		}
		
	}
	var f = HASH_ALPHA;

	var ca=[];
	var p=[[],[],[],[]];
	for (i = 0; i < 4; i++) {
		this.suitableCards(i, w[0], p[i]);
	}
	for (i = 0; i < 4; i++) {
		var t=p[i]
		if (t.length > 0) {
			ca.push(t[0], t[1]); //highest card in suit
		}
	}
	for (i = 0; i < 4; i++) {
		var t=p[i]
		for (j = 2; j < t.length; j++) { //all except first one
			ca.push(t[j]);
		}
	}

	if (storebest) {
		this.m_best = ca[1] * 13 + ca[0];
	}

	var c1=[]
	var c2=[];
	for (i = 0; i < ca.length; i += 2, c1.length = c2.length = 0) {
		card = ca[i];
		suit = ca[i + 1];

		this.suitableCards2P(suit, w, c1, c2);

		this.removeCard(suit, card);

		if (w[2] == 0) {
			v = this.g1(w, a, b, suit, card, c1, c2);
		}
		else {
			v = -this.g1(w, -b, -a, suit, card, c1, c2);
		}

		this.restoreCard(suit, card, w[0]);
		if (v > a) {
			if (storebest) {
				this.m_best = suit * 13 + card;
			}
			f = HASH_EXACT;
			if ((a = v) >= b) {
				this.recordHash(b, HASH_BETA, w[0]);
				return b;
			}
		}
	}
	this.recordHash(a, f, w[0]);
	return a;
}

g1(w,a,b,suit,card,c1,c2,storebest) {
	var i, v, suit1, card1, r1;
	if(PREFERANS_NODE_COUNT){ 
	this.m_nodes++;
 	}

	for (i = 0; i < c1.length; i += 2) {
		r1 = card1 = c1[i];
		suit1 = c1[i + 1];

		if (suit1 == suit) {
			if (r1 > card) {
				r1--;
			}
		}

		this.removeCard(suit1, r1);
		if (w[0] == 0) {
			v = this.g2(w, a, b, suit, card, suit1, card1, c2, r1);
		}
		else {
			v = -this.g2(w, -b, -a, suit, card, suit1, card1, c2, r1);
		}

		this.restoreCard(suit1, r1, w[1]);
		if (v > a) {
			if (storebest) {
				this.m_best = suit1 * 13 + card1;
			}

			if ((a = v) >= b) {
				return b;
			}
		}
	}
	return a;
}

g2(w,a,b,suit,card,suit1,card1,c2,r1,storebest) {
	var i, v, suit2, card2, t, r2;
	if(PREFERANS_NODE_COUNT){ 
	this.m_nodes++;
 	}

	for (i = 0; i < c2.length; i += 2) {
		r2 = card2 = c2[i];
		suit2 = c2[i + 1];

		if (suit2 == suit) {
			if (r2 > card) {
				r2--;
			}
		}
		if (suit2 == suit1) {
			if (r2 > r1) {
				r2--;
			}
		}

		this.removeCard(suit2, r2);

		if (this.compare(suit, card, suit1, card1)) {
			t = this.compare(suit, card, suit2, card2) ? 0 : 2;
		}
		else {
			t = this.compare(suit1, card1, suit2, card2) ? 1 : 2;
		}

		this.m_depth--;
		if ((t == 0 && w[1] == 0) || (t == 1 && w[0] == 0) || t == 2) {
			v = 1;
			if (this.m_mizer) {
				v = -v;
			}

			v += this.g(w[t], a - v, b - v);

		}
		else {
			v = -1;
			if (this.m_mizer) {
				v = -v;
			}
			v -= this.g(w[t], -b + v, -a + v);

		}
		this.m_depth++;

		this.restoreCard(suit2, r2, w[2]);
		if (v > a) {
			if (storebest) {
				this.m_best = suit2 * 13 + card2;
			}
			if ((a = v) >= b) {
				return b;
			}
		}
	}
	return a;
}

hashIndex(w) {
	return ( (this.m_code[0]<<9) ^ (this.m_code[1]<<6) ^ this.m_code[2] ^ (this.m_code[3] << 3) ^ w)
			& this.m_andKey;
}

recordHash(v,f,w) {
	var p=this.m_hashTable[this.hashIndex(w)]={};
	//code[3] is in index
	p.code=new Array(3)
	for(var i=0;i<3;i++){
		p.code[i]=this.m_code[i];
	}
	p.v=v;
	p.f=f;
	
}

//all cards for one player
suitableCards2P(suit,w,c1,c2) {
	this.suitableCards2(suit, w, c1, c2);
	if (c1.length > 0) {
		if (c2.length == 0) {
			this.suitableCardsFromTrump(suit, w[2], c2);
		}
		return;
	}
	else if (c2.length > 0) {
		this.suitableCardsFromTrump(suit, w[1], c1);
		return;
	}

	if (this.m_trump != NT && suit != this.m_trump) {
		this.suitableCards2(this.m_trump, w, c1, c2);
		if (c1.length > 0) {
			if (c2.length == 0) {
				this.suitableCardsAfterTrump(suit, w[2], c2);
			}
			return;
		}
		else if (c2.length > 0) {
			this.suitableCardsAfterTrump(suit, w[1], c1);
			return;
		}
	}

	for (var i = 0; i < 4; i++) {
		if (i != this.m_trump && i != suit) {
			this.suitableCards2(i, w, c1, c2);
		}
	}
}

//add cards in suit for two players
suitableCards2(suit,w,c1,c2) {
	var i, j, c;
	var t1, t2;
	for (c = this.m_code[suit], j = 0, t1 = true, t2 = true; c != 3; j++, c >>= 2) {
		i = c & 3;
		if (i == w[1]) {
			t2 = true;
			if (t1) {
				c1.push(j);
				c1.push(suit);
				t1 = false;
			}
		}
		else if (i == w[2]) {
			t1 = true;
			if (t2) {
				c2.push(j);
				c2.push(suit);
				t2 = false;
			}
		}
		else {
			t1 = t2 = true;
		}
	}
}

suitableCardsFromTrump(suit,w,c) {
	if (this.m_trump != NT && suit != this.m_trump) {
		this.suitableCards(this.m_trump, w, c);
	}
	if (c.length == 0) {
		this.suitableCardsAfterTrump(suit, w, c);
	}
}

suitableCardsAfterTrump(suit,w,c) {
	for (var i = 0; i < 4; i++) {
		if (i != this.m_trump && i != suit) {
			this.suitableCards(i, w, c);
		}
	}
}

//add cards in suit for one player
suitableCards(suit,w,a) {
	var j, c, f = 1;
	for (j = 0, c = this.m_code[suit]; c != 3; c >>= 2, j++) {
		if ((c & 3) == w) {
			if (f) {
				a.push(j);
				a.push(suit);
				f = 0;
			}
		}
		else {
			f = 1;
		}
	}
}

suitableCardsP(suit,w,a) {
	var i;
	this.suitableCards(suit, w, a);
	if (a.length != 0) {
		return;
	}

	if (this.m_trump != NT && suit != this.m_trump) {
		this.suitableCards(this.m_trump, w, a);
	}

	if (a.length != 0) {
		return;
	}

	for (i = 0; i < 4; i++) {
		if (i != this.m_trump && i != suit) {
			this.suitableCards(i, w, a);
		}
	}
}

f(ww,a,b,suit,card,suit1,card1) {
	var w = [ ww, (ww + 1) % 3, (ww + 2) % 3 ];
	var v;
	var c1=[], c2=[];

	if (this.m_cards == 1) {
		//prevents gcc warnings init m[] here we don't need max speed
		var m = [ 0, 0, 0 ];
		var i, j, t, c;

		//cards on table
		var n = suit == -1 ? 0 : (suit1 == -1 ? 1 : 2);

		for (i = 0; i < 4; i++) {
			for (j = 0, c = this.m_code[i]; c != 3; c >>= 2, j++) {
				t = c & 3;
				for (v = 0; v < 3 && t != w[v]; v++)
					;
				//assert(v < 3);
				m[v] = i * 13 + j;
				if (n == v) {
					this.m_best = m[v];
				}
			}
		}

		var C=function(x,y,o){return o.compare(Math.floor(m[x]/13),m[x]%13,Math.floor(m[y]/13),m[y]%13)}		
		if (C(0, 1,this)) {
			t = C(0,2,this) ? 0 : 2;
		}
		else {
			t = C(1,2,this) ? 1 : 2;
		}

		//taker n or neither t nor n are preferans players
		if (t == n || (w[t] != 0 && w[n] != 0)) {
			v = 1;
		}
		else {
			v = -1;
		}

		if (this.m_mizer) {
			v = -v;
		}
		return v;
	}

	if (suit1 == -1) {
		this.suitableCards2P(suit, w, c1, c2);
		this.m_best = c1[1] * 13 + c1[0];
		this.removeCard(suit, card);
		v = this.g1(w, a, b, suit, card, c1, c2, true);
	}
	else {
		this.suitableCardsP(suit, w[2], c2);
		this.m_best = c2[1] * 13 + c2[0];
		//assert(this.getW(suit, card) == ww);
		this.removeCard(suit, card);

		var r1 = card1;
		if (suit1 == suit) {
			if (r1 > card) {
				r1--;
			}
		}
		//assert(this.getW(suit1, r1) == w[1]);
		this.removeCard(suit1, r1);
		v = this.g2(w, a, b, suit, card, suit1, card1, c2, r1, true);
	}
	return v;
}
};