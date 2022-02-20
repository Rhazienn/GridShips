<?php
	require_once "sqlFunctions.php";

	$data = [
		'disparos' => $_POST['totalFired'],
		'acertos' => $_POST['hit'],
		'erros' => $_POST['miss']
	];

	$user = $_SESSION['id']

	prepare($conn, $data, $user);
