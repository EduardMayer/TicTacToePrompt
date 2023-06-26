let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 0; // 0: Spieler 1 (circle), 1: Spieler 2 (cross)
let previousPlayer = 1; // Vorheriger Spieler
let scores = [0, 0]; // Punktzahlen für Spieler 1 (circle) und Spieler 2 (cross)

function render() {
  let tableHTML = '<table>';
  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = generateCircleSVG();
      } else if (fields[index] === 'cross') {
        symbol = generateCrossSVG();
      }
      tableHTML += `<td onclick="handleClick(${index})">${symbol}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';

  document.getElementById('content').innerHTML = tableHTML;
  updateScores();
  updateCurrentPlayer();
}

function handleClick(index) {
  if (fields[index] === null) {
    fields[index] = currentPlayer === 0 ? 'circle' : 'cross';
    const symbol = fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG();
    document.getElementById('content').getElementsByTagName('td')[index].innerHTML = symbol;
    document.getElementById('content').getElementsByTagName('td')[index].onclick = null;
    checkWinner();
    previousPlayer = currentPlayer; // Vorheriger Spieler aktualisieren
    currentPlayer = (currentPlayer + 1) % 2; // Wechsel des aktuellen Spielers
    updateCurrentPlayer();
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
    [0, 4, 8], [2, 4, 6] // Diagonale Reihen
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      // Gewinner gefunden
      const winner = fields[a];
      const player = winner === 'circle' ? 0 : 1;
      scores[player] += 1;
      updateScores();
      drawWinningLine(combination);
      updateResultText(player === 0 ? 'player1' : 'player2');
      setTimeout(function() {
        resetGame(player);
      }, 2500); // Verzögerung von 3 Sekunden (3000 Millisekunden)

      return;
    }
  }

  function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;
  
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
  
    const contentRect = document.getElementById('content').getBoundingClientRect();
  
    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
    disableClicks();
  }

  // Unentschieden
  if (!fields.includes(null)) {
    updateResultText('draw');
    setTimeout(function() {
      resetGame(previousPlayer);
    }, 1500); // Der vorherige Spieler beginnt
  }
}

function resetGame(player) {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = (player + 1) % 2; // Wechsel des Spielers
  render();

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.textContent = '';
  resultContainer.classList.remove('winner-circle', 'winner-cross', 'draw');
  resultContainer.style.visibility = 'hidden';
}

function updateScores() {
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML = `Player 1 (${scores[0]}) - Payer 2 (${scores[1]})`;
}

function updateCurrentPlayer() {
  const currentPlayerElement = document.getElementById('currentPlayer');
  currentPlayerElement.innerHTML = `Current Player ${currentPlayer + 1}`;
  const symbolElement = document.getElementById('symbol');
  symbolElement.innerHTML = currentPlayer === 0 ? generateCircleSVG() : generateCrossSVG();
}

function disableClicks() {
  const cells = document.getElementById('content').getElementsByTagName('td');
  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = null;
  }
}

function updateResultText(result) {
  const resultContainer = document.getElementById('resultContainer');
  let text = '';

  if (result === 'player1') {
    text = 'Player 1 Won!';
    resultContainer.classList.add('winner-circle');
  } else if (result === 'player2') {
    text = 'Player 2 Won!';
    resultContainer.classList.add('winner-cross');
  } else if (result === 'draw') {
    text = 'Draw!';
    resultContainer.classList.add('draw');
  }

  resultContainer.textContent = text;
  resultContainer.style.visibility = 'visible';
}

function generateCircleSVG() {
  const color = '#39FF14';
  const width = 70;
  const height = 70;

  return `<svg width="${width}" height="${height}">
            <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
              <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
            </circle>
          </svg>`;
}


function generateCrossSVG() {
  const color = '#FF6EC7';
  const width = 70;
  const height = 70;

  const svgHtml = `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="0; ${width}" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="${width}; 0" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
    </svg>
  `;

  return svgHtml;
}


