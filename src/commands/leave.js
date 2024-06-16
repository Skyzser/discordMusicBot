import { getVoiceConnection } from "@discordjs/voice";

export default async function Leave({ message, songQueue }) {
  const botInChannel = getVoiceConnection(message.guild.id);
  if (!botInChannel) message.reply("The bot is not in the voice channel!");
  else {
    botInChannel.destroy();
    songQueue.splice(0, songQueue.length); // Empty the queue
  }
}
