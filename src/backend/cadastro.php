<?php

	require_once "sqlFunctions.php";

	$data = [
		'username' => $_POST['username'],
		'email' => $_POST['email'],
		'password' => password_hash($_POST['password'],PASSWORD_BCRYPT)
	];

	saveUser($conn, $data);