<?php
include_once "../config.php";

function fi($f) {
    $info = pathinfo($f);
    return [
        $info['filename'],
        $info['extension'],
        filesize($f),
        filemtime($f)
    ];
}
//"php scripts css" differs from DIFFERENCE['directories']
die(getDirsCodes("php scripts css", DIFFERENCE['files'], 'fi'));

// foreach (['m', 'c', 'a'] as $e)
// 	echo '<td align="right">' . dateFormat("file{$e}time"($fp));
