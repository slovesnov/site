<?php
$type = $_POST["type"];
$f = $_FILES["fileToUpload"]["tmp_name"];
$real_name = $_FILES["fileToUpload"]["name"];
if (strlen($f) == 0) {
	die('file is not set');
}
$addons = isset($_POST["addons"]) ? 1 : 0;
$ret = -1;
passthru("../../cgi-bin/mqlToHtml/mqlToHtml $f $type $addons $real_name", $ret);
if ($ret != 0) {
	echo 'error return code ' . $ret;
}
