function load() {
  const langMap = new Map([
    ["нескомпрометированный", "algorithmically"],
    ["термокомпенсированный", "logarithmically"]
  ]);

  const regex = new RegExp(`(${[...langMap.keys()].join('|')})`, 'g');

  d.forEach((e, i) => {
    if (gLanguage == 'english') {
      e = e.replace(regex, match => langMap.get(match))
    }
    el('c' + i, codeString(e, i == 2 ? "html" : "cpp"))
  });
  Prism.highlightAll();
}
d = [String.raw`#include "cgi/cgi.h"

int main() {
  Cgi c;

  if (!c.ok()) {
    return 1;
  }

  std::cout << c.m_method << "{" << std::endl;
  for (auto a : c) {
    std::cout << a.first << "=" << a.second << std::endl;
  }
  std::cout << "}" << std::endl;
 
  if (c.m_method == "POST") {
    std::cout << "CONTENT TYPE " << c.m_contentType << std::endl;
   
    std::cout << "FILES{" << std::endl;  
    for (auto a : c.m_files) {
     
      std::cout << "\t" << a.first << "{" << std::endl;
      for (auto f : a.second) {
        std::cout << "\t\t" << f.name << " " << f.type << " " << f.content.length() << std::endl;
      }
      std::cout << "\t}" << std::endl;
     
    }
    std::cout << "}" << std::endl;
    //std::cout<<c.m_files["file"][0].name;
  }
 
  std::cout << "COOKIE{" << std::endl;
  for (auto a : c.m_cookie) {
    std::cout << a.first << "=" << a.second << std::endl;
  }
  std::cout << "}" << std::endl;
 
}`,
  `#include "cgi/cgi.h"

using VUint = std::vector<uint32_t>;

VUint utf8ToVector(std::string const &s, bool sort) {
  VUint v;
  uint32_t b;
  int i;
  const uint8_t *p = (const uint8_t*) s.c_str();
  while (*p) {
    if ((*p & 0x80) == 0) {
      i = 0;
    } else if ((*p & 0xE0) == 0xC0) {
      i = 1;
    } else if ((*p & 0xF0) == 0xE0) {
      i = 2;
    } else if ((*p & 0xF8) == 0xF0) {
      i = 3;
    } else {
      std::cerr << "Unrecognized lead byte (" << std::hex << *p << ")"
          << std::endl;
      break;
    }
    for (b = 0; i >= 0; i--) {
      b |= *p++ << (i * 8);
    }
    v.push_back(b);
  }
  if (sort) {
    std::sort(v.begin(), v.end());
  }
  return v;
}

int main() {
  VUint t[2];
  int i;
  Cgi c;

  if (!c.ok()) {
    return 1;
  }

  std::cout << c.m_method << "{" << std::endl;
  for (auto a : c) {
    std::cout << a.first << "=" << a.second << std::endl;
  }
  std::cout << "}";

  if (c.size() < 2) {
    std::cout << "too few parameters";
  } else {
    for (i = 0; i < 2; i++) {
      t[i] = utf8ToVector(c.value(i), true);
    }
    std::cout << " " << (t[0] == t[1]);
  }
}`,
  `<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script>
    function load() {
      let s = location.href, i;
      if (s.startsWith("file:")) {
        i = s.lastIndexOf('/')
        window.location = 'http://localhost' + s.substring(i)
      }
    }

    function bclick(n) {
      let e = document.querySelector("form")
      fetchgetpost(e.action, new FormData(e), callback, n)
    }

    function callback(s) {
      document.getElementById('p').innerHTML = s
    }

    function fetchgetpost(url, body, f, post = 1) {
      let o
      if (post) {
        o = { method: 'POST', body }
      }
      else {
        url += "?" + new URLSearchParams(body)
      }
      fetch(url, o)
        .then(r => r.text())
        .then(r => f(r))
        .catch(e => f(e))
    }

  </script>
</head>

<body onload="load()">
  <form action="cgi-bin/cgi.exe">
    строка 1 <input type="text" name="s0" value="нескомпрометированный"><br>
    строка 2 <input type="text" name="s1" value="термокомпенсированный"><br>
    <button type="submit">submit form get</button>
    <button type="submit" formmethod="post">submit form post</button>
  </form>
  <button onclick="bclick(0)">fetch get</button>
  <button onclick="bclick(1)">fetch post</button>
  <p id="p"></p>
</body>

</html>`]