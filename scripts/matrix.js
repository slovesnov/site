function load() {
    d.forEach((e, i) => {
        el('c' + i).insertAdjacentHTML("afterend", codeString(e, 'cpp'))
    });
    Prism.highlightAll();
}

d = [`Matrix M(3, 2);
int i = M.GetRows(); // i = 3
int j = M.GetCols(); // j = 2`, `Matrix M(2, 2, 1, 2, 3, 4);
int i = M(1, 0); // i = 3 equals to the element of the second row and first column`, `Matrix A(3, 2);
Matrix B = T(A);
Matrix C = *A; //matrices B and C are equal to transposition of matrix A.`, `Matrix A(1, 1, 3.4);
Matrix B(1.8);
double a = double(A); // a=3.4
double b = double(B); // b=1.8`, `#include "matrix.cpp"
void main() {
  try {
    Matrix A(3, 1, 1, 2, 3), B(2, 1, 1, 2); // creates two vectors
    double d = 2;
    Matrix C = T(B), D = *B; //  C = D = Transposition(B).
    A.Print(); // print content of the matrix
    Print(B); // print content of the matrix
    B /= d; // B=B/d;
    A = A + B; // addition
    int i = B.GetRows(); // i=2
    i = B.GetCols(); // i=1
    d = B(0, 0); // d=1
  } catch (CMatrixException Me) {
    Me.PrintMessage(); // Addition isn't possible
  }
}`]