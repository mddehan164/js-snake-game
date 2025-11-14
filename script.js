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

function renderSnake() {
  snake.forEach((seg) =>
    blocks[`${seg.row},${seg.col}`].classList.add("snake")
  );
}
renderSnake();
