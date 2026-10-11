<?php

include_once  '../config.php';
connect();
$name = "permutations";

$res = $mysqli->query("SELECT map FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
if ($res->num_rows == 0) {
  die("error code not found");
}
$t = $res->fetch_row();
$m = json_decode($t[0]);


echo "<p style='white-space:pre'>";
print_r($t[0]);
print_r($m);

$n = [];
foreach ($m as $k => $v) {
  $n[substr($k, 2)] = substr($v, 2);
}
$n = json_encode($n, JSON_UNESCAPED_UNICODE);
print_r($n);
$q = "update code set map='" . $mysqli->real_escape_string($n) . "' where name='$name'";
$res = $mysqli->query("$q") or die('error on line' . __LINE__ . $mysqli->error);
echo "affectedRows " . $mysqli->affected_rows;;

return;
/*
в английской версии <#cpp>....<#>
в русской можно просто <#cpp><#> без контента
если текст отличается нужно задать изменения в таблице code поле map
*/



$name = "aslov";
const LNG = ["english", "russian"];
$t = [];
foreach (LNG as $l) {
  $t[] = codeUpdate($name, $l);
}
echo "<p style='white-space:pre'>";
foreach (array_keys($t[0]) as $k) {
  if (in_array($k, ['languge', 'count'])) {
    if ($t[0][$k] != $t[1][$k]) {
      die("different $k " . $t[0][$k] . " != " . $t[1][$k]);
    }
  }
}

// $q = "update code set code='" . $mysqli->real_escape_string($t[0]['code']) . "',language='" . $mysqli->real_escape_string($t[0]['language']) . "' where name='$name'";
// $res = $mysqli->query("$q") or die('error on line' . __LINE__ . $mysqli->error);
// echo "affectedRows " . $mysqli->affected_rows;;

// $i = -1;
// foreach (LNG as $l) {
//   $i++;
//   file_put_contents(fullname($name, $l) . '-', $t[$i]['content']);
// }
/*
UPDATE code AS target
JOIN code AS source ON source.name = 'aslov1'
SET target.code = source.code,
    target.language = source.language
WHERE target.name = 'aslov';

INSERT INTO code (name, code, LANGUAGE,map,width)
SELECT 'parser_reserve', code, LANGUAGE,map,width
FROM code
WHERE name = 'parser';
*/
echo "end";

function fullname($name, $language) {
  return "../$name,$language.html";
}

function codeUpdate($name, $language) {
  global $mysqli;
  $res = $mysqli->query("SELECT code,language,map,width FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
  if ($res->num_rows == 0) {
    die("error code not found");
  }
  $t = $res->fetch_row();
  $code = json_decode($t[0]);
  if (!is_array($code)) {
    $code = [$code];
  }
  $lng = json_decode($t[1]);
  $s = file_get_contents(fullname($name, $language));
  $p = allcode($s, count($code));
  $sameLng = !is_array($lng);
  foreach ($p as $e) {
    $l = $e[3];
    if (!empty($l)) { //<code>
      if ($l != $lng) {
        $sameLng = false;
      }
    }
  }

  if (!$sameLng && !is_array($lng)) {
    $lng = array_fill(0, count($code), $lng);
  }
  $newCode = [];
  $newLng = [];
  foreach ($p as $e) {
    $l = $e[3];
    if (empty($l)) {
      $i = $e[2];
      $c = $code[$i];
      if (!$sameLng) {
        $l = $lng[$i];
      }
    } else { //<code>
      $c = $e[2];
    }
    $newCode[] = htmlspecialchars_decode($c);
    if (!$sameLng) {
      $newLng[] = $l;
    }
  }
  $c = json_encode($newCode);
  $l = json_encode($sameLng ? $lng : $newLng);

  for ($i = count($p) - 1; $i >= 0; $i--) {
    $start = $p[$i][0];
    $end   = $p[$i][1];
    $N     = $i;
    $length = $end - $start;
    $replacement = '<p id="c' . $N . '"></p>';
    $s = substr_replace($s, $replacement, $start, $length);
  }

  return ['content' => $s, 'count' => count($p), 'code' => $c, 'language' => $l];
}

function allcode($text, $n) {
  $pattern = '/(?P<type1><p id="c(?P<num>\d+)"><\/p>)|(?P<type2><#(?P<lng>\w*)>(?P<content>.*?)<#>)/us';
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
          die("code id>=db_code_count");
        }
        $allid[] = $id;
        $lng = '';
      } else {
        $id = $matches['content'][$key][0];
        $lng = $matches['lng'][$key][0];
        if (empty($lng)) {
          die("error language not set at " . $fullText);
        }
        if (!in_array($lng, ['cpp', 'java', 'html', 'js', 'php'])) {
          die("invalid language $lng");
        }
      }

      $positions[] = [$startPos, $endPos, $id, $lng];
    }
  }
  if (min($allid) !== 0 || max($allid) !== $n - 1 || count(array_unique($allid)) !== $n) {
    die("not sequence id");
  }
  return $positions;
}
