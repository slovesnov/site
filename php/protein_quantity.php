<?php
include("../config.php");
connect();
$a = json_decode($_POST['p']);
$s = implode(',', array_map(fn($e) => "'$e'", $a));
$r = $mysqli->query("SELECT name,protein,fat,carbohydrate FROM money_goods_slovesno WHERE name in($s) order by name") or die('error on line' . __LINE__ . $mysqli->error);
$p = $r->fetch_all(MYSQLI_NUM);
die(json_encode($p, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE));