// Function to fetch and display table data
        function fetchTableData(selectedDate) {
            fetch(`/api/IndividualCount?date=${selectedDate}`)
                .then((response) => response.json())
                .then((data) => {
                    const table = document.querySelector('.custom-table-IC');
                    const noDataMessage = document.querySelector('.custom-no-data-message-IC');
                    const tableBody = document.getElementById('table-body-IC');
                    
                    if (data.length > 0) {
                        // Data is available, show the table
                        table.style.display = 'table';
                        noDataMessage.style.display = 'none';
                        tableBody.innerHTML = ''; // Clear existing table data
                        
                        data.forEach((row) => {
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                <td>${row.user_name}</td>
                                <td>${row.tea_count}</td>
                                <td>${row.coffee_count}</td>
                                <td>${row.total_count}</td>
                                <td>${row.description}</td>
                            `;
                            tableBody.appendChild(newRow);
                        });
                    } else {
                        // No data available, hide the table and display the message
                        table.style.display = 'none';
                        noDataMessage.style.display = 'block';
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }

        // Get today's date in the Indian timezone
        const todayInIndia = moment().utcOffset('+05:30').format('YYYY-MM-DD');

        // Set the maximum date as today's date
        document.querySelector('.custom-date-selector-IC').max = todayInIndia;

        // Set the default value to today's date and fetch data
        document.querySelector('.custom-date-selector-IC').value = todayInIndia;
        fetchTableData(todayInIndia);

        // Add an event listener to the date selector to fetch data when the date changes
        document.querySelector('.custom-date-selector-IC').addEventListener('change', (event) => {
            const selectedDate = event.target.value;
            fetchTableData(selectedDate);
        });