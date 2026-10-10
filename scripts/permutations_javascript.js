function load() {
    const langMap = new Map([
        ["//For permutations with repetitions", "//Для размещений c повторениями"],
        ["//For permutations without repetitions", "//Для размещений без повторений"],
        ["//For combinations", "//Для сочетаний"]
    ]);

    const regex = new RegExp(`(${[...langMap.keys()].join('|')})`, 'g');

    gs.forEach((e, i) => {
        if (gLanguage == 'russian') {
            e = e.replace(regex, match => langMap.get(match))
        }
        el('c' + i, codeString(e, gsl[i]))
    });
    Prism.highlightAll();
}

gsl = ["cpp", "cpp", "java", "js"];
gs = [`//For permutations with repetitions
int * i = new int[k];
for (i[0] = 0; i[0] < n; i[0]++) {
  for (i[1] = 0; i[1] < n; i[1]++) {
    for (i[2] = 0; i[2] < n; i[2]++) {
      //...
    }
  }
}
delete[] i;

//For permutations without repetitions
int * i = new int[k];
for (i[0] = 0; i[0] < n; i[0]++) {
  for (i[1] = 0; i[1] < n; i[1]++) {
    if (i[1] == i[0]) {
      continue;
    }
    for (i[2] = 0; i[2] < n; i[2]++) {
      if (i[2] == i[0] || i[2] == i[1]) {
        continue;
      }
      //...
    }
  }
}
delete[] i;

//For combinations
int * i = new int[k];
for (i[0] = 0; i[0] < n; i[0]++) {
  for (i[1] = i[0] + 1; i[1] < n; i[1]++) {
    for (i[2] = i[1] + 1; i[2] < n; i[2]++) {
      //...
    }
  }
}
delete[] i;`, String.raw`#include "Permutations.h"
#include <cstdio>
#include <string>

int main() {
  int i;

  Permutations p(2, 4, Permutations::PERMUTATIONS_WITHOUT_REPLACEMENTS);
  printf("combinations=%2d ", p.number());
  for (auto &v : p) {//v is std::vector<int>
    i = 0;
    printf("{");
    for (int a : v) {
      printf("%s%d", i ? " " : "", a);
      i++;
    }
    printf("}");
  }
  printf("\n");

  std::string s;
  p.init(2, 4, Permutations::PERMUTATIONS_WITH_REPLACEMENTS);
  printf("combinations=%2d ", p.number());
  auto f = [&s](auto &v) {
    s += '{';
    int i = 0;
    for (auto &a : v) {
      s += (i ? " " : "") + std::to_string(a);
      i++;
    }
    s += '}';
  };
  p.forEach(f);
  printf("%s\n", s.c_str());

  p.init(2, 4, Permutations::COMBINATION);
  printf("combinations=%2d ", p.number());
  do {
    printf("{");
    for (i = 0; i < p.getK(); i++) {
      printf("%s%d", i ? " " : "", p.getIndex(i));
    }
    printf("}");
  } while (p.next());
  printf("\n");

}`, `package permutations;

public class Test {
  public static void main(String[] args) throws Exception {
    int i;
    String s;
    Permutations p = new Permutations();
    for (PermutationType type : PermutationType.values()) {
      p.init(2, 4, type);
      s = String.format("combinations=%2d ", p.number());
      for (int[] a : p) {
        i = 0;
        s += "{";
        for (int v : a) {
          if (i != 0) {
            s += " ";
          }
          s += v;
          i++;
        }
        s += "}";
      }
      System.out.println(s);
    }
  }
}`, `<html>

<head>
  <script src="permutations.js"></script>
  <script>
    function load() {
      let i, s = '';
      let p = new Permutations(2, 4, Permutations.PERMUTATIONS_WITHOUT_REPLACEMENTS);
      s += "combinations=" + String(p.number()).padStart(2) + " ";
      for (const e of p) {
        //e - is array
        s += '{' + e.join(' ') + '}';
      }
      s += '<br>'

      p.init(2, 4, Permutations.PERMUTATIONS_WITH_REPLACEMENTS);
      s += "combinations=" + String(p.number()).padStart(2) + " ";
      //e - is array
      p.forEach(e => s += "{" + e.join(' ') + "}")
      s += '<br>'

      p.init(2, 4, Permutations.COMBINATION);
      s += "combinations=" + String(p.number()).padStart(2) + " ";
      do {
        s += "{";
        for (i = 0; i < p.getK(); i++) {
          if (i != 0) {
            s += " ";
          }
          s += p.getIndex(i);
        }
        s += "}";
      } while (p.next());
      s += '<br>'

      document.getElementById('p').innerHTML = s
    }
  </script>
</head>

<body onload="load()">
  <pre id="p"></pre>
</body>
</html>`];