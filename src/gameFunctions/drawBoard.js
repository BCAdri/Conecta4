export {drawBoard, drawBoardLoad};
// Función para dibujar el tablero después de realizar un movimiento
function drawBoard(gameState) {

    const cells = document.querySelectorAll('.cell');
    // obteniendo el índice de la casilla escogida por el usuario y el color que toca para dibujar la ficha
    const index = (parseInt(gameState.lastMoveR) * gameState.COLS) + parseInt(gameState.lastMoveC);
    const color = (gameState.turn === gameState.RED) ? 'red' : 'yellow';
      // Añade la clase del color correspondiente a la casilla seleccionada
    cells[index].classList.add(color);
  }
// Función para dibujar el tablero al cargar el juego
  function drawBoardLoad(gameState) {

    const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < gameState.ROWS; i++) {
      for (let j = 0; j < gameState.COLS; j++) {
        const index = i * gameState.COLS + j;
              // Determina la clase de color según el valor en la matriz del tablero

        const colorClass = (gameState.board[i][j] === 1) ? 'red' : (gameState.board[i][j] === 2) ? 'yellow' : '';
              // Si hay una clase de color, elimina las clases anteriores y agrega la nueva clase de color

        if (colorClass) {
            cells[index].classList.remove('red', 'yellow');
            cells[index].classList.add(colorClass);
          }
      }
    }
  }
