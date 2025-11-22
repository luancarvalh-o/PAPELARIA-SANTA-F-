// Authentication routes
const express = require("express")
const bcrypt = require("bcrypt")
const pool = require("../db")

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Nome, email e senha são obrigatórios",
      })
    }

    // Check if user exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Email já cadastrado",
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, address) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, address, is_admin, created_at`,
      [name, email, passwordHash, phone, address],
    )

    const user = result.rows[0]

    // Create session
    req.session.userId = user.id
    req.session.isAdmin = user.is_admin

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.is_admin,
        },
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ success: false, error: "Erro ao registrar usuário" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios",
      })
    }

    // Find user
    const result = await pool.query(
      "SELECT id, name, email, password_hash, phone, address, is_admin FROM users WHERE email = $1",
      [email],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha inválidos",
      })
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha inválidos",
      })
    }

    // Create session
    req.session.userId = user.id
    req.session.isAdmin = user.is_admin

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.is_admin,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, error: "Erro ao fazer login" })
  }
})

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Erro ao fazer logout" })
    }
    res.json({ success: true, message: "Logout realizado com sucesso" })
  })
})

// Check auth status
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, error: "Não autenticado" })
    }

    const result = await pool.query("SELECT id, name, email, phone, address, is_admin FROM users WHERE id = $1", [
      req.session.userId,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" })
    }

    const user = result.rows[0]

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.is_admin,
        },
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    res.status(500).json({ success: false, error: "Erro ao verificar autenticação" })
  }
})

module.exports = router
