<?php
$a = [];
foreach (scandir("../img/plants") as $f) {
	// if($f=='.' || $f=='..'){
	// 	continue;
	// }
	//need full name for url in js
	if (preg_match("/^IMG.*\.jpg$/", $f)) {
		$a[] = $f;
	}
}
die(json_encode($a));
