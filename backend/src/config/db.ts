import mysql from 'mysql2/promise';
import { env } from './env';

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log('MySQL connected successfully');
    conn.release();
  })
  .catch((err: Error) => {
    console.error('MySQL connection failed:', err.message);
  });

export default pool;
