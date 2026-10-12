<?php

include_once  '../config.php';
connect();

//список версий и дат программ
//<tr><td><a href="?versions_list">Software version history</a></td></tr>

$result = $mysqli->query("SELECT name,language,content FROM versions order by name ") or die('error on line' . __LINE__ . $mysqli->error);

$d = [];
while ($row = $result->fetch_row()) {
  $a = explode("\n", $row[2]);
  $i = $row[0] == 'parser_versions';
  if (preg_match("~^([\w.()]+)\s+([\d\*]+\s+\d+\s+\d+)~", $a[$i], $m)) {
    $d[] = [$row[0], $row[1][0], $m[1], $m[2]];
  } else {
    echo "not found";
  }
}

$f = [];
$i = -1;
for ($i = 0; $i < count($d); $i++) {
  if ($i == 0 || $d[$i][0] != $d[$i - 1][0]) {
    //new chain
    if ($i != count($d) - 1) {
      if ($d[$i][0] == $d[$i + 1][0]) { //two items
        if (array_slice($d[$i], 2) == array_slice($d[$i + 1], 2)) {
          $d[$i][1] = "er";
          $f[] = $d[$i];
        } else {
          //add both
          $f[] = $d[$i];
          $f[] = $d[$i + 1];
        }
        $i++;
      } else { //only one item
        $f[] = $d[$i];
      }
    }
  }
}

echo json_encode($f);
// foreach ($d as $e) {
//   $i++;
//   if ($i) {
//     // if($e[0]==$d[$i - 1][])
//   }

//   if (!$i || !cmpIgnore1($d[$i - 1], $e)) {
//     if ($i && $d[$i - 1][0] != $e[0])
//       $e[1] = "enru";
//     $f[] = $e;
//   }
// }

echo "<table border=1>";
foreach ($d as $e) {
  echo "<tr><td>" . implode("<td>", $e);
}
echo "</table>";

echo "<table border=1>";
foreach ($f as $e) {
  echo "<tr><td>" . implode("<td>", $e);
}
echo "</table>";
