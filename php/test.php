<?php

include('../config.php');
connect();

const HIGHLIGHT_PAGES = [
    'aslov',
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
    'permutations',
    'pyramid',
    'selfprint',
    'table_javascript'
];

foreach (HIGHLIGHT_PAGES as $e) {
    $s = file_get_contents("../scripts/$e.js");
    $r = preg_match("~gs\s*=\s*\[\s*`~", $s);
    if($r){
        echo "$e";
        var_dump($r);

    }
}
