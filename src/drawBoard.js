export {drawBoard, drawBoardLoad};
function drawBoard(gameState) {

    const cells = document.querySelectorAll('.cell');
    // obteniendo el índice de la casilla escogida por el usuario y el color que toca para dibujar la ficha
    const index = (parseInt(gameState.lastMoveR) * gameState.COLS) + parseInt(gameState.lastMoveC);
    const color = (gameState.turn === gameState.RED) ? 'red' : 'yellow';
    cells[index].classList.add(color);
  }

  function drawBoardLoad(gameState) {

    const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < gameState.ROWS; i++) {
      for (let j = 0; j < gameState.COLS; j++) {
        const index = i * gameState.COLS + j;
        const colorClass = (gameState.board[i][j] === 1) ? 'red' : (gameState.board[i][j] === 2) ? 'yellow' : '';
        
        if (colorClass) {
            cells[index].classList.remove('red', 'yellow');
            cells[index].classList.add(colorClass);
          }
      }
    }
  }
