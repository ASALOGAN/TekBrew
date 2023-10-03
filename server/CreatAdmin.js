const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Create a MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ahmed@6363',
  database: 'tekbrew',
};

// Read the JSON file
const adminData = JSON.parse(fs.readFileSync('admin.json'));

// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Create the admins table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      passwordHash VARCHAR(255) NOT NULL
    )`;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating admins table:', err);
      connection.end();
      return;
    }
    console.log('Admins table created or already exists.');
    
    // Hash passwords and insert admin data
    const insertQuery = 'INSERT INTO admins (username, passwordHash) VALUES ?';
    const hashedAdminData = adminData.map((admin) => [
      admin.username,
      bcrypt.hashSync(admin.password, 10), // Hash the password using bcrypt
    ]);
    
    connection.query(insertQuery, [hashedAdminData], (err) => {
      if (err) {
        console.error('Error inserting admin data:', err);
      } else {
        console.log('Admin data inserted successfully.');
      }
      
      // Close the MySQL connection
      connection.end();
    });
  });
});
