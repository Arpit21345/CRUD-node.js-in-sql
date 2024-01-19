const mysql = require('mysql2/promise'); // Import promise-compatible version

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'students',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

(async () => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(userSchema);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
})();

module.exports = pool;
