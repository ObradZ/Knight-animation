"use strict"

// Context
let canvas;
let ctx;

// Game loop
var secondsPassed;
let oldTimeStamp;
let fps;

// Init
var player;
const GRAVITY = 12;

window.onload = init;
function init() {
    canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;

    ctx = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);

    // Init enities
    player = new Player();

    // Handle input
    window.addEventListener("keydown", function (e) {
        handleInputPress(e.code);
    });
    window.addEventListener("keyup", function (e) {
        handleInputRelease(e.code);
    });

}

function gameLoop(timeStamp) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    calculateFPS(timeStamp);
    update();
    draw(ctx);

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function calculateFPS(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    // Draw number to the screen
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 100);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("FPS: " + fps, 10, 30);
}

function draw(ctx) {

    player.draw(ctx, fps);

}

function update() {

    player.update();
}
