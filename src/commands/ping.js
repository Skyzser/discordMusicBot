import { MessageEmbed } from "discord.js";

export default function Ping({ client, message }) {
  const embed = new MessageEmbed()
    .setColor("#0B1D46") // Colour of sidebar
    .setTitle("General Bot Information")
    .setAuthor({ name: `Requested by ${message.author.username}` })
    .addFields(
      { name: "• Created by:", value: "<@352538460055273483>" },
      {
        name: "• GitHub:",
        value: "https://github.com/Skyzser/discordMusicBot.git",
      },
      { name: "• Bot Uptime:", value: `${generateTimeframe(client.uptime)}` },
      { name: "• Bot Latency:", value: `${client.ws.ping} ms` },
      { name: "• Server count:", value: `${client.guilds.cache.size} servers` }
    );
  message.channel.send({ embeds: [embed] });
}

function generateTimeframe(uptime) {
  let totalSeconds = uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${
    hours !== 1 ? "s" : ""
  }, ${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${
    seconds !== 1 ? "s" : ""
  }`;
}
