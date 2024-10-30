// script.js

const wordlist = [
    'Projection', 'ESRI', 'Layer', 'Metadata', 'Attributes', 
    'Geodatabase', 'Buffer', 'Raster', 'Vector', 'Geo-reference', 
    'Demographics', 'Remote-sensing', 'EGIS', 'Vertex', 'Union', 
    'Legend', 'Centroid',  
    'Latitude', 'Longitude', 'Pixel', 'Annotations', 'DEM', 'Parcel', 
     'AGOL', 'ArcGIS Pro', 
  ];
  
  // Function to shuffle the word list
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  // Shuffle the word list and select the first 25 words
  let bingoWords = [];
  
  function generateBingoWords() {
    const shuffledWords = shuffle([...wordlist]);
    bingoWords = shuffledWords.slice(0, 25);
  }
  
  // Select the bingo grid container
  const bingoGrid = document.getElementById('bingo-grid');
  
  // Track marked cells
  let markedCells = [];
  
  // Function to create the bingo grid
  function createBingoGrid() {
    console.log('createBingoGrid called');
    bingoGrid.innerHTML = ''; // Clear any existing grid
    markedCells = []; // Reset marked cells
  
    for (let i = 0; i < 25; i++) {
      const cell = document.createElement('div');
      cell.classList.add('bingo-cell');
      cell.dataset.index = i; // Store index
      cell.tabIndex = 0; // Make cell focusable
  
      if (i === 12) { // Center cell for a 5x5 grid
        cell.textContent = 'FREE';
        cell.classList.add('marked');
        markedCells.push(i);
      } else {
        cell.textContent = bingoWords[i];
      }
  
      bingoGrid.appendChild(cell);
    }
  }
  
  // Function to handle cell clicks
  function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);
  
    // Toggle 'marked' class
    cell.classList.toggle('marked');
  
    // Update the markedCells array
    if (cell.classList.contains('marked')) {
      if (!markedCells.includes(index)) {
        markedCells.push(index);
      }
    } else {
      markedCells = markedCells.filter(i => i !== index);
    }
  
    // Check for bingo
    checkForBingo();
  }
  
  // Function to add event listeners to all cells
  function addCellEventListeners() {
    console.log('addCellEventListeners called');
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleCellClick(event);
        }
      });
    });
  }
  
  // All possible winning combinations
  const winningCombinations = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24],
    // Columns
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],
    // Diagonals
    [0,6,12,18,24],
    [4,8,12,16,20]
  ];
  
  // Function to check for bingo
  function checkForBingo() {
    for (let combination of winningCombinations) {
      if (combination.every(index => markedCells.includes(index))) {
        // Bingo achieved
        displayBingoMessage();
        highlightWinningCombination(combination);
        disableAllCells();
        break;
      }
    }
  }
  
  // Function to display bingo message
  function displayBingoMessage() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = 'Bingo! You won! Please bring it up to be verified and claim your prize!';
    messageContainer.classList.add('bingo-message');
  }
  
  // Function to highlight winning cells
  function highlightWinningCombination(combination) {
    combination.forEach(index => {
      const cell = document.querySelector(`.bingo-cell[data-index='${index}']`);
      cell.classList.add('winning-cell');
    });
  }
  
  // Function to disable all cells
  function disableAllCells() {
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
      cell.removeEventListener('click', handleCellClick);
      cell.removeEventListener('keydown', handleCellClick);
    });
  }
  
  // Function to reset the game
  function resetGame() {
    // Clear message
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = '';
    messageContainer.classList.remove('bingo-message');
  
    // Generate new words and grid
    generateBingoWords();
    createBingoGrid();
    addCellEventListeners();
  }
  
  // Initialize the game
  generateBingoWords();  
  createBingoGrid();
  addCellEventListeners();
  
  // Add event listener to the reset button
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetGame);
  
  // Add event listener to the new game button
  const newGameButton = document.getElementById('new-game');
  newGameButton.addEventListener('click', resetGame);
