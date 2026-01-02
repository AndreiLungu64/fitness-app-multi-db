import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const fitnessPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.FITNESS_DB_NAME || 'fitness_app_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

fitnessPool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error acquiring client from PostgreSQL', err.stack);
  }
  if (!client) return;
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('❌ Error executing query on PostgreSQL', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database:', result.rows[0]);
  });
});

export const query = (text: string, params?: any[]) => fitnessPool.query(text, params);

export default fitnessPool;
