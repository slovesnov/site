<?php

include('../config.php');
//connect();
/*
<button onclick='pagesClick(0)'>update remote table</button>
<button onclick='pagesClick(1)'>show query</button>
<button onclick='pagesClick(2)'>query to file</button>
<button onclick='pagesClick(3)'>rows show</button>
<button onclick='pagesClick(4)' class='comboboxbutton' style='font-size: 12px;'>save pages</button>
<button onclick='pagesClick(5)' class='comboboxbutton' style='font-size: 12px;'>show pages</button>
*/
const BUTTONS = ['update remote table', 'show query', 'query to file', 'rows show', 'save pages', 'show pages'];
$s = js_reduce(BUTTONS, fn($a, $e, $i) => "$a<button onclick=\"pagesClick($i)\"" . ($i >= count(BUTTONS) - 2 ? ' class="comboboxbutton" style="font-size: 12px;"' : '') . ">$e</button>", "");

echo tag2text($s);
