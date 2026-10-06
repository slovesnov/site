<?php

include("../config.php");

mb_internal_encoding('UTF-8'); //for mysql-s mb_... functions
$w = 'трутовик';
//$w='зонтик';
$max_diff = 2;

$wa = sp($w);
$wl = count($wa);

$time_begin = microtime(true);
echo "слово <b>$w</b> максимум отличий $max_diff";
$d = file_get_contents('../words/words/ru/words.txt');
$d = mb_convert_encoding($d, "utf-8", "windows-1251");
$a = explode("\n", $d);
$t = array_pop($a); //last empty string ""
$k = 1;
$f = [];
foreach ($a as $e) {
	if (mb_strlen($e) != $wl) {
		continue;
	}
	$b = sp($e);
	$i = 0;
	$j = 0;
	foreach ($wa as $e1) {
		if ($e1 != $b[$i++]) {
			if (++$j > $max_diff) {
				break;
			}
		}
	}
	if ($j <= $max_diff && $j != 0) {
		$f[] = [$e, $j];
	}
}
usort($f, "cmp");
echo "<table>";
$i = 1;
foreach ($f as $e) {
	echo "<tr><td>$i<td>$e[0]<td>$e[1]";
	$i++;
}
$elapsed = round(microtime(true) - $time_begin, 2);
echo "</table>time=$elapsed";

function cmp($a, $b)
{
	if ($a[1] == $b[1]) {
		return strcmp($a[0], $b[0]);
	}
	return $a[1] < $b[1] ? -1 : 1;
}

function sp($s)
{
	return preg_split('//u', $s, -1, PREG_SPLIT_NO_EMPTY);
}
