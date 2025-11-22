// User routes
const express = require("express")
const bcrypt = require("bcrypt")
const pool = require("../db")
const { ensureAuthenticated } = require("../middleware/auth")

const router = express.Router()

// Get current user
router.get("/me", ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, address, is_admin, created_at 
       FROM users WHERE id = $1`,
      [req.session.userId],
    )

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
          createdAt: user.created_at,
        },
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ success: false, error: "Erro ao buscar usuário" })
  }
})

// Update user
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, address, currentPassword, newPassword } = req.body

    // Check if user can update (must be owner or admin)
    if (req.session.userId !== id && !req.session.isAdmin) {
      return res.status(403).json({ success: false, error: "Acesso negado" })
    }

    // Get current user data
    const currentUser = await pool.query("SELECT password_hash FROM users WHERE id = $1", [id])

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" })
    }

    let updateQuery = "UPDATE users SET name = $1, email = $2, phone = $3, address = $4"
    const values = [name, email, phone, address]

    // If changing password, verify current password and hash new one
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: "Senha atual é obrigatória para alterar senha",
        })
      }

      const isValid = await bcrypt.compare(currentPassword, currentUser.rows[0].password_hash)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Senha atual incorreta",
        })
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10)
      updateQuery += ", password_hash = $5 WHERE id = $6"
      values.push(newPasswordHash, id)
    } else {
      updateQuery += " WHERE id = $5"
      values.push(id)
    }

    updateQuery += " RETURNING id, name, email, phone, address, is_admin"

    const result = await pool.query(updateQuery, values)
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
    console.error("Update user error:", error)
    res.status(500).json({ success: false, error: "Erro ao atualizar usuário" })
  }
})

module.exports = router
