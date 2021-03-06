function goBack(){
	window.location.href = "../../index.html"
}

window.onbeforeunload = function(){
	return '';
};

document.addEventListener('DOMContentLoaded', () => {
	const userGrid = document.querySelector('.grid-user')
	const computerGrid = document.querySelector('.grid-computer')
	const displayGrid = document.querySelector('.grid-display')
	const ships = document.querySelectorAll('.ship')
	const destroyer = document.querySelector('.destroyer-container')
	const submarine = document.querySelector('.submarine-container')
	const cruiser = document.querySelector('.cruiser-container')
	const battleship = document.querySelector('.battleship-container')
	const carrier = document.querySelector('.carrier-container')
	const startButton = document.querySelector('#start')
	const rotateButton = document.querySelector('#rotate')
	const turnDisplay = document.querySelector('#whose-go')
	const infoDisplay = document.querySelector('#info')
	const setupButtons = document.getElementById('setup-buttons')
	const userSquares = []
	const computerSquares = []
	let isHorizontal = true
	let isGameOver = false
	let currentPlayer = 'user'
	const width = 10
	let shotFired = -1
	let once = 0
	const stats = {
		"totalFired": 0,
		"hit": 0,
		"miss": 0
	}
	//Ships
	const shipArray = [
		{
			name: 'destroyer',
			directions: [
				[0, 1],
				[0, width]
			]
		},
		{
			name: 'submarine',
			directions: [
				[0, 1, 2],
				[0, width, width*2]
			]
		},
		{
			name: 'cruiser',
			directions: [
				[0, 1, 2],
				[0, width, width*2]
			]
		},
		{
			name: 'battleship',
			directions: [
				[0, 1, 2, 3],
				[0, width, width*2, width*3]
			]
		},
		{
			name: 'carrier',
			directions: [
				[0, 1, 2, 3, 4],
				[0, width, width*2, width*3, width*4]
			]
		},
	]

	createBoard(userGrid, userSquares)
	createBoard(computerGrid, computerSquares)

	startSinglePlayer()

	// Single Player
	function startSinglePlayer() {
		generate(shipArray[0])
		generate(shipArray[1])
		generate(shipArray[2])
		generate(shipArray[3])
		generate(shipArray[4])

		startButton.addEventListener('click', () => {
			setupButtons.style.display = 'none'
			playGameSingle()
		})
	}

	//Create Board
	function createBoard(grid, squares) {
		for (let i = 0; i < width*width; i++) {
			const square = document.createElement('div')
			square.dataset.id = i
			grid.appendChild(square)
			squares.push(square)
		}
	}

	//Draw the computers ships in random locations
	function generate(ship) {
		let randomDirection = Math.floor(Math.random() * ship.directions.length)
		let current = ship.directions[randomDirection]
		if (randomDirection === 0){
			direction = 1
		}
		if (randomDirection === 1){
			direction = 10
		}
		let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))

		const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
		const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
		const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

		if (!isTaken && !isAtRightEdge && !isAtLeftEdge){
			current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))
		}
		else generate(ship)
	}
	

	//Rotate the ships
	function rotate() {
		if (isHorizontal) {
			destroyer.classList.toggle('destroyer-container-vertical')
			submarine.classList.toggle('submarine-container-vertical')
			cruiser.classList.toggle('cruiser-container-vertical')
			battleship.classList.toggle('battleship-container-vertical')
			carrier.classList.toggle('carrier-container-vertical')
			isHorizontal = false
			return
		}
		if (!isHorizontal) {
			destroyer.classList.toggle('destroyer-container-vertical')
			submarine.classList.toggle('submarine-container-vertical')
			cruiser.classList.toggle('cruiser-container-vertical')
			battleship.classList.toggle('battleship-container-vertical')
			carrier.classList.toggle('carrier-container-vertical')
			isHorizontal = true
			return
		}
	}
	rotateButton.addEventListener('click', rotate)

	//move around user ship
	ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
	userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
	userSquares.forEach(square => square.addEventListener('dragover', dragOver))
	userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
	userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
	userSquares.forEach(square => square.addEventListener('drop', dragDrop))
	userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

	let selectedShipNameWithIndex
	let draggedShip
	let draggedShipLength

	ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
		selectedShipNameWithIndex = e.target.id
	}))

	function dragStart() {
		draggedShip = this
		draggedShipLength = this.childNodes.length
	}

	function dragOver(e) {
		e.preventDefault()
	}

	function dragEnter(e) {
		e.preventDefault()
	}

	function dragLeave(){

	}

	function dragDrop() {
		let shipNameWithLastId = draggedShip.lastChild.id
		let shipClass = shipNameWithLastId.slice(0, -2)
		let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
		let shipLastId = lastShipIndex + parseInt(this.dataset.id)
		const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
		const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
		
		let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
		let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

		selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

		shipLastId = shipLastId - selectedShipIndex

		if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
			for (let i=0; i < draggedShipLength; i++) {
				let directionClass
				if (i === 0){
					directionClass = 'start'
				}
				if (i === draggedShipLength - 1){
					directionClass = 'end'
				}
				userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
			}
		} else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
			for (let i=0; i < draggedShipLength; i++) {
				let directionClass
				if (i === 0){
					directionClass = 'start'
				}
				if (i === draggedShipLength - 1){
					directionClass = 'end'
				}
				userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', 'vertical', directionClass, shipClass)
			}
		} else return

		displayGrid.removeChild(draggedShip)
		if(!displayGrid.querySelector('.ship')){
			allShipsPlaced = true
		}
	}

	function dragEnd() {

	}

	// Game Logic for Single Player
	function playGameSingle() {
		if (isGameOver){
			return
		}
		if (currentPlayer === 'user') {
			turnDisplay.innerHTML = 'Your Go'
			computerSquares.forEach(square => square.addEventListener('click', function(e) {
				shotFired = square.dataset.id
				setTimeout(() => { revealSquare(square.classList) }, 100);
			}))
		}
		if (currentPlayer === 'enemy') {
			turnDisplay.innerHTML = 'Computers Go'
			setTimeout(enemyGo, 1000)
		}
	}

	let destroyerCount = 0
	let submarineCount = 0
	let cruiserCount = 0
	let battleshipCount = 0
	let carrierCount = 0

	function revealSquare(classList) {
		const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`)
		const obj = Object.values(classList)
		if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
			if (obj.includes('destroyer')){
				destroyerCount++
				stats['hit']++
			} 
			if (obj.includes('submarine')){
				submarineCount++
				stats['hit']++
			} 
			if (obj.includes('cruiser')){
				cruiserCount++
				stats['hit']++
			} 
			if (obj.includes('battleship')){
				battleshipCount++
				stats['hit']++
			} 
			if (obj.includes('carrier')){
				carrierCount++
				stats['hit']++
			} 
		}
		if (obj.includes('taken')) {
			enemySquare.classList.add('boom')
		} else {
			enemySquare.classList.add('miss')
			stats['miss']++
		}

		stats['totalFired']++

		checkForWins()
		currentPlayer = 'enemy'
		playGameSingle()
	}

	let cpuDestroyerCount = 0
	let cpuSubmarineCount = 0
	let cpuCruiserCount = 0
	let cpuBattleshipCount = 0
	let cpuCarrierCount = 0

	var numbers = [];

	function enemyGo(square) {
		var min, max, r, n, p;
		min = 0;
		max = 99;
		r = 1; // how many numbers you want to extract
	
		for (let i = 0; i < r; i++) {
			do {
				n = Math.floor(Math.random() * (max - min + 1)) + min;
				p = numbers.includes(n);
				if(!p){
				numbers.push(n);
				}
			}
			while(p);
		}

		square = numbers[numbers.length - 1]
		if (!userSquares[square].classList.contains('boom')) {
			const hit = userSquares[square].classList.contains('taken')
			userSquares[square].classList.add(hit ? 'boom' : 'miss')
			if (userSquares[square].classList.contains('destroyer')){
				cpuDestroyerCount++
			} 
			if (userSquares[square].classList.contains('submarine')){
				cpuSubmarineCount++
			} 
			if (userSquares[square].classList.contains('cruiser')){
				cpuCruiserCount++
			}
			if (userSquares[square].classList.contains('battleship')){
				cpuBattleshipCount++
			}
			if (userSquares[square].classList.contains('carrier')){
				cpuCarrierCount++
			}
			checkForWins()
		} else {
			enemyGo()
		} 
		currentPlayer = 'user'
		turnDisplay.innerHTML = 'Your Go'
	}

	function checkForWins() {
		let ended = false
		let enemy = 'computador'
		if (destroyerCount === 2) {
			infoDisplay.innerHTML = `Voc?? afundou o destroyer de: ${enemy}`
			destroyerCount = 10
		}
		if (submarineCount === 3) {
			infoDisplay.innerHTML = `Voc?? afundou o submarino de: ${enemy}`
			submarineCount = 10
		}
		if (cruiserCount === 3) {
			infoDisplay.innerHTML = `Voc?? afundou o cruiser de: ${enemy}`
			cruiserCount = 10
		}
		if (battleshipCount === 4) {
			infoDisplay.innerHTML = `Voc?? afundou o battleship de: ${enemy}`
			battleshipCount = 10
		}
		if (carrierCount === 5) {
			infoDisplay.innerHTML = `Voc?? afundou o carrier de: ${enemy}`
			carrierCount = 10
		}
		if (cpuDestroyerCount === 2) {
			infoDisplay.innerHTML = `${enemy} afundou o seu destroyer`
			cpuDestroyerCount = 10
		}
		if (cpuSubmarineCount === 3) {
			infoDisplay.innerHTML = `${enemy} afundou o seu submarine`
			cpuSubmarineCount = 10
		}
		if (cpuCruiserCount === 3) {
			infoDisplay.innerHTML = `${enemy} afundou o seu cruiser`
			cpuCruiserCount = 10
		}
		if (cpuBattleshipCount === 4) {
			infoDisplay.innerHTML = `${enemy} afundou o seu battleship`
			cpuBattleshipCount = 10
		}
		if (cpuCarrierCount === 5) {
			infoDisplay.innerHTML = `${enemy} afundou o seu carrier`
			cpuCarrierCount = 10
		}
		var temp = destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount
		if ((temp) === 50) {
			infoDisplay.innerHTML = "Vit??ria voc?? venceu"
			gameOver()
		}
		if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
			infoDisplay.innerHTML = `Derrota, ${enemy.toUpperCase()} ganhou`
			gameOver()
		}
	}

	function gameOver() {
		isGameOver = true
		startButton.removeEventListener('click', playGameSingle)
		saveStats()
	}

	function saveStats() {
		if(once == 0){
			$.ajax({
				url:"../backend/game.php",
				method: "POST",
				data:{
					stats: stats
				}
			})
			once++
		}
	}
})
