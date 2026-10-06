<?php
/*
index.php?matrix,english,parameter,mobile_mode
possible short language variants
index.php?matrix,r ru rus russ ... any substring from 'russian' or 'english'
index.php?matrix,ru
index.php?matrix,e
index.php?matrix,en
index.php/matrix - also allowable

mobile_mode{
0 - normal mode (default)
1 - view page like from mobile phone. Mode uses for debug this php file
2 - mode to store page for offline mobile view. Need to open page and save it then copy to mobile phone, later this page will work when mobile phone is offline. No top menu, all js & css file are inline
}

SELF_SYMBOL='=' in script or css means file with same name
*/

header("Expires: Thu, 01 Jan 1970 00:00:01 GMT"); //always expire
include("config.php");
connect();

const SELF_SYMBOL = '=';
const CSS_DIR = 'css/';
const CSS_EXT = '.css';
const JS_DIR = 'scripts/';
const JS_EXT = '.js';
const FILE = 'index.php';
const MOBILE_MODE_OFFLINE = 2;
const REDIRECT_SECONDS = 3;

$q = prepareQueryString();
if ($q == 'error') {
	$a = substr($_SERVER['REQUEST_URI'], 1);
	$p = strpos($a, '/');
	if ($p !== false) {
		$a = substr($a, 0, $p);
	}
	/*i guess need to use header(Location...
	is user typed REMOTE/bridge
	next click "?something" we got REMOTE/bridge?something
	*/
	header("Location: /" . FILE . "?$a");
	exit;
}

$pieces = explode(',', $q);
$original_name = $pieces[0] == '' ? 'index' : $pieces[0]; //even on empty $_SERVER['QUERY_STRING'] count($pieces)=1

/*allow index.php?PoW -> no page 'PoW' but have page 'pow'
allow index.php?зщЦ -> no page 'зщЦ' but have page 'pow' (as user type pow on russian keyboard layout)
*/
$name = mb_strtolower($original_name);
if (preg_match('/[а-я]/u', $name)) {
	$ru = 'йцукенгшщзхъфывапролджэячсмитьбю';
	$en = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.';
	$s = '';
	foreach (mb_str_split($name) as $c) {
		$i = mb_strpos($ru, $c);
		if ($i !== false) {
			$c = $en[$i];
		}
		$s .= $c;
	}
	$name = $s;
}

if (count($pieces) < 2 || $pieces[1] == '') { //no language set, check cookie
	$language = isset($_COOKIE['language']) ? $_COOKIE['language'] : 'english';
} else {
	$language = str_starts_with('russian', $pieces[1]) ? 'russian' : 'english';
}
//update cookie if need (also update expire time)
setcookie('language', $language, time() + 3600 * 24 * 30, '/'); //30 days expire

$parameter = count($pieces) >= 3 ? $pieces[2] : '';

$mobile_mode = count($pieces) >= 4 ? $pieces[3] : 0;
//set valid number because of output to js //gMobileMode=$mobile_mode;
if (/* !is_int($mobile_mode) || */$mobile_mode < 0 || $mobile_mode > 2) {
	$mobile_mode = 0;
}
$mobile = $mobile_mode == 0 ? isMobile() : true;

const VERSION = 0;
const VERSION_HISTORY = 1;
const ERROR = 2;
const EXISTS_ONLY_IN_ANOTHER_LANGUAGE = 3;
const PAGE_NOT_FOUND = 4;
const SIMILAR_PAGES = 5;
$admin = (int)isJmValidUser();

if ($language == 'russian') {
	$month_names = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	$language_array = ['версия', 'История версий', 'Ошибка', 'Данная страница существует только на английском языке. Страница будет перенаправлена на английский язык через ' . REDIRECT_SECONDS . ' секунд.', 'Страница не найдена', 'Похожие страницы'];
	$opposite_language = 'english';
} else {
	$month_names = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	$language_array = ['version', 'Versions history', 'Error', 'This page exists only in russian. The page will be redirected to russian after ' . REDIRECT_SECONDS . ' seconds.', 'Page not found', 'Similar pages'];
	$opposite_language = 'russian';
}
// const ADMIN_ONLY_STRING='<p>[russian] Доступ к данной странице имеют только пользователи с правами администратора.<br>[english] Only users with administrative rights have access to this page.';

const ADMIN_ONLY_STRING = '<p>[russian] Данная страница находится в стадии разработки.<br>[english] This page is under construction.';

//combobox.css always since modalDialog in common.js. I have published component combobox so not includes combobox.css to common.css
$css = ['common', 'combobox'];
$script = ['common'];
$type = 0;
$onload = '';
$version = $menu = NULL;
$favicon = 'favicon';
$latex = false;
$save_button = false;
$admin_only = false;
$videostr = '';
$result = $mysqli->query("SELECT 1 FROM pages WHERE NAME ='$name' and LANGUAGE='$opposite_language' LIMIT 1") or die('error line' . __LINE__ . $mysqli->error);
$exists_on_another_language = ($result->num_rows == 1);

$redirect = false;
$result = $mysqli->query("SELECT title,content,script,onload,css,type,keywords,menu,favicon,latex,admin_only,save_button,video FROM pages WHERE name ='$name' and LANGUAGE='$language'") or die('error line' . __LINE__ . $mysqli->error);
if ($result->num_rows == 0) {
	$title = $language_array[ERROR];
	if ($exists_on_another_language) {
		$content = '<p>' . $language_array[EXISTS_ONLY_IN_ANOTHER_LANGUAGE];
		$redirect = true;
	} else {
		$exists_on_another_language = true; //allow switch to english/russian
		$n = urldecode($name); //urldecode %D0%B7%D1%89%D1%86 -> зщц

		$content = '<p>' . $language_array[PAGE_NOT_FOUND] . ' ';
		$content .= "[$name].";
		if (preg_match("/^\\w+$/", $n)) {
			$r = getSimilarPages($n, $language, true);
			if (array_key_exists('name', $r)) {
				//valid
				$n = $r['name'];
				$l =  $r['language'];
				header("Location: ?$n,$l");
				exit;
			} elseif (array_key_exists('s', $r)) {
				$content .= " " . $language_array[SIMILAR_PAGES] . $r['s'];
			}
		}
	}
} else {
	$row = $result->fetch_assoc();
	$admin_only = $row['admin_only'];
	$i = $admin_only && !$admin;
	$title = $row['title'];
	if ($title === "") {
		$result = $mysqli->query("SELECT 1 FROM versions WHERE NAME ='$name' and LANGUAGE='$language' LIMIT 1") or die('error on line' . __LINE__ . $mysqli->error);
		if ($result->num_rows) {
			$title = $language_array[VERSION_HISTORY];
		}
	}
	$type = $row['type'];
	$content = $i ? ADMIN_ONLY_STRING : $row['content'];
	$menu = $i ? NULL : $row['menu'];
	$latex = $row['latex'];
	$save_button = $row['save_button'];
	$video = $row['video'];

	if (!is_null($row['script'])) {
		$script = array_merge($script, explode(' ', str_replace(SELF_SYMBOL, $name, $row['script'])));
	}

	if (!is_null($row['onload'])) {
		$onload = ' onload="' . $row['onload'] . '"';
	}

	if (!is_null($row['css'])) {
		$css = array_merge($css, explode(' ', str_replace(SELF_SYMBOL, $name, $row['css'])));
	}

	$videostr = videoString($video, $type, $language);
	if ($type == TYPE_PRESENTATION) {
		$script[] = 'presentation';
		$css[] = 'presentation';
	}

	if (!is_null($row['keywords'])) {
		$keywords = $row['keywords'];
	}

	if (!is_null($row['favicon'])) {
		$favicon = $row['favicon'];
	}

	$q = "INSERT INTO counters(name,language,date,counter,admin_counter) 
	VALUES ('$name','$language',CURDATE(),1,$admin) ON DUPLICATE KEY UPDATE counter=counter+1";
	if ($admin) {
		$q .= ',admin_counter=admin_counter+1';
	}
	$mysqli->query($q) or die('error on line' . __LINE__ . $mysqli->error);

	$ip = getIP(); //[ip,key,server]
	$j = $ip[2] == $ip[0] ? 'NULL' : $ip[2];
	//'key' is reserves mysql word so use 'skey'
	$mysqli->query("INSERT INTO ip(ip,date,counter,admin,skey,server) VALUES 
		('$ip[0]',CURDATE(),1,$admin,'$ip[1]','$j') ON DUPLICATE KEY UPDATE counter=counter+1")
		or die('error on line' . __LINE__ . $mysqli->error . "('$ip[0]',CURDATE(),1,$admin,'$ip[1]',[$j])" . var_export($_SERVER, 1));
}

//counters & ip tables are modified can do redirect now
$i = array_search($name, ['jm', 'j', 'jj']);
if ($i !== false) {
	$i = $i == 0 ? '' : '?j';
	header("Location: /php/jm.php");
	exit;
}

$has_menu = !is_null($menu);
if ($has_menu) {
	array_unshift($css, 'menu');
	array_push($script, 'menu');
}

$caption = '<table style="width:100%"><tr><td><h3 style="margin:3px 0 3px 0;">' . $title . $videostr . '</h3>';

if ($mobile_mode != MOBILE_MODE_OFFLINE) {
	$c = [];
	if ($LOCAL) {
		$c[] = "<a href='" . REMOTE . "?$name,$language' target='_blank'><img src='img/globe16.png'></a>";
	}
	if ($save_button) {
		$c[] = '<img src="img/save16.png" onclick="saveForOfflineMobileClick()">';
	}
	if ($admin_only) {
		$c[] = '<img src="img/admin_only16.png">';
	}
	if ($exists_on_another_language) {
		$o = substr($opposite_language, 0, 2);
		$c[] = '<a href="' . FILE . '?' . $name . ',' . $opposite_language . ($parameter == '' ? '' : ',' . $parameter) . '"><img src="img/' . $o . '.gif"> ' . $o . '</a>';
	}
	if (!empty($c)) {
		$caption .= '<td align="right">' . implode('&nbsp;&nbsp;', $c);
	}
}
$caption .= '</table>';

echo '<!DOCTYPE html><html><head><link rel="shortcut icon" href="favicon/' . $favicon . '.ico" /><meta http-equiv="Content-Type" content="text/html;charset=utf-8">' .
	(isset($keywords) ? '<meta name="keywords" content="' . $keywords . '">' : '') .
	make_tags($css, '<link rel="stylesheet" type="text/css" href="' . CSS_DIR, CSS_EXT . '">');

echo '<meta name="viewport" content="width=device-width, initial-scale=1" />';
if ($redirect) {
	echo "<meta http-equiv=\"refresh\" content=\"" . REDIRECT_SECONDS . ";url=?$name,$opposite_language\" />";
}

$pp = [
	'Language' => $language,
	'PageName' => $name,
	'Parameter' => $parameter,
	'Mobile' => $mobile,
	'MobileMode' => $mobile_mode,
	'Admin' => $admin,
	'PageType' => $type
];
if ($type == TYPE_PRESENTATION) {
	$pp['VideoStr'] = $videostr;
}
echo js_reduce($pp, fn($a, $v, $k, $ar, $i) => $a .  ($i ? ',' : '') . "g$k=" . wr($i, $v), '<script>let ');
// echo "<script>let gLanguage='$language',gPageName='$name',gParameter=`$parameter`,gMobile=$mobile,gMobileMode=$mobile_mode,gAdmin=$admin,gPageType=$type";
// if ($type == TYPE_PRESENTATION) {
// 	echo ",gVideoStr=`$videostr`";
// }

$menu_addon = '';
if ($has_menu) {
	$result = $mysqli->query("SELECT menu,addon,css FROM `menus` WHERE name='$menu' and language='$language'") or die('</script>error line' . __LINE__ . $mysqli->error);
	$row = $result->fetch_assoc();
	$menu_string = $row['menu'];
	$menu_addon = $row['addon'];
}
echo "</script>";

if ($latex) {
	echo '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"></script>';
}

$a = [
	TYPE_NORMAL => 'normal',
	TYPE_FULLSCREEN => 'fullscreen',
	TYPE_NOMENU => 'fullscreen',
	TYPE_PRESENTATION => 'presentation'
];


echo make_tags($script, '<script src="' . JS_DIR, JS_EXT . '"></script>') .
	'<title>' . $title . '</title>' . '</head>' .
	'<body' . $onload . ' class="' . $a[$type] . '">';
if ($type != TYPE_NOMENU && $type != TYPE_PRESENTATION) {
	echo '<img src="img/top.png" onclick="totop()" id="totop"><div class="' . ($type ? 'fullscreen' : 'main') . '">';

	//make top menu
	if ($mobile_mode != MOBILE_MODE_OFFLINE) {
		echo '<table class="topmenu"><tr><td><a href="?index"><img src="img/globe16.png" class="va"></a>';
		$i = $mobile ? "mobile_text" : "text";
		$result = $mysqli->query("SELECT name, $i as text FROM branches WHERE language='$language' ORDER BY number");
		while ($row = $result->fetch_assoc()) {
			echo '<td><a href="' . FILE . '?' . $row['name'] . '">' . $row['text'] . '</a>';
		}
		if (!$mobile) {
			echo '<td><a href="mailto:slovesnov@yandex.ru"><img src="img/mail16.png" class="va"></a>';
		}
		echo '</table>';
	}

	if ($has_menu) {
		echo make_menu($menu_string, $name, $mobile);
	}

	echo '<div class="content">' . $menu_addon . $caption;
}

echo $content;

$result = $mysqli->query("SELECT content,use_title,h3 FROM `versions` WHERE NAME ='$name' and LANGUAGE='$language'") or die('error on line' . __LINE__ . $mysqli->error);

if ($result->num_rows != 0) {
	$row = $result->fetch_array();
	if ($row['use_title']) {
		$i = $row['h3'] ? 'h3' : 'h4';
		echo '<' . $i . ' id="versions">' . $language_array[VERSION_HISTORY] . '</' . $i . '>';
	}
	$a = explode("\n", $row['content']);
	$prev_caption = $first = true;
	$i = -1;
	foreach ($a as $v) {
		$i++;
		if (trim($v) == '') { //skip empty line
			continue;
		}
		if ($v[0] == '<') { //pure syntax
			if ($i != 0) {
				echo '</div>';
			}
			echo $v;
			if ($i != 0) {
				echo '<div class="shift">';
			}
			continue;
		}
		//for extended words menu
		if (is_numeric($v[0]) && count($b = explode(" ", $v)) == 4) {
			if (!$first) {
				echo '</div>';
			}
			$first = false;
			echo '<h4>' . $language_array[VERSION] . ' ' . $b[0] . ' ' . $b[1] . ' ' . $month_names[$b[2] - 1] . ' ' . $b[3] . '</h4><div class="shift">';
			$prev_caption = true;
		} else {
			if (!$prev_caption) {
				echo '<br />';
			}
			echo $v;
			$prev_caption = false;
		}
	}
	echo '</div>';
}

if ($type != TYPE_NOMENU) {
	echo '</div></div>';
}
echo '</body></html>';

function make_tags($a, $begin, $end) {
	global $mobile_mode;
	$css = str_starts_with($end, CSS_EXT);
	if ($mobile_mode != MOBILE_MODE_OFFLINE) {
		if ($css) {
			return $begin . implode($end . $begin, $a) . $end;
		} else {
			return implode('', array_map(fn($e) => str_starts_with($e, 'http') ? '<script src="' . $e . '"></script>' : $begin . $e . $end, $a));
		}
	}
	$e = $css ? CSS_EXT : JS_EXT;
	$d = $css ? CSS_DIR : JS_DIR;
	$b = $css ? '<style>' : '<script>';
	foreach ($a as $v) {
		$c = file_get_contents($d . $v . $e) or die('cann\'t open file line:' . __LINE__);
		$b .= $c;
	}
	return $b . ($css ? '</style>' : '</script>');
}

function make_menu($menu, $pageName, $mobile) {
	$s = '<div class="menu"><ul class="menu">';
	$level = 0;
	foreach (explode("\n", $menu) as $v) {
		$v = trim($v);
		if ($v === '}') {
			$s .= '</ul></li>';
			$level--;
			continue;
		}
		$l = strlen($v);
		if ($l == 0) {
			die('error at line' . __LINE__);
		}
		if ($v[$l - 1] == '{') {
			$addlevel = true;
			$level++;
			$v = substr($v, 0, $l - 1);
		} else {
			$addlevel = false;
		}

		$raw = $v[0] == '@'; //raw item
		if ($raw) {
			$name = substr($v, 1);
		} else {
			$items = array_map('trim', explode("=", $v));

			$n = explode("^", $items[0]);
			$name = $n[(int)(count($n) == 2 && $mobile)];
			if (strlen($name) == 0) {
				die('Error empty string found in menu line' . __LINE__);
			}
			//mobile has no over event so skip reference if has for top item
			$ref = count($items) == 1 || $mobile && $addlevel ? '#' : $items[1];

			/*correct reference on same page (if menu is used on many pages
				$ref="?bridge#language" & $pageName="bridge" => $ref="#language"
				$ref="?bridge" & $pageName="bridge" => $ref="#"
			*/
			$refpn = '?' . $pageName;
			$i = strpos($ref, '#');
			if ($i === false) {
				if ($ref == $refpn) {
					$ref = '#';
				}
			} else {
				if (substr($ref, 0, $i) == $refpn) {
					$ref = substr($ref, $i);
				}
			}
		}
		$s .= '<li';
		if ($addlevel) {
			$s .= ' class="marrow"';
		}
		$s .= " onmouseover='menuAdjust(this,$level)'><table><tr><td>";
		if ($raw) {
			$s .= $name;
		} else {
			$s .= '<a href="' . $ref . '"';
			if ($name == 'home.png') {
				$name = '<img src="/img/home.png">';
				$s .= ' class="mhome"';
			}
			$s .= '>' . $name . '</a>';
		}
		if ($addlevel) {
			$s .= '<td>' . ($level == 1 ? '▼' : '▶') . '</td>';
		}
		$s .= '</table>';
		$s .= ($addlevel ? '<ul class="mchild">' : '</li>');
	}
	return $s . '</ul><br style="clear: left" /></div>';
}

function getIP() {
	foreach (['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'] as $k) {
		if (array_key_exists($k, $_SERVER) === true) {
			$s = $_SERVER[$k];
			foreach (explode(',', $s) as $ip) {
				if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
					return [$ip, $k, $s];
				}
			}
		}
	}
	return ['unknown', 'unknown', 'unknown'];
}

function wr($i, $s) {
	if ($i < 2) {
		$w = '\'';
	} elseif ($i == 2 || $i == 7) {
		$w = '`';
	} else {
		$w = '';
	}
	return "$w$s$w";
}
