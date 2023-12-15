export {initBoard};

function initBoard(gameState, cellClickHandler) { 


	for (let i = 0; i < gameState.ROWS; i++) { 
		gameState.board[i] = []; 
		for (let j = 0; j < gameState.COLS; j++) { 
			gameState.board[i][j] = gameState.EMPTY; 
		} 
	}
  
  const cells = document.querySelectorAll('.cell'); 
  cells.forEach(cell => cell.addEventListener('click', cellClickHandler));
}
