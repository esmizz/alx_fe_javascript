// Save the last viewed quote in session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', quote);
}

// Retrieve and display the last viewed quote from session storage
window.onload = () => {
  displayQuotes();
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    alert(`Last viewed quote: ${lastViewedQuote}`);
  }
};
document.getElementById('exportQuotes').addEventListener('click', () => {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    displayQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}

function displayQuotes(filteredQuotes = quotes) {
  const quotesList = document.getElementById('quotesList');
  quotesList.innerHTML = '';
  filteredQuotes.forEach((quote, index) => {
    const li = document.createElement('li');
    li.textContent = quote.text;
    quotesList.appendChild(li);
  });
}

// Load selected category from local storage
window.onload = () => {
  displayQuotes();
  populateCategories();
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = selectedCategory;
  filterQuotes();
};

// Example of adding quotes with categories
function addQuote(quote, category) {
  quotes.push({ text: quote, category: category });
  saveQuotes();
  populateCategories();
  filterQuotes();
}
document.getElementById('addQuote').addEventListener('click', () => {
  const newQuote = prompt('Enter a new quote:');
  const category = prompt('Enter a category:');
  if (newQuote && category) {
    addQuote(newQuote, category);
  }
});
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.map(item => ({ text: item.body, category: 'server' }));
}
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const combinedQuotes = [...quotes, ...serverQuotes];
  quotes = combinedQuotes.filter((quote, index, self) =>
    index === self.findIndex(q => q.text === quote.text)
  );
  saveQuotes();
  displayQuotes();
}

// Periodically check for new quotes from the server
setInterval(syncQuotes, 30000); // Every 30 seconds
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const combinedQuotes = [...serverQuotes, ...quotes];
  quotes = combinedQuotes.filter((quote, index, self) =>
    index === self.findIndex(q => q.text === quote.text)
  );
  saveQuotes();
  displayQuotes();
}
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const conflicts = quotes.filter(quote =>
    serverQuotes.some(sq => sq.text === quote.text)
  );
  if (conflicts.length > 0) {
    alert('Conflicts detected. Server data will take precedence.');
  }
  const combinedQuotes = [...serverQuotes, ...quotes];
  quotes = combinedQuotes.filter((quote, index, self) =>
    index === self.findIndex(q => q.text === quote.text)
  );
  saveQuotes();
  displayQuotes();
}
