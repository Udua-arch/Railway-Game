// Selecting HTML elements
const rulesButton = document.querySelector("#rules");
const menuScreen = document.querySelector("#menu-container");
const rulesPopup = document.querySelector("#rules-window");
const backToMenuButton = document.querySelector("#back-to-menu");
const gameCanvas = document.querySelector("#game-board");
const ctx = gameCanvas.getContext("2d");

let selectedGridSize = null; 

const notificationBox = document.querySelector("#notification-box");

function showNotification(message, type = "error") {
    notificationBox.innerText = message;
    notificationBox.style.display = "block";
    notificationBox.style.background = type === "success" ? "#4CAF50" : "#f44336";
    
    setTimeout(() => {
        notificationBox.style.display = "none";
    }, 2000);
}


function transitionScreens() {
    const splash = document.querySelector('#splash');
    const menu = document.querySelector('#menu');

    // Start fade-out for the splash screen
    splash.classList.add('hidden');

    

    setTimeout(() => {
        splash.style.display = 'none'; 
        menu.classList.remove('hidden'); 
    }, 1500); 
}


setTimeout(transitionScreens, 1000); 


function showRules() {
    const popup = document.querySelector('#rules-window');
    const backdrop = document.querySelector('#popup-backdrop');

    popup.style.display = 'block'; 
    backdrop.style.display = 'block'; 
}


function closeRules() {
    const popup = document.querySelector('#rules-window');
    const backdrop = document.querySelector('#popup-backdrop');

    popup.style.display = 'none'; 
    backdrop.style.display = 'none'; 

}


function selectDifficulty(gridSize) {
    const easyButton = document.querySelector("#easy-button");
    const hardButton = document.querySelector("#hard-button");

    selectedGridSize = gridSize;

 
    easyButton.classList.remove("selected");
    hardButton.classList.remove("selected");

    
    const targetButton = gridSize === 5 ? easyButton : gridSize === 7 ? hardButton : null;

    if (targetButton) {
        targetButton.classList.add("selected");
    }
}


function closeGame() {
    const gamePopup = document.querySelector("#game-popup");

    if (gamePopup) {
        gamePopup.style.display = "none";
    }

    // Stop the timer
    stopTimer();

    const elapsedTimeDisplay = document.querySelector("#elapsed-time");
    if (elapsedTimeDisplay) {
        elapsedTimeDisplay.textContent = "00:00";
    }
    
    // Reset selected rail
    selectedRailType = null;
}

function clearBoard() {
    if (!placedRails || !rotationMap) return;
    
    // Clear all placed rails
    for (let row = 0; row < placedRails.length; row++) {
        for (let col = 0; col < placedRails[row].length; col++) {
            placedRails[row][col] = null;
            rotationMap[row][col] = 0;
        }
    }
    
    // Redraw the grid
    drawGrid(selectedGridSize);
    
    showNotification("Board cleared!", "success");
}


// Level maps - converted from images
// E = empty, M = mountain, B = bridge, O = oasis
const easyLevels = [
    // Level E1
    [
        ["empty", "mountain", "empty", "empty", "oasis"],
        ["empty", "empty", "empty", "bridge", "oasis"],
        ["bridge", "empty", "mountain", "empty", "empty"],
        ["empty", "empty", "empty", "oasis", "empty"],
        ["empty", "empty", "mountain", "empty", "empty"]
    ],
    // Level E2
    [
        ["empty", "empty", "bridge", "empty", "empty"],
        ["mountain", "empty", "empty", "empty", "oasis"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["oasis", "empty", "empty", "empty", "mountain"],
        ["empty", "empty", "bridge", "empty", "empty"]
    ],
    // Level E3
    [
        ["oasis", "empty", "empty", "empty", "mountain"],
        ["empty", "empty", "bridge", "empty", "empty"],
        ["empty", "bridge", "empty", "bridge", "empty"],
        ["empty", "empty", "mountain", "empty", "empty"],
        ["mountain", "empty", "empty", "empty", "oasis"]
    ],
    // Level E4
    [
        ["empty", "empty", "empty", "empty", "empty"],
        ["empty", "mountain", "oasis", "mountain", "empty"],
        ["empty", "bridge", "empty", "bridge", "empty"],
        ["empty", "mountain", "oasis", "mountain", "empty"],
        ["empty", "empty", "empty", "empty", "empty"]
    ],
    // Level E5
    [
        ["mountain", "empty", "oasis", "empty", "bridge"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["oasis", "empty", "empty", "empty", "oasis"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["bridge", "empty", "oasis", "empty", "mountain"]
    ]
];

const hardLevels = [
    // Level D1
    [
        ["empty", "mountain", "oasis", "oasis", "empty", "bridge", "empty"],
        ["bridge", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "bridge", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "mountain", "empty", "empty", "empty"],
        ["mountain", "empty", "mountain", "empty", "bridge", "empty", "oasis"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "bridge", "empty", "empty", "empty"]
    ],
    // Level D2
    [
        ["empty", "empty", "bridge", "empty", "empty", "mountain", "empty"],
        ["empty", "mountain", "empty", "empty", "oasis", "empty", "empty"],
        ["bridge", "empty", "empty", "empty", "empty", "empty", "bridge"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["bridge", "empty", "empty", "empty", "empty", "empty", "bridge"],
        ["empty", "empty", "oasis", "empty", "empty", "mountain", "empty"],
        ["empty", "mountain", "empty", "empty", "bridge", "empty", "empty"]
    ],
    // Level D3
    [
        ["oasis", "empty", "empty", "bridge", "empty", "empty", "mountain"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "mountain", "empty", "bridge", "empty", "empty"],
        ["bridge", "empty", "empty", "empty", "empty", "empty", "oasis"],
        ["empty", "empty", "bridge", "empty", "mountain", "empty", "empty"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["mountain", "empty", "empty", "bridge", "empty", "empty", "oasis"]
    ],
    // Level D4
    [
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "mountain", "bridge", "oasis", "bridge", "mountain", "empty"],
        ["empty", "bridge", "empty", "empty", "empty", "bridge", "empty"],
        ["empty", "oasis", "empty", "empty", "empty", "oasis", "empty"],
        ["empty", "bridge", "empty", "empty", "empty", "bridge", "empty"],
        ["empty", "mountain", "bridge", "oasis", "bridge", "mountain", "empty"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
    ],
    // Level D5
    [
        ["mountain", "empty", "empty", "oasis", "empty", "empty", "bridge"],
        ["empty", "empty", "bridge", "empty", "mountain", "empty", "empty"],
        ["empty", "bridge", "empty", "empty", "empty", "oasis", "empty"],
        ["oasis", "empty", "empty", "empty", "empty", "empty", "mountain"],
        ["empty", "oasis", "empty", "empty", "empty", "bridge", "empty"],
        ["empty", "empty", "mountain", "empty", "bridge", "empty", "empty"],
        ["bridge", "empty", "empty", "oasis", "empty", "empty", "mountain"]
    ]
];

// Game state
let currentMap;
let placedRails; // Stores placed rail types
let rotationMap; // Stores rotation angles (0, 90, 180, 270)
let currentLevel = 0;


let timerInterval = null;
let elapsedTime = 0;


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}


function startTimer() {
    elapsedTime = 0;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        elapsedTime++; 
        const formattedTime = formatTime(elapsedTime);

        const elapsedTimeDisplay = document.querySelector("#elapsed-time");
        if (elapsedTimeDisplay) {
            elapsedTimeDisplay.textContent = formattedTime;
        }
    }, 1000);
}


function stopTimer() {
    clearInterval(timerInterval);
}


function startGame() {
    const errorMessage = document.querySelector("#error-message");

    errorMessage.innerText = "";
    errorMessage.classList.add("hidden");

    if (!selectedGridSize) {
        errorMessage.innerText = "Please select a difficulty level!";
        errorMessage.classList.remove("hidden");
        return;
    }

    const playerName = document.querySelector("#player-name").value.trim();
    if (!playerName) {
        errorMessage.innerText = "Please enter your name!";
        errorMessage.classList.remove("hidden");
        return;
    }

    const playerNameDisplay = document.querySelector("#player-name-display");
    playerNameDisplay.textContent = playerName; 

    // Select random level from appropriate difficulty
    const levels = selectedGridSize === 5 ? easyLevels : hardLevels;
    currentLevel = Math.floor(Math.random() * levels.length);
    
    // Deep copy the terrain map
    currentMap = JSON.parse(JSON.stringify(levels[currentLevel]));

    // Initialize game state
    placedRails = [];
    rotationMap = [];
    for (let row = 0; row < selectedGridSize; row++) {
        placedRails.push(new Array(selectedGridSize).fill(null));
        rotationMap.push(new Array(selectedGridSize).fill(0));
    }

    console.log("Starting game with level:", currentLevel, "map:", currentMap);

    showGame(selectedGridSize);
    startTimer();
}

const images = {
    "empty": new Image(),
    "oasis": new Image(),
    "mountain": new Image(),
    "mountain_rail": new Image(),
    "straight_rail": new Image(),
    "bridge": new Image(),
    "bridge_rail": new Image(),
    "curve_rail": new Image()
};

// Set the correct path for each image
images["empty"].src = "empty.png";
images["oasis"].src = "oasis.png";
images["mountain"].src = "mountain.png";
images["mountain_rail"].src = "mountain_rail.png";
images["straight_rail"].src = "straight_rail.png";
images["bridge"].src = "bridge.png";
images["bridge_rail"].src = "bridge_rail.png";
images["curve_rail"].src = "curve_rail.png";

// Rail connection data - which sides connect for each rail type
// 0=top, 1=right, 2=bottom, 3=left
const railConnections = {
    "straight_rail": [[0, 2], [1, 3]], // vertical or horizontal
    "curve_rail": [[0, 1], [1, 2], [2, 3], [3, 0]], // 4 rotations
    "bridge_rail": [[0, 2], [1, 3]], // same as straight
    "mountain_rail": [[0, 2], [1, 3]] // same as straight
};

function drawCell(row, col, gridSize) {
    const cellSize = gameCanvas.width / gridSize;
    const terrain = currentMap[row][col];
    const placedRail = placedRails[row][col];
    const rotation = rotationMap[row][col];

    ctx.save();
    
    // Clear cell
    ctx.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
    
    // Draw terrain
    if (images[terrain]) {
        ctx.drawImage(images[terrain], col * cellSize, row * cellSize, cellSize, cellSize);
    }
    
    // Draw placed rail with rotation
    if (placedRail && images[placedRail]) {
        ctx.translate((col + 0.5) * cellSize, (row + 0.5) * cellSize);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(images[placedRail], -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    }
    
    ctx.restore();
    
    // Draw grid lines
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 1;
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function drawGrid(gridSize) {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            drawCell(row, col, gridSize);
        }
    }
}

function handleCellClick(row, col, gridSize) {
    const terrain = currentMap[row][col];
    
    // Can't place on oasis
    if (terrain === "oasis") {
        showNotification("Cannot place rails on an oasis!");
        return;
    }
    
    if (!selectedRailType) {
        showNotification("Please select a rail type first!");
        return;
    }
    
    // Check if rail type matches terrain
    if (terrain === "mountain" && selectedRailType !== "mountain_rail") {
        showNotification("Only mountain rails can be placed on mountains!");
        return;
    }
    
    if (terrain === "bridge" && selectedRailType !== "bridge_rail") {
        showNotification("Only bridge rails can be placed on bridges!");
        return;
    }
    
    if (terrain === "empty" && (selectedRailType === "mountain_rail" || selectedRailType === "bridge_rail")) {
        showNotification("This rail type can only be placed on specific terrain!");
        return;
    }
    
    // Place or remove rail
    if (placedRails[row][col] === selectedRailType) {
        // Remove if same type clicked again
        placedRails[row][col] = null;
        rotationMap[row][col] = 0;
    } else {
        // Place new rail
        placedRails[row][col] = selectedRailType;
        rotationMap[row][col] = 0;
    }
    
    drawCell(row, col, gridSize);
    checkPuzzleCompletion(gridSize);
}

function handleCellRightClick(row, col, gridSize) {
    const placedRail = placedRails[row][col];
    
    if (!placedRail) {
        showNotification("No rail to rotate!");
        return;
    }
    
    // Rotate 90 degrees clockwise
    rotationMap[row][col] = (rotationMap[row][col] + 90) % 360;
    
    drawCell(row, col, gridSize);
    checkPuzzleCompletion(gridSize);
}

// Get rail exits based on type and rotation
function getRailExits(railType, rotation) {
    if (!railType) return [];
    
    const rotationSteps = rotation / 90;
    
    if (railType === "straight_rail" || railType === "bridge_rail" || railType === "mountain_rail") {
        // Straight rails: vertical (0,2) or horizontal (1,3)
        if (rotationSteps % 2 === 0) {
            return [0, 2]; // vertical
        } else {
            return [1, 3]; // horizontal
        }
    } else if (railType === "curve_rail") {
        // Curve rails rotate through all 4 positions
        const baseExits = [0, 1]; // top and right
        return baseExits.map(exit => (exit + rotationSteps) % 4);
    }
    
    return [];
}

// Check if puzzle is complete and valid
function checkPuzzleCompletion(gridSize) {
    // Check if all required cells have rails
    let allRequiredFilled = true;
    let hasAnyRail = false;
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const terrain = currentMap[row][col];
            const rail = placedRails[row][col];
            
            if (rail) hasAnyRail = true;
            
            // Mountains and bridges must have rails
            if ((terrain === "mountain" || terrain === "bridge") && !rail) {
                allRequiredFilled = false;
            }
        }
    }
    
    if (!hasAnyRail || !allRequiredFilled) return;
    
    // Check if all rails form a continuous loop
    if (validateRailLoop(gridSize)) {
        stopTimer();
        showNotification("🎉 Congratulations! Puzzle solved in " + formatTime(elapsedTime) + "!", "success");
    }
}

// Validate that rails form a continuous loop
function validateRailLoop(gridSize) {
    // Find starting cell with a rail
    let startRow = -1, startCol = -1;
    
    for (let row = 0; row < gridSize && startRow === -1; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (placedRails[row][col]) {
                startRow = row;
                startCol = col;
                break;
            }
        }
    }
    
    if (startRow === -1) return false;
    
    // Track visited cells
    const visited = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    let cellCount = 0;
    
    // Count total cells with rails
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (placedRails[row][col]) cellCount++;
        }
    }
    
    // Follow the path
    let currentRow = startRow;
    let currentCol = startCol;
    let previousDir = -1;
    let visitedCount = 0;
    
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // top, right, bottom, left
    
    do {
        if (visited[currentRow][currentCol]) {
            // We've completed a loop - check if we visited all cells
            return visitedCount === cellCount;
        }
        
        visited[currentRow][currentCol] = true;
        visitedCount++;
        
        const rail = placedRails[currentRow][currentCol];
        const rotation = rotationMap[currentRow][currentCol];
        const exits = getRailExits(rail, rotation);
        
        if (exits.length !== 2) return false;
        
        // Find next direction (not the one we came from)
        let nextDir = -1;
        for (const exit of exits) {
            const oppositeDir = (exit + 2) % 4;
            if (oppositeDir !== previousDir) {
                nextDir = exit;
                break;
            }
        }
        
        if (nextDir === -1 && previousDir !== -1) return false;
        if (nextDir === -1) nextDir = exits[0]; // First move
        
        // Move to next cell
        const [dr, dc] = directions[nextDir];
        const nextRow = currentRow + dr;
        const nextCol = currentCol + dc;
        
        // Check bounds
        if (nextRow < 0 || nextRow >= gridSize || nextCol < 0 || nextCol >= gridSize) {
            return false;
        }
        
        // Check if next cell has a rail
        if (!placedRails[nextRow][nextCol]) {
            return false;
        }
        
        // Check if next cell's rail connects back
        const nextRail = placedRails[nextRow][nextCol];
        const nextRotation = rotationMap[nextRow][nextCol];
        const nextExits = getRailExits(nextRail, nextRotation);
        const requiredEntry = (nextDir + 2) % 4;
        
        if (!nextExits.includes(requiredEntry)) {
            return false;
        }
        
        previousDir = nextDir;
        currentRow = nextRow;
        currentCol = nextCol;
        
    } while (currentRow !== startRow || currentCol !== startCol);
    
    return visitedCount === cellCount;
}

function showGame(gridSize) {
    drawGrid(gridSize); 
    document.querySelector("#game-popup").style.display = "block";
    
    // Set up canvas event listeners
    const cellSize = gameCanvas.width / gridSize;
    
    gameCanvas.onclick = function(event) {
        const rect = gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            handleCellClick(row, col, gridSize);
        }
    };
    
    gameCanvas.oncontextmenu = function(event) {
        event.preventDefault();
        
        const rect = gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            handleCellRightClick(row, col, gridSize);
        }
        
        return false;
    };
}

let selectedRailType = null;

function selectRail(railType) {
    selectedRailType = railType;
    
    // Visual feedback - highlight selected rail
    document.querySelectorAll('#rail-selector img').forEach(img => {
        img.style.border = "3px solid #d1e3e1";
    });
    
    const selectedImg = document.querySelector(`#rail-selector img[data-rail="${railType}"]`);
    if (selectedImg) {
        selectedImg.style.border = "3px solid #ff6b6b";
    }
    
    console.log("Selected rail type:", selectedRailType);
}

// Event listeners
document.getElementById('easy-button').addEventListener('click', () => selectDifficulty(5));
document.getElementById('hard-button').addEventListener('click', () => selectDifficulty(7));
document.getElementById('rules').addEventListener('click', showRules);
document.getElementById('start-game-btn').addEventListener('click', startGame);
document.getElementById('back-to-menu').addEventListener('click', closeRules);
document.getElementById('close-game').addEventListener('click', closeGame);
document.getElementById('clear-board').addEventListener('click', clearBoard);

document.querySelectorAll('#rail-selector img').forEach(img => {
    img.addEventListener('click', () => selectRail(img.dataset.rail));
});