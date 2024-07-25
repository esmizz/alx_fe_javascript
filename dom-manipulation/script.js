// script.js

// Initial array of quote objects
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Wisdom" },
  { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
    showRandomQuote(); // Optionally display the newly added quote
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial quote display
showRandomQuote();
