let data = [];
let records = [];

// Load data from LocalStorage or initialize empty records
function loadData() {
    const storedRecords = localStorage.getItem('records');
    if (storedRecords) {
        records = JSON.parse(storedRecords);
    }

    // Fetch data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            updateSuggestions();
            displayRecords();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRecords() {
    let tableBody = document.getElementById('recordBody');
    let totalAmount = document.getElementById('totalAmount');
    
    tableBody.innerHTML = '';
    let sum = 0;

    records.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `<td class="name">${item.Name}</td><td class="amount">${item.Amount}</td>`;
        tableBody.appendChild(row);
        sum += item.Amount;
    });

    totalAmount.textContent = `إجمالي المبلغ: ${sum}`;
}

document.getElementById('search').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    updateSuggestions(query);
});

function updateSuggestions(query = '') {
    let suggestions = [];
    if (query.length > 0) {
        suggestions = data.filter(item => item.Name.toLowerCase().includes(query));
    }
    let suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    suggestions.forEach(item => {
        let div = document.createElement('div');
        div.textContent = `${item.Name} - ${item.Amount}`;
        div.addEventListener('click', function() {
            document.getElementById('search').value = item.Name;
            addRecord(item);
            suggestionsBox.innerHTML = '';
        });
        suggestionsBox.appendChild(div);
    });
}

function addRecord(item) {
    records.push({ Name: item.Name, Amount: item.Amount });
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords();
}

document.getElementById('printButton').addEventListener('click', () => {
    window.print();
});

document.getElementById('clearButton').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من مسح جميع السجلات؟')) {
        localStorage.removeItem('records');
        records = [];
        displayRecords();
    }
});

// Close the popup when clicking outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
    }
};

// Load data when the page loads
loadData();
