class Reversi {
	static setBoardSize(size) {
		Reversi.boardSize = size;
		Reversi.lineSize = Reversi.boardSize + 1;
		Reversi.boardSize2 = (Reversi.boardSize + 2) * Reversi.lineSize + 1;
		Reversi.empty = 0;
		Reversi.black = 1;
		Reversi.white = 2;
		Reversi.upleftCenter = Reversi.boardSize / 2 * Reversi.lineSize + Reversi.boardSize / 2;//analog d3 on 8x8 table
		Reversi.direction = [-Reversi.lineSize - 1, -Reversi.lineSize, -Reversi.lineSize + 1, -1, 1, Reversi.lineSize - 1, Reversi.lineSize, Reversi.lineSize + 1];

		Reversi.BLACK_ONLY=0;
		Reversi.WHITE_ONLY=1;
		Reversi.BLACK_AND_WHITE=2;
	
		Reversi.cells = [];
		Reversi.possibleMoves = []
		let i = Reversi.upleftCenter;
		let a = [i, i + 1, i + Reversi.lineSize, i + Reversi.lineSize + 1];
		let j, k;
		for (i = 1; i <= Reversi.boardSize; i++) {
			for (j = 1; j <= Reversi.boardSize; j++) {
				k = i * Reversi.lineSize + j;
				Reversi.cells.push(k);
				if (a.indexOf(k) == -1) {
					Reversi.possibleMoves.push(k);
				}
			}
		}
	}

	constructor(type) {
		this.board = new Array(Reversi.boardSize2)
		this.init(type)
	}

	init(type,clearHistory=true) {
		this.board.fill(Reversi.empty)
		let i = Reversi.upleftCenter;
		let d = i + Reversi.lineSize;
		let a
		if (type < 2 ) {
			a=[i,d+1] 
		} else if (type <4) {
			a=[i,i+1]
		}
		else {
			a=[i+1,d+1]
		}

		[i,i+1,d,d+1].forEach (e=>{
			this.board[e] = a.includes(e) == type % 2 ? Reversi.white : Reversi.black;
		});

		this.move = Reversi.black;
		//moves history differ from c++
		if(clearHistory){
			this.moves = []
		}
		//movesi = number of maked moves
		this.movesi=0
		this.type=type
	}

	//getType of start position
	getType(){
		let i = Reversi.upleftCenter;
		let d = i + Reversi.lineSize;
		if(this.board[i]==this.board[d+1]){
			return Number(this.board[i]==Reversi.white)
		}
		if(this.board[i]==this.board[i+1]){
			return 2+Number(this.board[i]==Reversi.white)
		}
		return 4+Number(this.board[i]==Reversi.black)
	}

	possibleMove(index, move) {
		let i, j = index;
		if (this.board[j] != Reversi.empty) {
			return false;
		}

		const o = Reversi.oppositeColor(move);
		return !Reversi.direction.every(d => {
			i = j + d;
			if (this.board[i] == o) {
				do {
					i += d;
				} while (this.board[i] == o);
				if (this.board[i] == move) {
					return false;
				}
			}
			return true;
		});
	}

	atLeastOnePossibleMove(move){
		return !Reversi.possibleMoves.every(e=>{
			if(this.possibleMove(e,move)){
				return false;
			}
			return true;
		})
	}

	static oppositeColor(c) {
		return c == Reversi.black ? Reversi.white : Reversi.black;
	}

	isEnd(){
		return !this.atLeastOnePossibleMove(this.moveColor) && !this.atLeastOnePossibleMove(Reversi.oppositeColor(this.moveColor));
	}

	endGameType() {
		let b = false, w = false,c;
		Reversi.cells.forEach (i=>{
			c = this.board[i];
			if (c == Reversi.white) {
				w = true;
			} else if (c == Reversi.black) {
				b = true;
			}
		})
		if (b) {
			return w ? Reversi.BLACK_AND_WHITE : Reversi.BLACK_ONLY;
		} else {
			return Reversi.WHITE_ONLY;
		}
	}
	
	makeMove(index) {
		let i, j = index;
		if (this.board[j] != Reversi.empty) {
			return false;
		}

		let r = false;
		const o = Reversi.oppositeColor(this.move);
		for (let ii = 0; ii < Reversi.direction.length; ii++) {
			let d = Reversi.direction[ii];
			i = j + d;
			if (this.board[i] == o) {
				do {
					i += d;
				} while (this.board[i] == o);
				if (this.board[i] == this.move) {
					for (; i != j; i -= d) {
						this.board[i] = this.move;
					}
					r = true;
				}
			}
		}
		if (r) {
			this.board[j] = this.move;
			if(j!=this.moves[this.movesi]){//move not in history
				this.moves=this.moves.slice(0,this.movesi)//remove all other items
				this.moves.push(j)
			}
			this.movesi++

			//differ from c++
			if(this.atLeastOnePossibleMove(o)){
				this.move = o;
			}
		}
		return r;
	}

	isUndoredoPossible(undo){
		if(undo){
			return this.movesi>0
		}
		else{
			return this.movesi<this.moves.length
		}
	}

	undoredo(undo,all){
		let i,n;
		if(all){
			n=undo?0:this.moves.length
		}
		else{
			n=this.movesi + (undo?-1:1);
		}
		this.init(this.type,false)

		for(i=0;i<n;i++){
			this.makeMove(this.moves[i])
		}
	}

	makeMoves(s) {
		let a = 'a'.charCodeAt(0), c, d, end=0
		Reversi.splitMoves(s).forEach(e => {
			if(end){
				return
			}
			c = e[0];
			d = e[1];
			if (c < a || c >= a + Reversi.boardSize || isNaN(d) || d < 1 || d > Reversi.boardSize) {
				alert((gLanguage == 'russian' ? 'неверный ход' : 'invalid move') + ' ' + e[2])
				end=1
			}
			else if (!this.makeMove(Reversi.index(e[2]))) {
				alert((gLanguage == 'russian' ? 'невозможно сделать ход' : 'cann\'t make move') + ' ' + e[2])
				end=1
			}
		})
	}

	static splitMoves(s) {
		let r = []
		let i, j, q
		for (i = 0; i < s.length;) {
			j = 2 + (s.length >= i + 2 && !isNaN(s[i + 2]))
			q = s.substr(i, j)
			r.push([q[0].toLowerCase().charCodeAt(0), Number(q.substr(1)),q]);
			i += j;
		}
		return r;
	}

	//index('a1') or index(x,y)
	static index(x,y) {
		let s
		if(y===undefined){
			s = x.toLowerCase();
			x = s.charCodeAt(0)-'a'.charCodeAt(0);
			y = Number(s.substr(1))-1;
		}
		return (x+1) + (y+1) * Reversi.lineSize;
	}

	static index2(i){
		return [i%Reversi.lineSize-1,Math.floor(i/Reversi.lineSize)-1]
	}

	static indexToString(index) {
		return String.fromCharCode((index % Reversi.lineSize) + 'a'.charCodeAt(0) - 1)+Math.floor(index / Reversi.lineSize);
	}	

	flipHorisontal() {
		return this.helptransformfull(true)

		// let r;
		// let t=this.type
		// let a
		// if(t<2){
		// 	a=[0,1]
		// }
		// else if(t<4){
		// 	a=[t]
		// }
		// else{
		// 	a=[4,5]
		// }
		// r=new Reversi(a[(a.indexOf(t)+1)%a.length]);
		// r.helptransform(true,this)
		// return r;
	}
	
	rotate90() {
		return this.helptransformfull(false)

		// let t=this.type
		// let a
		// if(t<2){
		// 	a=[0,1]
		// }
		// else{
		// 	a=[2,4,3,5]
		// }
		// let r=new Reversi(a[(a.indexOf(t)+1)%a.length]);
		// r.helptransform(false,this)
		// return r;
	}

	static transformFunction(e,o){
		let a=Reversi.index2(e),t;
		if(o){
			t=a[0]
			a[0]=a[1]
			a[1]=t
		}
		return (a[0]+1) * Reversi.lineSize + Reversi.boardSize - a[1];
	}

	helptransform(o,r){
		this.board.fill(Reversi.empty)
		Reversi.cells.forEach(e=>{
			this.board[Reversi.transformFunction(e,o)]=r.board[e]
		});

		this.moves=[]
		r.moves.forEach(e=>{
			this.moves.push(Reversi.transformFunction(e,o))
		})
		this.movesi=r.movesi;
		this.move=r.move
	}

	helptransformfull(o){
		let r=new Reversi(this.type);
		let r1=new Reversi(this.type);
		r.helptransform(o,r1)
		r.type=r.getType();
		r.helptransform(o,this)
		return r;
	}

	transform(n){
		let r= n>3 ? this.flipHorisontal() : this
		for(let i=0;i<n%4;i++){
			r=r.rotate90();
		}
		return r;
	}
	
	count(){
		let c=[0,0],a
		Reversi.cells.forEach (e=>{
			a=this.board[e]
			if(a!=Reversi.empty){
				c[a==Reversi.black ? 0:1]++;
			}
		});
		return c
	}

	lastMoveIndex(){
		return this.movesi<=0 ? undefined : this.moves[this.movesi-1]
	}

	movesString(){
		let i,s='';
		for(i=0;i<this.movesi;i++){
			s+=Reversi.indexToString(this.moves[i])
		}
		return s
	}

	reversibleDisksList(index,two=true) {
		let i, j = index,a=[];
		if (this.board[j] != Reversi.empty) {
			return a;
		}
		const o = Reversi.oppositeColor(this.move);
		for (let ii = 0; ii < Reversi.direction.length; ii++) {
			let d = Reversi.direction[ii];
			i = j + d;
			if (this.board[i] == o) {
				do {
					i += d;
				} while (this.board[i] == o);
				if (this.board[i] == this.move) {
					i-=d;
					for (; i != j; i -= d) {
						a.push(two?Reversi.index2(i):i);
					}
				}
			}
		}
		return a;
	}

}
