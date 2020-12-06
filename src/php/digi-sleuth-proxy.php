<?php
// The URL to the web service
define('BASEURL', 'https://digimon-cyber-sleuth-api.herokuapp.com/api');

$url = BASEURL;

// Get the api call type
$action = NULL;
if (array_key_exists(('action'), $_GET)){
 $action = $_GET['action'];
}

// Edit url based on call type
switch ($action) {
	case 'search':
		$url .= "/digimon";

		// Define name to search
		if (array_key_exists('name', $_GET)) {
			$url .= "/name/" . rawurlencode($_GET['name']);
		}
		break;
	case 'skill':
		$url .= "/skills";

		// Define id of skill
		if (array_key_exists('id', $_GET)) {
			$url .= "/id/" . $_GET['id'];
		}
		break;
	case 'list':
		$url .= "/digimon";

		// Filter list if specified
		if (array_key_exists('stage', $_GET))
			$url .= "/stage/" . $_GET['stage'];
		else if (array_key_exists('type', $_GET))
			$url .= "/type/" . $_GET['type'];
		else if (array_key_exists('attribute', $_GET))
			$url .= "/attribute/" . $_GET['attribute'];
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