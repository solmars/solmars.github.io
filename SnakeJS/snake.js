const canvas = document.getElementById('snakeCanvas');
const sizeDivision = 8;
const nSquares = 28;
const squareSize = nSquares - 2;
const sizeIncreaseOnEat = 1;
const canvasCtx = canvas.getContext('2d');

let score = 0;

let nonRoundedWidth = window.innerWidth - (window.innerWidth / sizeDivision);
let nonRoundedHeight = window.innerHeight - (window.innerHeight / sizeDivision);

canvas.width = nonRoundedWidth - nonRoundedWidth % nSquares;
canvas.height = nonRoundedHeight - nonRoundedHeight % nSquares;


let updateSpeedMs = 75;

const snakeHead = {
    xLocation: 10,
    yLocation: 10,
    xSpeed: 0,
    ySpeed: 0,
    snakeTailsSize: 0
}
const snakeTails = { tails: [] };
const food = {
    xLocation: 20,
    yLocation: 10
}
const pressCodes = {
    down: 40,
    up: 38,
    left: 37,
    right: 39
}


startGame();

function startGame() {
    if (isGameOver()) {
        return;
    }
    paintScreen();
    drawSnake();
    showFood();
    moveSnake();
    possiblyEatFood();
    showScore();
    setTimeout(startGame, updateSpeedMs);
}
function paintScreen() {
    canvasCtx.fillStyle = 'rgb(62, 59, 19)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake() {
    canvasCtx.fillStyle = 'green';
    for (let i = 0; i < snakeTails.tails.length; i++) {
        canvasCtx.fillRect(snakeTails.tails[i].x * nSquares, snakeTails.tails[i].y * nSquares, squareSize, squareSize);
    }
    snakeTails.tails.push({
        x: snakeHead.xLocation,
        y: snakeHead.yLocation
    });

    if (snakeTails.tails.length > snakeHead.snakeTailsSize) {
        snakeTails.tails.shift();
    }
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(snakeHead.xLocation * nSquares, snakeHead.yLocation * nSquares, squareSize, squareSize);

}
function moveSnake() {

    snakeHead.xLocation += snakeHead.xSpeed;
    snakeHead.yLocation += snakeHead.ySpeed;

    let currentX = snakeHead.xLocation * nSquares;

    if (currentX >= canvas.width) {
        snakeHead.xLocation = 0;
    }
    else if (currentX < 0 && snakeHead.xSpeed == -1) {
        snakeHead.xLocation = canvas.width / nSquares;
    }
    let currentY = snakeHead.yLocation * nSquares;

    if (currentY >= canvas.height) {
        snakeHead.yLocation = 0;
    }
    else if (currentY < 0 && snakeHead.ySpeed == -1) {
        snakeHead.yLocation = canvas.height / nSquares;
    }
}
function showScore() {
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.font = '20px Arial';
    canvasCtx.fillText("Score: " + score, canvas.width - nSquares * 4, nSquares);
}
function isGameOver() {
    let isOver = checkEatSelf();
    if (isOver) {
        canvasCtx.fillStyle = 'white';
        canvasCtx.font = '50px Arial';
        canvasCtx.fillText("You lost! Final score: " + score, canvas.width / 2 - 160, canvas.height / 2);

        return true;
    }
    return false;
}
function checkEatSelf() {
    for (let i = 0; i < snakeTails.tails.length; i++) {
        let tail = snakeTails.tails[i];
        if (tail.x == snakeHead.xLocation && tail.y == snakeHead.yLocation) {
            return true;
        }
    }
    return false;
}
function possiblyEatFood() {
    if (snakeHead.xLocation == food.xLocation && snakeHead.yLocation == food.yLocation) {
        score++;
        if (updateSpeedMs > 10) {
            updateSpeedMs -= 2;
        }
        snakeHead.snakeTailsSize += sizeIncreaseOnEat;
        generateFood();
    }
}

function showFood() {
    canvasCtx.fillStyle = 'rgb(152, 23, 0)';
    canvasCtx.fillRect(food.xLocation * nSquares, food.yLocation * nSquares, squareSize, squareSize);
}

function generateFood() { // effectively, it only changes the food coordinates
    let x = parseInt(Math.random() * canvas.width);
    let y = parseInt(Math.random() * canvas.height);
    food.xLocation = (x - x % nSquares) / nSquares;
    food.yLocation = (y - y % nSquares) / nSquares;
}

// add input listener
document.body.addEventListener('keydown', keyPress);
function keyPress(event) {
    if (event.keyCode === pressCodes.up) {
        // if is moving down ( == 1), don't let it go up(or the snake would eat it self)
        if (snakeHead.ySpeed) {
            return;
        }
        snakeHead.ySpeed = -1;
        snakeHead.xSpeed = 0;
    }
    else if (event.keyCode === pressCodes.down) {
        // if is moving up, don't let it go down(or the snake would eat it self)
        if (snakeHead.ySpeed === -1) {
            return;
        }
        snakeHead.ySpeed = 1;
        snakeHead.xSpeed = 0;
    }
    else if (event.keyCode === pressCodes.left) {
        //if moving right, dont go let go left
        if (snakeHead.xSpeed) {
            return;
        }

        snakeHead.ySpeed = 0;
        snakeHead.xSpeed = -1;
    }
    else if (event.keyCode === pressCodes.right) {
        // if moving left, don't let go right
        if (snakeHead.xSpeed == -1) {
            return;
        }

        snakeHead.ySpeed = 0;
        snakeHead.xSpeed = 1;
    }
}

