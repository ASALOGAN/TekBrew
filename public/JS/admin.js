// Get references to HTML elements
const adminLoginForm = document.getElementById('admin-login-form');
const adminDashboard = document.getElementById('admin-dashboard');
const adminlogin = document.getElementById('admin-login');
const adminUsernameInput = document.getElementById('admin-username');
const adminSuggestionsDiv = document.getElementById('suggestions');

// Function to hide all admin sections except the dashboard
function hideAdminSections() {
  const adminSections = document.querySelectorAll('#admin-dashboard > section');
  adminSections.forEach((section) => {
    if (section !== adminDashboard) {
      section.style.display = 'none';
    }
  });
}

// Check if the user is already logged in
const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');

if (isAdminLoggedIn === 'true') {
  // User is logged in, display the admin dashboard
  adminlogin.style.display = 'none'; // Hide the login form
  adminDashboard.style.display = 'block'; // Show the admin dashboard

  // Display the admin's username
  const username = sessionStorage.getItem('adminUsername');
  const Name = document.getElementById('Admin-Name');
  Name.textContent = username;

  // Hide other sections (if any)
  hideAdminSections();
    
  // Show the dashboard section
  const dashboardSection = document.getElementById('dashboard-section');
  dashboardSection.style.display = 'block'; // Show the dashboard section
}else {
  adminlogin.style.display = 'flex'; // Hide the login form
  adminDashboard.style.display = 'none'; // Show the admin dashboard
}

// Event listener for admin login form submission
adminLoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = adminUsernameInput.value;
  const password = document.getElementById('admin-password').value;

  // Send admin login data to the server
  const response = await fetch('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 200) {
    // Admin authentication successful
    adminlogin.style.display = 'none'; // Hide the login form
    adminDashboard.style.display = 'block'; // Show the admin dashboard

    // Store a session token in session storage to indicate the user is logged in
    sessionStorage.setItem('adminLoggedIn', 'true');
    sessionStorage.setItem('adminUsername', username);

    // Display the admin's username
    const Name = document.getElementById('Admin-Name');
    Name.textContent = username;

    // Hide other sections (if any)
    hideAdminSections();
      
    // Show the dashboard section
  const dashboardSection = document.getElementById('dashboard-section');
  dashboardSection.style.display = 'block'; // Show the dashboard section
  } else {
    // Admin authentication failed
    alert('Admin authentication failed. Please check your username and password.');
  }
});

// Function to fetch admin username suggestions from the server based on user input
const fetchAdminSuggestions = (input) => {
  // Make an AJAX request to fetch admin username suggestions
  fetch(`/admin/suggest?input=${input}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous suggestions
      adminSuggestionsDiv.innerHTML = '';

      // Display admin username suggestions
      if (data.length > 0) {
        data.forEach((suggestion) => {
          const suggestionElement = document.createElement('div');
          suggestionElement.textContent = suggestion;
          suggestionElement.classList.add('suggestion');
          adminSuggestionsDiv.appendChild(suggestionElement);

          // Add a click event listener to populate the input field when a suggestion is clicked
          suggestionElement.addEventListener('click', () => {
            adminUsernameInput.value = suggestion;
            adminSuggestionsDiv.innerHTML = ''; // Clear suggestions
          });
        });
      } else {
        adminSuggestionsDiv.innerHTML = '<p>No suggestions found</p>';
      }
    })
    .catch((error) => {
      console.error('Error fetching admin username suggestions:', error);
    });
};

// Add an input event listener to the admin username input field
adminUsernameInput.addEventListener('input', () => {
  const inputValue = adminUsernameInput.value.trim();
  if (inputValue.length > 0) {
    fetchAdminSuggestions(inputValue);
  } else {
    adminSuggestionsDiv.innerHTML = ''; // Clear suggestions if input is empty
  }
});


