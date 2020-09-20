<?php

$host = '35.185.89.47';
$dbs  = 'wowStats';
$user = 'website';
$pass = '!fast$';


$db = mysqli_connect($host, $user, $pass, $dbs);

if (!$db) {
	die("Error: Unable to connect to MySQL<br>Debugging error: <code>" . 
		mysqli_connect_error() . "</code><br>\n");
}

$q="select id,full_name,addr1,addr2,city,state,postal from amz_sh_customers where tel='' limit 10";
if ($res=mysqli_query($db,$q)){
	while($r = mysqli_fetch_assoc($res)){
		print"{$r['id']}. Name: {$r['full_name']}<br>\n";
		// later when updating it will look like this:
		// $q="update amz_sh_customers set tel='1',email='$email_list' where id={$r['id']}";
	}
} else print"$q failed: ".mysqli_error($db)."<br>\n";

mysqli_close($db);



//2016-06-22 support for EmailOversight  U: shai@inetb.com   P: 5146_Drd
// documentation https://login.emailoversight.com/ApiPage/EmailAppend
/*
GET URL: https://api.emailoversight.com/api/EmailAppend?apitoken=2ed8c5a6-5597-4b69-bdb0-a854504d8472&lastname={LastName}&firstname={FirstName}&postalcode={PostalCode}&middlename=&formattedaddress=&zip4=
*/
$url="https://api.emailoversight.com/api/EmailValidation?apitoken=2ed8c5a6-5597-4b69-bdb0-a854504d8472&listid=3117&email=$e";


$ch = curl_init('http://google.com');
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1) ;
$res = curl_exec ($ch);
// if res is JSON, you can use $PHP_normal_assosiate_array = json_decode($res,1)
// to see the array visually, use print_r($arr);
curl_close ($ch);
print"After talking to google, I got back ".strlen($res).
	" bytes back<br> The return starts like this<xmp>".substr($res,200)."</xmp>";
?>
