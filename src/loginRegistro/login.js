import { loginSupabase,createData,getData } from "./http.js";
//export { loginObject };
document.addEventListener('DOMContentLoaded', () => {

  // Agrega un evento al botón de inicio de sesión
  document.querySelector('#loginbutton').addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.querySelector('#loginemail').value;
        const password = document.querySelector('#loginpassword').value;

    // Llama a la función loginUser con el correo electrónico y la contraseña
        loginUser(email, password).then((status) => {
          // Redirige a la página newGame.html si el inicio de sesión es exitoso
          if (status.success) window.location.href = '../indexPerfil/newGame.html';
          else {
        // Muestra un mensaje de error en caso de inicio de sesión fallido
        document.querySelector('#userInfo').innerHTML = status.errorText;
        }
        });

      });
    
    
      // Función asincrónica para realizar el inicio de sesión
    async function loginUser(email, password) {
      const status = { success: false };
      try {
        // Obtiene la información de inicio de sesión desde Supabase
        const dataLogin = await loginSupabase(email, password);

      // Obtiene información adicional del perfil del usuario
        const tableInfo = await getData('profiles', dataLogin.access_token);
      // Convierte la información del perfil a un formato legible
        const jsonString = JSON.stringify(tableInfo, null, 2);
        const tableInfoArray = JSON.parse(jsonString);
      // Obtiene el ID único del usuario
        const uid = dataLogin.user.id;
      
        let trobat = false;
        console.log(tableInfoArray)
      // Itera sobre la información del perfil para verificar si el usuario ya existe
        for(const item of tableInfoArray){
          console.log(item+"---"+uid);
          console.log(item.id+"---"+uid);
          if(item.id == uid){
            console.log(item.id+"---"+uid)
            trobat=true;
            break;
          }
        }
      // Si el usuario es la primera vez que hace login, crea un nuevo perfil
        if (!trobat) {
          console.log("entra")
        const full_name = email.split('@')[0];
        const username = email;
        const website ="";
          await createData('profiles', dataLogin.access_token, {
            id: uid,
            username,
            full_name,
            website,
        });
        }

      // Almacena la información de inicio de sesión en el almacenamiento local
        localStorage.setItem('email', email);
        localStorage.setItem('access_token', dataLogin.access_token);
        localStorage.setItem('uid', dataLogin.user.id);
        localStorage.setItem('expirationDate', expirationDate(dataLogin.expires_in));
        status.success = true;
      } catch (err) {
        console.log(err);
        
        console.log(JSON.stringify(err, null, 2));
        
        status.errorText = err.error_description;

        status.success = false;

      }
      return status;
    }

  // Función para calcular la fecha de vencimiento
    function expirationDate(expires_in) {
      return Math.floor(Date.now() / 1000) + expires_in;
    }
    /*const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co/auth/v1/token?grant_type=password";

    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log(database);

    document.querySelector('#loginbutton').addEventListener('click', async (e) => {
        e.preventDefault();
        let loginObject = {
            email: document.querySelector('#loginemail').value,
            password: document.querySelector('#loginpassword').value
        };

        try {
            let response = await database.from("Register").select("*");
            console.log(response);

            if (response) {
                let data = response.data;
                console.log(data);

                const user = data.find(user => user.email === loginObject.email);
                console.log(user);

                if (user) {
                    if (user.password === loginObject.password) {
                        window.location.href = './newGame.html';
                    } else {
                        document.querySelector('#userInfo').innerHTML = "Contraseña incorrecta.";
                    }
                } else {
                    document.querySelector('#userInfo').innerHTML = "El correo no está registrado.";
                }

            }

            // access_token = response.access_token;
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            document.querySelector('#userInfo').innerHTML = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
        }
    });*/
})
