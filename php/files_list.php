<?php

$type = ['php' => '.', 'js' => '../scripts', 'css' => '../css'];

$d = [];
foreach ($type as $ex => $dir) {
    foreach (glob("$dir/*.$ex") as $f) {
        if (is_file($f)) {
            $d[] = fi($f);
        }
    }
}
foreach (['index', 'config', 'logpass'] as $e) {
    $d[] = fi("../$e.php");
}

die(json_encode($d, JSON_UNESCAPED_UNICODE));
	// foreach (['m', 'c', 'a'] as $e)
	// 	echo '<td align="right">' . dateFormat("file{$e}time"($fp));

function fi($f) {
    $info = pathinfo($f);
    return [
        $info['filename'],
        $info['extension'],
        filesize($f),
        filemtime($f)
    ];
}
