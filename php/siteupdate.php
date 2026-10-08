<?php
define("SEPARATOR", "\n");

const BUTTONS = ['update remote table', 'show query', 'query to file', 'query to clipboard', 'rows show', 'save pages', 'show pages'];
$jsCode = '';
foreach (BUTTONS as $index => $button) {
	$constantName = strtoupper(str_replace(' ', '_', $button));
	define($constantName, $index);
	$jsCode .= "const {$constantName}={$index};";
}

const BEGIN = ["</table></table>", "</h3></table>", "class=\"presentation\">"];
const EC = "</div></div></body></html>";
const EC1 = "<h[34] id=\"versions\">";
define('HEAD', "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='shortcut icon' href='../favicon/phpmyadmin.ico' />
<meta name='viewport' content='width=device-width, initial-scale=1' />
<link rel='stylesheet' type='text/css' href='../css/common.css'>
<link rel='stylesheet' type='text/css' href='../css/combobox.css'>
<link rel='stylesheet' type='text/css' href='../css/siteupdate.css'>
<link rel='stylesheet' type='text/css' href='../css/table.css'>
<script>$jsCode</script>
<script src='../scripts/common.js'></script>
<script src='../scripts/siteupdate.js'></script>
<script src='../scripts/table.js'></script>");
const HEADE =  "</head><body style='margin-left:7px'><p>";
const HEAD1 = HEAD . HEADE;
const IAL_VIDEOS = 0;
const IAL_LOAD = 1;
const IAL_TITLE = 2;
const IAL_TEST = 3;

const END_VIDEO = ".mp4";

const REMOTE_TYPE_SIMPLE = 0;
const REMOTE_TYPE_ZIP = 1;
const REMOTE_TYPE_ENCODE = 2;

//MONTH_JS from  d.toLocaleString("ru-ru", { day: "numeric", month: "short" }).replace(/\.|\s/g, '')
const	MONTH_JS = ['янв', 'февр', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек'];

const DIFFERENCE = [
	'tables' => 'videos pages money_slovesno money_goods_slovesno calorie_slovesno',
	"directories" => "php scripts css articles",
	"files" => "../index.php ../config.php ../logpass.php"
];
const DIFFERENCE_FILE_NAME = 'remote.txt';
const DIFFERENCE_UP = "../" . DIFFERENCE_FILE_NAME;

const DUMP = 'dump';

$HISTORY_DATETIME = "'2000-01-01 00:00:00.000'";
const CAT = ['calorie', 'money_goods', 'money_addons', 'money', 'money_categories'];
const NOMASS = 0;
const ETB = '2025-01-21';
const START_MASS = 70;
const CALORIE_DAYS = 4;
const SLQ = ['save', 'load', 'query', 'query paste'];

include("calorieCommon.php");
connect();
$qs = prepareQueryString();

//after include("calorieCommon.php")
$EXERCISE = (IS_LOCAL ? '../..' : '..') . '/exercise.txt';
const EXERCISE_TEMPLATES = 3;

//local+remote
if ($qs == 'script_css_count') {
	$result = $mysqli->query("select script,css,name,language from pages") or die('error line' . __LINE__ . $mysqli->error);
	$a = [[], []];
	while ($r = $result->fetch_row()) {
		for ($i = 0; $i < 2; $i++) {
			if (strlen($r[$i]) == 0 && !is_null($r[$i])) {
				die(' error line' . __LINE__);
			}
			$c = is_null($r[$i]) ? 0 : substr_count($r[$i], ' ') + 1;
			$k = array_key_exists($c, $a[$i]) ? $a[$i][$c][0] : 0;
			$a[$i][$c][0] = $k + 1;
			$a[$i][$c][1] = ($k == 0 ? '' : $a[$i][$c][1] . " &nbsp; &nbsp; ") . "$r[2]<img src='../img/" . substr($r[3], 0, 2) . ".gif'>";
		}
	}
	$s = HEAD1;
	$t = ['script', 'css'];
	for ($i = 0; $i < 2; $i++) {
		$b = $a[$i];
		ksort($b);
		$c = count($b);
		$s .= "<table class='single table_color'><thead><tr><th>$t[$i] count<th>pages<th>name language</thead>";
		$j = -1;
		foreach ($b as $k => $v) {
			$j++;
			$s .= "<tr><td>" . ($k ? $k : 'null') . "<td>$v[0]<td>" . ($j > $c - 3 ? $v[1] : '');
		}
		$s .= "</table>";
	}
	$cmp = function ($a, $b) {
		if ($a[1] == $b[1]) {
			return strcmp($a[0], $b[0]);
		}
		return $a[1] > $b[1] ? -1 : 1;
	};

	$s .= '<table><tr>';
	for ($i = 0; $i < 2; $i++) {
		$s .= '<td valign=top style="padding-right:20px">';
		$f = $i ? 'css' : 'script';
		$a = "";
		//$a=" group by name";
		$result = $mysqli->query("select name,language,$f from pages where $f is not null$a") or die('error on line' . __LINE__ . $mysqli->error);

		// var_dump($result->num_rows);
		$c = [];
		$w = [];
		while ($row = $result->fetch_row()) {
			$a = preg_split('/\s/', $row[2]);
			if (preg_match('/\s{2,}/', $row[2])) {
				$s .= "error more than one space found [" . $row[2] . "]<br>";
			}
			if (preg_match('/\t\r\n\v\f/', $row[2])) {
				$s .= "error bad space separator found [" . $row[2] . "]<br>";
			}

			$l = 0;
			foreach ($a as $e) {
				if (preg_match('/^\s*$/', $e)) {
					$l++;
					$s .= "error " . $row[0] . " " . $row[1] . " [" . $row[2] . "] $l<br>";
				}
				$j = array_key_exists($e, $w) ? $w[$e] : 0;
				$w[$e] = $j + 1;
			}
			$e = count($a);
			$j = array_key_exists($e, $c) ? $c[$e] : 0;
			$c[$e] = $j + 1;
		}


		$s .= "<table class='single table_color'><thead><tr><th>$f<th>count</thead>";
		$b = [];
		foreach ($w as $key => $value) {
			$b[] = [$key, $value];
		}
		//arsort($b);
		usort($b, $cmp);
		foreach ($b as $e) {
			if ($e[1] > 1) {
				$s .= "<tr><td>$e[0]<td>$e[1]";
			}
		}
		$s .= "</table>";
	}
	$s .= "</table>";
	die($s);
}

if ($qs == 'cc') { //char counter
	$result = $mysqli->query("select 1 from pages where name not regexp '^[a-z_\\\\d]+$' limit 1") or die('error line' . __LINE__ . $mysqli->error);
	if ($result->num_rows > 0) {
		die("error invalid name found line" . __LINE__);
	}

	$result = $mysqli->query("select name from pages") or die('error line' . __LINE__ . $mysqli->error);
	$a = [];
	//ordered by ascii keys
	foreach (range('0', '9') as $e) {
		$a[$e] = 0;
	}
	$a['_'] = 0;
	foreach (range('a', 'z') as $e) {
		$a[$e] = 0;
	}

	while ($r = $result->fetch_row()) {
		foreach (str_split($r[0]) as $e) {
			$a[$e]++;
		}
	}
	die(HEAD . '<script>gd=' . json_encode($a) . '</script></head><body style="margin:7px;" onload=load("cc")><p id="p"></p>');
}

if ($qs == 'cookie') {
	$s = HEAD1 . "<table class='single table_color'><thead><tr><th>name<th>value</thead>";
	ksort($_COOKIE);
	foreach ($_COOKIE as $k => $v) {
		if (trim($k) != $k) {
			$k = "'$k'";
		}
		if (trim($v) != $v) {
			$v = "'$v'";
		}
		$s .= "<tr><td>$k<td>$v";
	}
	$res = $mysqli->query("SELECT version()") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $res->fetch_row();
	$s .= "</table><p>php " . phpversion() . "<br>mysql " . $row[0];
	die($s);
}

if ($qs == 'videodatedifference') {
	$r = $mysqli->query("select name,language,title,date from videos order by date desc");
	while ($t = $r->fetch_row()) {
		$a[] = $t;
	}
	$s = "<table class='single table_color'><thead><tr><th>language, name<th>video<th>date<th>dateDiff<th>end</thead>";
	$i = 0;
	foreach ($a as $e) {
		$l = '<img src=../img/' . substr($e[1], 0, 2) . ".gif> ";
		$title = $e[2];
		$eok = str_contains(".?!", substr(strip_tags($title), -1)) ? '' : 'bad end';
		$date = $e[3];
		$d = $i < count($a) - 1 ? round((strtotime($date) - strtotime($a[$i + 1][3])) / (60 * 60 * 24)) : '';
		if (intval($d) > 7) {
			$d .= " ###";
		}
		$s .= "<tr><td>$l$e[0]<td>$title<td>$date<td>$d<td>$eok";
		$i++;
	}
	$s .= "</table>";
	die(HEAD1 . $s);
}

if ($qs == 'pagesreferences') {
	$starttime = microtime(true);
	echo '<html><head><link rel="stylesheet" type="text/css" href="../css/common.css"><link rel="stylesheet" type="text/css" href="../css/table.css"></head><body style="margin:7px;">';
	checkPageRefPages();
	checkPageRefCSSJS();
	//checkPageRefPHP();
	echo "<br>time " . formatNumber(microtime(true) - $starttime, 3);
	exit;
}

if ($qs == 'pagesreferenceslevel') {
	$starttime = microtime(true);
	echo '<html><head><link rel="stylesheet" type="text/css" href="../css/common.css"></head><body style="margin:7px;">';
	pageReferenceLevel();
	echo "<br>time " . formatNumber(microtime(true) - $starttime, 3);
	exit;
}

if ($qs == 'ruenchars') {
	echo '<html><head>
	<link rel="stylesheet" type="text/css" href="../css/common.css"><link rel="stylesheet" type="text/css" href="../css/table.css"></head><body style="margin:7px;">';
	$re = '([a-zA-Z][а-яА-ЯЁё]|[а-яА-ЯЁё][a-zA-Z]).{0,8}';
	echo "search regex $re<br>";
	for ($i = 0; $i < 2; $i++) {
		$s = $i ? 'title' : 'content';
		echo "<b>$s</b><table>";
		$result = $mysqli->query("SELECT name,language,content FROM pages WHERE $s REGEXP '$re'") or die('error on line' . __LINE__ . $mysqli->error);
		while ($row = $result->fetch_row()) {
			preg_match("~$re~u", $row[2], $m) or die("error on line" . __LINE__);
			echo "<tr><td>$row[0]<td>$row[1]<td>" . $m[0] . " " . (preg_match("~^[а-яА-ЯЁё]~u", $m[0]) ? 'ru&rarr;en' : 'en&rarr;ru');
		}
		echo "</table>";
	}

	echo "<table class='table_color'><tr><th>" . implode('<th>', ['N', 'file', 'type', 'substring', 'line']);
	$n = 1;
	foreach (["../scripts", "../css", "."] as $dir) {
		$files = scandir($dir);
		foreach ($files as $f) {
			if ($f == '.' || $f == '..') {
				continue;
			}
			$fp = "$dir/$f";
			if (!is_dir($fp)) {
				echo check_ruen($n, file_get_contents($fp), $f);
			}
		}
	}
	echo "</table>";
	exit;
}

if ($qs == 'crlf') {
	//set rewrite=1 to rewrite js and css files
	$rewrite = 0;
	$line = __LINE__ - 1;
	$cn = 0;
	echo HEAD1 . "crlf to lf<table><tr>";
	$i = -1;
	foreach (['scripts', 'css', 'php'] as $dir) {
		$i++;
		$ex =  $i ? $dir : 'js';
		echo "<td valign='top'>";
		echo "<table class='single'><tr><th>$ex";
		foreach (glob("../$dir/*.$ex") as $f) {
			$s = file_get_contents($f);
			$c = preg_replace("/\r/", "", $s);
			$p = strrpos($f, '/');
			$n = substr($f, $p + 1);
			if ($n == 'Chart.bundle.min.js') {
				continue;
			}
			if (strlen($s) != strlen($c)) {
				echo "<tr><td>$n";
				$cn++;
				if ($rewrite) {
					file_put_contents($f, $c);
				}
			}
		}
		echo "</table>";
	}
	echo "</table>";
	if ($cn == 0) {
		echo "all files are lf only";
	} else {
		if ($rewrite) {
			echo $cn == 0 ? "all files are lf only" : "all files are overwritten counter $cn";
		} else {
			echo "to overwrite files please set up \$rewrite=1 at siteupdate.php:$line";
		}
	}
	exit;
}

if (isset($_POST['videostring'])) {
	die(tag2text(videoString($_POST['videostring'], TYPE_NORMAL, 'russian')));
}

if ($qs == 'phpinfo') {
	/* ob_start();
phpinfo();
$s = ob_get_contents();
ob_get_clean();
echo $s;*/
	//on remote ok
	phpinfo();
	die();
}

if ($qs == 'parameters') {
	$s = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<link rel="stylesheet" type="text/css" href="../css/table.css">
	</head><body>';
	$c = file_get_contents('siteupdate.php');
	//https://stackoverflow.com/questions/5358010/regex-failing-when-pattern-involves-dollar-sign
	$b = ["/\\\$_POST\s*\[['\"](.+?)['\"]\]/", "/\\\$qs\s*==\s*['\"](.+?)['\"]/"];
	for ($i = 0; $i < 2; $i++) {
		preg_match_all($b[$i], $c, $m);
		$a = array_unique($m[1]);
		asort($a);
		$v = ($i ? 'query_string' : '$_POST') . " &nbsp; values=" . count($a);
		$s .= "<p>$v<table class='table_common table_border table_color'>";
		$j = -1;
		foreach ($a as $e) {
			$j++;
			if (!($j % 5)) {
				$s .= "<tr>";
			}
			$s .= "<td>$e";
		}
		$s .= "</table>";
	}
	die($s);
}

if ($qs == 'exchange') {
	$r = $mysqli->query("SELECT id,content FROM exchange order by id desc") or die('error on line' . __LINE__ . $mysqli->error);
	$q = [];
	while ($t = $r->fetch_row()) {
		$q[] = [$t[0], $t[1]];
	}
	$a = json_encode($q, JSON_UNESCAPED_UNICODE);
	$m = isMobile();
	die(HEAD . "<script>gData=$a;gMobile=$m</script><body onload='load(\"exchange\")' style='margin:3px;'><textarea id='multi_query' rows='15' cols='70' placeholder='введите текст'></textarea><br><span id='buttons'></span><span id='s'></span><table id='t'></table></body>");
}

if (isset($_POST['recipe'])) {
	die(recipe($_POST));
}

if (isset($_POST['exchangeSave']) || isset($_POST['exchangeAddNewDay']) || $qs == 'exchangeAddNewDay') {
	$save = isset($_POST['exchangeSave']);
	if ($save) {
		$q = trim(mb_strtolower($_POST['exchangeSave']));
	} else {
		$q = '';
	}
	$h = date('H');
	$n = $h < 11 ? 0 : ($h < 15 ? 1 : 2);
	$s = file_get_contents('../scripts/poverty.js');
	$me = ['завтрак', 'обед', 'ужин'];
	$w = $me[$n]; //also uses in die at the end
	$meal = "&$w";
	$pmeal = strrpos($s, $meal);
	if ($pmeal === false) {
		die("не найдено $pmeal");
	}

	$date = new DateTime();
	$a = [];
	for ($i = 0; $i < 2; $i++) {
		$a[] = dates($date);
		$date->modify('-1 days');
	}
	[$day, $yesterday] = $a;

	$day = '#' . $day;
	$pday = strrpos($s, $day);
	$dayinserted = false;
	$tomorrow = false;
	if ($pday === false || !$save) {
		if ($pday !== false && !$save) {
			//insert tomorrow
			$yesterday = substr($day, 1);
			$date = new DateTime();
			$date->modify('+1 days');
			$day = dates($date);
			if (preg_match("/`#$day\s*масса\s*(\d+\.?\d*)/", $s)) {
				die("дата $day уже есть строка" . __LINE__);
			}
			$day = '#' . $day;
			$tomorrow = true;
		}
		$mass = '64.';
		if (!$save && preg_match("/`#$yesterday\s*масса\s*(\d+\.?\d*)/", $s, $m)) {
			$mass = $m[1];
		}
		$q = "\n\n,`$day масса $mass" . implode('', array_map(fn($e, $i) => "\n"
			. ($i == $n ? $q . ($save ? "\n" : '') : '')
			. "&$e", $me, array_keys($me))) . "`";
		$pmeal = strrpos($s, "`");
		if ($pmeal === false) {
			die('символ ` не найден строка' . __LINE__);
		}
		$dayinserted = true;
		$pmeal++;
	} else {
		$q = "$q\n";
		$i = $pmeal - $pday;
		$md = 1500;
		if ($i <= 0 || $i > $md) {
			die("разница индексов=$i &le;0 или &gt;$md");
		}
	}
	$s = substr($s, 0, $pmeal) . $q . substr($s, $pmeal);
	file_put_contents('../scripts/poverty.js', $s);
	die("вставлено" . ($dayinserted ? " $day" : '') . " " . ($save ? $w : "масса $mass" . ($tomorrow ? ' завтра' : '')));
}

if (isset($_POST['exchangeDelete'])) {
	$w = $_POST['exchangeDelete'] == 'all' ? '' : ' where id=' . $mysqli->real_escape_string($_POST['exchangeDelete']);
	$query = "delete from exchange$w";
	$mysqli->query($query) or die('error on line' . __LINE__ . $mysqli->error . $query);
	die("affected rows " . $mysqli->affected_rows);
}

if (isset($_POST['exchangeAdd'])) {
	$r = $mysqli->query("SELECT id,content FROM exchange order by id desc limit 1") or die('error on line' . __LINE__ . $mysqli->error);
	$u = false;
	$sp = $_POST['exchangeAdd'];
	$s = $mysqli->real_escape_string($sp);
	if ($r->num_rows) {
		$t = $r->fetch_row();
		$id = $t[0];
		$sd = $t[1];
		$ap = preg_split("/\n/", $sp); //post
		$ad = preg_split("/\n/", $sd);
		$l = count($ad);
		if (count($ap) >= $l) {
			for ($i = 0; $i < $l; $i++) {
				if (!str_starts_with($ap[$i], $ad[$i])) {
					break;
				}
			}
			if ($i == $l) {
				$u = true;
			}
		}
	}
	if ($u) {
		$r = $mysqli->query("update exchange set content='$s' where id=$id") or die('error on line' . __LINE__ . $mysqli->error . $query);
	} else {
		foreach (["insert into `exchange` (content) values('$s')", "SELECT LAST_INSERT_ID()"] as $query) {
			$r = $mysqli->query($query) or die('error on line' . __LINE__ . $mysqli->error . $query);
		}
		$row = $r->fetch_row();
		$id = $row[0];
	}
	die(json_encode([intval($id), $u]));
}

if ($qs == 'unvisitedpages') {
	echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<link rel="stylesheet" type="text/css" href="../css/common.css">
	<link rel="stylesheet" type="text/css" href="../css/table.css">
	<title></title></head><body style="margin:7px;"><h3>Unvisited pages</h3><table class="single table_color"><thead><tr><th>name<th>language</thead>';
	$r = $mysqli->query("SELECT name,language FROM pages WHERE NOT EXISTS (SELECT 1 FROM counters WHERE counters.name = pages.name and counters.language=pages.language limit 1)") or die('error on line' . __LINE__ . $mysqli->error);
	while ($t = $r->fetch_row()) {
		echo "<tr><td>$t[0]<td>$t[1]";
	}
	echo "</table>";
	exit;
}

if (isset($_POST["sqlfiledata"])) {
	$s = $_POST["sqlfiledata"];
	$number = 1;
	if ($_POST['remote'] === 'true') {
		die(remoteQuery($s, REMOTE_TYPE_ENCODE, $number));
	} else {
		die(multiQuery(unencodeQuery($s), $number));
	}
	exit;
}

const pfcn = ['белки', 'жиры', 'углеводы', 'номер артикула'];
if ($qs == 'globus_protein') {
	include("jmCommon.php");

	$ADDONS = readAddons(JM_SUPERUSER);
	$eggMass = explode(" ", $ADDONS['egg_purified_mass_grams_by_category']);

	$pfcs = implode("|", pfcn);

	$o = [];
	foreach (glob("c:/downloads/prices/*") as $f) {
		$d = file_get_contents($f);
		$fn = pathinfo($f, PATHINFO_FILENAME);
		$name = preg_replace("~\s*_ Сеть гипермаркетов «Глобус»\s*~", "", pathinfo($f, PATHINFO_FILENAME));
		if (preg_match("~(\d+)\s*(к?г|м?л)\b~ui", $name, $m)) {
			$mass = (float)($m[1]);
			if (in_array(mb_strtolower($m[2]), ["кг", "л"])) {
				$mass *= 1000;
			}
		} elseif (preg_match("~С(\d+|В)\b~ui", $name, $m) && preg_match("~(\d+)\s*шт\b~ui", $name, $q)) {
			$mass = $eggMass[$m[1] == 'В' ? 0 : $m[1] + 1] * $q[1];
		} else {
			$mass = 0;
		}

		preg_match_all('~<span>(.+)</span>\s*</div>\s*<div class="catalog-detail-table__position-content">\s*<span>(.+)</span>~', $d, $m);
		$a = array_fill(0, count(pfcn), 0); //sometimes not set
		for ($i = 0; $i < count($m[1]); $i++) {
			$n = trim($m[1][$i]);
			if (preg_match("~^($pfcs)~ui", $n, $q)) {
				$j = array_search(mb_strtolower($q[0]), pfcn);
				$a[$j] = (float)(str_replace(',', '.', $m[2][$i]));
			}
		}
		ksort($a);
		preg_match('~<span class="catalog-detail__item-price-actual-main">(.+?)</span>\s*<span class="catalog-detail__item-price-actual-sub">(.+?)</span>~s', $d, $m);
		$price = (float)(trim($m[1]) . "." . trim($m[2]));
		$o[] = [$name, ...$a, $mass, $price];
		//break;
	}
	die(json_encode($o, JSON_UNESCAPED_UNICODE));
}

if ($qs == 'strangejscss') {
	foreach (['css', 'script'] as $e) {
		$i = implode('<th>', ['', 'name', 'language', $e, 'other references']);
		echo HEAD1 . "$e<table class='table_border table_color'><thead><tr><th>$i</thead>";
		$result = $mysqli->query("select name,language,$e from pages where $e regexp '^\\\\w+$' && $e not in('table','dialog','calendar','bridge')") or die('error line' . __LINE__ . $mysqli->error);
		$i = 0;
		while ($r = $result->fetch_row()) {
			$v = $r[2];
			$result1 = $mysqli->query("select 1 from pages where name='$v' and $e like '%=%' limit 1") or die('error line' . __LINE__ . $mysqli->error);
			if ($result1->num_rows) {
				continue;
			}
			$i++;
			echo "<tr><td>$i<td>" . implode('<td>', $r);
			$result1 = $mysqli->query("select name,language,$e from pages where $e regexp '\\\\b$v\\\\b' and name!='$r[0]' ") or die('error line' . __LINE__ . $mysqli->error);
			$s = '';
			while ($r1 = $result1->fetch_row()) {
				$v = substr($r1[1], 0, 2);
				$r1[1] = "<img src='../img/$v.gif'>";
				$s .= implode("", $r1) . " ";
			}
			echo "<td>$s";
		}

		echo "</table>";
	}
	exit;
}

if ($qs == 'massgraph') {
	$s = getCalorieJsCss(1);
	$es = getExerciseData()[0];
	$q = '';
	for ($i = 0; $i < 2; $i++)
		$q .= "<div id='g$i'></div>";
	die("<!DOCTYPE html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='shortcut icon' href='../favicon/graph.ico' />
<title>график массы</title>
<meta name='viewport' content='width=device-width, initial-scale=1' />
$s<script>$es</script>
</head><body style='margin-left:6px;background: #e8e4e5;' onload=load('$qs')>$q
</body></html>");
}

if (isset($_POST['calorie_history'])) {
	//not need dieOnBadLogin();
	getLogin(); //to setup $calorieTable
	$d = $_POST['calorie_history'];
	$r = $mysqli->query("SELECT mass,text,datetime FROM $calorieTable where date='$d' and datetime!=$HISTORY_DATETIME order by datetime") or die('error line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($t = $r->fetch_row()) {
		$a[] = $t;
	}
	$da = json_encode($a, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
	die($da);
}

if (isset($_POST['calorie_text']) && isset($_POST['mass']) && isset($_POST['date'])) {
	dieOnBadLogin();
	$t = $mysqli->real_escape_string($_POST['calorie_text']);
	$m = $mysqli->real_escape_string($_POST['mass']);
	$d = $_POST['date'];
	$r = $mysqli->query("select mass,text from $calorieTable where date='$d' and datetime=$HISTORY_DATETIME") or die('error line' . __LINE__ . $mysqli->error);
	$a = $r->fetch_row();
	if ($a[0] == $m) {
		if ($a[1] == $_POST['calorie_text']) {
			die('одинаковые строки и масса');
		}
		if (preg_match("/\s*/", $a[1]) || special_same_db($a[1], $_POST['calorie_text'])) {
			$mysqli->query("UPDATE $calorieTable SET text='$t' WHERE date='$d' and datetime=$HISTORY_DATETIME") or die('error at line' . __LINE__ . $mysqli->error);
			die('ok');
		}
	}
	$mysqli->multi_query("UPDATE $calorieTable SET datetime=NOW(3) WHERE date='$d' and datetime=$HISTORY_DATETIME;
	INSERT INTO $calorieTable VALUES ('$d',$m,'$t',$HISTORY_DATETIME)") or die('error on line' . __LINE__ . $mysqli->error);
	die('ok');
}

if (isset($_POST['calorie_delete_history'])) {
	dieOnBadLogin();
	$w = $_POST['calorie_delete_history'] === 'true' ? '' : 'and date!=(SELECT max(date) FROM calorie_slovesno)';
	$query = "DELETE FROM $calorieTable WHERE datetime!=$HISTORY_DATETIME $w";
	$mysqli->query($query) or die('error line' . __LINE__ . $mysqli->error);
	die('удалено записей ' . $mysqli->affected_rows);
}

if ($qs == 'calorie_missing_dates') {
	dieOnBadLogin();
	$r = $mysqli->query("select date from $calorieTable where datetime=$HISTORY_DATETIME order by date limit 1") or die('error line' . __LINE__ . $mysqli->error);
	if ($r->num_rows == 0) {
		die('в таблице нет записей');
	}
	$s = $r->fetch_row()[0];
	$today =  date('Y-m-d');
	$i = 0;
	for ($date = new DateTime($s); ($d = $date->format('Y-m-d')) <= $today; $date->modify('+1 day')) {
		$r = $mysqli->query("select 1 from $calorieTable where date='$d' and datetime=$HISTORY_DATETIME limit 1") or die('error line' . __LINE__ . $mysqli->error);
		if ($r->num_rows == 0) {
			$i++;
			$m = START_MASS;
			$mysqli->query("INSERT INTO $calorieTable VALUES ('$d',$m,'',$HISTORY_DATETIME)") or die('error on line' . __LINE__ . $mysqli->error);
		}
	}
	die("добавлено дней $i");
}

if (isset($_POST['calorie_logout'])) {
	unset($_COOKIE[JM_USER_COOKIE]);
	unset($_COOKIE[JM_PWD_COOKIE]);
	setcookie(JM_USER_COOKIE, '', time() - 3600, '/'); // empty value and old timestamp
	setcookie(JM_PWD_COOKIE, '', time() - 3600, '/'); // empty value and old timestamp
	die('Вы вышли из системы, дальнейшая работа будет осуществляться<br>в режиме просмотра данных пользователя ' . JM_SUPERUSER . '.');
}

if (isset($_POST['calorie_delete_user'])) {
	checkPermission('Нет прав на удаление пользователей.');
	$jm_user = $mysqli->real_escape_string($_POST['user']);
	if ($jm_user == JM_SUPERUSER)
		die('Этого пользователя нельзя удалить.');
	if (!isUserExists($jm_user))
		die('Пользователь с таким логином не найден.');

	$s = implode(',', array_map(fn($e) => "`{$e}_$jm_user`", CAT));
	$mysqli->multi_query("DROP TABLE IF EXISTS $s;DELETE FROM users WHERE user='$jm_user'") or die('error line' . __LINE__ . $mysqli->error);
	die('Пользователь успешно удалён.');
}

if (isset($_POST['calorie_delete_all_users'])) {
	checkPermission('Нет прав на удаление пользователей.');
	$r = $mysqli->query("SELECT user FROM users where user<>'" . JM_SUPERUSER . "'") or die('error on line' . __LINE__ . $mysqli->error);
	$s = '';
	while ($t = $r->fetch_row()) {
		if ($s != '') {
			$s .= ',';
		}
		$s .= implode(',', array_map(fn($e) => "`{$e}_$t[0]`", CAT));
	}
	$mysqli->multi_query("DROP TABLE IF EXISTS $s;DELETE FROM users WHERE user<>'" . JM_SUPERUSER . "'") or die('error line' . __LINE__ . $mysqli->error);
	$i = $r->num_rows;
	die("Удалено пользователей $i.");
}

if (isset($_POST['calorie_change_password'])) {
	dieOnBadLogin();
	$jm_user_login = $jm_user; //after dieOnBadLogin();
	$jm_user = $mysqli->real_escape_string($_POST['user']);
	$jm_pwd = $mysqli->real_escape_string($_POST['pwd']);
	//before if ($jm_user == JM_SUPERUSER)
	if ($jm_user_login != JM_SUPERUSER && $jm_user_login != $jm_user)
		die('Нет прав на изменение пароля.');
	if ($jm_user == JM_SUPERUSER)
		die('Для этого пользователя нельзя изменить пароль.');
	$r = $mysqli->query("SELECT password FROM users WHERE user='$jm_user' ") or die('error on line' . __LINE__ . $mysqli->error);
	if ($r->num_rows == 0)
		die('Пользователь с таким логином не найден.');
	$t = $r->fetch_row();
	$m = md5($jm_pwd);
	if ($m == $t[0])
		die('Ошибка, новый и старый пароли совпадают.');
	$mysqli->query("UPDATE users SET password='$m' WHERE user='$jm_user' ") or die('error on line' . __LINE__ . $mysqli->error);
	die('Пароль успешно изменён.');
}

if ($qs == 'calorie_user_list') {
	checkPermission('Нет прав на изменение пароля.');
	$r = $mysqli->query("SELECT user FROM users where user<>'" . JM_SUPERUSER . "'") or die('error on line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($t = $r->fetch_row()) {
		$a[] = $t[0];
	}
	die(empty($a) ? 'Список пользователей пуст.' : implode('<br>', $a));
}

if (isset($_POST['user']) && isset($_POST['pwd'])) {
	$s = $jm_user = $mysqli->real_escape_string($_POST['user']);
	$jm_pwd = $mysqli->real_escape_string($_POST['pwd']);
	if (isset($_POST['calorie_login'])) {
		die(getLoginUP($jm_user, $jm_pwd) ? 'ok' : 'Ошибка неверный логин и/или пароль.');
	} elseif (isset($_POST['calorie_create_user'])) {
		$jm_user = $s; //after getLogin() in checkPermission()
		$r = $mysqli->query("select 1 from users where user='$jm_user' limit 1") or die('error line' . __LINE__ . $mysqli->error);
		if ($r->num_rows == 1) {
			die('Ошибка, пользователь с таким именем уже существует.');
		} else {
			$b = [0, 'WHERE food=1', '', 0, 0];
			$s = js_reduce(CAT, fn($a, $e, $i) => "{$a}CREATE TABLE `{$e}_$jm_user` LIKE {$e}_slovesno;" . ($b[$i] === 0 ? '' :
				"INSERT INTO `{$e}_$jm_user` SELECT * FROM {$e}_slovesno $b[$i];"), '');
			$mail = $mysqli->real_escape_string($_POST['mail']);
			$sql = "INSERT into users (user,password,email,firstlogin) VALUES ('$jm_user', '" . md5($jm_pwd) . "', '$mail', NOW());{$s}update `money_goods_$jm_user` set `has check`=0,name1=NULL,alias=NULL,comment='';";
			//$sql .= "DELETE FROM `money_goods_$jm_user` WHERE name not REGEXP '^а'";
			$mysqli->multi_query($sql) or die('error on line' . __LINE__ . $mysqli->error);
			while ($mysqli->next_result()); //to exclude error on line136Table 's378259_site.money_addons_slove32sno' doesn't exist
			setCookies(); //for autologin
			die('ok'); //for calorieShowMessageS autoreload
		}
	} else {
		die('неизвестная опция' . __LINE__);
	}
}

if (isset($_POST['calorie_search'])) {
	getLogin();
	$o = json_decode($_POST['o']);
	$w = $o[1] ? '' :  "and datetime=$HISTORY_DATETIME";
	$s = $mysqli->real_escape_string($_POST['s']);
	$s = $o[0] ? "regexp '$s'" : "like '%$s%'";
	$r = $mysqli->query("select date,datetime,text from $calorieTable where text $s $w order by date desc,datetime") or die('error line' . __LINE__ . $mysqli->error);
	$p = str_repeat('=', 3);
	$i = -1;
	if ($r->num_rows == 0) {
		echo "ничего не найдено";
	} else {
		echo "$"; //marker of long string
		//var_export($s);
		while ($t = $r->fetch_row()) {
			$i++;
			if ($i)
				echo "\n";
			$v = "'$t[1]'" == $HISTORY_DATETIME ? '' : " изменено " . dateSring(substr($t[1], 0, 10)) . substr($t[1], 10);
			$d = dateSring($t[0]);
			echo "$p $d$v $p\n" . trim($t[2]);
		}
	}
	exit;
}

if (isset($_POST['calorie_export'])) {
	getLogin();
	$text = !$_POST['type'];
	$o = [];
	if ($_POST['0'] || $_POST['1']) {
		if ($_POST['0'] && $_POST['1']) {
			if ($text)
				echo "дневник питания + история";
			$w = '';
		} elseif ($_POST['0'] && !$_POST['1']) {
			if ($text)
				echo "дневник питания";
			$w = "where datetime=$HISTORY_DATETIME";
		} else {
			if ($text)
				echo "история";
			$w = "where datetime!=$HISTORY_DATETIME";
		}

		$r = $mysqli->query("select date,mass,text,datetime from $calorieTable $w order by date,datetime") or die('error line' . __LINE__ . $mysqli->error);
		if ($text) {
			while ($t = $r->fetch_row()) {
				echo "\n\n" . implode("\n", array_map(fn($e) => trim($e), $t));
			}
		} else {
			$o[] = $r->fetch_all();
		}
	}
	if ($_POST['2']) {
		if ($text) {
			if ($_POST['0'] || $_POST['1'])
				echo "\n";
			echo "таблица продуктов";
		}
		$r = $mysqli->query("SELECT * FROM `money_goods_$jm_user` ORDER BY name") or die('error on line' . __LINE__ . $mysqli->error . "SELECT * FROM $t $addons");
		if ($text) {
			$a = [];
			foreach ($r->fetch_fields() as $v)
				$a[] = $v->name;
			echo "\n" . implode(', ', $a);
			while ($row = $r->fetch_row())
				echo "\n" . implode(' ', array_map(fn($e) => is_null($e) ? 'NULL' : $e, $row));
		} else {
			$o[] = $r->fetch_all();
		}
	}
	if (!$text)
		die(json_encode($o, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
	exit;
}

if (preg_match("|^calorie(\d*)$|", $qs, $mat)) {
	$dt = time() * 1000;
	$s1 =  getLogin() && $jm_user == JM_SUPERUSER ? calorieClick(['delete_user', 'calorieDeleteAllUsers()', 'calorieUsersList()'], ['удалить пользователя', 'удалить все логины',  'список пользователей']) : '';
	//for correct language jm.php?goods_viewedit & index.php?goods_statistics
	set_calorie_table();
	setcookie('language', 'russian', time() + 3600 * 24 * 30, '/'); //30 days expire
	$d = date('Y-m-d');
	$r = $mysqli->query("select 1 from $calorieTable where date='$d' and datetime=$HISTORY_DATETIME limit 1") or die('error line' . __LINE__ . $mysqli->error);
	if ($r->num_rows == 0) {
		$r = $mysqli->query("SELECT mass FROM $calorieTable WHERE datetime=$HISTORY_DATETIME order by date desc limit 1") or die('error line' . __LINE__ . $mysqli->error);
		if ($r->num_rows == 0) {
			$m = START_MASS;
		} else {
			$t = $r->fetch_row();
			$m = $t[0];
		}
		//19jul26 not insert new row
		//$mysqli->query("INSERT INTO $calorieTable VALUES ('$d',$m,'',$HISTORY_DATETIME)") or die('error on line' . __LINE__ . $mysqli->error);
	}

	$r = $mysqli->query("select date,mass,text from $calorieTable where datetime=$HISTORY_DATETIME order by date desc") or die('error line' . __LINE__ . $mysqli->error);
	$days = $mat[1] == '' ? CALORIE_DAYS : $mat[1];
	$a = [];
	$as = [];
	while ($t = $r->fetch_row()) {
		$q1 = " " . $t[1] . "\n" . $t[2];
		$a[] = "#" . $t[0] . $q1;
		$b = explode("-", $t[0]);
		$b[1] = mb_substr(MONTH_JS[$b[1] - 1], 0, 3);
		$as[] = "#" . implode('', array_reverse($b)) . $q1;
	}
	$da = json_encode($a, JSON_UNESCAPED_UNICODE);
	$ds = implode("\n", array_slice($as, 0, $days));
	$ds = recipe([
		'columns' => "[1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]",
		'days' => 1,
		'mass' => "fromtitle",
		'p' => $ds,
		'proteinPerKg' => 1.6,
		'show_summary_costs' => 0,
		'subrecipes' => 0
	]);
	$ds = json_encode($ds, JSON_UNESCAPED_UNICODE);

	//$admin = var_export(isJmValidUser(), 1);
	$z = fn($n, $f, $t = '', $id = null) => "<button class='comboboxbutton' onclick=$f" . ($t == '' ? '' : " title='$t'") . ($id === null ? '' : " id='$id'") . ">$n</button> ";
	$f = ['load(`calorie`)', 'calorieColumns()'/*, 'calorieDialog("export")', 'calorieDeleteHistory()', 'calorieMissingDates()'*/];
	$t = ['нажмите W', '', '', '', ''];
	$id = ['lastdays', '', '', '', ''];
	$i = $days % 100;
	$k = 0;
	if ($i < 10 || $i > 20) {
		$j = $i % 10;
		if ($j == 1) {
			$k = 1;
		} elseif ($j > 1 && $j < 5) {
			$k = 2;
		}
	}
	$sq = ['последние ' . $days . ' дней', 'последний ' . $days . ' ' . 'день', 'последние ' . $days . ' ' . 'дня'];
	$cp = js_reduce([$sq[$k], 'колонки'/*, 'экспорт', 'удалить историю', 'добавить отсутствующие дни'*/], fn($a, $e, $i) => $a . $z($e, $f[$i], $t[$i], $id[$i]), '');
	$f = ['calorie_by_day', 'calorie_union', 'calorie_union_group'];
	$t = ['', 'нажмите Q', ''];
	$a = js_reduce(['по дням', 'итог', 'итог группировка'], fn($a, $e, $i) => $a . $z($e, "load(`$f[$i]`)", $t[$i]), '');
	$s = getCalorieJsCss(0);
	$s2 = calorieClick(['create_user', 'login', 'calorieLogout()', 'change_password'], ['регистрация',  'логин', 'логаут', 'изменить пароль']);
	die("<!DOCTYPE html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='shortcut icon' href='../favicon/edible.ico' />
<title>Дневник питания</title>
<meta name='viewport' content='width=device-width, initial-scale=1' />
$s<script>ga=$da;gdays=$days;gds=$ds;</script>
</head><body style='margin-left:6px;background: #e8e4e5;' onload=load('calorie',$dt)>
<table><tr><td>$a
<span id='period'></span> <span id='calendar0'></span> - <span id='calendar1'></span> 
дней <span id='days'></span>
<td rowspan=2 style='vertical-align:top'>
<table style='margin:0'><tr><td style='vertical-align:top'>
<a href='../index.php?goods_statistics,russian' target='_blank'>список продуктов</a>
<br>
<a href='jm.php?goods_viewedit,russian' target='_blank'>редактор продуктов</a>
<br>логин: $jm_user
<br>время <span id='time'></span>
$s2
$s1</table>
<tr><td>
<button onclick='calorieDialog(`search`)' class='comboboxbutton' title='поиск в дневнике или истории,\nможно нажать S'><img src='../img/jm/search16.png'></button>
$cp<span id='options'></span></table>
<p id='p'></p><p id='t'></p>");
}

if (str_starts_with($qs, DUMP)) { //dumpall or dumppages,counters
	$dir = date("Ymd");
	if (!file_exists($dir)) {
		mkdir($dir);
	}
	echo HEAD1 . "<table class='table_border table_color'><thead><tr><th>name<th>size<th>rows<th>status</thead>";
	$s = substr($qs, strlen(DUMP));
	if ($s == 'all') { //dumpall
		$a = [];
		$res = $mysqli->query("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" . DB_NAME . "'") or die('</table>error on line' . __LINE__ . $mysqli->error);
		while ($row = $res->fetch_row()) {
			if (!in_array($n = $row[0], ['counters', 'ip', 'journal_slovesno', 'exchange']))
				$a[] = $n;
		}
	} else
		$a = explode(',', $s);
	$q = 0;
	foreach ($a as $t) {
		for ($i = 0; $i < 2; $i++) {
			$a = dumpTableDataFull($t, "", $i == 0);
			//$a = dumpTableDataFull($t, "where name in('admin','echo_guests','index','other')", $i == 0);
			$s = $a[0];
			$d =  'iu'[$i];
			$n = "$dir/$t$d.sql";
			$b = file_put_contents($n, $s);
			$l = strlen($s);
			$q += $l;
			echo js_reduce([$n, formatString($l, ','), $a[1], $b === false ? 'error' : 'ok'], fn($a, $e) => "$a<td>$e", '<tr>');
		}
	}
	die("</table>" . formatString($q, ','));
}

if ($qs == 'exercise') {
	// showDifferentExercises();
	// exit;
	$o = getExerciseData();
	$es = $o[0];
	$r = $o[1];
	$y = 0; //0-2^(EXERCISE_TEMPLATES-1) initial state
	// $q = '';
	$j = 0;
	$ar = array_fill(0, EXERCISE_TEMPLATES, 0);
	$mn = implode('|', array_map(fn($e) => mb_substr($e, 0, 3), MONTH_JS));
	$n = -1;
	$nonskipr = [];
	$yy = [];
	foreach ($r as $e) {
		$n++;
		$a = explode("\n", $e);
		preg_match("/(\d+(?:$mn)\d+)(?:\s+(.+))?/u", array_shift($a), $m);
		if (array_key_exists(2, $m)) {
			preg_match_all("/\d+/", $m[2], $t);
			$t = $t[0];
			sort($t);
			[$d, $d1] = dt($t[0], $t[count($t) - 1]);
		} else {
			$t = [0];
		}
		$skip = isExerciseSkip($a[0]);
		$p = '';
		if (!$skip) {
			$nonskipr[] = $e;
			if (($ld = $ar[$n % EXERCISE_TEMPLATES]) != 0) {
				$p = round(($d / $ld - 1) * 100, 1) . '%';
			}
			$ar[$n % EXERCISE_TEMPLATES] = $d;
		}
		$s = ($y & (1 << $j)) ? '' : " style='display: none;'";
		$dot = false;
		$i = 0;
		$z = '';
		foreach ($a as $e) {
			if (str_starts_with($e, '..')) {
				$dot = true;
			}
			if (!empty($z)) {
				$z .= "\n";
			}
			if (!$dot && !str_starts_with($e, '.') && !str_contains($e, 'мышца болит') && (preg_match_all("/\d+/", $e) > 1 || str_contains($e, "планка"))) {
				$i++;
				$z .= $i . " ";
			}
			$z .= $e;
		}
		// $q .= "<tr><td>" . implode("<td>", [
		// 	"<img src='../img/jm/down8.png' onclick='toggle(this)'>" . ($skip ? '<s>' : '') . $m[1] . ($skip ? '</s>' : '') . "<div class='c'$s>$z</div>",
		// 	$skip ? '' : $t[0],
		// 	//dt($t[$i]) index $i, because call from array_slice()
		// 	$skip ? '' : js_reduce(array_slice($t, 1), fn($a, $e, $i) => "$a$e<span style='font-size:75%'>+" . dt($t[$i], $e)[1] . "</span>", ''),
		// 	$skip ? '' :  $d1,
		// 	$p
		// ]);
		$yy[] = [$m[1], ...$t, $skip, $z];
		$j = ($j + 1) % EXERCISE_TEMPLATES;
	}
	$z = '';
	$c = count($r);
	$b = 1 << (($c - 1) % EXERCISE_TEMPLATES);
	for ($j = 0; $j < EXERCISE_TEMPLATES; $j++) {
		$b1 = $j == ($c - 1) % EXERCISE_TEMPLATES;
		$z .= " <label class='ex$j'><input type='checkbox' name='c' onclick='exerciseCC()'" . ((($y >> $j) & 1) ? ' checked' : '') . ">"
			. ($b1 ? '<b>' : '') . ($j + 1) . ($b1 ? '</b>' : '') . "</label>";
	}
	$workouts = count($nonskipr);
	$skipc = $c - $workouts;
	$per = formatNumber($skipc / $c * 100, 1);
	$z .= " тренировок сделанных $workouts, пропущенных $skipc $per%, 31мар2025 - начало трёхдневного сплита";

	$templates = EXERCISE_TEMPLATES;
	$y = json_encode($yy, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
	$gs = groupExercise($nonskipr, $mn);
	die("<!DOCTYPE html><html><head><meta http-equiv='Content-Type' content='text/html;charset=utf-8'>
		<link rel='shortcut icon' href='../favicon/dumbbell.png'>
		<link rel='stylesheet' type='text/css' href='../css/common.css'>
		<link rel='stylesheet' type='text/css' href='../css/table.css'>
		<link rel='stylesheet' type='text/css' href='../css/siteupdate.css'>		
		<script src='../scripts/common.js'></script>
		<script src='../scripts/table.js'></script>
		<script src='../scripts/siteupdate.js'></script>
		<script src='../scripts/Chart.bundle.min.js'></script>
		<script>g=$y;templates=$templates;$es</script>
		</head><body style='padding:7px;background:#e8e4e5;' onload='load(`exercise`)'>
		<table><tr><td style='vertical-align: top;'><span id='ts'></span>
		<td style='vertical-align: top;'>$z<div id='g0'></div><div id='g1'></div>$gs
		</table>");
	// <!--<table id='t' class='table_border table_color3' style='margin:0'>$q</table>-->
}

if (IS_LOCAL) {

	//  var_dump($_POST);
	//  exit;
	if (isset($_POST['versioneditor'])) {
		$n = $_POST['versioneditor'];
		$l = $_POST['language'];
		$t = $mysqli->real_escape_string($_POST['text']);
		$query = "UPDATE versions set content='$t' WHERE name='$n' AND language='$l'";
		$mysqli->query($query) or die('error on line' . __LINE__ . $mysqli->error . $query);
		die("affected rows " . $mysqli->affected_rows);
	}

	if ($qs == 'versioneditor') {
		$r = $mysqli->query("SELECT name,language,content FROM versions order by name") or die('error on line' . __LINE__ . $mysqli->error);
		$ln = ['russian' => 0, 'english' => 1];
		$ke = array_keys($ln);
		$a = [];
		while ($t = $r->fetch_row()) {
			$a[$ln[$t[1]]][] = [$t[0], $t[2]];
		}
		// echo "<pre>";
		$d =	date("d n Y");
		$s = '<table>';
		for ($i = 0; $i < 2; $i++) {
			$s .= '<tr>';
			for ($j = 0; $j < 2; $j++) {
				$s .= $i == 0 ? js_reduce($a[$j], fn($a, $e) => "$a<option>$e[0]</option>", "<td><select onchange='versioneditorCombo(this)' id='s$j'>") . "</select> $ke[$j] <button class='comboboxbutton' onclick='versioneditorSave($j)'><img src='../img/jm/save16.png'></button> $d" : "<td><textarea id='t$j' rows='40' cols='80'></textarea>";
			}
			$s .= '<td' . ($i == 1 ? ' id="o"' : '') . '>';
		}
		$d = json_encode($a, JSON_UNESCAPED_UNICODE);
		$s .= '</table>';
		die("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='shortcut icon' href='../favicon/phpmyadmin.ico' />
<meta name='viewport' content='width=device-width, initial-scale=1' />
<link rel='stylesheet' type='text/css' href='../css/common.css'>
<link rel='stylesheet' type='text/css' href='../css/combobox.css'>
<link rel='stylesheet' type='text/css' href='../css/siteupdate.css'>
<script src='../scripts/common.js'></script><script>gd=$d;</script>
<script src='../scripts/siteupdate.js'></script></head><body style='margin-left:7px' onload=load('versioneditor')>$s");
	}

	if (isset($_POST['file_get_contents'])) {
		$s = file_get_contents($_POST['file_get_contents']);
		die($s === false ? "error false" : $s);
	}

	if (isset($_POST['file_put_contents'])) {
		$s = file_put_contents($_POST['file_put_contents'], $_POST['content']);
		die($s === false ? "error false" : strval($s));
	}
	/*
	if ($qs == 'exercise_update_mass') {
		$c = file_get_contents($EXERCISE);
		preg_match("/\n(.*?)\nhttp/", $c, $m, PREG_OFFSET_CAPTURE);
		$s = $m[1][0];
		$p = $m[1][1] + strlen($s);
		$v = preg_split("/\s+/", $s);
		$t = $v[0];
		$v = strtotime($t) or die("invalid time $t");
		$d = date('Y-m-d', $v);
		$r = $mysqli->query("SELECT date,mass FROM calorie_slovesno where date>'$d' and datetime=$HISTORY_DATETIME order by date") or die('error line' . __LINE__ . $mysqli->error);
		$s = "\n";
		while ($q = $r->fetch_row()) {
			$v = strtotime($q[0]) or die("invalid time $t");
			$s .= strtolower(date('jMy', $v)) . " " . $q[1] . "\n";
		}
		$q = substr($c, 0, $p) . $s . substr($c, $p + 1);
		file_put_contents($EXERCISE, $q);
		die('updated days ' . $r->num_rows);
	}
*/
	/* if ($qs == 'exercise_add_date') {
		$d = getdate();
		$s = file_get_contents($EXERCISE);
		$i = strpos($s, "\nhttp") or die('not found line:' . __LINE__);
		$s = substr($s, 0, $i)  . "\n" . $d['mday'] . strtolower(substr($d['month'], 0, 3)) . ($d['year'] % 100) . " 7" . substr($s, $i);
		file_put_contents($EXERCISE, $s);
		die('added');
	}
 */
	if ($qs == 'exercise_workout') {
		$s = trim(file_get_contents($EXERCISE));
		$a = preg_split("/\n{2,}/", $s);
		$c = count($a);
		if ($c < 2) {
			die('not enough data line:' . __LINE__);
		}
		$d = getdate();
		/*if ($d["hours"] > 12) {
			die('too late line:' . __LINE__);
		}*/
		/*if (!in_array($d["wday"], [1, 3, 5])) {
			die('invalid week day line:' . __LINE__);
		}*/
		$sd = $d["mday"] . mb_substr(MONTH_JS[$d['mon'] - 1], 0, 3) . $d["year"];
		$t = sprintf("%d%02d", $d["hours"], $d["minutes"]);
		$b = str_starts_with($a[$c - 1], $sd);
		$add = '';
		if ($b) {
			$s = implode("\n\n", array_slice($a, 0, $c - 1));
			$a = preg_split("/\n/", $a[$c - 1]);
			preg_match_all("/(?<=\s)\d{3,4}/", $a[0], $m);
			foreach ($m[0] as $e) {
				[$a1, $a2] = dt($e, $t);
				$add .= " +$a2";
			}
			$a[0] .= (str_ends_with($a[0], ' ') ? '' : ' ') . $t;
		} else {
			$a = preg_split("/^\.{2}\s*\n/m", $a[$c - EXERCISE_TEMPLATES])[0];
			$a = preg_split("/\n\s*\.{2,}\s*\n*/", $a)[0];
			$a = preg_split("/\n/", $a);
			$a[0] = $sd . " " . $t;
			if (isExerciseSkip($a[1])) {
				array_splice($a, 1, 1);
			}
		}
		$q = implode("\n", $a);
		file_put_contents($EXERCISE, $s . "\n\n" . $q);
		die(($b ? 'finish time added' : 'new date added') . " $t$add");
	}

	if ($qs == 'videoseditor') {
		$r = $mysqli->query("SELECT section,language FROM videos GROUP BY section");
		$a = [];
		while ($t = $r->fetch_row()) {
			$a[] = $t[0]; //.$t[1];
		}
		$s = json_encode($a, JSON_UNESCAPED_UNICODE);

		die(str_replace('favicon/phpmyadmin.ico', 'img/video16.png', HEAD) . "<script>gSection=$s</script><body onload='load(\"videos\")' style='margin:3px;'><p id='p'></p><p id='o'></p></body>");
	}

	//videoeditor
	if (isset($_POST['videobutton'])) {
		$button = $_POST['videobutton'];
		$name = $_POST['name'];
		if (str_ends_with($name, END_VIDEO)) {
			$_POST['name'] = $name = substr($name, 0, -strlen(END_VIDEO));
		}
		$lng = $_POST['language'];

		if ($button == IAL_VIDEOS) {
			$file = "../video/$name.mp4";
			if (!file_exists($file)) {
				die("file $file doesn't exists line: " . __LINE__);
			}
			$_POST['size'] = filesize($file) / 1024 / 1024;
			foreach ($_POST as $k => $v) {
				if (in_array($k, ['videobutton', 'withremote', 'pages', 'i'])) {
					continue;
				}
				$s = is_null($v) ? 'NULL' : wrap($mysqli->real_escape_string($v));
				$va[] = $s;
				if ($k != 'name') {
					$u[] = "$k=$s";
				}
			}
			$query = 'INSERT INTO videos VALUES(' . implode(',', $va) . ') ON DUPLICATE KEY UPDATE ' . implode(',', $u);
			$mysqli->query($query) or die('error on line' . __LINE__ . $mysqli->error . $query);
			$s = "affected rows " . $mysqli->affected_rows . "<br>";
			if ($_POST['withremote'] === 'true') {
				$s .= remoteQuery($query, REMOTE_TYPE_ZIP);
			}
			$s .= setVideoUnadmin($lng, $name);
			die($s);
		} elseif ($button == IAL_LOAD) {
			$r = $mysqli->query("select * from videos where name='$name' and language='$lng'");
			if ($r->num_rows == 0) {
				$r = $mysqli->query("select * from videos where name regexp '$name' and language='$lng'");
			}
			if ($r->num_rows == 1) { //$r->num_rows==1 check regexp gives only one page
				$o = $r->fetch_assoc();
				$r = $mysqli->query("select name from pages where video='$name' and language='$lng'");
				$a = [];
				while ($t = $r->fetch_row()) {
					$a[] = $t[0];
				}
				$o['pages'] = implode(' ', $a);
				die(json_encode($o, JSON_UNESCAPED_UNICODE));
			} else {
				if ($r->num_rows > 1) {
					$s = implode(' ', array_map(fn($e) => $e[0], $r->fetch_all()));
				}
				die("error $name,$lng " . ($r->num_rows ? "regex more than one page [$s] (" . $r->num_rows . ")" : "not") . " found line:" . __LINE__);
			}
		} elseif ($button == IAL_TITLE) {
			$r = $mysqli->query("select title from pages where name='$name' and language='$lng'");
			if ($r->num_rows) {
				$o = $r->fetch_assoc();
				die(json_encode($o, JSON_UNESCAPED_UNICODE));
			} else {
				die("error $name,$lng not found in pages " . __LINE__);
			}
		}
	}

	if ($qs == 'difference' || $qs == 'imagedifference' || isset($_POST['difference'])) {
		if ($qs == 'imagedifference') {
			$i = 'imagedifference';
			$dir = "../img";
			$s1 = substr($dir, 3);
			$files = scandir($dir);
			foreach ($files as $f) {
				if ($f == '.' || $f == '..') {
					continue;
				}
				$fp = "$dir/$f";
				if (is_dir($fp)) {
					$s1 .= " " . substr($fp, 3);
				}
			}
			$a = ['tables' => '', "directories" => $s1, "files" => ''];
		} else {
			$i = 'difference';
			if ($qs == 'difference') {
				$a = DIFFERENCE;
			} else {
				$s = $_POST['difference'];
				$a = json_decode($s, true);
			}
		}
		// $a = json_decode($s, true);
		$a['type'] = REMOTE_TYPE_ZIP;

		$sd = getDirsCodes($a['directories'], $a['files']);
		$st = getTablesCodes($a['tables']);

		// $sr = remoteCall($a);
		// $sr = gzinflate($sr);

		$ok = 1;
		winscp("get " . DIFFERENCE_FILE_NAME . " " . DIFFERENCE_FILE_NAME);
		if (file_exists(DIFFERENCE_UP)) {
			$z = file_get_contents(DIFFERENCE_UP);
			$sr = gzinflate($z);
			if ($sr[0] != '{') {
				$ok = 0;
			}
		} else {
			$ok = 0;
		}
		if (!$ok)
			die(HEAD1 . "click save on remote to get valid data or  <a href='" . REMOTE . "/php/siteupdate.php?saveremote' target='_blank'><img style='vertical-align:middle;' src='/img/jm/save16.png'></a> <button class='comboboxbutton' onclick='location.reload()'>⟲</button>");

		$l = json_encode([strlen($z), strlen($sr)]);
		die(HEAD . "<title>difference</title><script>ga=[$sd,$st,$sr];gsize=$l;</script>
		</head>
		<body onload='load(\"$i\")' style='margin-left:6px;'>
		<p id='up'></p><p id='pt'></p></body></html>");
	}

	if (isset($_POST['query'])) {
		$remote = $_POST['remote'] === 'true';
		$number = $_POST['number'] === 'true';
		$type = isset($_POST['type']) ? intval($_POST['type']) : REMOTE_TYPE_SIMPLE;
		$q = $_POST['query'];
		if ($remote) {
			die(remoteQuery($q, $type, $number));
		} else {
			if ($type == REMOTE_TYPE_ENCODE) {
				$q = unencodeQuery($q);
			}
			die(multiQuery($q, $number));
		}
	}

	if (isset($_FILES["file"])) {
		$r = [];
		$q = [];
		foreach ($_FILES["file"]['tmp_name'] as $path) {
			if (strlen($path) == 0) {
				die('error at line' . __LINE__ . ' file is not set');
			}
			$e = updatePage($path);
			$r[] = $e;
			if ($e[2]) {
				$q[] = "name='$e[0]' AND language='$e[1]'";
			}
		}
		if ($_POST['withremote'] === 'true') {
			$query = dumpTableData('pages', "WHERE " . implode(" OR ", $q));
			$r[] = remoteQuery($query, REMOTE_TYPE_ZIP);
		} else {
			$r[] = ""; //no addititonal text
		}
		//implode(" OR ",$q);
		die(json_encode($r));
	}

	if (isset($_POST['money'])) {
		$query = dumpTableData('money_slovesno', "WHERE id>" . $_POST['money']);
		if ($_POST['option']) {
			die($query);
		}
		die(remoteQuery($query));
	}

	if (isset($_POST['updatetables'])) {
		$t = $_POST['updatetables'];
		$f = $_POST['updatefiles'];
		$s = '';
		if ($t) {
			$query = '';
			foreach (json_decode($t) as $k => $v) {
				$a = dumpTableDataFull($k, "WHERE " . $v, false);
				$query .= " " . $a[0];
			}
			$z = gzdeflate($query, 9);
			file_put_contents(DIFFERENCE_UP, $z);
			winscp("put " . DIFFERENCE_FILE_NAME . " " . DIFFERENCE_FILE_NAME);
			$s .= "click load button on remote to finish or <a href='" . REMOTE . "/php/siteupdate.php?loadremote' target='_blank'><img style='vertical-align:middle;' src='/img/jm/refresh16.png'></a>";
			// $s .= remoteQuery($query, REMOTE_TYPE_ZIP);
			if ($f) {
				$s .= "\n";
			}
		}
		if ($f) {
			$a = [];
			// https://winscp.net/eng/docs/scripting#comments
			// note local 'php/test.php' not working use 'php\test.php'
			// note remote 'php\test.php' not working use 'php/test.php'
			// also support images forder difference
			foreach (json_decode($f) as $k => $v) {
				foreach ($v as $e) {
					if ($k == 'files') {
						$p = substr($e, 3);
					} else {
						$p = "$k/$e";
					}
					//use quotes twice for ""file"" name because it can has space in name
					$a[] = "put " . wrap(str_replace("/", "\\", $p), '""') . ' ' . wrap($p, '""');
				}
			}
			winscp($a);
			$s .= "update files finished"; //returrncode=$retval";
		}
		die($s);
	}

	if (isset($_POST['where'])) {
		$t = $_POST['table'];
		$w = $_POST['where'];
		$show = $_POST['show'];
		$empty = $w == '';
		$a = dumpTableDataFull($t, $empty ? '' : "WHERE $w", $empty);
		$query = $a[0];
		if ($empty) {
			$query = "SET FOREIGN_KEY_CHECKS=0;DELETE from $t;$query SET FOREIGN_KEY_CHECKS=1;";
		}
		$rows = $a[1];
		if ($show) {
			die("rows=$rows\n$query");
		} else {
			die(remoteQuery($query));
		}
	}

	if (isset($_POST['pages'])) {
		if (in_array($_POST['option'], [SAVE_PAGES, SHOW_PAGES])) {
			$show = $_POST['option'] == SHOW_PAGES;
			$a = preg_split("/\s+/", $_POST['pages'], -1, PREG_SPLIT_NO_EMPTY);
			foreach ($a as $e) {
				$b = preg_split("/,/", $e);
				if (count($b) > 2) {
					echo "error $e too many ',' line" . __LINE__ . "<br>";
					continue;
				}
				if (count($b) == 2) {
					$l = getLanguage($b[1]);
					if (!$l) {
						echo "error $e invalid language line" . __LINE__ . "<br>";
						continue;
					}
				}

				$name = $b[0];
				$q = count($b) == 2 ? " AND language='$l'" : '';
				$language = count($b) == 2 ? $l : 'russian';
				$result = $mysqli->query("SELECT name,language FROM pages WHERE name='$name'$q") or die('error line' . __LINE__ . $mysqli->error);
				if ($result->num_rows > 0) {
					$r = ['count' => $result->num_rows, 'name' => $name, 'language' => $language];
				} else {
					$r = getSimilarPages($name, $language, false);
				}
				if (array_key_exists('name', $r)) {
					//valid
					$n = $r['name'];
					if (count($b) == 2) {
						if ($l != $r['language']) {
							echo "error $e found only in another language" . __LINE__ . "<br>";
							continue;
						}
						$la =  [$l];
					} else {
						$la = $r['count'] == 1 ? [$r['language']] : ["russian", "english"];
					}
					$v = [];
					foreach ($la as $l) {
						$c = "$n,$l";
						$v[] = $show ?  $c : storeToFile($c);
					}
					echo implode(' ', $v);
				} elseif (array_key_exists('s', $r)) {
					echo "error two may pages found $e count" . $r['count']  . $r['s'];
				} else {
					echo "not found";
				}
				echo "<br>";
			}
			exit;
		}
		if ($_POST['regex'] === 'true') {
			$b = 'name REGEXP "' . $_POST['pages'] . '"';
		} else {
			$aa = preg_split('/\s+/', $_POST['pages']);
			$b = '';
			foreach ($aa as $e) {
				$a = explode(',', $e);
				$c = count($a);
				if ($c != 1 && $c != 2) {
					die("explode error $e $c");
				}
				if (strlen($b) != 0) {
					$b .= " OR ";
				}
				$b .= "name=" . wrap($a[0]);
				if ($c == 2) {
					$n = $a[1];
					$l = getLanguage($n);
					if (!$l) {
						die("unknown language [$n] line" . __LINE__);
					}
					$b .= " AND language=" . wrap($l);
				}
			}
		}
		$b = "WHERE $b";
		$table = $_POST['table'];
		if ($_POST['option'] == ROWS_SHOW) {
			die(showPages($table, $b));
		}

		$query = dumpTableData($table, $b);
		//$compressed = gzdeflate($query, 9);
		if ($_POST['option'] == UPDATE_REMOTE_TABLE) {
			die(remoteQuery($query, REMOTE_TYPE_ZIP));
		} else {
			die($query);
		}
	}
	defaultBody();
} else { //remote
	date_default_timezone_set('Europe/Moscow');
	$date = new DateTime();
	$ds = $date->format(' H:i:s');
	if (empty($qs)) {
		if (!isJmValidUser())
			die('admin page');
		defaultBody();
	}
	$r = 'remote';
	$l = strlen($r);
	$i = array_search(substr($qs, 0, -$l), SLQ);
	if (substr($qs, -$l) == $r && $i !== false) {
		if (!isJmValidUser())
			die('admin page');
		if ($i == 0) {
			$a = array_values(DIFFERENCE);
			$sd = getDirsCodes($a[1], $a[2]);
			$st = getTablesCodes($a[0]);
			$r = "$sd,$st";
			$z = gzdeflate($r, 9);
			file_put_contents(DIFFERENCE_UP, $z);
			die("stored " . formatString(strlen($z), ',') . $ds);
			// die("stored " . formatString(strlen($r), ',') . ' zipped ' . formatString(strlen($z), ',') . $ds);
		} else {
			$s = $i == 1 ? gzinflate(file_get_contents(DIFFERENCE_UP)) : $_POST['query'];
			die(multiQuery($s) . $ds);
		}
	}

	if ($qs == 'money_state') {
		$r = moneyState();
		die($r[0] . " " . $r[1]);
	}

	if (isset($_POST['query'])) {
		if (!validLoginPassword()) {
			die('error on line' . __LINE__);
		}

		$query = $_POST['query'];
		$number = $_POST['number'];
		$type = $_POST['type'];
		if ($type == REMOTE_TYPE_ENCODE) {
			$query = unencodeQuery($query);
		} elseif ($type == REMOTE_TYPE_ZIP) {
			$query = gzinflate($query);
		}
		die(multiQuery($query, $number));
	}

	$t = isset($_POST['tables']);
	$d = isset($_POST['directories']);
	$f = isset($_POST['files']);
	if ($t || $d || $f) {
		if (!validLoginPassword()) {
			die('error on line' . __LINE__);
		}
		$sd = $d ? getDirsCodes($_POST['directories'], $_POST['files']) : 'null';
		$st = $t ? getTablesCodes($_POST['tables']) : 'null';
		$r = "$sd,$st";
		if ($_POST['type'] == REMOTE_TYPE_ZIP) {
			$r = gzdeflate($r, 9);
		}
		die($r);
	}

	// var_dump($qs);
	// var_dump($_POST);
	die('error this page working only on localhost line' . __LINE__);
}

function moneyState() {
	global $mysqli;
	$a = [];
	for ($i = 0; $i < 2; $i++) {
		$q = $i == 0 ? "SELECT MAX(id) FROM money_slovesno" :
			"SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 's378259_site' AND TABLE_NAME   = 'money_slovesno'";
		$res = $mysqli->query($q) or die('error on line' . __LINE__ . $mysqli->error);
		$row = $res->fetch_row();
		$a[] = $row[0];
	}
	return $a;
}

function showPages($t, $addons) {
	global $mysqli;
	$found = false;
	$s = "";
	$res = $mysqli->query("SELECT name,language FROM $t $addons") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $res->fetch_assoc()) {
		$s .= "<tr><td>" . $row['name'] . "<td>" . $row['language'];
		$found = true;
	}
	return $found ? "<table class='single c'><thead><tr><th>name<th>language</thead>" . $s . "</table>" : 'not found';
}

//NOTE this functions is different with jm.php
function dumpTableData($t, $addons = '', $onlyInsert = false) {
	return dumpTableDataFull($t, $addons, $onlyInsert)[0];
}

function dumpTableDataFull($t, $addons = '', $onlyInsert = false) {
	global $mysqli;
	$s = "";
	$res = $mysqli->query("SELECT * FROM $t $addons") or die('error on line' . __LINE__ . $mysqli->error . "SELECT * FROM $t $addons");
	$c = [];
	while ($row = $res->fetch_assoc()) {
		$a = [];
		$b = [];
		foreach ($row as $key => $r) {
			$v = is_null($r) ? 'NULL' : wrap($mysqli->real_escape_string($r));
			$a[] = $v;
			$b[] = "`$key`=" . $v; //need `` $key=mass loss
		}
		$v = SEPARATOR . "(" . implode(",", $a) . ")";
		$c[] = $v;
		$s .= "INSERT INTO $t VALUES$v" . SEPARATOR . "ON DUPLICATE KEY UPDATE " . implode(", ", $b) . ";" . SEPARATOR . SEPARATOR;
	}
	return [$onlyInsert ? "INSERT INTO $t VALUES" . implode(",", $c) . ';' : $s, $res->num_rows];
}

function wrap($s, $wrapper = '"') {
	return $wrapper . $s . $wrapper;
}

function remoteQuery($query, $type = REMOTE_TYPE_SIMPLE, $number = null) {
	$c = $type === REMOTE_TYPE_ZIP ? gzdeflate($query, 9) : $query;
	$o = ['query' => $c, 'type' => $type];
	if ($number !== null) {
		$o['number'] = $number;
	}
	return remoteCall($o);
}

function remoteCall($a) {
	$a['login'] = DB_LOGIN;
	$a['password'] = DB_PASS;
	return remotePost(REMOTE . '/php/siteupdate.php', $a);
}

//aslov modified add header
//https://www.geeksforgeeks.org/how-to-post-data-using-file_get_contents-in-php/
function remotePost($url_path, $data) {
	// Method specified whether to GET or
	// POST data with the content specified
	// by $data variable. 'http' is used
	// even in case of 'https'
	$query = http_build_query($data);
	$options = array(
		'http' => array(
			'header' => "Content-Type: application/x-www-form-urlencoded\r\n" .
				"Content-Length: " . strlen($query) . "\r\n" .
				"User-Agent:MyAgent/1.0\r\n",
			'method' => 'POST',
			'content' => $query
		)
	);

	// Create a context stream with
	// the specified options
	$stream = stream_context_create($options);

	// The data is stored in the 
	// result variable
	$result = file_get_contents($url_path, false, $stream);

	return $result;
}

function stateString($r) {
	return "max=" . $r[0] . " auto_increment=" . $r[1];
}

function updatePage($path) {
	global $mysqli;

	$c = file_get_contents($path);

	preg_match("|<title>(.*?)</title>|", $c, $m) or die("error at line" . __LINE__ . " no title found");
	$title = $m[1];

	$i = 0;
	foreach (['gLanguage', 'gPageName'] as $e) {
		preg_match("/\b$e\s*=\s*'(\w+)'/", $c, $m) or die("error at line" . __LINE__ . " no $e found");
		$j = $m[1];
		if ($i == 0) {
			$l = $j;
		} else {
			$p = $j;
		}
		$i++;
	}

	$ol = $l == 'russian' ? 'english' : 'russian';
	$ol2 = substr($ol, 0, 2);

	$a = BEGIN;
	$a[] = "</h3><td align=\"right\"><a href='" . REMOTE . "\\?$p,$l'( target='_blank')?><img src='img/globe16.png'></a>(&nbsp;&nbsp;<img src=\"img/admin16.png\">)?(&nbsp;&nbsp;<img src=\"img/admin_only16.png\">)?(&nbsp;&nbsp;<a href=\"index.php\\?$p,$ol\"><img src=\"img/$ol2.gif\"> $ol2</a>)?</table>";
	$i = false;
	foreach ($a as $e) {
		if (preg_match("|$e|", $c, $m, PREG_OFFSET_CAPTURE)) {
			$i = $m[0][1] + strlen($m[0][0]);
			// echo "found regex position ".$m[0][1]." len=".strlen($m[0][0])."<br>";
			break;
		}
	}
	if ($i === false) {
		$c = '';
		foreach ($a as $s) {
			$c .= '<br>' . tag2text($s);
		}
		die("error at line" . __LINE__ . " no one of BEGIN is found$c");
	}

	if (preg_match("|" . EC1 . "|", $c, $m, PREG_OFFSET_CAPTURE)) {
		$j = $m[0][1];
	} else {
		$j = strpos($c, EC, $i);
		if ($j === false) {
			die("error at line" . __LINE__ . " " . tag2text(EC) . " not found");
		}
	}

	$s = substr($c, $i, $j - $i);

	$w = "WHERE name='$p' AND language='$l'";
	$r = $mysqli->query("SELECT 1 FROM pages $w limit 1") or die('error at line' . __LINE__ . $mysqli->error);
	if ($r->num_rows == 0) {
		return [$p, $l, false];
	}

	$s = $mysqli->real_escape_string(trim($s));
	$title = $mysqli->real_escape_string(trim($title));

	$r = $mysqli->query("UPDATE pages SET title='$title', content='$s' $w") or die('error at line' . __LINE__ . $mysqli->error);
	// echo "[$p][$l][$s][$i][$j]";

	return [$p, $l, true];
}

function multiQuery($query, $number = false) {
	global $mysqli;
	try {	//error on remote throws exception, on local $mysqli->multi_query($query) returns false on query with invalid syntax
		if (strlen($query) === 0) {
			return 'empty query';
		}
		if (!$mysqli->multi_query($query)) {
			return "error line" . __LINE__ . " " . $mysqli->error;
		}
		$s = '';
		do {
			if ($res = $mysqli->store_result()) {
				$s .= '<table class="table_color multi_query table_border"><thead><tr>';
				if ($number) {
					$s .= "<th>N";
				}
				foreach ($res->fetch_fields() as $v) {
					$s .= "<th>" . $v->name;
				}
				$s .= "</thead>";
				$i = 0;
				while ($row = $res->fetch_assoc()) {
					$s .= '<tr>';
					if ($number) {
						$i++;
						$s .= "<td>$i";
					}
					foreach ($row as $r) {
						$s .= '<td>' . (is_null($r) ? 'NULL' : tag2text($r));
					}
				}
				$s .= '</table>';
			} else if (!$mysqli->errno) {
				$s .= "affected rows " . $mysqli->affected_rows . "<br>";
			}
		} while ($mysqli->next_result());

		if ($mysqli->errno) {
			return "error line" . __LINE__ . " " . $mysqli->error;
		}
	} catch (Throwable $e) { //catch all exceptions, do not remove $e not working on php7.4
		return "line" . __LINE__ . $e->getMessage(); //."query $query";
	}
	return $s;
}

function validLoginPassword() {
	return isset($_POST['login']) &&  $_POST['login'] == DB_LOGIN &&
		isset($_POST['password']) &&  $_POST['password'] == DB_PASS;
}

function checkPageRefPages() {
	global $mysqli;
	echo "<table><tr><td>";
	$LA = ['russian', 'english'];
	foreach ($LA as $lng) {
		$ol = $LA[intval($lng == 'russian')];
		$pa = [];
		echo "<td valign='top'>not found $lng";

		$result = $mysqli->query("SELECT title FROM videos") or die('error on line' . __LINE__ . $mysqli->error);
		$videos = [];
		while ($r = $result->fetch_row()) {
			if (preg_match("~<a href=[\"\']\\?(.*?)," . $lng . "[\"\']>~u", $r[0], $m)) {
				$videos[] = $m[1];
			}
		}
		$a = array_merge(getRecipesPages(), [
			'admin',
			'calculator_javascript_ascetic',
			'index',
			'plants_family',
			'plants_images',
			'poverty10_summary',
			'poverty6',
			'poverty_period',
			'test'
		]);

		$result = $mysqli->query("SELECT name FROM branches where language='$lng' ") or die('error on line' . __LINE__ . $mysqli->error);
		while ($r = $result->fetch_row()) {
			$a[] = $r[0];
		}
		$s = implode(',', array_map(fn($e) => "'$e'", $a));
		$result = $mysqli->query("SELECT name,admin_only FROM pages where language='$lng' and name not in($s)") or die('error on line' . __LINE__ . $mysqli->error);
		$a = [];
		while ($r = $result->fetch_row()) {
			$a[] = $r;
		}

		foreach ($a as $ar) {
			$e = $ar[0];
			for ($i = 0; $i < 2; $i++) {
				$j = $i ? 'pages' : 'menus';
				$k = $i ? 'content' : 'menu';
				$a = $i ? 'and name!="index"' : '';
				$add = $i ? "(,$lng)?" : "(?!,$ol)";
				$result = $mysqli->query("SELECT 1 FROM $j where language='$lng' and $k regexp '\\\\?$e\\\\b$add' $a limit 1") or die('error on line' . __LINE__ . $mysqli->error);
				if ($result->num_rows > 0) {
					// if($e=='cooking' ){
					// 	$result = $mysqli->query("SELECT name FROM $j where language='$lng' and $k regexp '\\\\?$e\\\\b$add' $a limit 1") or die('error on line' . __LINE__ . $mysqli->error);
					// 	$r1 = $result->fetch_row();
					// 		echo($r1[0]." ".$result->num_rows." ");
					// }
					break;
				}
			}
			if ($i == 2) {
				$admin_only = $ar[1];
				$invideos = in_array($e, $videos);
				$pa[] = [$e, $admin_only, $invideos];
			}
		}
		$cmp = function ($x, $y) {
			$i = $x[2] == $y[2] ? 1 : 2;
			return $x[$i] <=> $y[$i];
		};

		usort($pa, $cmp);
		$counter = 0;
		echo "<table class='single table_color'>";
		foreach ($pa as $e) {
			$counter++;
			echo "<tr><td>$counter<td><a href='../?$e[0],$lng'>$e[0]</a><td>" . ($e[1] ? 'admin only' : '') . " " . ($e[2] ? 'videos' : '');
			if ($e[1] && $e[2]) {
				echo "error videos+admin_only shouldn't be";
			}
		}
		echo '</table>';
	}
	echo '</table>';
}

function checkPageRefPHP() {
	echo "Not found php<table class='single'>";
	//$a = ['jm', 'jmCommon', 'pagesref'];

	$i = false;
	$j = $i ? 'css' : 'scripts';
	$ex = $i ? "css" : "js";
	$s = '';
	foreach (glob("../$j/*.$ex") as $f) {
		$p = strrpos($f, '/') + 1;
		$n = substr($f, $p, strrpos($f, '.') - $p);
		if (!in_array($n, ['Chart.bundle.min', 'p2dataru', 'p2dataen'])) {
			$s .= file_get_contents($f);
		}
	}

	foreach (glob("*.php") as $f) {
		$p = 0;
		$n = substr($f, $p, strrpos($f, '.') - $p);
		// var_dump($f);
		if (!str_contains($s, $f)) {
			echo "<tr><td>$n";
		}
	}
	echo "</table>";
}

function checkPageRefCSSJS() {
	global $mysqli;
	$i = -1;
	foreach (['script', 'css'] as $ae) {
		$i++;
		$result = $mysqli->query("SELECT $ae,name FROM pages") or die('error on line' . __LINE__ . $mysqli->error);
		$a = ['common', 'jm', 'siteupdate', 'presentation', 'menu', 'combobox'];
		while ($r = $result->fetch_row()) {
			if (!is_null($r[0])) {
				$b = explode(' ', $r[0]);
				foreach ($b as $e) {
					$n = $e == '=' ? $r[1] : $e;
					if (!in_array($n, $a)) {
						$a[] = $n;
					}
				}
			}
		}

		$j = $i ? 'css' : 'scripts';
		$ex = $i ? "css" : "js";
		echo "not found $j<table class='single table_color'>";
		foreach (glob("../$j/*.$ex") as $f) {
			$p = strrpos($f, '/') + 1;
			$n = substr($f, $p, strrpos($f, '.') - $p);

			if (!in_array($n, $a)) {
				echo "<tr><td>$n";
			}
		}
		echo "</table>";
	}
}

function pageReferenceLevel() {
	global $mysqli;
	$LA = ['russian', 'english'];
	$separator = '<br>';
	foreach ($LA as $lng) {
		$ol = $LA[intval($lng == 'russian')];
		echo "<h4>$lng</h4>";

		$level = [];
		$result = $mysqli->query("SELECT name FROM branches where language='$lng' ") or die('error on line' . __LINE__ . $mysqli->error);
		while ($r = $result->fetch_row()) {
			$level[] = $r[0];
		}

		$prevlevel = ['index'];
		$l = 1;
		$add = [];
		while (1) {
			$prevlevel = array_unique(array_merge($prevlevel, $level));
			sort($prevlevel);

			$s = implode(',', array_map(fn($e) => "'$e'", $level));
			$level = $add;
			$result = $mysqli->query("SELECT content,menu,name FROM pages where language='$lng' and name in($s) ") or die('error on line' . __LINE__ . $mysqli->error);
			while ($r = $result->fetch_row()) {
				if (preg_match_all("~(\"|')\\?(\\w+)(,$lng)?\\1~", $r[0], $m)) {
					$i = -1;
					foreach ($m[3] as $e) {
						$i++;
						if (!empty($e)) {
							$j = $m[0][$i];
							echo "<br>!!!!!!!!!!! strange ref $j name=$r[2]  added language from page on same language line" . __LINE__ . "!!!!!!!!!!! ";
						}
					}
					$level = array_merge($level, $m[2]);
				}
				if (!is_null($r[1])) {
					$result1 = $mysqli->query("SELECT menu FROM menus where name='$r[1]' and language='$lng' ") or die('error on line' . __LINE__ . $mysqli->error);
					while ($r1 = $result1->fetch_row()) {
						if (preg_match_all("~\\?(\\w+)\\b(?!,$ol)~u", $r1[0], $m)) {
							$level = array_merge($level, $m[1]);
						}
					}
				}
			}

			$add = [];
			if ($l == 1) {
				$result = $mysqli->query("SELECT title FROM videos where language='$lng'") or die('error on line' . __LINE__ . $mysqli->error);
				while ($r = $result->fetch_row()) {
					if (preg_match("~<a href=(\"|')\\?(\\w+)," . $lng . "\\1>~u", $r[0], $m)) {
						$level[] = $m[2];
						$add[] = $m[2];
					}
				}
			}
			$level = array_unique($level);
			sort($level);
			$level = array_filter($level, fn($e) => !in_array($e, $prevlevel));
			if (empty($level)) {
				break;
			}
			foreach ($level as $e) {
				if ($e == 'calculator_javascript') {
					$add[] = 'calculator_javascript_ascetic';
				} elseif ($e == 'plants' && $lng == 'russian') {
					$add[] = 'plants_images';
				} elseif ($e == 'recipe' && $lng == 'russian') {
					/*$s = file_get_contents('../scripts/recipe.js');
					if (!preg_match("~el\\('p'\\)\\.innerHTML\\s*=\\s*\\[(.*?)\\]\\.sort~s", $s, $m)) {
						die("line" . __LINE__);
					}
					if (!preg_match_all("~\\['(.*?)'~", $m[1], $m)) {
						die("line" . __LINE__);
					}
					$add = array_merge($add, $m[1]);*/
					$a = array_merge($add, getRecipesPages());
				}
			}
			$cl = count($level);
			$cpl = count($prevlevel);
			$t = $cl + $cpl;
			$s = implode(',', array_map(fn($e) => "'$e'", $level));
			$result = $mysqli->query("SELECT name FROM pages where language='$lng' and name in($s) and admin_only=1") or die('error on line' . __LINE__ . $mysqli->error);
			$a = [];
			while ($r = $result->fetch_row()) {
				$a[] = $r[0];
			}
			$i = count($a);
			$c = [$cl - $i, $i];
			$s = js_reduce($level, fn($ac, $e) => $ac . $separator . (in_array($e, $a) ? "<b>$e</b>" : $e), '');
			echo "<p><b>level$l</b> items=$c[0]/<b>$c[1]</b> previtems=$cpl total=$t$s";
			$l++;
		}

		$ps = implode(',', array_map(fn($e) => "'$e'", $prevlevel));
		$result = $mysqli->query("SELECT name,admin_only FROM pages where language='$lng' and name not in ($ps) ") or die('error on line' . __LINE__ . $mysqli->error);
		$s = $separator;
		$c = [0, 0];
		while ($r = $result->fetch_row()) {
			$c[intval($r[1])]++;
			if ($r[1]) {
				$s .= '<b>';
			}
			$s .= $r[0];
			if ($r[1]) {
				$s .= '</b>';
			}
			$s .= $separator;
		}
		$cl = $c[0] + $c[1];
		$cpl = count($prevlevel);
		$t = $cl + $cpl;
		echo "<p><b>not found</b> items=$c[0]/<b>$c[1]</b> previtem=$cpl total=$t$s";
		$ps = implode(',', array_map(fn($e) => "'$e'", $prevlevel));
		$result = $mysqli->query("SELECT name FROM pages where language='$lng' and name in($ps) ") or die('error on line' . __LINE__ . $mysqli->error);
		$a = [];
		while ($r = $result->fetch_row()) {
			$a[] = $r[0];
		}
		$a = array_diff($prevlevel, $a);
		$nf = count($a);
		if ($nf) {
			echo "<p><b>links to not existed pages </b>items=$nf " . implode(' ', $a);
		}
		$i = count($prevlevel) + $c[0] + $c[1];
		$j = $i - $nf;
		echo "<p><b>total</b> $i-$nf=$j";
	}
}

function unencodeQuery($s) {
	$s = json_decode($s);
	return implode(array_map("chr", $s));
}

function setVideoUnadmin($lng, $name) {
	global $mysqli;
	$name = empty($name) ? 'NULL' : wrap($mysqli->real_escape_string($name));
	$a = preg_split("~\s+~", trim($_POST['pages']));
	if (empty($a)) {
		return "";
	}
	$n = implode(',', array_map(fn($e) => wrap($mysqli->real_escape_string($e)), $a));
	$query =  "UPDATE pages SET admin_only=0, video=$name WHERE name IN($n) and language='$lng'";
	$s = multiQuery($query);
	if ($_POST['withremote'] === 'true') {
		$s .= remoteCall(['query' => $query, 'number' => false]);
	}
	return $s;
}

function getRecipesPages() {
	$s = file_get_contents('../scripts/recipe.js');
	if (!preg_match("~gRecipes\s*=\s*\\[(.*)\\]\s*function~s", $s, $m)) {
		die("line" . __LINE__);
	}
	if (!preg_match_all("~\\[\s*'([^']+)'~s", $m[1], $m)) {
		die("line" . __LINE__);
	}
	return $m[1];
}

function dates($date) {
	return $date->format('j') . MONTH_JS[$date->format('n') - 1];
}

function tot($t) {
	return floor($t / 100) * 60 + $t % 100;
}

function dt($t1, $t2) {
	$d = tot($t2) - tot($t1);
	$d1 = sprintf("%d:%02d", floor($d / 60), $d % 60);
	return [$d, $d1];
}

function groupExercise($r, $mn) {
	$p = [
		'австралийскиеПодтягивания' => 2,
		'бицепс' => 1,
		'болгарские выпады' => 3,
		'гиперэкстензия' => 2,
		'грудь' => 1,
		'дельтыЗадние' => 1,
		'дельтыПередние' => 1,
		'дельтыСредние' => 1,
		'икры' => 3,
		'отжимания' => 1,
		'планка' => 0,
		'подтягивания' => 2,
		'подъёмРук' => 1,
		'предплечья' => 1,
		'предплечьяОбратные' => 1,
		'приседания' => 3,
		'румынскаяТяга' => 3,
		'скручивания' => 2,
		'трапеция' => 2,
		'трицепс' => 1,
		'широчайшие' => 2
	];
	$pr = ['австралийскиеПодтягивания' => 'австрПодтягивания', 'предплечьяОбратные' => 'предплОбр'];
	/* 	$p = [
		'отжимания',
		'планка',
	];
 */
	$titleColumns = 5;
	$tableColumns = 1;
	$lastmaxInitialValue = 0;

	$l = 0;
	$s = "<table>";
	$st = "<table>";
	foreach ($p as $se => $pvalue) {
		$s1 = '';
		$l++;
		$ti = is_array($se) ? $se[0] : $se;
		$lv = [];
		$n = 0;
		$lastmax = $lastmaxInitialValue;
		$j = -1;
		$plankCounter = 0;
		$bplank = $se == 'планка';
		$bplankPullups = $bplank || in_array($se, ['австралийскиеПодтягивания']);
		for ($i = 0; $i < count($r); $i++) {
			$e = preg_split("/^\s*\.{2}/m", $r[$i])[0];
			// $e = preg_split("/^\.{2}\s*\n/m", $r[$i])[0];
			//added "(?![а-яё])" for предплечья & предплечьяОбратные
			$re = (is_array($se) ? "(?:" . implode('|', $se) . ")" : $se) . "(?![а-яё])";
			// echo __LINE__."<br>";
			if (preg_match("/^$re.*$/mi", $e, $m1)) {
				preg_match("/^(\d+(?:$mn)\d+\s+)(.+)\n/u", $e, $m);
				$d = $i - $j;
				$kd = $j == -1 ? $i : "+$d";
				//трицепс11.5 3 трицепс8 7 10 12 in one string
				$v = 0;
				$ok = 1;
				$t = [];
				$ms = preg_replace("/^$re/", '', $m1[0]);
				$as = preg_split("/$re/", $m1[0], -1, PREG_SPLIT_NO_EMPTY);
				foreach ($as as $ch) {
					//румынскаяТяга56гантели 12 12 8 12 гантели удобнее чем штанга, мышцы болят
					preg_match_all("/[+*\d.]+(,(?=\d)[+*\d.]+)*/u", $ch, $q);
					$q = $q[0];
					if (count($q)) {
						if ($bplankPullups) {
							$t[] = $vs = implode('+', $q);
						} else {
							//бицепс14.5,11.5 3,5 3,5 4,5 3,5
							$vq = preg_split("/,/", $q[0]);
							$c = count($vq);
							$a = array_fill(0, $c, []);
							for ($j = 1; $j < count($q); $j++) {
								$b = preg_split("/,/", $q[$j]);
								for ($k = 0; $k < $c; $k++) {
									$a[$k][] = $b[$k];
								}
							}
							$vb = [];
							$w = '';
							for ($j = 0; $j < $c; $j++) {
								$vb[] = exerciseA2string($a[$j]);
								$vq[$j] = wrapBrackets($vq[$j], preg_match("/[+]/", $vq[$j]));
								if ($j) {
									$w .= '+';
								}
								$w .= $vq[$j] . "*" . $vb[$j];
							}
							$t[] = $w;
							$vs = '';
							for ($j = 0; $j < $c; $j++) {
								if ($j) {
									$vs .= '+';
								}
								$vs .= eval("return $vq[$j];") . "*" . eval("return $vb[$j];");
							}
						}
						try {
							$v += eval("return $vs;");
						} catch (Throwable $e) { //catch all exceptions, do not remove $e not working on php7.4
							$ok = 0;
						}
					} else {
						$ok = 0;
					}
				}
				$t1 = implode('+', $t);
				$lvc = count($lv);
				$lsub = $bplank ? 3 : 1;
				$add =  '';
				if ($lvc >= $lsub) {
					$lvv = $lv[count($lv) - $lsub];
					if ($lvv && $v != $lvv)
						$add = "<span style='font-size:75%'> " . formatNumber(($v / $lvv - 1) * 100, 1) . '%</span>';
				}
				if (str_contains($ch, 'reset') && $ok) {
					$lastmax = $lastmaxInitialValue;
				}
				$b = $ok && $v > $lastmax;
				//$b1 = $ok && $v == $lastmax;
				if ($b) {
					$lastmax = $v;
				}
				$tag = $b ? 'b' : 'u';
				if ($bplank) {
					$t1 .=  $add;
					$plankCounter++;
					$lv[] = empty($t) ? 0 : $t[0];
				} else {
					$t1 .= '=' . ($ok  ? ($bplankPullups ? '' : $vs . "=")
						. wrap2(formatString($v), $b /*|| $b1*/, "<$tag>", "</$tag>") . $add : '?');
					$lv[] = $ok ? $v : 0;
				}
				$n++;
				$s1 .= "<tr><td>" . implode('<td>', [$m[1], $kd, $ms, $t1]);
				$j = $i;
			}
		}
		$q = array_key_exists($ti, $pr) ? $pr[$ti] : $ti;
		$i = "$q$n";
		//$i = "$l$q$n";
		$ex[$q] = $n;
		if ($l % $tableColumns == 1 || $tableColumns == 1) {
			$s .= '<tr>';
		}
		$tc = $bplank ? 'table_color3' : 'table_color';
		$s .= "<td style='vertical-align:top'><h4 id='t$l'>$i</h4><table class='$tc table_border'>$s1</table>";
		if ($l % $titleColumns == 1 || $titleColumns == 1) {
			$st .= '<tr>';
		}
		$st .= "<td><a href='#t$l'>$i($pvalue)</a>";
	}

	asort($ex);
	return $st . "</table>" .
		js_reduce($ex, fn($a, $v, $k, $ar, $i) => $a . ($i % $titleColumns ? '' : '<tr>') . '<td>' . $k . $v, '<table>') . '</table>'
		. $s . "</table>";
}

function showDifferentExercises() {
	global $EXERCISE;
	$mn = implode('|', array_map(fn($e) => mb_substr($e, 0, 3), MONTH_JS));
	$c = file_get_contents($EXERCISE); //no trim need line number
	$a = explode("\n", $c);
	echo "<p style='white-space:pre;padding:7px'>";
	$error = 0;
	$o = '';
	$n = 0;
	$ex = [];
	$train_number = 0;
	$twoDotComment = false;
	foreach ($a as $s) {
		$n++;
		// if ($n > 200)
		// 	break;
		if (preg_match("~^\s*$~", $s)) {
			$twoDotComment = false;
			$train_number++;
			continue;
		}
		if ($train_number == 0) {
			//echo "skip $s\n";
			continue;
		}
		if ($twoDotComment || preg_match("~^\d+($mn)~", $s) || preg_match("~^\.[^.]~", $s)) {
			// if ($twoDotComment)
			// 	echo "skip $s (line$n)\n";
			continue;
		}

		if (preg_match("~^\.{2}~", $s)) {
			$twoDotComment = true;
			continue;
		}

		// if (preg_match("~^([а-яё\s]+)(\d|$)~ui", $s, $m)) {
		if (preg_match("~^([а-яё]+)(\d|\s|$)~ui", $s, $m)) {
			$v = $m[1];
			$ex[$v] = array_key_exists($v, $ex) ? $ex[$v] + 1 : 1;
			continue;
		}
		$o .= "\n$s (line$n)";
		$error++;
	}

	$k = array_keys($ex);
	sort($k);
	echo "errors $error";
	echo "\nexercise" . count($k) . "={" . js_reduce(
		$k,
		fn($a, $e, $i) =>	$a . "\n'$e'" . ($i == count($k) - 1 ? "\n}" : ","),
		''
	);
	echo "$o";

	// asort($ex);
	// foreach ($ex as $k => $v) {
	// 	echo "$k $v\n";
	// }
}

function storeToFile($e) {
	global $jm_user, $jm_pwd;
	$ch = curl_init("localhost?$e");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_COOKIE, JM_PWD_COOKIE . "=$jm_pwd;" . JM_USER_COOKIE . "=$jm_user;");
	$o = curl_exec($ch);
	$i = curl_errno($ch);
	curl_close($ch);
	if ($i) {
		return "error$i[$e] line" . __LINE__;
	} else {
		file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/$e.html", $o);
		return $e;
	}
}

function getLanguage($l) {
	foreach (["russian", "english"] as $e) {
		if (!strncmp($l, $e, strlen($l))) {
			return $e;
		}
	}
	return false;
}

function exerciseA2string($a) {
	$t = $a[0];
	$c = count($a);
	if ($c > 1) {
		for ($i = 1; $i < $c && $a[$i] == $t; $i++);
		if ($i == $c) {
			return "$t*$c";
		}
	}
	return wrapBrackets(implode("+", $a), $c > 1);
}

function wrapBrackets($s, $c) {
	return wrap2($s, $c, "(", ")");
}

function wrap2($s, $c, $left, $right) {
	return $c ? $left . $s . $right : $s;
}

function getFileCodes($f, $fp) {
	return [$f, md5_file($fp), filesize($fp)];
}

function getDirsCodes($list, $filesList) {
	$dirs = preg_split("/\s+/", $list);
	$a = [];
	foreach ($dirs as $d) {
		$r = [];
		$dir = "../" . $d;
		$files = scandir($dir);
		foreach ($files as $f) {
			if ($f == '.' || $f == '..') {
				continue;
			}
			$fp = "$dir/$f";
			if (is_dir($fp)) {
				continue;
			}
			$r[] = getFileCodes($f, $fp);
		}
		$a[$d] = $r;
	}
	$a['files'] = getFilesCodes($filesList);
	return json_encode($a, JSON_UNESCAPED_UNICODE);
}

function getFilesCodes($list) {
	$files = preg_split("/\s+/", $list);
	$r = [];
	if (!empty($list)) {
		foreach ($files as $f) {
			$r[] = getFileCodes($f, $f);
		}
	}
	return $r;
}

function getTablesCodes($tableString) {
	global $mysqli;
	$o = [];
	if (!empty($tableString)) {
		foreach (preg_split("/\s+/", $tableString) as $t) {
			$d = [];
			$res = $mysqli->query("SHOW KEYS FROM `$t` WHERE Key_name = 'PRIMARY'") or die('error on line' . __LINE__ . $mysqli->error);
			$c = [];
			while ($row = $res->fetch_assoc()) {
				$c[] = $row['Column_name'];
			}
			$d['columns'] = $c;

			$res = $mysqli->query("SELECT * FROM `$t`") or die('error on line' . __LINE__ . $mysqli->error);
			$a = [];
			while ($row = $res->fetch_assoc()) {
				$b = [];
				foreach ($c as $e) {
					$b[] = $row[$e];
				}

				//since md5(null)===md5('') change
				$s = '';
				foreach ($row as $v) {
					$s .= is_null($v) ? '056' : $v;
				}
				$b[] = md5($s);
				$a[] = $b;
			}
			$d['data'] = $a;
			$o[$t] = $d;
		}
	}
	return json_encode($o, JSON_UNESCAPED_UNICODE);
}

function wrapImplode($a, $wrapper, $glue) {
	$i = 0;
	$s = '';
	foreach ($a as $e) {
		if ($i) {
			$s .= $glue;
		}
		$s .= $wrapper . $e . $wrapper;
		$i++;
	}
	return $s;
}

function winscp($a) {
	if (is_string($a)) {
		$a = [$a];
	}
	array_unshift($a, "open " . FTP_USER . "%40" . FTP_URL, "lcd {$_SERVER['DOCUMENT_ROOT']}", "cd /htdocs");
	$a[] = "exit";
	$c = '"C:\Program Files (x86)\WinSCP\WinSCP.exe" /command ' . wrapImplode($a, '"', ' ');
	$output = null;
	$retval = null;
	exec($c, $output, $retval);
}

function check_ruen(&$n, $s, $name) {
	$e1 = '[а-яё]';
	$e2 = '[a-z]';
	$r = '';
	//no dotall flag so .* it's ok
	if (preg_match_all("/(.*)($e1$e2|$e2$e1)(.*)/iu", $s, $m, PREG_OFFSET_CAPTURE)) {
		$k = 2;
		for ($i = 0; $i < count($m[0]); $i++) {
			$q = '';
			for ($j = $k - 1; $j <= $k + 1; $j++) {
				if ($j == $k) {
					$q .= '<b>';
				}
				$q .= tag2text($m[$j][$i][0]);
				if ($j == $k) {
					$q .= '</b>';
				}
			}

			$before = $m[$k - 1][$i][0];
			$match = $m[$k][$i][0];

			if ($match[0] == 'n' && mb_substr("$before", -1) == '\\') {
				continue;
			}

			if (str_ends_with($name, '.php')) {
				if (
					str_contains($before, 'preg_match_all') ||
					str_contains($before, 'preg_replace')
				) {
					continue;
				}
			} elseif (str_ends_with($name, '.js')) {
				if (str_contains($before, '.match')) {
					continue;
				}
			}
			$pos = $m[0][$i][1];
			$line = substr_count($s, "\n", 0, $pos) + 1;
			$r .= "<tr><td>$n<td>$name<td style='padding:0 40px;'>"
				. (preg_match("/$e2/iu", $match[0]) ? 'en&rarr;ru' : 'ru&rarr;en')
				. "<td>$q<td>" . formatString($line, ',', 3);
			$n++;
		}
	}
	return $r;
}

function isExerciseSkip($s) {
	return preg_match("/^\s*\.пропуск тренировки\s*$/u", $s);
}

//true is $new is string extension of $old
function special_same_db($old, $new) {
	$o = preg_split("/\r?\n/", $old);
	$n = preg_split("/\r?\n/", $new);
	if (count($o) > count($n))
		return false;

	$i = -1;
	foreach ($o as $e) {
		$i++;
		$q = $n[$i];
		if (strncmp($e, $q, strlen($e))) {
			return false;
		}
	}
	return true;
}

function make_tags($a, $begin, $end) {
	return $begin . implode($end . $begin, $a) . $end;
}

function getCalorieJsCss($p) {
	$js = ['common',	'siteupdate', 'expressionEstimator', 'Chart.bundle.min'];
	$css = ['common',	'siteupdate'];
	if ($p == 0) {
		$a = ['table',	'dialog',	'calendar', 'combobox'];
		array_push($js, ...$a);
		array_push($css, 'calorie_recipe', ...$a);
	} else {
		array_push($js, 'poverty_data');
	}
	return make_tags($js, "<script src='../scripts/", ".js'></script>") .
		make_tags($css, "<link rel='stylesheet' type='text/css' href='../css/", ".css'>");
}

function dieOnBadLogin() {
	if (!getLogin())
		die('Ошибка, не выполнен вход в систему.');
}

function checkPermission($s) {
	global $jm_user;
	if (!getLogin() || $jm_user != JM_SUPERUSER) {
		die($s);
	}
}

function getExerciseData() {
	global $mysqli, $calorieTable, $HISTORY_DATETIME, $EXERCISE;
	//var_dump($calorieTable);
	$c = trim(file_get_contents($EXERCISE));
	preg_match("/(20фев.*?)\n{2}/s", $c, $m);
	$di = json_encode($m[1], JSON_UNESCAPED_UNICODE);
	$z = preg_split("/(\n\s*){2,}/", $c);
	$b = explode("\n", array_shift($z));

	/*?<=\s+ error regex compilation
	php error
	$s = "1 2 3";
	preg_match("/(?<=\s+)(.*)/", $s,$m);

	js ok
	s = "1 2 3";
	m = s.match(/(?<=\s+)(.*)/);
	console.log(m);
	*/
	$a = preg_split("/\s+/", trim($b[0]));
	array_shift($a);
	$d = array_map(fn($e) => $e === '-' ? NOMASS : $e / 10 + 60, $a);
	$m = [];
	for ($i = 1; !str_starts_with($b[$i], 'http'); $i++) {
		$c = preg_split("/\s+/", $b[$i]);
		$m[$c[0]] = $c[1];
	}

	$r = $mysqli->query("select date,mass from $calorieTable where datetime=$HISTORY_DATETIME ") or die('error line' . __LINE__ . $mysqli->error);
	while ($t = $r->fetch_row()) {
		$m[$t[0]] =  $t[1];
	}
	foreach ($m as $date => $mass) {
		$c = intval((strtotime($date) - strtotime(ETB)) / (3600 * 24));
		$d[$c] = $mass;
	}

	$max = max(array_keys($d));
	$template = array_fill(0, $max + 1, NOMASS);
	$d = array_replace($template, $d);
	$w = implode(',', $d);
	return ["gm=[$w];di=$di;const START_DATE = new Date('" . ETB . "')", $z];
}

function calorieClick($c, $b) {
	return js_reduce(
		$c,
		fn($a, $e, $i) => $a . ($i ? '<br>' : '') .
			"<a href='#' onclick='" . (str_contains($e, '(')  ? $e : "calorieDialog(`$e`)") . ";return false;'>$b[$i]</a>",
		"<td style='vertical-align:top'>"
	);
}

function dateSring($s) {
	$a = explode('-', $s);
	return ($a[2] % 100) . mb_substr(MONTH_JS[$a[1] - 1], 0, 3) . intval($a[0]);
}

function defaultBody() {
	global $mysqli;
	$tablesList = [];
	$r = $mysqli->query("show tables");
	$exclude = ["ip", "counters"];
	while ($t = $r->fetch_row()) {
		$b = $t[0];
		if (!in_array($b, $exclude)) {
			$tablesList[] = $b;
		}
	}
	$op = '<option>' . implode('</option><option>', $tablesList) . '</option>';
	$opt = '<option>' . implode('</option><option>', ['pages', 'menus', 'versions', 'videos']) . '</option>';

	$h = HEAD;
	if (IS_LOCAL) {
		$b = "<button onclick='query()'>query</button>";
		$bs = js_reduce(BUTTONS, fn($a, $e, $i) => "$a<button onclick=\"pagesClick($i)\"" .
			($i >= count(BUTTONS) - 2 ? ' class="comboboxbutton sub"' : '') . ">$e</button>" .
			($i == count(BUTTONS) - 3 ? '<br>' : ' '), "");

		$r = "<td rowspan=7 id='o'>
<tr><td>Drop or <input type='file' id='selectfile' multiple onchange='uploadFiles()'/>
<button onclick='updateRemote()'>update remote</button>
<label><input  id='selectfileremote' type='checkbox' name='remote'>with remote</label>

<tr><td>
<select id='table'>$opt</select>
<input id='pi' type='text' value='' placeholder='index,r jurassic other,en' style='width:300px'>
<label><input type='checkbox' id='ci'>regex</label>
<br>$bs
<tr><td>
<button onclick='updateTableClick(0)'>update</button>
<button onclick='updateTableClick(1)'>show query</button>
<select id='utable'>$op</select> where <input id='where' type='text' value='' placeholder='id>12' style='width:200px'>
<tr><td>
<button onclick='videostring()'>videostring</button>
<input id='videostring' type='text' value='' placeholder='' style='width:300px'>
<tr><td>
<table style='margin:0'><tr>
<td><label><input type='checkbox' id='querycopy' checked />show query buttons copy to clipboard</label>
<td><button onclick='testClick()'>test</button>
</table></table>";
		$rc = "<label><input type='checkbox' id='multi_remote'>rem</label><label><input type='checkbox' id='multi_number'>№</label>";
	} else {
		$ic = 'infinityfree.png';
		$h = str_replace('phpmyadmin.ico', $ic, $h);
		$b = js_reduce(SLQ, fn($a, $e) => "$a<button class='comboboxbutton' onclick='remotec(\"$e\")'>$e</button> ", "");
		$r = "<p id='p'></p>";
		$rc = " <button class='comboboxbutton' onclick='window.open(\"../index.php\")'><img src='../img/home16.png'></button>";
	}

	die("$h<title>siteupdate</title></head>
<body onload='load()' class='fullscreen'>
<table class='t'>
<tr><td>$b
<span class='smallfont'>esc|ctrl+enter&rArr;query
$rc
<select id='query' onchange='cquery()' class='smallfont'></select>
<button onclick='addQuery()'>+</button>
<input type='file' id='sqlfile' onchange='uploadRemoteSqlFile()' class='smallfont' /></span><br>
<textarea id='multi_query' rows='5' class='cellw'></textarea>
<br><p class='cellw'>" . implode(' ', $tablesList) . " " . count($tablesList) . " <button onclick='querySelected()'>query selected</button> <select id='history' onchange='chistory()' class='smallfont'></select></p>
<textarea id='buffer' rows='10' class='cellw' placeholder='buffer to store text'></textarea>$r</body></html>");
}
