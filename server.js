const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const app = express();
const port = 80; // Port 80 for hosting the web page

// Serve static files (HTML, CSS, JavaScript) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to serve index.html as the default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Define a route to serve admin.html when accessing /admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Middleware to parse JSON data from the request body
app.use(express.json());

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
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Function to check and insert today's date in beverage_counts if it doesn't exist
const initializeBeverageCounts = () => {
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  // Get today's date in 'YYYY-MM-DD' format
  const checkQuery = "SELECT * FROM beverage_counts WHERE date = ?";
  console.log(`Today: ${today}`);

  connection.query(checkQuery, [today], (err, results) => {
    if (err) {
      console.error("Error checking today's date in beverage_counts:", err);
    } else if (results.length === 0) {
      // Today's date doesn't exist, insert a new row
      const insertQuery =
        "INSERT INTO beverage_counts (date, tea_count, coffee_count, total_count) VALUES (?, 0, 0, 0)";
      connection.query(insertQuery, [today], (insertErr) => {
        if (insertErr) {
          console.error(
            "Error inserting today's date in beverage_counts:",
            insertErr
          );
        } else {
          console.log("Today's date inserted into beverage_counts.");
        }
      });
    }
  });
};

// Initialize beverage_counts table when the server starts
initializeBeverageCounts();

// Define a route for handling suggestions
app.get("/suggest", (req, res) => {
  const userInput = req.query.input; // Get the user's input from the query parameter

  // Implement logic to fetch suggestions based on userInput from the MySQL database
  const suggestQuery =
    "SELECT username FROM users WHERE username LIKE ? LIMIT 5";

  connection.query(suggestQuery, [`%${userInput}%`], (err, results) => {
    if (err) {
      console.error("Error fetching suggestions:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const suggestions = results.map((row) => row.username);
    res.json(suggestions);
  });
});

// Define a route for user authentication
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Query the database to retrieve the user's hashed password
  const getUserQuery =
    "SELECT username, passwordHash FROM users WHERE username = ?";
  connection.query(getUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length === 0) {
      // User not found
      res.status(401).json({ error: "Authentication failed" });
      return;
    }

    const storedHash = results[0].passwordHash;

    // Compare the provided password with the stored hash
    bcrypt.compare(password, storedHash, (err, passwordMatch) => {
      if (err || !passwordMatch) {
        // Authentication failed
        res.status(401).json({ error: "Authentication failed" });
      } else {
        // Authentication successful
        res.status(200).json({ message: "Authentication successful" });
      }
    });
  });
});

// Define a route to insert user's beverage choice into daily_individual_counts
app.post("/insertUserBeverageChoice", (req, res) => {
  const { username, beverage } = req.body;
  //const date = new Date().toISOString().slice(0, 10); // Get the current date

  const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  console.log(date);

  // Check if there is an existing record for the user's choice on the current date
  const checkQuery =
    "SELECT beverage_count FROM daily_individual_counts WHERE date = ? AND user_name = ? AND beverage = ?";

  connection.query(checkQuery, [date, username, beverage], (err, results) => {
    if (err) {
      console.error("Error checking existing record:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length === 0) {
      // No existing record, insert a new one with a count of 1
      const insertQuery =
        "INSERT INTO daily_individual_counts (date, user_name, beverage, beverage_count) VALUES (?, ?, ?, 1)";
      connection.query(insertQuery, [date, username, beverage], (insertErr) => {
        if (insertErr) {
          console.error("Error inserting new record:", insertErr);
          res.status(500).json({ error: "Internal server error" });
        } else {
          console.log("New record inserted successfully.");
          // Fetch the current counts from beverage_counts table
          const fetchCountsQuery =
            "SELECT tea_count, coffee_count, total_count FROM beverage_counts WHERE date = ?";
          connection.query(fetchCountsQuery, [date], (err, countsResult) => {
            if (err) {
              console.error("Error fetching current counts:", err);
            } else {
              const currentTeaCount = countsResult[0].tea_count;
              const currentCoffeeCount = countsResult[0].coffee_count;
              const currentTotalCount = countsResult[0].total_count;

              // Update the beverage_counts table with new counts
              const updateCountsQuery = `
                UPDATE beverage_counts
                SET tea_count = ? + CASE WHEN ? = 'Tea' THEN 1 ELSE 0 END,
                    coffee_count = ? + CASE WHEN ? = 'Coffee' THEN 1 ELSE 0 END,
                    total_count = ? + 1
                WHERE date = ?`;

              connection.query(
                updateCountsQuery,
                [
                  currentTeaCount,
                  beverage,
                  currentCoffeeCount,
                  beverage,
                  currentTotalCount,
                  date,
                ],
                (err, updateResult) => {
                  if (err) {
                    console.error("Error updating beverage counts:", err);
                  } else {
                    console.log("Beverage counts updated successfully.");
                  }
                }
              );
            }
          });
          res.status(200).send("User beverage choice inserted successfully.");
        }
      });
    } else {
      // Existing record found, increment the beverage_count by 1
      const currentCount = results[0].beverage_count;
      const updateQuery =
        "UPDATE daily_individual_counts SET beverage_count = ? WHERE date = ? AND user_name = ? AND beverage = ?";

      connection.query(
        updateQuery,
        [currentCount + 1, date, username, beverage],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating existing record:", updateErr);
            res.status(500).json({ error: "Internal server error" });
          } else {
            console.log("Record updated successfully.");
            // Fetch the current counts from beverage_counts table
            const fetchCountsQuery =
              "SELECT tea_count, coffee_count, total_count FROM beverage_counts WHERE date = ?";
            connection.query(fetchCountsQuery, [date], (err, countsResult) => {
              if (err) {
                console.error("Error fetching current counts:", err);
              } else {
                const currentTeaCount = countsResult[0].tea_count;
                const currentCoffeeCount = countsResult[0].coffee_count;
                const currentTotalCount = countsResult[0].total_count;

                // Update the beverage_counts table with new counts
                const updateCountsQuery = `
                UPDATE beverage_counts
                SET tea_count = ? + CASE WHEN ? = 'Tea' THEN 1 ELSE 0 END,
                    coffee_count = ? + CASE WHEN ? = 'Coffee' THEN 1 ELSE 0 END,
                    total_count = ? + 1
                WHERE date = ?`;

                connection.query(
                  updateCountsQuery,
                  [
                    currentTeaCount,
                    beverage,
                    currentCoffeeCount,
                    beverage,
                    currentTotalCount,
                    date,
                  ],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating beverage counts:", err);
                    } else {
                      console.log("Beverage counts updated successfully.");
                    }
                  }
                );
              }
            });
            res.status(200).send("User beverage choice inserted successfully.");
          }
        }
      );
    }
  });
});

// Define a route for handling admin username suggestions
app.get("/admin/suggest", (req, res) => {
  const userInput = req.query.input; // Get the user's input from the query parameter

  // Implement logic to fetch admin username suggestions based on userInput from the MySQL database
  const suggestQuery =
    "SELECT username FROM admins WHERE username LIKE ? LIMIT 5";

  connection.query(suggestQuery, [`%${userInput}%`], (err, results) => {
    if (err) {
      console.error("Error fetching admin username suggestions:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const suggestions = results.map((row) => row.username);
    res.json(suggestions);
  });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Query the database to retrieve the admin's hashed password
  const getAdminQuery =
    "SELECT username, passwordHash FROM admins WHERE username = ?";
  connection.query(getAdminQuery, [username], (err, results) => {
    if (err) {
      console.error("Error fetching admin:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length === 0) {
      // Admin not found
      res.status(401).json({ error: "Admin authentication failed" });
      return;
    }

    const storedHash = results[0].passwordHash;

    // Compare the provided password with the stored hash
    bcrypt.compare(password, storedHash, (err, passwordMatch) => {
      if (err || !passwordMatch) {
        // Authentication failed
        res.status(401).json({ error: "Admin authentication failed" });
      } else {
        // Authentication successful
        res.status(200).json({ message: "Admin authentication successful" });
      }
    });
  });
});

// Define an API endpoint to fetch data based on the selected month
app.get("/api/data", (req, res) => {
  const selectedMonth = req.query.month; // Get the selected month from the query parameter
  //console.log('Selected Month:', selectedMonth); // Add this line for debugging

  // Modify your SQL query to filter data by the selected month
  const query = `
        SELECT
    dic.date,
    COUNT(DISTINCT dic.user_name) AS user_count,
    SUM(CASE WHEN dic.beverage = 'Tea' THEN dic.beverage_count ELSE 0 END) AS tea,
    SUM(CASE WHEN dic.beverage = 'Coffee' THEN dic.beverage_count ELSE 0 END) AS coffee,
    SUM(dic.beverage_count) AS total
FROM daily_individual_counts AS dic
WHERE DATE_FORMAT(dic.date, '%Y-%m-%d') LIKE ?
GROUP BY dic.date
ORDER BY dic.date ASC;
    `;

  // Log the SQL query for debugging
  //console.log('SQL Query:', query);

  // Execute the query with the selected month as a parameter
  connection.query(query, [`%-${selectedMonth}-%`], (err, results) => {
    if (err) {
      console.error("Error fetching data from MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Prepare and send data as JSON response
    const data = results.map((result) => ({
      date: result.date,
      user_count: result.user_count,
      tea: result.tea,
      coffee: result.coffee,
      total: result.total,
    }));

    res.json(data);
  });
});

// Define a route to fetch and display the counts
app.get("/api/Dailycounts", (req, res) => {
  // Retrieve the selected date from the query parameter
  const selectedDate = req.query.date;

  // Query to fetch tea, coffee, and total counts from the beverage_counts table
  const countsQuery =
    "SELECT tea_count, coffee_count, total_count FROM beverage_counts WHERE date = ?";

  connection.query(countsQuery, [selectedDate], (err, results) => {
    if (err) {
      console.error("Error fetching counts from the database:", err);
      res.status(500).json({ error: "An error occurred while fetching data" });
    } else {
      if (results.length === 0) {
        // Handle case where no data is found for the selected date
        res.status(404).json({ error: "No data found for the selected date" });
      } else {
        // Send the retrieved counts as JSON response
        res.json(results[0]);
      }
    }
  });
});

// Set up the Express.js route to handle /api/IndividualCount
app.get("/api/IndividualCount", (req, res) => {
  const selectedDate = req.query.date; // Get the selected date from the query string

  // Fetch data from the database for the selected date
  const query = `
    SELECT user_name, SUM(CASE WHEN beverage = 'Tea' THEN beverage_count ELSE 0 END) AS tea_count,
    SUM(CASE WHEN beverage = 'Coffee' THEN beverage_count ELSE 0 END) AS coffee_count
    FROM daily_individual_counts
    WHERE date = ? 
    GROUP BY user_name
  `;

  connection.query(query, [selectedDate], (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Error fetching data from the database" });
      return;
    }

    // Calculate the total count and add a description
    const data = results.map((row) => {
      const user_name = row.user_name;
      const tea_count = row.tea_count;
      const coffee_count = row.coffee_count;
      const total = tea_count + coffee_count;

      // Generate the description
      let description = `${user_name} consumed `;
      if (tea_count > 0 && coffee_count > 0) {
        description += `${tea_count} cups of Tea and ${coffee_count} cups of Coffee`;
      } else if (tea_count > 0) {
        description += `${tea_count} cups of Tea`;
      } else if (coffee_count > 0) {
        description += `${coffee_count} cups of Coffee`;
      } else {
        description += "no beverages";
      }

      return {
        user_name: user_name,
        tea_count: tea_count,
        coffee_count: coffee_count,
        total_count: total,
        description: description,
      };
    });

    // Send the data as JSON response
    res.json(data);
  });
});

// Define a route to fetch users from the database
app.get("/api/getUsers", (req, res) => {
  // Query to select all users from the 'users' table
  const selectUsersQuery = "SELECT id, username FROM users";

  // Use the connection to execute the query
  connection.query(selectUsersQuery, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Send the user data as JSON response
    res.json(results);
  });
});

// Define a route to add a new user to the database
app.post("/api/addUser", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Username and password are required." });
  }

  const saltRounds = 10; // Number of salt rounds for bcrypt

  // Hash the password with bcrypt
  bcrypt.hash(password, saltRounds, (hashErr, hash) => {
    if (hashErr) {
      console.error("Error hashing password:", hashErr);
      res.status(500).json({ success: false, error: "Internal server error" });
      return;
    }

    // Insert the new user into the 'users' table
    const insertUserQuery =
      "INSERT INTO users (username, passwordHash) VALUES (?, ?)";
    connection.query(
      insertUserQuery,
      [username, hash],
      (insertErr, results) => {
        if (insertErr) {
          console.error("Error inserting user:", insertErr);
          res
            .status(500)
            .json({ success: false, error: "Internal server error" });
          return;
        }

        res.json({ success: true });
      }
    );
  });
});

// Define a route to delete a user from the database
app.delete("/api/deleteUser/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query to delete the user by their ID
  const deleteUserQuery = "DELETE FROM users WHERE id = ?";

  // Use the connection to execute the query
  connection.query(deleteUserQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
      return;
    }

    res.json({ success: true });
  });
});

// Add this below other app methods
app.put("/api/changePassword", (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Username and new password are required.",
    });
  }

  const saltRounds = 10;

  bcrypt.hash(newPassword, saltRounds, (hashErr, hash) => {
    if (hashErr) {
      console.error("Error hashing new password:", hashErr);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
      return;
    }

    const updatePasswordQuery =
      "UPDATE users SET passwordHash = ? WHERE username = ?";
    connection.query(
      updatePasswordQuery,
      [hash, username],
      (updateErr, results) => {
        if (updateErr || results.affectedRows === 0) {
          console.error("Error updating password:", updateErr);
          res.status(500).json({
            success: false,
            error: "Internal server error or user not found",
          });
          return;
        }

        res.json({ success: true });
      }
    );
  });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port http://asawolverine.tech`);
  console.log(`Admin is running on http://asawolverine.tech/admin`);
});
