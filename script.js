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

    reversedRecords.forEach((record, index) => {
        sum += record.Amount;
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-gray-800 dark:text-gray-200">${record.no}</td>
            <td class="px-4 py-3 text-gray-800 dark:text-gray-200">${record.Name}</td>
            <td class="px-4 py-3 text-gray-800 dark:text-gray-200">${record.Amount.toLocaleString('en-US')} EGP</td>
            <td class="px-4 py-3">
                <button onclick="confirmDelete(${record.no})" 
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    totalAmount.textContent = `إجمالي المبلغ: ${sum.toLocaleString('en-US')} EGP`;
}

// Update suggestions based on search query
function updateSuggestions(query = '') {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    
    if (!query) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    const filteredData = data.filter(item => 
        item.Name.toLowerCase().includes(query.toLowerCase()) ||
        item.no.toString().includes(query)
    ).slice(0, 5);

    if (filteredData.length > 0) {
        suggestionsDiv.style.display = 'block';
        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors duration-150';
            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${item.Name}</span>
                    <span class="text-gray-600 dark:text-gray-400">${item.Amount.toLocaleString('en-US')} EGP</span>
                </div>
            `;
            div.addEventListener('click', () => addRecord(item));
            suggestionsDiv.appendChild(div);
        });
    } else {
        suggestionsDiv.style.display = 'none';
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
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (isDark) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialize theme
const theme = localStorage.getItem('theme');
if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Format date with animation
function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    dateElement.textContent = new Date().toLocaleDateString('ar', options);
}

// Update date every second
setInterval(updateDate, 1000);
updateDate(); // Initial update

// Click outside to close suggestions
document.addEventListener('click', function(e) {
    const suggestionsDiv = document.getElementById('suggestions');
    const searchInput = document.getElementById('search');
    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
    }
});

// Reload data every 5 minutes to keep it synchronized
setInterval(loadData, 5 * 60 * 1000);

// Initialize data on page load
loadData();

// Format date for filename
function formatDateForFile() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Download records as CSV
function downloadRecords() {
    const headers = ['الرقم', 'الاسم', 'المبلغ'];
    const csvContent = [
        headers.join(','),
        ...records.map(record => 
            `${record.no},${record.Name},${record.Amount}`
        )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `زكاة_المال_${formatDateForFile()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update print date
function updatePrintDate() {
    const printDateElement = document.getElementById('printDate');
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    printDateElement.textContent = `تاريخ التقرير: ${new Date().toLocaleDateString('ar', options)}`;
}

// Event Listeners
document.getElementById('downloadButton').addEventListener('click', downloadRecords);

// Update print date before printing
window.addEventListener('beforeprint', updatePrintDate);