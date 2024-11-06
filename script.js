// Select canvas and set up context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial game state variables
let score = 0;
let isGameOver = false;
let ballSpeedFactor = 1; // Multiplier for ball speed

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3 * ballSpeedFactor,  // Initial horizontal speed
    dy: 3 * ballSpeedFactor,  // Initial vertical speed
};

// Bar properties
const bar = {
    width: 80,
    height: 10,
    x: (canvas.width - 80) / 2,
    y: canvas.height - 20,
    dx: 5,
};

// Event listeners for bar control using keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && bar.x > 0) {
        bar.x -= bar.dx;
    } else if (e.key === 'ArrowRight' && bar.x + bar.width < canvas.width) {
        bar.x += bar.dx;
    }
});

// Event listener for bar control using mouse (for desktop)
canvas.addEventListener('mousemove', (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    bar.x = e.clientX - canvasRect.left - bar.width / 2;
    if (bar.x < 0) bar.x = 0;
    if (bar.x + bar.width > canvas.width) bar.x = canvas.width - bar.width;
});

// Event listener for bar control using touch (for mobile)
canvas.addEventListener('touchmove', (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - canvasRect.left;
    bar.x = touchX - bar.width / 2;
    if (bar.x < 0) bar.x = 0;
    if (bar.x + bar.width > canvas.width) bar.x = canvas.width - bar.width;
    e.preventDefault();  // Prevent scrolling while touching the canvas
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', resetGame);

// Game functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.closePath();
}

function drawBar() {
    ctx.beginPath();
    ctx.rect(bar.x, bar.y, bar.width, bar.height);
    ctx.fillStyle = '#2ecc71';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    document.getElementById('score').textContent = score;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with bar
    if (ball.y + ball.radius > bar.y && ball.x > bar.x && ball.x < bar.x + bar.width) {
        ball.dy = -ball.dy;
        score++;
        increaseDifficulty(); // Increase ball speed as score increases
        drawScore();
    }

    // Game over condition
    if (ball.y + ball.radius > canvas.height) {
        isGameOver = true;
        alert('Game Over! Your score: ' + score);
    }
}

function increaseDifficulty() {
    if (score % 5 === 0) {  // Increase speed every 5 points
        ballSpeedFactor += 0.1; // Increase speed by 10%
        ball.dx = 3 * ballSpeedFactor;  // Update horizontal speed
        ball.dy = 3 * ballSpeedFactor;  // Update vertical speed
    }
}

function resetGame() {
    score = 0;
    isGameOver = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ballSpeedFactor = 1; // Reset speed multiplier
    ball.dx = 3 * ballSpeedFactor;
    ball.dy = 3 * ballSpeedFactor;
    drawScore();
    gameLoop();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (isGameOver) return;
    clearCanvas();
    drawBall();
    drawBar();
    moveBall();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
