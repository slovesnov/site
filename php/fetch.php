<?php
//use for fetch.html test fetch/ajax
//echo "count(post)=".count($_POST).' count(get)='.count($_GET);
// var_dump(empty($_POST));
// var_dump(empty($_GET));

if (isset($_POST['test'])) {	
	$a=['ёЁаб'=>PHP_FLOAT_MAX,85.6=>'sf 
		a'];
	$s=json_encode($a,JSON_UNESCAPED_UNICODE);
	$c=gzdeflate($s, 9);
	$s=base64_encode($c);
	die($s);
}

$post = empty($_GET);
if ($post && empty($_POST)) {
	/*
fetch('php/fetch.php', {
	method: 'POST',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ a: 1, b: 'Textual content' })
})
*/
	$json = file_get_contents("php://input");
	if (strlen($json) == 0) {
		die('error empty request. No post/get found');
	}
	$a = json_decode($json, true);
	if (json_last_error() != JSON_ERROR_NONE) {
		die('invalid json');
	}
	pr('json', $a);
	// var_dump($a['a']);
	exit;
}

echo "<p style='white-space:pre'>";

$a = $post ? $_POST : $_GET;
pr($post ? 'POST' : 'GET', $a);
//pr('SERVER',$_SERVER);
//var_dump($_FILES);
echo "\$_FILES<br>";
foreach ($_FILES as $k => $v) {
	echo "\t$k<br>";
	$b = $v['name'];
	if (is_array($b)) {
		for ($i = 0; $i < count($b); $i++) {
			echo "\t\t " . $v['name'][$i] . " " . $v['type'][$i] . " " . $v['size'][$i] . "<br>";
		}
	} else {
		if ($b !== "") {
			echo "\t\t " . $v['name'] . " " . $v['type'] . " " . $v['size'] . "<br>";
		}
	}
}
// pr('FILES',$_FILES);
//pr('ENV',$_ENV);

function pr($name, $a)
{
	echo "$$name<br>";
	foreach ($a as $k => $v) {
		echo "\t$k=" . (is_array($v) ? var_export($v, 1) : $v) . "<br>";
	}
}

function pra($a)
{
	foreach ($a as $k => $v) {
		echo "\t$k=$v<br>";
	}
}
