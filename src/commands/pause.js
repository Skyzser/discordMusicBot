import { AudioPlayerStatus } from '@discordjs/voice';

export default function Pause({ player }) {
    if(player.state.status === AudioPlayerStatus.Paused) player.unpause();
    else player.pause();
};