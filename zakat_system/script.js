let data = [];

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    });

document.getElementById('search').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    let suggestions = data.filter(item => item.Name.toLowerCase().includes(query));
    
    let suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    suggestions.forEach(item => {
        let div = document.createElement('div');
        div.textContent = `${item.Name} - ${item.Amount} ريال`;
        div.addEventListener('click', function() {
            document.getElementById('search').value = item.Name;
            suggestionsBox.innerHTML = '';
        });
        suggestionsBox.appendChild(div);
    });
});
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        console.log("Data loaded successfully:", jsonData);
    })
    .catch(error => {
        console.error("Error loading data:", error);
    });
