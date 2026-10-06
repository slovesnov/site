<?php
/*http://localhost/php/plantarium.php
*/

include("../config.php");
$a = [
	'щитовник мужской 13752', //0
	'кочедыжник женский 5883', //1
	'щитовник широкий 13749', //2
	'щитовник картузианский 13740', //3
	'щитовник гребенчатый 13746', //4
	'голокучник обыкновенный17826', //5
	'телиптерис болотный38143', //6
];
$i = 6;
$name = $a[$i];
preg_match('/\d+$/u', $name, $m);
$id = $m[0];

//$id=13746;
define('root', 'https://www.plantarium.ru');
define('storeFolder', 'plant');
set_time_limit(10000);

$start  = new DateTime();
$stored = 0;
//$s = file_get_contents('c:/downloads/Кочедыжник женский - Athyrium filix-femina - Описание таксона - Плантариум.html', true);
$s = file_get_contents(root . "/page/view/item/$id.html");
preg_match('/>(\d+)<\/a><\/span><span class="nav-controls nav-controls-forward">/', $s, $m);
$parts = $m[1];
//echo "pages=$parts ";

foreach ([storeFolder, storeFolder . "/$name"] as $f) {
	if (!file_exists($f)) {
		mkdir($f, 0777, true);
	}
}

//$i=0 store images from root
for ($i = 0; $i <= $parts; $i++) {
	if ($i) {
		$s = file_get_contents(root . "/page/view/item/$id/part/$i.html");
	}
	preg_match_all('/<a href="\/page\/image\/id\/(\d+)\.html">/', $s, $ma);
	// $c=1;
	foreach ($ma[1] as $e) {
		$s = file_get_contents(root . "/page/image/id/$e.html");
		preg_match('/<img id="imgMain" class="img-full" src="(.+?)"/', $s, $m);
		$u = $m[1];
		$j = strrpos($u, '/');
		$l = substr($u, $j + 1);
		file_put_contents(storeFolder . "/$name/$l", file_get_contents(root . $u));
		// file_put_contents(storeFolder."/$id/$l-$page-$c", file_get_contents(root.$u));
		// $c++;
		$stored++;
		//break;
	}
}

$time = $start->diff(new DateTime())->format('%I:%S');
echo "time $time, stored $stored";
