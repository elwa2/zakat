// Google Sheets configuration
const SHEET_ID = '1qioJ0BnPXRv_Px66HXkkMiqInsDBiHLI2jgnLauM1SI';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let data = [];
let records = [];

// Load data from Google Sheets
async function loadData() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }

        const text = await response.text();
        // استخراج JSON من استجابة Google Visualization API
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        
        // تحويل البيانات من تنسيق Google Sheets إلى التنسيق المطلوب
        data = jsonData.table.rows.map(row => ({
            no: parseInt(row.c[0]?.v) || 0,
            Name: row.c[1]?.v || '',
            Amount: parseInt(row.c[2]?.v) || 0
        })).filter(item => item.no && item.Name && item.Amount);

        // تحميل السجلات المحفوظة محلياً
        const storedRecords = localStorage.getItem('records');
        if (storedRecords) {
            records = JSON.parse(storedRecords);
        }

        updateSuggestions();
        displayRecords();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('حدث خطأ في تحميل البيانات. يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.');
    }
}

// Display records in the table
function displayRecords() {
    let tableBody = document.getElementById('recordBody');
    let totalAmount = document.getElementById('totalAmount');
    
    tableBody.innerHTML = '';
    let sum = 0;

    // Create a copy of records array and reverse it
    const reversedRecords = [...records].reverse();

    reversedRecords.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td class="number">${item.no}</td>
            <td class="name">${item.Name}</td>
            <td class="amount">${item.Amount.toLocaleString('ar-EG')}</td>
            <td>
                <button class="delete-btn" onclick="confirmDelete(${item.no})">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
        sum += item.Amount;
    });

    totalAmount.textContent = `إجمالي المبلغ: ${sum.toLocaleString('ar-EG')}`;
}

// Update suggestions based on search query
function updateSuggestions(query = '') {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';

    if (query.length < 1) return;

    const matches = data.filter(item => 
        item.Name.toLowerCase().includes(query.toLowerCase()) &&
        !records.some(record => record.no === item.no)
    );

    if (matches.length > 0) {
        suggestionsBox.style.display = 'block';
        matches.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `${item.Name} - ${item.Amount.toLocaleString('ar-EG')}`;
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

// Event Listeners
document.getElementById('search').addEventListener('input', function() {
    const query = this.value;
    updateSuggestions(query);
});

document.getElementById('clearInput').addEventListener('click', () => {
    document.getElementById('search').value = '';
    document.getElementById('suggestions').style.display = 'none';
});

document.getElementById('printButton').addEventListener('click', () => {
    window.print();
});

document.getElementById('clearButton').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف جميع السجلات؟')) {
        records = [];
        localStorage.removeItem('records');
        displayRecords();
    }
});

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

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

// Display current date
document.getElementById('currentDate').textContent = `تاريخ اليوم: ${formatDate(new Date())}`;

// Reload data every 5 minutes to keep it synchronized
setInterval(loadData, 5 * 60 * 1000);

// Initialize data on page load
loadData();