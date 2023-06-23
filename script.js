let fields = [null, null, null, null, null, null, null, null, null];

function render() {
  let tableHTML = '<table>';
  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = 'O';
      } else if (fields[index] === 'cross') {
        symbol = 'X';
      }
      tableHTML += `<td>${symbol}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';

  document.getElementById('content').innerHTML = tableHTML;
}
  