var paused = false;

module.exports = function pause(params) {
    const player = params.player;

    if(paused === false) {
        player.pause();
        paused = true;
    } else {
        player.unpause();
        paused = false;
    }
};