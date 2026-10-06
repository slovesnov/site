<?php

include("../config.php");

define("NOT_FOUND", 'not found');

/*
in case of dud make statistics of all videos of youtube channel without playlist
in case of chbd make statistics of all videos of youtube channel from playlist

dud/foodee {
	open dud channel
	scroll down to view all videos
	copy div with references tag to dud2.html/foodee file
	run this file
}
chbd{
	open label.com on youtube
	go to playlists
	open playlist with name Что было дальше?
	save html
	run this file

	for items if length not found need to add it manually
}
*/
set_time_limit(1500);
$type = ['dud', 'chbd', 'foodee'];
const type = 1; //index
foreach ($type as $k => $v) {
	define($v, $k);
}
$filename = $type[type];
const saveNamesToFile = 0;
const breakIndex = -1; //-1 if store full data
/*
$s=file_get_contents("names.txt");
echo '<html><head>
<link rel="stylesheet" type="text/css" href="../css/common.css">
</head>';
echo "<table class='single'>";
foreach(explode("\n",$s) as $e){
	echo "<tr><td>[$e]<td>[".proceedName($e)."]";
}
echo "</table>";
exit;
*/

// $u='https://www.youtube.com/watch?v=9fF-F3wzAg4&list=PL5IJE4Sb2T6nUYAtlqOipbUXg5WRTBRlx&index=222';
// $s=file_get_contents($u);
// //$s=file_get_contents($u,false,null,0,10);
// var_dump(strlen($s));
// //var_dump($s);
// exit;

// $v=getUrlData($u,0);
// echo "[".implode("][",$v)."]";
// echo "<br>";
// $v=getUrlData($u,1);
// echo "[".implode("][",$v)."]";
// exit;

$s = file_get_contents("C:/slovesno/$filename.html");
if (type == dud || type == foodee) {
	preg_match_all("/<a id=\"video-title-link\".*? title=\"([^\"]+)\" href=\"\/watch\?v=([^\"]+)\">/", $s, $m);
	$u = $m[2];
} elseif (type == chbd) {
	preg_match_all("/:\"\/watch\?v=([^\"]+)\"/", $s, $m);
	// echo '<html><head>
	// <link rel="stylesheet" type="text/css" href="../css/common.css">
	// </head>';
	// echo "<table class='single'>";
	$u = [];
	//not in playlist added manually
	$u[] = 'GqB6465D5iU';
	$f = 1;
	foreach ($m[1] as $e) {
		if (str_contains($e, "index=$f")) {
			$i = strpos($e, '\\');
			if ($i === false) {
				die("line" . __LINE__);
			}
			$e = substr($e, 0, $i);
			$u[] = $e;
			// echo "<tr><td>$e";
			$f++;
		}
	}
	// echo "</table>";
	// echo "rows=".count($u);
	// exit;
}

echo '<html><head>
<link rel="stylesheet" type="text/css" href="../css/common.css">
</head>';
echo "rows=" . count($u);
// echo ceil(100);
// exit;
echo "<table class='single'><thead><th>N<th>time<th>views<th>date<th>length";

$s = '';
if (saveNamesToFile) {
	$sn = '';
}
$start = microtime(true);
$skip = $lengthNotFound = 0;
$c = 1;
foreach ($u as $e) {
	// echo "https://www.youtube.com".$e;
	// exit;
	$v = getUrlData("https://www.youtube.com/watch?v=" . $e);
	if (!nameNeeded($v[0])) {
		$skip++;
		continue;
	}
	if (saveNamesToFile) {
		$sn .= $v[0] . "\n";
	}
	$v[0] = proceedName($v[0]);
	if (strlen($s)) {
		$s .= "\n";
	}
	$s .= implode(" ", $v);
	$v[1] = formatString($v[1]);
	if ($v[3] == NOT_FOUND) {
		$lengthNotFound++;
	} else {
		$v[3] = timeToString(ceil($v[3]));////it seems that need to round up youtube length
	}
	echo "<tr><td>$c<td>" . implode('<td>', $v);
	ob_flush();
	flush();
	if ($c == breakIndex) {
		break;
	}
	$c++;
}
if (saveNamesToFile) {
	file_put_contents("names.txt", $sn);
}
$s = str_replace(["&amp;", "&#39;", "&quot;"], ['&', "'", '"'], $s);
if (type == chbd) {
	//removed from youtube added manually
	$s .= "\nГурам Амарян, Демис Карибидис removed 2021-7-16 4386";
}

$time_elapsed_secs = round(microtime(true) - $start, 2);
$date = date('Y-m-d');
$f = "../scripts/" . $filename . "_data1.js";
$s = "gdate='$date';gdata=`$s`";
file_put_contents($f, $s);
echo "</table>totalTime=$time_elapsed_secs second(s) skip=$skip lengthNotFound=$lengthNotFound data stored to $f";

//var_dump(count($m[0]));
function nameNeeded($name)
{
	if (type == dud) {
		return true;
	} elseif (type == chbd) {
		return strpos($name, "ТИЗЕР") === false;
	} elseif (type == foodee) {
		return true;
	} else {
		return true;
	}
}

function proceedName($name)
{
	$c = $name;
	if (type == dud) {
		if ($c == 'Batygin – Russian science celebrity / Батыгин – русская звезда мировой науки - YouTube') {
			$c = 'Батыгин – русская звезда мировой науки';
		} else {
			$c = preg_replace("/\(.*?(subs|subtitles)\)/ui", "", $c);
			$c = preg_replace("/\s+\/\s*(вдудь|большое интервью|Откровенное интервью|Интервью без цензуры|Fасе – a lot has changed)\s*$/ui", "", $c);
			$c = preg_replace("/\/[^а-я]+/ui", "", $c);
		}
	} elseif (type == chbd) {
		$c = preg_replace("/\| ЧТО БЫЛО ДАЛЬШЕ\?(\s*\(.*\))?/ui", "", $c);
		$c = preg_replace("/\s[×хx]\s/ui", ", ", $c);
	}
	return trim($c);
}

//if $raw is true name, views, date(iso format yyyy-mm-dd), length(seconds)
// $nfc=0;
function getUrlData($u, $raw = false)
{
	// global $nfc;
	$MONTH_NAMES = [
		"январь",
		"февраль",
		"март",
		"апрель",
		"май",
		"июнь",
		"июль",
		"август",
		"сентябрь",
		"октябрь",
		"ноябрь",
		"декабрь"
	];
	$s = file_get_contents($u);
	$v = [];
	$begin = [
		"name=\"title\" content=\"",
		"viewCount\":{\"simpleText\":\"",
		"dateText\":{\"simpleText\":\"",
		"\"lengthSeconds\":\""
	];
	foreach ($begin as $c => $e) {
		$i = strpos($s, $e);
		if ($i === false) {
			$q = NOT_FOUND;
			// file_put_contents("o$nfc.txt",$s);
			// file_put_contents("u$nfc.txt",$u);
			// $nfc++;
			// var_dump(strpos($s,"approx"));
			// var_dump($s);
			// die("</table>not found[$e]len=".strlen($s)."url=$u line".__LINE__);
		} else {
			$i += strlen($e);
			$j = strpos($s, '"', $i);
			if ($j === false) {
				die("</table>not found[\"]len=" . strlen($s) . "line" . __LINE__);
			}
			$q = substr($s, $i, $j - $i);
			if (!$raw) {
				if ($c == 1) {
					//8 690 822 просмотра
					$q = preg_replace("/\\D/u", "", $q);
				} elseif ($c == 2) {
					$q = preg_replace("/\s*г\.$/u", "", $q);
					$a = preg_split("/\s+/u", $q);
					//Прямой эфир состоялся 9 февр. 2023 г.
					if (count($a) > 3) {
						$a = array_slice($a, -3);
					}
					$m = $a[1];
					if (str_ends_with($m, '.')) {
						$m = substr($m, 0, -1);
					}
					if ($m == 'мая') {
						$m = 'май';
					}
					foreach ($MONTH_NAMES as $i => $e) {
						if (str_starts_with($e, $m)) {
							$a[1] = $i + 1;
							break;
						}
					}
					$q = implode("-", array_reverse($a));
				}
			}
		}
		$v[] = $q;
	}
	return $v;
}