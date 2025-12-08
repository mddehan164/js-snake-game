// creating the blocks.
const board = document.getElementById("board");

const blockWidth = 30;
const blockHeight = 30;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let blocks = [];
const fragment = document.createDocumentFragment();

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    fragment.appendChild(block);
    blocks[`${row},${col}`] = block;
  }
}

board.appendChild(fragment);

//my code

// for (let row = 0; row < rows; row++) {
//   for (let col = 0; col < cols; col++) {
//     const block = document.createElement("div");
//     block.classList.add("block");
//     board.appendChild(block);
//     // block.innerHTML = `${row},${col}`;
//     blocks[`${row},${col}`] = block;
//   }
// }

// render the snake

// my code

// function snakeBody(task) {
//   if (task) {
//     snake.forEach((seg) =>
//       blocks[`${seg.row},${seg.col}`].classList.add("snake")
//     );
//   } else {
//     document
//       .querySelectorAll(".snake")
//       .forEach((b) => b.classList.remove("snake"));
//   }
// }

function snakeBody(render) {
  if (!render) {
    snake.forEach((seg) =>
      blocks[`${seg.row},${seg.col}`]?.classList.remove("snake")
    );
    return;
  }

  snake.forEach((seg) =>
    blocks[`${seg.row},${seg.col}`]?.classList.add("snake")
  );
}

let snake = [
  { row: 5, col: 6 },
  { row: 5, col: 7 },
  { row: 5, col: 8 },
];

snakeBody(true);

// moving logic
let direction = "right";

const move = () => {
  let head;

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
  // clear previous blocks

  snakeBody(false);

  //update snake
  snake.unshift(head);
  snake.pop();

  // wall hit logic
  gameover(head);
  // food consuming logic
  renderFood(head);
  // re-render snake
  snakeBody(true);
};

let interval = null;

// direction setting logic
let gameRunning = false;

// my code

// addEventListener("keydown", (e) => {
//   switch (e.key) {
//     case "ArrowUp":
//       direction = "up";
//       break;
//     case "ArrowDown":
//       direction = "down";
//       break;
//     case "ArrowRight":
//       direction = "right";
//       break;
//     case "ArrowLeft":
//       direction = "left";
//       break;
//   }

//   if (e.key === "Enter") {
//     // প্রথমবার Enter → game start
//     if (!gameRunning) {
//       startGame();
//       gameRunning = true;
//     }

//     // restart modal খোলা থাকলে Enter → restart game
//     else if (restartModal.style.display === "flex") {
//       restartgame();
//     }
//   }
// });

addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    const newDir = e.key.replace("Arrow", "").toLowerCase();
    direction = newDir;
  }

  if (e.key === "Enter") {
    if (!gameRunning) {
      startGame();
      gameRunning = true;
    } else if (restartModal.style.display === "flex") {
      restartgame();
    }
  }
});

// food render and score logic

let [score, highScore, time] = [
  0,
  localStorage.getItem("highScore") || 0,
  "00:00:00",
];

let speed = 300;

// score logic
function speedIncrease() {
  // প্রতি 50 score এ speed কমবে
  if (score % 50 === 0 && score !== 0) {
    speed -= 50;

    // speed never lower than 50 ms
    if (speed < 50) speed = 50;

    // current movement interval reset
    clearInterval(interval);
    interval = setInterval(move, speed);

    // console.log("Speed updated:", speed);
  }
}

const scoreBoard = document.getElementById("score");
const highScoreBoard = document.getElementById("high_score");
const timeBoard = document.getElementById("time");
highScoreBoard.innerText = highScore;
timeBoard.innerText = time;

//my code

// let food = {
//   row: Math.floor(Math.random() * rows),
//   col: Math.floor(Math.random() * cols),
// };

// blocks[`${food.row},${food.col}`].classList.add("food");

// const renderFood = (head) => {
//   if (head.row === food.row && head.col === food.col) {
//     blocks[`${food.row},${food.col}`].classList.remove("food");
//     snake.unshift(head);
//     food = {
//       row: Math.floor(Math.random() * rows),
//       col: Math.floor(Math.random() * cols),
//     };
//     blocks[`${food.row},${food.col}`].classList.add("food");
//     score += 10;
//     scoreBoard.innerText = score;
//     if (score > highScore) {
//       localStorage.setItem("highScore", score);
//       highScore = localStorage.getItem("highScore");
//       highScoreBoard.innerText = highScore;
//     }
//   }
// };

let food;

function placeFood() {
  if (food) blocks[`${food.row},${food.col}`].classList.remove("food");

  food = {
    row: Math.floor(Math.random() * rows),
    col: Math.floor(Math.random() * cols),
  };
  blocks[`${food.row},${food.col}`].classList.add("food");
}

placeFood();

// eat food
const renderFood = (head) => {
  if (head.row === food.row && head.col === food.col) {
    blocks[`${food.row},${food.col}`].classList.remove("food");

    snake.unshift(head);
    placeFood();

    score += 10;
    scoreBoard.innerText = score;
    speedIncrease();
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScore = score;
      highScoreBoard.innerText = highScore;
    }
  }
};

// time logic
let timeInterval = null;
const timer = () => {
  let s = 0;
  let m = 0;
  let h = 0;
  timeInterval = setInterval(() => {
    s++;
    if (s === 60) {
      s = 0;
      m++;
    }
    if (m === 60) {
      m = 0;
      h++;
    }
    time = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    timeBoard.innerText = time;
  }, 1000);
};

// wall hit logic
const gameover = (head) => {
  if (head.row < 0 || head.col < 0 || head.row >= rows || head.col >= cols) {
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
    clearInterval(timeInterval);
    speed = 300;
  }
};

// start button logic

const startBtn = document.getElementById("start_btn");
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");

const startGame = () => {
  modal.style.display = "none";
  clearInterval(interval);
  interval = setInterval(move, speed);
  timer();
  backdrop.classList.add("vanish");
};

startBtn.addEventListener("click", startGame);

// restart logic
const restartBtn = document.getElementById("restart_btn");
const restartModal = document.getElementById("restart_modal");

const restartgame = () => {
  snakeBody(false);

  snake = [
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 5, col: 7 },
  ];
  direction = "right";

  restartModal.style.display = "none";
  backdrop.classList.add("vanish");

  clearInterval(interval);
  clearInterval(timeInterval);

  placeFood();

  snakeBody(true);

  interval = setInterval(move, speed);

  score = 0;
  scoreBoard.innerText = score;

  timer();
  gameRunning = true;
};

restartBtn.addEventListener("click", restartgame);
