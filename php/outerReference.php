<?php
include("../config.php");
connect();
$references = 0;

echo "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<link rel='stylesheet' type='text/css' href='../css/common.css'>
<link rel='stylesheet' type='text/css' href='../css/combobox.css'>
<link rel='stylesheet' type='text/css' href='../css/siteupdate.css'>
<link rel='stylesheet' type='text/css' href='../css/table.css'>
</head><body style='margin:10px'><table class='table_border table_color'><th>name<th>language<th>position<th>substring";

$result = $mysqli->query("SELECT name,language,content FROM `pages` WHERE name not in ('helpers','bridge_problems')");
if (!$result) {
	die($mysqli->error);
}
$pages = $result->num_rows;


while ($row = $result->fetch_array()) {
	$str = $row['content'];

	$pos = -1;
	$error = '';
	$ref = '';
	//check valid refences 'href="?'
	for ($pos = 0; preg_match('/href=\"/i', $str, $matches, PREG_OFFSET_CAPTURE, $pos);) {
		$pos = $matches[0][1] + 6;
		if (preg_match('/\"/i', $str, $matches1, PREG_OFFSET_CAPTURE, $pos)) {
			$ref = substr($str, $pos, $matches1[0][1] - $pos);
			if (substr($ref, 0, 1) == '?' || substr($ref, 0, 1) == '#') { //starts with ? or #
				continue;
			}

			if (starts_with($ref, 'https://sourceforge.net/projects') & strpos($ref, 'files') !== false) {
				continue;
			}
			if (!starts_with($ref, 'http')) { //reference on file from site
				continue;
			}

			print_ref($row['name'], $row['language'], $pos, htmlspecialchars($ref));
		}
	}
}

//check 'menu' table
$result = $mysqli->query("SELECT name,menu,language FROM menus WHERE 1");
$menus = $result->num_rows;
if (!$result) {
	die($mysqli->error);
}
while ($row = $result->fetch_array()) {
	$a = explode("\n", $row['menu']);
	foreach ($a as $v) {
		$items = explode("=", $v);
		if (count($items) == 1) { //no refs
			continue;
		}

		$ref = str_replace('{', '', trim($items[1]));
		if (substr($ref, 0, 1) != '?' && substr($ref, 0, 1) != '#' && !starts_with($ref, 'https://sourceforge.net') && starts_with($ref, 'http')) {
			print_ref('<b>menu</b> ' . $row['name'], $row['language'], '', htmlspecialchars($ref));
			break;
		}
	}
}

echo	"</table>pages=$pages menus=$menus references=$references</body></html>";

$result->free();
$mysqli->close();

function starts_with($haystack, $needle)
{
	return !strncmp($haystack, $needle, strlen($needle));
}

function print_ref($type, $language, $pos, $bug)
{
	global $references;
	$references++;
	echo '<tr><td>' . $type . '<td>' . $language . '<td>' . $pos . '<td>' . $bug;
}
