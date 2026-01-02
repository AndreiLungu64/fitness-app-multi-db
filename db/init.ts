import fs from 'fs';
import path from 'path';
import pool from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializePostgreSQL() {
  try {
    const schemaFilePath = path.join(__dirname, '/queries/schema_fitness_app.sql');
    const schema = fs.readFileSync(schemaFilePath, 'utf8');

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(schema);
      await client.query('COMMIT');
      console.log('✅ PostgreSQL database initialized successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL database:', error);
    throw error;
  }
}

if (import.meta.url === new URL(import.meta.url, import.meta.url).href) {
  initializePostgreSQL()
    .then(() => {
      console.log('✅ Database setup completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

export default initializePostgreSQL;
