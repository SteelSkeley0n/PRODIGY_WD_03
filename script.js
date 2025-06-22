const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const aiToggle = document.getElementById("ai-toggle");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
const drawScore = document.getElementById("draw-score");
const clickSound = document.getElementById("click-sound");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function playSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function updateStatus(message) {
  statusText.textContent = message;
}

function saveScore(winner) {
  if (winner === "X") {
    localStorage.xWins = +localStorage.xWins + 1 || 1;
  } else if (winner === "O") {
    localStorage.oWins = +localStorage.oWins + 1 || 1;
  } else {
    localStorage.draws = +localStorage.draws + 1 || 1;
  }
  updateScores();
}

function updateScores() {
  xScore.textContent = localStorage.xWins || 0;
  oScore.textContent = localStorage.oWins || 0;
  drawScore.textContent = localStorage.draws || 0;
}

function checkResult() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      updateStatus(`Player ${currentPlayer} wins!`);
      saveScore(currentPlayer);
      return true;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    updateStatus("It's a draw!");
    saveScore("draw");
    return true;
  }

  return false;
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function aiMove() {
  const empty = board.map((val, idx) => val === "" ? idx : null).filter(x => x !== null);
  const random = empty[Math.floor(Math.random() * empty.length)];
  if (random != null) {
    board[random] = "O";
    cells[random].textContent = "O";
    playSound();
    if (!checkResult()) switchPlayer();
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  playSound();

  if (!checkResult()) {
    switchPlayer();
    if (aiToggle.checked && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach(cell => cell.textContent = "");
  updateStatus("Player X's turn");
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
updateScores();
