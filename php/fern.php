<?php

//include("../config.php");
define('path', '../img/fern/');
$start  = new DateTime();

const fern = [
	'pteridiumAquilinum',
	'matteucciaStruthiopteris',
	'athyriumFilix-femina',
	'dryopterisFilix-mas',
	'dryopterisExpansa',
	'dryopterisCarthusiana',
	'gymnocarpiumDryopteris'
];

$time = $start->diff(new DateTime())->format('%I:%S');
resize();
echo "time $time";

function resize()
{
	$a = [
		'o2gymnocarpiumDryopteris.jpg',
		'o4gymnocarpiumDryopteris.jpg',
		'o4dryopterisExpansa.jpg',
		'o4dryopterisFilix-mas.jpg'
	];
	foreach ($a as $e) {
		$image = imagecreatefromjpeg(path . $e);
		$i = imagescale($cropped, 300, 401);
		imagejpeg($i, path . substr($name, 1));
	}
}

//only one time need
function f0()
{
	for ($i = 1; $i < count(fern); $i++) {
		$name = "-0_" . fern[$i] . ".jpg";
		$image = imagecreatefromjpeg(path . $name);
		list($w, $h) = getimagesize(path . $name);
		$newwidth = 300;
		$newheight = $h * $newwidth / $w;
		$im = imagescale($image, $newwidth, $newheight);
		imagejpeg($im, path . substr($name, 1));
	}
}

function f3()
{
	$r = [
		null,
		[965, 1944, 575, 1020],
		[536, 1098, 1437, 1824],
		[401, 530 + 120, 1733, 2884],
		[1121, 906, 1308, 2354],
		[821, 373, 1393, 2539],
		null
	];
	if (count($r) != count(fern)) {
		die('error line' . __LINE__);
	}
	$indexes = null; //[5];

	$i = -1;
	$m = 0;
	foreach ($r as $e) {
		$i++;
		if (check($e, $i, $indexes)) {
			continue;
		}
		$k = $e[3] / $e[2];
		if ($k > $m) {
			$m = $k;
			$mi = $i;
		}
	}

	$i = -1;
	foreach ($r as $e) {
		$i++;
		if (check($e, $i, $indexes)) {
			continue;
		}

		$h = $e[2] * $m;
		echo $e[2] . " ";
		cropSave(3, $i, $e[0], $e[1] - ($h - $e[3]) / 2, $e[2], $h, 300);
	}
}

function f1()
{
	$r = [
		null,
		[1220, 1900, 400],
		[730, 1350, 800],
		[1130, 880, 800],
		[1080, 1200, 800],
		[1130, 800, 800],
		null
	];
	$indexes = null; //[5];

	if (count($r) != count(fern)) {
		die('error line' . __LINE__);
	}

	$kh = 3;

	$i = -1;
	foreach ($r as $e) {
		$i++;
		if (check($e, $i, $indexes)) {
			continue;
		}
		$x = $e[0];
		$y = $e[1];
		$w = $e[2];
		if ($i == 4 || $i == 5) {
			$k = 1.4;
			$x -= $w * ($k - 1) / 2;
			$y -= $kh * $w * ($k - 1);
			$w *= $k;
			if ($i == 5) {
				$x -= 40;
				$y = 0;
			}
		}
		cropSave(1, $i, $x, $y, $w, $w * $kh, 215);
	}
}

function cropSave($n, $i, $x, $y, $w, $h, $newwidth)
{
	$name = "o" . $n . "_" . fern[$i] . ".jpg";
	$image = imagecreatefromjpeg(path . $name);
	$cropped = imagecrop($image, ['x' => $x, 'y' => $y, 'width' => $w, 'height' => $h]);
	$newheight = $h * $newwidth / $w;
	$i = imagescale($cropped, $newwidth, $newheight);
	imagejpeg($i, path . substr($name, 1));
}

function check($e, $i, $indexes)
{
	return $e === null || is_array($indexes) && !in_array($i, $indexes) || is_numeric($indexes) && $indexes != $i;
}
