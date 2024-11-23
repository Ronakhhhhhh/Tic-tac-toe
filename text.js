document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const scoreboardP1 = document.getElementById("score-p1");
  const scoreboardP2 = document.getElementById("score-p2");
  const announcement = document.querySelector(".winner-announcement");
  const hintBtn = document.getElementById("hint-btn");
  const resetBtn = document.getElementById("reset-btn");
  const playerVsPlayerBtn = document.getElementById("player-vs-player");
  const playerVsAiBtn = document.getElementById("player-vs-ai");
  const homepage = document.querySelector(".homepage");
  const gameContainer = document.querySelector(".game-container");

  let isPlayerVsAI = false;
  let currentPlayer = "X";
  let board = Array(9).fill(null);
  let score = { X: 0, O: 0 };

  // Winning combinations
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Start game
  function startGame(isAI) {
    isPlayerVsAI = isAI;
    homepage.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    resetGame();
  }

  playerVsPlayerBtn.addEventListener("click", () => startGame(false));
  playerVsAiBtn.addEventListener("click", () => startGame(true));

  // Check for winner
  function checkWinner() {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        announceWinner(currentPlayer, pattern);
        return true;
      }
    }
    if (!board.includes(null)) {
      announceDraw();
      return true;
    }
    return false;
  }

  // Announce winner
  function announceWinner(player, pattern) {
    announcement.textContent = `${player} wins!`;
    score[player] += 10;
    updateScoreboard();
    pattern.forEach(index => cells[index].classList.add("winning-line"));
    setTimeout(resetGame, 2000);
  }

  // Announce draw
  function announceDraw() {
    announcement.textContent = "It's a draw!";
    score.X += 5;
    score.O += 5;
    updateScoreboard();
    setTimeout(resetGame, 2000);
  }

  // Update scoreboard
  function updateScoreboard() {
    scoreboardP1.textContent = score.X;
    scoreboardP2.textContent = score.O;
  }

  // Handle cell click
  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index]) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (isPlayerVsAI && currentPlayer === "O") aiMove();
  }

  // AI move
  function aiMove() {
    const emptyCells = board.map((val, index) => (val === null ? index : null)).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    cells[randomIndex].textContent = "O";
    checkWinner();
    currentPlayer = "X";
  }

  // Hint functionality
  hintBtn.addEventListener("click", () => {
    const emptyCells = board.map((val, index) => (val === null ? index : null)).filter(val => val !== null);
    const hintIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cells[hintIndex].classList.add("hint");
    setTimeout(() => cells[hintIndex].classList.remove("hint"), 1000);
  });

  // Reset game
  function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove("winning