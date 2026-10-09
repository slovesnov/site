function load() {
    gs.forEach((e, i) => {
        el('c' + i, codeString(e, "cpp"));
    });
    Prism.highlightAll();
}

gs=[ String.raw`BigUnsigned bu("+0x1234f");
cout << bu << endl; //74575

bu = "1234";
bu.print("\n"); //1234

bu = uint64_t(-1);
cout << bu.toDecString(6) << endl; //18,446744,073709,551615

try {
  bu = -1;
} catch (const BigNumberException &e) {
  cerr << e.what() << endl; //..\src\BigUnsigned.h:141 operator= [negative value]
}

BigInteger bi;
bi = "-0xab,cd,ef,ab,cd,ef"; // bi="-0xabcdefabcdef"
cout << bi << " " << bi.to0xHexString() << endl; //-188900977659375 -0xabcdefabcdef

bi = INT_MIN;
cout << bi << " " << bi.toHexString() << endl; //-2147483648 -80000000

try {
  bi = "2345af";
} catch (const BigNumberException &e) {
  cerr << e << endl; //..\src\BigUnsigned.cpp:547 prepareString [invalid symbol in decimal string]
}`,String.raw`BigUnsigned bu = "0x123456789abcdef";
//81 985 529 216 486 895 123.456789.abcdef
cout << bu.toDecString(3, ' ') << " " << bu.toHexString(6, '.') << endl; 

BigInteger bi = "-0x123456789abcdef";
cout << bi.to0xHexString(6) << endl; //-0x123,456789,abcdef

bi.print("\n"); //-81985529216486895

printf("%s\n",bi.toHexString().c_str()); //-123456789abcdef`, String.raw`BigUnsigned q, r;
int divisor = 80;
BigUnsigned bu = 100;
bu = bu + 200;
bu += "0xff";
bu -= std::string("255");
bu = bu * uint64_t(3); //bu=900
bu.div(divisor, q, r); //q=bu/divisor r=bu%divisor
cout << bu << "=" << divisor << "*" << q << "+" << r << endl; //900=80*11+20

BigInteger bi("-345");
cout << (bi <= 0xff) << (bi >= "-1") << (bi == 345) << endl; //100
cout << bi % 44 << " " << bi / 28 << endl; //-37 -12`, String.raw`//Factorial(), binomial coefficient binomial() and power pow() functions.
BigUnsigned bu = 10;
cout << bu.factorial() << " " << BigUnsigned::factorial(5) << endl; //3628800 120

BigInteger bi = 0;
cout << bi.factorial() << " " << BigInteger::factorial(6) << endl; //1 720

bu = BigUnsigned::binomial(10, 20);
cout << bu << endl; //184756

bi = BigInteger::binomial(13, 26);
cout << bi << endl; //10400600

bu = 2;
cout << bu.pow(16) << " " << BigUnsigned::pow(16, 2) << endl; //65536 256

bi = -3;
cout << bi.pow(3) << " " << BigInteger::pow(-5, 3) << endl; //-27 -125

//Conversion to double and long double, mantissa, exponent.
BigUnsigned bu = BigUnsigned::factorial(20);
std::pair<double, int> p = bu.getMantissaExponent();
int i;
double v = 1;
for (i = 2; i <= 20; i++) {
  v *= i;
}
printf("%.2le\n", v);
printf("%lfe%+d\n", p.first, p.second);

BigInteger bi = 123;
v = bi.toDouble();
p = bi.getMantissaExponent();
printf("%le\n", v);
printf("%lfe%+d\n", p.first, p.second);

BigUnsigned bu = BigUnsigned::factorial(200);
auto v = bu.toDouble();
auto vl = bu.toLongDouble();
cout << v << " " << vl << endl; //inf 7.88658e+374
auto p = bu.getMantissaExponentLongDouble();
cout << p.first << " " << p.second << endl; //7.88658 374

//Conversion to uint64_t only BigUnsigned class.
BigUnsigned bu = BigUnsigned::factorial(20);
auto v = bu.toUint64_t();
cout << v << endl; //2432902008176640000

/* Functions hexToDecString() and decToHexString() convert hexadecimal to decimal string and 
vice versa. This functions have two additional parameters: number of positions and separator 
symbol. This parameters are the same with string conversion functions.*/
cout << BigUnsigned::decToHexString("123456789", 2, '.') << endl; //7.5b.cd.15
cout << BigUnsigned::hexToDecString("0xaaa") << endl; //2730

cout << BigInteger::decToHexString("65535") << endl; //ffff
cout << BigInteger::hexToDecString("0xffff,ffff", 6) << endl; //4294,967295

//Shift operators >> and <<
BigUnsigned bu = 1;
bu <<= 32;
cout << bu.to0xHexString() << endl; //0x100000000

BigInteger bi = bu;
bi >>= 16;
cout << bi << endl; //65536

//Bitwise operators & | ^ ~
BigUnsigned bu = 0x1a3c;
cout << (bu & 0x53bc).toHexString() << " " << (bu | 0x53bc).toHexString()
    << endl; //123c 5bbc
cout << (~bu).toHexString() << " " << (bu ^ 0x53bc).toHexString() << endl; //ffffe5c3 4980

//Absolute value abs(), getUnsigned() (only BigInteger class)
BigInteger bi = -0xadb;
cout << bi.abs() << " " << bi.getUnsigned() << endl; //2779 2779`, String.raw`try {
  BigUnsigned bu = "0xadbg";
} catch (BigNumberException const &e) {
  cerr << e << endl; //..\src\BigUnsigned.cpp:547 prepareString [invalid symbol in hex string]
}

try {
  BigUnsigned bu = 0xadb;
  bu = bu - 0xfff;
} catch (BigNumberException const &e) {
  //..\src\BigUnsigned.cpp:230 operator- [try to subtract bigger number]
  fprintf(stderr, "%s", e.what()); 
}`, String.raw`Fraction < uint64_t > e(2, 3);
cout << e << endl; //2/3

Fraction < uint64_t > f(2); //2/1
cout << f << endl; //2

Fraction < BigUnsigned > g(128, -16); //128/-16
cout << g << endl; //-8

Fraction < BigUnsigned > h("0xffffff", "28");
cout << h << endl; //2396745/4`, String.raw`Fraction < uint64_t > f("0xfffffffffff", "-56795365");
cout << f.toString(6) << endl; //-3,518437,208883/11,359073
cout << f.toString(4, '.') << endl; //-3.5184.3720.8883/1135.9073

f.print("\n"); //-3518437208883/11359073

cout << f.specialString(false) << endl; //-3518437208883/11359073
cout << f.specialString(true, 3, ' ') << endl; //-\frac{3 518 437 208 883}{11 359 073}`, String.raw`typedef Fraction<BigUnsigned> Frac;
Frac f(1, 2);
f -= Frac(1, 6);
cout << f << endl; //1/3
f /= Frac(10, 8);
cout << f << endl; //4/15

cout << (f <= 0) << endl; //0`, String.raw`typedef Fraction<BigUnsigned> Frac;
Frac f;
f.init(false, 2, 7);
cout << f << endl; //-2/7
f.init(true, 2, 8);
cout << f << endl; //1/4

f.dividend = 100;
f.divider = 35;
cout << f << endl; //100/35
f.normilize();
cout << f << endl; //20/7

cout << Frac::gcd(35, 100) << endl; //5`, String.raw`typedef Fraction<BigUnsigned> Frac;

try {
  Frac f(1, 0); //1/0
} catch (BigNumberException const &e) {
  cerr << e << endl; //..\src\Fraction.h:52 init [zero division]
}

try {
  Frac f(1);
  f /= Frac(0, 1);
} catch (BigNumberException const &e) {
  cerr << e << endl; //..\src\Fraction.h:52 init [zero division]
}`]