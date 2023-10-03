const mysql = require('mysql');

// Create a MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'username', // add your username
  password: 'password', // add your password
  database: 'database', // add your database
};

const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Create the 'daily_individual_counts' table if it doesn't exist
  const createDailyIndividualCountsTable = `
  CREATE TABLE IF NOT EXISTS daily_individual_counts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  user_name VARCHAR(255),
  beverage ENUM('Tea', 'Coffee'),
  beverage_count INT DEFAULT 0,
  UNIQUE KEY unique_user_date (date, user_name, beverage)
)
`;


  // Create the 'beverage_counts' table if it doesn't exist
  const createBeverageCountsTable = `
    CREATE TABLE IF NOT EXISTS beverage_counts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE,
      tea_count INT DEFAULT 0,
      coffee_count INT DEFAULT 0,
      total_count INT DEFAULT 0
    )
  `;

  // Execute table creation queries sequentially
  connection.query(createDailyIndividualCountsTable, (err) => {
    if (err) {
      console.error('Error creating daily_individual_counts table:', err);
      connection.end(); // Close the connection in case of an error
      return;
    }
    console.log('daily_individual_counts table created or already exists');

    connection.query(createBeverageCountsTable, (err) => {
      if (err) {
        console.error('Error creating beverage_counts table:', err);
        connection.end(); // Close the connection in case of an error
        return;
      }
      console.log('beverage_counts table created or already exists');
      connection.end(); // Close the connection after creating tables
    });
  });
});
