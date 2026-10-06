<?php

$dir    = 'img';

$dir    = '../' . $dir;
$files = scandir($dir);

echo "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='shortcut icon' href='../favicon/phpmyadmin.ico' />
<meta name='viewport' content='width=device-width, initial-scale=1' />
<link rel='stylesheet' type='text/css' href='../css/common.css'>
<link rel='stylesheet' type='text/css' href='../css/table.css'>
</head><body style='margin-left:7px'><p>";

echo '<table class="table_border table_color"><thead><tr><th>N<th>file name<th>size<th>last modified<th>filectime<th>last access</thead>';

$i = 1;
$totalsize = 0;

foreach ($files as $f) {
	if ($f == '.' || $f == '..') {
		continue;
	}

	$fp = $dir . '/' . $f;
	$size = filesize($fp);
	$isdir = is_dir($fp);
	if ($isdir) {
		$totalsize += $size;
	}
	echo '<tr><td>' . $i . '<td>' . ($isdir ? '' : '<a href="' . $fp . '">') . $f . '<td align="right">' . ($isdir ? 'dir' : numberFormat($size));
	foreach (['m', 'c', 'a'] as $e)
		echo '<td align="right">' . dateFormat("file{$e}time"($fp));

	$i++;
}

echo '<tr><td><td>total<td align="right">' . numberFormat($totalsize);
echo '<td><td><td>';
echo '</table>';

function dateFormat($date)
{
	return date("dMy H:i:s", $date);
}

//1234 -> 1,234
function numberFormat($i)
{
	return number_format($i);
}
