document.addEventListener("DOMContentLoaded", () => {
  const usersSection = document.getElementById("users-section");
  const userTable = document.getElementById("user-table");
  const addUserForm = document.getElementById("add-user-form");
  const deleteConfirmationModal = document.getElementById(
    "deleteConfirmationModal"
  );
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const closeButton = document.querySelector(".close");

  let userIdToDelete = null; // To store the ID of the user to be deleted

  // Function to open the confirmation modal
  function openModal(userId) {
    userIdToDelete = userId;
    deleteConfirmationModal.style.display = "block";
  }

  // Function to close the confirmation modal
  function closeModal() {
    deleteConfirmationModal.style.display = "none";
  }

  // Function to create a "Delete" button for a user row
  function createDeleteButton(userId) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      openModal(userId); // Open the confirmation modal
    });
    return deleteButton;
  }

  // Add event listener for the "Delete" button in the modal
  confirmDeleteButton.addEventListener("click", () => {
    // Send a request to delete the user
    fetch(`/api/deleteUser/${userIdToDelete}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Close the modal
          closeModal();
          // Refresh the user list
          fetchUserList();
        } else {
          console.error("Error deleting user:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  });

  // Add event listener to close the modal when clicking the close button
  closeButton.addEventListener("click", () => {
    closeModal();
  });

  // Function to fetch and display the user list
  function fetchUserList() {
    // Fetch user data from the server
    fetch("/api/getUsers")
      .then((response) => response.json())
      .then((data) => {
        // Clear the table
        userTable.innerHTML = "";

        // Create table header
        const tableHeader = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const noHeaderCell = document.createElement("th");
        noHeaderCell.textContent = "NO.";
        const usersHeaderCell = document.createElement("th");
        usersHeaderCell.textContent = "Users";
        const actionHeaderCell = document.createElement("th");
        actionHeaderCell.textContent = "Action";
        headerRow.appendChild(noHeaderCell);
        headerRow.appendChild(usersHeaderCell);
        headerRow.appendChild(actionHeaderCell);
        tableHeader.appendChild(headerRow);
        userTable.appendChild(tableHeader);

        // Create table body and populate with user data
        const tableBody = document.createElement("tbody");
        data.forEach((user, index) => {
          const bodyRow = document.createElement("tr");
          const noCell = document.createElement("td");
          noCell.textContent = index + 1;
          const bodyCell = document.createElement("td");
          bodyCell.textContent = user.username;
          const actionCell = document.createElement("td");
          const deleteButton = createDeleteButton(user.id);
          actionCell.appendChild(deleteButton);
          bodyRow.appendChild(noCell);
          bodyRow.appendChild(bodyCell);
          bodyRow.appendChild(actionCell);
          tableBody.appendChild(bodyRow);
        });
        userTable.appendChild(tableBody);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  // Add event listener to handle form submission
  addUserForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const newUser = {
      username: usernameInput.value,
      password: passwordInput.value,
    };

    // Send the new user data to the server
    fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check for success or error response from the server
        if (data.success) {
          // Clear the form inputs
          usernameInput.value = "";
          passwordInput.value = "";
          // Refresh the user list
          fetchUserList();
        } else {
          console.error("Error adding user:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  });

  // Call fetchUserList to initially populate the user list
  fetchUserList();

  const changePasswordForm = document.getElementById("change-password-form");

  changePasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const currentUsernameInput = document.getElementById("currentUsername");
    const newPasswordInput = document.getElementById("newPassword");

    const userCredentials = {
      username: currentUsernameInput.value,
      newPassword: newPasswordInput.value,
    };

    fetch("/api/changePassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          currentUsernameInput.value = "";
          newPasswordInput.value = "";
          // Display the modal
          const modal = document.getElementById("passwordChangeModal");
          modal.style.display = "block";

          // Close the modal after a certain period
          setTimeout(() => {
            modal.style.display = "none";
          }, 3000); // display for 3 seconds
        } else {
          console.error("Error changing password:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
      });
  });
});
