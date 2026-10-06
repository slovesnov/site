function load() {
	const article = 0
	const max=10

	// var date1 = new Date();
	s1='Полиномы.<br>'
	//s1 +=wrap(String.raw`S_q(n)=n+qS^*_{q-1}(n)`, article)
	a = [new Fraction(1)]
	f=new Fraction()
	for (q = 0; q <=max; q++) {
		l = q
		s = 'S_' + (l > 9 ? '{' + l + '}' : l) + '(n)='
		if (q != 0) {
			f=new Fraction(1)
			for (i = 0; i < q; i++) {
				a[i].mulEquals(q, q - i + 1)
				f.subEquals(a[i])
			}
			a.push(f);
		}

		for (i = 0; i <= q; i++) {
			l = q - i + 1
			if (!a[i].isEqual(0)) {
				f=a[i].toFracString(i != 0)
				s +=  (["+1","-1","1"].includes(f)? f.slice(0,-1):f) 
					+ 'n' + (l == 1 ? '' : ('^' + (l > 9 ? '{' + l + '}' : l)))
			}
		}
		s1 += wrap(s,article)
	}

	s1+='Биномиальные коэффициенты.<br>'
	//s1 +=wrap(String.raw`S_q(n)=\sum_{j=0}^q C^{j+1}_n \sum_{i=0}^j C^i_j (i+1)^q (-1)^{j-i}`, article)
	for(q=0;q<=max;q++){
		l=q
		s='S_'+(l>9?'{'+l+'}':l)+'(n)='
		f=true
		for(j=0;j<=q;j++){
			k=0	
			for(i=0;i<j+1;i++){
				k+=binomial(i,j)*((i+1)**q)*((-1)**(j-i))
			}
			//k=-k for test
			if(k==0){
				continue;
			}
			if(!f || k<0){
				s+= k>0 ? '+':'-'
			}
			k=Math.abs(k)
			l=j+1
			s+=(k==1?'':formatString(k))+'C^'+(l>9?'{'+l+'}':l)+'_n'
			f=false
		}
		s1+=wrap(s,article)
	}

	document.getElementById('p').innerHTML = s1
	if (!article) {
		MathJax.typeset()
	}

	f=new Fraction(1)
	f.sub(1,2);
}

function binomial(k, n) {
	let r = 1;
	for (let i = 1; i <= k; i++) {
		r *= n - k + i;
		r /= i;
	}
	return r;
}

function wrap(s,article) {
	return  '\\begin{flalign*}' + s + '&&\\end{flalign*}'+(article ? '<br>':'')
	// return (!article ? '\\(' : '$$') + s + (inline ? '\\)' : '$$')
}
