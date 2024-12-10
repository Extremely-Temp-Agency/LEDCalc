// Function to download the canvas as a PNG
function downloadCanvasAsPNG() {
    const link = document.createElement('a');
    link.download = 'grid.png'; // Default filename
    link.href = canvas.toDataURL(); // Get the canvas data as a PNG
    link.click();
  }
  
  // Attach the click event to the button
  document.getElementById("downloadButton").addEventListener("click", downloadCanvasAsPNG);
  
  // Zoom feature for the grid
let zoomLevel = 1; // Default zoom level

// Function to apply zoom
function applyZoom(level) {
  zoomLevel = level;

  // Adjust canvas size
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "top left";

  // Optionally, redraw the grid to match the zoom level
  drawGrid();
}

// Handle zoom level changes
function updateZoomLevel(value) {
  applyZoom(parseFloat(value));
}

// Remove the selected grid
function removeSelectedGrid() {
  if (selectedGridIndex !== null && selectedGridIndex >= 0) {
    grids.splice(selectedGridIndex, 1); // Remove the selected grid from the array
    selectedGridIndex = null; // Clear the selection
    drawAllGrids(); // Redraw all grids
  }
}

// Attach event listener to the "Remove Grid" button
document.getElementById("removeGridButton").addEventListener("click", removeSelectedGrid);

// Remove grid with the Delete key
document.addEventListener("keydown", (event) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    removeSelectedGrid(); // Remove the selected grid
  }
});
