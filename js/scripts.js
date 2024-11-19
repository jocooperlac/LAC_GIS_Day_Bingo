document.addEventListener('DOMContentLoaded', () => {
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

    let currentWordList = wordlist1;
    let savedBoards = {
        wordlist1: { words: [], markedCells: [] },
        wordlist2: { words: [], markedCells: [] },
    };

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    let bingoWords = [];
    function generateBingoWords() {
        const shuffledWords = shuffle([...currentWordList]);
        bingoWords = shuffledWords.slice(0, 25);
    }

    const bingoGrid = document.getElementById('bingo-grid');
    let markedCells = [];
    let markedHistory = [];

    function createBingoGrid() {
        bingoGrid.innerHTML = '';
        markedHistory = [];

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');
            cell.dataset.index = i;

            if (i === 12) {
                cell.textContent = 'FREE';
                cell.classList.add('marked');
                markedCells.push(i);
            } else {
                cell.textContent = bingoWords[i];
            }

            bingoGrid.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.dataset.index);

        cell.classList.toggle('marked');

        if (cell.classList.contains('marked')) {
            if (!markedCells.includes(index)) {
                markedCells.push(index);
                markedHistory.push(index);
            }
        } else {
            markedCells = markedCells.filter(i => i !== index);
            markedHistory = markedHistory.filter(i => i !== index);
        }

        checkForBingo();
    }

    function addCellEventListeners() {
        const cells = document.querySelectorAll('.bingo-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }

    const winningCombinations = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10,11,12,13,14],
        [15,16,17,18,19],
        [20,21,22,23,24],
        [0,5,10,15,20],
        [1,6,11,16,21],
        [2,7,12,17,22],
        [3,8,13,18,23],
        [4,9,14,19,24],
        [0,6,12,18,24],
        [4,8,12,16,20],
    ];

    function checkForBingo() {
        for (let combination of winningCombinations) {
            if (combination.every(index => markedCells.includes(index))) {
                displayBingoMessage();
                highlightWinningCombination(combination);
                break;
            }
        }
    }

    function displayBingoMessage() {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = 'Bingo!';
    }

    function highlightWinningCombination(combination) {
        combination.forEach(index => {
            const cell = document.querySelector(`.bingo-cell[data-index='${index}']`);
            if (cell) cell.classList.add('winning-cell');
        });
    }

    function undoLastMark() {
        if (markedHistory.length === 0) return;

        const lastMarkedIndex = markedHistory.pop();
        const cell = document.querySelector(`.bingo-cell[data-index='${lastMarkedIndex}']`);
        cell.classList.remove('marked');
        markedCells = markedCells.filter(i => i !== lastMarkedIndex);

        checkForBingo();
    }

    function switchGameBoard() {
        const currentKey = currentWordList === wordlist1 ? 'wordlist1' : 'wordlist2';
        const nextKey = currentWordList === wordlist1 ? 'wordlist2' : 'wordlist1';

        savedBoards[currentKey] = { words: [...bingoWords], markedCells: [...markedCells] };

        currentWordList = currentWordList === wordlist1 ? wordlist2 : wordlist1;

        const savedState = savedBoards[nextKey];
        if (savedState.words.length > 0) {
            bingoWords = savedState.words;
            markedCells = savedState.markedCells;
        } else {
            generateBingoWords();
            markedCells = [];
        }

        createBingoGrid();
        markedCells.forEach(index => {
            const cell = document.querySelector(`.bingo-cell[data-index='${index}']`);
            if (cell) cell.classList.add('marked');
        });
        addCellEventListeners();
    }

    const undoButton = document.getElementById('undo-button');
    undoButton.addEventListener('click', undoLastMark);

    const switchGameButton = document.getElementById('switch-game');
    switchGameButton.addEventListener('click', switchGameBoard);

    generateBingoWords();
    createBingoGrid();
    addCellEventListeners();
});
