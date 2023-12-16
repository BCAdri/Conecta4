import { checkWinner } from "../../src/gameFunctions/checkWinner.js";
import { restart } from "../../src/gameFunctions/restart.js";
import { drawBoard } from "../../src/gameFunctions/drawBoard.js";
import { initBoard } from "../../src/gameFunctions/initBoard.js";
import { loadGame,deleteGame } from "../../src/gameFunctions/game.js";

import {loginSupabase} from "../../src/loginRegistro/http.js";

import { cellClicked,makeMove,isValidMove } from "../../src/gameFunctions/juego.js";
describe("game",function(){
  it('should return false when there is no winner', function() {
    // Arrange
    const gameState = {
        ROWS: 6,
        COLS: 7,
        board: [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ],
        winner: null
    };

    // Act
    const result = checkWinner(gameState);

    // Assert
    expect(result).toBe(false);
    expect(gameState.winner).toBe(null);
});

it('should remove classes and click events from all cells when restart is called', function() {
  // Arrange
  const gameState = {
    ROWS: 6,
    COLS: 7,
    EMPTY: null,
    board: [],
    gameOver: false,
    turn: 'red',
    winner: null,
    toggleTurn: true,
    lastMoveR: -1,
    lastMoveC: -1,
    player1: document.querySelector('.player1'),
    player2: document.querySelector('.player2'),
    loeaed: false
  };
  const cellClickHandler = jasmine.createSpy('cellClickHandler');
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.add('red', 'yellow');
    cell.addEventListener('click', cellClickHandler);
  });

  // Act
  restart(gameState, cellClickHandler);

  // Assert
  cells.forEach(cell => {
    expect(cell.classList.contains('red')).toBe(false);
    expect(cell.classList.contains('yellow')).toBe(false);
    expect(cell.removeEventListener).toHaveBeenCalledWith('click', cellClickHandler);
  });
});
  it('should draw a red piece on the board when the gameState turn is RED', () => {
    const gameState = {
      lastMoveR: 0,
      lastMoveC: 0,
      turn: 'RED',
      COLS: 7,
      RED: 'RED',
      YELLOW: 'YELLOW'
    };

    document.body.innerHTML = `
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
    `;

    drawBoard(gameState);

    const cells = document.querySelectorAll('.cell');
    expect(cells[0].classList.contains('red')).toBe(true);
  });
  it('should initialize the game board matrix with empty values for each cell', function() {
    // Arrange
    const gameState = {
      ROWS: 3,
      COLS: 3,
      EMPTY: ''
    };
    const cellClickHandler = jasmine.createSpy('cellClickHandler');

    // Act
    initBoard(gameState, cellClickHandler);

    // Assert
    expect(gameState.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
  });


  it('should load a game from Supabase by ID and return the loaded game state', async function() {
    spyOn(localStorage, 'getItem').and.returnValue('test@example.com');
    spyOn(supabase, 'createClient').and.returnValue({
      from: function() {
        return this;
      },
      select: function() {
        return this;
      },
      eq: function() {
        return this;
      },
      single: function() {
        return { data: { gameState: JSON.stringify(gameState) } };
      }
    });

    const result = await loadGame(123);

    expect(result.success).toBe(true);
    expect(result.errorMessage).toBe("Loading...");
    expect(result.gameState).toEqual(gameState);
  });

  it('should successfully delete a game with a valid ID and email', async function() {
    spyOn(localStorage, 'getItem').and.returnValue('test@example.com');
    spyOn(supabase, 'createClient').and.returnValue({
      from: function() {
        return {
          delete: function() {
            return {
              eq: function() {
                return {
                  eq: function() {
                    return {
                      data: [{ id: 1 }],
                      error: null
                    };
                  }
                };
              }
            };
          }
        };
      }
    });

    const result = await deleteGame(1);

    expect(result.success).toBe(true);
    expect(result.errorMessage).toBe("Game successfully deleted.");
  });
  it('should make a POST request to the Supabase API with the provided email and password and return the response data', async function() {
    const email = 'test@example.com';
    const password = 'password';
    const expectedData = { token: 'abc123' };

    spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => Promise.resolve(expectedData)
    }));

    const result = await loginSupabase(email, password);

    expect(window.fetch).toHaveBeenCalledWith(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'post',
      headers: headers,
      body: JSON.stringify({ email, password })
    });
    expect(result).toEqual(expectedData);
  });
  
  it('should obtain the column number from the clicked tdElement', function() {
    const gameState = { gameOver: false };
    const tdElement = document.createElement('td');
    tdElement.classList.add('col-2');

    spyOn(console, 'log');

    cellClicked({ target: tdElement }, gameState);

    expect(console.log).toHaveBeenCalledWith(gameState);
  });
  it('should not update the board, save the move, draw the board, swap the turn, and return False when given an invalid column number and game state', function() {
    const gameState = {
      gameOver: false,
      COLS: 7,
      board: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      turn: 'RED',
      ROWS: 6,
      lastMoveR: null,
      lastMoveC: null,
      player1: document.getElementById('player1'),
      player2: document.getElementById('player2'),
      toggleTurn: true
    };

    const col = -1;

    const result = makeMove(col, gameState);

    expect(result).toBe(false);
    // expect(drawBoard).not.toHaveBeenCalled();
    // expect(swapTurn).not.toHaveBeenCalled();
  });

  it('should return true when column is within bounds and not full', function() {
    const gameState = {
      gameOver: false,
      COLS: 7,
      board: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    };
    const col = 3;
    const result = isValidMove(col, gameState);
    expect(result).toBe(true);
  });
})

