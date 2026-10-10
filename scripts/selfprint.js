function load() {
    el('c0', codeString(gs[0], "cpp", '90%'))
    Prism.highlightAll();
}
gs = [String.raw`char *f="char *f=%c%s%c;%c#define Q '%c'%c#define N '%cn'%c#define B '%c%c'%c#include <stdio.h>%cvoid main(){printf(f,Q,f,Q,N,Q,N,B,N,B,B,N,N,N);}%c";
#define Q '"'
#define N '\n'
#define B '\\'
#include <stdio.h>
void main(){printf(f,Q,f,Q,N,Q,N,B,N,B,B,N,N,N);}`]