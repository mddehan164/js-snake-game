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

const snake = [
  { row: 5, col: 5 },
  { row: 5, col: 6 },
  { row: 5, col: 7 },
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

let direction = "down";

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
  if (head.row >= rows || head.col >= cols || head.row <= 0 || head.col <= 0) {
    alert("Game Over");
    clearInterval(interval);
  }

  // food consuming logic
  if (head.row === food.row && head.col === food.col) {
    blocks[`${food.row},${food.col}`].classList.remove("food");
    snake.unshift(head);
    food = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols),
    };
    blocks[`${food.row},${food.col}`].classList.add("food");
  }
  // clear previous blocks
  snakeBody(false);
  // re-render snake
  snakeBody(true);
};

const interval = setInterval(move, 400);

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

// food render logic

let food = {
  row: Math.floor(Math.random() * rows),
  col: Math.floor(Math.random() * cols),
};

blocks[`${food.row},${food.col}`].classList.add("food");
