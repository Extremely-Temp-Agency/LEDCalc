// Variables to track dragging state
let isDragging = false; // Whether the user is dragging
let draggedGrid = null; // The grid currently being dragged
let dragOffset = { x: 0, y: 0 }; // Offset of the mouse click from the top-left corner of the grid
let draggingGridIndex = null; // Index of the grid being dragged
const snapThreshold = 10; // Snap distance in pixels

function getCorrectedMousePositionWithZoom(event) {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    return {
      x: (event.clientX - rect.left) /  zoomLevel, // Adjust for zoom level
      y: (event.clientY - rect.top) / zoomLevel, // Adjust for zoom level
    };
  }
  
// Detect if a grid is clicked
canvas.addEventListener('mousedown', (event) => {
    const mouse = getCorrectedMousePositionWithZoom(event);
  
    let clickedOnGrid = false;
  
    // Check if the click is on any grid
    grids.forEach((grid, index) => {
      const gridWidth = grid.cols * grid.squareWidth;
      const gridHeight = grid.rows * grid.squareHeight;
  
      if (
        mouse.x >= grid.x &&
        mouse.x <= grid.x + gridWidth &&
        mouse.y >= grid.y &&
        mouse.y <= grid.y + gridHeight
      ) {
        draggingGridIndex = index; // Start dragging this grid
        dragOffset.x = mouse.x - grid.x;
        dragOffset.y = mouse.y - grid.y;
        clickedOnGrid = true; // Mark that the click is on a grid
      }
    });
  
    // If the click is not on any grid, remove the highlight
    if (!clickedOnGrid) {
      selectedGridIndex = null; // Clear the highlight
      drawAllGrids(); // Redraw the canvas without highlighting
    }
  });
  
  // Handle mouse movement while dragging
  canvas.addEventListener('mousemove', (event) => {
    if (draggingGridIndex !== null) {
      const mouse = getCorrectedMousePositionWithZoom(event);
  
      const grid = grids[draggingGridIndex];
      const gridWidth = grid.cols * grid.squareWidth;
      const gridHeight = grid.rows * grid.squareHeight;
  
      // Calculate new position considering the zoom level
      let newX = mouse.x - dragOffset.x;
      let newY = mouse.y - dragOffset.y;
  
      // Snap to canvas edges
      if (Math.abs(newX) < snapThreshold) newX = 0;
      if (Math.abs(newY) < snapThreshold) newY = 0;
      if (Math.abs(newX + gridWidth - canvas.width / zoomLevel) < snapThreshold)
        newX = canvas.width / zoomLevel - gridWidth;
      if (Math.abs(newY + gridHeight - canvas.height / zoomLevel) < snapThreshold)
        newY = canvas.height / zoomLevel - gridHeight;
  
      // Snap to other grids
      grids.forEach((otherGrid, index) => {
        if (index !== draggingGridIndex) {
          const otherWidth = otherGrid.cols * otherGrid.squareWidth;
          const otherHeight = otherGrid.rows * otherGrid.squareHeight;
  
          // Snap to other grid edges
          if (Math.abs(newX - (otherGrid.x + otherWidth)) < snapThreshold)
            newX = otherGrid.x + otherWidth;
          if (Math.abs(newX + gridWidth - otherGrid.x) < snapThreshold)
            newX = otherGrid.x - gridWidth;
          if (Math.abs(newY - (otherGrid.y + otherHeight)) < snapThreshold)
            newY = otherGrid.y + otherHeight;
          if (Math.abs(newY + gridHeight - otherGrid.y) < snapThreshold)
            newY = otherGrid.y - gridHeight;
        }
      });
  
      // Update grid position
      grid.x = newX;
      grid.y = newY;
  
      drawAllGrids(); // Redraw all grids during dragging
    }
  });
  
  
  // Stop dragging
  canvas.addEventListener('mouseup', () => {
    draggingGridIndex = null; // Stop dragging
  });