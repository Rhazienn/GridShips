<?php
	require_once "sqlFunctions.php";
	session_start();

	echo json_encode(
		$data = [
			'disparos' => $_SESSION['disparos'],
			'acertos' => $_SESSION['acertos'],
			'erros' => $_SESSION['erros'],
			'taxaDeAcerto' => $_SESSION['taxaDeAcerto'],
			'nome' => $_SESSION['nome'],
			'status' => $_SESSION['status']
		]
	);