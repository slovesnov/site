<?php
include("calorieCommon.php");
$y = "(\\d+(?:\\.\\d*)?|\\.\\d+)";
$d = json_decode($_POST['data']);
$a = [[], []];
for ($i = 0; $i < 2; $i++) {
	$q = $i == 0 ? 'protein' : '(protein+carbohydrate)*4+9*fat';
	foreach ($d[$i] as $e) {
		if (preg_match("/бжу\s*$y\s+$y\s+$y/", $e, $m)) {
			$v = $i == 0 ? $m[1] : 4 * $m[1] + 9 * $m[2] + 4 * $m[3];
		} else {
			$n = parseNameMass($e . " 1", true); //add mass at the end
			//diec($n === false, "не распознан товар в строке [$e].", __LINE__);
			$n = $n[namel];
			$r = $mysqli->query("SELECT $q FROM money_goods_slovesno where name='$n'") or die('error line' . __LINE__ . $mysqli->error);
			if ($r->num_rows == 0) {
				$t = var_export($n, 1);
				die("[$e][$t] не найдено");
			}
			$row = $r->fetch_row();
			$v = $row[0];
		}
		$a[$i][] = round($v, 1);
	}
}
die(json_encode($a));
