<?php
//600 seconds = 10 minutes
ini_set('max_execution_time', '600');
set_time_limit(600);

parseWeb();
var_dump(floatval(" "));
//$q = file_get_contents($u);

function parseWeb(){
	$file = fopen("calorie.js", "w") or die("Unable to open file!");
	$s='gGoodsCalorie=[';

	//<75
	for($p=0;$p<75;$p++){
		$u="https://calorizator.ru/product/all";
		if($p!=0){
			$u.="?page=$p";
		}
		$q = file_get_contents($u);

		//$q = file_get_contents("page12.html");

		//$q = file_get_contents("all.html");
		$i=strpos($q,'<tr class="odd views-row-first">');
		if($i===false){
			die('27');
		}
		$r='';
		foreach(['protein','fat','carbohydrate'] as $a){
			$r.="\s*<td class=\"views-field views-field-field-$a-value\">\s*(.+)\s*<\/td>";
		}
		preg_match_all('/\s{5,}<a href="\/product\/[^>]+>(.+)<\/a>.*<\/td>'.$r.'/',$q,$m,0,$i);
		//print_r($m);
		for($i=0;$i<count($m[0]);$i++){
			$s.="[";
			for($j=1;$j<5;$j++){
				$k=$m[$j][$i];
				if($j==1){
					$k=wrapQuotes($k);
				}
				else{
					//floatval(" ")=0
					$k=floatval($k);//"2.0" -> 2
					$s.=',';
				}
				$s.=$k;
			}
			$s.="],\n";
		}
		$k=count($m[0]);
		echo "page=$p count=$k";
		if($k!=80){
			echo " ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ne 80 ";
		}
		echo "<br>";
		flush();
		ob_flush();
	}
	$s.="]";
	fwrite($file, $s);
	fclose($file);
}

function wrapQuotes($s){
	return '"'.$s.'"';
}
