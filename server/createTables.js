const mysql = require('mysql');

// Create a MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ahmed@6363',
  database: 'tekbrew',
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
      UNIQUE KEY (date, user_name)
    )
  `;

  connection.query(createDailyIndividualCountsTable, (err) => {
    if (err) {
      console.error('Error creating daily_individual_counts table:', err);
      connection.end(); // Close the connection in case of an error
      return;
    }
    console.log('daily_individual_counts table created or already exists');

    // Create the 'beverage_counts' table if it doesn't exist
    const createBeverageCountsTable = `
      CREATE TABLE IF NOT EXISTS beverage_counts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE,
        tea_count INT DEFAULT 0,
        coffee_count INT DEFAULT 0,
        total_count INT DEFAULT 0,
        UNIQUE KEY (date)
      )
    `;

    connection.query(createBeverageCountsTable, (err) => {
      if (err) {
        console.error('Error creating beverage_counts table:', err);
        connection.end(); // Close the connection in case of an error
        return;
      }
      console.log('beverage_counts table created or already exists');

      // Create the 'login_sessions' table if it doesn't exist
      const createLoginSessionsTable = `
        CREATE TABLE IF NOT EXISTS login_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255),
          login_date DATE,
          login_time TIME,
          UNIQUE KEY (username, login_date)
        )
      `;

      connection.query(createLoginSessionsTable, (err) => {
        if (err) {
          console.error('Error creating login_sessions table:', err);
          connection.end(); // Close the connection in case of an error
          return;
        }
        console.log('login_sessions table created or already exists');
        connection.end(); // Close the connection after creating tables
      });
    });
  });
});
