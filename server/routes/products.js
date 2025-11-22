// Product routes
const express = require("express")
const multer = require("multer")
const path = require("path")
const pool = require("../db")
const { ensureAdmin } = require("../middleware/auth")

const router = express.Router()

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Apenas imagens são permitidas"))
    }
  },
})

// Get all products with optional filters
router.get("/", async (req, res) => {
  try {
    const { q, category, limit = 100, offset = 0 } = req.query

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const values = []
    let paramCount = 0

    // Search by name or description
    if (q) {
      paramCount++
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      values.push(`%${q}%`)
    }

    // Filter by category
    if (category && category !== "Todos") {
      paramCount++
      query += ` AND c.name = $${paramCount}`
      values.push(category)
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    values.push(limit, offset)

    const result = await pool.query(query, values)
    res.json({ success: true, data: { products: result.rows } })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ success: false, error: "Erro ao buscar produtos" })
  }
})

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produto não encontrado" })
    }

    res.json({ success: true, data: { product: result.rows[0] } })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ success: false, error: "Erro ao buscar produto" })
  }
})

// Create product (admin only)
router.post("/", ensureAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category_id, description, price, stock } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: "Nome e preço são obrigatórios",
      })
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

    const result = await pool.query(
      `INSERT INTO products (name, category_id, description, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, category_id || null, description, price, stock || 0, imageUrl],
    )

    res.status(201).json({ success: true, data: { product: result.rows[0] } })
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ success: false, error: "Erro ao criar produto" })
  }
})

// Update product (admin only)
router.put("/:id", ensureAdmin, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params
    const { name, category_id, description, price, stock } = req.body

    let query = `
      UPDATE products 
      SET name = $1, category_id = $2, description = $3, price = $4, stock = $5
    `
    const values = [name, category_id || null, description, price, stock || 0]

    if (req.file) {
      query += `, image_url = $6 WHERE id = $7`
      values.push(`/uploads/${req.file.filename}`, id)
    } else {
      query += ` WHERE id = $6`
      values.push(id)
    }

    query += " RETURNING *"

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produto não encontrado" })
    }

    res.json({ success: true, data: { product: result.rows[0] } })
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ success: false, error: "Erro ao atualizar produto" })
  }
})

// Delete product (admin only)
router.delete("/:id", ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produto não encontrado" })
    }

    res.json({ success: true, message: "Produto deletado com sucesso" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ success: false, error: "Erro ao deletar produto" })
  }
})

module.exports = router
