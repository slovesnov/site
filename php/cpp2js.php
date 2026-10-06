<?php
/*
	"/" =>Math.floor
	int var
*/
echo '<html>';
//~ echo '<head>';
//~ echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
//~ echo '</head>';
echo '<body>';
echo '<pre>';

$fn="D:\\slovesno\\eclipse\\bridge\\src\\solver\\Preferans.cpp";
$myfile = fopen($fn, "r") or die("Unable to open file!");
$f=fread($myfile,filesize($fn));
fclose($myfile);

$b=strpos($f,"void Preferans::solve");
if($b===false){
	die ("line".__LINE__);
}

$e=strpos($f,"//\tfor(i=0;i<52;i++){");
if($e===false){
	die ("line".__LINE__);
}

$f=substr($f,$b,$e-$b);

$f=preg_replace("/#ifndef\s+CONSOLE.*?#endif\s+/s", "", $f);
$f=preg_replace("/#ifndef\s+NDEBUG(.*?)#endif/s", "$1", $f);
$f=preg_replace("/#ifdef\s+PREFERANS_NODE_COUNT(.*?)#endif/s", "\tif(PREFERANS_NODE_COUNT){ $1 \t}", $f);
$f=preg_replace("/assert/", "//assert", $f);
$f=preg_replace("/m_/", "this.m_", $f);

$v=preg_match_all("/(?:Preferans::)(\w+)/", $f, $matches);
if($v===false){
 die('invalid regex'.__LINE__);
}
if($v==0){
 die('functions not found'.__LINE__);
}
$function=[];
for($i=0;$i<$v;$i++){
	$function[]=$matches[1][$i];
}
sort($function);
for($i=1;$i<$v;$i++){
	if($function[$i]==$function[$i-1]){
		die("error overload function found[".$function[i]."]".__LINE__);
	}
}
foreach($function as $s){
	$f=preg_replace("/(?<!::)\b".$s."\s*\(/", "this.".$s."(", $f);
}

$f=preg_replace("/\bint\b/", "var", $f);

/*
$v=preg_match_all("/assert\s*\(/", $f, $matches,PREG_OFFSET_CAPTURE);
if($v===false){
 die('invalid regex'.__LINE__);
}
echo "found ".$v."\n";
if($v>0){
	for($i=0;$i<$v;$i++){
		$s=$matches[0][$i][1];
		$a=strlen($matches[0][$i][0])+$s;
		$k=1;
		for($j=$a;$j<strlen($a) && $k!=0;$j++){
			if($f[$j]=='('){
				$k++;
			}
			elseif($f[$j]==')'){
				$k--;
			}
		}
		//$f=substr($f,0,$s)."//".substr($f,$s,$j-$s).substr($f,$j);
		//echo "[".substr($f,$s,$j-$s)."]\n";
	}
}
*/

$v=preg_match_all("/\w+\s+Preferans::(\w+)\s*\(([^\)]+)\)/", $f, $matches,PREG_OFFSET_CAPTURE);
if($v===false){
 die('invalid regex'.__LINE__);
}
if($v==0){
 die('functions declarations not found'.__LINE__);
}
$a="";
$pe=0;
for($i=0;$i<$v;$i++){
	$e=$matches[0][$i][1];//pos
	$signature=$matches[2][$i][0];
	$d=explode(",",$signature);
	$o=[];
	foreach($d as $b){
		$c=preg_match("/]\s*$/", $b, $m);
		if($c){
			$p=strpos($b,"[");
			if($p===false){
				die ("line".__LINE__);
			}
			$b=substr($b,0,$p);
		}
		$c=preg_match("/\b(\w)+\s*$/", $b, $m);
		if($c===false || $c==0){
			die ("line".__LINE__);
		}
		else{
			$o[]=$m[0];
		}
	}
//~ 	echo "{".$matches[2][$i][0]."}\n";
//~ 	echo "{".implode(",",$o)."}\n";
	
	$a.=substr($f,$pe,$e-$pe).$matches[1][$i][0]."(".implode(",",$o).")";//."/*".$matches[2][$i][0]."*/";
	$pe=$e+strlen($matches[0][$i][0]);
}
$a.=substr($f,$pe);
$f=$a;


$v=preg_match_all("/(?<![\/*])\/(?![\/*])/", $f, $matches,PREG_OFFSET_CAPTURE);
if($v===false){
 die('invalid regex'.__LINE__);
}
echo "found ".$v."\n";
if($v>0){
	for($i=0;$i<$v;$i++){
		$s=$matches[0][$i][1];
		echo substr($f,$s-20,25)."\n";
	}
}

echo "==========================================================================\n";
echo $f;
echo "==========================================================================\n";