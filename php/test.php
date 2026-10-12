<?php

include_once  '../config.php';
connect();

/*
["cpp","cpp","java","js"]
в английской версии <#cpp>....<#>
в русской можно просто <#cpp><#> без контента
если текст отличается нужно задать изменения в таблице code поле map

CREATE TABLE code_reserve AS SELECT * FROM code;
//todo width reorder

REPLACE INTO code SELECT * FROM code_reserve WHERE NAME = 'aslov1';
*/
// echo "<p style='white-space:pre;'>";
f34324();
clearlog();
printlog(1,"error",true,false);
 f34324();

function f34324() {
$i=3;
$s=null;
printlog(1,"error",$i,$s);
}
