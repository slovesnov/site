<?php
include("../config.php");
include("jmCommon.php");
const UNKNOWN = '?';

const rfrom = "¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞↉,";
//const rfrom = ['¼', '½', '¾', '⅐', '⅑', '⅒', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞', '↉', ','];
const rto = ["(1/4)", "(1/2)", "(3/4)", "(1/7)", "(1/9)", "(1/10)", "(1/3)", "(2/3)", "(1/5)", "(2/5)", "(3/5)", "(4/5)", "(1/6)", "(5/6)", "(1/8)", "(3/8)", "(5/8)", "(7/8)", "(0/3)", "."];
//allow spaces but should be +-*/() before or after "400 +2"
const mathSymbol = '(?:[-\d+*\/().,eE' . rfrom . ']|(?<=[-+*\/()])\s+|\s+(?=[-+*\/()]))*';
const pureMathBase = mathSymbol . '[\d' . rfrom . ']' . mathSymbol;
const pureMath = '(' . pureMathBase . ')';
const pureMaths = '\s*' . pureMath;
const spoon = '\s*\.?\s*л(ож(к[аи]|ек))?';
const teaSpoon = 'ч' . spoon;
const tableSpoon = 'ст' . spoon;
const po = pureMaths . '\s*' . '(к?г|м?л|' . tableSpoon . '|' . teaSpoon . '|гр|%|шт?|штук[аи]?|ст(акан(а|ов)?)?)?\s*\.?';

const name = 0; //original name
const mass = 1; //end mass
const protein = 2;
const fat = 3;
const carbohydrate = 4;
const proteinTotal = 5;
const carbohydrateTotal = 6;
const fatTotal = 7;
const ccal = 8;
const ccaltotal = 9;
const price = 10;
const price1000ccal = 11;
const pricetotal = 12;
const comment = 13;
const massv = 14; //end mass value
const namel = 15; //name in database
const pricev = 16;
const unittype = 17; //unit type unitGrams, unitL..., string for eggs
const unitn = 18; //number of units 
const unitmass = 19; //mass of one unit 
const lossall = 20; // 
const basepercent = 21; //% from base
const massbegin = 22;
const colorIndex = 23;
const boldIndex = 24;
const remainderAfter = 25;
const originalString = 26;
const mul = 27;
const animalProtein = 28; //quantity of animal protein. Example .2 means 20%
const saturatedFat = 29;
const b12 = 30;
const b12Total = 31;
const fiber = 32;
const fiberTotal = 33;

const unitGrams = 0;
const unitL = 1;
const unitML = 2;
const unitTeaSpoon = 3;
const unitTableSpoon = 4;
const unitGlass = 5;
const unitPercent = 6;
const unitPiece = 7;

const PREDEFINED_MASS = [
	'соль' => [20, 6, 320] //old values [30,10]
	,
	'сахар' => [25, 10, 200],
	'уксус 9%' => [15, 5, 250],
	'уксус 70%' => [15, 5, 250],
	'мука' => [15, 5, 160],
	'вода' => [15, 5, 250],
	'молоко 3.2%' => [15, 5, 250]
	//15*.92=13.8 5*.92=4.6 250*.92=230
	,
	'масло подсолнечное рафинированное' => [14, 5, 230],
	'масло подсолнечное нерафинированное' => [14, 5, 230],
	'сода' => [20, 8, 160]
];

const PREDEFINED_PIECE_MASS = ['гвоздика' => 15 / 214, 'перец черный горошек' => 50 / 1412, 'перец душистый горошек' => 15 / 105, 'лук' => 100];
const COLUMNS = [
	'название' => 1,
	'масса' => 1,
	'масса%' => 0,
	'база%' => 0,
	'белки' => 1,
	'жиры' => 1,
	'углеводы' => 1,
	'б.всего' => 1,
	'ж.всего' => 1,
	'у.всего' => 1,
	'кк/100г' => 1,
	'кк всего' => 1,
	'кк%' => 0,
	'р/кг' => 0,
	'р/1000кк' => 0,
	'р всего' => 0,
	'р%' => 0,
	'белок%' => 0,
	'р/гБелка' => 0,
	'b12' => 0,
	'b12.всего' => 0,
	'кл.' => 0,
	'кл.всего' => 0,
	'строка в чеке / дата чека' => 0
	/*
	'название' => 1,
	'масса' => 1,
	'масса%' => 0,
	'база%' => 0,
	'белки' => 1,
	'жиры' => 1,
	'углеводы' => 1,
	'б.всего' => 0,
	'ж.всего' => 0,
	'у.всего' => 0,
	'кк/100г' => 1,
	'кк всего' => 1,
	'кк%' => 0,
	'р/кг' => 1,
	'р/1000кк' => 1,
	'р всего' => 1,
	'р%' => 0,
	'белок%' => 0,
	'р/гБелка' => 0,
	'b12' => 0,
	'b12.всего' => 0,
	'кл.' => 0,
	'кл.всего' => 0,
	'строка в чеке / дата чека' => 1
	*/
];
const MONTH_NAMES = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
const KEYR = 'йцукенгшщзхъфывапролджэячсмитьбюё';
const KEYE = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`';

const SUM_UNKNOWN = '?sum';
const TOTAL_CSS_COLORS = 4; //in calorie_recipe.css tr.c[0 TOTAL_CSS_COLORS-1]
const NEW_RECIPE = "#№";
const SUB_RECIPE = "&";
const INFINITY = '&infin;';
const ZERO_DIV_ZERO = '0/0';
const MAIN_TABLE_ZERO_DIV_ZERO_STRING = ZERO_DIV_ZERO; //string which show 0/0 in main table
const COMMENT_TAG = '/\\';
const DIGITS = 1;
const PRICE_DIGITS = 2;

//for TAG
const remainder = 0;
const loss = 1;
// const protein=2;//already defined
// const fat=3;//already defined
// const carbohydrate=4;//already defined
const pfc = 5;
const pfcp = 6;
//const price=7;//already defined
const coefficient = 8;
const animalFoodTag = 9;

const useUrl = 1;
const totalClass = -1;

const UNIT = [unitL => 'л.', unitML => 'мл.', unitTeaSpoon => 'ч.л.', unitTableSpoon => 'ст.л.', unitPiece => 'шт.', unitGlass => 'ст.'];
const TAG = [remainder => 'остаток', loss => 'потеря', protein => 'белки', fat => 'жиры', carbohydrate => 'углеводы', pfc => 'бжу', price => 'цена', pfcp => 'бжуц', coefficient => 'коэффициент', animalFoodTag => 'животный белок/жир', b12 => 'b12', fiber => 'клетчатка'];

const MONEYADDON = 'дополнительно';

const DEFAULT_PRICE = "";

const SUBRECIPE_WITH_SUMMARY = 0;
const SUBRECIPE_ONLY = 1;
const SUBRECIPE_SUMMARY_ONLY = 2;
const SUBRECIPE_UNION = 3;
const SUBRECIPE_UNION_GROUP = 4;

const NORM_PFC = [1, .5, .5, 1, .7, .3, 4];
const B12_DAILY_VALUE = [2.4, 3];
const FIBER_DAILY_VALUE = 25;
const ALLOW_EMPTY_RECIPE = 1; //empty recipe is ok

//cann't use const
define('REMAINDER_R', "/" . sregex(TAG[remainder], false) . "\s*[" . NEW_RECIPE . "]/ui");


//ё => е was changed
$alias = [
	'нектарин' => 'нектарины',
	'кориандр' => 'кинза зеленая',
	'помидоры' => 'томаты',
	'помидор' => 'томаты',
	'томат' => 'томаты',
	'масло сливочное(?!\\s+72\.5%|\\s+финское брест-литовск 80%)' => 'масло сливочное 82.5%',
	'сливочное масло' => 'масло сливочное 82.5%',
	'растительное масло' => 'масло подсолнечное рафинированное',
	'масло растительное' => 'масло подсолнечное рафинированное',
	'масло подсолнечное(?!\\s+нерафинированное)' => 'масло подсолнечное рафинированное',
	'болгарский перец' => 'перец болгарский'
	//'later молоко(?!\\s+(2\.5|3\.2|4)%)' => 'молоко 3.2%'
	,
	'черный перец' => 'перец черный горошек',
	'перец черный' => 'перец черный горошек',
	'черный душистый перец' => 'перец душистый горошек',
	'черный перец душистый' => 'перец душистый горошек',
	'душистый черный перец' => 'перец душистый горошек',
	'душистый перец черный' => 'перец душистый горошек',
	'перец черный душистый' => 'перец душистый горошек',
	'перец душистый черный' => 'перец душистый горошек',
	'фарш свиной' => 'фарш котлетный свиной',
	'свиной фарш' => 'фарш котлетный свиной',
	'абрикосы' => 'абрикос',
	'баклажан' => 'баклажаны',
	'банан' => 'бананы',
	'груши' => 'груша',
	'кабачок' => 'кабачки',
	'картошка' => 'картофель',
	'мандарины' => 'мандарин',
	'огурец' => 'огурцы',
	'персики' => 'персик',
	'сливы' => 'слива',
	'яблоки' => 'яблоко',
	'апельсины' => 'апельсин',
	'зеленый лук' => 'лук зеленый',
	'печень куриная' => 'печень цыпленка бройлера',
	'капуста квашеная' => 'квашеная капуста',
	'куриная грудка' => 'филе куриной грудки'
];

connect();

getLogin(); //setup $jm_user

$ADDONS = readAddons($jm_user);
$eggMass = explode(" ", $ADDONS['egg_purified_mass_grams_by_category']);

$result = $mysqli->query("SELECT name FROM `money_goods_$jm_user` WHERE food=1") or die('error on line' . __LINE__ . $mysqli->error);
$good_names = [];
while ($row = $result->fetch_array()) {
	$good_names[] = normalName($row[0]);
}

$result = $mysqli->query("SELECT name FROM money_goods_slovesno where name regexp '^молоко.+%$'") or  die('error line' . __LINE__ . $mysqli->error);
$a = [];
while ($r = $result->fetch_row()) {
	$a[] = str_replace(".", "\\.", mb_substr($r[0], mb_strlen('молоко '), -1));
}
$s = implode("|", $a);
$alias["молоко(?!\\s+($s)%)"] = 'молоко 3.2%';

//name, namel, unitmass, unittype, unitn
function parseNameMass($s, $shouldbeinbase)
{
	global $eggMass, $good_names;
	$i = 0;
	$found = false;
	// if(preg_match("/([a-z])([а-яё])|([а-яё])([a-z])/ui",$s,$g)){
	// 	diec(true,"в слове встречаются русские и английские буквы [".var_export($g[0],1)."]",__LINE__,$s);
	// }
	foreach (["(яйцо)" . pureMaths . "\s*([cсд])([0-3овo])", "(.+?)" . po] as $re) {
		if (preg_match("/^$re$/ui", $s, $g)) {
			$n = trim($g[1]);
			$nl = getNamel($n);
			if ($i == 0) {
				//TODO 'яйцо 2co 100г', 'яйцо 100г 2co' error		
				$i = mb_strtolower($g[4]);
				$category = is_numeric($i) ? $i + 1 : intval($i != "в");
				$mass = $eggMass[$category];
				$type = $g[3] . $g[4];
			} else {
				$b = getMass($nl, count($g) == 3 ? 'г' : mb_strtolower($g[3]));
				$mass = $b[0];
				$type = $b[1];
			}

			if ($shouldbeinbase) {
				//as first try to find full string 'лук' 'лук зеленый'
				if (in_array($nl, $good_names)) {
					$found = $nl;
				} else {
					foreach ($good_names as $e) {
						/*мука для ириса. Рис shouldn't be found so use preg_match
					name='окунь филе н/к замороженный' so use ~ in regex
					cann't use \b at the end because of name='творог 9%' $nl='творог 9% 540'
					*/
						$b = str_replace('.', '\\.', $e);
						if (preg_match("~\\b$b(\\s|$)~iu", $nl)) {
							diec($found, "найдено два товара '$found' и '$e' в строке '$s'", __LINE__);
							$found = $e;
						}
					}
					diec($found === false, "товар не найден в строке '$s'", __LINE__);
				}
			}
			$v = getMathValue($g[2]);
			diec($v === false, "ошибка при вычислении выражения '$g[2]'", __LINE__, "строка $s");
			//var_dump($type);
			return [
				name => $n,
				namel => $shouldbeinbase ? $found : $nl,
				unitmass => $mass,
				unittype => $type,
				unitn => $v
			];
		}
		$i++;
	}
	return false;
}

function normalName($name)
{
	return str_replace('ё', 'е', mb_strtolower($name));
}

function getNamel($name)
{
	global $alias;
	//'ё'=>'е' кинза зелёная
	$n = normalName($name);
	foreach ($alias as $k => $v) {
		//растительное масло для жарки pancakes recipe if(preg_match("/^$k$/iu",$n)){
		if (preg_match("/$k/iu", $n)) {
			$n = $v;
			break;
		}
	}
	return $n;
}

function getMass($name, $measure)
{
	global $predefinedPieceMass;
	$unit = unitGrams;
	$m = 1;
	if ($measure == 'кг') {
		$m = 1000;
	} elseif ($measure == '%') {
		$unit = unitPercent;
	} elseif (mb_substr($measure, 0, 1) == 'ш') {
		$unit = unitPiece;
		diec(!array_key_exists($name, $predefinedPieceMass), "не задана масса штуки для продукта " . $name, __LINE__);
		$m = $predefinedPieceMass[$name];
	} elseif ($measure == 'мл' || $measure == 'л') {
		if ($measure == 'л') {
			$unit = unitL;
			$m = 1000;
		} else {
			$unit = unitML;
		}
		$v = getGoodsKeys($name, 'density', false);
		if ($v === false) {
			$v = 1;
		} else {
			$v = $v[0];
		}
		$m *= $v;
	} else {
		$tableSpoon = preg_match("/" . tableSpoon . "/", $measure);
		$teaSpoon = preg_match("/" . teaSpoon . "/", $measure); //int if pattern is correct
		//mb_substr after ст.л. check
		if ($tableSpoon || $teaSpoon || mb_substr($measure, 0, 2) == 'ст') {
			$i = $tableSpoon ? 0 : ($teaSpoon ? 1 : 2);
			if (array_key_exists($name, PREDEFINED_MASS)) {
				$unit = [unitTableSpoon, unitTeaSpoon, unitGlass][$i];
				$m = PREDEFINED_MASS[$name][$i];
			} else {
				$m = ['столовой ложки', 'чайной ложки', 'стакана'][$i];
				diec(true, "не задана масса $m ложки для продукта ", __LINE__, "[$name]");
			}
		}
	}
	return [$m, $unit];
}

function getMathValue($m, $check = true)
{
	if (preg_match("/^" . pureMathBase . "$/u", $m)) {
		try {
			$r = eval("return " . str_replace(mb_str_split(rfrom), rto, $m) . ";");
			if ($check) {
				diec(is_numeric($r) && $r < 0, "задано отрицательное значение", __LINE__, $m);
			}
			return $r;
		} catch (Throwable $e) { //catch all exceptions, do not remove $e not working on php7.4
			// echo $e->getMessage();
		}
	}
	return false;
}

function diec($condition, $text, $line, $value = '')
{
	global $globalthrow;
	if ($condition) {
		$s = "$text" . ($value == '' ? '' : " '$value'") . " строка$line";
		if ($globalthrow) {
			throw new Exception($s);
		}
		die("</table>$s");
	}
}

$calorieTable = 'calorie_slovesno';

function getLogin()
{
	global $jm_user, $jm_pwd;
	if (isset($_COOKIE[JM_USER_COOKIE]) && isset($_COOKIE[JM_PWD_COOKIE])) {
		$jm_user = $_COOKIE[JM_USER_COOKIE];
		$jm_pwd = $_COOKIE[JM_PWD_COOKIE];
		if (checkUserPassword($jm_user, $jm_pwd)) {
			setCookies();
			set_calorie_table();
			return true;
		}
		// if (isJmValidUser()) { //after login as if login/password isn't stored
		// 	return true;
		// }
	}
	$jm_user = JM_SUPERUSER;
	$jm_pwd = ''; //reset cookie password if user was deleted
	return false;
}

function getLoginUP($user, $pwd)
{
	global $jm_user, $jm_pwd;
	if (checkUserPassword($user, $pwd)) {
		$jm_user = $user;
		$jm_pwd = $pwd;
		set_calorie_table();
		setCookies();
		return true;
	}
	return false;
}

function set_calorie_table()
{
	global $calorieTable, $jm_user;
	$calorieTable = "`calorie_$jm_user`";
}

function isUserExists($jm_user)
{
	global $mysqli;
	$r = $mysqli->query("SELECT 1 FROM users WHERE user='$jm_user'") or die('error on line' . __LINE__ . $mysqli->error);
	return $r->num_rows == 1;
}

function recipe($options)
{
	global $globalthrow;
	$globalthrow = 1; //for diec
	try {
		return recipe_inner($options);
	} catch (Exception $e) {
		return $e->getMessage();
	}
}

function recipe_inner($options)
{
	global $params, $eggMass, $fullData, $filteredData, $url, $recipeFirstLine, $mysqli, $jm_user, $alias;
	$out = '';
	$params = [
		'columns' => array_values(COLUMNS),
		'title' => 1,
		'table' => 1,
		'rkgformula' => 1,
		'subrecipes' => 0,
		'check' => 0,
		'goods' => 0,
		'date' => date('Y-m-d'),
		'price' => DEFAULT_PRICE,
		'show_summary_costs' => 1,
		'numbers' => 0,
		'proteinPerKg' => 0
	];

	foreach ($params as $k => $v) {
		if (isset($options[$k])) {
			if ($k == 'columns') {
				foreach (json_decode($options[$k], 1) as $k1 => $v1) {
					$i = is_numeric($k1) ? $k1 : array_search($k1, array_keys(COLUMNS));
					if ($i !== false) {
						$params[$k][$i] = $v1;
					}
				}
			} else {
				$params[$k] = json_decode($options[$k]);
			}
		}
	}

	$allrecipes = ['columns' => filterColumns(array_keys(COLUMNS))];

	$b = isset($options['mass']);
	$i = $b + isset($options['days']);
	diec($i == 1, $b ? 'задана масса, без указания числа дней' : 'задано число дней масса, без указания массы', __LINE__);
	$manmassFromTitle = false;
	if ($i) {
		$manmass = $options['mass'];
		$days = $options['days'];
		if ($manmass == 'fromtitle') {
			$manmassFromTitle = true;
		} else {
			diec(!is_numeric($manmass), 'масса человека не является числом', __LINE__);
			diec($manmass <= 0, 'масса человека должна быть неотрицательным числом', __LINE__);
		}
		diec(!is_numeric($days), 'число дней не является числом', __LINE__);
		diec($days <= 0, 'число дней должно быть неотрицательным числом ', __LINE__);
	}

	/*after eggMass
15/214=0.070093457943925
50/1412=0.035410764872521
15/105=0.142857142857143
*/
	$predefinedPieceMass = PREDEFINED_PIECE_MASS;
	$predefinedPieceMass['яйцо'] = $eggMass[1];

	if ($params['goods'] == 2) {
		$data = "";
	} else {
		diec(!isset($options['p']), 'не установлен параметр p', __LINE__);
		$data = $options['p'];
		if (!in_array($data, ['loss_all', 'predefined_all'])) {
			if ($params['subrecipes'] == SUBRECIPE_UNION) {
				$ar = preg_split("/\r?\n/", trim($data));
				$s = '';
				unset($p);
				foreach (array_filter($ar, fn($e) => !empty($e) && !preg_match('/^\s*&/', $e)) as $e) {
					if (str_contains(NEW_RECIPE, $e[0])) {
						if ($s != '') {
							if (isset($p)) { //for вартушка
								$s .= "\n" . $p;
							}
						}
						$p = '&' . mb_substr($e, 1);
					} else {
						$s .= "\n" . $e;
					}
				}
				if (isset($p)) {
					$s .= "\n" . $p;
				}
				$data = $s;
			} elseif ($params['subrecipes'] == SUBRECIPE_UNION_GROUP) {
				$ar = preg_split("/\r?\n/", trim($data));
				$t = [];
				foreach (array_filter($ar, fn($e) => preg_match('/^\s*[^&#]/', $e)) as $e) {
					if (str_contains(COMMENT_TAG, mb_substr($e, 0, 1))) {
						continue;
					}
					$re = "(.+?)" . po . "(.*)";
					if (preg_match("/^$re$/ui", $e, $g)) {
						$a = parse($e);
						diec($a === false, "не распознан товар в строке [$e].", __LINE__);
						$n = $a[namel];
						if (!array_key_exists($n, $t)) {
							//create addon string									
							$addon = array_reduce([protein, fat, carbohydrate], fn($c, $e) => $c . " " . $a[$e], "бжу");
							if ($a[animalProtein] != 0 || $a[saturatedFat] != 0) {
								$addon .= array_reduce([animalProtein, saturatedFat], fn($c, $e) => $c . " " . $a[$e], " животный белок/жир");
							}
							$i = -1;
							foreach ([b12, fiber] as $e) {
								$i++;
								if ($a[$e] != 0) {
									$addon .=  " " . ['b12', 'клетчатка'][$i] . " " . $a[$e];
								}
							}
							$t[$n] = [0, $addon];
						}
						$t[$n][0] += $a[massv];
					}
				}
				$s = '';
				foreach ($t as $k => $v) {
					if (!empty($s)) {
						$s .= "\n";
					}
					$s .= "$k $v[0] $v[1]";
				}
				$data = $s;
			}
		}
	}

	if ($params['goods']) {
		$good_with_check = [];
		$q = nameRegexDate('t.name');
		$result = $mysqli->query("SELECT name FROM `money_goods_$jm_user` as t WHERE food=1 AND `has check`=1 AND EXISTS(
	SELECT 1 FROM `money_$jm_user` WHERE $q LIMIT 1)") or die('error on line' . __LINE__ . $mysqli->error);
		while ($row = $result->fetch_array()) {
			$good_with_check[] = $row[0];
		}
	}

	if ($params['check']) {
		//$d=$data;
		$d = implode("\n", getUncommentTextForParse(atProceed($data)));
		$data = '';
		foreach (explode("\n", $d) as $e) {
			if (trim($e) == '') {
				continue;
			}
			if (preg_match("~^(/\*)?@?~", $e, $m)) {
				$a = substr($e, strlen($m[0]));
			} else {
				$a = $e;
			}
			$b = $a;
			foreach (['\d+(\.\d+)?\*\d+(\.\d+)?', '\d+(\.\d+)?(к?г|м?л)'] as $e) {
				$b = preg_replace("~$e~ui", '', $b);
			}
			$s = trim($b);
			if (preg_match("~яйцо.*\s*(?:[cсд])([0-3овo])\s*(\d+)штук.*?(\d+(?:\.\d+)?)~ui", $s, $g)) {
				$c = $g[1];
				$quantity = $g[2];
				$i = mb_strtolower($c);
				$category = is_numeric($i) ? $i + 1 : intval($i != "в");
				$mass = $eggMass[$category];
				$s = "яйцо {$quantity}c$c ц$g[3]*1000/($quantity*$mass)";
			} else {
				$r = parseMassPrice($a);
				diec($r['mass'] == UNKNOWN, "не распознан товар в строке [$a]. Возможно нужно снять галочку 'чек'", __LINE__);
				//@масло подсолнечное рафинированное 0.9л 4*97.99 need $r['quantity']
				$s .= " " . $r['mass'] * $r['quantity'] . ($r['kg'] ? 'кг' : 'л');
				$massLoss = 0;
				$density = 1;
				//need check massloss for every good
				foreach ($good_names as $g) {
					if (str_contains($a, $g)) {
						$k = getGoodsKeys($g, ['mass loss', 'density']);
						$massLoss = $k[0];
						$density = $k[1];
						break;
					}
				}
				$s .= ' ц' . $r['price'];
				if ($r['pricePerKg']) {
				} else {
					$s .= "/(" . $r['mass'] . ($r['kg'] ? '' : '*' . $density) . ")";
				}
				if ($massLoss != 0) {
					//formatNumber for garlic
					$s .= "/" . formatNumber(1 - $massLoss, 2);
				}
			}
			$data .= $s . "\n";
		}
	}
	$dl = strtolower($data);
	if ($dl == 'loss_all' /*|| $_SERVER['QUERY_STRING'] == 'loss'*/) {
		$a = [];
		if (!($result = $mysqli->query("SELECT name,protein, fat, carbohydrate FROM `money_goods_$jm_user` where food=1")))
			return 'error on line' . __LINE__ . $mysqli->error;
		while ($r = $result->fetch_array()) {
			$a[] = [$r[0], floatval($r[1]), floatval($r[2]), floatval($r[3])];
		}
		return json_encode($a);
	} elseif (preg_match('/^predefined(\d|_all)$/', $dl, $g)) {
		$a = [PREDEFINED_MASS, $predefinedPieceMass, $alias, $eggMass];
		for ($i = 0; $i < 2; $i++) {
			$d = [];
			$j = $i ? '' : ',density';
			if (!($result = $mysqli->query("SELECT name$j,protein,fat,carbohydrate FROM `money_goods_$jm_user` where " . ($i ? "`has check`<>1" : "density!=1"))))
				return 'error on line' . __LINE__ . $mysqli->error;
			while ($row = $result->fetch_row()) {
				//$d[] = $row;
				$d[$row[0]] = array_slice($row, 1);
			}
			$a[] = $d;
		}

		if ($dl != 'predefined_all') {
			$a = [$a[$g[1]]];
		}
		$r = [];
		foreach ($a as $e) {
			$b = [];
			foreach ($e as $k => $v) {
				$b[] = [$k, $v];
			}
			$r[] = $b;
		}
		return json_encode($r);
	}

	$filteredData = [];
	$fullData = [];
	diec(!ALLOW_EMPTY_RECIPE && $params['goods'] == 0 && empty($data), 'нет данных', __LINE__);

	/*need empty check if(!empty($filteredData)){
/люда изи кук
/https://www.youtube.com/watch?v=q9iIyUOuq7E
#ватрушка на песочном тесте
...
*/
	$url = [];
	$line = 0;
	$firstNoncommentString = false;
	$ar = preg_split("/\r?\n/", $data);
	for ($i = count($ar) - 1; $i > 0 && empty(trim($ar[$i])); $i--); //remove empty rows at the end need for global multiplier check
	array_splice($ar, $i + 1);
	$car = count($ar);
	$mul = null; //global multiplier
	/*example for global multiplier
2/3{
чебуреки
/https://www.youtube.com/watch?v=Fgm__UK8yuU
мука 300
вода 150
соль 0.5ч.л.
масло подсолнечное 1стл
тесто
фарш свиной 300
лук 200
соль 1чл
перец черный 3
вода 100
начинка
масло подсолнечное 60
масло для жарки
}
*/
	foreach ($ar as $dataItem) {
		$line++;
		$i = $line - 1;
		//need /u modifier otherwise Р russain char is d0a0 a0 is space symbols
		$s = trim(preg_replace('/\s+/u', ' ', $dataItem));
		if ($mul !== null && $i == $car - 1) {
			continue;
		}
		if (strlen($s) == 0 || str_contains(COMMENT_TAG, mb_substr($s, 0, 1))) {
			if (useUrl && preg_match("~https?://(www\.)?([^<\s]+)~", $s, $g)) {
				$url[] = [$g[0], $g[2], $line];
			}
			continue;
		}
		if (!$firstNoncommentString) {
			if ($mul === null && str_ends_with($s, '{') && $i + 1 < $car) {
				$n = preg_match("/^(.*?)" . pureMaths . "\s*\{$/", $s, $g);
				/*valid recipe so need to check empty($g[1])
				квашеная капуста 207{
капуста 1000
морковь 60
соль 20
сахар 10`
}
лук 37
масло подсолнечное нерафинированное 12
				*/
				if ($n && empty($g[1])) { //only if coefficent
					diec($car < 2 || trim($ar[$car - 1]) != '}', 'нет закрывающей скобки для {', __LINE__);
					$mul = parseGetV($g[2]);
					continue;
				}
			}
			$firstNoncommentString = true;
			$b = false;
			$a = getRemoveParameter($s, MONEYADDON);
			if (is_array($a)) {
				$b = true;
			}

			if (!str_contains(NEW_RECIPE, $s[0]) && !$b && (str_ends_with($s, '{') || parse($s))) {
				$filteredData[] = $params['subrecipes'] == SUBRECIPE_UNION_GROUP ? 'Рецепт сгруппированный по продуктам' : 'неизвестный рецепт';
			}
		}

		if (str_contains(NEW_RECIPE, $s[0])) {
			addFullData();
			$filteredData = [];
			$s = mb_substr($s, 1);
		}
		if (empty($filteredData)) {
			$recipeFirstLine = $line;
		}
		$filteredData[] = $s;
	}
	addFullData();

	if ($params['goods']) {
		$a = array_map(fn($e) => $e . ' 100', $good_with_check);
		array_unshift($a, 'все продукты, количество - ' . count($good_with_check));
		$fullData[] = $a;
	} else {
		diec(!ALLOW_EMPTY_RECIPE && count($fullData) == 0, 'нет данных', __LINE__);
	}

	foreach ($fullData as $fd) {
		[$title, $rows] = parseRecipe($fd, null, $mul === null ? 1 : $mul);

		$r = [];
		if ($params['title']) {
			$r['title'] = $title;
		}

		$ta = [];
		$animalProtein = [0, 0];
		$saturatedFat = [0, 0];

		foreach ($rows as $a) {
			$bold = $a[boldIndex];
			$c = $a[colorIndex];
			if ($bold) {
				foreach ([protein, ccaltotal, pricetotal, massv] as $k) {
					$ta[$k][$c] = $a[$k];
				}
			} else {
				for ($i = 0; $i < 2; $i++) {
					$animalProtein[$i] += ($i ? $a[animalProtein] : 1 - $a[animalProtein]) * $a[protein] * $a[massv] / 100;
					$saturatedFat[$i] += ($i ? $a[saturatedFat] : 1 - $a[saturatedFat]) * $a[fat] * $a[massv] / 100;
				}
				foreach ([massv] as $k) {
					$ta[$k][$c] = $a[$k];
				}
			}
		}

		$n = -1;
		$lastBaseIndex = 0;
		$counter = 0;
		foreach ($rows as $a) {
			$bold = $a[boldIndex];
			$c = $a[colorIndex];
			$n++;
			if ($n == 0 || $rows[$n - 1][boldIndex] && $params['subrecipes'] == SUBRECIPE_WITH_SUMMARY) {
				$lastBaseIndex = $n;
			}
			if ($c != totalClass && (in_array($params['subrecipes'], [SUBRECIPE_ONLY, SUBRECIPE_UNION_GROUP]) && $bold || in_array($params['subrecipes'], [SUBRECIPE_SUMMARY_ONLY, SUBRECIPE_UNION]) && !$bold)) {
				continue;
			}
			if ($bold) {
				$counter = 0;
			} else {
				$counter++;
			}
			$row = [];
			for ($i = 0; $i <= comment; $i++) {
				if ($i == mass && array_key_exists(massv, $a)) {
					if (array_key_exists(massbegin, $a)) {
						$j = $a[massbegin];
					} else {
						$j = $a[massv];
					}
				} elseif ($i == price && array_key_exists(pricev, $a)) {
					$j = $a[pricev];
				} elseif ($a[$i] === ZERO_DIV_ZERO) {
					$j = 0; //for normal sort in table
				} elseif ($a[$i] === INFINITY) {
					$j = PHP_FLOAT_MAX;
				} elseif (is_numeric($a[$i])) {
					$j = floatval($a[$i]);
				} else {
					$j = $a[$i];
				}
				$b = $a[$i];
				if ($params['numbers'] && $i == name && !$bold) {
					$b = $counter . " " . $b;
				}
				$row[] = [ro($b, in_array($i, [price, price1000ccal, pricetotal]) ? PRICE_DIGITS : DIGITS), $j];
				if ($i == mass) {
					$row[] = getPercent($bold, $c, $ta, massv, $a);
				}
				if ($i == mass) {
					if ($lastBaseIndex == $n) {
						$sort = 0;
						$v = $bold ? '' : 'база'; //$bold for last summary row
					} else {
						$bm = $rows[$lastBaseIndex][massbegin];
						// diec($bm == 0, 'масса базового продукта равна нулю'.$a[massbegin], __LINE__);
						//make clove, black pepper non zero output
						if ($bm == 0) {
							$sort = $a[massbegin] == 0 ? NAN : INF;
							$v = ($a[massbegin] == 0 ? '0/0' : '&inf;') . '%';
						} else {
							$sort = $a[massbegin] * 100 / $bm;
							$v =  formatNonZero($sort, 1) . '%';
						}
					}
					$row[] = [$v, $sort];
				}
				if ($i == ccaltotal) {
					$row[] = getPercent($bold, $c, $ta, ccaltotal, $a);
				}
				if ($i == pricetotal) { //before comment
					$row[] = getPercent($bold, $c, $ta, pricetotal, $a);
					$row[] = getPercent($bold, $c, $ta, protein, $a, true);
					$v = mdiv($a[$bold ? price : pricev], $a[protein], .1);
					$row[] = [ro($v, PRICE_DIGITS), $v == INFINITY ? PHP_FLOAT_MAX : $v];
					foreach ([b12, b12Total, fiber, fiberTotal] as $e) {
						$row[] = [ro($a[$e], PRICE_DIGITS), $a[$e]];
					}
				}
			}

			$r['data'][] = array_merge(
				['class' => 'c' . $c % TOTAL_CSS_COLORS . ($bold ? ' bold' : '')],
				filterColumns($row)
			);
		}

		if (!$params['table']) {
			if ($params['title']) {
				$out .= "<h3>" . $r['title'] . "</h3>";
			}
			$out .= "<table class='single'><tr><th>" . implode('<th>', $allrecipes['columns']);
			foreach ($r['data'] as $e) {
				$out .= '<tr class="' . $e['class'] . '">';
				//cann't use foreach() because of key 'class'
				for ($i = 0; $i < count($allrecipes['columns']); $i++) {
					$out .= "<td>" . $e[$i][0];
				}
			}
			$out .= '</table>';
		}

		$b = isset($options['price']) && $options['price'] != DEFAULT_PRICE;
		$b0 = isset($manmass);
		if ($b0 || $b) {
			$s = '';
			if ($b) {
				$i = -1;
				foreach (preg_split("/\s+/", trim($options['price'])) as $e) { //allow several prices
					$i++;
					if ($i) {
						$s .= ', ';
					}
					$v1 = getMathValue($e, false);
					if ($v1 === false) {
						$s .= "неверно задана цена $e";
					} elseif ($v1 < 0) {
						$s .= "задана отрицательная цена $e";
					} else {
						$v2 = $a[price];
						if ($v1 == $v2) {
							$s .= 'цены одинаковы';
						} elseif ($v1 == 0 || $v2 == 0) {
							$s .= 'цена равна нулю';
						} else {
							$k = $v1 / $v2;
							$ks = formatNumber($k > 1 ? $k : 1 / $k, 1);
							$i = intval($ks);
							$i100 = $i % 100;
							$i10 = $i % 10;
							if (str_contains($ks, '.')) {
								$ka = 'раза';
							} else {
								$ka = $i100 > 10 && $i100 < 20 || $i10 == 0 || $i10 > 4 ? 'раз' : ($i10 == 1 ? 'раз' : 'раза');
							}
							$s .= "цена в $ks $ka " . ($k > 1 ? 'меньше' : 'больше');
							//$s .= "продукт в $ks $ka " . ($k > 1 ? 'дешевле' : 'дороже');
						}
					}
				}
			}

			if ($b0) {
				if ($manmassFromTitle) {
					$q = preg_split("/\s+/", $title);
					diec(count($q) < 2, 'масса человека не задана в заголовке, опция fromtitle', __LINE__);
					$manmass = $q[1];
					diec(!is_numeric($manmass), 'масса человека в заголовке не является числом', __LINE__);
					diec($manmass <= 0, 'масса человека в заголовке должна быть неотрицательным числом', __LINE__);
				}
				if ($b) {
					$s .= '<br>';
				}
				for ($j = 0; $j < 2; $j++) {
					$s .= $j ? '<br>масса еды' : 'килокалорий';
					for ($i = 0; $i < ($days == 1 ? 1 : 2); $i++) {
						$f = $a[$j ? massv : ccaltotal] / ($i ? 1 : $days);
						if ($i) {
							$s .= ", ";
						}
						$s .= " " . ($i ? "всего " . ($j ? "еды" : "килокалорий") : "в сутки") . " " . formatNumber(round($f), 3);
						if ($i == 0 && $j == 0) {
							$s .= " (" . formatNumber($a[ccaltotal] / $manmass / $days, 2) . " на кг)";
						}
						if (!$j) {
							$l = $params['proteinPerKg'] === 1.6 ? (1.6 * 4 + 9 + 4.7 * 4) : 29;
							$s .= " или " . ro($f * 100 / ($manmass * $l)) . "% суточной нормы";
						}
					}
				}
				$s .= ", масса человека " . formatNumber($manmass, 1);

				if ($params['proteinPerKg']) {
					$l = $a[protein] * $a[massv] / 100 / $days; //всего белка съедено
					$j = $params['proteinPerKg'];
					$q = array_map(fn($e) => $e == '-0' ? '0' : $e, [formatNumber($manmass * $j - $l, 1), formatNumber($j - $l / $manmass, 2)]);
					$s .= ", осталось белка $q[0], г/кг $q[1]";
				}
				//$s .= ", дней $days";

				//$x = 31 day need 31*$manmass*29/1000*$a[price1000ccal] ccal
				if ($params['show_summary_costs']) {
					for ($i = 0; $i < 2; $i++) {
						$j = $i ? 31 : 1;
						$f1 = ($j == 1 ? '' : "$j*") . "$manmass*29/1000*" . $a[price1000ccal];
						$s .= ($i ? ", " : "<br>расходы") . " на $j день $f1 = " . ro(getMathValue($f1), 2) . " рублей";
					}
				}
				$s .= "<br>соотношения бжу ";
				for ($j = 0; $j < 3; $j++) {
					if ($j) {
						$s .= " или ";
					}
					for ($i = 0; $i < 3; $i++) {
						if ($i) {
							$s .= " : ";
						}
						$k = $j == 2 ? 4 : 1;
						$s .= $a[$j + protein] == 0 ? formatNumber($a[$i + protein] * $k, 1) . "/0" : formatNumber($a[$i + protein] * $k / $a[$j + protein], 1);
					}
				}
				$s .= ", бжу% ";
				for ($i = 0; $i < 3; $i++) {
					if ($i) {
						$s .= " : ";
					}
					$k = $i == 1 ? 9 : 4;
					$s .= ($a[ccaltotal] == 0 ? ZERO_DIV_ZERO : round($a[$i + protein] * $k * $a[massv] / $a[ccaltotal]));
				}
				$s .= ", бжу в сутки ";
				for ($k = 0; $k < 3; $k++) {
					if ($k) {
						$s .= " : ";
					}
					$l = $a[$k + protein] * $a[massv] / 100 / $days;
					$s .= formatNumber($l, 1);
				}
				$s .=  "<br>бжу/кг в сутки ";
				$d = [];
				for ($k = 0; $k < 3; $k++) {
					if ($k) {
						$s .= " : ";
					}
					$l = $a[$k + protein] * $a[massv] / 100 / $manmass / $days;
					$d[] = $l;
					$s .= formatNumber($l, 2);
					/*
				if ($k < 2) {
					$b = $k == 0 ? $animalProtein : $saturatedFat;
					for ($j = 0; $j < 2; $j++) {
						$m = $b[$j] / $manmass / $days;
						$d[] = $m;
					}
				}*/
				}
				$l = ($d[1] - 1) * 9 / 4 + $d[2];
				$s .= ', углеводный эквивалент ' . formatNumber($l, 2) . ' или ' . formatNumber($l * 100 / 4.5, 1) . '%';
			}
			if ($params['table']) {
				$r['addon'] = $s;
			} else {
				$out .= $s;
			}
		}
		$allrecipes['data'][] = $r;
	}
	return $params['table'] ? json_encode($allrecipes, JSON_UNESCAPED_UNICODE) : $out;
}

//mb_strlen('товара нет в чеках цена=0 (по умолчанию)') = 39
function ro($n, $digits = DIGITS)
{
	if (is_numeric($n)) {
		//123.9999999999995
		return formatNumber($n, $digits); //." $digits";
	} else {
		$l = mb_strlen($n);
		if ($l <= 39) {
			return $n;
		}
		//return "<span style='font-size:75%'>$n</span>";
		return "<span style='font-size:" . round(100 * 39 / $l) . "%'>$n</span>";
	}
}

function getPercent($bold, $c, $ta, $key, $a, $useMass = false)
{
	global $params;
	$ct = $ta[$key];
	if ($bold) {
		if ($c == totalClass) {
			$p = ''; //кк% needs empty string
		} else {
			$v = removeSpaces($ct[totalClass]);
			// $v==0 кк%
			$p = $v == 0 ? MAIN_TABLE_ZERO_DIV_ZERO_STRING : (removeSpaces($a[$key]) * ($useMass ? $a[massv] / $ta[massv][totalClass] : 1) / $v);
		}
	} else {
		$k = $params['subrecipes'] == SUBRECIPE_WITH_SUMMARY && array_key_exists($c, $ct) && count($ta[massv]) > 2 ? $c : totalClass;
		if ($useMass && $ta[massv][$k] == 0) {
			$v = INFINITY;
		} else {
			$v = removeSpaces($a[$key]) * ($useMass ? $a[massv] / $ta[massv][$k] : 1);
		}
		$p = mdiv($v, removeSpaces($ct[$k]));
	}
	return  [is_numeric($p) ? ro($p * 100) . '%' : $p, $p];
}

function parseGetV($s)
{
	$n = getMathValue($s);
	diec($n === false, 'ошибка при вычислении выражения', __LINE__, $s);
	diec($n < 0, 'ошибка отрицательное значение', __LINE__, $s);
	return $n;
}

function parse($s, $mul = 1, $data = [])
{
	global $params;
	$originalString = $rs = $s = keyboard($s);
	$f = [];
	$measurePercent = [];
	$measurePercent[loss] = $measurePercent[remainder] = false;
	$startmul = $mul != 1;

	$n = preg_match_all(REMAINDER_R, $rs);
	diec($n > 1, "ошибка таг [" . TAG[remainder] . "] указан больше одного раза", __LINE__, $s);
	$remainderAfter = $n == 1;
	if ($remainderAfter) {
		$rs = preg_replace(REMAINDER_R, "", $rs);
	}

	foreach (TAG as $k => $v) {
		$t = array_search($k, [animalFoodTag, pfc, pfcp, b12, fiber]);
		$mu = $t !== false;
		$l = [2, 3, 4, 1, 1][$t];
		$e = $mu ? $v . str_repeat(pureMaths, $l) : '(' . mb_substr($v, 0, 1) . '(' . mb_substr($v, 1) . ')?)' . pureMaths;
		if ($k == remainder || $k == loss) {
			$e .= '\\s*(%?)';
		}
		//make more hard check can be a problem
		//cann't use / as separator "животный белок/жир"
		$n = preg_match_all("~(?<=[\s\d])$e~ui", $rs, $g, PREG_OFFSET_CAPTURE);
		//add slash ?<![а-яё\/] / because of "капуста б/к 444"
		// $n = preg_match_all("/(?<![а-яё\/])$e/ui", $rs, $g, PREG_OFFSET_CAPTURE);
		diec($n > 1, "ошибка таг [$v] указан больше одного раза [$e]", __LINE__, $s);

		if ($n == 1) {
			if ($k == coefficient) {
				$mul *= parseGetV($g[3][0][0]);
			} else {
				if ($mu) {
					$f[$k] = [];
					for ($i = 1; $i <= $l; $i++) {
						$f[$k][] = parseGetV($g[$i][0][0]);
					}
				} else {
					diec($k == remainder && $remainderAfter, "ошибка таг [$v] указан больше одного раза", __LINE__, $s);
					if (($k == remainder || $k == loss)  && $g[4][0][0] == '%') {
						$measurePercent[$k] = true;
					}
					$f[$k] = parseGetV($g[3][0][0]);
					diec($k == remainder && $f[$k] == 0, 'ошибка остаток=0', __LINE__);
				}
			}
			$n = $g[0][0][1];
			$rs = substr($rs, 0, $n) . substr($rs, $n + strlen($g[0][0][0]));
		}
	}

	$pfca = [];
	$i = 0;
	$pfc = array_key_exists(pfc, $f);
	$pfcp = array_key_exists(pfcp, $f);
	if ($pfcp) {
		if ($pfc) {
			diec(1, "ошибка одновременно задано бжу и бжуц", __LINE__, $s);
		}
		diec(array_key_exists(price, $f), "ошибка одновременно задано бжуц и цена", __LINE__, $s);
		$f[price] = $f[pfcp][3];
	}

	//only protein fat carbohydrate without price
	foreach ([protein, fat, carbohydrate] as $k) {
		$e = array_key_exists($k, $f);
		if ($pfc || $pfcp) {
			$s1 = $pfc ? '' : 'ц';
			diec($e, "ошибка одновременно задано бжу$s1 и " . TAG[$k], __LINE__, $s);
			$pfca[] = $f[$pfc ? pfc : pfcp][$i++];
		} elseif ($e) {
			$pfca[] = $f[$k];
		}
	}
	$pfc = count($pfca);
	diec($pfc == 1 || $pfc == 2, 'белки, жиры, углеводы заданы частично', __LINE__, $s . var_export($pfca, 1));
	//set $a[protein...] later

	$a = parseNameMass(trim($rs), $pfc == 0);
	if (!$a) {
		return false;
	}

	$a[unitn] *= $mul;
	$a[massv] = $a[unitn] * $a[unitmass]; //need for massloss, remainder
	//change $a[massv] for unitPercent 
	if ($a[unittype] == unitPercent) {
		diec(empty($data), 'масса не может быть задана в процентах так как не задана база', __LINE__);
		$a[unittype] = unitGrams; //change type to grams
		$a[massv] *= $data[0][massv] / 100 / $mul;
	}

	if ($pfc == 0) {
		$pfca = getGoodsKeys($a[namel], ['protein', 'fat', 'carbohydrate'], false);
		if ($pfca === false) { //good not found
			return false;
		}
	}
	$i = 0;
	foreach ([protein, fat, carbohydrate] as $e) {
		$a[$e] = $pfca[$i++];
	}

	if (array_key_exists(animalFoodTag, $f)) {
		for ($i = 0; $i < 2; $i++) {
			$v = $a[$i ? saturatedFat : animalProtein] = $f[animalFoodTag][$i];
			diec($v < 0 || $v > 1, 'животный ' . ($i ? 'жир' : 'белок') . ' должен быть от 0 до 1 ' . $originalString, __LINE__);
		}
	} else {
		$v = getGoodsKeys($a[namel], ['animal protein', 'saturated fat'], false);
		if ($v === false) {
			$a[animalProtein] = 0;
			$a[saturatedFat] = 0;
		} else {
			$a[animalProtein] = $v[0];
			$a[saturatedFat] = $v[1];
		}
	}

	//set price, comment
	if (array_key_exists(price, $f)) {
		$priceFormula = $f[price];
		$comment = 'цена указана пользователем';
	} else {
		$v = getGoodsKeys($a[namel], 'has check', false);
		if ($v !== false && $v[0] == 1) {
			$k = getPriceComment($a[namel]);
			$priceFormula = $k[0];
			$comment = $k[1];
		} else {
			$priceFormula = 0;
			$comment = "товара нет в чеках цена=0 (по умолчанию)";
		}
	}

	$a[comment] = $comment;

	/*only loss set
	price = price*mass/(mass-loss)

	only remainder set
	price = price*mass/remainder

	loss and remainder set (same with only remainder set)
	price=price*mass/(mass-loss) * (mass-loss)/remainder = price*mass/remainder
	loss and remainder set example
	price=10 mass=1000
	loss=500 price=20
	remainder=200 price=20*500/200=50=price*mass/remainder
	*/
	//modify remainder loss
	$m = $a[massv];
	$ms = chr(1);
	//need to set anyway
	$a[lossall] = array_key_exists(loss, $f) && ($measurePercent[loss] && $f[loss] == 100
		|| !$measurePercent[loss] && $f[loss] == $m);

	if (!$measurePercent[loss] && array_key_exists(loss, $f)) {
		$f[loss] *= $mul;
	}
	if (!$measurePercent[remainder] && array_key_exists(remainder, $f)) {
		$f[remainder] *= $mul;
	}

	if (array_key_exists(remainder, $f)) {
		diec($a[lossall], 'ошибка задан остаток при потере массы 100%', __LINE__);
		if ($priceFormula != "0") {
			if (!$measurePercent[remainder] && $m != $f[remainder]) {
				$priceFormula .= "*$ms/" . round($f[remainder], 2);
			} elseif ($measurePercent[remainder] && $f[remainder] != 100) {
				$priceFormula .= "*100/" . round($f[remainder], 2);
			}
		}
	} elseif (array_key_exists(loss, $f)) {
		if ($priceFormula != "0" && !$a[lossall]) {
			if ($measurePercent[loss]) {
				if ($f[loss] != 0) {
					$priceFormula .= "/(1-" . $f[loss] . "/100)";
				}
			} else {
				if ($f[loss] != 0) {
					$priceFormula .= "*$ms/($ms-" . $f[loss] . ")";
				}
			}
		}
	}

	if ($measurePercent[loss]) {
		$f[loss] *= $m / 100;
	}
	if ($measurePercent[remainder]) {
		$f[remainder] *= $m / 100;
	}

	if (array_key_exists(loss, $f)) {
		$m = $a[massv];
		$a[massv] = $m - $f[loss];
		diec($a[massv] < 0, 'ошибка потеря массы больше массы масса=' . $m, __LINE__);
	}

	//$a[massv] can be changed
	if (array_key_exists(remainder, $f)) {
		$k = $a[massv] / $f[remainder];
		diec($k < 1, 'ошибка остаток больше массы', __LINE__, $f[remainder] . " &gt;" . $a[massv] . " " . $originalString);
		foreach ([protein, fat, carbohydrate] as $i) {
			$a[$i] *= $k;
		}
		$a[massv] = $f[remainder];
	}
	$a[pricev] = $priceFormula === INFINITY ? INFINITY : getMathValue(str_replace($ms, $m, $priceFormula), false);
	//need to replace mass if it's number with many digits after point /укроп 24*1000/1646 п10
	$pfs = str_replace($ms, round($m, 2), $priceFormula);
	$a[price] =	($params['rkgformula'] ? (preg_match("/[*\/]/", $priceFormula) ? "$pfs=" : '') : '') . ro($a[pricev], PRICE_DIGITS);

	//after mass loss modification
	foreach ([protein, fat, carbohydrate] as $e) {
		diec($a[$e] > 100, "ошибка " . TAG[$e] . " > 100", __LINE__);
	}
	diec($a[protein] + $a[carbohydrate] + $a[fat] > 100, 'ошибка б+ж+у > 100', __LINE__);
	$a[ccal] = ($a[protein] + $a[carbohydrate]) * 4 + $a[fat] * 9;
	//if p+f+c<=100 then 4p+9f+4c<=900 because
	//4p+9f+4c=4(p+f+c)+5f<=400+5f<=400+500<=900
	//diec($a[ccal]>900,'ошибка ккал/100г > 900',__LINE__);//so not need to check this condition
	$a[ccaltotal] = $a[ccal] * $a[massv] / 100;
	$a[massbegin] = $m;

	if ($a[lossall]) {
		$a[mass] = formatNonZero($m, DIGITS) . " (0)";
	} elseif ($a[unittype] == unitGrams) {
		if (array_key_exists(remainder, $f)) {
			$a[mass] = formatNumber($m, DIGITS);
		} else {
			$a[mass] = $a[massv];
		}
	} else {
		$t = $a[unittype];
		$a[mass] = formatNumber($a[unitn], 2) . (is_string($t) ? $t : UNIT[$t]) . "=" . formatNumber($a[massbegin], 2);
	}
	if (array_key_exists(remainder, $f)) {
		$a[mass] .= " (" . formatNumber($a[massv], DIGITS) . ")";
	}
	$a[price1000ccal] = $a[pricev] === INFINITY ? INFINITY : mdiv($a[pricev], $a[ccal], 100);
	$a[pricetotal] = ro(($a[lossall] ? $m : $a[massv]) / 1000 * $a[pricev], PRICE_DIGITS);
	$a[remainderAfter] = $remainderAfter;
	$a[originalString] = $originalString;

	$i = -1;
	foreach ([b12, fiber] as $e) {
		$i++;
		if (array_key_exists($e, $f)) {
			$v = $f[$e][0]; //array with length=1
			if ($i == 0) {
				diec($v < 0, 'b12<0 ' . $originalString, __LINE__);
			} else {
				diec($v < 0 || $v > 100, 'клетчатка<0 || клетчатка>100' . $originalString, __LINE__);
			}
		} else {
			$v = getGoodsKeys($a[namel],  ['b12', 'fiber'][$i], false); //array with length=1
			$v = $v === false ? 0 : $v[0];
		}
		$a[$e] = $v;
		$a[[b12Total, fiberTotal][$i]] = $a[$e] / 100 * $a[massbegin];
	}

	addPfcTotal($a);
	if ($startmul) {
		$a[mul] = $mul;
	}
	return $a;
}

function mdiv($a, $b, $mul = 1)
{
	return $b == 0 ? ($a == 0 ? ZERO_DIV_ZERO : INFINITY) : $a * $mul / $b;
}

//$n - lowered & modified name
function getGoodsKeys($n, $keys, $dieIfNotFound = true)
{
	global $mysqli, $jm_user;
	$k = "`" . implode("`,`", is_array($keys) ? $keys : [$keys]) . "`";
	$result = $mysqli->query("SELECT $k FROM `money_goods_$jm_user` WHERE REPLACE(LOWER(name), 'ё', 'е')='$n' and food=1") or die('error on line' . __LINE__ . $mysqli->error);
	if ($result->num_rows == 1) {
		return $result->fetch_row();
	}
	if ($dieIfNotFound) {
		diec(true, "товар не найден", __LINE__, $n);
	} else {
		return false;
	}
}

//$n - lowered & modified name
function getPriceComment($n)
{
	global $mysqli, $jm_user, $eggMass, $params;
	$r = getGoodsKeys($n, ['mass loss', 'density']);
	$massLoss = $r[0];
	$density = $r[1];
	$q = nameRegexDate("'$n'");
	$result = $mysqli->query("SELECT text,date,id FROM `money_$jm_user` WHERE $q ORDER BY id DESC LIMIT 1") or die('error on line' . __LINE__ . $mysqli->error);

	diec($result->num_rows == 0, "товар с чеком не найден до даты " . $params['date'], __LINE__, $n);
	$row = $result->fetch_assoc();
	foreach (explode("\n", $row['text']) as $e) {
		$e = mb_strtolower($e);
		//has 'окунь филе н/к замороженный' so use tilde
		if (preg_match("~(^|\s|@|\*)$n($|\s)~iu", $e)) {
			$r = parseMassPrice($e);
			$mass = $r['mass'];
			$price = $r['price'];
			if ($mass == UNKNOWN) {
				//from jm.php changed $a to $e
				$i = preg_match_all("/\b(\d+)\s*штук\b/iu", $e, $gr);
				diec($i == 0, "не задана масса или не установлен счётчик яиц", __LINE__, $e . " checkID=" . $row['id']);
				diec($i > 1, "two or more eggs count set", __LINE__);
				//allow english char C first char in group, and russian chars 2-3 in group С and case insensitive
				$e = str_ireplace("со скидкой", "", $e); //со - category also
				$e = mb_strtolower($e);
				$i = preg_match_all("/\b[cсд]([0-3овo])\b/u", $e, $g1);
				diec($i == 0, "no eggs category set", __LINE__);
				diec($i > 1, "two or more eggs category set", __LINE__);
				$i = mb_strtolower($g1[1][0]);
				$category = is_numeric($i) ? $i + 1 : intval($i != "в");
				$mass = $gr[1][0] * $eggMass[$category] / 1000;
			}

			$s = $price;
			if ($r["pricePerKg"]) {
			} elseif ($r['kg']) {
				if ($mass != 1) {
					$s = "$price/$mass";
				}
			} else {
				if ($mass == 1) {
					if ($density != 1) {
						$s = "$price/$density";
					}
				} else {
					if ($density == 1) {
						$s = "$price/$mass";
					} else {
						$s = "$price/($mass*$density)";
					}
				}
			}
			if ($massLoss != 0) {
				//formatNumber for garlic
				$s .= "/" . formatNumber(1 - $massLoss, 2);
			}

			$c = '/*';
			if (str_starts_with($e, $c)) {
				$e = substr($e, strlen($c));
			}
			//not working month name for russian locale, so use array
			//strtolower(date("jMy", $date))
			$date = strtotime($row['date']);
			return [$s, str_replace('@', '', $e) . " " . date("j", $date) . mb_substr(MONTH_NAMES[intval(date("m", $date)) - 1], 0, 3) . date("y", $date)];
		}
	}
	diec(true, "getPriceComment internal error", __LINE__, $n);
}

function sum($p, $key, $o = 1)
{
	$v = 0;
	foreach ($p as $e) {
		if (!array_key_exists($key, $e) || !is_numeric($e[$key])) {
			return SUM_UNKNOWN;
		}
		$v += $e[$key] * ($o ? $e[massv] / 100 : 1);
	}
	return $v;
}

function getTotal($p, $name, $full = false, $moneyAddon = 0)
{
	if ($full) {
		//copy fields
		foreach ($p as &$v) {
			$v[pricev] = $v[price];
			$v[ccal] = $v[ccaltotal];
		}
		unset($v);
	}

	$mass = sum($p, massv, 0);
	$massbegin = sum($p, massbegin, 0);
	$a = [$name, formatNumber($massbegin, DIGITS) . ($mass == $massbegin ? '' : " (" . formatNumber($mass, DIGITS) . ")")];
	for ($i = protein; $i < ccal; $i++) {
		$v = sum($p, $i);
		$a[] = $mass == 0 || !is_numeric($v) ? 0 : $v / ($mass / 100);
	}
	$totalCalories = sum($p, ccal, !$full);
	//$v equals totalPrice*10. Gives more precise result than sum of pricetotal
	$v = sum($p, pricev);
	if ($v === SUM_UNKNOWN) { //for recipe "ватрушка\nтесто"
		$v = 0;
	}
	$v += $moneyAddon * 10;
	//add lossall
	if (!$full) {
		foreach ($p as $e) {
			if ($e[lossall]) {
				//can be $e[pricetotal] ="1 100"
				$v += removeSpaces($e[pricetotal]) * 10;
			}
		}
	}
	$b = mdiv($v, $totalCalories, 100);

	array_push(
		$a,
		$mass == 0 ? 0 : $totalCalories / ($mass / 100) //'ccal' ccal/100g
		,
		$totalCalories //ccaltotal
		,
		$mass == 0 ? 0 : mdiv($v, $mass, 100) //'price' r/kg
		,
		$mass == 0 ? 0 : (is_numeric($b) ? formatNumber($b, 2) : $b) //r/1000ccal
		,
		is_numeric($v) ? formatNumber($v / 10, 2) : '?' //pricetotal
		,
		'' //comment
	);
	//order by index
	$a[massv] = $mass;
	$a[lossall] = false;
	$a[massbegin] = $massbegin;

	$a[b12Total] = sum($p, b12Total, 0);
	$a[fiberTotal] = sum($p, fiberTotal, 0);
	$a[b12] = $a[massv] == 0 ? MAIN_TABLE_ZERO_DIV_ZERO_STRING : mdiv($a[b12Total], $a[massv], 100);
	$a[fiber] = $a[massv] == 0 ? MAIN_TABLE_ZERO_DIV_ZERO_STRING : mdiv($a[fiberTotal], $a[massv], 100);

	addPfcTotal($a);
	return $a;
}

function addRows(&$rows, $a, $color, $bold)
{
	$a[colorIndex] = $color;
	$a[boldIndex] = $bold;
	$rows[] = $a;
}

function addRowsSummary(&$rows, $p, $n, &$t)
{
	$a = getTotal($p, $n);
	if (count($t) > 0) {
		$v = mdiv($a[massv], $t[0][massv]);
		$v1 = mdiv($a[massbegin], $t[0][massbegin]);
		$a[comment] .= is_numeric($v1) ? $a[0] . " / " . $t[0][0] . " = " . formatNumber($v1, 2) : $v1;
		if ($v != $v1) {
			$a[comment] .=
				(is_numeric($v) ? " (" . formatNumber($v, 2) . ")" : $v);
		}
	}
	addRows($rows, $a, count($t), true);
	$t[] = $a;
}

function keyboard($n)
{
	if (preg_match("/[а-яё]/ui", $n)) {
		return $n;
	}
	$i = 0;
	foreach (str_split(KEYE) as $k) {
		if (str_contains("[].", $k)) {
			$k = "\\$k";
		}
		$n = preg_replace("/$k/ui", mb_substr(KEYR, $i, 1), $n);
		$i++;
	}
	return $n;
}

function addFullData()
{
	global $fullData, $filteredData, $url, $recipeFirstLine;
	if (!empty($filteredData)) {
		if (useUrl) {
			foreach ($url as $e) {
				if (abs($e[2] - $recipeFirstLine) < 3) {
					$filteredData[0] .= " <a href='$e[0]' target='_blank' class='ra'>$e[1]</a>";
					break;
				}
			}
		}
		$fullData[] = $filteredData;
	}
}

/* formatNonZero works line formatNumber but return always non zero string
formatNumber(0.01,1)="0"
formatNonZero(0.01,1)="0.01" - return string is always nonzero
formatNonZero(0.012,1)="0.01" - return string is always nonzero
on js realized in marinade.js
on php realized in calorieRecipe.php
*/
function formatNonZero($v, $digits)
{
	return formatNumber($v, $v == 0 ? $digits : max(floor(-log10($v)) + 1, $digits));
}

function parseRecipe($fd, $moneyAddon = null, $mul = 1)
{
	$title = array_shift($fd);
	if ($moneyAddon === null) {
		$a = getRemoveParameter($title, MONEYADDON);
		if (is_array($a)) {
			[$title, $moneyAddon] = $a;
		} else {
			$moneyAddon = 0;
		}
	}
	$t = [];
	$p = [];
	for ($number = 0; $number < count($fd); $number++) {
		$d = $fd[$number];
		diec($d === '}', "неожиданный символ }", __LINE__);
		if (str_ends_with($d, '{')) {
			$n = preg_match("/^(.*?)" . pureMaths . "\s*\{$/", $d, $g);
			diec($n == 0, "неверная строка для внутреннего рецепта или коэффициента", __LINE__, $d);
			$name = $g[1];
			$coefficient = empty($name);
			$v = getMathValue($g[2]);
			diec($v === false, ($coefficient ? 'коэффициент' : 'масса') . ' не является арифметическим выражением', __LINE__, $g[2]);
			diec($v < 0, ($coefficient ? 'коэффициент должен' : 'масса должна') . ' быть положительным числом', __LINE__, $g[2]);
			$inner = getInner($fd, $number);
			diec(count($inner) == 0, "пустой внутренний рецепт", __LINE__, $d);
			$number += count($inner) + 1; //and +1 in cycle
			array_unshift($inner, "");
			$b = parseRecipe($inner, 0,  $coefficient ? $mul * $v : 1)[1];
			if ($coefficient) {
				array_pop($b);
			} else {
				$v *= $mul;
				$a = $b[count($b) - 1];
				$a[name] = $name;
				$a[mass] = $a[massv] = $a[massbegin] = $v;
				$a[pricev] = $a[price];
				$a[ccaltotal] = $a[ccal] * $v / 100;
				$a[pricetotal] = $a[pricev] * $v / 1000;
				$a[comment] = 'рецепт задан пользователем';
				[$a[animalProtein], $a[saturatedFat]] = countAnimalProteinFat($b, true);
				$b = [$a];
			}

			$hasBold = false;
			foreach ($b as $a) {
				if ($a[boldIndex]) {
					$hasBold = true;
					break;
				}
			}

			$ct = count($t);
			foreach ($b as $a) {
				addRows($rows, $a, $ct + ($coefficient ? $a[colorIndex] : 0), $coefficient ? $a[boldIndex] : false);
				if ($hasBold && $coefficient) {
					if ($a[boldIndex]) {
						$t[] = $a;
					}
				} else {
					$p[] = $a;
				}
			}
			continue;
		}

		$sub = $d[0] == SUB_RECIPE;
		if ($sub) {
			$d = substr($d, 1);
		} else {
			$a = parse($d, $mul,  $p);
			if ($a) {
				addRows($rows, $a, count($t), false);
				$p[] = $a;
			} else {
				$sub = true;
			}
		}

		if ($sub) {
			addRowsSummary($rows, $p, $d, $t);
			$p = [];
		}
	}

	$a = getRemoveParameter($title, TAG[remainder]);
	if (is_array($a)) {
		//2nd pass
		$recipe = applyReminder($rows, $a);
		return parseRecipe($recipe, $moneyAddon);
	} else {
		//subrecipe remainder
		$recipe = [$title];
		$i = $lastsub = 0;
		$f = false;
		if (!empty($rows)) {
			foreach ($rows as $r) {
				if ($r[boldIndex]) {
					$a = getRemoveParameter($r[name], TAG[remainder]);
					if (is_array($a)) {
						$f = true;
						$b = array_slice($rows, $lastsub, $i - $lastsub);
						$v = applyReminder($b, $a, 0);
						//change last $recipe elements
						array_splice($recipe, -count($v), count($v), $v);
						$recipe[] = $a[0];
					} else {
						$recipe[] = $r[name];
					}
					$lastsub = $i + 1;
				} else {
					/* array_key_exists(originalString,$r) = false for $r
				квашеная капуста 207{
капуста 1000
морковь 60
соль 20
сахар 10
}
лук 37
масло подсолнечное нерафинированное 12
*/
					$recipe[] = array_key_exists(originalString, $r) ? $r[originalString] : '';
				}
				$i++;
			}
			if ($f) {
				//2nd pass
				return parseRecipe($recipe, $moneyAddon);
			}
		}
	}

	if (!empty($rows)) {
		foreach ($rows as $e) {
			if (array_key_exists(remainderAfter, $e) && $e[remainderAfter]) {
				diec(true, 'не задан общий остаток', __LINE__, $e[originalString]);
			}
		}
	}
	if (count($p) > 0 && count($t) > 0) {
		addRowsSummary($rows, $p, UNKNOWN, $t);
	}
	$a = getTotal(count($t) > 0 ? $t : $p, 'всего', count($t) > 0, $moneyAddon);
	addRows($rows, $a, totalClass, true);
	return [$title, $rows];
}

function getRemoveParameter($s, $p)
{
	$e = sregex($p, true);
	$n = preg_match_all($e, $s, $g);
	if ($n == 0) {
		return false;
	}
	diec($n > 1, "ошибка параметр $p задан больше одного раза", __LINE__, $s);
	$r = getMathValue($g[2][0]);
	diec($r === false, "ошибка параметр $p не является арифметическим выражением", __LINE__, $s);
	diec($r < 0, "ошибка отрицательный параметр $p", __LINE__, $s);
	return [preg_replace($e, "", $s), $r];
}

function applyReminder($rows, $r, $full = 1)
{
	[$title, $remainder] = $r;
	$m = 0;
	$tm = 0;
	$found = false;
	$remainders = $remainder;
	foreach ($rows as $r) {
		//if array_key_exists(remainderAfter,$r) - unrecognized string (subrecipe)
		if (array_key_exists(remainderAfter, $r)) {
			$tm += $r[massv];
			if ($r[remainderAfter]) {
				$found = true;
				$m += $r[massv];
			} else {
				$remainder -= $r[massv];
			}
		} else {
			diec($r[boldIndex] == 0, 'system error', __LINE__);
			$a = getRemoveParameter($r[name], TAG[remainder]);
			diec(is_array($a), "ошибка остаток задан одновременно в общем рецепте и в одном из подрецептов", __LINE__, $r[name]);
		}
	}
	diec(!$found, "ошибка задан общий остаток и ни один элемент рецепта не имеет подстроки 'остаток#'", __LINE__);
	diec($remainders > $tm, "ошибка остаток больше начальной массы", __LINE__);
	diec($remainder < 0, "ошибка остаток слишком мал", __LINE__);
	if ($full) {
		$recipe = [$title];
	}
	foreach ($rows as $r) {
		if (array_key_exists(remainderAfter, $r) && $r[remainderAfter]) {
			$k = array_key_exists(mul, $r) ? $r[mul] : 1;
			$v = preg_replace(REMAINDER_R, TAG[remainder] . ($r[massv] / $m * $remainder / $k), $r[originalString]);
		} else {
			$v = array_key_exists(originalString, $r) ? $r[originalString] : $r[name];
		}
		if (array_key_exists(mul, $r)) {
			$v .= " " . TAG[coefficient] . $r[mul];
		}
		$recipe[] = $v;
	}
	return $recipe;
}

function sregex($s, $math)
{
	$e = "(?<![а-яё])" . mb_substr($s, 0, 1) . "(" . mb_substr($s, 1) . ")?";
	if ($math) {
		$e = "/" . $e . pureMaths . "/ui";
	}
	return $e;
}

function getInner($a, $begin)
{
	$n = 0;
	for ($i = $begin; $i < count($a); $i++) {
		$e = $a[$i];
		if (str_ends_with($e, '{')) {
			$n++;
		} elseif ($e === '}') {
			if ($n == 1) {
				return array_slice($a, $begin + 1, $i - $begin - 1);
			}
			$n--;
		}
	}
	diec(true, 'не найдено } для ' . $a[$begin], __LINE__);
}

function removeSpaces($s)
{
	return str_replace(' ', '', $s);
}

function nameRegexDate($n)
{
	global $params;
	$p = $params['date'];
	return "LOWER(text) REGEXP CONCAT('(^|\\\\s|@|\\\\*)',$n,'($|\\\\s)') AND date<='$p'";
}

function filterColumns($a)
{
	global $params;
	return array_values(array_filter($a, fn($n) => $params['columns'][$n], ARRAY_FILTER_USE_KEY));
}

function addPfcTotal(&$a)
{
	for ($i = 0; $i < 3; $i++) {
		$a[proteinTotal + $i] = $a[protein + $i] / 100 * $a[massbegin];
	}
}

function countAnimalProteinFat($a, $excludeLast = false)
{
	$r = [0, 0];
	$t = [0, 0];
	for ($i = 0; $i < count($a) - $excludeLast; $i++) {
		$e = $a[$i];
		for ($j = 0; $j < 2; $j++) {
			$r[$j] += $e[$j ? saturatedFat : animalProtein] * $e[$j ? fat : protein] * $e[massv] / 100;
			$t[$j] += $e[$j ? fat : protein] * $e[massv] / 100;
		}
	}
	for ($j = 0; $j < 2; $j++) {
		$r[$j] /= $t[$j];
	}
	return $r;
}
