<?php
include("../config.php");

connect();

/*
SELECT pages.name,pages.language,p.language FROM pages
left join (
    select name,language from pages
)as p on p.name=pages.name and p.language<>pages.language

select pages.name,pages.language,pages.title,c.d,pages.admin_only,p.language from pages
left join(
select name,language,min(date) as d from counters group by name,language
) as c on pages.name=c.name and pages.language=c.language
left join (
    select name,language from pages
)as p on p.name=pages.name and p.language<>pages.language
*/

//left join allows select pages which are not in counters table (never attended)
$q = [
    "select pages.name,pages.language,pages.title,c.d,pages.admin_only,p.language is not null,video from pages
left join(
select name,language,min(date) as d from counters group by name,language
) as c on pages.name=c.name and pages.language=c.language
left join (
    select name,language from pages
)as p on p.name=pages.name and p.language<>pages.language",
    "SELECT video,language,count(*) FROM `pages` where video in (SELECT video FROM `pages` where video is not null) GROUP by video,language HAVING COUNT(*)>1"
];
$w = [];
foreach ($q as $e) {
    $result = $mysqli->query($e) or die('error on line' . __LINE__ . $mysqli->error);
    $w[] = $result->fetch_all(MYSQLI_NUM);
}
die(json_encode($w, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE));
