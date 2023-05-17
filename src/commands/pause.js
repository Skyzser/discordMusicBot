let paused = false;

export default function Command({ player }) {
    if(!paused) player.pause();
    else player.unpause();
    paused = !paused;
};