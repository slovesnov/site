<?php

include("../config.php");
connect();

echo "<html><head>
<link rel='stylesheet' type='text/css' href='../css/table.css'>
</head>
<body>";
echo '<table><tr>';
echo '<td>';
proceedOne('bridge_versions', 'russian');
echo '<td valign=top>';
proceedAll();
echo '</table>';

echo "</body>";
echo "</html>";

function td($b)
{
	echo "<td";
	if ($b) {
		echo " bgcolor='red' ";
	}
	echo '>';
}

function proceedOne($name, $language)
{
	global $mysqli;
	$result = $mysqli->query("SELECT content FROM `versions` WHERE NAME ='$name' and LANGUAGE='$language'") or die('error on line' . __LINE__ . $mysqli->error);

	if ($result->num_rows == 0) {
		die('versions not found');
	}

	$row = $result->fetch_array();
	$a = explode("\n", $row['content']);

	$p = $w = null;

	echo '<table class="table_border table_color">';
	foreach ($a as $v) {
		if ([$date, $b0] = geDate($v)) {
			if ($w != null) {
				echo '<tr>';
			}
			if ($p != null) {
				$interval = $date->diff($p);
				$diff = $p->getTimestamp() - $date->getTimestamp();
				$years = round($diff / (365. * 60 * 60 * 24), 2);
				$q = $years > 1;
				if ($w != null) {
					td($q);
					echo $interval->format('%a');
					td($q);
					echo "$years";
				}
			} else {
				if ($w != null) {
					echo "<td><td>";
				}
			}
			$p = $date;
			if ($w != null) {
				echo $w;
			}
			$w = '<td>' . $b0 . '<td>' . $date->format('d M Y');
		}
	}
	echo "<tr><td><td>$w";
	echo '</table>';
}

function proceedAll()
{
	global $mysqli;
	$result = $mysqli->query("SELECT name,content FROM `versions` WHERE LANGUAGE='russian' ") or die('error on line' . __LINE__ . $mysqli->error);
	$e = [];
	echo '<table class="table_border table_color">';
	while ($row = $result->fetch_array()) {
		echo "<tr><td>" . $row['name'] . "<td>";
		$a = explode("\n", $row['content']);
		foreach ($a as $v) {
			$q=geDate($v);
			if ($q && $date = $q[0]) {
				echo $date->format('d M Y');
				$e[] = [$row['name'], $date];
				break;
			}
		}
	}
	echo '</table>';
	echo '<br>';
	echo '<table class="table_border table_color">';

	usort($e, fn ($a, $b) => $b[1] <=> $a[1]);

	foreach ($e as $v) {
		echo "<tr><td>" . $v[0] . "<td>" . $v[1]->format('d M Y');
	}
	echo '</table>';
}

function geDate($v)
{
	if (is_numeric($v[0])  && count($b = explode(" ", $v)) == 4) {
		if ($b[1] == '**') {
			$b[1] = 1;
		}
		$b[3] = trim($b[3]);
		return [DateTime::createFromFormat('d m Y', $b[1] . ' ' . $b[2] . ' ' . $b[3]), $b[0]];
	} else {
		return 0;
	}
}
