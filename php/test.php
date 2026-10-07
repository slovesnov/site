<?php

include('../config.php');
connect();

$result = $mysqli->query("select name,language,content from versions") or die('error on line' . __LINE__ . $mysqli->error);

// var_dump($result->num_rows);
echo "<table>";
while ($row = $result->fetch_row()) {
    $s = $row[2];

    // 1. Разбиваем, очищаем через trim и удаляем пустые элементы
    $lines = array_filter(array_map('trim', preg_split('/\R/u', $s)), 'strlen');

    // 2. Склеиваем обратно в строку (например, через стандартный перенос \n)
    $new_s = implode("\n", $lines);

    // 3. Проверяем, изменилась ли строка
    $isChanged = ($s !== $new_s);

    echo "<tr><td>$row[0]<td>$row[1]<td>" . ($isChanged ? "changed" : "ok");
    if($isChanged){
        $safe_script = $mysqli->real_escape_string($new_s);
        $r = $mysqli->query("update versions set content='$safe_script' where name='$row[0]' and language='$row[1]'") or die('error on line' . __LINE__ . $mysqli->error);
    }
}
echo "</table>";

/*betpot	english	changed
betpot	russian	changed
bridge_versions	english	changed
bridge_versions	russian	changed
bullscows_versions	english	changed
bullscows_versions	russian	changed
cube_permutations	english	ok
cube_permutations	russian	ok
fasthtml	russian	changed
fractals	english	changed
fractals	russian	changed
imageviewer	english	ok
imageviewer	russian	changed
lines	english	ok
lines	russian	ok
parser_versions	english	changed
parser_versions	russian	changed
words_versions	english	ok
words_versions	russian	changed
yahoo_card_capturer	english	changed
yahoo_card_capturer	russian	changed*/
