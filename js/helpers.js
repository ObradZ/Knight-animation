function calculateFPS(context, timeStamp, secondsPassed, oldTimeStamp, fps) {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Calculate fps
  fps = Math.round(1 / secondsPassed);

  // Draw number to the screen
  context.fillStyle = "white";
  context.fillRect(0, 0, 200, 100);
  context.font = "25px Arial";
  context.fillStyle = "black";
  context.fillText("FPS: " + fps, 10, 30);
}
