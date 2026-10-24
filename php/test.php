<?php

include_once  '../config.php';
connect();


echo "<p style='white-space:pre;'>";
$result = $mysqli->query("select name,code from code ") or die('error line' . __LINE__ . $mysqli->error);
echo "<table>";
$c = 0;
while ($row = $result->fetch_row()) {
	$result1 = $mysqli->query("select count(*) from pages where name='$row[0]' ") or die('error line' . __LINE__ . $mysqli->error);
	$row1 = $result1->fetch_row();
	$c+=$row1[0];
	$hasru = var_export(preg_match("~[а-яё]~ui", $row[1]), 1);
	echo "<tr><td>$row[0]<td>$hasru<td>$row1[0]";
}
echo "</table>$c";
