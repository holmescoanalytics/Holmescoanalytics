// login.js
const SB_URL = 'https://zpseipfypcxktbbrbkiq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwc2VpcGZ5cGN4a3RiYnJia2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDk4MzIsImV4cCI6MjA5NjUyNTgzMn0.RDrY9_gnSqsZgnaWx0FF6gHHNG8ry--ETmAmCHAN024';

const sbClient = supabase.createClient(SB_URL, SB_KEY);

async function login() {
  await sbClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

async function logout() {
  await sbClient.auth.signOut();
  location.reload();
}

async function checkUser() {
  const { data: { user } } = await sbClient.auth.getUser();
  const container = document.getElementById('auth-container');
  
  if (container) {
    if (user) {
      container.innerHTML = `
        <div class="user-info">
          <img src="${user.user_metadata?.avatar_url || ''}" class="user-avatar">
          <span>${user.email}</span>
          <button onclick="logout()" class="logout-btn">Salir</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="login()" class="login-btn">
          <span>🇸🇻</span> Iniciar sesión con Google
        </button>
      `;
    }
  }
}

checkUser();
