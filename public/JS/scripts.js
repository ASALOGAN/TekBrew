// Get references to HTML elements
const loadingSection = document.getElementById('loading');
const loginSection = document.getElementById('login');
const selectionSection = document.getElementById('selection');
const confirmationSection = document.getElementById('confirmation');
const loginForm = document.getElementById('login-form');
const nameInput = document.getElementById('name');
const suggestionsDiv = document.getElementById('suggestions');

// Get references to the modal and its elements
const modal = document.getElementById('confirmation-modal');
const closeModal = document.getElementById('close-modal');
const confirmButton = document.getElementById('confirm-button');
const modalText = document.getElementById('modal-text');
const selectedDrink = document.getElementById('selected-drink');

// Hide the login, selection, and confirmation sections initially
loginSection.style.display = 'none';
selectionSection.style.display = 'none';
confirmationSection.style.display = 'none';

// Simulate loading animation
setTimeout(() => {
  // Get the loading div
  const loadingDiv = document.querySelector('.blue-circle');

  // Add the puff-out-center animation class
  loadingDiv.classList.add('puff-out-center');

  // Wait for 0.5 seconds after the puff-out-center animation
  setTimeout(() => {
    // Change the background color of the loading section to blue
    loadingSection.style.backgroundColor = 'blue';

    // Wait for another 0.5 seconds
    setTimeout(() => {
      // Create a white circle div
      const whiteCircle = document.createElement('div');
      whiteCircle.classList.add('white-circle', 'scale-in-center');

      // Append the white circle to the loading section
      loadingSection.appendChild(whiteCircle);

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      whiteCircle.appendChild(imageContainer);

// Create the image element
      const image = document.createElement('img');
      image.src = '../Image/logo.png'; // Replace with your image URL
      image.alt = 'Image Description';
      image.classList.add('image', 'fade-in');
      imageContainer.appendChild(image);
      // Create a text container
      const textContainer = document.createElement('div');
      textContainer.classList.add('text-container');

      // Create the text element
      const textElement = document.createElement('div');
      textElement.textContent = 'TekBrew'; // Replace with your text
      textElement.classList.add('tracking-in-contract');
      textContainer.appendChild(textElement);

      // Append the text container below the white circle
      whiteCircle.appendChild(textContainer);

      // Wait for 0.5 seconds after the white-circle animation
      setTimeout(() => {
        // Hide the loading section
        loadingSection.style.display = 'none';
        // Display the login section
        loginSection.style.display = 'block';
      }, 3000); // Wait for 0.5 seconds (adjust as needed) after white-circle animation
    }, 500); // Wait for 0.5 seconds (adjust as needed) after background color change
  }, 500); // Wait for 0.5 seconds (adjust as needed) after puff-out-center animation
}, 1500); // Start puff-out-center animation after 3 seconds of the bounce-in-top animation (adjust as needed)

// Handle form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = nameInput.value;
  const password = document.getElementById('passcode').value;

  // Send a POST request to the server for authentication
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.ok) {
        // Authentication successful, you can redirect the user or perform other actions
        console.log('Authentication successful');
            loginSection.style.display = 'none';
  selectionSection.style.display = 'block';
       const userNameSpan = document.getElementById('user-name');
        userNameSpan.textContent = username;
        selectionSection.style.display = 'block';   
      } else {
        // Authentication failed, handle error (e.g., display an error message)
        console.error('Authentication failed');
      }
    })
    .catch((error) => {
      console.error('Error during authentication:', error);
    });
});

// Function to fetch a random motivational quote
async function fetchMotivationalQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();

    if (response.ok) {
      const randomQuote = data.content; // Extract the quote from the response
      const author = data.author; // Extract the author from the response

      // Update the quote and author div elements
      document.getElementById('quote').textContent = randomQuote;
      document.getElementById('author').textContent = `-${author}`;
    } else {
      console.error(`Failed to fetch a quote: ${data.message}`);
      // Handle errors here
    }
  } catch (error) {
    console.error(`Error fetching quote: ${error.message}`);
    // Handle errors here
  }
}

// Function to open the modal
const openModal = (drink) => {
  selectedDrink.textContent = drink;
  fetchMotivationalQuote(); // Fetch a random motivational quote
  modal.style.display = 'block';
};

// Function to close the modal
const closeModalFunction = () => {
  modal.style.display = 'none';
};

// Handle drink selection
// Get references to the circular drink options
const teaOption = document.getElementById('tea-option');
const coffeeOption = document.getElementById('coffee-option');

// Event listeners to open and close the modal
teaOption.addEventListener('click', () => {
  openModal('Tea');
});

coffeeOption.addEventListener('click', () => {
  openModal('Coffee');
});

// Add click event listeners to the circular divs
/*ateaOption.addEventListener('click', () => {
  // Handle tea selection
  selectionSection.style.display = 'none';
  confirmationSection.textContent = 'You selected Tea.';
  confirmationSection.style.display = 'block';
});

coffeeOption.addEventListener('click', () => {
  // Handle coffee selection
  selectionSection.style.display = 'none';
  confirmationSection.textContent = 'You selected Coffee.';
  confirmationSection.style.display = 'block';
});*/

closeModal.addEventListener('click', () => {
  closeModalFunction();
});

// Event listener for the confirm button
confirmButton.addEventListener('click', () => {
  // Handle confirmation logic here (e.g., submit the selection)
  const selectedDrinkText = selectedDrink.textContent;

  // Get the username
  const username = nameInput.value;

  // Hide the selection section
  selectionSection.style.display = 'none';

  // Create a customized confirmation message
  let confirmationMessage = `Enjoy your ${selectedDrinkText} ${username}!`;

  // Get the confirmation message div
  const confirmationMessageDiv = document.getElementById('msg');

  // Update the personalized message in the confirmation message div
  confirmationMessageDiv.textContent = confirmationMessage;

  // Display the confirmation section
  confirmationSection.style.display = 'block';

  // Send a POST request to the server to insert user's beverage choice
  fetch('/insertUserBeverageChoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, beverage: selectedDrinkText }),
  })
    .then((response) => {
      if (response.ok) {
        // Beverage choice inserted successfully, you can perform additional actio>
        console.log('Beverage choice inserted successfully');
      } else {
        // Handle error (e.g., display an error message)
        console.error('Error inserting beverage choice');
      }
    })
    .catch((error) => {
      console.error('Error during beverage choice insertion:', error);
    });

  closeModalFunction();
  // You can perform additional actions here
});

// Function to fetch suggestions from the server based on user input
const fetchSuggestions = (input) => {
  // Make an AJAX request to fetch suggestions
  fetch(`/suggest?input=${input}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous suggestions
      suggestionsDiv.innerHTML = '';

// Display suggestions in the suggestionsDiv
      if (data.length > 0) {
        data.forEach((suggestion) => {
          const suggestionElement = document.createElement('div');
          suggestionElement.textContent = suggestion; // Adjust here to use the suggestion directly
          suggestionElement.classList.add('suggestion');
          suggestionsDiv.appendChild(suggestionElement);

          // Add a click event listener to populate the input field when a suggestion is clicked
          suggestionElement.addEventListener('click', () => {
            nameInput.value = suggestion; // Adjust here to set the suggestion directly
            suggestionsDiv.innerHTML = ''; // Clear suggestions
          });
        });
      } else {
        suggestionsDiv.innerHTML = '<p>No suggestions found</p>';
      }
    })
    .catch((error) => {
      console.error('Error fetching suggestions:', error);
    });
};

// Add an input event listener to the name input field
nameInput.addEventListener('input', () => {
  const inputValue = nameInput.value.trim();
  if (inputValue.length > 0) {
    fetchSuggestions(inputValue);
  } else {
    suggestionsDiv.innerHTML = ''; // Clear suggestions if input is empty
  }
});