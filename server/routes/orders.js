// Order routes
const express = require("express")
const pool = require("../db")
const { ensureAuthenticated } = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/", ensureAuthenticated, async (req, res) => {
  const client = await pool.connect()

  try {
    const { items, total } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Carrinho vazio",
      })
    }

    await client.query("BEGIN")

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, whatsapp_sent)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [req.session.userId, total, false],
    )

    const orderId = orderResult.rows[0].id

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price],
      )
    }

    await client.query("COMMIT")

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: orderId,
          createdAt: orderResult.rows[0].created_at,
        },
      },
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Create order error:", error)
    res.status(500).json({ success: false, error: "Erro ao criar pedido" })
  } finally {
    client.release()
  }
})

// Get order by ID
router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params

    // Get order
    const orderResult = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id],
    )

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Pedido não encontrado" })
    }

    const order = orderResult.rows[0]

    // Check if user can access (must be owner or admin)
    if (order.user_id !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ success: false, error: "Acesso negado" })
    }

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id],
    )

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items: itemsResult.rows,
        },
      },
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ success: false, error: "Erro ao buscar pedido" })
  }
})

module.exports = router
