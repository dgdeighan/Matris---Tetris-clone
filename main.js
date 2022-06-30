/*

  Name: Matris
  Author: David Deighan
  Description: A Tetris clone made in vanilla JavaScript as a coding exercise.
    "Matris" comes from legally distinguishing itself from an official Tetris
    game, as well as for the 2D matrix used to represent the grid.
  Publish date: 06/30/2022

*/

// 2D array used to represent the grid:
// tetris[y][x]
let tetris = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

let time = 800;

// canvas definitions
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.strokeStyle = 'rgba(0,0,0,1)';
ctx.lineWidth = 2;

// block Class definition

class Block{
  constructor(x, y, color, type){
    this.x = x;           // block X grid coordinate
    this.y = y;           // block Y grid coordinate
    this.color = color;   // block color; string
    this.axis = false;    // rotational axis bool
    this.type = type;     // the tetromino type the block belongs to
  }
  xDraw(){
    return this.x * 40;   // block X canvas coordinate - draw function
  }

  yDraw(){
    return this.y * 40;   // block Y canvas coordinate - draw function
  }

  toLeft(){
    return this.x - 1;   // x pos to left of block
  }

  toBelow(){
    return this.y + 1;  // y pos under block
  }

  toRight(){
    return this.x + 1;  // x pos to right of block
  }
}

let blockTypes = [
  'line',       // line piece
  'lBlock',     // L-block
  'jBlock',     // aka reverse L-block
  'square',     // square piece
  'sBlock',     // S-block
  'zBlock',     // aka reverse S-block
  'tBlock'      // T-block
];

// draw a single block
function drawBlock(block){
  ctx.fillStyle = block.color;
  ctx.fillRect(block.xDraw(), block.yDraw(), 40, 40);
  ctx.strokeRect(block.xDraw(), block.yDraw(), 40, 40);
  tetris[block.y][block.x] = block;
}

// re-draw background
function drawBackground(){
  for(let i = 0; i < 10; i++){
    switch(i % 2 === 0){
      case(false):
        ctx.fillStyle = 'rgba(10,10,10,1)';
        ctx.fillRect(i*40, 0, i*40 + 40, canvas.height);
        break;
      case(true):
        ctx.fillStyle = 'rgba(20,20,20,1)';
        ctx.fillRect(i*40, 0, i*40 + 40, canvas.height);
        break;
      default:
        break;
    }
  }
}

// renders every block stored in the matrix when called
function matrixRender(){
  for(let i = 0; i < tetris.length; i++){
    for(let j = 0; j < 10; j++){
      if(tetris[i][j] !== 0){
        drawBlock(tetris[i][j]);
      }
    }
  }
}

// array that stores all block data
let currentBlock = [];

// tetromino draw function; () indicates rotational axis
function drawTetromino(x, y, type){
  let xAdd = 0;
  let yAdd = 0;

  switch(type){

    // line block
    // [0](1)[2][3]
    case('line'):
      for(let i = 0; i < 4; i++){
        block = new Block(x + xAdd, y + yAdd, 'cyan', 'line');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      currentBlock[1].axis = true;
      break;

    // L-Block
    //       [3]
    // [0](1)[2]
    case('lBlock'):
      for(let i = 0; i < 3; i++){
        block = new Block(x + xAdd, y + yAdd, 'orange', 'lBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      xAdd -= 1;
      yAdd -= 1;
      block = new Block(x + xAdd, y + yAdd, 'orange', 'lBlock');
      drawBlock(block);
      currentBlock[3] = block;
      currentBlock[1].axis = true;
      break;

    // J-Block
    // [0]
    // [1](2)[3]
    case('jBlock'):
      block = new Block(x + xAdd, y + yAdd, 'rgba(50,50,255,1)', 'jBlock');
      drawBlock(block);
      currentBlock[0] = block;
      yAdd += 1;
      for(let i = 1; i < 4; i++){
        block = new Block(x + xAdd, y + yAdd, 'rgba(50,50,255,1)', 'jBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      currentBlock[2].axis = true;
      break;

    // Square
    // [0][1]
    // (2)[3]
    case('square'):
      for(let i = 0; i < 2; i++){
        block = new Block(x + xAdd, y + yAdd, 'yellow', 'square');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      xAdd = 0;
      yAdd += 1;
      for(let i = 2; i < 4; i++){
        block = new Block(x + xAdd, y + yAdd, 'yellow', 'square');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      break;

    // S-Block
    //    [2][3]
    // [0](1)
    case('sBlock'):
      yAdd += 1;
      for(let i = 0; i < 2; i++){
        block = new Block(x + xAdd, y + yAdd, 'lime', 'sBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      xAdd -= 1;
      yAdd = 0;
      for(let i = 2; i < 4; i++){
        block = new Block(x + xAdd, y + yAdd, 'lime', 'sBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      currentBlock[1].axis = true;
      break;

    // Z-Block
    // [0][1]
    //   (2)[3]
    case('zBlock'):
      for(let i = 0; i < 2; i++){
        block = new Block(x + xAdd, y + yAdd, 'red', 'zBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      xAdd -= 1;
      yAdd += 1;
      for(let i = 2; i < 4; i++){
        block = new Block(x + xAdd, y + yAdd, 'red', 'zBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      currentBlock[2].axis = true;
      break;

    // T-Block
    //    [3]
    // [0](1)[2]
    case('tBlock'):
      yAdd += 1;
      for(let i = 0; i < 3; i++){
        block = new Block(x + xAdd, y + yAdd, 'magenta', 'tBlock');
        drawBlock(block);
        currentBlock[i] = block;
        xAdd += 1;
      }
      xAdd -= 2;
      yAdd -= 1;
      block = new Block(x + xAdd, y + yAdd, 'magenta', 'tBlock');
      drawBlock(block);
      currentBlock[3] = block;
      currentBlock[1].axis = true;
      break;

    default:
      console.log('case not recognized');
      break;
  }
}

// redraw background + refresh block positions on grid
function refresh(){
  drawBackground();
  for(let i = 0; i < 20; i++){
    for(let j = 0; j < 10; j++){
      if(tetris[i][j] !== 0){
        drawBlock(tetris[i][j]);
      }
    }
  }
}

// [x,y][x,y][x,y][x,y]
let nextPos = [];

// next block position from shift
// returns array of arrays: [x,y][x,y][x,y][x,y]
function getNextShiftPos(arr, dir){
  nextPos = [];

  switch(dir){
    case('left'):
      for(let i = 0; i < arr.length; i++){
        nextPos.push([arr[i].toLeft(), arr[i].y]);
      }
      break;

    case('down'):
      for(let i = 0; i < arr.length; i++){
        nextPos.push([arr[i].x, arr[i].toBelow()]);
      }
      break;

    case('right'):
      for(let i = 0; i < arr.length; i++){
        nextPos.push([arr[i].toRight(), arr[i].y]);
      }
      break;

    default:
      break;
  }
}

// next block position from rotation

let rotateCCW =  [
  [0, -1],  // X
  [1,  0]   // Y
];
let rotateCW = [
  [0,  1],  // X
  [-1, 0]   // Y
];

function getRotationAxis(){
  let index = 0;
  for(let i = 0; i < 4; i++){
    if(currentBlock[i].axis === true){
      index = i;
      break;
    }
  }

  return index;
}

function getNextRotatePos(dir){
  let axis = getRotationAxis();
  let originX = currentBlock[axis].x;
  let originY = currentBlock[axis].y;
  let xDiff = 0;
  let yDiff = 0;
  let rotationMatrix = [];
  switch(dir){
    case('cw'):
      rotationMatrix = rotateCW;
      break;

    case('ccw'):
      rotationMatrix = rotateCCW;
      break;

    default:
      console.log('direction not recognized');
      break;
  }

  nextPos = [];

  for(let i = 0; i < 4; i++){
    // don't rotate squares.
    if(currentBlock[0].color === 'grey'){
      break;
    }
    xDiff = currentBlock[i].x - originX;
    yDiff = currentBlock[i].y - originY;

    let xHat = rotationMatrix[0];
    let yHat = rotationMatrix[1];
    let vecA = [];
    let vecB = [];

    vecA.push(xHat[0] * xDiff);
    vecA.push(xHat[1] * xDiff);
    vecB.push(yHat[0] * yDiff);
    vecB.push(yHat[1] * yDiff);

    let newX = vecA[0] + vecB[0];
    let newY = vecA[1] + vecB[1];

    xNextPos = newX + originX;
    yNextPos = newY + originY;

    nextPos.push([xNextPos, yNextPos]);
  }
}

// Return the non-currentBlock area taken up by the next movement for
//  movement-independent collision testing purposes

function getAbsNextPos(){
  let absNextPos = nextPos;

  for(let i = 0; i < 4; i++){

    for(let j = 0; j < 4; j++){
      if(nextPos[i][0] === currentBlock[j].x && nextPos[i][1] === currentBlock[j].y){
        absNextPos[i] = 0;
        break;
      }
    }

  }
  absNextPos.sort();
  absNextPos.reverse();
  let countZero = 0;

  for(let i = 0; i < 4; i++){
    if(absNextPos[i] === 0){
      countZero++;
    }
  }

  for(let i = 0; i < countZero; i++){
    absNextPos.pop();
  }

  return absNextPos;
}

// generic move function block w/ collision
function move(arr, type, dir){
  switch(type){
    case('shift'):
      getNextShiftPos(arr, dir);
      break;

    case('rotate'):
      getNextRotatePos(dir);
      break;
  }


  for(let i = 0; i < arr.length; i++){

    for(let i = 0; i < arr.length; i++){
      tetris[arr[i].y][arr[i].x] = 0;
      arr[i].x = nextPos[i][0];
      arr[i].y = nextPos[i][1];
    }

    for(let i = 0; i < arr.length; i++){
      tetris[arr[i].y][arr[i].x] = arr[i];
    }
    refresh();
  }
}

function collisionCheck(arr, type, dir){
  switch(type){
    case('shift'):
      getNextShiftPos(arr, dir);
      break;

    case('rotate'):
      getNextRotatePos(dir);
  }

  let absNextPos = getAbsNextPos();
  let canMove;

  for(let i = 0; i < absNextPos.length; i++){
    if(tetris[absNextPos[i][1]][absNextPos[i][0]] !== 0){
      canMove = false;
      break;
    } else {
      canMove = true;
    }
  }

  return canMove;
}

function moveWithCollision(arr, type, dir){
  // let check = collisionCheck(arr, type, dir);
  let check;
  try{
    check = collisionCheck(arr, type, dir);
  } catch(TypeError) {
    console.log('out of bounds!');
  }
  if(check === true){
    move(arr, type, dir);
  }
}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomTetromino(){
  let randomInt = getRandomInt(0, 7);
  return blockTypes[randomInt];
}

// function that returns the array representing the positions of every
//  single block type at the default spawn area.
function getSpawnPos(x, y, blockType){
  let startPos = [];
  switch(blockType){
    case('line'):
      startPos = [
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 3, y]
      ];
      break;

    case('lBlock'):
      startPos = [
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 2, y - 1]
      ];
      break;

    case('jBlock'):
      startPos = [
        [x, y],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 2, y + 1]
      ];
      break;

    case('square'):
      startPos = [
        [x, y],
        [x + 1, y],
        [x, y + 1],
        [x + 1, y + 1]
      ];
      break;

    case('sBlock'):
      startPos = [
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 2, y]
      ];
      break;

    case('zBlock'):
      startPos = [
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
        [x + 2, y + 1]
      ];
      break;

    case('tBlock'):
      startPos = [
        [x, y + 1],
        [x + 1, y + 1],
        [x + 2, y + 1],
        [x + 1, y]
      ];
      break;

  }
  return startPos;
}

// keyboard events for controls

let downPressed = false;

function keyDown(e){
  switch(e.key){
    case('ArrowLeft'):
      moveWithCollision(currentBlock, 'shift', 'left');
      break;

    case('ArrowDown'):
      checkBelow();
      downPressed = true;
      moveWithCollision(currentBlock, 'shift', 'down');
      break;

    case('ArrowRight'):
      moveWithCollision(currentBlock, 'shift', 'right');
      break;

    case('z'):
      moveWithCollision(currentBlock, 'rotate', 'ccw');
      break;

    case('c'):
      moveWithCollision(currentBlock, 'rotate', 'cw');
      break;
  }
}

document.addEventListener('keydown', keyDown, false);

// game logic vars

let randomPiece;
let canSpawn = true;
let sX = 0;
let sY = 0;
let canMoveDown = true;
let score = 0;
let rowsCleared = 0;

let scoreDoc = document.querySelector('.points');
let rowsDoc = document.querySelector('.lines-cleared');

// checks below the current block specifically to see if it can move.
function checkBelow(){
  let belowSpace = [];
  canMoveDown = true; // assume the piece can move to start out
  for(let i = 0; i < 4; i++){
    try{
      if(!currentBlock.includes(tetris[currentBlock[i].y + 1][currentBlock[i].x])){
        let xLoc = currentBlock[i].x;
        let yLoc = currentBlock[i].y + 1;
        let xyLoc = [xLoc, yLoc];
        belowSpace.push(xyLoc);
      }
    } catch(TypeError){
      canMoveDown = false;
    }
  }

  if(canMoveDown === true){
    for(let i = 0; i < belowSpace.length; i++){
      let xLoc = belowSpace[i][0];
      let yLoc = belowSpace[i][1];
      if(tetris[yLoc][xLoc] !== 0){
        canMoveDown = false;
        break
      } else {
        canMoveDown = true;
      }
    }
  }
  // console.log(canMoveDown);
}

drawBackground();
randomPiece = getRandomTetromino();

function spawnTetromino(){
  if(currentBlock.length === 0){
    // randomPiece = getRandomTetromino();
    sX = 3;
    sY = 0;
    if(randomPiece === 'lBlock'){
      sY++;
    }
    if(randomPiece === 'square'){
      sX++;
    }
    drawTetromino(sX, sY, randomPiece);
  }
}

function checkSpawn(){
  sX = 3;
  sY = 0;
  if(randomPiece === 'lBlock'){
    sY++;
  }
  if(randomPiece === 'square'){
    sX++;
  }
  let spawnPos = getSpawnPos(sX, sY, randomPiece);
  for(let i = 0; i < 4; i++){
    let xSpawn = spawnPos[i][0];
    let ySpawn = spawnPos[i][1];
    if(tetris[ySpawn][xSpawn] !== 0 && !currentBlock.includes(tetris[ySpawn][xSpawn])){
      currentBlock = [];
      clearInterval(gameRun);
      alert(`Game Over! Your score is: ${score}`);
      clearInterval(checkFailState);
      break;
    }
  }
}

function failState(){
  checkSpawn();
}

// game loop
function update(){
  spawnTetromino();
  checkBelow();

  if(canMoveDown === true){
    moveWithCollision(currentBlock, 'shift', 'down');
  } else {
    rowClearer();
    spawnTetromino();
  }

  // update level
  levelMod();
  randomPiece = getRandomTetromino();
}

function getFilledIndices(){
  let indices = [];
  for(let i = 0; i < tetris.length; i++){
    let zeroCount = 0;

    for(let j = 0; j < 10; j++){
      if(tetris[i][j] === 0){
        zeroCount++;
      }
    }

    if(zeroCount === 0){
      indices.push(i);
    }
  }

  return indices;
}

function rowClearer(){
  let indices = getFilledIndices();
  for(let i = 0; i < indices.length; i++){
    tetris[indices[i]].fill(0);
  }
  refresh();
  currentBlock = [];
  let amountShift = indices.length;
  let highestIndex = indices[0];
  rowShifter(highestIndex, amountShift);
}

function rowShifter(index, shiftAmt){
  for(let i = index - 1; i > 0; i--){
    currentBlock = [];
    for(let j = 0; j < 10; j++){
      if(tetris[i][j] !== 0){
        currentBlock.push(tetris[i][j]);
      }
    }

    for(let j = 0; j < shiftAmt; j++){
      move(currentBlock, 'shift', 'down');
    }
  }
  currentBlock = [];

  // update score
  rowsCleared += shiftAmt;
  score += (2 ** (shiftAmt - 1) * 100);

  rowsDoc.textContent = rowsCleared;
  scoreDoc.textContent = score;
}

let level = 1;
let levelDoc = document.querySelector('.level');

function levelMod(){
  let levelChk = Math.ceil(score / 1000);
  if(levelChk > level){
    level = levelChk;
    levelDoc.textContent = level;
    if(levelChk % 2 === 1){
      time = time / 2;
      clearInterval(gameRun);
      gameRun = setInterval(update, time);
    }
  }
}

// debugging function; easily populates rows for testing
function debugLine(){
  let xLoc = 0;
  for(let i = 0; i < 5; i++){
    drawTetromino(xLoc, 4, 'square');
    xLoc += 2;
  }
  drawTetromino(4,3,'line');
}

let gameRun = setInterval(update, time);
clearInterval(gameRun);

let checkFailState = setInterval(failState, 10);
clearInterval(checkFailState);

let startBtn = document.querySelector('.start');
let pauseBtn = document.querySelector('.pause');
let resetBtn = document.querySelector('.reset');

startBtn.addEventListener('click', () => {
  spawnTetromino();
  gameRun = setInterval(update, 1000);
  checkFailState = setInterval(failState, 10);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(gameRun);
})

resetBtn.addEventListener('click', () => {
  document.location.reload();
})
