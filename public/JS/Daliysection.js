      // Function to update the counts display when the date is changed
      function updateCounts() {
        const selectedDate = document.getElementById("day-selector").value;

        // Fetch counts data from the server
        fetch(`/api/Dailycounts?date=${selectedDate}`)
          .then((response) => response.json())
          .then((data) => {
            if (
              data &&
              data.tea_count !== undefined &&
              data.coffee_count !== undefined
            ) {
              // Data is available, update the counts and show the container
              document.getElementById(
                "tea-count"
              ).textContent = `Tea Count: ${data.tea_count}`;
              document.getElementById(
                "coffee-count"
              ).textContent = `Coffee Count: ${data.coffee_count}`;
              document.getElementById(
                "total-count"
              ).textContent = `Total Beverage Count: ${data.total_count}`;
              document.querySelector(".container").style.display = "flex"; // Show the container
              document.getElementById("no-data-message").style.display = "none"; // Hide the message
            } else {
              // No data available, hide the container and show the message
              document.querySelector(".container").style.display = "none"; // Hide the container
              document.getElementById("no-data-message").style.display =
                "block"; // Show the message
            }
          })
          .catch((error) => {
            console.error("Error fetching counts from the server:", error);
            // Handle the error here as needed
          });
      }

      function calculateDailyPrice() {
        const teaPrice = parseFloat(document.getElementById("tea-price").value);
        const coffeePrice = parseFloat(
          document.getElementById("coffee-price").value
        );

        // Get the tea and coffee counts from the fetched data (similar to your existing logic)
        const teaCount =
          parseInt(
            document.getElementById("tea-count").textContent.split(":")[1]
          ) || 0;
        const coffeeCount =
          parseInt(
            document.getElementById("coffee-count").textContent.split(":")[1]
          ) || 0;

        // Calculate the total beverage price
        const totalBeveragePrice =
          teaCount * teaPrice + coffeeCount * coffeePrice;

        // Display the total beverage price on the webpage
        document.getElementById(
          "total-price"
        ).textContent = `Total Beverage Price for Today: ₹${totalBeveragePrice.toFixed(
          2
        )}`;
      }

      document
        .getElementById("calculate-button")
        .addEventListener("click", calculateDailyPrice);

      // Set the event listener for date changes
      document
        .getElementById("day-selector")
        .addEventListener("change", updateCounts);

      // Set the initial max date and default value on page load
      window.onload = function () {
        updateMaxDate();
        updateCounts();
      };

      // Function to update the max date of the day-selector input and set the default value
      function updateMaxDate() {
        const daySelector = document.getElementById("day-selector");
        const currentDate = new Date();
        const indianDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          0, // Hours
          0, // Minutes
          0 // Seconds
        );
        indianDate.setHours(
          indianDate.getHours() + 5,
          indianDate.getMinutes() + 30
        );

        const day = indianDate.getDate().toString().padStart(2, "0");
        const month = (indianDate.getMonth() + 1).toString().padStart(2, "0");
        const year = indianDate.getFullYear();

        const formattedIndianDate = `${day}-${month}-${year}`;
        console.log(`Current Indian Date: ${formattedIndianDate}`);

        const formattedDate = `${year}-${month}-${day}`;
        console.log(`formatteDate: ${formattedDate}`);
        daySelector.min = "2023-03-01";
        daySelector.max = formattedDate;
        daySelector.value = formattedDate; // Set today's Indian date as the default
      }