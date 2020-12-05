<?php
// The URL to the web service
define('BASEURL', 'https://digimon.fandom.com');

// Guide URLs
// https://digimon.fandom.com/api.php?action=query&prop=images&format=json&titles=devimon
// https://digimon.fandom.com/api/v1/Articles/Details?abstract=500&titles=gabumon
// https://digimon.fandom.com/api.php?action=query&prop=imageinfo&iiprop=timestamp|user|url&iiurlwidth=320&format=json&titles=File:Devimon%20b.jpg

$url = BASEURL;

// Get the api call type
$action = NULL;
if (array_key_exists(('action'), $_GET)) {
	$action = $_GET['action'];
}

// Edit url based on call type
switch ($action) {
	case 'image':
		$url .= "/api.php?action=query&prop=images&format=json";

		// Define name to search
		if (array_key_exists('name', $_GET)) {
			$url .= "&titles=" . $_GET['name'];
		}
		break;
	case 'file':
		$name = "";
		// Define name to search
		if (array_key_exists('name', $_GET)) {
			$name = $_GET['name'];
		}
		$name = urlencode($name);

		// URL that asks for scaled image
		// $url .= "/api.php?action=query&prop=imageinfo&iiprop=timestamp|user|url&iiurlwidth=320&titles={$name}&format=json";
		$url .= "/api.php?action=query&prop=imageinfo&iiprop=timestamp|user|url&titles={$name}&format=json";
		break;
	case 'abstract':
		$url .= "/api/v1/Articles/Details?abstract=500";

		// Define name to search
		if (array_key_exists('name', $_GET)) {
			$url .= "&titles=" . $_GET['name'];
		}
		break;
	default:
		throw new Exception('Unidentified action: ' . $action);
}

// The `stream_context_create()` function is where we can specify the POST method
// https://www.php.net/manual/en/context.http.php
$opts = array('http' =>
array(
	'method'  => 'GET',
));
$context = stream_context_create($opts);

// Call the web service
$result = file_get_contents($url, false, $context);

// Echo results 
header('content-type:application/json'); // tell the requestor that this is JSON
header("Access-Control-Allow-Origin: *"); // turn on CORS for that shout-client.html can use this service
echo $result;
?>