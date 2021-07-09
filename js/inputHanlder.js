// Inputs (Enum simulation)
const Keys = {
    MOVE_LEFT: "KeyA",
    MOVE_RIGHT: "KeyD",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    JUMP: "Space",
    FIRE: "ControlLeft",
    RELOAD: "KeyR",
};
Object.freeze(Keys);

const activeKeys = [];

function handleInputPress(code) {
    // logCode(code);
    // Tracking pressed keys
    if (!activeKeys.includes(code)) {
        activeKeys.push(code);
    }

    // player.move has isMovingRight parameter
    if (code === Keys.MOVE_LEFT) player.move(false);
    if (code === Keys.MOVE_RIGHT) player.move(true);

    if (code === Keys.JUMP) player.jump();
    if (code === Keys.FIRE) { player.attack(); }
    if (code === Keys.RELOAD) logCode(code);
}

function handleInputRelease(code) {

    for (var i = 0; i < activeKeys.length; i++) {
        if (activeKeys[i] === code) {
            activeKeys.splice(i, 1);
        }
    }

    if (!activeKeys.includes(Keys.MOVE_LEFT) && !activeKeys.includes(Keys.MOVE_RIGHT)) {
        player.stop();
    }
}

function logCode(e) {
    console.log("Pressed: ", e);
}