// login.js - SIN la palabra "supabase"
const PROYECTO_URL = 'https://zpseipfypcxktbbrbkiq.supabase.co';
const PROYECTO_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwc2VpcGZ5cGN4a3RiYnJia2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDk4MzIsImV4cCI6MjA5NjUyNTgzMn0.RDrY9_gnSqsZgnaWx0FF6gHHNG8ry--ETmAmCHAN024';

const cliente = supabase.createClient(PROYECTO_URL, PROYECTO_KEY);

async function login() {
  await cliente.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

async function logout() {
  await cliente.auth.signOut();
  location.reload();
}

async function verificar() {
  const { data: { user } } = await cliente.auth.getUser();
  const contenedor = document.getElementById('auth-container');
  
  if (contenedor) {
    if (user) {
      contenedor.innerHTML = `
        <div class="user-info">
          <img src="${user.user_metadata?.avatar_url || ''}" class="user-avatar">
          <span>${user.email}</span>
          <button onclick="logout()" class="logout-btn">Salir</button>
        </div>
      `;
    } else {
      contenedor.innerHTML = `
        <button onclick="login()" class="login-btn">
          <span>🇸🇻</span> Iniciar sesión con Google
        </button>
      `;
    }
  }
}

verificar();
