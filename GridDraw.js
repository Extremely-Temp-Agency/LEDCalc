const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Array to store multiple grids
const grids = [
  {
    rows: 5,
    cols: 5,
    squareWidth: 128,
    squareHeight: 128,
    x: 0,
    y: 0,
    color1: "#ff0000",
    color2: "#0000ff",
    enableWiring: true,
    portMaximum: 525000,
    enableLabel: true,
    labelSize: 20,
    screenName: "Screen One",
  },
];
let selectedGridIndex = 0; // Start by selecting the first grid
// Function to draw all grids
function drawAllGrids() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

  grids.forEach((grid) => {
    drawGrid(grid);
  });
}

// Function to draw a single grid
function drawGrid(grid) {
  drawSquares(grid);
  drawWiring(grid);
  drawLabels(grid);

  if (grids.indexOf(grid) === selectedGridIndex) {
    const gridWidth = grid.cols * grid.squareWidth;
    const gridHeight = grid.rows * grid.squareHeight;

    ctx.strokeStyle = 'yellow'; // Highlight color
    ctx.lineWidth = 4;
    ctx.strokeRect(grid.x, grid.y, gridWidth, gridHeight);
  }
}

// Draw grid squares
function drawSquares(grid) {
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const x = grid.x + col * grid.squareWidth;
      const y = grid.y + row * grid.squareHeight;

      ctx.fillStyle = (row + col) % 2 === 0 ? grid.color1 : grid.color2;
      ctx.fillRect(x, y, grid.squareWidth, grid.squareHeight);
    }
  }
}

// Draw wiring
function drawWiring(grid) {
  if (!grid.enableWiring) return;

  let currentWireLoad = 0;
  let wireIndex = 1;
  let isBackward = false;

  for (let row = 0; row < grid.rows; row++) {
    const startCol = isBackward ? grid.cols - 1 : 0;
    const endCol = isBackward ? -1 : grid.cols;
    const step = isBackward ? -1 : 1;

    const rowPixelCount = grid.cols * grid.squareWidth * grid.squareHeight;

    for (let col = startCol; col !== endCol; col += step) {
      const x = grid.x + col * grid.squareWidth;
      const y = grid.y + row * grid.squareHeight;
      const tilePixelCount = grid.squareWidth * grid.squareHeight;

      if (col + step !== endCol) {
        drawArrow(
          ctx,
          x + grid.squareWidth / 2,
          y + grid.squareHeight / 2,
          x + grid.squareWidth / 2 + step * grid.squareWidth,
          y + grid.squareHeight / 2,
          Math.min(grid.squareWidth, grid.squareHeight)
        );
      }

      if (currentWireLoad === 0) {
        drawCircleWithText(
          ctx,
          x + grid.squareWidth / 2,
          y + grid.squareHeight / 2,
          Math.min(grid.squareWidth, grid.squareHeight) / 4,
          `${wireIndex}`
        );
      }

      currentWireLoad += tilePixelCount;

      if (col === endCol - step) {
        if (currentWireLoad + rowPixelCount <= grid.portMaximum && row + 1 < grid.rows) {
          drawArrow(
            ctx,
            x + grid.squareWidth / 2,
            y + grid.squareHeight / 2,
            x + grid.squareWidth / 2,
            y + grid.squareHeight + grid.squareHeight / 2,
            Math.min(grid.squareWidth, grid.squareHeight)
          );
          isBackward = !isBackward;
        } else {
          drawCircleWithText(
            ctx,
            x + grid.squareWidth / 2,
            y + grid.squareHeight / 2,
            Math.min(grid.squareWidth, grid.squareHeight) / 4,
            `${wireIndex}b`
          );
          currentWireLoad = 0;
          wireIndex++;
          isBackward = false;
        }
      }
    }
  }
}
function drawArrow(ctx, fromX, fromY, toX, toY, tileSize) {
  const arrowHeadSize = tileSize / 6; // Dynamically set arrowhead size (1/6th of the tile size)
  const dx = toX - fromX; // Delta X
  const dy = toY - fromY; // Delta Y
  const angle = Math.atan2(dy, dx); // Angle of the arrow

  // Draw the main line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = "#ffffff"; // Arrow color
  ctx.lineWidth = tileSize / 40; // Line width dynamically set to 1/10th of the tile size

  ctx.stroke();
}

// Helper function to draw a circle with text
function drawCircleWithText(ctx, centerX, centerY, radius, text) {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = `${radius * 1.5}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, centerY);
}


// Draw grid labels
function drawLabels(grid) {
  if (!grid.enableLabel) return;

  const gridWidth = grid.cols * grid.squareWidth;
  const gridHeight = grid.rows * grid.squareHeight;

  const centerX = grid.x + gridWidth / 2;
  const centerY = grid.y + gridHeight / 2;

  ctx.font = `${grid.labelSize}px Arial`;
  const textWidth = Math.max(
    ctx.measureText(grid.screenName).width,
    ctx.measureText(`${grid.cols * grid.squareWidth} x ${grid.rows * grid.squareHeight}`).width
  );
  const textHeight = grid.labelSize * 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(
    centerX - textWidth / 2 - 10,
    centerY - textHeight / 2 - 10,
    textWidth + 20,
    textHeight + 20
  );

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(grid.screenName, centerX, centerY - grid.labelSize / 2);
  ctx.fillText(
    `${grid.cols * grid.squareWidth} x ${grid.rows * grid.squareHeight}`,
    centerX,
    centerY + grid.labelSize / 2
  );
}

// Add a new grid
function addNewGrid() {
  const newGrid = {
    rows: 5,
    cols: 5,
    squareWidth: 128,
    squareHeight: 128,
    x: grids.length * 200,
    y: grids.length * 200,
    color1: "#00ff00",
    color2: "#ff00ff",
    enableWiring: true,
    portMaximum: 525000,
    enableLabel: true,
    labelSize: 20,
    screenName: `Screen ${grids.length + 1}`,
  };

  grids.push(newGrid);
  drawAllGrids();
}

// Update the selected grid's settings
function updateGridSettings() {
  const selectedGrid = grids[selectedGridIndex]; // Get the currently selected grid
  selectedGrid.rows = parseInt(document.getElementById('rows').value);
  selectedGrid.cols = parseInt(document.getElementById('cols').value);
  selectedGrid.squareWidth = parseInt(document.getElementById('squareWidth').value);
  selectedGrid.squareHeight = parseInt(document.getElementById('squareHeight').value);
  selectedGrid.color1 = document.getElementById('color1').value;
  selectedGrid.color2 = document.getElementById('color2').value;
  selectedGrid.enableWiring = document.getElementById('enableWiring').checked;
  selectedGrid.portMaximum = parseInt(document.getElementById('portMaximum').value);
  selectedGrid.screenName = document.getElementById('screenName').value;
  selectedGrid.enableLabel = document.getElementById('enableLabel').checked;

  drawAllGrids(); // Redraw everything
}

// Attach event listeners
document.getElementById("addScreenButton").addEventListener("click", addNewGrid);

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Find which grid was clicked
  grids.forEach((grid, index) => {
    const gridWidth = grid.cols * grid.squareWidth;
    const gridHeight = grid.rows * grid.squareHeight;

    if (
      mouseX >= grid.x &&
      mouseX <= grid.x + gridWidth &&
      mouseY >= grid.y &&
      mouseY <= grid.y + gridHeight
    ) {
      selectedGridIndex = index; // Update the selected grid index
      updateInputsForSelectedGrid(); // Update input fields to reflect this grid
      drawAllGrids(); // Redraw all grids with updated highlighting
    }
  });
});

function updateInputsForSelectedGrid() {
  const selectedGrid = grids[selectedGridIndex];

  document.getElementById('rows').value = selectedGrid.rows;
  document.getElementById('cols').value = selectedGrid.cols;
  document.getElementById('squareWidth').value = selectedGrid.squareWidth;
  document.getElementById('squareHeight').value = selectedGrid.squareHeight;
  document.getElementById('color1').value = selectedGrid.color1;
  document.getElementById('color2').value = selectedGrid.color2;
  document.getElementById('enableWiring').checked = selectedGrid.enableWiring;
  document.getElementById('portMaximum').value = selectedGrid.portMaximum;
}


// Initial draw
drawAllGrids();
