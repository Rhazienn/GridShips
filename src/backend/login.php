<?php

	require_once "sqlFunctions.php";

	$row = verify($conn, $_POST['username']);
	
	if(password_verify($_POST['password'],$row['senha'])){
		session_start();

		$user = $row['id'];
		$_SESSION = getAll($conn, $user);
	}