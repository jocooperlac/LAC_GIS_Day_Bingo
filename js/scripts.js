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

// Track marked cells and history
let markedCells = [];
let markedHistory = []; // Stack to keep track of the order of marked cells

// Function to create the bingo grid
function createBingoGrid() {
    console.log('createBingoGrid called');
    bingoGrid.innerHTML = ''; // Clear any existing grid
    markedCells = []; // Reset marked cells
    markedHistory = []; // Reset history

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

    if (cell.classList.contains('marked')) {
        if (!markedCells.includes(index)) {
            markedCells.push(index);
            markedHistory.push(index); // Add to history for undo
        }
    } else {
        markedCells = markedCells.filter(i => i !== index);
        markedHistory = markedHistory.filter(i => i !== index); // Remove from history
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

// Function to undo the last marked cell
function undoLastMark() {
    if (markedHistory.length === 0) return; // No action if nothing to undo

    const lastMarkedIndex = markedHistory.pop(); // Get the last marked cell
    const cell = document.querySelector(`.bingo-cell[data-index='${lastMarkedIndex}']`);
    
    cell.classList.remove('marked'); // Unmark the cell visually
    markedCells = markedCells.filter(i => i !== lastMarkedIndex); // Update markedCells array
}

// Initialize the game
generateBingoWords();  
createBingoGrid();
addCellEventListeners();

// Update the reset button to be the "Undo" button
const undoButton = document.getElementById('reset-button');
undoButton.textContent = 'Undo';
undoButton.removeEventListener('click', resetGame); // Remove reset functionality
undoButton.addEventListener('click', undoLastMark); // Add undo functionality

// Add event listener to the new game button to restart the game
const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', () => {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = ''; // Clear any bingo message
    messageContainer.classList.remove('bingo-message');
    
    generateBingoWords(); // Generate new words
    createBingoGrid(); // Create a new grid
    addCellEventListeners(); // Re-add event listeners
});
