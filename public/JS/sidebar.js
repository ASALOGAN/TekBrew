// Get references to the sidebar and the toggle button
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Get reference to the logout button
const logoutButton = document.getElementById('logout-btn');

// Get references to the sidebar options
const dashboardOption = document.getElementById('dashboard-option');
const dailyCountOption = document.getElementById('daily-count-option');
const individualCountOption = document.getElementById('individual-count-option');
const usersOption = document.getElementById('users-option');
const analyticsOption = document.getElementById('analytics-option');
const exportOption = document.getElementById('export-option');

// Get references to the sections
const dashboardSection = document.getElementById('dashboard-section');
const dailyCountSection = document.getElementById('daily-count-section');
const individualCountSection = document.getElementById('individual-count-section');
const usersSection = document.getElementById('users-section');
const analyticsSection = document.getElementById('analytics-section');
const exportSection = document.getElementById('export-section');

// Get reference to the sidebar expand icon container
const sidebarExpandIcon = document.getElementById('sidebarexpand');

const adminSections = document.querySelectorAll('#admin-dashboard > section');

// Variable to track the sidebar state (expanded or collapsed)
let isSidebar = false;
let isExpand = false;
console.log(`Side Bar is: ${isSidebar}`);
console.log(`Label is: ${isExpand}`);

// Function to toggle the sidebar state and update UI
function toggleSidebarState() {
  isSidebar = !isSidebar;
  const sidebarLabels = document.querySelectorAll('.sidebar ul .label-container');

  if (isSidebar) {
    //labels are displayed when the expand button is clicked
    sidebarLabels.forEach((label) => {
      label.style.display = 'none';
      console.log(`Side Bar is: ${isSidebar}`);
      console.log(`Label is: ${isExpand}`);
    });
  } else {
    sidebarLabels.forEach((label) => {
      label.style.display = 'none';
      console.log(`Side Bar is: ${isSidebar}`);
      console.log(`Label is: ${isExpand}`);
    });
  }
}

// Add a click event listener to the sidebarToggle element
sidebarToggle.addEventListener('click', () => {
  // Toggle the 'sidebar-open' class to show/hide the sidebar
  if (!isExpand) {
    sidebar.classList.toggle('sidebar-open');
    // Toggle the sidebar state and update the UI
    toggleSidebarState();

    // Adjust the left margin for all admin sections
    adminSections.forEach((section) => {
      if (isSidebar) {
        section.style.marginLeft = '70px';
      } else {
        section.style.marginLeft = '20px'; // Reset the margin when the sidebar is collapsed or labels are expanded
      }
    });
  }
});

// Event listener for the logout button
logoutButton.addEventListener('click', () => {
  // Clear session storage to log the admin out
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('adminUsername');

  // Redirect the admin to the login page (you may replace 'admin-login.html' with your actual login page URL)
  window.location.href = '/admin';
});

// Add click event listeners to the sidebar options
dashboardOption.addEventListener('click', () => {
  // Show the dashboard section
  dashboardSection.style.display = 'block';

  // Hide other sections
  dailyCountSection.style.display = 'none';
  individualCountSection.style.display = 'none';
  usersSection.style.display = 'none';
  analyticsSection.style.display = 'none';
  exportSection.style.display = 'none';
});

dailyCountOption.addEventListener('click', () => {
  // Show the daily count section
  dailyCountSection.style.display = 'block';

  // Hide other sections
  dashboardSection.style.display = 'none';
  individualCountSection.style.display = 'none';
  usersSection.style.display = 'none';
  analyticsSection.style.display = 'none';
  exportSection.style.display = 'none';
});

individualCountOption.addEventListener('click', () => {
  // Show the individual count section
  individualCountSection.style.display = 'block';

  // Hide other sections
  dashboardSection.style.display = 'none';
  dailyCountSection.style.display = 'none';
  usersSection.style.display = 'none';
  analyticsSection.style.display = 'none';
  exportSection.style.display = 'none';
});

usersOption.addEventListener('click', () => {
  // Show the users section
  usersSection.style.display = 'block';

  // Hide other sections
  dashboardSection.style.display = 'none';
  dailyCountSection.style.display = 'none';
  individualCountSection.style.display = 'none';
  analyticsSection.style.display = 'none';
  exportSection.style.display = 'none';
});

analyticsOption.addEventListener('click', () => {
  // Show the analytics section
  analyticsSection.style.display = 'block';

  // Hide other sections
  dashboardSection.style.display = 'none';
  dailyCountSection.style.display = 'none';
  individualCountSection.style.display = 'none';
  usersSection.style.display = 'none';
  exportSection.style.display = 'none';
});

exportOption.addEventListener('click', () => {
  // Show the export section
  exportSection.style.display = 'block';

  // Hide other sections
  dashboardSection.style.display = 'none';
  dailyCountSection.style.display = 'none';
  individualCountSection.style.display = 'none';
  usersSection.style.display = 'none';
  analyticsSection.style.display = 'none';
});

// Add a click event listener to the sidebar expand icon container
sidebarExpandIcon.addEventListener('click', () => {
  isExpand = !isExpand;
  const sidebarLabels = document.querySelectorAll('.sidebar ul .label-container');

  if (isExpand) {
    // Labels are displayed when the expand button is clicked
    sidebarLabels.forEach((label) => {
      label.style.display = 'block';
      sidebarExpandIcon.innerHTML = '<i class="fas fa-angle-double-left" style="font-size: 24px;"></i>'; // Double left arrow icon
    });

    // Adjust the left margin for all admin sections
    adminSections.forEach((section) => {
      if (isSidebar) {
        section.style.marginLeft = '190px';
      } else {
        section.style.marginLeft = '20px';
      }
    });
  } else {
    sidebarLabels.forEach((label) => {
      label.style.display = 'none';
      sidebarExpandIcon.innerHTML = '<i class="fas fa-angle-double-right" style="font-size: 24px;"></i>'; // Double right arrow icon
    });

    // Reset the left margin for all admin sections
    adminSections.forEach((section) => {
      if (isSidebar) {
        section.style.marginLeft = '70px'; // Adjust the margin for all sections here
      } else {
        section.style.marginLeft = '20px'; // Reset the margin when the sidebar is collapsed or labels are expanded
      }
    });
  }
});
