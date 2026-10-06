<?php
/*
outputs site attendance and language statistics calls from
http://localhost?statistics
http://localhost/php/statistics.php?test

not attended pages
select name,language FROM pages where (name,language) not in(select name,language FROM counters group by name,language)
alternative query
select name,language FROM pages where (name,language) not in(select distinct name,language FROM counters)
alternative query
select name,language FROM pages where (name,language) not in(select name,language FROM counters)
alternative query
SELECT c.name,c.language FROM pages AS c WHERE NOT EXISTS (SELECT 1 FROM counters AS p WHERE p.name = c.name AND p.language = c.language)
*/

include("../config.php");
connect();

const YEAR = 0;
const MONTH = 1;
const NAME_LANGUAGE = 2;
const NAME = 3;
const SPECIAL_DATE = 4;

const pageInfo = 0;
const dayByDay = 1;
const contentLength = 2;
//const calendar=3;//date

const SC = 'SELECT sum(counter) as c,sum(admin_counter) as ac,';

$s = array_key_first($_POST);
if ($s == pageInfo) {
	$q = "SELECT count(*),'total pages' as help FROM `pages` union
	SELECT count(*),'only in english' FROM `pages` WHERE name not in (select name from pages where language='russian') and language='english' union
	SELECT count(*),'only in russain' FROM `pages` WHERE name not in (select name from pages where language='english') and language='russian' union
	SELECT count(*),'in english and russian' FROM `pages` WHERE name in (select name from pages where language='english') and language='russian'";

	$result = $mysqli->query($q) or die('error on line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($row = $result->fetch_array()) {
		$a[] = (int)$row[0];
	}
} elseif ($s == dayByDay) {
	$result = $mysqli->query("SELECT count(*) as c,sum(counter) as sum,date FROM ip GROUP BY date") or die('error on line' . __LINE__ . $mysqli->error);
	$c = [];
	while ($row = $result->fetch_assoc()) {
		$c[$row['date']] = [(int)$row['c'], 0, (int)$row['sum'], 0];
	}

	$result = $mysqli->query("SELECT count(*) as c,sum(counter) as sum,date FROM ip where admin=1 GROUP BY date") or die('error on line' . __LINE__ . $mysqli->error);
	while ($row = $result->fetch_assoc()) {
		$c[$row['date']][1] = (int)$row['c'];
		$c[$row['date']][3] = (int)$row['sum'];
	}

	$result = $mysqli->query(SC . "date FROM counters group by date order by date desc") or die('error on line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($row = $result->fetch_assoc()) {
		$d = $row['date'];
		$b = array_key_exists($d, $c) ? $c[$d] : [0, 0, 0, 0];
		array_unshift($b, $d, (int)$row['c'], (int)$row['ac']);
		$a[] = $b;
	}
} elseif ($s == contentLength) {
	$result = $mysqli->query("SELECT name,SUBSTR(language,1,2),char_length(content),length(content) FROM pages") or die('error on line' . __LINE__ . $mysqli->error);
	$a = [];
	while ($r = $result->fetch_array()) {
		$b = [];
		for ($i = 0; $i < 4; $i++) {
			$j = $r[$i];
			if ($i > 1) {
				$j = (int)$j;
			}
			$b[] = $j;
		}
		$a[] = $b;
	}
} else {

	$a = [];
	for ($i = 0; $i <= SPECIAL_DATE; $i++) {
		if ($i == SPECIAL_DATE) {
			$q = "SELECT counter as c,admin_counter as ac,name,language FROM counters WHERE date='$s' order by c DESC, name ASC";
		} else {
			$q = SC;
			if ($i == YEAR) {
				$q .= 'YEAR(date) as y FROM counters GROUP BY y ORDER BY y DESC';
			} elseif ($i == MONTH) {
				//as 'y' same associative key with i==YEAR
				$q .= 'DATE_FORMAT(date,"%Y%m") as y FROM counters GROUP BY MONTH(date),YEAR(date) ORDER BY YEAR(date) DESC,MONTH(date) DESC';
			} else {
				$ln = $i == NAME_LANGUAGE ? ',language' : '';
				$q .= "name $ln,MIN(date) as first FROM counters GROUP BY name $ln order by c DESC, name ASC";
			}
		}
		$result = $mysqli->query($q) or die('error on line' . __LINE__ . $mysqli->error);

		$r = [];
		while ($row = $result->fetch_assoc()) {
			$b = $i == YEAR || $i == MONTH;
			$m = $row[$b ? 'y' : 'name'];
			if (!$b) {
				if ($i != NAME) {
					$m .= substr($row['language'], 0, 2);
				}
			}
			$c = [(int)$row['c'], (int)$row['ac'], $m];
			if (!$b) {
				if ($i != SPECIAL_DATE) {
					$c[] = $row['first'];
				}
			}
			$r[] = $c;
		}
		$a[] = $r;
	}
}

echo json_encode($a);
