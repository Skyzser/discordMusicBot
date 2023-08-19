import { AudioPlayerStatus } from '@discordjs/voice';

export default function Command({ player }) {
    if(player.state.status === AudioPlayerStatus.Paused) player.unpause();
    else player.pause();
};