<?php
include("calorieCommon.php");
connect();
getLogin();
$r = $mysqli->query("select name,protein,fat,carbohydrate,b12,fiber,`saturated fat`!=0 or `animal protein`!=0 FROM `money_goods_$jm_user` WHERE food=1") or die('error line' . __LINE__ . $mysqli->error);
$p = $r->fetch_all(MYSQLI_NUM);
die(json_encode([$jm_user, $p], JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE));
