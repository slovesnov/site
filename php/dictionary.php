<?php
// http://localhost/php/dictionary.php

$dictionary=[
	[ "one", "один" ], [ "two", "два" ], [ "three", "три" ], [ "four",
		"четыре" ], [ "five", "пять" ], [ "six", "шесть" ], [ "seven",
		"семь" ], [ "eight", "восемь" ], [ "nine", "девять" ], [ "ten",
		"десять" ], [ "eleven", "одиннадцать" ], [ "twelve",
		"двенадцать" ], [ "thirteen", "тринадцать" ], [ "fourteen",
		"четырнадцать" ], [ "fifteen", "пятнадцать" ], [ "sixteen",
		"шестнадцать" ]
];
$b=['помощь','следующий'];
echo "<!DOCTYPE html><html><head>
<meta http-equiv='Content-Type' content='text/html;charset=utf-8'>
<link rel='stylesheet' type='text/css' href='../css/combobox.css'>
<meta name='viewport' content='width=device-width, initial-scale=1' />
<script>
function b(p){
	if(p){
		g=Math.floor(Math.random() * d.length);
	}
	s=d[g][0]
	if(!p){
		s+='<br><br>'+d[g][1]
	}
	document.getElementById('o').innerHTML=s;
}
d=".json_encode($dictionary).";
</script>
</head><body onload='b(1)'><p id='o' style='height:100px'></p><br>";
for($i=0;$i<2;$i++){
	echo "<button class='comboboxbutton' onclick='b($i)'>$b[$i]</button> ";
}