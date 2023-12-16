export {initBoard};
// Función para inicializar el tablero del juego
function initBoard(gameState, cellClickHandler) { 

  // Inicializa la matriz del tablero con valores vacíos

	for (let i = 0; i < gameState.ROWS; i++) { 
		gameState.board[i] = []; 
		for (let j = 0; j < gameState.COLS; j++) { 
			gameState.board[i][j] = gameState.EMPTY; 
		} 
	}
    // Obtiene todas las celdas del tablero

  const cells = document.querySelectorAll('.cell'); 

    // Agrega un evento de clic a cada celda del tablero, llamando al controlador proporcionado (cellClickHandler)

  cells.forEach(cell => cell.addEventListener('click', cellClickHandler));
}
