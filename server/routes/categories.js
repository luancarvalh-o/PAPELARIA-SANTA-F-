// Category routes
const express = require("express")
const pool = require("../db")

const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name")
    res.json({ success: true, data: { categories: result.rows } })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ success: false, error: "Erro ao buscar categorias" })
  }
})

module.exports = router
