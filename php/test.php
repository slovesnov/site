<?php

include('../config.php');
connect();

const HIGHLIGHT_PAGES = [
    'bignumber',
    'bridge_logic52',
    'calendar_formula',
    'calendar_javascript',
    'cgi',
    'combobox_javascript',
    'matrix',
    'modal_dialog',
    'p4',
    'parser',
    'pyramid',
    'selfprint'
];

$result = $mysqli->query("SELECT name,language,content FROM pages where 1") or die('error line' . __LINE__ . $mysqli->error);
$c = 1;
$users = [];
echo "<table><tr><td>";
echo "<table>";
while ($row = $result->fetch_row()) {
    $h1 = in_array($row[0], HIGHLIGHT_PAGES);
    $hasHighlightCode = strpos($row[2], 'class="language-') !== false || $h1;
    if ($hasHighlightCode) {
        $users[] = [$row[0], $row[1]];
        echo '<tr><td>' . implode('<td>', [$c++, $row[0], $row[1]]);
    }
}
echo "</table>";


$combined = [];
foreach ($users as $user) {
    $name = $user[0];
    $lang = $user[1];
    $shortLang = ($lang === 'english') ? 'en' : 'ru';
    $combined[$name][$shortLang] = true;
}

echo "<td valign=top>";
echo '<table border="1" cellpadding="8" style="border-collapse: collapse;">';
echo '<thead><tr style="background-color: #f2f2f2;"><th>User</th><th>Languages</th></tr></thead>';
$c = 1;
$s='';
foreach ($combined as $name => $langs) {
    $langString = implode('+', array_keys($langs));
    echo '<tr><td>' . implode('<td>', [$c++, $name.(in_array($name, HIGHLIGHT_PAGES)?"*":""), $langString]);
    if(!in_array($name, HIGHLIGHT_PAGES) && $langString=='en+ru'){
        $s.=$name." ";
    }
}
echo '</table>';
echo "Found " . $result->num_rows . " rows.<br>$s";
echo '</table>';


/*
    $b = filter_var($row[3], FILTER_VALIDATE_BOOLEAN);
    $c = $row[2];
    $f = strpos($c, "\\(") !== false || strpos($c, "$$") !== false;
    if ($b != $f)
        echo '<tr><td>' . implode('<td>', [$row[0], $row[1],var_export($b,1),var_export($f,1)]);
*/