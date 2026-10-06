<?php
include("logpass.php");

const TYPE_NORMAL = 0;
const TYPE_FULLSCREEN = 1;
const TYPE_NOMENU = 2;
const TYPE_PRESENTATION = 3;
const REMOTE = 'https://slovesnov.rf.gd';
const FTP_URL = 'ftpupload.net';
// define('IS_LOCAL', 
//     ($_SERVER['SERVER_NAME'] ?? '') === 'localhost' || 
//     str_starts_with($_SERVER['SERVER_NAME'] ?? '', "192.168.1.")
// );

$LOCAL = $_SERVER['SERVER_NAME'] === 'localhost' || str_starts_with($_SERVER['SERVER_NAME'], "192.168.1.");
if ($LOCAL) {
	$db_host = 'localhost';
} else {
	$db_host = 'sql104.infinityfree.com';
}

const ALWAYS_ADMIN_LOCAL = 0; //if ALWAYS_ADMIN_LOCAL=1 then not need to login for edit jm on localhost, test for potencial other users
$ALWAYS_ADMIN = $LOCAL ? ALWAYS_ADMIN_LOCAL : 0;

function isJmValidUser()
{
	global $ALWAYS_ADMIN, $jm_user, $jm_pwd, $jm_user_cookie, $jm_pwd_cookie;
	if ($ALWAYS_ADMIN) {
		return true;
	}
	return isset($_COOKIE[$jm_user_cookie]) && isset($_COOKIE[$jm_pwd_cookie])
		&& $_COOKIE[$jm_user_cookie] == $jm_user && $_COOKIE[$jm_pwd_cookie] == $jm_pwd;
}

function tag2text($s)
{
	return str_replace(['&', '<', '>'], ['&amp;', '&lt;', '&gt;'], $s);
}

//like common.js
function formatString($n, $separator = ' ', $digits = 3)
{
	$s = (string)$n;
	$a = str_contains($s, '.') ? '\\.' : '$';
	//need double curly braces because {$digits} changes to $digits value
	return preg_replace("/\B(?=(\d{{$digits}})+$a)/", $separator, $s);
}

//like common.js
//formatNumber(1234.5555, 1) -> '1 234.5'
function formatNumber($n, $digits)
{
	return formatString(normalize($n, $digits));
}

//like common.js
//321.10 -> 321.1, 1.00 -> 1, 100 -> 100
function normalize($s, $digits = null)
{
	return $digits == null ? $s : round($s, $digits);
}

function videoString($video, $type, $language)
{
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

function checkUserPassword($user, $password)
{
	global $mysqli;
	$u = $mysqli->real_escape_string($user);
	$m = md5($password);
	$r = $mysqli->query("SELECT 1 FROM users where user='$u' and password='$m'") or die('error on line' . __LINE__ . $mysqli->error);
	return $r->num_rows == 1;
}

//https://stackoverflow.com/questions/4117555/simplest-way-to-detect-a-mobile-device-in-php
function isMobile()
{
	return isset($_SERVER["HTTP_USER_AGENT"]) ? preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]) : 0;
}

$debug_file_name = "debug.txt";

function variable_to_string($p)
{
	if (is_array($p)) {
		ksort($p);
		if (!empty($p) && array_key_exists(0, $p) && is_array($p[0])) {
			foreach ($p as $k => $e) {
				ksort($p[$k]);
			}
		}
		return print_r($p, true);
	} else if (is_string($p)) {
		return $p;
	} else {
		return var_export($p, true);
	}
}

function append_debug_file($variable = '', $title = '')
{
	//Note line can be invalid, it's php bug
	global $debug_file_name;
	$a = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
	$b = $a[(int)array_key_exists(1, $a)];
	$q = ($title == '' ? '' : variable_to_string($title) . " ") . basename($b['file']) . " " . $b['function'] . "():" . $b['line'] . " " . mb_strtolower(date('dM H:i:s'));
	$s = "=============== $q ===============\n" . variable_to_string($variable) . "\n";
	file_put_contents($debug_file_name, $s, FILE_APPEND);
}

function clear_debug_file()
{
	global $debug_file_name;
	file_put_contents($debug_file_name, "");
}

function set_debug_file_name($s)
{
	global $debug_file_name;
	$debug_file_name = $s;
}

function js_reduce($array, $fu, $initialValue = null)
{
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
function timeToString($t)
{
	if ($t >= 3600) {
		$v = [floor($t / 3600), floor(($t / 60) % 60), $t % 60];
	} else if ($t >= 60) {
		$v = [floor($t / 60), $t % 60];
	} else {
		$v = [round($t)];
	}
	return js_reduce($v, fn($a, $e, $i) => $a . ($i ? ':' . sprintf("%02d", $e) : $e), '');
}

function getSimilarPages($n, $language, $index)
{
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

function connect()
{
	global $mysqli, $db_host;
	$mysqli = new mysqli($db_host, DB_LOGIN, DB_PASS, DB_NAME);
	if ($mysqli->connect_errno) {
		die('error on line' . __LINE__ . ' ' . $mysqli->connect_error);
	}
	//do not remove can read russian chars using phpmyadmin
	$mysqli->set_charset('utf8');
	mb_internal_encoding('UTF-8'); //for mb_... functions
	//mb_regex_encoding('UTF-8');
}

function prepareQueryString()
{
	$s = urldecode($_SERVER['QUERY_STRING']); //use urldecode 'php%20scripts%20css' -> 'php scripts css'
	$q = preg_replace("/[&?]?i=\d+$/", '', $s); //for siteupdate.php need to skip ?, sometimes & appear for index
	return $q;
}

function setCookies()
{
	global $jm_user, $jm_pwd, $jm_user_cookie, $jm_pwd_cookie;
	//need $_COOKIE[$jm_user_cookie] = $jm_user; https://stackoverflow.com/questions/24662580/php-setcookie-not-working
	setcookie($jm_user_cookie, $jm_user, time() + 86400 * 365, "/"); // 86400 = 1 day
	$_COOKIE[$jm_user_cookie] = $jm_user;
	setcookie($jm_pwd_cookie, $jm_pwd, time() + 86400 * 365, "/"); // 86400 = 1 day
	$_COOKIE[$jm_pwd_cookie] = $jm_pwd;
}
