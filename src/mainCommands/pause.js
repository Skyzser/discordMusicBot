var paused = false;

module.exports = function pause(player) {
    if(paused === false) {
        player.pause();
        paused = true;
    } else {
        player.unpause();
        paused = false;
    }
};