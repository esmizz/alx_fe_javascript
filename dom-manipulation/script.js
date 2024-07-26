function fetchQuotesFromServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Handle server data and update local storage
            updateLocalStorage(data);
        })
        .catch(error => console.error('Error fetching quotes:', error));
}

// Fetch quotes every 5 minutes
setInterval(fetchQuotesFromServer, 300000);
function updateLocalStorage(serverData) {
    let localData = JSON.parse(localStorage.getItem('quotes')) || [];

    // Simple conflict resolution: server data takes precedence
    localData = serverData;

    localStorage.setItem('quotes', JSON.stringify(localData));
}

function syncQuotesWithServer() {
    let localData = JSON.parse(localStorage.getItem('quotes')) || [];

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localData)
    })
    .then(response => response.json())
    .then(data => console.log('Successfully synced data:', data))
    .catch(error => console.error('Error syncing data:', error));
}

// Sync quotes every 5 minutes
setInterval(syncQuotesWithServer, 300000);
function notifyUser(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}

function handleConflict(localData, serverData) {
    // Assuming server data takes precedence
    notifyUser('Conflicts detected. Server data has been applied.');

    // Optional: allow manual conflict resolution
    // let userDecision = prompt('Conflict detected. Type "server" to use server data or "local" to keep your changes.');
    // if (userDecision === 'local') {
    //     // Merge local changes manually
    // }
}
