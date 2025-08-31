// wordsearch-game.js
// Simple word search game for: HAPPY, BIRTHDAY, BEAUTIFUL, GIRL

const wordSearchWords = ["HAPPY", "BIRTHDAY", "BEAUTIFUL", "GIRL"];
const gridSize = 12;
let foundWords = [];
let currentSelection = [];
let mouseDown = false;
let gridRef = [];

function generateWordSearchGrid(words, size) {
  // Create empty grid
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  // Place words horizontally, vertically, or diagonally
  words.forEach((word, idx) => {
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = Math.floor(Math.random() * 3); // 0: horiz, 1: vert, 2: diag
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      if (dir === 0 && col + word.length <= size) { // horizontal
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] && grid[row][col + i] !== word[i]) fits = false;
        }
        if (fits) {
          for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
          placed = true;
        }
      } else if (dir === 1 && row + word.length <= size) { // vertical
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] && grid[row + i][col] !== word[i]) fits = false;
        }
        if (fits) {
          for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
          placed = true;
        }
      } else if (dir === 2 && row + word.length <= size && col + word.length <= size) { // diagonal
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col + i] && grid[row + i][col + i] !== word[i]) fits = false;
        }
        if (fits) {
          for (let i = 0; i < word.length; i++) grid[row + i][col + i] = word[i];
          placed = true;
        }
      }
    }
  });
  // Fill empty cells with random letters
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  return grid;
}

function renderWordSearch() {
  foundWords = [];
  currentSelection = [];
  mouseDown = false;
  const grid = generateWordSearchGrid(wordSearchWords, gridSize);
  gridRef = grid;
  const container = document.getElementById("wordsearch-container");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.className = "wordsearch-table";
  grid.forEach((row, r) => {
    const tr = document.createElement("tr");
    row.forEach((cell, c) => {
      const td = document.createElement("td");
      td.className = "wordsearch-cell";
      td.textContent = cell;
      td.dataset.row = r;
      td.dataset.col = c;
      td.addEventListener("mousedown", (e) => {
        mouseDown = true;
        clearSelection();
        selectCell(td);
      });
      td.addEventListener("mouseenter", (e) => {
        if (mouseDown) selectCell(td);
      });
      td.addEventListener("mouseup", (e) => {
        mouseDown = false;
        checkSelection();
      });
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);
  document.addEventListener("mouseup", () => { mouseDown = false; });
  renderWordList();
}

function renderWordList() {
  const listContainer = document.getElementById("wordsearch-words");
  listContainer.innerHTML = "<strong>Find these words:</strong> ";
  wordSearchWords.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word;
    span.className = "wordsearch-word";
    if (foundWords.includes(word)) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
    } else {
      span.style.textDecoration = "none";
      span.style.opacity = "1";
    }
    listContainer.appendChild(span);
    listContainer.appendChild(document.createTextNode(" "));
  });
}

function selectCell(td) {
  if (!td.classList.contains("selected")) {
    td.classList.add("selected");
    currentSelection.push(td);
  }
}

function clearSelection() {
  currentSelection.forEach(td => td.classList.remove("selected"));
  currentSelection = [];
}

function checkSelection() {
  if (currentSelection.length < 2) {
    clearSelection();
    return;
  }
  // Get selected cells' positions and letters
  const positions = currentSelection.map(td => [parseInt(td.dataset.row), parseInt(td.dataset.col)]);
  const letters = currentSelection.map(td => td.textContent).join("");
  const reversed = letters.split("").reverse().join("");
  // Check if selection matches any word
  let found = null;
  wordSearchWords.forEach(word => {
    if ((letters === word || reversed === word) && !foundWords.includes(word)) {
      found = word;
    }
  });
  if (found) {
    foundWords.push(found);
    // Highlight the correct cells in neon pink
    currentSelection.forEach(td => {
      td.classList.add("found");
      td.style.color = "#ff00c8";
      td.style.textShadow = "0 0 8px #ff00c8, 0 0 4px #fff";
      td.style.background = "#fff";
    });
    renderWordList();
    currentSelection = [];
    return;
  }
  setTimeout(clearSelection, 300);
}

window.renderWordSearch = renderWordSearch;
