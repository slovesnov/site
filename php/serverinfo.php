<?php
echo "<table>";

foreach ($_SERVER as $k => $v) {
	echo "<tr><td>$k<td>$v";
//~ 	$a=var_export($v,1);
//~ 	echo "<td>$a";
}
echo "</table>";