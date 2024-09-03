document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const suggestionsList = document.getElementById('suggestions');
  const nameDisplay = document.getElementById('name');
  const amountDisplay = document.getElementById('amount');
  const addRecordButton = document.getElementById('addRecord');
  const recordsBody = document.getElementById('recordsBody');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const clearRecordsButton = document.getElementById('clearRecords');
  const popup = document.getElementById('popup');
  const dataOutput = document.getElementById('dataOutput');
  const dateToday = document.getElementById('dateToday');
  let data = [];
  let records = [];

  // تحميل بيانات JSON
  fetch('data.json')
      .then(response => response.json())
      .then(jsonData => {
          data = jsonData;
      });

  searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const suggestions = data.filter(item => item.Name.toLowerCase().includes(query));

      suggestionsList.innerHTML = suggestions.map(item => `
          <div class="suggestion" data-name="${item.Name}" data-amount="${item.Amount}">
              ${item.Name} - ${item.Amount}
          </div>
      `).join('');
      suggestionsList.style.display = suggestions.length ? 'block' : 'none';
  });

  suggestionsList.addEventListener('click', (event) => {
      if (event.target.classList.contains('suggestion')) {
          const name = event.target.getAttribute('data-name');
          const amount = event.target.getAttribute('data-amount');
          searchInput.value = name;
          nameDisplay.innerText = name;
          amountDisplay.innerText = amount;
          suggestionsList.innerHTML = ''; // مسح الاقتراحات
          suggestionsList.style.display = 'none';
      }
  });

  addRecordButton.addEventListener('click', () => {
      const name = nameDisplay.innerText;
      const amount = parseFloat(amountDisplay.innerText) || 0;
      const today = new Date().toLocaleDateString('ar-EG', {
          day: '2-digit',
          month: 'numeric',
          year: 'numeric'
      });

      if (name && amount) {
          records.push({ Date: today, Name: name, Amount: amount });
          updateRecordsTable();
          showPopup();
      }
  });

  clearRecordsButton.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من مسح جميع السجلات؟')) {
          records = [];
          updateRecordsTable();
      }
  });

  function updateRecordsTable() {
      recordsBody.innerHTML = records.map(record => `
          <tr>
              <td>${record.Date}</td>
              <td>${record.Name}</td>
              <td>${record.Amount}</td>
          </tr>
      `).join('');

      const totalAmount = records.reduce((sum, record) => sum + record.Amount, 0);
      totalAmountDisplay.innerText = totalAmount.toFixed(2);
  }

  function showPopup() {
      const jsonRecords = records.map((record, index) => ({
          no: index + 1,
          Name: record.Name,
          Amount: record.Amount,
          Date: record.Date
      }));
      dataOutput.value = JSON.stringify(jsonRecords, null, 2);
      popup.style.display = 'block';
  }
});
