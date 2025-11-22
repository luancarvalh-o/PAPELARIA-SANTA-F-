// Script to create admin user with hashed password
const bcrypt = require("bcrypt")
const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

async function seedAdmin() {
  try {
    const password = "Admin123!"
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO users (name, email, password_hash, phone, is_admin)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, is_admin;
    `

    const values = ["Administrador", "admin@papeleriasantafe.com", hashedPassword, "(31)3532-2210", true]

    const result = await pool.query(query, values)
    console.log("✅ Admin user created/updated successfully:")
    console.log(`   Email: ${result.rows[0].email}`)
    console.log(`   Password: Admin123!`)
    console.log(`   Is Admin: ${result.rows[0].is_admin}`)

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding admin:", error)
    process.exit(1)
  }
}

seedAdmin()
