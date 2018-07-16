// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 800;
ctx.canvas.height = ctx.canvas.width;

// set snake coloring
const headColor = '#1abc9c';
const bodyColor = '#b4b4b4';
const gameOverColor = 'red';

//set snake block size
const snakeBlockSize = 40;
const snakeBlockFillSize = snakeBlockSize - 0.1 * snakeBlockSize;

// set snake starting point
const startX = ctx.canvas.width / 2 - (snakeBlockSize);
const startY = ctx.canvas.height / 2 - (snakeBlockSize);

// game variables
let snakeBlocks = [{ x: startX, y: startY }];
let gameOver = false;
let skipRemoveTail = false;
let direction = 'down';
let appleActive = false;

// setup apple
const appleColor = 'green';
const appleX = canvas.width / snakeBlockSize;
const appleY = canvas.height / snakeBlockSize;
const appleSize = snakeBlockSize;

const addNewHeadForSnake = () => {
  const previousHead = snakeBlocks[snakeBlocks.length - 1];
  const x = setNewHeadX(previousHead.x);
  const y = setNewHeadY(previousHead.y);

  const newSnakeHead = { x: x, y: y };

  // set previous head color to body color
  ctx.fillStyle = bodyColor;
  ctx.fillRect(previousHead.x, previousHead.y, snakeBlockFillSize, snakeBlockFillSize);

  checkIfSnakeHitWall(x,y);
  checkIfSnakeHitBody(x,y);

  snakeBlocks.push(newSnakeHead);

  // Draw new head with headcolor
  ctx.fillStyle = gameOver ? gameOverColor : headColor;
  ctx.fillRect(x, y, snakeBlockFillSize, snakeBlockFillSize);
};

const setNewHeadX = prevX => {
  if (direction === 'left') return prevX - snakeBlockSize;
  if (direction === 'right') return prevX + snakeBlockSize;
  return prevX;
};

const setNewHeadY = prevY => {
  if (direction === 'up') return prevY - snakeBlockSize;
  if (direction === 'down') return prevY + snakeBlockSize;
  return prevY;
};

const removeSnakeTail = () => {
  if (!skipRemoveTail) {
    ctx.clearRect(snakeBlocks[0].x, snakeBlocks[0].y, snakeBlockSize, snakeBlockSize);
    if (snakeBlocks.length > 1) {
      snakeBlocks.shift();
    }
  }
};

const generateApple = () => {
  const x = Math.floor(Math.random() * Math.floor(appleSize / 2) ) * appleSize;
  const y = Math.floor(Math.random() * Math.floor(appleSize / 2) ) * appleSize;

  ctx.fillStyle = appleColor;
  ctx.fillRect(x, y, snakeBlockFillSize, snakeBlockFillSize);
  appleActive = true;
}

// snake collisions
const checkIfSnakeHitWall = (x, y) => {
  if (x >= canvas.width - snakeBlockSize && direction === 'right') gameOver = true;
  if (x === 0 && direction === 'left') gameOver = true;

  if (y === canvas.height - snakeBlockSize && direction === 'down') gameOver = true;
  if (y === 0 && direction === 'up') gameOver = true;
};

const checkIfSnakeHitBody = (x, y) => {
    const hitBody = snakeBlocks.find(block => block['x'] === x && block['y'] === y);
    if (hitBody !== undefined){
        gameOver = true;
    }
};


const movementDirection = (keyCode) => {
    // left arrow = 37, up arrow = 38, right arrow = 39, down arrow = 40
    switch (keyCode) {
        case 37:
          return direction === 'right' ? null : direction = 'left';
        case 38:
          return direction === 'down' ? null : direction = 'up';
        case 39:
          return direction === 'left' ? null : direction = 'right';
        case 40:
          return direction === 'up' ? null : direction = 'down';
        case 89:
          return (skipRemoveTail = true);
        case 84:
          return (skipRemoveTail = false);
        default:
          return null;
      }
};

setInterval(function() {
  if (gameOver) {
    return;
  }

  if(!appleActive){
    generateApple();
  }

  addNewHeadForSnake();
  removeSnakeTail();
}, 150);

document.onkeydown = (e) => {    
  const keyCode = e.keyCode;
  movementDirection(keyCode);
};
