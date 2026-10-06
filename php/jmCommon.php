<?php
//uses in jm.php & calorieRecipe.php

function regexAround($re, $option = 0)
{
	$i = $option == 0 ? '' : "|\/";
	return "/(?<=^|\s$i)[-+]?$re(?=$|\s|<\/span>$i)/iu";
}
/*
return r['mass'] - mass, r['kg'] - in kilograms, r['quantity'] -number of pieces r['pricePerKg']
спагетти макароны 400г 11.10*2 r['mass']=0.4 r['kg']=1 r['quantity']=2 r['pricePerKg']=0
свекла 1кг 13.90*1.705 r['mass']=1.705, r['price']=13.90 r['kg']=1 r['pricePerKg']=1
(недовес/перевес) семечки 0.928*65.00 sum=64.05  r['sum']=1  r['mass']=0.928 r['priceS']=64.05/0.928 r['price']=69.02
$r['priceS'] need only if $r['sum']==1
$r['string'] - error string in case if error found
*/
function parseMassPrice($a, $skip_string = null)
{
	$r = [];
	$r['kg'] = 1;
	$r['quantity'] = 1;
	$r['sum'] = 0;
	$r['priceS'] = '';

	//at first check (int/float)*X.XXX or X.XXX*(int/float) "свекла 1кг 13.90*1.705" price=13.90 mass=1.705 "1кг" should be ignored
	$j = 0;
	$e = ["\d+(\.\d+)?\*\d+\.\d{3,}", "\d+\.\d{3,}\*\d+(\.\d+)?"];
	foreach ($e as $re) {
		if (preg_match(regexAround($re), $a, $matches) === 1) {
			$s = $matches[0];
			$i = strpos($s, "*");
			$begin = substr($s, 0, $i);
			$end = substr($s, $i + 1);

			$price = floatval($j == 0 ? $begin : $end);
			$mass = floatval($j == 1 ? $begin : $end);
			if ($skip_string !== null && ($k = strpos($a, $skip_string)) !== false) {
				$r['sum'] = 1;
				$sum = floatval(substr($a, $k + strlen($skip_string)));
				$r['priceS'] = "$sum/$mass";
				$r['price'] = round($sum / $mass, 2);
			} else {
				$r['price'] = $price;
			}
			$r['mass'] = $mass;
			$r['pricePerKg'] = 1;
			return $r;
		}
		$j++;
	}

	$r['pricePerKg'] = 0;
	//check float*int & int*float
	$e = ['\d+\.\d+\*\d+', '\d+\*\d+\.\d+'];
	$j = 0;
	foreach ($e as $re) {
		if (preg_match(regexAround($re), $a, $matches) === 1) {
			$s = $matches[0];
			$i = strpos($s, "*");
			$end = substr($s, $i + 1);
			$begin = substr($s, 0, $i);
			$r['price'] = floatval($j == 0 ? $begin : $end);
			$r['quantity'] = intval($j == 1 ? $begin : $end);
			break;
		}
		$j++;
	}

	if (!isset($r['price'])) {
		$e = ['\d+\.\d+', '\d+'];
		$r['price'] = UNKNOWN;
		foreach ($e as $re) {
			if (preg_match(regexAround($re), $a, $matches) === 1) {
				$r['price'] = floatval($matches[0]);
				break;
			}
		}
	}

	//перец черный горошек 20г so use '\d{2,}г' instead of '\d{3,}г'
	//$e=['\d{2,}г', '\d{3,}мл', '\d+(\.\d+)?кг' , '\d+(\.\d+)?л' ];
	$e = ['\d{1,}(г|g)', '\d{3,}(мл|ml)', '\d+(\.\d+)?(кг|kg)', '\d+(\.\d+)?(л|l)']; //TODO?
	$re = implode("|", $e);
	$i = preg_match_all(regexAround("($re)", 1), $a, $matches);
	//$i=0 is ok

	if ($i > 1) {
		$r['mass'] = UNKNOWN;
		$r['string'] = "mass set two or more times";
		return $r;
	} elseif ($i == 1) {
		$re = $matches[0][0];
		$g = floatval($re); //like atof
		if ($g <= 0) {
			$r['mass'] = UNKNOWN;
			$r['string'] = "negative or zero mass set";
			return $r;
		}

		if (endsWithArray($re, ['г', 'g', 'мл', 'ml']) && !endsWithArray($re, ['кг', 'kg'])) {
			$g /= 1000;
		}
		$r['mass'] = $g;
		$r['kg'] = endsWithArray($re, ['г', 'g', 'кг', 'kg']);
		return $r;
	}

	if (preg_match(regexAround("\d{1}\.\d{3}"), $a, $matches) === 1) {
		$g = floatval($matches[0]);
		if ($g <= 0) {
			$r['mass'] = UNKNOWN;
			$r['string'] = "negative mass set";
			return $r;
		}
		$r['mass'] = $g;
		return $r;
	}
	$r['mass'] = UNKNOWN;
	return $r;
}

function endsWithArray($haystack, $needleA)
{ //works also with utf8
	foreach ($needleA as $i) {
		if (str_ends_with($haystack, $i)) {
			return true;
		}
	}
	return false;
}

function readAddons($jm_user)
{
	global $mysqli;
	$ADDONS = [];
	$result = $mysqli->query("SELECT parameter,value FROM `money_addons_$jm_user`") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_array()) {
		$ADDONS[$row[0]] = $row[1];
	}
	return $ADDONS;
}


//$withAt recognize strings with @
function getUncommentTextForParse($text, $removeSkipRows = true, $withAt = false)
{
	global $ADDONS;
	$p = explode("\n", getCommentText($text, false));
	$r = [];
	foreach ($p as $a) {
		if (preg_match("/^\s*$/", $a) || $removeSkipRows && strpos($a, $ADDONS['skip_row']) !== false) {
			continue;
		}
		$r[] = $a;
	}
	if ($withAt) {
		foreach (explode("\n", $text) as $a) {
			if (strpos($a, "@") !== false) {
				$r[] = $a;
			}
		}
	}
	return $r;
}

//similar in jm.js
function getCommentText($text, $full = true)
{
	preg_match_all('/\/\/[^\n]*|\/\*[\S\s]*?(\*\/|$)/', $text, $m, PREG_OFFSET_CAPTURE);
	$r = '';
	$i = 0;
	foreach ($m[0] as $a) {
		$s = $a[0];
		$p = $a[1];
		$r .= substr($text, $i, $p - $i);
		if ($full) {
			//differencs from js mark every string as comment
			$i = 0;
			foreach (explode("\n", $s) as $b) {
				if ($i) {
					$r .= "\n";
				}
				$r .= wrapSpanClass($b, 'c');
				$i = 1;
			}
		} else {
			//don't need for php
			// 			$j=substr_count($s,"\n");
			//			$r.=str_repeat("\n",$j);
		}
		$i = $p + strlen($s);
	}
	return $r . substr($text, $i);
}

function wrapSpanClass($s, $c)
{
	return '<span class="' . $c . '">' . $s . '</span>';
}

function atProceed($t)
{
	global $admin;
	if (isset($admin) && $admin != 0) {
		return $t;
	}
	$a = explode("\n", $t);
	$s = "";
	$start = "";
	foreach ($a as $e) {
		$p = strpos($e, '@');
		if ($p === false) {
			$s .= $e . "\n";
		} else { // also need to leave comment for "/*@"
			if ($p != 0) {
				$f = substr($e, 0, $p);
				$s .=  $f . ($f == '/*' ? "" : "\n");
			}
			$start .= substr($e, $p + 1) . "\n";
		}
	}
	return $start . $s;
}
