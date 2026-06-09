// login.js
const SUPABASE_URL = 'https://zpseipfypcxktbbrbkiq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwc2VpcGZ5cGN4a3RiYnJia2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDk4MzIsImV4cCI6MjA5NjUyNTgzMn0.RDrY9_gnSqsZgnaWx0FF6gHHNG8ry--ETmAmCHAN024';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  const container = document.getElementById('auth-container');
  
  if (user) {
    container.innerHTML = `
      <div class="user-info">
        <img src="${user.user_metadata.avatar_url || ''}" class="user-avatar">
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

checkUser();
