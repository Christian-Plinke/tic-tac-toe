let fields = [
    null,
    'circle',
    null,
    'cross',
    null,
    null,
    null,
    null,
    null
];

function init(){
    render();
}

function render() {
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < 3; j++) {
        let index = i * 3 + j;
        let symbol = '';
        if (fields[index] === 'circle') {
          symbol = 'o';
        } else if (fields[index] === 'cross') {
          symbol = 'x';
        }
        tableHTML += `<td>${symbol}</td>`;
      }
      tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
  }