<?php
/*
localhost/php/poverty.php
*/

include("../config.php");

if (isset($_POST['group'])) {
	connect();

	$a = [];
	$data = json_decode($_POST['group']);
	foreach ($data as $e) {
		$n = $e[0];
		$mass = $e[1];
		$n1 = str_replace('ё', 'е', mb_strtolower($n));
		$r = $mysqli->query("SELECT `animal protein`,`saturated fat`,b12 FROM `money_goods_slovesno` where REPLACE(LOWER(name), 'ё', 'е')='$n1'") or die('error on line' . __LINE__ . $mysqli->error);
		if ($r->num_rows) {
			$t = $r->fetch_row();
			if ($t[0] === '0' && $t[1] === '0') {
				continue;
			}
			$b12 = $t[2];
		} else {
			$b12 = '?';
		}
		$v =  $b12 == '?' ? '?' : (float)$b12;
		$a[] = [$n, (float)$mass, $v, $v == '?' ? '?' : $mass / 100 * $v];
	}
	die(json_encode($a, JSON_UNESCAPED_UNICODE));
}

if (isset($_POST['writeFile'])) {
	$c = 0;
	foreach ($_POST as $k => $v) {
		if ($k == 'writeFile') {
			continue;
		}
		//https://www.php.net/manual/en/language.variables.external.php
		//Dots and spaces in variable names are converted to underscores. 
		$p = strrpos($k, '_');
		if ($p === false) {
			die("cannt find _ in $k");
		}
		$k = substr_replace($k, ".", $p, 1);
		//echo $k . "<br>";
		$c++;
		file_put_contents("c:/Users/user/git/graph/graph/$k",  mb_convert_encoding($v, "windows-1251", "utf-8")) or die("cann't write file $k");
	}
	die("written $c files");
}

const MASS = ' масса ';
if (isset($_POST['command'])) {
	$d = $_POST['s'];
	$c = $_POST['command'];
	$s = file_get_contents('../scripts/poverty.js');
	if ($c == 'delete') {
		preg_match("/,\s*`$d/",$s,$m,PREG_OFFSET_CAPTURE);
		$i = $m[0][1];
		$j = strpos($s, '`', $i + strlen($m[0][0]))+1;
		$d='';
	}
	else if ($c == 'edit') {
		$i = strpos($d, MASS);
		$f = '`' . substr($d, 0, $i + strlen(MASS));
		$i = strpos($s, $f) + 1;
		$j = strpos($s, '`', $i + 1);
	} else {
		$i = $j = strrpos($s, "`") + 1;
		$d = "\n\n\t, `$d`";
	}
	$q = substr($s, 0, $i) . $d . substr($s, $j);
	file_put_contents('../scripts/poverty.js', $q);
	die('ok');
}

if (isset($_POST['dataFile'])) {
	file_put_contents('../scripts/poverty_data.js', $_POST['dataFile']);
	die('ok');
}

$s = '
до16ноя
килокалорий в сутки 1 666.9 (26.86 на кг) или 92.6% суточной нормы, всего 180 030.4 или 10 001.3% суточной нормы
масса в сутки 2 497.8, всего 269 765.1, масса человека 62.1, дней 108
соотношения бжу 1 : 0.81 : 5.44 или 1.23 : 1 : 6.68 или 0.74 : 0.6 : 4, бжу% 12.1% : 22.1% : 65.8%, бжу в сутки 50.41 : 41.01 : 274.06
бжу/кг в сутки 0.81 (раст0.56 68.4% жив0.26 31.6%) : 0.66 (раст0.34 52.1% жив0.32 47.9%) : 4.42
b12 всего 102.3, b12 в сутки 0.95 (межд. 39.5%, рос. 31.6%), клетчатка всего 4 266.51, клетчатка в сутки 39.5/25=158%

с16ноя
килокалорий в сутки 1 969.6 (31.73 на кг) или 109.4% суточной нормы, всего 82 724.3 или 4 595.6% суточной нормы
масса в сутки 2 723.8, всего 114 401.2, масса человека 62.1, дней 42
соотношения бжу 1 : 0.91 : 2.84 или 1.1 : 1 : 3.11 или 1.41 : 1.29 : 4, бжу% 17% : 34.8% : 48.2%, бжу в сутки 83.56 : 76.25 : 237.28
бжу/кг в сутки 1.35 (раст0.37 27.3% жив0.98 72.7%) : 1.23 (раст0.33 27.2% жив0.89 72.8%) : 3.82
b12 всего 364.52, b12 в сутки 8.68 (межд. 361.6%, рос. 289.3%), клетчатка всего 1 665.07, клетчатка в сутки 39.64/25=158.6%

всего
килокалорий в сутки 1 756.2 (28.29 на кг) или 97.6% суточной нормы, всего 261 674.9 или 14 537% суточной нормы
масса в сутки 2 565.1, всего 382 196.7, масса человека 62.1, дней 149
соотношения бжу 1 : 0.85 : 4.4 или 1.17 : 1 : 5.15 или 0.91 : 0.78 : 4, бжу% 13.7% : 26.2% : 60.1%, бжу в сутки 59.98 : 51.2 : 263.87
бжу/кг в сутки 0.97 (раст0.5 52.1% жив0.46 47.9%) : 0.82 (раст0.34 41.6% жив0.48 58.4%) : 4.25
b12 всего 466.82, b12 в сутки 3.13 (межд. 130.5%, рос. 104.4%), клетчатка всего 5 902.51, клетчатка в сутки 39.61/25=158.5%
';
echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<link rel="stylesheet" type="text/css" href="../css/common.css">
<link rel="stylesheet" type="text/css" href="../css/table.css">
<style>
#__table0 tbody tr td:nth-child(n+2) {
	text-align: right;
}
</style>
</head><body style="padding:7px;">';
echo "<p style='white-space: pre;'>";

die(getTableString($s));

//die('unknown command' . __LINE__);

function getTableString($s)
{
	$ks = 'килокалорий в сутки';

	$a = explode("\n", $s);
	$b = [];
	for ($i = 0; $i < count($a); $i++) {
		$t = $a[$i];
		if (str_starts_with($t, $ks)) {
			$b[] = $i - 1;
		}
	}
	$b = [$b[0], $b[2], $b[1]];

	$nt = "(\d+(?:\.\d+)?)";
	$ns = "([\d\s.]+)";
	$t1 = "$nt.*раст$nt.*жив$nt.*";
	$r = [
		"$ks $ns",
		"масса в сутки $ns",
		"бжу% ($nt% : $nt% : $nt%)",
		"$t1:\s*$t1:\s*$nt",
		"b12 в сутки $nt.*клетчатка в сутки $nt"
	];

	$q = "<table id='__table0' class='table_color table_border'><thead><tr>" . stra(1, '', "ккалории", "белки", "жиры", "углеводы", "ккал/кгМассы", "b12", "клетчатка", "масса", "ккал/100г", "бжу%") . "<tbody>";
	foreach ($b as $i) {
		$j = -1;
		foreach ($r as $e) {
			$j++;
			preg_match("/$e/", $a[$i + $j + 1], $m[$j]);
		}
		$kk1 = $m[0][1];
		$mass = $m[1][1];
		$n = $m[3];
		$p = $n[1];
		$f = $n[4];
		$c = $n[7];
		$q .= "<tr>" . stra(
			0,
			$a[$i],
			$kk1,
			nf3($p, $n, 2),
			nf3($f, $n, 5),
			$c,
			4 * $p + 9 * $f + 4 * $c,
			$m[4][1],
			$m[4][2],
			$mass,
			formatNumber(rs($kk1) * 100 / rs($mass), 2),
			$m[2][1]
		);
	}
	return $q . "</table>";
}

function nf3($v, $a, $i)
{
	return $v . " &nbsp; " . nf($a[$i]) . "/" . nf($a[$i + 1]);
}

function nf($n)
{
	//need always tow digits after dot even if zeros
	return number_format((float)$n, 2);
}

function rs($s)
{
	return preg_replace("/\s+/", "", $s);
}

function stra($b, ...$a)
{
	return array_reduce($a, fn($c, $e) => $c . ($b ? "<th>" : "<td>") . $e, "");
}
