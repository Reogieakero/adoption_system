import pool from '../src/config/db';

async function checkPhotos() {
  const [rows] = await pool.query('SELECT id, name, photo_url FROM animals');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

checkPhotos().catch(e => { console.error(e); process.exit(1); });