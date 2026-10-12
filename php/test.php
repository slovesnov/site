<?php

include_once  '../config.php';
connect();

echo "<p style='white-space:pre;'>";

// $type = ['php' => '.', 'js' => '../scripts'];
// $type = ['php' => '.', 'js' => '../scripts'];


$jsref = [];
foreach (['js' => '../scripts'] as $ex => $dir) {
    foreach (glob("$dir/*.$ex") as $f) {
        if (is_file($f)) {
            $found_files = phplist($f); 
            $jsref = array_merge($jsref, $found_files);
        }
    }
}
$jsref = array_values(array_unique($jsref));

$php = [];
foreach (['php' => '.'] as $ex => $dir) {
  foreach (glob("$dir/*.$ex") as $f) {
    if (is_file($f)) {
      $php[] = basename($f);
    }
  }
}
// print_r($php);

// $r=minus($jsref,$php);
// print_r($r);

$r=minus($php,$jsref);
print_r($r);

// $l=phplist("../scripts/common.js");
// print_r($l);

//filectime fileatime
//print_r($d);

function minus($a,$b){
  $r=[];
  foreach($a as $e){
    if(!in_array($e,$b)){
      $r[]=$e;
    }
  }
  return $r;
}

function phplist($f) {
  $text = file_get_contents($f);
  $pattern = '~\b\w+\.php\b~us';
  if (preg_match_all($pattern, $text, $matches)) {
    return array_values(array_unique($matches[0]));
  }
  return [];
}
