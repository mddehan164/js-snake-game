// creating the blocks.
const board = document.getElementById("board");

const blockWidth = 30;
const blockHeight = 30;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let blocks = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerHTML = `${row},${col}`;
    blocks[`${row},${col}`] = block;
  }
}

// render the snake

let snake = [
  { row: 5, col: 6 },
  { row: 5, col: 7 },
  { row: 5, col: 8 },
];

function snakeBody(task) {
  if (task) {
    snake.forEach((seg) =>
      blocks[`${seg.row},${seg.col}`].classList.add("snake")
    );
  } else {
    document
      .querySelectorAll(".snake")
      .forEach((b) => b.classList.remove("snake"));
  }
}
snakeBody(true);

// moving logic

let direction = "right";

const move = () => {
  let head = null;

  switch (direction) {
    case "left":
      head = { row: snake[0].row, col: snake[0].col - 1 };
      break;
    case "right":
      head = { row: snake[0].row, col: snake[0].col + 1 };
      break;
    case "up":
      head = { row: snake[0].row - 1, col: snake[0].col };
      break;
    case "down":
      head = { row: snake[0].row + 1, col: snake[0].col };
      break;
  }

  //update snake
  snake.unshift(head);
  snake.pop();

  // wall hit logic
  gameover(head);
  // food consuming logic
  renderFood(head);
  // clear previous blocks
  snakeBody(false);
  // re-render snake
  snakeBody(true);
};

let interval = null;

// direction setting logic

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
  }
});

// food render and score logic

let [score, highScore, time] = [
  0,
  localStorage.getItem("highScore") || 0,
  "00:00:00",
];
const scoreBoard = document.getElementById("score");
const highScoreBoard = document.getElementById("high_score");
const timeBoard = document.getElementById("time");
highScoreBoard.innerText = highScore;

let food = {
  row: Math.floor(Math.random() * rows),
  col: Math.floor(Math.random() * cols),
};

blocks[`${food.row},${food.col}`].classList.add("food");

const renderFood = (head) => {
  if (head.row === food.row && head.col === food.col) {
    blocks[`${food.row},${food.col}`].classList.remove("food");
    snake.unshift(head);
    food = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols),
    };
    blocks[`${food.row},${food.col}`].classList.add("food");
    score += 10;
    scoreBoard.innerText = score;
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScore = localStorage.getItem("highScore");
      highScoreBoard.innerText = highScore;
    }
  }
};

// time logic

// wall hit logic
const gameover = (head) => {
  if (head.row >= rows || head.col >= cols || head.row <= 0 || head.col <= 0) {
    const notice = document.getElementById("notice");
    notice.classList.toggle("vanish");
    setTimeout(() => {
      notice.classList.toggle("vanish");
    }, 3000);
    setTimeout(() => {
      backdrop.classList.toggle("vanish");
      restartModal.style.display = "flex";
    }, 3050);
    clearInterval(interval);
  }
};

// start button logic

const startBtn = document.querySelector("#start_btn");
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");

startBtn.addEventListener("click", () => {
  modal.classList.add("vanish");
  interval = setInterval(move, 400);
});

// restart logic
const restartBtn = document.querySelector("#restart_btn");
const restartModal = document.getElementById("restart_modal");

const restartgame = () => {
  snake = [
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 5, col: 7 },
  ];
  direction = "right";
  restartModal.style.display = "none";
  backdrop.classList.add("vanish");
  interval = setInterval(move, 400);
  score = 0;
  scoreBoard.innerText = score;
};

restartBtn.addEventListener("click", restartgame);

document.addEventListener("unload", () => {
  clearInterval(interval);
});
