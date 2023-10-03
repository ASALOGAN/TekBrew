
    // Function to format a date string as DD/MM/YYYY
    function formatDate(dateString) 
    {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    }

    // Function to create and update the pie chart
function createPieChart(teaCount, coffeeCount) {
    const ctx = document.getElementById('pie-chart').getContext('2d');

    // Check if there is an existing chart on the canvas
    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    const data = {
        labels: ['Tea', 'Coffee'],
        datasets: [{
            data: [teaCount, coffeeCount],
            backgroundColor: ['#FF5733', '#3498DB'],
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: false, // Disable automatic resizing
            maintainAspectRatio: false // Disable aspect ratio scaling
        }
    };

    // Create a new chart and store it in a global variable
    window.myPieChart = new Chart(ctx, config);
}

    // Function to generate month options starting from March 2023
    function generateMonthOptions() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Months are 0-based
        const monthSelector = document.getElementById("month-selector");

        for (let year = 2023; year <= today.getFullYear(); year++) {
            const startMonth = year === 2023 ? 3 : 1; // Start from March in the first year
            const endMonth = year === today.getFullYear() ? currentMonth : 12; // End at the current month in the last year

            for (let month = startMonth; month <= endMonth; month++) {
                const monthString = month.toString().padStart(2, '0');
                const monthName = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' });
                const yearMonth = `${monthName} ${year}`;
                const option = new Option(`${yearMonth}`, monthString);
                monthSelector.appendChild(option);
            }
        }

        // Set the default selection to the current month
        monthSelector.value = currentMonth.toString().padStart(2, '0');
        fetchDataAndPopulateTable(); // Call the function to fetch and populate data
    }

    // JavaScript to fetch and populate the table with data
    async function fetchDataAndPopulateTable() {
        try {
            const selectedMonth = document.getElementById("month-selector").value;
            console.log('Selected Month:', selectedMonth); // Log the selected month

            // Update the URL to match your server's location
            const response = await fetch(`/api/data?month=${selectedMonth}`);
            const data = await response.json();

            console.log('Data Received:', data); // Log the data received from the server

            const tableBody = document.getElementById("dashboard-table-body");
            const noDataMessage = document.getElementById("no-data-message");
            const tableHeader = document.getElementById("table-header");
            const BCalc = document.getElementById("beverage-price-calculator");
            const totalsRow = document.getElementById("totals-row"); // Get the totals row
            const chartContainer = document.getElementById("chart-container"); // Get chart container

            // Check if data is empty
            if (data.length === 0) {
                tableBody.innerHTML = ''; // Clear existing table data
                noDataMessage.style.display = 'block'; // Display the no data message
                tableHeader.classList.add('hide'); // Hide the table header
                totalsRow.style.display = 'none'; // Hide the totals row when no data is available
                BCalc.style.display = 'none'; // Hide the calculator when no data is available
                chartContainer.style.display = 'none'; // Hide the chart container
            } else {
                tableBody.innerHTML = ''; // Clear existing table data
                noDataMessage.style.display = 'none'; // Hide the no data message
                tableHeader.classList.remove('hide'); // Show the table header
                BCalc.style.display = 'block';

                // Calculate the totals
                let totalUsers = 0;
                let totalTea = 0;
                let totalCoffee = 0;
                let totalBeverage = 0;

                data.forEach((row) => {
                    totalUsers += parseInt(row.user_count);
                    totalTea += parseInt(row.tea);
                    totalCoffee += parseInt(row.coffee);
                    totalBeverage += parseInt(row.total);
                });

                // Update the totals row in the table
                document.getElementById("total-users").textContent = totalUsers;
                document.getElementById("total-tea").textContent = totalTea;
                document.getElementById("total-coffee").textContent = totalCoffee;
                document.getElementById("total-beverage").textContent = totalBeverage;

                // Iterate through the data and populate the table
                data.forEach((row) => {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${formatDate(row.date)}</td>
                        <td>${row.user_count}</td>
                        <td>${row.tea}</td>
                        <td>${row.coffee}</td>
                        <td>${row.total}</td>
                    `;
                    tableBody.appendChild(newRow);
                });

                // Show the totals row and chart container
                totalsRow.style.display = 'table-row';
                chartContainer.style.display = 'block';

                // Update the pie chart
                createPieChart(totalTea, totalCoffee);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Call the generateMonthOptions function when the page loads
    document.addEventListener("DOMContentLoaded", generateMonthOptions);

    // Add an event listener to the month selector to update data when the month changes
    document.getElementById("month-selector").addEventListener("change", fetchDataAndPopulateTable);

    // Add the following JavaScript code to calculate the total beverage price
    document.getElementById("calculate-price-button").addEventListener("click", calculateTotalPrice);

    function calculateTotalPrice() {
        const teaPrice = parseFloat(document.getElementById("tea-price").value);
        const coffeePrice = parseFloat(document.getElementById("coffee-price").value);
        const selectedMonth = document.getElementById("month-selector").value;

        // Fetch the data for the selected month
        fetch(`/api/data?month=${selectedMonth}`)
            .then((response) => response.json())
            .then((data) => {
                let totalTea = 0;
                let totalCoffee = 0;

                // Calculate the total quantity of tea and coffee consumed for the selected month
                data.forEach((row) => {
                    totalTea += row.tea;
                    totalCoffee += row.coffee;
                });

                // Calculate the total beverage price
                const totalBeveragePrice = (totalTea * teaPrice) + (totalCoffee * coffeePrice);

                // Display the total beverage price on the webpage
                document.getElementById("total-price").textContent = `Total Beverage Price for ${getSelectedMonthName(selectedMonth)}: ₹${totalBeveragePrice.toFixed(2)}`;
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    // Function to get the name of the selected month
    function getSelectedMonthName(month) {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[parseInt(month) - 1];
    }