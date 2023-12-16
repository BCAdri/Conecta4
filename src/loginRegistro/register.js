import { signUpSupabase } from "./http.js";
document.addEventListener('DOMContentLoaded', () => {

    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL =  "https://yvoqhrtykrustdzontoj.supabase.co/auth/v1/signup";
    
    
    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log(database);

document.querySelector('#signupbtn').addEventListener('click',async (e)=>{
    event.preventDefault();
    const email = document.querySelector('#signupemail').value;
    const password = document.querySelector('#signuppassword').value;
    const reppassword = document.querySelector('#confirmpassword').value;

    // 1. Comprueba si el usuario ha completado todos los campos del formulario.

    if(password != reppassword){
        document.querySelector('#userInfo').innerHTML = "Passwords do not match.";
        return;
    }
    // 2. Registra al usuario en la base de datos.
    const dataLogin = await registerUser(email, password);

    // 3. Comprueba si la registración fue exitosa y muestra un mensaje apropiado.
    if(dataLogin.success){
        document.querySelector('#userInfo').innerHTML = `Registration completed successfully.`;

        setTimeout(() => {
            window.location.href = "./login.html";
        }, 5000);        

        }else{
        document.querySelector('#userInfo').innerHTML = `Email already exists or Passwords must be at least 6 characters.`;
    }

});

async function registerUser(email, password) {
    const status = { success: false };

    try {
        const dataRegister = await signUpSupabase(email, password);
        console.log("Contenido de dataRegister:", JSON.stringify(dataRegister, null, 2));
       status.success = true;

    } catch (err) {

      status.success = false;
      status.errorText = err.error_description;
    }
    return status;
  }
  
});

 /*const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL =  "https://yvoqhrtykrustdzontoj.supabase.co/auth/v1/signup";
    
    
    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log(database);

document.querySelector('#signupbtn').addEventListener('click',async (e)=>{
    e.preventDefault();

    let signUpObject = {
        email:  document.querySelector('#signupemail').value,
        password:  document.querySelector('#signuppassword').value,
        confirmPassword: document.querySelector('#confirmpassword').value

    };
    
    if (signUpObject.password !== signUpObject.confirmPassword) {
        document.querySelector('#userInfo').innerHTML = "Las contraseñas no coinciden.";
        return;
    }

    /*let response = await database.from("Users").select("*");
    let data = response.data;
    const user = data.find(user => user.email === signUpObject.email);

    if (user) {
        document.querySelector('#userInfo').innerHTML = "Este correo electrónico ya está registrado. Por favor, elige otro.";
        return;
    }

    try {
    
        let response = await supabase.auth.signUp({
            email: 'pp',
            password: 'pp'
          })
          
        if (response.error) {
            // Manejar errores de inserción
            alert("Error al registrar: " + response.error.message);
        } else {
            // Registro exitoso
            alert("Registrado exitosamente");
            window.location.href = './login.html';
        }

        console.log(response);
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
    */