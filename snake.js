// modals
const gameOverModal = document.getElementById('modal-game-over');
const gameOverText = document.getElementById('game-over-text');
const restart = document.getElementById('restart');
const modalCloseSpan = document.getElementsByClassName("close")[0];

// setup canvas
const canvas = document.querySelector('canvas');
const scoreText = document.getElementById('score-text');
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
ctx.fillStyle = headColor;
ctx.fillRect(startX, startY, snakeBlockFillSize, snakeBlockFillSize);

// setup apple
const snakeWillGrowOnAppleAmount = 3;
const appleColor = 'green';
const appleSize = snakeBlockSize;

// game variables
let appleActive = false;
let appleLocation = {};
let direction = '';
let gameOver = false;
let growSnakeCount = 0;
let skipRemoveTail = false;
let score = 0;
let snakeBlocks = [{ x: startX, y: startY }];
let gameWaitingForStart = true;
let gameLoopInterval = 90;

const resetGame = () => {
  appleActive = false;
  appleLocation = {};
  direction = '';
  gameOver = false;
  growSnakeCount = 0;
  skipRemoveTail = false;
  score = 0;
  snakeBlocks = [{ x: startX, y: startY }];
  gameWaitingForStart = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = headColor;
  ctx.fillRect(startX, startY, snakeBlockFillSize, snakeBlockFillSize);
};

const addNewHeadForSnake = () => {
  reduceGrowSnakeCount();

  const previousHead = snakeBlocks[snakeBlocks.length - 1];

  const newX = setNewHeadX(previousHead.x);
  const newY = setNewHeadY(previousHead.y);
  const newSnakeHead = { x: newX, y: newY };
  
  checkIfSnakeHitWall(newX,newY);
  checkIfSnakeHitBody(newX,newY);
  checkIfSnakeHitApple(newX,newY);
  
  snakeBlocks.push(newSnakeHead);    
  changeOldHeadToBody(previousHead.x, previousHead.y);
  drawNewHeadForSnake(newX, newY);
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

const reduceGrowSnakeCount = () => {
  if(growSnakeCount > 0){
    growSnakeCount--;
  } else {
    skipRemoveTail = false;
  }
};

const drawNewHeadForSnake = (x, y) => {
  ctx.fillStyle = gameOver ? gameOverColor : headColor;
  ctx.fillRect(x, y, snakeBlockFillSize, snakeBlockFillSize);
};

const changeOldHeadToBody = (x, y) => {
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x, y, snakeBlockFillSize, snakeBlockFillSize);
};

const generateApple = () => {
  const appleX = Math.floor(Math.random() * Math.floor(appleSize / 2) ) * appleSize;
  const appleY = Math.floor(Math.random() * Math.floor(appleSize / 2) ) * appleSize;
  const appleOnBody = snakeBlocks.find(block => block['x'] === appleX && block['y'] === appleY);

  if(appleOnBody === undefined){
    appleLocation = { x:appleX, y:appleY };
  
    ctx.fillStyle = appleColor;
    ctx.fillRect(appleX, appleY, snakeBlockFillSize, snakeBlockFillSize);
    appleActive = true;    
  } else {
    generateApple();
  }
};

// snake collisions
const checkIfSnakeHitWall = (x, y) => {
  if (x > canvas.width - snakeBlockSize ) gameOver = true;
  if (x < 0 ) gameOver = true;

  if (y > canvas.height - snakeBlockSize) gameOver = true;
  if (y < 0 ) gameOver = true;
};

const checkIfSnakeHitBody = (x, y) => {
    const hitBody = snakeBlocks.find(block => block['x'] === x && block['y'] === y);
    if (hitBody !== undefined){
        gameOver = true;
    }
};

const checkIfSnakeHitApple = (x, y) => {
  if(appleLocation.x === x && appleLocation.y === y){
    score++;
    scoreText.innerHTML = `Score: ${score}`;
    console.log(`Score: ${score}`);
    appleActive = false;
    growSnakeCount += snakeWillGrowOnAppleAmount;
    skipRemoveTail = true;
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

document.onkeydown = (e) => {    
  const keyCode = e.keyCode;
  movementDirection(keyCode);

  if(gameWaitingForStart){
    gameWaitingForStart = false;
  }
};

// modal functions

const showGameOverModal = () => {
  gameOverText.innerHTML = `Game over. Your score: ${score}`;
  gameOverModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
modalCloseSpan.onclick = () => {
  gameOverModal.style.display = "none";
}

restart.onclick = () => {  
  resetGame();
  game = setInterval(gameLoop, gameLoopInterval);
  gameOverModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == gameOverModal) {
      gameOverModal.style.display = "none";
  }
}

const gameLoop = () => {
  
  if (gameOver) {
    showGameOverModal();
    clearInterval(game);
  }
  
  if(!appleActive){
    generateApple();
  }

  if(gameWaitingForStart){
    return;
  }

  addNewHeadForSnake();
  removeSnakeTail();
};

let game = setInterval(gameLoop, gameLoopInterval);
