import { createPool } from "@vercel/postgres"

// Initialize PostgreSQL client
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
})

export async function setupDatabase() {
  const client = await pool.connect()

  try {
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
    throw error
  } finally {
    client.release()
  }
}
