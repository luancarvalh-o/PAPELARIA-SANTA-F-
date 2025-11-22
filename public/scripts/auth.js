// Authentication helper functions

async function checkAuth() {
  try {
    const response = await fetch("/api/auth/me")
    const data = await response.json()

    if (data.success) {
      return data.data.user
    }
    return null
  } catch (error) {
    return null
  }
}

async function updateAuthUI() {
  const authLink = document.getElementById("authLink")
  const user = await checkAuth()

  if (user) {
    authLink.textContent = user.name
    authLink.href = "/profile.html"
  } else {
    authLink.textContent = "Entrar"
    authLink.href = "/login.html"
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  } catch (error) {
    console.error("Logout error:", error)
  }
}
