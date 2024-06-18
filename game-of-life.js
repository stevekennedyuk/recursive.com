// Get the canvas element and buttons from the HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const shapeSelect = document.getElementById('shapeSelect');

// Set the size of each cell in pixels
const cellSize = 10;

// Calculate the number of cells that fit in the canvas
const numCols = canvas.width / cellSize;
const numRows = canvas.height / cellSize;

// Create a 2D array to store the game state
let grid = createEmptyGrid();

// Game loop variables
let animationId = null;
let isRunning = false;
let isDrawing = false;

// Event listeners
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
shapeSelect.addEventListener('change', handleShapeChange);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Initialize the grid with a clear state
initializeGrid();

// Main game loop
function gameLoop() {
    // Draw the grid
    drawGrid();

    // Calculate the next state of the grid
    const nextGrid = calculateNextGrid();

    // Update the grid with the new state
    grid = nextGrid;

    // Request the next animation frame
    animationId = requestAnimationFrame(gameLoop);
}

// Start the game loop
function startGame() {
    if (!isRunning) {
        isRunning = true;
        isDrawing = false; // Disable drawing when the game is running
        startButton.disabled = true;
        stopButton.disabled = false;
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Stop the game loop
function stopGame() {
    if (isRunning) {
        isRunning = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        cancelAnimationFrame(animationId);
    }
}

// Create an empty grid
function createEmptyGrid() {
    const grid = [];
    for (let row = 0; row < numRows; row++) {
        grid[row] = [];
        for (let col = 0; col < numCols; col++) {
            grid[row][col] = false;
        }
    }
    return grid;
}

// Initialize the grid with a clear state
function initializeGrid() {
    grid = createEmptyGrid();
}

// Draw the grid on the canvas
function drawGrid() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each cell
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            if (grid[row][col]) {
                ctx.fillRect(x, y, cellSize, cellSize);
            } else {
                ctx.clearRect(x, y, cellSize, cellSize);
            }
        }
    }
}

// Calculate the next state of the grid based on the Game of Life rules
function calculateNextGrid() {
    const nextGrid = createEmptyGrid();

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const numNeighbors = countNeighbors(row, col);
            if (grid[row][col]) {
                // Any live cell with fewer than two live neighbors dies
                // Any live cell with two or three live neighbors lives on
                // Any live cell with more than three live neighbors dies
                if (numNeighbors === 2 || numNeighbors === 3) {
                    nextGrid[row][col] = true;
                }
            } else {
                // Any dead cell with exactly three live neighbors becomes a live cell
                if (numNeighbors === 3) {
                    nextGrid[row][col] = true;
                }
            }
        }
    }

    return nextGrid;
}

// Count the number of live neighbors for a given cell
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue; // Skip the current cell
            }
            const neighborRow = (row + i + numRows) % numRows;
            const neighborCol = (col + j + numCols) % numCols;
            if (grid[neighborRow][neighborCol]) {
                count++;
            }
        }
    }
    return count;
}

// Handle shape selection
function handleShapeChange() {
    const shape = shapeSelect.value;
    initializeGrid();

    switch (shape) {
        case 'draw':
            isDrawing = true;
            break;
        case 'glider':
            grid[1][2] = true;
            grid[2][3] = true;
            grid[3][1] = true;
            grid[3][2] = true;
            grid[3][3] = true;
            break;
        case 'blinker':
            grid[5][5] = true;
            grid[5][6] = true;
            grid[5][7] = true;
            break;
        case 'toad':
            grid[5][6] = true;
            grid[6][5] = true;
            grid[6][6] = true;
            grid[6][7] = true;
            grid[7][7] = true;
            grid[7][8] = true;
            grid[8][9] = true;
            break;
    }
    drawGrid();
}

// Start drawing on the grid
function startDrawing(e) {
    if (!isRunning) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        grid[y][x] = true;
        drawGrid();
    }
}

// Draw on the grid
function draw(e) {
    if (!isRunning && isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        grid[y][x] = true;
        drawGrid();
    }
}

// Stop drawing on the grid
function stopDrawing() {
    isDrawing = false;
}
