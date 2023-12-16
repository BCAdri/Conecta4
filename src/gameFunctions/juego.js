import { initBoard} from "./initBoard.js"
import { checkWinner } from "./checkWinner.js";
import { restart } from "./restart.js";
import { saveGame, gameState } from "./game.js";
import { drawBoard,drawBoardLoad} from "./drawBoard.js";

export {cellClicked,makeMove,isValidMove};
addEventListener("DOMContentLoaded", () => {
  // Mostrar el overlay al cargar la página
  showOverlay();

    // Ocultar el overlay después de 3 segundos
  setTimeout(function() {
    hideOverlay();
  }, 3000);
  // Función para mostrar el overlay

function showOverlay() {
  document.getElementById("overlay").style.display = "flex";
}
  // Función para ocultar el overlay

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}
  // Esperar 4 segundos antes de realizar acciones adicionales
  setTimeout(() => {
        // Verificar si el juego no está cargado previamente
  if (!gameState.loaded) {
      // Inicializar el estado del juego y agregar manejadores de clic

    gameState.turn = gameState.RED;
    const cellClickHandler = (event) => cellClicked(event, gameState);
    initBoard(gameState, cellClickHandler);
    const cells = document.querySelectorAll('.cell'); 
    cells.forEach(cell => cell.addEventListener('click', cellClickHandler));
    setButtonsListeners(gameState, cellClickHandler);

  }else{
      // Si el juego está cargado, cargar el estado y mostrarlo en el tablero

    const cellClickHandler = (event) => cellClicked(event, gameState);
    const cells = document.querySelectorAll('.cell'); 
    cells.forEach(cell => cell.addEventListener('click', cellClickHandler));
    setButtonsListeners(gameState, cellClickHandler);
    drawBoardLoad(gameState);

  }

   
   }, 4000);
  
  //Función que establecer los listeners para los botones encargados
  //de reiniciar la partida.

  function setButtonsListeners(gameState, cellClickHandler) {
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
      restart(gameState, cellClickHandler);
    });

    const saveGameBtn = document.getElementById('saveGameBtn');
    saveGameBtn.addEventListener('click', () => {
      saveGame(gameState);
    });

    const loadGameBtn = document.getElementById('loadGameBtn');
    loadGameBtn.addEventListener('click', () => {
      window.location.href = './load-game.html';
    });
  }


})
  //Función que gestiona el evento de clic en una casilla

  function cellClicked(event, gameState) {
    console.log(gameState)
    if (gameState.gameOver) {
      return;
    }

    /*
     * Obtención del nº de columna sobre el que se ha hecho clic:
     * 1) Se obtiene el elemento td que disparó el evento
     * 2) Se obtiene una string con todas sus clases
     * 3) Se obtiene la posición de comienzo de la clase 'col-X'
     * 4) Se obtiene la posición del nº de columna
     * 5) Finalmente se obtiene dicho nº (la X)
    */
    const tdElement = event.target;
    const listNamesString = tdElement.classList.toString();
    const pos = listNamesString.indexOf("col-");
    if (pos !== -1) {
      const numberPos = pos + 4;
      const colNumber = listNamesString.substr(numberPos, 1);

      /*
       * ¿Se puede llevar a cabo el movimiento?
       * A) Sí: Se comprueba si hay hay algún ganador, en cuyo caso se finaliza la partida.
       *    Si la partida no finaliza, se pasa siguiente turno.
       * B) No: la función finaliza.
       */
      if (makeMove(colNumber, gameState)) {
        if (checkWinner(gameState)) {
          gameState.gameOver = true;
          showGameOver(gameState);
        } else {
          nextTurn(gameState);
        }
      }
    } // if (pos !== -1)
    else {
      console.log('Error al intentar obtener la posición de la columna');
      return;
    }
  }/*
 * Función booleana que comprueba si se puede realizar el movimiento solicitado por el usuario.
 * Si no se puede, devuelve false.
 * Si se puede, dibuja la ficha en la casilla que corresponda, cambia de turno y devuelve true.
*/
  function makeMove(col, gameState) {
    if (!isValidMove(col, gameState)) {
      return false;
    }
    // Se van analizando las diferentes filas, empezando por abajo, en busca de la primera casilla libre
    for (let i = gameState.ROWS - 1; i >= 0; i--) {
      /*
       * En caso de encontrar una casilla vacía:
       * 1) Asigna la ficha que corresponda a la casilla (RED/YELLOW)
       * 2) Guarda la posición (fila y columna) de la ficha que se va a colocar
       * 3) Dibuja la ficha en el tablero
       * 4) Cambia de turno
       * 5) Devuelve true indicando que el movimiento se llevó a cabo
      */
      if (gameState.board[i][col] === 0) {
        gameState.board[i][col] = gameState.turn;
        saveMove(i, col, gameState);
        drawBoard(gameState);
        swapTurn(gameState);
        return true;
      }
    }
  }

  /*
   * Función booleana que comprueba si el movimiento solicitado es válido.
   * Si es válido, devuelve true.
   * Si no es válido, devuelve false.
  */
  function isValidMove(col, gameState) {
    // Partida finalizada: movimiento no válido
    if (gameState.gameOver) {
      console.log("movimiento no válido: gameOver");
      return false;
    }
    // Fuera de los límites: movimiento no válido
    if (col < 0 || col >= gameState.COLS) {
      console.log("movimiento no válido: fuera de los límites");
      return false;
    }
    // Columna llena de fichas: movimiento no válido
    if (gameState.board[0][col] !== 0) {
      console.log("movimiento no válido: columna completa");
      return false;
    }
    // Cualquier otro caso: movimiento válido
    console.log("movimiento válido");
    return true;
  }

  /*
   * Función que guarda las coordenadas (fila y columna) de la ficha que se va a colocar/dibujar en el tablero
  */
  function saveMove(row, col, gameState) {
    gameState.lastMoveR = row;
    gameState.lastMoveC = col;
  }

  /*
   * Función que dibuja la ficha que corresponda (roja/amarilla)
  */


  /*
   * Función que cambia el turno actual del jugador.
   * Añade/quita la clase 'active' al <div> del jugador que corresponda.
  */
  function swapTurn(gameState) {
    gameState.toggleTurn = !gameState.toggleTurn;
    if (gameState.toggleTurn) {
      gameState.player1.classList.add("activered");
      gameState.player2.classList.remove("activeyellow");
    } else {
      gameState.player2.classList.add("activeyellow");
      gameState.player1.classList.remove("activered");
    }
  }

  /*
   * Función que cambia el turno, cambiando entre fichas rojas / amarillas
  */
  function nextTurn(gameState) {
    gameState.turn = (gameState.turn === gameState.RED) ? gameState.YELLOW : gameState.RED;
  }

  /*
   * Función que muestra el mensaje de fin de partida
  */
  function showGameOver(gameState) {
    const message = document.getElementById('message');
    if (gameState.winner === gameState.RED) {
      message.innerText = '¡Victoria para el equipo rojo!';
    } else if (gameState.winner === gameState.YELLOW) {
      message.innerText = '¡Victoria para el equipo amarillo!';
    } else {
      message.innerText = '¡Empate!';
    }
    saveGame(gameState);
  }