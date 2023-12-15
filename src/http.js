export { supaRequest, loginSupabase, recoverPasswordSupabase, signUpSupabase, getProfile, updateProfile, createData, updateData, getData,logoutSupabase};

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3FocnR5a3J1c3Rkem9udG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNjY0MDAsImV4cCI6MjAxNDg0MjQwMH0.pYwz_1SH5hXjwJpDyDcGFNrf1_3dXVujldATw6toVok"
const SUPABASE_URL = "https://yvoqhrtykrustdzontoj.supabase.co";

const headers = {
  apiKey: SUPABASE_KEY,
  'Content-Type': 'application/json',
};

async function supaRequest(url, method, headers, body) {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body), 
    });
    if (response.status >= 200 && response.status <= 300) { 
      if (response.headers.get('content-type')) { 
        return await response.json();
      }
      return {};
    }
  
    return Promise.reject(await response.json()); 
  }

  async function loginSupabase(email, password) {
    const url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;

    try {
        const data = await supaRequest(url, 'post', headers, { email, password });
        return data;
    } catch (error) {
        console.error('Error in loginSupabase:', error);
        throw error; 
    }
}

  async function recoverPasswordSupabase(email) {
    const url = `${SUPABASE_URL}/auth/v1/recover`;
    const headersAux = { ...headers };
    const data = await supaRequest(url, 'post', headersAux, { email });
    return data;
  }


  async function signUpSupabase(email, password) {
    const url = `${SUPABASE_URL}/auth/v1/signup`;
    const maxRetries = 3;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const data = await supaRequest(url, 'post', headers, { email, password });
            return data;
        } catch (error) {
            if (error.code === 429) {
                const delay = Math.pow(2, currentRetry) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                currentRetry++;
            } else {
                throw error;
            }
        }
    }

    throw new Error('Max retries exceeded');
}

async function updateProfile(profile) {
  const access_token = localStorage.getItem('access_token');
  const uid = localStorage.getItem('uid');

  const formImg = new FormData();
  formImg.append('avatar', profile.avatar, 'avatarProfile.png');


  const avatarResponse = await fileRequest(`/storage/v1/object/avatars/avatar${uid}.png`, formImg, access_token);

  profile.avatar_url = avatarResponse.urlAvatar;
  delete profile.avatar;

  const responseUpdate = await updateData(`profiles?id=eq.${uid}&select=*`, access_token, profile);
  alert("Perfil actualizado exitosamente");
}

async function getProfile() {
  const access_token = localStorage.getItem('access_token');
  const uid = localStorage.getItem('uid');
  const responseGet = await getData(`profiles?id=eq.${uid}&select=*`, access_token);
  console.log(responseGet);
  const { avatar_url } = responseGet[0];
  responseGet[0].avatar_blob = false;
  if (avatar_url) {
    const imageBlob = await getFileRequest(avatar_url, access_token);
    console.log(imageBlob);
    if (imageBlob instanceof Blob) {
      responseGet[0].avatar_blob = URL.createObjectURL(imageBlob);
    }
  }
  return responseGet;
}


async function getData(URI, token) {
  const url = `${SUPABASE_URL}/rest/v1/${URI}`;
  const headersAux = { ...headers, Authorization: `Bearer ${token}` };
  const data = await supaRequest(url, 'get', headersAux);
  return data;
}

async function updateData(URI, token, data) {
  const url = `${SUPABASE_URL}/rest/v1/${URI}`;
  const headersAux = {
    ...headers,
    Authorization: `Bearer ${token}`,
    Prefer: 'return=representation',
  };
  const response = await supaRequest(url, 'PATCH', headersAux, data);
  return response;
}

async function createData(URI, token, data) {

  const url = `${SUPABASE_URL}/rest/v1/${URI}`;
  const headersAux = {
    ...headers,
    Authorization: `Bearer ${token}`,
    Prefer: 'return=representation',
  };
  const response = await supaRequest(url, 'post', headersAux, data);
  return response;
}

async function logoutSupabase(token) {
  const url = `${SUPABASE_URL}/auth/v1/logout`;
  const headersAux = { ...headers, Authorization: `Bearer ${token}` };
  const data = await supaRequest(url, 'post', headersAux, {});
  return data;
}

async function fileRequest(url, body, token) {
  const headersFile = {
    apiKey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
    'x-upsert': true, 
  };
  const response = await fetch(`${SUPABASE_URL}${url}`, {
    method: 'POST',
    headers: headersFile,
    body,
  });
  if (response.status >= 200 && response.status <= 300) {
    if (response.headers.get('content-type')) {
      const datos = await response.json(); 
      datos.urlAvatar = `${SUPABASE_URL}${url}`; 
      return datos;
    }
    return {};
  }

  return Promise.reject(await response.json());
}

async function getFileRequest(url, token) {
  const headersFile = {
    apiKey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(`${url}`, {
    method: 'GET',
    headers: headersFile,

  });
  if (response.status >= 200 && response.status <= 300) {
    if (response.headers.get('content-type')) {
      const datos = await response.blob();
      return datos;
    }
    return {};
  }

  return Promise.reject(await response.json());
}