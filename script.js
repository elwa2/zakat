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

// Display records in the table
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

// Format date as DD/MM/YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Display current date in the desired format
document.getElementById('currentDate').textContent = `تاريخ اليوم: ${formatDate(new Date())}`;

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
    // Add record with the correct 'no' from the data
    const existingRecord = data.find(record => record.Name === item.Name);
    if (existingRecord) {
        records.push({ no: existingRecord.no, Name: item.Name, Amount: item.Amount });
        localStorage.setItem('records', JSON.stringify(records));
        displayRecords();

        // Show the popup with the updated record JSON
        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popup-text');
        popupText.value = JSON.stringify({ no: existingRecord.no, Name: item.Name, Amount: item.Amount }, null, 2);
        popup.style.display = 'block';
    } else {
        console.error('Record not found in data');
    }
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

// Load data when the page loads
loadData();
