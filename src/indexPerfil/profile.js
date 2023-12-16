import { getProfile, updateProfile } from '../loginRegistro/http.js';

export { profileForm };

function profileForm() {
// Obtiene el objeto dataProfile del almacenamiento local y lo convierte en un objeto JavaScript
  let dataProfile = JSON.parse(localStorage.getItem('dataProfile'));
  // Crea un nuevo elemento div para el formulario de perfil y le asigna una clase
  const divLogin = document.createElement('div');
  divLogin.classList.add('formulari_centrat');
// Obtiene el perfil del usuario y actualiza la interfaz de usuario con la información
  getProfile().then((dataProfile) => {
    dataProfile = dataProfile[0];
    console.log(dataProfile);
  // Crea el formulario de perfil y lo inserta en el elemento divLogin
    divLogin.innerHTML = `<form action="action_page.php" id="formProfile" style="border: 1px solid #ccc">
    <div class="container">
      <h1>Profile</h1>
      
      <hr />

      <label for="email"><b>Email</b></label>
      <input
        id="signupemail"
        type="text"
        placeholder="Enter Email"
        name="email"
        required
        readonly
        value="${localStorage.getItem('email')}"
      />

      <label for="psw"><b>Password</b></label>
      <input
        type="password"
        id="signuppassword"
        placeholder="Enter Password"
        name="psw"
        required
      />

      <label for="psw-repeat"><b>Repeat Password</b></label>
      <input
        type="password"
        placeholder="Repeat Password"
        name="psw-repeat"
        required
      />
      <button type="button" class="signupbtn login" id="chgpass">Change Password</button>

      <label for="username"><b>Username</b></label>
      <input
        type="text"
        placeholder="user name"
        name="username"
        id = "username"
        value = "${dataProfile.username}"
      />

      <label for="fullname"><b>Full Name</b></label>
      <input
        type="text"
        placeholder="fullname"
        name="full_name"
        value = "${dataProfile.full_name}"
      />


      <label for="web"><b>Web Site</b></label>
      <input
        type="text"
        placeholder="web"
        name="website"
        value = "${dataProfile.website}"
      />
  <div>
      <img class="avatar_profile" style="max-width: 200px" id="avatar_prev" src="${dataProfile.avatar_blob ? dataProfile.avatar_blob : ''}"/>
</div>
      <label for="avatar"><b>Avatar</b></label>
      <input
        type="file"
        id="avatar"
        name="avatar"
      />
  




      <div class="clearfix">

        <button type="button" class="signupbtn login" id="update">Update Profile</button>
      </div>
    </div>
  </form>
  <button type="button" class="back" id="back">Back to the game</button>
  `;
  // Agrega un evento al botón de actualización del perfil
    divLogin.querySelector('#update').addEventListener('click', async () => {
          // Obtiene los datos del formulario
      const formData = new FormData(divLogin.querySelector('#formProfile'));
      const {
        username, full_name, website, avatar,
      } = Object.fromEntries(formData);
      console.log({
        username, full_name, website, avatar,
      });
    // Llama a la función para actualizar el perfil
      const dataUpdate = await updateProfile({
        username, full_name, website, avatar,
      });

    });
  // Agrega un evento al botón de regresar al juego
    divLogin.querySelector('#back').addEventListener('click', () => {
        window.location.href = '../gameFunctions/juego.html';
    });
  // Función para mostrar la vista previa del avatar al seleccionar un archivo
    function encodeImageFileAsURL(element) {
      const file = element.files[0];
      if (file) {
        
        divLogin.querySelector('#avatar_prev').src = URL.createObjectURL(file);
      }
    }
  // Agrega un evento al input de avatar para actualizar la vista previa
    divLogin.querySelector('#avatar').addEventListener('change', function () { encodeImageFileAsURL(this); });
  });
  
  return divLogin;
}
