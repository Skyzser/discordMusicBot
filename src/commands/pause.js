import { AudioPlayerStatus } from "@discordjs/voice";

export default async function Pause({ player, message }) {
  if (player.state.status === AudioPlayerStatus.Paused) {
    player.unpause();
    await message.channel.send("Playing :arrow_forward:").then((msg) => {
      setTimeout(() => msg.delete(), 3000);
    });
  } else {
    player.pause();
    await message.channel.send("Paused :pause_button:").then((msg) => {
      setTimeout(() => msg.delete(), 3000);
    });
  }
}
