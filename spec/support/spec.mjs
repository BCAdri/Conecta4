import { checkWinner } from "../../src/checkWinner.js";
import { restart } from "../../src/restart.js";
import { drawBoard } from "../../src/drawBoard.js";
import { initBoard } from "../../src/initBoard.js";
import {cellClicked} from "../../src/juego.js";
import { saveGame,loadGame } from "../../src/game.js";
import {updateProfile, loginSupabase} from "../../src/http.js";

describe("game",function(){
    it('should return false when there is no winner', () => {
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
  
        const result = checkWinner(gameState);
  
        expect(result).toBe(false);
        expect(gameState.winner).toBe(null);
      });
      it('should add color class to cell corresponding to last move', function() {
        // Arrange
        const gameState = {
          lastMoveR: 2,
          lastMoveC: 3,
          COLS: 7,
          turn: 'red',
          RED: 'red',
          YELLOW: 'yellow'
        };
        const cells = [
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } },
          { classList: { add: jasmine.createSpy() } }
        ];
  
        spyOn(document, 'querySelectorAll').and.returnValue(cells);
  
        // Act
        drawBoard(gameState);
  
        // Assert
        expect(cells[17].classList.add).toHaveBeenCalledWith('red');
      });

      it('should update profile with valid data', async function() {
        // Mock localStorage.getItem
        spyOn(localStorage, 'getItem').and.returnValues('valid_token', 'valid_uid');
  
        // Mock fileRequest
        spyOn(window, 'fileRequest').and.returnValue({ urlAvatar: 'avatar_url' });
  
        // Mock updateData
        spyOn(window, 'updateData').and.returnValue({});
  
        // Call the function
        await updateProfile({ name: 'John Doe' });
  
        // Assertions
        expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
        expect(localStorage.getItem).toHaveBeenCalledWith('uid');
        expect(window.fileRequest).toHaveBeenCalled();
        expect(window.updateData).toHaveBeenCalledWith('profiles?id=eq.valid_uid&select=*', 'valid_token', { name: 'John Doe', avatar_url: 'avatar_url' });
      });

      it('should initialize the game board with the correct number of rows and columns', function() {
        const gameState = {
          ROWS: 3,
          COLS: 3,
          EMPTY: ''
        };
        const cellClickHandler = () => {};
    
        initBoard(gameState, cellClickHandler);
    
        expect(gameState.board.length).toBe(gameState.ROWS);
        expect(gameState.board[0].length).toBe(gameState.COLS);
      });



    it('should save the game state to the Supabase database', async function() {
        // Mock the necessary dependencies
        const supabase = {
          createClient: jasmine.createSpy().and.returnValue({
            from: jasmine.createSpy().and.returnValue({
              insert: jasmine.createSpy().and.returnValue({
                error: null
              })
            })
          })
        };
        const gameState = { /* mock game state */ };
  
        // Call the function
        await saveGame(gameState);
  
        // Check the expectations
        expect(supabase.createClient).toHaveBeenCalledWith("https://yvoqhrtykrustdzontoj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok");
        expect(supabase.createClient).toHaveBeenCalledTimes(1);
        expect(supabase.createClient().from).toHaveBeenCalledWith("game");
        expect(supabase.createClient().from).toHaveBeenCalledTimes(1);
        expect(supabase.createClient().from().insert).toHaveBeenCalledWith({
          email: "pepe",
          gameState: JSON.stringify(gameState)
        });
        expect(supabase.createClient().from().insert).toHaveBeenCalledTimes(1);
      });

      it('should load the game state from the database for the specified game ID and user ID', async function() {
        spyOn(localStorage, 'getItem').and.returnValue('test@example.com');
        spyOn(console, 'log');
        spyOn(console, 'error');
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
                return { data: { gameState: '{"score": 100}' } };
            }
        });
    
        await loadGame(1);
    
        expect(localStorage.getItem).toHaveBeenCalledWith('email');
        expect(supabase.createClient).toHaveBeenCalledWith('https://yvoqhrtykrustdzontoj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok');
        expect(console.log).toHaveBeenCalledWith('Partida cargada:', { score: 100 });
        expect(console.error).not.toHaveBeenCalled();
    });

    it('should remove classes and event listeners when called', function() {
        // Arrange
        const gameState = {
          ROWS: 6,
          COLS: 7,
          EMPTY: '',
          board: [],
          gameOver: true,
          turn: 'red',
          winner: 'red',
          toggleTurn: false,
          lastMoveR: 5,
          lastMoveC: 6,
          player1: document.querySelector('.player1'),
          player2: document.querySelector('.player2')
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

      it('should trigger move and switch turns when clicking on a valid column', function() {
        // Arrange
        const event = {
          target: document.createElement('td')
        };
        const gameState = {
          gameOver: false
        };
  
        spyOn(window, 'makeMove').and.returnValue(true);
        spyOn(window, 'checkWinner').and.returnValue(false);
        spyOn(window, 'nextTurn');
  
        // Act
        cellClicked(event, gameState);
  
        // Assert
        expect(makeMove).toHaveBeenCalledWith(jasmine.any(String), gameState);
        expect(checkWinner).toHaveBeenCalledWith(gameState);
        expect(nextTurn).toHaveBeenCalledWith(gameState);
      });

      it('should send POST request to Supabase API with correct URL and headers and receive valid response with token', async function() {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
          status: 200,
          headers: {
            get: function(header) {
              if (header === 'content-type') {
                return 'application/json';
              }
            }
          },
          json: function() {
            return Promise.resolve({ token: 'validToken' });
          }
        }));
  
        const email = 'test@example.com';
        const password = 'password';
        const result = await loginSupabase(email, password);
  
        expect(window.fetch).toHaveBeenCalledWith(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'post',
          headers: headers,
          body: JSON.stringify({ email, password })
        });
        expect(result).toEqual({ token: 'validToken' });
      });
})

