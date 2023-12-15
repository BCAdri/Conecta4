export {checkWinner};

function checkWinner(gameState) { 
	// Comprobación horizontal 
	for (let i = 0; i < gameState.ROWS; i++) { 
		for (let j = 0; j < gameState.COLS - 3; j++) { // -3 porque luego se comprueban las siguientes 3 posiciones hacia la derecha
			if (gameState.board[i][j] !== 0 && 
                gameState.board[i][j] === gameState.board[i][j + 1] && 
                gameState.board[i][j] === gameState.board[i][j + 2] && 
                gameState.board[i][j] === gameState.board[i][j + 3]) { 
                gameState.winner = gameState.board[i][j]; 
            return true; 
      } 
    } 
  } 
  // Comprobación vertical 
for (let i = 0; i < gameState.ROWS - 3; i++) {  // -3 porque luego se comprueban las siguientes 3 posiciones hacia abajo
  for (let j = 0; j < gameState.COLS; j++) { 
    if (gameState.board[i][j] !== 0 && 
        gameState.board[i][j] === gameState.board[i + 1][j] && 
        gameState.board[i][j] === gameState.board[i + 2][j] && 
        gameState. board[i][j] === gameState.board[i + 3][j]) { 
        gameState.winner = gameState.board[i][j]; 
        return true; 
    } 
  } 
} 
// Comprobación diagonal ascendente 
for (let i = 3; i < gameState.ROWS; i++) { 
  for (let j = 0; j < gameState.COLS - 3; j++) { 
    if (gameState.board[i][j] !== 0 && 
        gameState.board[i][j] === gameState.board[i - 1][j + 1] && 
        gameState.board[i][j] === gameState.board[i - 2][j + 2] && 
        gameState.board[i][j] === gameState.board[i - 3][j + 3]) { 
            gameState.winner = gameState.board[i][j]; 
          return true; 
    } 
  } 
} 
// Comprobación diagonal descendente 
for (let i = 0; i < gameState.ROWS - 3; i++) { 
  for (let j = 0; j < gameState.COLS - 3; j++) { 
    if (gameState.board[i][j] !== 0 && 
        gameState.board[i][j] === gameState.board[i + 1][j + 1] && 
        gameState.board[i][j] === gameState.board[i + 2][j + 2] && 
        gameState.board[i][j] === gameState.board[i + 3][j + 3]) { 
            gameState.winner = gameState.board[i][j]; 
        return true; 
      } 
    } 
} 
// No hay ganador 
return false; 
}