<?php

//header('Content-Type: text/html; charset=windows-1251');
echo "<pre style='font-family: inherit; white-space: pre-wrap;'>";

$filename = "../words/words/ru/language.txt";    // Исходный файл

$a = file($filename, FILE_IGNORE_NEW_LINES);
$index = array_search('', $a, true);
$b = array_slice($a, $index + 1);
array_unshift($b, $a[0]);
$m_language = array_map('utf8', $b);

// print_r(array_slice($m_language, 0, 5));
print_r($m_language);
// var_dump($lines);

$m_language = [];
$f = fopen($filename, 'r');
//skip menu
for ($i = 0; ($line = fgets($f)) !== false && strlen($line) > 1; $i++) {
    if ($i == 0) {
        //actually not used
        removeLastLF($line);
        $m_language[] = utf8($line);
    }
}
while (($line = fgets($f)) !== false) {
    removeLastLF($line);
    $m_language[] = utf8($line);
}
fclose($f);

//print_r(array_slice($m_language, 0, 5));
print_r($m_language);

function removeLastLF(&$p) {
    $p = rtrim($p, "\n");
}

function utf8($s) {
    return iconv("cp1251", "UTF-8", $s);
}
