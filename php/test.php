<?php

include_once  '../config.php';
connect();

/*
["cpp","cpp","java","js"]
в английской версии <#cpp>....<#>
в русской можно просто <#cpp><#> без контента
если текст отличается нужно задать изменения в таблице code поле map

CREATE TABLE code_reserve AS SELECT * FROM code;
//todo width reorder

REPLACE INTO code SELECT * FROM code_reserve WHERE NAME = 'aslov1';
*/

$name = "aslov";
const LANGUAGE = ["english", "russian"];
const END_CODE = "<#>";

/*
<pre class="code-container" style="width:1500px"><code class="language-cpp">enum class FILEINFO {
	NAME, EXTENSION, LOWER_EXTENSION, DIRECTORY, SHORT_NAME
};
bool isDir(std::string_view path); // returns whether the path is a directory
std::string getFileInfo(std::string path, FILEINFO fi); // gets information about the file
int getFileSize(const std::string &amp;path); // gets the file size
FILE* open(std::string path, const char *flags); // opens a file with conversion of the path from utf8 to local encoding</code></pre>
*/
echo "<p style='white-space:pre;'>";

// $res = $mysqli->query("SELECT code FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
// $t = $res->fetch_row();
// $code = json_decode($t[0]);
// var_dump(count($code));
// exit;

foreach (LANGUAGE as $language) {
  $text = file_get_contents("../$name,$language.html");
  $d = codePositions($text);
  // print_r($d);
  //print_r(count($d))."<br>";
  // $d[] = $text;
}
//$d = array_column($pageLanguageText, 2);
// print_r($d);
// $l = array_column($pageLanguageText, 1);
// sort($l, SORT_NATURAL | SORT_FLAG_CASE);
// $proceedCode = $pageLanguageText[0][0] == $pageLanguageText[1][0] && $l == LANGUAGE;

// if (!$proceedCode) {
//   die('not proceed code'); //todo
// }
// codeUpdate($pageLanguageText, true, false);
// echo "<p style='white-space:pre'>";
// echo "end";

// function codefullname(string $name, string  $language) {
//   return "../$name,$language.html";
// }

function is_nth_element_same(array $matrix, $n): bool {
  $elements = array_column($matrix, $n);
  $uniqueElements = array_unique($elements);
  return count($uniqueElements) === 1;
}

function codePositions($text) {
  $pattern = '~<pre class="code-container"( style="width:(?P<width>\d+)px")?><code class="language-(?P<language>\w+)">(?P<code>.+?)</code></pre>~us';
  $positions = [];
  if (preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE)) {
    foreach ($matches[0] as $key => $match) {
      $fullText = $match[0];
      $startPos = $match[1];
      $endPos = $startPos + strlen($fullText);
      $positions[] = [$startPos, $endPos, $matches['code'][$key][0], $matches['language'][$key][0], $matches['width'][$key][0]];
    }
  }
  $sameLanguage=is_nth_element_same($positions,3);
  $sameWidth=is_nth_element_same($positions,4);
  var_dump($sameLanguage,$sameWidth);
  return $positions;
}
