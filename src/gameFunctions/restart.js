export {restart};
import { initBoard } from "./initBoard.js";

// Función para reiniciar el juego

function restart(gameState,cellClickHandler) {
  // 1er paso: Remover clases y eventos de clic en todas las celdas
  const cells = document.querySelectorAll('.cell'); 
    cells.forEach(cell => { 
      cell.classList.remove('red', 'yellow'); 
      cell.removeEventListener('click', cellClickHandler);
    }); 
    
  // 2º paso: Restablecer el estado del juego y la interfaz de usuario
  gameState.gameOver = false;
    gameState.turn = gameState.RED;
    message.innerText = ''; 
    gameState.board = [];
    gameState.winner = null;
    gameState.toggleTurn = true;
    gameState.lastMoveR = -1;
    gameState.lastMoveC = -1;
    gameState.player1.classList.add("activered");
    gameState.player2.classList.remove("activeyellow");
    gameState.loeaed = false;
  // 3er paso: Inicializar el tablero y restablecer los eventos de clic
    
    initBoard(gameState, cellClickHandler); 
  }

  