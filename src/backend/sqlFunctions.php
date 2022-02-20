<?php

	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "gridships";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		die("Connection failed: ". $conn->connect_error);
	}
	
	function saveUser($conn, $usrInfo){
		$name = $usrInfo['username'];
		$email = $usrInfo['email'];
		$password = $usrInfo['password'];

		$sql = "INSERT INTO `users`(`nome`, `email`, `senha`) VALUES ('$name','$email','$password')";

		if ($conn->query($sql) === TRUE) {
			echo json_encode(array("msg" => "Salvo com sucesso"));
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	function getAll($conn, $user){
		$sql = "SELECT `nome`, `status`, `acertos`, `disparos`, `erros`, `taxaDeAcerto` FROM `users` INNER JOIN `stats` ON `userId` = `id` WHERE `id` = $user";
		$conn -> select_db('gridships');
		$result = $conn->query($sql);
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

		if ($row) {
			return $row;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	function verify($conn, $name){
		$sql = "SELECT `id`,`senha` FROM `users` WHERE `nome` = '$name'";
		$conn -> select_db('gridships');
		$result = $conn->query($sql);
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		
		if ($row) {
			echo json_encode(array("msg" => "Login efetuado com sucesso"));
			return $row;
		} else {
			echo json_encode(array("msg" => "Usuario ou senha incorretos"));
		}
	}

	function prepare($conn, $data, $user, $result = null){
		$result = getAll($conn, $user);
		
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

		$disparos = $data['disparos'] + $row['disparos'];
		$acertos = $data['acertos'] + $row['acertos'];
		$erros = $data['erros'] + $row['erros'];
		
		$new_data = [
			'disparos' => $disparos,
			'acertos' => $acertos,
			'erros' => $erros
		];
		
		saveData($conn, $new_data);
	}

	function saveData($conn, $new_data){
		$disparos = $new_data['disparos'];
		$acertos = $new_data['acertos'];
		$erros = $new_data['erros'];
		$taxaDeAcertos = ($new_data['acertos']/$new_data['disparos'])*100;

		$sql = "UPDATE `stats` SET `disparos`='$disparos',`acertos`='$acertos',`erros`='$erros',`taxaDeAcerto`='$taxaDeAcertos' WHERE `userId` = 1";
			

		if ($conn->query($sql) === TRUE) {
			echo "Salvo com sucesso";
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}