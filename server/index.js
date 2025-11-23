// Main server file for Papeleria Santa Fé
const express = require("express")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const helmet = require("helmet")
const cors = require("cors")
const path = require("path")
const pool = require("./db")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const categoryRoutes = require("./routes/categories")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")

const app = express()
const PORT = process.env.PORT || 3000

// Trust proxy for Railway deployment
app.set("trust proxy", 1)

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline scripts for simplicity
  }),
)

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Garantir UTF-8 nas respostas JSON
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});


// Session configuration
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "papeleria-santafe-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
)

// Serve static files
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" })
})

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"))
})

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    error: err.message || "Erro interno do servidor",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
})
