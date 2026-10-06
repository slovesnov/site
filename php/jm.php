<?php
/*this file is used for journal & money
see help & call options in jm.js

code analizer
https://www.piliapp.com/php-syntax-check/
*/

const LOGOUT = 'logout';
const CATEGORY = 'category';
const SQL_YYYY_MM = '%Y-%m'; //2018-02;
define("UNKNOWN", '?');
define("SY", "() *<>");
define("echar", chr(1));
define("NULL_STRING", '');

header("Expires: Thu, 01 Jan 1970 00:00:01 GMT"); //always expire

include("../config.php");
include("jmCommon.php");

$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_LOGIN, DB_PASS);
connect();

if (isset($_POST['user'])) {
	$jm_user = $mysqli->real_escape_string($_POST['user']);
	$jm_pwd = $_POST['password'];
	//$_POST['rememberme'] - not used
	if (isset($_POST['email'])) { //sign up
		$email = $_POST['email'];
		setCookies();
		$i = createUser($jm_user, $jm_pwd, $email);
		if ($i === true) {
			die('OK');
		} elseif ($i == 1062) {
			die('user already exists please select another login');
		} else {
			die('error on line' . __LINE__ . $mysqli->error);
		}
	} else { //login
		if (checkUserPassword($jm_user, $jm_pwd)) {
			setCookies();
			die('OK');
		} else {
			die('error invalid login and/or password');
		}
	}
}

$pieces = explode(',', $_SERVER['QUERY_STRING']);
$s=$pieces[0];
if (count($pieces) < 2 || $pieces[1] == '') { //no language set, check cookie
	$language = isset($_COOKIE['language']) ? $_COOKIE['language'] : 'english';
} else {
	$language =str_starts_with('russian',$pieces[1])?'russian':'english';
}
setcookie('language', $language, time() + 3600 * 24 * 30, '/'); //30 days expire

if ($s == LOGOUT) {
	$jm_user = '';
	$jm_pwd = '';
	unset($_COOKIE[JM_USER_COOKIE]);
	unset($_COOKIE[JM_PWD_COOKIE]);
	setcookie(JM_USER_COOKIE, '', time() - 3600, '/'); // empty value and old timestamp
	setcookie(JM_PWD_COOKIE, '', time() - 3600, '/'); // empty value and old timestamp
}

if ($s == 'checkgoodsincomments') {
	checkGoodsInComments();
	exit;
}

$login = $ALWAYS_ADMIN;
if (isset($_COOKIE[JM_USER_COOKIE]) && isset($_COOKIE[JM_PWD_COOKIE])) {
	$jm_user = $_COOKIE[JM_USER_COOKIE];
	$jm_pwd = $_COOKIE[JM_PWD_COOKIE];
	if (checkUserPassword($jm_user, $jm_pwd)) {
		$login = 1;
	}
	if (isJmValidUser()) { //after login as if login/password isn't stored
		$login = 1;
	}
}

if ($login) {
	$admin = $jm_user == JM_SUPERUSER ? 2 : 1;
	//if isset($_POST['loginas']) then not update table, needs only real user logins
	$mysqli->query("UPDATE users SET lastlogin=NOW() WHERE user='$jm_user'") or die('error on line' . __LINE__ . $mysqli->error);
} else {
	$jm_user = JM_SUPERUSER;
	$admin = 0;
}

if (isset($_POST['deleteusers'])) {
	if ($admin != 2) {
		exit;
	}
	foreach ($_POST as $k => $v) {
		if ($k != 'deleteusers') {
			removeUser($k);
		}
	}
	echo 'end';
	exit;
}

if (isset($_POST['loginas'])) {
	if ($admin != 2) {
		exit;
	}
	$jm_user = $_POST['loginas'];
}

$jm_table = "_" . $jm_user;

if ($admin) { //ONLY if $admin!=0
	setCookies();
}

const FILES = ['jm.php', '../scripts/jm.js', '../css/jm.css', 'jmCommon.php'];
/*added goods_viewedit_foodonly
old gType in js ['goods_viewedit','categories_statistics','categories_viewedit','addons_viewedit'];
*/
const AVIEWEDIT = ['goods_viewedit', 'goods_viewedit_foodonly', 'categories_statistics', 'categories_viewedit', 'addons_viewedit'];

$FOOD = [];
$ROUND = [];
$CATEGORIES = [];
$result = $mysqli->query("SELECT name,round,food FROM `money_categories$jm_table`") or die('error on line' . __LINE__ . $mysqli->error);
while ($row = $result->fetch_assoc()) {
	$n = $row['name'];
	if ($row['food']) {
		$FOOD[] = $n;
	}
	$CATEGORIES[] = $n;
	$ROUND[$n] = $row['round'];
}
$FOODS = to_string($FOOD);

$ADDONS = readAddons($jm_user);
//67.8 61.1 55.2 46.2 37.2
$eggMass = explode(" ", $ADDONS['egg_purified_mass_grams_by_category']);

if ($admin == 2) {
	$USERS = [];
	$j = JM_SUPERUSER;
	$result = $mysqli->query("SELECT user FROM users WHERE user!='$j'") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_array()) {
		$USERS[] = $row[0];
	}
}

const DEFAULT_FOOD = 1;
$DEFAULTCATEGORY = ["", 0, DEFAULT_FOOD, ""];

if (isset($_POST['command'])) {
	if (!$admin) {
		exit;
	}

	$command = $_POST['command'];

	// var_dump($_POST);
	if (isset($_POST['table'])) {
		$pt = $_POST['table'];
	}

	if (isset($_POST['table']) && $pt != 'journal' && $pt != 'money') {
		$a = [];
		foreach ($_POST as $k => $v) {
			// echo "$k : $v\n";
			if (is_numeric($k)) {
				$as = 0;
				if (str_starts_with(AVIEWEDIT[$pt], 'goods_viewedit')) {
					if ($k == 7) { //kkal/100g
						continue;
					}
					if (($k > 0 && $k <= 3 || $k == 8) && $v == NULL_STRING) {
						$as = 1;
						$a[] = 'NULL';
					}
				}
				if (!$as) {
					$a[] = wrapQuotes($mysqli->real_escape_string($v));
				}
			} else if ($k === 'table') {
				$s = AVIEWEDIT[$v];
				$i = strpos($s, '_');
				$t = "money_" . substr($s, 0, $i);
			}
		}

		$ta = $t . $jm_table;
		if ($command == 'insert') {
			$b = implode(",", $a);
			$q = "INSERT INTO $ta VALUES ($b)";
		} elseif ($command == 'update' || $command == 'delete') {
			if ($command == 'update') {
				if ($t == 'money_addons' && $_POST[0] == 'start_date') {
					if ($_POST[1] > getMinCheckDate()) {
						die(jsError('The starting date must be no later than the earliest check.'));
					}
				}
				$c = getTableColumns($ta);
				$q = "UPDATE $ta SET ";
				for ($i = 0; $i < count($c); $i++) {
					if ($i != 0) {
						$q .= ",";
					}
					$q .= "`$c[$i]`=$a[$i]";
				}
			} else {
				$q = "DELETE FROM $ta";
			}
			$n = $t == 'money_addons' ? 'parameter' : 'name';
			$q .= " WHERE $n=" . wrapQuotes($mysqli->real_escape_string($_POST['where']));
		} else {
			echo "unknown command[$command]";
			exit;
		}

		$r = $mysqli->query($q);
		if (!$r) {
			if ($mysqli->errno == 1451 && $t == 'money_categories') {
				//cann't load full check table, so cann't make full checking in js file, so leave this error
				die(jsError('It is impossible to delete/modify a category while one of the checks contains it.'));
			} else {
				die('error on line' . __LINE__ . $mysqli->error . $mysqli->errno . " " . $t . " " . $q);
			}
		}

		echo 'OK' . $mysqli->affected_rows;
		exit;
	}

	$text = wrapQuotes($mysqli->real_escape_string($_POST['text']));
	//die($text);
	$id = $_POST['id'];
	$journal = $_POST['table'] == 'journal';

	if ($journal) {
		$id1 = $_POST['id1'];
		$jt = "journal$jm_table";
		if ($command == 'insert') {
			$mysqli->query("INSERT INTO $jt (id,text) SELECT IFNULL( (SELECT MAX(id)+1 from $jt) ,0),$text");
		} elseif ($command == 'update') {
			$mysqli->query("UPDATE $jt SET text=$text WHERE id=$id");
		} elseif ($command == 'delete') {
			$mysqli->query("DELETE FROM $jt WHERE id=$id");
		} elseif ($command == 'down' || $command == 'up') {
			swapIds($id, $id1, true);
		} elseif ($command == 'down2' || $command == 'up2') {
			//UPDATE journal AS s, (SELECT MAX(id)+1 AS m FROM journal) AS p SET s.id = m WHERE s.id = 2
			$s = $command == 'down2' ? 'MIN(id)-1' : 'MAX(id)+1';
			$mysqli->query("UPDATE $jt AS s, (SELECT $s AS m FROM $jt) AS p SET s.id=m WHERE s.id=$id");
		} else {
			echo 'unknown command';
			exit;
		}
	} else { //money
		$date = wrapQuotes($_POST['date']);
		$t = $_POST[CATEGORY];
		$type = wrapQuotes($mysqli->real_escape_string($t));
		$c = CATEGORY;

		if ($command == 'insert' || $command == 'update') {
			//check $date, if earlier than start_date in money_addons then change
			if (wrapQuotes($ADDONS['start_date']) > $date) { //$date in quotes
				//die("UPDATE money_addons$jm_table SET value=$date WHERE parameter='start_date'");
				$mysqli->query("UPDATE money_addons$jm_table SET value=$date WHERE parameter='start_date'") or die('error on line' . __LINE__ . $mysqli->error);
			}
		}

		if ($bb = !in_array($t, $CATEGORIES)) {
			//insert new category
			$b = [];
			for ($i = 0; $i < count($DEFAULTCATEGORY); $i++) {
				$j = $i == 0 ? $t : $DEFAULTCATEGORY[$i];
				$b[] = wrapQuotes($mysqli->real_escape_string($j));
			}
			$a = implode(",", $b);

			$mysqli->query("INSERT INTO money_categories$jm_table VALUES ($a)") or die('error on line' . __LINE__ . $mysqli->error);
		}

		$parse = ($command == 'insert' || $command == 'update')	&& in_array($t, $FOOD) || ($bb && DEFAULT_FOOD);
		$t = "money" . $jm_table;
		if ($command == 'insert') {
			$mysqli->query("INSERT INTO $t (date,text,$c) VALUES ($date,$text,$type)");
		} elseif ($command == 'update') {
			$mysqli->query("UPDATE $t SET date=$date, text=$text, $c=$type WHERE id=$id");
		} elseif ($command == 'delete') {
			$mysqli->query("DELETE FROM $t WHERE id=$id");
		} else {
			echo 'unknown command';
			exit;
		}
	}
	if ($mysqli->error != '') {
		die('error on line' . __LINE__ . $mysqli->error);
	}
	//for move down, up anyway 1 rows affected because use three queries
	if ($mysqli->affected_rows === 1) {
		echo 'OK';
		if ($command == 'insert' && !$journal) {
			$result = $mysqli->query("SELECT LAST_INSERT_ID()"); //not always max value from table money
			if ($mysqli->error != '') {
				die('error on line' . __LINE__ . $mysqli->error);
			}
			$row = $result->fetch_array();
			echo $row[0];
		}
		if ($parse) {
			$goods = loadGoods();

			$e = [];
			foreach (getFullTextForParse($_POST['text']) as $a) {
				$r = parseMassPriceFull($a, $goods);
				if ($r['e']) {
					$e[] = $r['string'];
				}
			}
			if (!empty($e)) {
				//first space needs for js parsing
				echo " " . implode("<br>", $e);
			}
		}
	} else {
		echo 'error affected_rows';
	}
	exit;
}

if (isset($_POST['search'])) { //money find
	echoBegin('money', 0, false);
	echo "gn=['N','text','roubles','/','kg or liter','roubles','/','1000 kilocalories','date','category','identifier'];";
	echo "</script>";
	echo "</head><body onload='searchload()'><p id='p'></p><table id='mf' class='nb c'><thead></thead><tbody>";

	$wholeWord = isset($_POST["whole_word"]);
	$caseSensitive = false; //isset($_POST["case_sensitive"]);
	//$sa=array_map("trim",explode("\\",$_POST["search"]));
	$m = function ($e) {
		global $wholeWord;
		$t = trim($e);
		if ($wholeWord) {
			$t = "\b$t\b";
		}
		return $t;
	};
	$re = implode("|", array_map($m, explode("\\", $_POST["search"])));
	$re = "/$re/u";
	if (!$caseSensitive) {
		$re .= "i";
	}

	$goods = loadGoods();
	$c = CATEGORY;
	$result = $mysqli->query("SELECT date,text,$c,id FROM money$jm_table ORDER BY date DESC") or die('error on line' . __LINE__ . $mysqli->error);

	$i = 1;
	while ($row = $result->fetch_array()) {
		//find all text with comment
		$pieces = explode("\n", getCommentText(atProceed($row['text']), true));
		$j = 0;
		foreach ($pieces as $a) {
			if (preg_match($re, $a)) {
				$r = parseMassPriceFull($a, $goods);
				$b = $r['string'];
				$pricePerKgLiterS = $r['pricePerKgLiterS'];
				$pricePer1000kcalS = $r['pricePer1000kcalS'];

				if ($r['ct0']) {
					$pricePer1000kcal = "+&infin;";
				} else {
					$pricePer1000kcal = sfs(meval($pricePer1000kcalS));
				}
				$pricePerKgLiter = sfs(meval($pricePerKgLiterS));

				echo "<tr><td>$i<td>$b<td>$pricePerKgLiter<td>=<td>$pricePerKgLiterS<td>$pricePer1000kcal<td>=<td>$pricePer1000kcalS<td>$row[0]<td>$row[2]";
				echo "<td><a href='#' onclick='clickID($row[3]);'>$row[3]</a>";
				$i++;
			}
			$j++;
		}
	}
	echo '</tbody></table>';
	echoEnd();
	exit;
}

if (in_array($s, FILES)) {
	$i = tag2text(file_get_contents($s));
	echoBegin('money');
	echo "</head><pre>$i</pre></body></html>";
	exit;
}

if (isset($_POST['dump_format'])) {
	$f = $_POST['dump_format'];
	$r = [];
	$csv = $f == 'csv';
	if (!$csv) {
		$file = getSqlFileContent($jm_user, 0);
		echo $file[0];
	}

	foreach ($_POST as $k => $v) {
		if ($k == 'dump_format') {
			continue;
		}
		if ($k == 'money') {
			$o = " ORDER BY date DESC,id DESC";
		} else {
			$o = "";
			if ($k == 'live_journal') {
				$k = 'journal';
			} else {
				$k = "money_" . $k;
			}
		}

		$r[] = ['table' => $k];

		$a = [];
		$t = "$k$jm_table";
		if ($csv) {
			$res = $mysqli->query("SELECT * FROM $t $o") or die('error on line' . __LINE__ . $mysqli->error);
			while ($row = $res->fetch_assoc()) {
				$a[] = $row;
			}
		} else {
			echo dumpTableData($t, $o);
		}
		$r[] = $a;
	}
	if ($csv) {
		echo json_encode($r);
	} else {
		echo $file[1];
	}
	exit;
}

if (isset($_POST['ma'])) { //consumtion moving average
	echoBegin('money', 1, false);
	$x = ['name1', 'name0', 'name'];
	$goods = loadGoods();
	$p = $_POST['ma'];
	$from = new DateTime($ADDONS['start_date']);
	$t = new DateTime();
	$as = $t->diff($from)->format('%a') - $p + 1;

	/*
	a={$START_DATE, $START_DATE+1, .... now}
	q=$t->diff($from)->format('%a')
	if(q=0) count(a)=1
	count(a)=q+1, max index of a = q
	
	if($p==2){
		d[0]=a[1]
	}
	if($p==3){
		d[1]=a[2]
	}
	d[i]=a[p-1+i] or a[i]=d[i-p+1]
	
	a[q]=d[q-(p-1)]
	
	$as=q-(p-1)
	
	$from=$START_DATE changes on a[0...p-1]
	$from=$START_DATE+1 changes on a[1..p]
	...
	$from=$START_DATE+i changes on a[i..i+p-1] = d[i-p+1...i]
	i=$t->diff($from)->format('%a')
	*/

	loadGoodsData($goods, 2);
	$d = [];

	foreach ($goods as $v) {
		if (!$v['food']) {
			continue;
		}

		$name = $v['alias'];
		if ($name == null) {
			$a = $v;
		} else {
			$a = $goods[$name];
		}
		foreach ($x as $f) {
			if (($name = $a[$f]) != null) {
				break;
			}
		}

		$a = $v['a'];
		if (!array_key_exists($name, $d)) {
			$d[$name] = array_fill(0, $as, 0);
		}
		for ($i = 0; $i < count($a); $i += 2) {
			$g = $a[$i] * 1000; //grams
			$t = new DateTime($a[$i + 1]);
			$di = $t->diff($from)->format('%a');

			/*
			$di+$j-$p+1>=0
			$j>=$p-1-$di & j>=0
			
			$di+$j-$p+1<$as
			$j<$as+$p-1-$di & $j<$p
			max(0,$p-1-$di)
			*/
			$j = max($p - 1 - $di, 0);
			$k = $di + $j - $p + 1;
			for (; $j < min($as + $p - 1 - $di, $p); $j++, $k++) {
				$d[$name][$k] += $g;
			}
		}
	}

	echo "gMAPeriod=$p;gz=[";
	$f = 1;
	foreach ($d as $n => $b) {
		if ($f) {
			$f = 0;
		} else {
			echo (',');
		}
		echo '[' . wrapQuotes($n);
		foreach ($b as $a) {
			echo ',' . round($a / $p, 3);
		}
		echo ']';
	}
	echo ']';
	echo '</script>';
	echo "</head><body onload='maload()'><p id='p'></p><table class='c' id='t'></table>";

	echoEnd();
	exit;
}

if ($s == 'charts_and_prices_of_goods') {
	$goods = loadGoods();
	loadGoodsData($goods, 0, 1);
	echoBegin('money', 1, false);
	echo "gd=[";
	$f = 1;
	foreach ($goods as $v) {
		if (!$v['food']) {
			continue;
		}
		if ($f) {
			$f = 0;
		} else {
			echo ',';
		}
		$a = $v['name0'];
		if (is_null($a)) {
			$a = $v['name'];
		}
		echo wrapQuotes($a);
		$a = $v['a'];
		for ($i = 0; $i < count($a); $i++) {
			$b = $a[$i];
			if (is_numeric($b)) {
				if ($b == INF) {
					$b = "Infinity"; //JavaScript infinity
				}
			} else {
				$b = wrapQuotes($b);
			}
			echo ',' . $b;
		}
	}
	echo "];";
	echo "</script></head><body onload='gload()'>";

	echo "<p id='notes'>";
	for ($i = 0; $i < 4; $i++) {
		echo "<p><table class='ms c' id='gt$i'><thead></thead></table>";
	}
	echoEnd();
	exit;
}

$cs = isset($_POST['dateFrom']);
$quantity = isset($_POST['foodQuantity']);
$parseid = isset($_POST['id']) && isset($_POST['parseid']);

if ($quantity || $cs || $parseid) { //$cs (calorie statistics) - output errors&statistics
	//$starttime = microtime(true);

	$goods = loadGoods();
	$c = CATEGORY;

	if ($parseid) {
		$all = true;
		//set number of weeks = number of checks
		$df = new DateTime();
		$i = preg_match_all('/\s+/', trim($_POST['id'])) + 1;
		$df->modify("-$i week");
		$dt = new DateTime();
		$condition = getIN(); //id can be any
		$limit = "";
	} else {
		$all = $quantity || !isset($_POST["show_errors_only"]);
		$limit = $quantity ? 'LIMIT ' . $_POST['foodQuantity'] : '';
		$condition = "id>0";
		if ($quantity) {
			$df = $dt = null; //set below
		} else {
			$df = $_POST['dateFrom'];
			$dt = $_POST['dateTo'];
			$condition .= " AND date BETWEEN '$df' AND '$dt'";
		}
	}
	$result = $mysqli->query("SELECT date,text,$c,id FROM money$jm_table WHERE $condition and $c IN ($FOODS) ORDER BY date DESC,id DESC $limit") or die('error on line' . __LINE__ . $mysqli->error);

	$rows = [0, 0, 0]; //good, bad, skipped
	$rn = 1;
	$keysa = ['N', 'text', 'calorie', CATEGORY, 'totalK', 'rkc', 'date', 'identifier'];
	$keys = ['name', 'c', 'mass', 'massPure', 'grday', 'protein', 'fat', 'carbohydrate', 'calorie', 'b12', 'comment'];
	foreach (['kilocalories', 'mass', 'massPure', 'protein', 'fat', 'carbohydrate', 'b12'] as $b) {
		$total[$b] = 0;
	}

	echoBegin('money', 0, false);
	echo "gd=[[";

	$hasAllTable = 0;
	while ($row = $result->fetch_array()) {
		if ($quantity) {
			$d = $row['date'];
			if ($df === null || $df > $d) {
				$df = $d;
			}
			if ($dt === null || $dt < $d) {
				$dt = $d;
			}
		}
		foreach (getFullTextForParse(atProceed($row['text'])) as $a) {
			$r = parseMassPriceFull($a, $goods, $total);
			if ($r === -1) {
				$rows[2]++;
				continue; //no output
			}
			$e = $r['e'];
			$rows[$e]++;
			if ($e || $all) {
				$z = [
					$rn,
					$r['string'],
					$r['calorie'],
					$row[2],
					$r['totalCaloriesS'],
					$r['pricePer1000kcalS'],
					$row[0],
					$row[3]
				];
				$rn++;
				foreach ($z as $i) {
					if (!is_numeric($i) && is_string($i)) {
						$i = str_replace('"', '\\"', $i);
						$i = wrapQuotes($i);
					}
					echo ($hasAllTable ? ',' : '') . $i;
					$hasAllTable = 1;
				}
			}
		}
	}

	if ($cs || $quantity) {
		$df = new DateTime($df);
		$dt = new DateTime($dt);
	}

	$i = 'Y-m-d';
	$df1 = wrapQuotes($df->format($i)); //used below	gR=
	$dt1 = wrapQuotes($dt->format($i)); //used below gR=
	if ($quantity) { //used below
		$condition .= " AND date BETWEEN $df1 AND $dt1";
	}
	$days = $df->diff($dt)->days; //used below in foreach($goods as $g) cycle and later
	if ($days == 0) {
		$days = 1;
	}
	$years = number_format($days / 365.25, 2, '.', ' ');

	echo "]";
	for ($n = 0; $n < 2; $n++) {
		echo ",[";
		$hasTable = 0;
		if ($n == 1) { //add to aliases
			foreach ($goods as $g) {
				$b = $g['alias'];
				if (!is_null($b)) {
					$goods[$b]['c'] += $g['c'];
					$c = &$goods[$b]['buy'];
					$a = $g['buy'];
					foreach ($a as $k => $v) {
						if (!array_key_exists($k, $c)) {
							$c[$k] = 0;
						}
						$c[$k] += $v;
					}
				}
			}
			unset($c); //$c use below so unset reference
		}

		foreach ($goods as $g) {
			if ($n == 1 && !is_null($g['alias'])) {
				continue;
			}
			$s = "";
			$a = $g['buy'];
			foreach ($a as $k => $v) {
				if (!empty($s)) {
					$s .= "+";
				}
				$s .= "$k";
				if ($v != 1) {
					$s .= "*$v";
				}

				if (count($a) == 1 && ($k == 1 || $v == 1)) {
					$s = meval($s);
				}
			}
			if ($s == '') {
				$s = 0;
			}
			$g['mass'] = $s; //mass as string 0.1*5

			$b = getMLD($g);
			$mass = meval($s);
			$mb = "$mass$b";
			$g['massPure'] = "$mb";
			$massPure = meval("$mb");

			//0=='?' is true
			$g['grday'] = $massPure === UNKNOWN ? UNKNOWN : sfs($massPure / $days * 1000);

			//cann't iterate over $g some values don't need ex $g['buy']
			foreach ($keys as $c) {
				if ($c == 'name') {
					for ($i = $n; $i >= 0; $i--) {
						if (!is_null($g["name$i"])) {
							$c = "name$i";
							break;
						}
					}
				}
				$i = $g[$c];
				if (is_null($i)) { //empty comment
					$i = '';
				}
				if (!is_numeric($i) && is_string($i)) {
					$i = str_replace(["\r\n", "\r", "\n"], "<br>", $i); //comment 
					$i = str_replace('"', '\\"', $i);
					$i = wrapQuotes($i);
				}
				echo ($hasTable ? ',' : '') . $i;
				$hasTable = 1;
			}
		}
		echo "]";
	}
	echo "];";
	echo "gk=[['" . implode("','", $keysa) . "']";
	for ($i = 0; $i < 2; $i++) {
		echo ",['" . implode("','", $keys) . "']";
	}
	echo "];";
	$result = $mysqli->query("SELECT count(*) as c FROM money$jm_table WHERE $condition") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $result->fetch_assoc();

	$v1 = round(countFoodSum($condition), 2);

	echo "gDays=$days;gR=[$rows[0],$rows[2],$rows[1]," . $row['c'] . ",$df1,$dt1";
	foreach (['kilocalories', 'mass', 'massPure', 'protein', 'fat', 'carbohydrate', 'b12'] as $b) {
		echo "," . sfs($total[$b]);
	}
	echo ",$v1]";
	echo "</script>";

	echo '</head><body onload="cload()">';
	if ($hasAllTable) {
		echo "<table id='goods0' class='nb c'><thead></thead></table>";
	}
	//$timediff = round(microtime(true) - $starttime,2);
	echo "<p id='p0'><p id='p1'></p><table class='ms c' id='ta'><thead></thead><tbody></tbody></table>";

	for ($i = 0; $i < 2; $i++) {
		$j = $i + 1;
		echo "<p id='s$i'></p><table class='ms c' id='goods$j' style='margin-top:10px'><thead></thead></table>";
	}

	echoEnd();
	exit;
}

if (($t = array_search($s, AVIEWEDIT)) !== false) {
	define('CTN', 0); //Note const doesn't work here
	echoBegin('money', 0, false);

	$z = [];
	if (CTN) {
		$z[] = 'N';
	}
	$c = CATEGORY;
	$query = "SELECT name,name0,name1,alias,protein,fat,carbohydrate,`mass loss`,density,b12,fiber,food,`has check`,`animal protein`,`saturated fat`,comment FROM `money_goods$jm_table`";
	$a = [
		$query,
		$query . " WHERE food=1",
		"SELECT $c, count(*) as 'check count' FROM `money$jm_table` GROUP BY $c ORDER BY 'check count' DESC",
		"SELECT name,round,food,`empty text` FROM `money_categories$jm_table` ORDER BY name",
		"SELECT parameter,value FROM `money_addons$jm_table`"
	];
	$res = $mysqli->query($a[$t]) or die('error on line' . __LINE__ . $mysqli->error);
	while ($p = $res->fetch_field()) {
		$a = $p->name;
		$z[] = $a;
		if ($p->name == 'carbohydrate') {
			$z[] = 'kc/100g';
		}
	}
	echo 'gn=[["' . implode('","', $z) . '"]],gd=[[';
	$n = $res->field_count;
	$rows = 0;
	$f = 1;
	while ($row = $res->fetch_array()) {
		if (!$f) {
			echo ",";
		}
		echo "[";
		$f = 0;

		$z = [];
		$rows++;
		if (CTN) {
			$z[] = $rows;
		}
		for ($i = 0; $i < $n; $i++) {
			$j = $row[$i];
			if (is_null($j)) {
				$j = NULL_STRING;
			}
			if (!is_numeric($j) && is_string($j)) {
				$j = str_replace("\\", "\\\\", $j);
				$j = str_replace('"', '\\"', $j);
				$j = str_replace(["\r\n", "\n"], "\\n", $j);
				$j = wrapQuotes($j);
			}
			$z[] = $j;
			if ($res->fetch_field_direct($i)->name == 'carbohydrate') {
				$z[] = $row['fat'] * 9 + ($row['protein'] + $row['carbohydrate']) * 4;
			}
		}
		echo implode(',', $z);
		echo "]";
	}
	echo "]];";
	echo "</script>";
	$b = str_starts_with($s, 'goods_viewedit');
	$i = $b ? ' tc' : '';
	$u = $language == 'russian' ? 'логин' : 'login';
	$j = $b ? " <span id='sfilter'></span><span style='margin-left:20px'>$u: $jm_user</span><p id='ctout'></p>" : '';
	echo "<body onload='ctload($t)'><span id='pt'></span> <span id='rows'></span>$j
	<p><table class='ms c$i' id='t0'><thead></thead><tbody></tbody></table><p id='p0' style='text-align: justify;max-width:500px'></p>";
	echoEnd();
	exit;
}

if ($s == 'money_statistics') {
	echoBegin('money', 1, false);
	//echo "<pre>";

	$type = [];
	$c = CATEGORY;
	$result = $mysqli->query("SELECT $c AS t FROM money$jm_table GROUP BY t ORDER BY t");
	while ($row = $result->fetch_row()) {
		$type[] = $row[0];
	}

	$mo = function ($pd, $t, $tc, $f, $fc, $sum, $sumc, $sum1) {
		$a = [wrapQuotes($pd)];
		array_unshift($sum, $t, $f);
		array_unshift($sumc, $tc, $fc);
		array_unshift($sum1, 0, 0);
		for ($i = 0; $i < count($sum); $i++) {
			$s = round($sum[$i], 1) . " (" . $sumc[$i] . ")";
			$t = $sum1[$i];
			if ($t) {
				$s .= " " . round($t, 1);
			}
			array_push($a, wrapQuotes($s));
		}
		return $a;
	};

	$pd = '';
	$s0 = '';
	$df = fd('date');
	$dfmne = $df . "<>" . fd('NOW()');

	$v = [];
	$result = $mysqli->query("SELECT text,$df as date,$c FROM money$jm_table ORDER BY date DESC") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_assoc()) {
		$t = $row[$c];
		$d = $row['date'];
		$s12 = countSum12($row, false);
		$sum = roundSum($row, $s12[0]);
		$sum1 = $s12[1];
		$o = ['count' => 1, 'sum' => $sum, 'sum1' => $sum1];
		if (array_key_exists($d, $v)) {
			$a = &$v[$d];
			if (array_key_exists($t, $a)) {
				$b = &$a[$t];
				$b['count']++;
				$b['sum'] += $sum;
				$b['sum1'] += $sum1;
				unset($b);
			} else {
				$a[$t] = $o;
			}
			unset($a);
		} else {
			$v[$d] = [$t => $o];
		}
	}

	$at = [];
	//$at1=[];
	$category = [];
	$cmy = date('Y-m'); //2018-02, should match with SQL_YYYY_MM
	$result = $mysqli->query("SELECT name FROM money_categories$jm_table") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_assoc()) {
		$c = $row['name'];
		$category[] = $c;
		$at[$c] = 0;
		//$at1[$c]=0;
	}

	$sum = [];
	$sum1 = [];
	$sumc = [];
	$t = $f = $tt = $tt1 = $tc = $fc = 0;

	foreach ($v as $d => $aa) {
		foreach ($aa as $ty => $b) {
			if ($d != $cmy) {
				$i = $b['sum'];
				$tt += $i;
				$at[$ty] += $i;

				// $i=$b['sum1'];
				// $tt1+=$i;
				// $at1[$ty]+=$i;
			}

			if ($d != $pd) {
				if ($pd != '') {
					appendArray($s0, $mo($pd, $t, $tc, $f, $fc, $sum, $sumc, $sum1));
				}
				$pd = $d;
				$sum = array_fill(0, count($type), 0);
				$sumc = array_fill(0, count($type), 0);
				$sum1 = array_fill(0, count($type), 0);
				$t = $f = $tc = $fc = 0;
			}
			$i = array_search($ty, $type);
			$j = $b['sum'];
			$c = $b['count'];
			$sum[$i] = $j;
			$sumc[$i] = $c;
			$t += $j;
			$tc += $c;
			if (in_array($ty, $FOOD)) {
				$f += $j;
				$fc += $c;
			}

			$j = $b['sum1'];
			$sum1[$i] = $j;
		}
	}
	appendArray($s0, $mo($pd, $t, $tc, $f, $fc, $sum, $sumc, $sum1));

	$r = $mysqli->query("SELECT count(*) FROM (SELECT 1 FROM money$jm_table WHERE $dfmne GROUP BY $df ) AS z") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $r->fetch_row();
	$num = $row[0]; //number of month without current

	$a = fd('MIN(date)');
	$b = fd('MAX(date)');
	$r = $mysqli->query("SELECT $a,$b FROM money$jm_table WHERE $dfmne") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $r->fetch_row();
	echo "gP=[$num" . ',' . wrapQuotes($row[0]) . ',' . wrapQuotes($row[1]) . '];';


	$s1 = '';
	$v = $tt;
	appendArray($s1, [wrapQuotes('total'), round($v, 1), $num == 0 ? 0 : round($v / $num, 1), 100]);

	$v = 0;
	foreach ($FOOD as $c) {
		$v += $at[$c];
	}
	$v1 = countFoodSum("id>0 AND $dfmne");
	$b = ['food categories', 'not food categories', 'only food', 'all except food'];
	for ($i = 0; $i < count($b); $i++) {
		$a = $i < 2 ? $v : $v1;
		if ($i % 2) {
			$a = $tt - $a;
		}
		appendArray($s1, [wrapQuotes($b[$i]), round($a, 1), $num == 0 ? 0 : round($a / $num, 1), $tt == 0 ? 0 : round($a * 100 / $tt, 1)]);
	}

	$s2 = '';
	foreach ($category as $j) {
		$k = $at[$j];
		appendArray($s2, [wrapQuotes($j), $k, $num == 0 ? 0 : round($k / $num, 1)]);
	}

	//cann't use appendArray because of quotes
	array_unshift($type, 'date', 'total (checks)', 'food');
	$i = "'" . implode("','", $type) . "'";

	echo "gn=[[$i],['options','total','average/month','% of total'],['category','total','average/month']];gd=[[$s0],[$s1],[$s2]]";
	echo '</script>';
	echo "<body onload='ctload(gMS_TYPE)'>";
	echo "<p id='pb'></p>";
	echo "<table class='ms c tc' id='t0'><thead></thead><tbody></tbody></table>";
	echo "<p id='p0'></p>";

	echo "<table><tr>";
	for ($i = 1; $i < 3; $i++) {
		echo "<td valign=top><p id='p$i'></p>";
		echo "<table class='ms c' id='t$i'><thead></thead><tbody></tbody></table>";
	}
	echo "</table>";
	echoEnd();
	exit;
}

if (isset($_POST['equivalent'])) {
	$goods = loadGoods();
	loadGoodsData($goods, 3, true);

	echoBegin('money', 0, false);
	echo "edata0=[";

	$a = preg_split('/\s+/', trim($_POST['equivalent'])); //199.99 363 0.4
	if (count($a) == 2) {
		$a[] = 0;
	}
	$price = sfs(meval($a[0]));
	$calorie = $a[1];
	$massLoss = $a[2];
	$j = 0;
	//69.99*100/(572.5*0.7)
	foreach ($a as $i) {
		if ($j == 0) {
			if (!is_numeric($i)) {
				$i = "$price=$i";
			}
		} else {
			echo ',';
		}
		echo wrapQuotes($i);
		$j++;
	}
	$i = $massLoss != 0;
	$b = $price . "*100/";
	if ($i) {
		$b .= "(";
	}
	$b .= $calorie;
	if ($i) {
		$b .= "*" . (1 - $massLoss) . ")"; //like r/100kcal
	}
	$r100kcal = meval($b);
	echo "," . wrapQuotes($b);

	$b = $calorie . "*10";
	if ($massLoss != 0) {
		$b .= "*" . (1 - $massLoss); //like r/100kcal
		//$b.="*(1-".$massLoss.")";
	}
	$rKgMassLoss = meval($b);
	echo "," . wrapQuotes($b);

	for ($i = 0; $i < 3; $i++) {
		echo "," . wrapQuotes("-");
	}
	echo "];edata=[";

	$i = 0;
	foreach ($goods as $g) {
		//$g['calorie']==0  соль
		if (!$g['food'] || $g['calorie'] == 0) {
			continue;
		}
		if ($i != 0) {
			echo ",";
		}
		echo "[";
		//echo "\n[";
		echo wrapQuotes($g['name']);
		echo "," . $g['calorie'];
		echo "," . $g['mass loss'];

		$lastPrice = $g['a'][1];
		$id = $g['a'][4];
		$date = $g['a'][5];
		echo "," . $g['a'][0];

		$b = $g['calorie'] . "*10";
		if ($g['mass loss'] != 0) {
			$b .= "*" . (1 - $g['mass loss']); //like r/100kcal
		}
		$c = meval($b);
		echo "," . wrapQuotes($b);
		echo "," . sfs($rKgMassLoss / $c);
		$peq = $lastPrice * $r100kcal / $g['a'][0];
		echo "," . sfs($peq);
		echo "," . sfs($lastPrice / $peq);
		echo "," . $lastPrice;
		echo "," . $id;
		echo "," . wrapQuotes($date);
		echo "]";
		$i++;
	}

	echo "]</script></head><body onload='eload()'><p style='width:880px;' id='p'></p>
<p><table id='et' class='ms c'><thead></thead></table>";
	echoEnd();
	exit;
}

if ($s == 'reorderIds') {
	if (!$admin) {
		echo "error " . __LINE__;
		exit;
	}
	$i = 1; //if no rows
	$result = $mysqli->query("SELECT max(id)+1,count(*) FROM money$jm_table where id>0") or die('error on line' . __LINE__ . $mysqli->error);
	while ($r = $result->fetch_array()) {
		$i = $r[0];
		$j = $r[1] + 1;
	}
	$q = "SET @p:=$i;
	UPDATE money$jm_table SET id=@p:=@p+1 where id>0 order by date,id;
	SET @p:=0;
	UPDATE money$jm_table SET id=@p:=@p+1 where id>0 order by date,id;
	ALTER TABLE money$jm_table AUTO_INCREMENT =$j
	";

	if (pdoQuery($q)) {
		echo "OK";
	}
	exit;
}

if ($s == 'type12') {
	//http://localhost/php/jm.php?type12

	$c = CATEGORY;
	$result = $mysqli->query("SELECT id,text FROM money$jm_table WHERE $c IN ($FOODS) AND id!=-1 ORDER by id desc") or die('error on line' . __LINE__ . $mysqli->error);

	$goods = loadGoods();
	$d = [];
	foreach (array_keys($goods) as $a) {
		$d[$a] = [false, false];
	}

	echo '<head>
	<link rel="stylesheet" type="text/css" href="../css/common.css">
	<link rel="stylesheet" type="text/css" href="../css/jm.css">
	</head>';
	while ($row = $result->fetch_assoc()) {
		$id = $row['id'];
		$t = atProceed($row['text']);

		$c = getFullTextForParse($t);
		$b = implode("\n", $c);
		foreach ($c as $a) {
			$r = parseMassPriceFull($a, $goods);
			if ($r['e']) {
				$s = str_replace(echar, "", $r['string']); //remove all tags
				die("error $id $a $t $s");
			}
			$n = $r['name'];
			if (!array_key_exists($n, $d)) {
				die('error on line' . __LINE__);
			}
			$d[$n][strpos($a, "@") === false ? 0 : 1] = true;
		}
	}

	$q = ['both', 'only normal', 'only @'];
	for ($i = 0; $i < 3; $i++) {
		echo '<table class="single" style="margin-left:3px;">';
		$a = $q[$i];
		echo "<th>№<th>$a";
		$j = 1;
		foreach (array_keys($goods) as $a) {
			$b = $d[$a];
			if ($i == 0 && $b[0] && $b[1] || $i == 1 && $b[0] && !$b[1] || $i == 2 && !$b[0] && $b[1]) {
				echo "<tr><td>$j<td>$a";
				$j++;
			}
		}
		echo "</table>";
	}

	//echoEnd();
	exit;
}

if ($s == 'test') {
	//http://localhost/php/jm.php?test
	exit;
}

if (isset($_POST['count'])) {
	$c = CATEGORY;
	//can be spaces so use \ as separator  for example "арахис неочищенный сырой"
	$sa = array_map("trim", explode("\\", $_POST['count']));
	$goods = loadGoods();
	$m = 0;
	$sb = '<span class="c">';
	$st = '';
	$as = '';

	echo '<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="../css/common.css">
	<link rel="stylesheet" type="text/css" href="../css/jm.css">
	<script>
	gAddons=' . json_encode($ADDONS) . ';
	</script>
	</head><body onload="countload()">';
	foreach ($sa as $se) {
		//[[:<:]], [[:>:]] analog \b in old mysql
		$result = $mysqli->query("SELECT id,date,text FROM money$jm_table WHERE text REGEXP '[[:<:]]$se\[[:>:]]' && id!=-1 ORDER BY id DESC") or die('error on line' . __LINE__ . $mysqli->error);

		$q = '';
		$n = 0;
		while ($row = $result->fetch_assoc()) {
			$id = $row['id'];
			$date = $row['date'];
			$t = atProceed($row['text']);
			$s = '';
			$w = '';
			foreach (explode("\n", getCommentText($t, true)) as $a) {
				if (str_contains($a, $se)) {
					$r = parseMassPriceFull($a, $goods);
					if ($r['e']) {
						$m = 0;
					} elseif (array_key_exists('massPure', $r)) {
						$m = $r['massPure'];
					} elseif (array_key_exists('quantity', $r)) {
						$m = $r['quantity'];
					} else {
						$m = -1;
					}

					if ($m != 0 && str_starts_with($r['string'], $sb) && strpos($r['string'], '@') === false) {
						$m = 0;
					}

					if (!empty($s)) {
						$s .= "<br>";
					}
					$s .= $r['string'];
					$w .= $m . '<br>';
					$n += $m;
				}
			}
			$q .= "<tr><td>$s<td>$w<td>$date<td><a href='#' onclick='clickID($id);'>$id</a>";
		}
		$st .= "<tr><td><b>$se<td><b>$n";
		$as .= "<p class='countload'>$se $n<table class='c countload'><thead></thead><tbody>$q<tbody></table>";
		//echo "<p class='countload'>$s<table class='c countload'><thead></thead><tbody>$q<tbody></table>";
	}
	echo "<p class='countload'><table>$st</table>$as<p>&nbsp;"; //<p>&nbsp; for bottom margin
	echoEnd();
	exit;
}

$ksort = str_starts_with($s, 'ksort');

// if(isset($_POST['id'])){
// 	echo "<pre>";
// 	print_r($_POST);
// 	die($_POST['id']." ".__LINE__);
// }

if ((empty($s) && empty($_POST)) || isset($_POST['user']) || $s == LOGOUT || isset($_POST['loginas'])) {
	$_POST['anyQuantity'] = $ADDONS['show_money_rows'];
}
if (isset($_POST['anyQuantity']) || isset($_POST['id']) || isset($_POST['type']) || $s == 'm' || $ksort) {
	$table = 'money';
} elseif ($s == 'j') {
	if (!$admin) {
		exit;
	}
	$table = 'journal';
} else {
	foreach ($_POST as $k => $v) {
		echo "$k = $v<br>";
	}
	die("unknown command [$s]" . __LINE__);
}

echoBegin($table, 0, false);

if ($table == 'money') {
	$f = 1;
	$c = CATEGORY;
	$result = $mysqli->query("SELECT $c,count(*) as c FROM money$jm_table WHERE id!=-1 GROUP by $c ORDER BY c DESC") or die('error on line' . __LINE__ . $mysqli->error);
	echo 'gType=['; //can be empty result so '[' is here
	while ($row = $result->fetch_array()) {
		echo ($f ? '' : ',') . "'$row[0]'";
		$f = 0;
	}
	echo '];';

	$goods = loadGoods();
	loadGoodsData($goods, 1, 1);
	//gGoodsZ - gGoods+goods with calorie=0 salt vinegar
	for ($c = 0; $c < 3; $c++) {
		echo 'gGoods';
		if ($c == 1) {
			echo 'S';
		} elseif ($c == 2) {
			echo 'Z';
		}

		echo '=[';
		$f = 1;
		foreach ($goods as $v) {
			if (!$v['food'] || $v['calorie'] == 0 && $c != 2) {
				continue;
			}
			if ($f) {
				$f = 0;
			} else {
				echo ',';
			}
			//$v['a'][1] last price perKg/Liter without density & mass loss, we need consider density
			if ($c == 0 || $c == 2) {
				echo wrapQuotes($v['name']);
			} else {
				if (count($v['a']) == 0) {
					$i = 0;
				} else {
					$i = $v['a'][0];
				}
				$j = $v['calorie'];
				$k = $v['mass loss'];
				echo "'$i $j $k'";
			}
		}
		echo "];";
	}
}

echo 'gJournal=';
$columns = ['text'];
$limit = '';
if (isset($_POST['id'])) {
	$where = "WHERE" . getIN();
} elseif (isset($_POST['type'])) {
	$where = "WHERE " . CATEGORY . "='" . $_POST['type'] . "'";
} elseif ($ksort) {
	$result = $mysqli->query("SELECT * FROM $table$jm_table") or die('</script>error on line' . __LINE__ . $mysqli->error);
	$i = [];
	while ($r = $result->fetch_array()) {
		$sum = countSum12($r);
		if ($sum[1] != 0) {
			$i[] = [substr($s, -1) == 1 ? $sum[1] : ($sum[0] === 0 ? INF : $sum[1] / $sum[0]), $r['id']];
		}
	}
	usort($i, fn($a, $b) => $a[0] < $b[0]);
	$j = [];
	foreach ($i as $a) {
		$j[] = $a[1];
	}
	$i = implode(',', $j);
	$where = "WHERE id IN($i)";
	$order = "ORDER BY FIELD(id,$i)";
} else {
	$where = '';
}
if ($table == 'journal') {
	echo 'true;';
	$order = 'ORDER BY id DESC';
} else {
	echo 'false;';
	if (!$ksort) {
		$order = 'ORDER BY date DESC, id DESC';
	}
	$columns = array_merge($columns, ['date', CATEGORY]);
	if (isset($_POST['anyQuantity']) || $s == 'm') {
		$limit = 'LIMIT ' . (isset($_POST['anyQuantity']) ? $_POST['anyQuantity'] : DEFAULT_ANY_QUANTITY);
	}
}
//note text always goes first! id always goes last!
$columns[] = 'id';

$result = $mysqli->query("SELECT * FROM $table$jm_table $where $order $limit") or die('</script>error on line' . __LINE__ . $mysqli->error);

echo 'gKeys=[\'' . implode('\',\'', $columns) . '\'];';
$a = [];
foreach ($columns as $c) {
	$a[] = $c . ':\'\'';
}
echo 'gData=[{' . implode(',', $a) . '}';

while ($row = $result->fetch_array()) {
	$a = [];
	foreach ($columns as $c) {
		$i = $row[$c];
		if ($c == 'text') {
			$i = atProceed($i);
			//</script> inside string js recognized as close <script> tag
			$i = str_replace('</script>', '<\/script>', $i);
			$i = addslashes($i);
			$i = str_replace(["\r\n", "\r", "\n"], "\\n", $i);
		}
		if ($c == 'text' || $c == CATEGORY || $c == 'date') {
			$i = wrapQuotes($i);
		}
		$a[] = $c . ':' . $i;
	}
	echo ',{' . implode(',', $a) . '}';
}
echo "];";

$a = [];
$result = $mysqli->query("SELECT name,round,`empty text` FROM money_categories$jm_table ORDER BY name");
while ($row = $result->fetch_array()) {
	$b = [];
	for ($i = 0; $i < 3; $i++) {
		$j = $row[$i];
		if ($i != 1) {
			$j = wrapQuotes($j);
		}
		$b[] = $j;
	}
	$a[] = "[" . implode(',', $b) . "]";
}
echo 'gCategories=[' . implode(',', $a) . '];';

echo "</script>";
echo '</head><body onload="load()">
<table><tr><td id="tdRows">
<td rowspan="2" style="vertical-align:top" id="note">
<tr><td><table id="t0" class="mt"></table></table>';
echoEnd();

function wrapQuotes($s)
{
	return '"' . $s . '"';
}

function numberToString($i)
{
	$f = floatval($i);
	if ($f >= 1000) {
		return number_format($f, floor($f) == $f ? 0 : 1, '.', ' ');
	} else {
		return $i;
	}
}

function echoBegin($table, $chart = 0, $closeScript = true)
{
	global $admin, $ADDONS, $DEFAULTCATEGORY, $USERS;
	echo '<!DOCTYPE html><html><head><link rel="shortcut icon" href="../favicon/' . $table . '.ico" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="../css/common.css">
	<link rel="stylesheet" type="text/css" href="../css/dialog.css">
	<link rel="stylesheet" type="text/css" href="../css/calendar.css">
	<link rel="stylesheet" type="text/css" href="../css/jm.css">
	<script src="../scripts/combobox.js"></script>
	<script src="../scripts/dialog.js"></script>
	<script src="../scripts/calendar.js"></script>';
	if ($chart) {
		echo '<script src="../scripts/Chart.bundle.min.js"></script>';
	}
	echo '<script>';
	$j = [];
	foreach (FILES as $f) {
		$j[] = filesize($f);
		$j[] = count(preg_split('/\n/', file_get_contents($f)));
		$j[] = wrapQuotes(strtolower(date("Y-m-d", filemtime($f))));
	}
	echo 'gFileInfo=[' . implode(",", $j) . '];gFileName=' . json_encode(FILES) . ';';
	echo 'gAddons=' . json_encode($ADDONS) . ";";
	echo 'gDefaultCategory=' . json_encode($DEFAULTCATEGORY) . ";";
	echo 'gNullString="' . NULL_STRING . '";';

	if ($admin == 2) {
		//sometimes can be empty
		$j = [];
		foreach ($USERS as $u) {
			$j[] = wrapQuotes($u);
		}
		echo 'gUsers=[' . implode(',', $j) . '];';
	}

	//const AVIEWEDIT=['goods_viewedit','goods_viewedit_foodonly','categories_statistics','categories_viewedit','addons_viewedit'];
	$a = [$admin];
	$i = 0;
	foreach (['Admin'] as $n) {
		$j = $a[$i++];
		/*Note gAdmin should be without quotes gAdmin=false is not the same with gAdmin='false'.
		in second case when gAdmin='false' in js if(gAdmin) is true
		*/
		if (!is_numeric($j)) {
			$j = "'$j'";
		}
		echo "g$n=$j;";
	}
	for ($i = 0; $i < count(AVIEWEDIT); $i++) {
		echo 'g' . AVIEWEDIT[$i] . "=" . $i . ";";
	}
	echo 'gMS_TYPE=' . $i . ";";

	if ($closeScript) {
		echo "</script>";
	}
}

function echoEnd()
{
	global $language;
	echo "<form action='jm.php' method='post'><input name='id' type='hidden'></form>
	<script>gLanguage='$language'</script>
	<script src='../scripts/common.js'></script>
	<script src='../scripts/jm.js'></script>
	</body></html>";
	/*jm.js should be after all global variables 
	using el(), fetchgetpost() from common.js
	*/
}

/*same with parseMassPrice function but additional keys, values
	r[pricePerKgLiterS]=price per kg or liter string (density,mass loss not used)
	$r[pricePer1000kcalS] 
	$r[string]=marked text <font>..</font>
	$r[ct0]=1 when total calories=0 for salt
	$r[e]=1 if error
	$r[totalCaloriesS]
	$r[calorie]
	$r[name]
	$r['massPure']
	
	return -1 in case of skip if $full=true
	
	there are four types of errors
	good not found, two goods found, no price set, no mass set
*/
function parseMassPriceFull($a, &$goods, &$total = NULL)
{
	global $eggMass, $ADDONS;
	$full = $total !== NULL;
	$b = fre('good not found', $a);
	$e = 1;
	$gf = $mass = $price = UNKNOWN;

	foreach ($goods as $g) {
		$c = $g['name'];
		$j = mb_stripos($a, $c);
		$ia = $j + mb_strlen($c);

		//check symbol before string, and after string, should be one of SY
		if (
			$j !== false && ($ia == mb_strlen($a) || mb_stripos(SY, mb_substr($a, $ia, 1)) !== false)
			&& ($j == 0 || mb_stripos(SY . '@', mb_substr($a, $j - 1, 1)) !== false)
		) {
			if ($e == 0) {
				$e = 1;
				$mi = $j;
				$ml = mb_strlen($c);
				$b = $a;
				if ($mi > $mai) {
					$b = selectGood($b, $mi, $ml);
					$b = selectGood($b, $mai, $mal);
				} else {
					$b = selectGood($b, $mai, $mal);
					$b = selectGood($b, $mi, $ml);
				}
				$b = fontRed($b);
				break;
			}
			$mai = $j;
			$mal = mb_strlen($c);
			$name = $c;
			$e = 0;
		}
	}

	if ($e == 1) { //good not found or two goods found
		$r['priceS'] = UNKNOWN;
		$r['sum'] = UNKNOWN;
		$r['pricePerKg'] = false; //use when count
	} else {
		$gf = $goods[$name];
		if ($full && !$gf['food']) {
			$goods[$name]['c']++;
			return -1;
		}

		$b = selectGood($a, $mai, $mal);

		$r = parseMassPrice($a, $ADDONS['skip_row']);
		$mass = $r['mass'];
		//??30aug2023 $massKg=$r['kg'];
		$quantity = $r['quantity'];
		$pricePerKg = $r['pricePerKg'];
		$price = $r['price'];
		$ps = $r['priceS'];
		if ($r['sum']) {
			$b .= fontBlue(" " . jsError('price') . " $price=$ps");
		}
		if (array_key_exists('string', $r)) { //error found
			$e = 1;
			$b = fontRed(jsError($r['string']) . " $b");
		}

		if (!is_numeric($price)) {
			$e = 1;
			//good is found and selected so use $b instead of $ao
			$b = fre("no price set", $b);
		} else {
			if (!is_numeric($mass)) {
				if ($gf['name'] == 'яйцо') {
					$i = preg_match_all("/\b(\d+)\s*штук\b/iu", $a, $gr); //TODO
					if ($i == 0) {
						$e = 1;
						$b = fre("no eggs count set", $b);
					} elseif ($i > 1) {
						$e = 1;
						$b = fre("two or more eggs count set", $b);
					} else {
						//allow english char C first char in group, and russian chars 2-3 in group С and case insensitive
						$a = str_ireplace("со скидкой", "", $a); //со - category also
						$a = mb_strtolower($a);
						$i = preg_match_all("/\b[cс]([0-3овo])\b/iu", $a, $g1);
						if ($i == 0) {
							$e = 1;
							$b = fre("no eggs category set", $b);
						} elseif ($i > 1) {
							$e = 1;
							$b = fre("two or more eggs category set", $b);
						} else {
							$i = mb_strtolower($g1[1][0]);
							$category = is_numeric($i) ? $i + 1 : intval($i != "в");
							$mass = $gr[1][0] * $eggMass[$category] / 1000;
						}
					}
				} else {
					if (!$e && $gf['food']) { //if $e==1 error already set after call of parseMassPrice() function
						$e = 1;
						//good is found and selected so use $b instead of $ao
						$b = fre("no mass set", $b);
					}
				}
			}
		}

		if (!$e && $full) {
			$goods[$name]['c']++;
			$q = &$goods[$name]['buy'];
			$d = $pricePerKg ? "1" : strval($mass);
			if (!array_key_exists($d, $q)) {
				$q[$d] = 0;
			}
			$q[$d] += $pricePerKg ? $mass : $quantity;
			unset($q); //may be use below clear reference
		}
	}
	$ct = UNKNOWN;
	$c = UNKNOWN;
	$gs = UNKNOWN;
	if (!$e  && $gf['food']) {
		if (($a = $mass * $quantity * 10) != 1) {
			$gs = "*$a";
		} else {
			$gs = "";
		}
		$gs .= getMLD($gf);
		$mass100gPure = meval("1$gs");
		$massPure = $mass100gPure / 10;
		$r['massPure'] = $massPure;
		$gs = $gf['calorie'] . $gs;
		$ct = meval($gs);
		if ($full) {
			$total['kilocalories'] += $ct;
		}
		$ct = round($ct, 2);
		if ($full) {
			$total['mass'] += $mass * $quantity;
			$total['massPure'] += $massPure;
			foreach (['protein', 'fat', 'carbohydrate', 'b12'] as $q) {
				$total[$q] += $mass100gPure * $gf[$q];
			}
		}
	}
	$r['calorie'] = $gf == UNKNOWN ? UNKNOWN : $gf['calorie'];
	$r['totalCaloriesS'] = $gs;
	$r['ct0'] = 0;
	if (isset($price) && is_numeric($price)) { //price isn't set if good not found
		if ($ct === 0.0) { //Note UNKNOWN==0 is true
			//$ct==0//соль
			$end = "$price/0";
			$r['ct0'] = 1;
		} else {
			/*
			$price ~ $c*$mass(kg)*10
			$x        ~ 1000
			
			$x=$price*100/($c*$mass(kg))
			*/
			if ($gf == UNKNOWN || !$gf['food']) {
				$g = UNKNOWN;
			} else {
				$c = $gf['calorie'];
				$muls = getMLD($gf);
				if ($pricePerKg) {
					$g = "$c$muls";
				} else {
					if ($mass == 1) {
						$g = "$c$muls";
					} else {
						$g = "$c*$mass$muls";
					}
				}

				if (strpos($g, "*") !== false) {
					$g = "($g)";
				}
			}
			$g = "$price*100/" . $g;
			$me = meval($g);
			$end = "$g";
		}
	} else {
		$j = $gf == UNKNOWN ? UNKNOWN : $gf['calorie'];
		$end = UNKNOWN . "/" . $j;
	}
	$r['pricePer1000kcalS'] = $end;

	$m = preg_replace("/<[^>]+>/", "", $b); //remove all tags
	if (mb_strlen($m) > 55) {
		$b = "<font class='sm'>$b</font>";
	}
	$r['string'] = $b;
	$r['e'] = $e;
	if (!$e) {
		$r['name'] = $name;
	}

	//count $r['pricePerKgLiterS']
	if ($r['pricePerKg'] || $mass == 1) {
		$r['pricePerKgLiterS'] = "$price";
	} else {
		$r['pricePerKgLiterS'] = "$price/$mass";
	}

	return $r;
}

function fontBlue($a)
{
	return font($a, 'DarkBlue');
}

function fontRed($a)
{
	return font($a, 'red');
}

function font($a, $c)
{
	return "<font style='color:$c;'>$a</font>";
}

function selectGood($a, $i, $l)
{
	return mb_substr($a, 0, $i) . '<b>' . mb_substr($a, $i, $l) . '</b>' . mb_substr($a, $i + $l);
}

function meval($s)
{
	if (strpos($s, UNKNOWN) === false) {
		//safety only digits or +-*/().
		//In a square brackets any character except ^, -, ] or \ is a literal.
		if (preg_match("/^[\s\d+\-*\/().]+$/", $s)) {
			return eval("return $s;");
		} else {
			throw new Exception("meval($s)");
		}
	} else {
		return UNKNOWN;
	}
}

function sfs($a, $s = '')
{
	if (is_numeric($a)) {
		$a = rtrim(number_format($a, 2, '.', $s), "0");
		return rtrim($a, ".");
	} else {
		return UNKNOWN;
	}
}

function getMLD($g)
{
	$s = '';
	if (($a = 1 - $g['mass loss']) != 1) {
		$s .= "*$a";
	}

	if (($a = $g['density']) != 1) {
		$s .= "*$a";
	}
	return $s;
}

function loadGoods()
{
	global $mysqli, $jm_table;
	$result = $mysqli->query("SELECT name,name0,name1,protein,fat,carbohydrate,`mass loss`,density,b12,food,alias,comment FROM money_goods$jm_table WHERE `has check`=1") or die('error on line' . __LINE__ . $mysqli->error);
	$goods = [];
	while ($row = $result->fetch_array()) {
		$row['c'] = 0;
		$row['massPure'] = 0;
		$row['buy'] = []; //mass & quantity
		$row['calorie'] = 4 * $row['protein'] + 9 * $row['fat'] + 4 * $row['carbohydrate'];
		$goods[$row['name']] = $row;
	}
	return $goods;
}

//$type 0-3
function loadGoodsData(&$goods, $type, $withat = 0)
{
	// var_dump($type,$withat);
	// exit;
	global $mysqli, $FOODS, $jm_table;
	foreach ($goods as $k => $v) {
		$goods[$k]['a'] = [];
	}
	$c = CATEGORY;
	$result = $mysqli->query("SELECT date as d,id,text FROM money$jm_table WHERE $c IN ($FOODS) ORDER BY date DESC") or die('error on line' . __LINE__ . $mysqli->error);

	while ($row = $result->fetch_assoc()) {
		foreach (getUncommentTextForParse(atProceed($row['text']), true, $withat) as $a) {
			$r = parseMassPriceFull($a, $goods);

			$e = $r['e'];
			if ($e) {
				continue;
			}

			$f = $goods[$r['name']];
			if (!$f['food']) {
				continue;
			}
			$g = &$goods[$r['name']]['a'];
			$c = count($g);
			//exclude same name with same id ($c==0 || $g[$c-2]!=$row['id']) condition
			if ($c == 0 || $g[$c - 2] != $row['id']) {
				if ($f['calorie'] == 0) {
					$v = INF;
				} else {
					$p = meval($r['pricePer1000kcalS']);
					$v = number_format($p, 2, '.', '');
				}
				if ($type == 2) {
					$g[] = $r['massPure'];
					$g[] = $row['d'];
				} else {
					$price = $r['pricePerKgLiterS'];
					if ($type == 1) {
						$a = $r['pricePerKgLiterS'];
						if ($f['density'] != 1) {
							$a .= '/' . $f['density'];
						}
					} elseif ($type == 3) {
						if (!$r['kg']) {
							$a = $v;
							$price = $r['pricePerKgLiterS'] . "/" . $f['density'];
						} else {
							$a = $v == INF ? $v : number_format($v * $f['density'], 2, '.', '');
						}
					} else {
						$a = $v; //should be always numeric so use '' for thousand separator
					}
					$g[] = $a;
					$g[] = number_format(meval($price), 2, '.', ''); //should be always numeric so use '' for thousand separator
					$g[] = $f['calorie'] == 0 || $f['protein'] == 0 ? INF : number_format($p * $f['calorie'] / $f['protein'] / 1000, 2, '.', ''); //should be always numeric so use '' for thousand separator
					$q = meval($price . "/(1" . getMLD($f) . ")"); //mass is denominator
					$g[] = $f['b12'] == 0 ? INF : number_format($q / (10 * $f['b12']), 2, '.', '');
					$g[] = $row['id'];
					$g[] = $row['d'];
				}
			}
			unset($g);
		}
	}
}

function login()
{
	global $admin, $jm_user, $jm_pwd;
	if (!$admin) {
		if (
			!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])
			|| $_SERVER['PHP_AUTH_USER'] != $jm_user || $_SERVER['PHP_AUTH_PW'] != $jm_pwd
		) {
			header("WWW-Authenticate: Basic realm=\"Please enter your username and password to proceed further\"");
			header("HTTP/1.0 401 Unauthorized");
			print "It require login to proceed further. Please enter your login detail\n";
			return false;
		}
	}
	setCookies(); //set cookies to normal login on page reload	
	return true;
}

function swapIds($id1, $id2, $journal)
{ //also can be used for swap ids for money table
	global $mysqli, $jm_table;
	$table = $journal ? 'journal' : 'money';
	$table .= $jm_table;
	$result = $mysqli->query("SELECT max(id) as m from $table") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $result->fetch_assoc();
	$t = $row['m'] + 1;

	$a = [$id1, $id2, $t];

	for ($i = 0; $i < 2; $i++) {
		$result = $mysqli->query("SELECT 1 from $table where id=$a[$i]") or die('error on line' . __LINE__ . $mysqli->error);
		if ($result->num_rows == 0) {
			die('error on line' . __LINE__ . "id=$a[$i] not found ");
		}
	}

	for ($i = 0; $i < 3; $i++) {
		$j = $a[($i + 2) % 3];
		$q = "UPDATE $table SET id=$j WHERE id=$a[$i]";
		$mysqli->query($q) or die('error on line' . __LINE__ . $mysqli->error);
		if ($mysqli->affected_rows !== 1) {
			die('error affected_rows on line' . __LINE__);
		}
	}
}

function to_string($a)
{
	return "'" . implode("','", $a) . "'";
}

function getFullTextForParse($text, $removeSkipRows = true)
{
	return getUncommentTextForParse($text, $removeSkipRows, true);
}

function roundSum($r, $sum)
{
	global $ROUND;
	$round = $ROUND[$r[CATEGORY]];
	if ($round == 1) {
		return floor($sum);
	}
	if ($round == 2) {
		//globus rounding
		$i = strval($sum);
		$j = strpos($i, ".");
		if ($j !== false) {
			$q = substr($i, 0, $j);
			if (substr($i, $j + 1, 1) >= '5') {
				$q .= ".50";
			}
			return $q;
		}
	}
	return number_format($sum, 2, '.', "");
}

function countSum12($r, $removeSkipRows = true)
{
	$sum = [0, 0];
	foreach (getFullTextForParse(atProceed($r['text']), $removeSkipRows) as $a) {
		$sum[strpos($a, "@") === false ? 0 : 1] += countSumString($a);
	}
	return $sum;
}

function countSumString($q)
{
	global $ADDONS;
	$seq = $ADDONS['sum_eq'];
	//al least one digit then dot then al least one digit
	$sum = 0;
	if (($j = strpos($q, $seq)) !== false) {
		$k = floatval(substr($q, $j + strlen($seq)));
		$sum += $k;
	} else {
		//float*float, float*int, int*float, float, int. int needs for "жкх 5400" or "интернет 1000"
		//яйцо ваш выбор C2 30 штук 132.99 -> 132.99 not 30 so cann't use universal regexp
		//"ageStar SSMR2S шасси для 2.5 SATA HDD 412.00". Two numbers 2.5 and 412.00 need second one so search float with at least two digits fist
		$k = [
			'/(\t| |^)\d+\*\d+(\.\d+)?(?=\t| |$)/', //int*something
			'/(\t| |^)\d+\.\d{2,}(\*\d+(\.\d+)?)?(?=\t| |$)/', //float or float*something with 2+ digits after point, "ageStar SSMR2S шасси для 2.5 SATA HDD 412.00"
			'/(\t| |^)\d+\.\d+(\*\d+(\.\d+)?)?(?=\t| |$)/', //float or float*something
			'/(\t| |^)\d+(\.\d+)?(\*\d+(\.\d+)?)?(?=\t| |$)/' //all others
		];
		for ($j = 0; $j < count($k); $j++) {
			if (preg_match($k[$j], $q, $match)) {
				break;
			}
		}
		if ($j == count($k)) {
		} else {
			try {
				$k = eval('return ' . $match[0] . ';');
				$sum += $k;
			} catch (Exception $e) {
			}
		}
	}

	return $sum;
}

function appendArray(&$s1, $z)
{
	if (!empty($s1)) {
		$s1 .= ',';
	}
	$s1 .= "[" . implode(',', $z) . "]";
}

function jsError($s)
{
	$e = echar;
	return $e . $s . $e;
}

function fre($e, $a)
{
	return fontRed(jsError($e) . ' ' . $a);
}

function getTableColumns($table)
{
	global $mysqli;
	$result = $mysqli->query("SHOW COLUMNS FROM $table") or die('error on line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($row = mysqli_fetch_array($result)) {
		$a[] = $row['Field'];
	}
	return $a;
}

function countFoodSum($condition)
{
	global $mysqli, $ADDONS, $FOODS, $jm_table;
	$c = CATEGORY;
	$goods = loadGoods();
	$seq = $ADDONS['sum_eq'];

	$result = $mysqli->query("SELECT date,text,$c,id FROM money$jm_table WHERE $c IN ($FOODS) AND $condition") or die('error on line' . __LINE__ . $mysqli->error);

	$sum = 0;
	while ($row = $result->fetch_array()) {
		foreach (getUncommentTextForParse(atProceed($row['text'])) as $q) {
			if (($j = strpos($q, $seq)) !== false) {
				/* $v= */
				$k = floatval(substr($q, $j + strlen($seq)));
				$sum += $k;
			} else {
				$r = parseMassPriceFull($q, $goods);
				if ($r === -1 || $r['e']) {
					continue;
				}
				if (!$goods[$r['name']]['food']) {
					continue;
				}
				$sum += $r['price'] * $r[$r['pricePerKg'] ? 'mass' : 'quantity'];
			}
		}
	}
	return $sum;
}

function pdoQuery($query)
{
	global $pdo;
	$stmt = $pdo->prepare($query);
	$r = $stmt->execute();
	if (!$r) {
		print_r($stmt->errorInfo());
	}
	return $r;
}

function removeUser($user)
{
	global $mysqli, $admin;
	if ($admin != 2 || $user == JM_SUPERUSER) {
		echo "error " . __LINE__;
		exit;
	}
	for ($i = 0; $i < 2; $i++) {
		if ($i == 0) {
			$q = "DROP TABLE `money_addons_$user`, `money_goods_$user`, `money_$user`, `money_categories_$user`, `journal_$user`;";
		} else {
			$q = "DELETE from users WHERE user='$user'";
		}
		if (!$mysqli->query($q)) {
			echo 'error on line' . __LINE__ . $mysqli->error . "\n";
		}
	}
}

function createUser($user, $password, $email)
{
	global $mysqli;
	//since mysql table names are always lowercase so check lowercase user 'NAME'='name'
	$u = mb_strtolower($user);
	//sourcefroge cann't have two columns with default current timestamp
	if (!$mysqli->query("INSERT into users (user, password, email,firstlogin)
	VALUES ('$u', '" . md5($password) . "', '$email', NOW())")) {
		return $mysqli->errno;
	}

	$query = getSqlFileContent($user, true);
	$r = pdoQuery($query);

	$mass = 70;
	$date = date('Y-m-d');
	$showDeleteMoneyButton = 1;

	//works with $user with russian characters 
	$query = "INSERT INTO `money_addons_$user` (`parameter`, `value`) VALUES
		('egg_purified_mass_grams_by_category', '61.1 55.2 46.2 37.2'),
		('mass', '$mass'),
		('show_delete_button_for_money_table', '$showDeleteMoneyButton'),
		('show_delete_warning', '1'),	
		('show_money_rows', '7'),
		('skip_row', 'SKIP_ROW'),
		('start_date', '$date'),
		('sum_eq', 'SUM=');";
	$mysqli->query($query)  or die('error on line' . __LINE__ . $mysqli->error);

	return $r;
}

//sql format
function dumpTableData($t, $order)
{
	global $mysqli;
	$s = "";
	$res = $mysqli->query("SELECT * FROM $t $order") or die('error on line' . __LINE__ . $mysqli->error);
	if ($res->num_rows != 0) {
		$b = [];
		while ($row = $res->fetch_assoc()) {
			$a = [];
			foreach ($row as $r) {
				if (isset($r)) {
					$v = wrapQuotes($mysqli->real_escape_string($r));
				} else {
					$v = 'NULL';
				}
				$a[] = $v;
			}
			$b[] = "(" . implode(',', $a) . ")";
		}
		$s .= "\nINSERT INTO $t VALUES\n" . implode(",\n", $b) . ";\n";
	}
	return $s;
}

function getSqlFileContent($user, $onePart = true)
{
	//jm.sql - is dump of money,money_addons,money_categories,money_goods,journal with constraints and primari keys (without data)
	$q = file_get_contents("../jm.sql");
	$q = preg_replace('/^--.*\n/m', '', $q);
	$q = preg_replace('/\/\*.*\n/m', '', $q);
	$q = str_replace('_' . JM_SUPERUSER, '_' . $user, $q);
	if ($onePart) {
		return $q;
	}

	$i = strpos($q, "ALTER TABLE");
	return [substr($q, 0, $i), substr($q, $i)];
}

function getMinCheckDate()
{
	global $jm_user, $mysqli;
	$res = $mysqli->query("SELECT MIN(date) FROM money_$jm_user") or die('error on line' . __LINE__ . $mysqli->error);
	$row = $res->fetch_array();
	return $row[0];
}

function fd($d)
{
	return "DATE_FORMAT($d, '" . SQL_YYYY_MM . "')";
}

function getIN()
{
	return " id IN(" . preg_replace('/\s+/', ',', trim($_POST['id'])) . ")";
}

function checkGoodsInComments()
{
	global $mysqli, $jm_user;
	echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<link rel="stylesheet" type="text/css" href="../css/common.css">
	<title>test</title></head><body style="margin:7px;">';
	echo "<p style='white-space: pre;'>";

	$result = $mysqli->query("SELECT name FROM money_goods_$jm_user WHERE food=1 AND `has check`=1 AND name<>'яйцо'") or die('error on line' . __LINE__ . $mysqli->error);
	$good_names = [];
	while ($row = $result->fetch_array()) {
		$good_names[] = $row[0];
	}

	$a = [];
	$result = $mysqli->query("SELECT name FROM money_categories_slovesno WHERE food=1") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_array()) {
		$a[] = "'$row[0]'";
	}
	$s = implode(",", $a);
	// 1кг 171 270

	$c = 0;
	$result = $mysqli->query("SELECT text,id,date FROM money_$jm_user WHERE category in($s) and id!=-1 order by id desc limit 600") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_array()) {
		$t = $row[0];
		$id = $row[1];
		$date = $row[2];
		foreach (explode("\n", $t) as $e) {
			if (preg_match("~яйцо.*\s*(?:[cсд])([0-3овo])\s*(\d+)штук.*?(\d+(?:\.\d+)?)~ui", $e)) {
			} else {
				foreach ($good_names as $n) {
					if (preg_match("~(^|\\s|@|\*)($n)($|\\s)~ui", $e, $g)) {
						if (!checkGoodsInCommentsInner($e)) {
							$c++;
							echo "$c [$e] $id<br>";
						}
						break;
					}
				}
			}
		}
	}
	echo "END";
}

function checkGoodsInCommentsInner($e)
{
	$e = mb_strtolower($e);
	//has 'окунь филе н/к замороженный' so use tilde
	$r = parseMassPrice($e);
	$mass = $r['mass'];
	$price = $r['price'];
	if ($mass == UNKNOWN) {
		//from jm.php changed $a to $e
		$i = preg_match_all("/\b(\d+)\s*штук\b/iu", $e, $gr);
		if ($i != -1) {
			return false;
		}
		// diec($i == 0, "не задана масса или не установлен счётчик яиц", __LINE__,$e." checkID=".$id);
		// diec($i > 1, "two or more eggs count set", __LINE__);
	}
	return true;
}
