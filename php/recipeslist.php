<?php
// http://localhost/php/recipeslist.php
$dir = '../../!recipes';
$files = scandir($dir);

echo '<table border=1><tr><td>N<td>file name<td>string';
$i = 1;
foreach ($files as $f) {
	if ($f == '.' || $f == '..') {
		continue;
	}

	$fp = $dir . '/' . $f;
	if (is_dir($fp)) {
		continue;
	}
	$s = file_get_contents($fp);
	$l = explode("\n", $s);
	echo "<tr><td>$i<td>$f<td>" . $l[0];
	$i++;
}
