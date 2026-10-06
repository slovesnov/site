<?php
include("../config.php");

if (!$LOCAL) {
    die('not local');
}
$l = $_POST['gLanguage'] == 'russian' ? [
    'переменная не найдена в скрипте' //0
    ,
    "скрипт не найден" //1
    ,
    "не найдено в скрипте" //2
    ,
    "переменная в скрипте изменена" //3
    ,
    "переменная добавлена в скрипт" //4

] : [
    'variable not found in script' //0
    ,
    "script not found" //1
    ,
    "not found in script" //2
    ,
    "script variable changed" //3
    ,
    "variable added to script" //4
];
$s = $_POST['script'];
$e = '.js';
if (!str_ends_with($s, $e)) {
    $s .= $e;
}
$t = $_POST['t'];
preg_match("~^\w+~", $t, $m) or die($l[0]);
$var = $m[0];


$filename = "../scripts/$s";
file_exists($filename) or die($l[1] . " $s");
$s = file_get_contents($filename);
$c = preg_replace("~(^|\n)\s*$var\s*=\s*([`\"']).+?\\2;?\n?~", "$1$t\n", $s, 1, $count);
$add = 0;
if ($count == 0) {
    $ao = filter_var($_POST['always_overwrite'], FILTER_VALIDATE_BOOLEAN);
    if (!$ao)
        die("$var " . $l[2]);
    if (strlen($s)) {
        $s .= "\n";
    }
    $c = $s . $t;
    $add = 1;
}
file_put_contents($filename, $c);
die($l[3 + $add]);
