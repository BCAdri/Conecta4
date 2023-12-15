import { logoutSupabase } from "./http.js";
export { saveGame, loadGame, showSavedGames,gameState,deleteGame};

let gameState = {
  ROWS: 6,
  COLS: 7,
  EMPTY: 0,
  RED: 1,
  YELLOW: 2,
  COLOR_RED: '#ff4136',
  COLOR_YELLOW: '#ffdc00',
  player1: document.querySelector(".players .player1"),
  player2: document.querySelector(".players .player2"),
  board: [],
  turn: null,
  gameOver: false,
  winner: null,
  toggleTurn: true,
  lastMoveR: -1,
  lastMoveC: -1,
  loaded:false,
};

async function saveGame(gameState) {

    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co";
    const userId = localStorage.getItem('email');

    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const serializedGameState = JSON.stringify(gameState);
    
        try {
            let response = await database.from("game").insert({
                email: userId,
                gameState: serializedGameState,
            });
    
            if (response.error) {
                // Manejar errores de inserción
                alert("Error al guardar juego: " + response.error.message);
            } else {
                // Registro exitoso
                alert("Juego guardado exitosamente");
            }
    
            console.log(response);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
        
}

async function loadGame(id) {
    const userId = localStorage.getItem('email');

    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co";


    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await database
        .from("game")
        .select('gameState')
        .eq('email', userId)
        .eq('id', id)
        .single();


    if (data) {
        let loadedGameState = JSON.parse(data.gameState);
        gameState = loadedGameState;
        gameState.loaded = true;
        console.log(gameState);

        return { success: true, errorMessage: "Loading...", gameState: loadedGameState };

    }else {
      return { success: false, errorMessage: "Game not found in Supabase for ID: " + id };
    }
}

async function showSavedGames(pageNumber, pageSize) {
    const userId = localStorage.getItem('email');


    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co";

    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    try {
      const { data, error } = await database
        .from("game")
        .select('*')
        .eq('email', userId)
        .range(pageNumber * pageSize, (pageNumber + 1) * pageSize - 1);

      if (error) {
        return { success: false, errorMessage: `Error retrieving the list of saved games: ${error.message}` };

      }
  
      if (data.length === 0) {
        return { success: false, errorMessage: `No saved games found for this user.` };
      }
  
      const partidasDiv = document.createElement('div');
      data.forEach(game => {
        const partidaElement = document.createElement('p');
        partidaElement.textContent = `Game ID: ${game.id}, Creation Date: ${game.gameState} , Creation Date: ${game.email} , Creation Date: ${game.time}`;
        partidasDiv.appendChild(partidaElement);
      });
  
      return { success: true, partidasDiv };
    } catch (error) {
      return { success: false, errorMessage: `Error displaying saved games: ${error.message}` };
    }
  }
  
  document.querySelectorAll('#profile-off').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      logoutSupabase(localStorage.getItem('access_token')).then((lOData) => {
        console.log(lOData);
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('uid');

      setTimeout(() => {
        window.location.href = './index.html';
    }, 3000);
  });
});

async function deleteGame(id) {
  const userId = localStorage.getItem('email');

 
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
  const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co";

  const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
      const { data, error } = await database
          .from("game")
          .delete()
          .eq('email', userId)
          .eq('id', id);

          if (error) {
            throw new Error(`Error deleting the game: ${error.message}`);
        }

        if (data && data.length > 0) {
            console.log(`Game successfully deleted - ID: ${id}`);
            return { success: true, errorMessage: "Game successfully deleted." };
        } else {
            return { success: false, errorMessage: "No game found for ID: " + id };
        }
    } catch (error) {
        return { success: false, errorMessage: `Error deleting the game: ${error.message}` };
    }
}

