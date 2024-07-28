const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your actual API endpoint

// Array of quote objects
let quotes = [];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to populate categories dynamically
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((quote) => quote.category))];
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear existing options
  categoryFilter.innerHTML = "";

  // Add options dynamically
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category; // Use textContent to set option text
    categoryFilter.appendChild(option);
  });

  // Set the last selected category if it exists
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories(); // Update categories after adding a new quote
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to export quotes to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories(); // Update categories after importing quotes
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
  }
}

// Function to synchronize quotes with the server
async function syncQuotes() {
  try {
    // Fetch data from server
    function fetchQuotesFromServer(){}
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error("Failed to fetch data from server");
    const serverQuotes = await response.json();

    //simple conflict resolution 
    if (serverQuotes.length > 0) {
  // Display a notification asking the user to resolve the conflict manually
  document.getElementById('notification').innerText = 'Conflict detected! Please resolve manually.';

  // Provide buttons for manual conflict resolution
  document.getElementById('conflict-resolution').innerHTML = `
    <button onclick="resolveConflict('local')">Use local data</button>
    <button onclick="resolveConflict('server')">Use server data</button>
    <button onclick="resolveConflict('merge')">Merge changes</button>
  `;

  // Function to resolve conflicts manually
  function resolveConflict(manualResolution) {
    if (manualResolution === 'local') {
      // Prioritize local data
      quotes = localQuotes;
    } else if (manualResolution === 'server') {
      // Prioritize server data
      quotes = serverQuotes;
    } else if (manualResolution === 'merge') {
      // Merge changes (implement merge logic here)
    }

    // Save quotes and populate categories after manual resolution
    saveQuotes();
    populateCategories();

    // Display a notification indicating the conflict has been resolved
    document.getElementById('notification').innerText = 'Quotes synced with server!';
  }
}

    // Post local data to server
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotes),
    });
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Function to start periodic sync
function startSync() {
  setInterval(syncQuotes, 60000); // Sync every 60 seconds
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  startSync(); // Start periodic sync
});

// Example of manual sync trigger
document
  .getElementById("manualSyncButton")
  .addEventListener("click", syncQuotes);

// Display the last viewed quote on page load (if any)
const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
if (lastViewedQuote) {
  const quote = JSON.parse(lastViewedQuote);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
}
