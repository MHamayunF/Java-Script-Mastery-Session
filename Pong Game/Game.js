const gamebox = document.querySelector("#gamebox");
const ctx = gamebox.getContext("2d");
const score = document.querySelector("#score");
const resetbtn = document.querySelector("#resetbtn");
const startbtn =  document.querySelector("#startbtn");
const gamewidth = gamebox.width;
const gameheight = gamebox.height;
const boxbackground = "forestgreen";
const paddle1color = "blue";
const paddle2color = "red";
const paddleborder = "black";
const ballcolor = "yellow";
const ballbordercolor = "black";
const ballradius = 12.5;
const paddlespeed = 50;
let intervalID;
let ballspeed = 1;
let ballX = gamewidth / 2;
let ballY = gameheight / 2;
let ballXdirection = 0;
let ballYdirection = 0;
let player1score = 0;
let player2score = 0;
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};
let paddle2 = {
  width: 25,
  height: 100,
  x: gamewidth - 25,
  y: gameheight - 100,
};

window.addEventListener("keydown", changeDirection);
resetbtn.addEventListener("click", resetGame);
startbtn.addEventListener("click", gameStart);

function gameStart() {
  createBall();
  nextTick();
}

function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    
    if (player1score >= 10) {
      Swal.fire("Game Over! Player 1 wins");
      stopGame();
      return; 
    }
    
    if (player2score >= 10) {
      Swal.fire("Game Over! Player 2 wins");
      stopGame();
      return;
    }
    
    nextTick();
  }, 10);
}

function stopGame() {
  clearTimeout(intervalID);  // Stops the game loop
  clearBoard();  // Clears the game board
}

function clearBoard() {
  ctx.fillStyle = boxbackground;
  ctx.fillRect(0, 0, gamewidth, gameheight);
}

function drawPaddles() {
  ctx.strokeStyle = paddleborder;

  ctx.fillStyle = paddle1color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
  ballspeed = 1;
  if (Math.round(Math.random()) == 1) {
    ballXdirection = 1;
  } else {
    ballXdirection = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYdirection = 1;
  } else {
    ballYdirection = -1;
  }
  ballX = gamewidth / 2;
  ballY = gameheight / 2;
  drawBall(ballX, ballY);
}

function moveBall() {
  ballX += ballspeed * ballXdirection;
  ballY += ballspeed * ballYdirection;
}

function drawBall(ballX, ballY) {
  ctx.fillStyle = ballcolor;
  ctx.strokeStyle = ballbordercolor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballradius, 0, 2 * Math.PI);
  ctx.stroke(); // Fixed capitalization
  ctx.fill();
}

function checkCollision() {
  if (ballY <= 0 + ballradius) {
    ballYdirection *= -1;
  }
  if (ballY >= gameheight - ballradius) {
    ballYdirection *= -1;
  }
  if (ballX <= 0) {
    player2score += 1;
    updateScore();
    createBall();
    return;
  }
  if (ballX >= gamewidth) {
    player1score += 1;
    updateScore();
    createBall();
    return;
  }
  if (ballX <= paddle1.x + paddle1.width + ballradius) {
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballradius;
      ballXdirection *= -1;
      ballspeed += 0.5;
    }
  }
  if (ballX >= paddle2.x - ballradius) {
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      ballXdirection *= -1;
      ballspeed += 0.5;
    }
  }
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (keyPressed) {
    case paddle1Up:
      if (paddle1.y > 0) {
        paddle1.y -= paddlespeed;
      }
      break;
    case paddle1Down:
      if (paddle1.y < gameheight - paddle1.height) {
        paddle1.y += paddlespeed;
      }
      break;
    case paddle2Up:
      if (paddle2.y > 0) {
        paddle2.y -= paddlespeed;
      }
      break;
    case paddle2Down:
      if (paddle2.y < gameheight - paddle2.height) {
        paddle2.y += paddlespeed;
      }
      break;
  }
}

function updateScore() {
  score.textContent = `${player1score} : ${player2score}`;
}

function resetGame() {
  player1score = 0;
  player2score = 0;
  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gamewidth - 25,
    y: gameheight - 100,
  };
  ballspeed = 0;
  ballX = 0;
  ballY = 0;
  ballXdirection = 0;
  ballYdirection = 0;
  updateScore();
  clearTimeout(intervalID);
  clearBoard();  // Clears the game board after resetting
}
