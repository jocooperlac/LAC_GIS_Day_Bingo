const wordlist1 = [
    'Projection', 'Esri', 'Layer', 'Metadata', 'Attributes', 
    'Geo database', 'Buffer', 'Raster', 'Vector', 'Geo- reference', 
    'Demographics', 'Remote- sensing', 'eGIS', 'Vertex', 'Union', 
    'Legend', 'Centroid',  'QGIS', 'Topology', 
    'Latitude', 'Longitude', 'Pixel', 'Annotations', 'DEM', 'Parcel', 
    'AGOL', 'ArcGIS Pro', 'Cartography', 'Symbology', 
];

const wordlist2 = [
    'Surveying', 'Elevation', 'Map', 'Overlay', 'Clipping',
    'Intersection', 'Data Frame', 'Polygons', 'Lines', 'Points',
    'Feature Class', 'Spatial Join', 'Coordinate System', 'Topography',
    'Contours', 'Geodetic', 'Digital Twin', 'Spatial Index',
    'Projection System', 'Imagery', 'Digital Mapping', 'Scaling',
    'Network Analysis', 'Hydrology', 'Slope', 'Aspect', 'Basemap',
    'Orthoimagery', 'Cadastral', 'Modeling',
];

// Keep track of active word list and board state
let currentWordList = wordlist1;
let savedBoards = {
    wordlist1: { words: [], markedCells: [] },
    wordlist2: { words: [], markedCells: [] },
};

// Function to generate bingo words for the active word list
function generateBingoWords() {
    const shuffledWords = shuffle([...currentWordList]);
    bingoWords = shuffledWords.slice(0, 25);
}

// Function to switch between word lists
function switchGameBoard() {
    const currentKey = currentWordList === wordlist1 ? 'wordlist1' : 'wordlist2';
    const nextKey = currentWordList === wordlist1 ? 'wordlist2' : 'wordlist1';

    // Save the current board state
    savedBoards[currentKey] = {
        words: [...bingoWords],
        markedCells: [...markedCells]
    };

    // Load the next word list
    currentWordList = currentWordList === wordlist1 ? wordlist2 : wordlist1;

    // Restore the saved board state if it exists
    const savedState = savedBoards[nextKey];
    if (savedState.words.length > 0) {
        bingoWords = savedState.words;
        markedCells = savedState.markedCells;
    } else {
        // Otherwise, generate a new board
        generateBingoWords();
        markedCells = [];
    }

    // Rebuild the grid with the new or restored words
    createBingoGrid();

    // Apply the marked cells to the grid
    markedCells.forEach(index => {
        const cell = document.querySelector(`.bingo-cell[data-index='${index}']`);
        if (cell) cell.classList.add('marked');
    });

    // Re-add event listeners
    addCellEventListeners();
}

// Update the "Switch Game" button to toggle between boards
const switchGameButton = document.getElementById('switch-game');
switchGameButton.textContent = 'Switch Game Board';
switchGameButton.addEventListener('click', switchGameBoard);

// Initialize the game with the first word list
generateBingoWords();
createBingoGrid();
addCellEventListeners();
