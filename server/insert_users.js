const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fs = require('fs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ahmed@6363',
  database: 'tekbrew',
};

// Read the JSON data from the file
const rawData = fs.readFileSync('users.json');
const users = JSON.parse(rawData);

// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Create the 'users' table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      passwordHash CHAR(60) NOT NULL
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      connection.end(); // Close the connection in case of an error
      return;
    }
    console.log('Table created or already exists');

    const saltRounds = 10; // Number of salt rounds for bcrypt

    // Function to insert users one by one
    const insertUser = (index) => {
      if (index >= users.length) {
        // All users inserted, close the connection
        connection.end();
        console.log('All users inserted, connection closed.');
        return;
      }

      const user = users[index];
      const { username, password } = user;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return;
        }

        const insertUserQuery = 'INSERT INTO users (username, passwordHash) VALUES (?, ?)';

        connection.query(insertUserQuery, [username, hash], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return;
          }
          console.log(`Inserted user: ${username} ${password}`);

          // Insert the next user
          insertUser(index + 1);
        });
      });
    };

    // Start inserting users
    insertUser(0);
  });
});
