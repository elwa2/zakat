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
        row.innerHTML = `
            <td class="number">${item.no}</td>
            <td class="name">${item.Name}</td>
            <td class="amount">${item.Amount}</td>
            <td>
                <button class="delete-btn" onclick="confirmDelete(${item.no})">حذف</button>
            </td>
        `;
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

// Display current date
document.getElementById('currentDate').textContent = `تاريخ اليوم: ${formatDate(new Date())}`;

// Search functionality
document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    updateSuggestions(query);
});

// Update suggestions based on search query
function updateSuggestions(query = '') {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';

    if (query.length < 1) return;

    const matches = data.filter(item => 
        item.Name.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
        suggestionsBox.style.display = 'block';
        matches.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.Name;
            div.onclick = () => addRecord(item);
            suggestionsBox.appendChild(div);
        });
    }
}

// Add record to the table
function addRecord(item) {
    if (!records.some(record => record.no === item.no)) {
        records.push(item);
        localStorage.setItem('records', JSON.stringify(records));
        displayRecords();
    }
    document.getElementById('search').value = '';
    document.getElementById('suggestions').style.display = 'none';
}

// Clear search input
document.getElementById('clearInput').addEventListener('click', () => {
    document.getElementById('search').value = '';
    document.getElementById('suggestions').style.display = 'none';
});

// Print functionality
document.getElementById('printButton').addEventListener('click', () => {
    window.print();
});

// Clear all records
document.getElementById('clearButton').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف جميع السجلات؟')) {
        records = [];
        localStorage.removeItem('records');
        displayRecords();
    }
});

// Delete specific record
function confirmDelete(no) {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
        deleteRecord(no);
    }
}

function deleteRecord(no) {
    records = records.filter(record => record.no !== no);
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords();
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Apply saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Initialize data on page load
loadData();