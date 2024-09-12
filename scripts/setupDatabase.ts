import pool from '../app/utils/database';

async function setupDatabase() {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS impersonated_person_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        quote TEXT,
        personality_traits TEXT[],
        vector VECTOR(768)
      )
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
}

setupDatabase().finally(() => pool.end());