export {restart};
import { initBoard } from "./initBoard.js";
function restart(gameState,cellClickHandler) {
    // 1er paso
    const cells = document.querySelectorAll('.cell'); 
    cells.forEach(cell => { 
      cell.classList.remove('red', 'yellow'); 
      cell.removeEventListener('click', cellClickHandler);
    }); 
    
    // 2º paso
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
    // 3er paso
    
    initBoard(gameState, cellClickHandler); 
  }

  