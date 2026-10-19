<?php

include_once  '../config.php';
connect();

$p=getPageLanguage1(">let gLanguage=`russian`,gPageName=`words`,");
var_dump($p);

function getPageLanguage($text) {
    return array_map(function($e) use ($text) {
        if (!preg_match("/\b\$e\s*=\s*(['`\"])(\w+)\\1/", $text, $m)) {
            diec(1, "Error: variable '\$e' not found in text.");
        }
        return $m[2];
    }, ['gPageName', 'gLanguage']);
}

function getPageLanguage1($text) {
	$l = null;
	$p = null;
	foreach (['gLanguage', 'gPageName'] as $e) {
		if (!preg_match("/\b$e\s*=\s*(['`\"])(\w+)\\1/", $text, $m)) {
			diec(1, "Error: variable '$e' not found in text.");
		}
		if ($e === 'gLanguage') {
			$l = $m[2];
		} else {
			$p = $m[2];
		}
	}
	return [$p, $l];
}
