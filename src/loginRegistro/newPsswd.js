import { recoverPasswordSupabase } from "./http.js";
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#resetbtn').addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        try {
            await forgotPassword(email);
            document.querySelector('#userInfo').innerHTML = 'An email has been sent with instructions to reset your password.';
            
            setTimeout(() => {
                window.location.href = "./login.html";
            }, 5000);        
        
        } catch (error) {
            console.error('Error:', error);
            document.querySelector('#userInfo').innerHTML = 'There was a problem trying to reset the password. Try again later.';
        }
    });

    async function forgotPassword(email) {
        const responseForgot = await recoverPasswordSupabase(email);
        console.log(responseForgot);
    }

});

/*
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
    const SUPABASE_URL =  "https://yvoqhrtykrustdzontoj.supabase.co";
    
    const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log(database);

    document.querySelector('#resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        let resetObject = {
            email: document.querySelector('#email').value,
            newPassword: document.querySelector('#newPassword').value,
            confirmPassword: document.querySelector('#confirmPassword').value
        };

        // Verificar si las contraseñas coinciden
        if (resetObject.newPassword !== resetObject.confirmPassword) {
            document.querySelector('#userInfo').innerHTML = "Las contraseñas no coinciden.";
            return;
        }

        let response = await database.from("Register").select("*");
        let data = response.data;
        const user = data.find(user => user.email === resetObject.email);

        if (!user) {
            document.querySelector('#userInfo').innerHTML = "Este correo electrónico no está registrado..";
            return;
        }

        try {
            
            // Realizar la consulta de actualización
            let response = await database.from("Register")
                .update({
                    password: resetObject.newPassword,
                })
                .eq('email', resetObject.email);

            if (response.error) {
                alert("Error al restablecer la contraseña: " + response.error.message);
            } else {
                alert("Contraseña restablecida exitosamente");
                window.location.href = './login.html';
            }

            console.log(response);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario.
            alert("Error al restablecer la contraseña. Por favor, inténtalo de nuevo.");
        }
    });*/