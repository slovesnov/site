<?php
include("logpass.php");
//for valid config time
date_default_timezone_set('Europe/Moscow');

const TYPE_NORMAL = 0;
const TYPE_FULLSCREEN = 1;
const TYPE_NOMENU = 2;
const TYPE_PRESENTATION = 3;
const REMOTE = 'https://slovesnov.rf.gd';
const FTP_URL = 'ftpupload.net';
define(
	'IS_LOCAL',
	($_SERVER['SERVER_NAME'] ?? '') === 'localhost' ||
		str_starts_with($_SERVER['SERVER_NAME'] ?? '', "192.168.1.")
);
define('DB_HOST', IS_LOCAL ? 'localhost' : 'sql104.infinityfree.com');

const ALWAYS_ADMIN_LOCAL = 0; //if ALWAYS_ADMIN_LOCAL=1 then not need to login for edit jm on localhost, test for potencial other users
define('ALWAYS_ADMIN', IS_LOCAL ? ALWAYS_ADMIN_LOCAL : 0);

function isJmValidUser() {
	global $jm_user, $jm_pwd;
	if (ALWAYS_ADMIN) {
		return true;
	}
	return isset($_COOKIE[JM_USER_COOKIE]) && isset($_COOKIE[JM_PWD_COOKIE])
		&& $_COOKIE[JM_USER_COOKIE] == $jm_user && $_COOKIE[JM_PWD_COOKIE] == $jm_pwd;
}

//like common.js
function formatString($n, $separator = ' ', $digits = 3) {
	$s = (string)$n;
	$a = str_contains($s, '.') ? '\\.' : '$';
	//need double curly braces because {$digits} changes to $digits value
	return preg_replace("/\B(?=(\d{{$digits}})+$a)/", $separator, $s);
}

//like common.js
//formatNumber(1234.5555, 1) -> '1 234.5'
function formatNumber($n, $digits) {
	return formatString(normalize($n, $digits));
}

//like common.js
//321.10 -> 321.1, 1.00 -> 1, 100 -> 100
function normalize($s, $digits = null) {
	return $digits == null ? $s : round($s, $digits);
}

function videoString($video, $type, $language) {
	global $mysqli;
	$videostr = '';
	if (!is_null($video)) {
		$result = $mysqli->query("SELECT youtube,dzen,name,size FROM videos WHERE name ='$video' and LANGUAGE='$language'") or die('error line' . __LINE__ . $mysqli->error);
		if (!$result->num_rows) {
			$result = $mysqli->query("select video from pages where name='$video' and language='russian'") or die('error line' . __LINE__ . $mysqli->error);
			if (!$result->num_rows) {
				return "error id (or pages.name)=$video not found " . basename(__FILE__) . ":" . __LINE__;
			}
			$r = $result->fetch_row();
			if (is_null($r[0])) {
				return "pages.name=$video has video=NULL " . basename(__FILE__) . ":" . __LINE__;
			}
			$result = $mysqli->query("SELECT youtube,dzen,name,size FROM videos WHERE name ='$r[0]' and LANGUAGE='$language'") or die('error line' . __LINE__ . $mysqli->error);
		}
		$r = $result->fetch_row();
		$i = -1;
		if ($type != TYPE_PRESENTATION) {
			$videostr = " ";
		}
		foreach (['youtube', 'zen'/*, 'video'*/] as $e) {
			$i++;
			// if ($i == 2) {
			// 	if ($r[3] >= 100) { //toobig
			// 		continue;
			// 	}
			// 	$r[$i] = REMOTE . "/video/" . $r[$i] . (str_starts_with($r[$i], '.mp4') ? '' : '.mp4');
			// }
			if ($type == TYPE_PRESENTATION) {
				$style = 'style="margin-left:7px;background:white;vertical-align:middle"';
				$h = 32;
			} else {
				$style = $i ? "class='ma'" : '';
				$h = 16;
			}
			$videostr .= "<a href='$r[$i]' target='_blank'><img src='img/$e$h.png' $style></a>";
		}
	}
	return $videostr;
}

function checkUserPassword($user, $password) {
	global $mysqli;
	$u = $mysqli->real_escape_string($user);
	$m = md5($password);
	$r = $mysqli->query("SELECT 1 FROM users where user='$u' and password='$m'") or die('error on line' . __LINE__ . $mysqli->error);
	return $r->num_rows == 1;
}

//https://stackoverflow.com/questions/4117555/simplest-way-to-detect-a-mobile-device-in-php
function isMobile() {
	return isset($_SERVER["HTTP_USER_AGENT"]) ? preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]) : 0;
}

$log_file_name = "log.txt";

function variables_to_string(...$variables) {
	$s = "";
	foreach ($variables as $variable) {
		if (is_array($variable)) {
			$s .= print_r($variable, true);
		} elseif (is_null($variable)) {
			$s .= "NULL";
		} else {
			$export = var_export($variable, true);
			if (is_string($variable)) {
				$export = substr($export, 1, -1); // 'abc' => abc
				$export = str_replace("\'", "'", $export); // Заменяем \' на '
			}
			$s .= $export . " " . gettype($variable);
		}
		$s .= "\n"; // Добавляем перенос строки после каждой переменной
	}
	return $s;
}

function diec($condition, $text, ...$variables) {
	global $globalthrow;
	if ($condition) {
		$s = $text . (count($variables) === 0 ? "" : " " . variables_to_string(...$variables)) . " " . call_info(1);
		if ($globalthrow) {
			throw new Exception($s);
		}
		die($s);
		// die("</table>$s");
	}
}

function call_info($n = 0) {
	$a = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
	$file = isset($a[$n]['file']) ? basename($a[$n]['file']) : 'unknown_file';
	$line = isset($a[$n]['line']) ? $a[$n]['line'] : 0;
	$s = "{$file}:{$line}";
	if (isset($a[$n + 1]['function'])) {
		$function = $a[$n + 1]['function'] . "()";
		$s .= " " . $function;
	}
	return $s;
}

function printlog(...$variables) {
	global $log_file_name;
	$s = call_info(1) . date(' H:i:s') . (count($variables) === 0 ? "" : "\n" . variables_to_string(...$variables)) . "\n";
	file_put_contents($log_file_name, $s, FILE_APPEND);
}

function clearlog() {
	global $log_file_name;
	file_put_contents($log_file_name, "");
}

function js_reduce($array, $fu, $initialValue = null) {
	$b = $array;
	$a = $initialValue === null ? array_shift($b) : $initialValue;
	//not working array_walk($b, fn ($v, $k)=>$a = $fu($a, $v, $k, $array));
	$i = 0;
	array_walk($b, function ($v, $k) use (&$a, $fu, $array, &$i) {
		$a = $fu($a, $v, $k, $array, $i++);
	});
	return $a;
}

//like js
function timeToString($t) {
	if ($t >= 3600) {
		$v = [floor($t / 3600), floor(($t / 60) % 60), $t % 60];
	} else if ($t >= 60) {
		$v = [floor($t / 60), $t % 60];
	} else {
		$v = [round($t)];
	}
	return js_reduce($v, fn($a, $e, $i) => $a . ($i ? ':' . sprintf("%02d", $e) : $e), '');
}

function getSimilarPages($n, $language, $index) {
	global $mysqli;
	$o = $language == 'russian' ? 'desc' : 'asc';
	$n1 = str_replace('_', '\\_', $n); //in like _ means any symbol
	$result = $mysqli->query("SELECT name,language,title FROM pages WHERE name like '%$n1%' ORDER BY language $o,name") or die('error line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($row = $result->fetch_row()) {
		$a[] = $row;
	}
	$r = ['count' => count($a)];
	if (count($a)) {
		if (count($a) == 1 || count($a) == 2 && $a[0][0] == $a[1][0]) {
			//only one row found redirect, or two rows with different language
			$e = $a[0];
			$r['name'] = $e[0];
			$r['language'] = count($a) == 1 ? $e[1] : $language;
		} else {
			$content =  "<table>";
			$i = 0;
			foreach ($a as $e) {
				$i++;
				if ($index) {
					$o = '';
				} else {
					$o = $i . " " . preg_replace("/$n/i", "<span style='background:#F0E68C'>$n</span>", $e[0]) . " ";
				}
				$content .= "<tr><td>$o<a href='/index.php?$e[0],$e[1]'>$e[2] <img src='/img/" . substr($e[1], 0, 2) . ".gif'></a>";
			}
			$r['s'] = $content . "</table>";
		}
	}
	return $r;
}

function connect() {
	global $mysqli;
	$mysqli = new mysqli(DB_HOST, DB_LOGIN, DB_PASS, DB_NAME);
	if ($mysqli->connect_errno) {
		die('error on line' . __LINE__ . ' ' . $mysqli->connect_error);
	}
	//do not remove can read russian chars using phpmyadmin
	$mysqli->set_charset('utf8');
	mb_internal_encoding('UTF-8'); //for mb_... functions
	//mb_regex_encoding('UTF-8');
}

function prepareQueryString() {
	$s = urldecode($_SERVER['QUERY_STRING']); //use urldecode 'php%20scripts%20css' -> 'php scripts css'
	$q = preg_replace("/[&?]?i=\d+$/", '', $s); //for siteupdate.php need to skip ?, sometimes & appear for index
	return $q;
}

function setCookies() {
	global $jm_user, $jm_pwd;
	//need $_COOKIE[JM_USER_COOKIE] = $jm_user; https://stackoverflow.com/questions/24662580/php-setcookie-not-working
	setcookie(JM_USER_COOKIE, $jm_user, time() + 86400 * 365, "/"); // 86400 = 1 day
	$_COOKIE[JM_USER_COOKIE] = $jm_user;
	setcookie(JM_PWD_COOKIE, $jm_pwd, time() + 86400 * 365, "/"); // 86400 = 1 day
	$_COOKIE[JM_PWD_COOKIE] = $jm_pwd;
}

function getFileCodes($f, $fp) {
	return [$f, md5_file($fp), filesize($fp)];
}

function getFilesCodes($list, $callback = 'getFileCodes') {
	$files = preg_split("/\s+/", $list);
	$r = [];
	if (!empty($list)) {
		foreach ($files as $f) {
			$r[] = $callback($f, $f);
		}
	}
	return $r;
}

function getDirsCodes($list, $filesList, $callback = 'getFileCodes') {
	$dirs = preg_split("/\s+/", $list);
	$a = [];
	foreach ($dirs as $d) {
		$r = [];
		$dir = "../" . $d;
		foreach (glob("$dir/*") as $fp) {
			if (is_dir($fp) || str_ends_with(strtolower($fp), '.txt')) {
				continue;
			}
			$f = basename($fp);
			// Вызываем кастомную или дефолтную функцию
			$r[] = $callback($f, $fp);
		}
		$a[$d] = $r;
	}
	// Передаем callback дальше в getFilesCodes
	$a['files'] = getFilesCodes($filesList, $callback);
	return json_encode($a, JSON_UNESCAPED_UNICODE);
}
