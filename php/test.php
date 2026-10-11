<?php

include_once  '../config.php';
connect();
// $name = "aslov";

//   $res = $mysqli->query("SELECT code,language,map,width FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
//   if ($res->num_rows == 0) {
//     die("error code not found");
//   }
//   $t = $res->fetch_row();
//   $code = json_decode($t[0]);
//   $lng = json_decode($t[1]);

// echo "<p style='white-space:pre'>";
// var_dump($code);
// print_r($code);
// print_r($lng);

//   return;
/*
в английской версии <#cpp>....<#>
в русской можно просто <#cpp><#> без контента
если текст отличается нужно задать изменения в таблице code поле map
*/

$name = "aslov";
$t = [];
foreach (["english", "russian"] as $l) {
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

$q = "update code set code='" . $mysqli->real_escape_string($t[0]['code']) . "',language='" . $mysqli->real_escape_string($t[0]['language']) . "' where name='$name'";
// echo $q;
$res = $mysqli->query("$q") or die('error on line' . __LINE__ . $mysqli->error);
echo "affectedRows " . $mysqli->affected_rows;;

$i = -1;
foreach (["english", "russian"] as $l) {
  $i++;
  file_put_contents(fullname($name, $l) . '-', $t[$i]['content']);
}

function fullname($name, $language) {
  return "../$name,$language.html";
}

function codeUpdate($name, $language) {
  global $mysqli;
  $s = file_get_contents(fullname($name, $language));
  $p = allcode($s);
  $res = $mysqli->query("SELECT code,language,map,width FROM code WHERE NAME ='$name'") or die('error on line' . __LINE__ . $mysqli->error);
  if ($res->num_rows == 0) {
    die("error code not found");
  }
  $t = $res->fetch_row();
  $code = json_decode($t[0]);
  $lng = json_decode($t[1]);
  $sameLng = !is_array($lng);
  $number = 0;
  foreach ($p as $e) {
    $l = $e[3];
    if (empty($l)) {
      $number++;
    } else { //<code>
      if ($l != $lng) {
        $sameLng = false;
      }
    }
  }
  if (count($code) != $number) {
    // echo "<pre>";
    // print_r($p);
    die("invalid code count($language) " . count($code) . " " . $number);
  }

  if (!is_array($code)) {
    $code = [$code];
  }
  if (!$sameLng && !is_array($lng)) {
    $lng = array_fill(0, count($code), $lng);
  }
  $j = 0;
  $newCode = [];
  $newLng = [];
  foreach ($p as $e) {
    $l = $e[3];
    if (empty($l)) {
      $c = $code[$j];
      if (!$sameLng) {
        $l = $lng[$j];
      }
      $j++;
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

function allcode($text) {
  $pattern = '/(?P<type1><p id="c(?P<num>\d+)"><\/p>)|(?P<type2><#(?P<lng>\w*)>(?P<content>.*?)<#>)/us';
  $positions = [];
  $i = -1;

  if (preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE)) {
    foreach ($matches[0] as $key => $match) {
      $fullText = $match[0];
      $startPos = $match[1];

      $endPos = $startPos + strlen($fullText);

      if ($matches['type1'][$key][1] !== -1) {
        $i++;
        $id = (int)$matches['num'][$key][0];
        if ($id != $i) {
          die('invalid id order');
        }
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
  return $positions;
}

/*
connect();

$result = $mysqli->query("SELECT name,code FROM code where name='cube1'") or die('error line' . __LINE__ . $mysqli->error);
$c = 1;
$users = [];
while ($row = $result->fetch_row()) {
    $a=json_decode($row[1]);
    if(is_array($a) && count($a)==1){
        echo $row[0]."<br>";
    }
}

$a="package main;

import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

class Cube {

  public static void main(String[] arg) {
    final int init[][] = { { 1, 12, 114, 1068, 10011 }, { 1, 18, 243 } };
    final int q[][] = { { 2, 8, 12, 8 }, { 18, 12 } };
    final BigInteger g = new BigInteger(\"43252003274489856000\");
    BigInteger l[], sum, la, psum;
    int in[], i, layer, metric;

    DecimalFormatSymbols symbols = new DecimalFormatSymbols();
    symbols.setGroupingSeparator(',');
    DecimalFormat df = new DecimalFormat();
    df.setGroupingSize(6);
    df.setDecimalFormatSymbols(symbols);

    for (metric = 0; metric < 2; metric++) {
      in = init[metric];
      l = new BigInteger[in.length];
      System.out.println(metric == 0 ? \"qtm\" : \"htm\");
      for (sum = new BigInteger(\"0\"), layer = 0;; layer++) {
        if (layer < l.length) {
          la = l[layer] = new BigInteger(in[layer] + \"\");
        } else {
          la = new BigInteger(\"0\");
          for (i = 1; i < l.length; i++) {
            la = la.add(l[i].multiply(new BigInteger(q[metric][i - 1] + \"\")));
          }
          for (i = 1; i < l.length - 1; i++) {
            l[i] = l[i + 1];
          }
          l[l.length - 1] = la;
        }
        psum = sum.add(la);
        if (psum.compareTo(g) == 1) {
          System.out.printf(\"layer %2d left %s\\n\", layer - 1, df.format(g.subtract(sum)));
          break;
        } else {
          sum = psum;
          System.out.printf(\"layer %2d %24s total %24s\\n\", layer, df.format(la), df.format(sum));
        }

      }

    }

  }

}";*/
//$s=$mysqli->real_escape_string(json_encode($a));
//$result = $mysqli->query("update code set code='$s' where name='cube1'") or die('error line' . __LINE__ . $mysqli->error);
