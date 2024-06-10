import { AudioPlayerStatus } from "@discordjs/voice";

export default async function Pause({ player, message }) {
  if (player.state.status === AudioPlayerStatus.Paused) {
    player.unpause();
    await message.channel.send("Playing :play_pause:").then((msg) => {
      setTimeout(() => msg.delete(), 1000);
    });
  } else {
    player.pause();
    await message.channel.send("Paused :play_pause:").then((msg) => {
      setTimeout(() => msg.delete(), 1000);
    });
  }
}
