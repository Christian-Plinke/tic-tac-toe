let currentShape = 'circle';

let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

function init(){
    render();
}

function restartGame(){
  fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ]
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
          symbol = generateCircleSVG();
        } else if (fields[index] === 'cross') {
          symbol = generateCrossSVG();
        }
        tableHTML += `<td data-index="${index}" onclick="handleClick(this)">${symbol}</td>`;
      }
      tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
  }

function generateCircleSVG() {
  const circleWidth = 70;
  const circleHeight = 70;
  const circleColor = '#00B0EF';

  return `
    <svg width="${circleWidth}" height="${circleHeight}" viewBox="0 0 ${circleWidth} ${circleHeight}" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="${circleWidth / 2}" 
        cy="${circleHeight / 2}" 
        r="30" 
        stroke="${circleColor}" 
        stroke-width="8" 
        fill="none"
        stroke-dasharray="188.4"
        stroke-dashoffset="188.4">
        <animate 
          attributeName="stroke-dashoffset" 
          from="188.4" 
          to="0" 
          dur="0.5s" 
          fill="freeze" />
      </circle>
    </svg>
  `;
}

function generateCrossSVG() {
  const crossSize = 70;
  const crossColor = '#FFC000';
  const center = crossSize / 2;

  return `
    <svg width="${crossSize}" height="${crossSize}" viewBox="0 0 ${crossSize} ${crossSize}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${center}" y1="${center}" x2="${center}" y2="${center}" stroke="${crossColor}" stroke-width="8">
        <animate attributeName="x1" from="${center}" to="10" dur="0.5s" fill="freeze" />
        <animate attributeName="y1" from="${center}" to="10" dur="0.5s" fill="freeze" />
        <animate attributeName="x2" from="${center}" to="60" dur="0.5s" fill="freeze" />
        <animate attributeName="y2" from="${center}" to="60" dur="0.5s" fill="freeze" />
      </line>
      <line x1="${center}" y1="${center}" x2="${center}" y2="${center}" stroke="${crossColor}" stroke-width="8">
        <animate attributeName="x1" from="${center}" to="60" dur="0.5s" fill="freeze" />
        <animate attributeName="y1" from="${center}" to="10" dur="0.5s" fill="freeze" />
        <animate attributeName="x2" from="${center}" to="10" dur="0.5s" fill="freeze" />
        <animate attributeName="y2" from="${center}" to="60" dur="0.5s" fill="freeze" />
      </line>
    </svg>
  `;
}

function handleClick(cell) {
  const index = parseInt(cell.getAttribute('data-index'));
  fields[index] = currentShape;
  cell.innerHTML = currentShape === 'circle' ? generateCircleSVG() : generateCrossSVG();
  cell.onclick = null;
  currentShape = currentShape === 'circle' ? 'cross' : 'circle';

  const winPattern = checkWinner();
  if (winPattern) {
    drawWinningLine(winPattern);
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of winPatterns) {
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return [a, b, c];
    }
  }

  return null;
}

function drawWinningLine(pattern) {
  // Ensure #content is positioned relatively for absolute children
  document.getElementById('content').style.position = 'relative';

  const table = document.querySelector('#content table');
  const tableRect = table.getBoundingClientRect();
  const cellSize = table.offsetWidth / 3;
  const offset = cellSize / 2;

  const getCoordinates = (index) => {
    const x = (index % 3) * cellSize + offset;
    const y = Math.floor(index / 3) * cellSize + offset;
    return [x, y];
  };

  const [x1, y1] = getCoordinates(pattern[0]);
  const [x2, y2] = getCoordinates(pattern[2]);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', table.offsetWidth);
  svg.setAttribute('height', table.offsetHeight);
  svg.style.position = 'absolute';
  svg.style.top = table.offsetTop + 'px';
  svg.style.left = table.offsetLeft + 'px';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '10';
  svg.innerHTML = `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="6" stroke-linecap="round" />
  `;
  document.getElementById('content').appendChild(svg);
}