// script.js
const board = document.getElementById("board");
const statusDiv = document.getElementById("status");
const resetBtn = document.getElementById("resetGame");
const coinDisplay = document.getElementById("coinCount");
const resetCoinsBtn = document.getElementById("resetCoins");
const modal = document.getElementById("instructionsModal");
const closeModalBtn = document.getElementById("closeModal");
const instructionsBtn = document.getElementById("instructionsBtn");
const mode2p = document.getElementById("mode2p");
const modeAI = document.getElementById("modeAI");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const toggleThemeBtn = document.getElementById("toggleTheme");
const howToPlayText = document.getElementById("howToPlayText");

let currentPlayer = "X";
let gameOver = false;
let gameMode = "2-player";
let coins = parseInt(localStorage.getItem("tic-tac-toe-coins")) || 0;
let cells = Array(9).fill("");
let winCells = [];
let isDarkMode = localStorage.getItem("dark-mode") === "true";

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const clickSound = new Audio("click.mp3");
const winSound = new Audio("win.mp3");
const drawSound = new Audio("draw.mp3");

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.textContent = cell;
    if (winCells.includes(index)) div.classList.add("win");
    div.addEventListener("click", () => makeMove(index));
    board.appendChild(div);
  });
  coinDisplay.textContent = coins;
}

function makeMove(index) {
  if (cells[index] || gameOver) return;
  clickSound.play();
  cells[index] = currentPlayer;
  checkWinner();
  if (!gameOver) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
    if (gameMode === "vs-computer" && currentPlayer === "O") setTimeout(computerMove, 500);
  }
  renderBoard();
}

function checkWinner() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      winCells = combo;
      gameOver = true;
      if (cells[a] === "X" && gameMode === "vs-computer") coins += 10;
      localStorage.setItem("tic-tac-toe-coins", coins);
      winSound.play();
      updateStatus();
      return;
    }
  }
  if (!cells.includes("")) {
    gameOver = true;
    drawSound.play();
    updateStatus();
  }
}

function updateStatus() {
  if (gameOver) {
    if (winCells.length > 0) {
      const winner = cells[winCells[0]];
      const name = winner === "X" ? playerXInput.value : playerOInput.value;
      statusDiv.textContent = `${name} wins! 🎉`;
    } else {
      statusDiv.textContent = "It's a draw! 🤝";
    }
  } else {
    const name = currentPlayer === "X" ? playerXInput.value : playerOInput.value;
    statusDiv.textContent = `${name}'s turn`;
  }
}

function resetGame() {
  cells = Array(9).fill("");
  winCells = [];
  currentPlayer = "X";
  gameOver = false;
  renderBoard();
  updateStatus();
}

function resetCoins() {
  coins = 0;
  localStorage.setItem("tic-tac-toe-coins", "0");
  coinDisplay.textContent = 0;
}

function computerMove() {
  let move = -1;
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (cells[a] === "O" && cells[b] === "O" && !cells[c]) move = c;
    if (cells[a] === "O" && cells[c] === "O" && !cells[b]) move = b;
    if (cells[b] === "O" && cells[c] === "O" && !cells[a]) move = a;
  }
  if (move === -1) {
    for (let combo of winCombos) {
      const [a, b, c] = combo;
      if (cells[a] === "X" && cells[b] === "X" && !cells[c]) move = c;
      if (cells[a] === "X" && cells[c] === "X" && !cells[b]) move = b;
      if (cells[b] === "X" && cells[c] === "X" && !cells[a]) move = a;
    }
  }
  if (move === -1) {
    const empty = cells.map((v, i) => v === "" ? i : -1).filter(i => i !== -1);
    if (empty.length > 0) move = empty[Math.floor(Math.random() * empty.length)];
  }
  if (move !== -1) makeMove(move);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
  localStorage.setItem("dark-mode", isDarkMode);
  toggleThemeBtn.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
}

function updateHowToPlay() {
  howToPlayText.innerHTML = `
    <h2>How to Play Tic Tac Toe</h2>
    <p><strong>🎯 Objective</strong><br>
    Be the first to get 3 of your marks in a row (horizontally, vertically, or diagonally).</p>
    <p><strong>🎮 Game Modes</strong><br>
    2 Players: Play against a friend<br>
    vs Computer: Challenge the AI</p>
    <p><strong>💰 Coin System</strong><br>
    Win a game to earn 10 coins<br>
    Coins are saved between sessions<br>
    You can reset your coins if needed</p>
    <p><strong>🏆 Tips</strong><br>
    Try to create two winning opportunities at once<br>
    Watch out for the computer's moves<br>
    The center square is the most strategic starting position</p>
    <p>Got it!</p>
  `;
}

resetBtn.addEventListener("click", resetGame);
resetCoinsBtn.addEventListener("click", resetCoins);
instructionsBtn.addEventListener("click", () => modal.style.display = "flex");
closeModalBtn.addEventListener("click", () => modal.style.display = "none");
mode2p.addEventListener("click", () => {
  gameMode = "2-player";
  playerXInput.value = "Player X";
  playerOInput.value = "Player O";
  resetGame();
});
modeAI.addEventListener("click", () => {
  gameMode = "vs-computer";
  playerXInput.value = "You";
  playerOInput.value = "Computer";
  resetGame();
});
toggleThemeBtn.addEventListener("click", toggleTheme);

// Initialize
document.body.classList.toggle("dark-mode", isDarkMode);
toggleThemeBtn.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
renderBoard();
updateStatus();
updateHowToPlay();
