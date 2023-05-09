var paused = false;

export default function pause({ player }) {
    if(!paused) player.pause();
    else player.unpause();
    paused = !paused;
};