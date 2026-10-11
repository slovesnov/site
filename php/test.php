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

$name = "parser";
const LANGUAGE = ["english", "russian"];
const END_CODE = "<#>";

echo "<pre>";
$n = 8;
$pageLanguageText = [];
foreach (LANGUAGE as $language) {
  $text = file_get_contents("../$name,$language.html");
  $d = codePositions($text, $n);
  $in = array_column($d, 2);
  print_r($in);
  // $d[] = $text;
  $pageLanguageText[] = $d;
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


function codePositions($text, $n) {
  $pattern = '/(?P<type1><p id="c(?P<num>\d+)"><\/p>)|(?P<type2><#(?P<lng>\w*)>(?P<content>.*?)' . END_CODE . ')/us';
  $positions = [];
  $allid = [];

  if (preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE)) {
    foreach ($matches[0] as $key => $match) {
      $fullText = $match[0];
      $startPos = $match[1];
      $endPos = $startPos + strlen($fullText);

      if ($matches['type1'][$key][1] !== -1) {
        $id = (int)$matches['num'][$key][0];
        if ($id >= $n) {
          return "code id>=db_code_count" . " line" . __LINE__;
        }
        $allid[] = $id;
        $lng = '';
      } else {
        $id = $matches['content'][$key][0];
        $lng = $matches['lng'][$key][0];
        if (empty($lng)) {
          return "error language not set at " . $fullText . " line" . __LINE__;
        }
        if (!in_array($lng, ['cpp', 'java', 'html', 'js', 'php'])) {
          return "invalid language $lng" . " line" . __LINE__;
        }
      }

      $positions[] = [$startPos, $endPos, $id, $lng];
    }
  }
  $len = count(array_unique($allid));
  if ($len !== $n) {
    return "db code count$n != code from html" . $len . " line" . __LINE__;
  }
  if (min($allid) !== 0 || max($allid) !== $n - 1) {
    return "min code id!=0 or max code id!=db_length-1" . " line" . __LINE__;
  }
  return $positions;
}
