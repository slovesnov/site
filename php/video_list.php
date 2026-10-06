<?php
include("../config.php");
connect();
$result = $mysqli->query("select * from videos order by date desc") or die('error on line' . __LINE__ . $mysqli->error);
$a = $result->fetch_all();
echo json_encode($a, JSON_UNESCAPED_UNICODE);
