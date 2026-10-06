<?php
include("../config.php");

connect();

$v = $_POST['p'];
//  $v="'watermelon_seeds','russula_foetens','fireweed','sauerkraut','chicken','noodles','pickled_mushrooms','pancakes','pastila_rhubarb','ladyfern_braising_presentation','beet','lard','pickledhot_mushrooms','braised_mushrooms','brackenfern_braised','linden_tea_presentation','chebureki','apple_icecream'";

//select ... where name in() gives arbitrary order so use ORDER BY FIELD(name,$v)
$r = $mysqli->query("SELECT admin_only FROM pages where name in($v) ORDER BY FIELD(name,$v)") or die('error line' . __LINE__ . $mysqli->error);
$a = $r->fetch_all(MYSQLI_NUM);
$a = array_map(fn($e) => (int)$e[0], $a);
// $a = [];
// while ($row = $r->fetch_row()) {
// 	$a[] = (int)$row[0];
// }
echo json_encode($a);
