<?php

include_once  '../config.php';
connect();

echo "<p style='white-space:pre;'>";
replaceCodeKeywords("aslov");

function replaceCodeKeywords($name) {
	global $mysqli;
	//$result = $mysqli->query("select code,map from code where name='aslov1'") or die('error line' . __LINE__ . $mysqli->error);
	$result = $mysqli->query("select code,map from code where name='$name'") or die('error line' . __LINE__ . $mysqli->error);
	diec(!$result->num_rows, "row not found");
	$row = $result->fetch_row();
	$code = $row[0];
	//var_dump($code);
	$c = json_decode($code);
	// var_dump($c);

	$has_cyrillic = false;
	foreach ($c as $e) {
		if (preg_match("~[а-я]~u", $e)) {
			$has_cyrillic = true;
			break;
		}
	}
	diec(!$has_cyrillic, "russian chars not found");
	$c = preg_replace("~“|”~u", '"', $c, -1, $count);
	$c = preg_replace("~‘|’~u", "'", $c, -1, $count);
	// var_dump($count);

	$d = $row[1];
	$r = json_decode($d, true);
	$re = array_map(fn($e) => str_replace(array_values($r), array_keys($r), $e), $c);
	// var_dump($re);
	echo "<p>";
	// $s = json_encode($re);
	$s = json_encode($re, JSON_UNESCAPED_UNICODE);
	$safe_json = $mysqli->real_escape_string($s);
	var_dump($s);

	$r = $mysqli->query("update code set code='$safe_json' where name='$name'") or die('error on line' . __LINE__ . $mysqli->error);
	echo "affected rows " . $mysqli->affected_rows;
}
