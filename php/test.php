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
// echo "<p style='white-space:pre;'>";

echo "<table>";
foreach (['css', 'script'] as $f) {
  $r = $mysqli->query("select name,language,css,script from pages ") or die('error line' . __LINE__ . $mysqli->error);
  $new = [];
  while ($row = $r->fetch_row()) {
    $show = false;
    for ($i = 2; $i < 4; $i++) {
      $words = preg_split('/\s+/', trim($row[$i]));
      sort($words);
      $new[$i] = implode(' ', $words);
      if ($new[$i] != $row[$i]) {
        $show = true;
      }
    }
    if ($show) {
      echo "<tr><td>" . implode('<td>', [$row[0] . " " . $row[1], $row[2], $new[2], $row[3], $new[2]]);
    }
  }
}
echo "</table>";


// $res = $mysqli->query("SELECT code FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
// $t = $res->fetch_row();
// $code = json_decode($t[0]);
// var_dump(count($code));
// exit;
