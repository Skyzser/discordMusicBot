import { MessageEmbed } from "discord.js";
import { Pagination } from "pagination.djs";

export default function Queue({ message, songQueue }) {
  if (songQueue.length === 0) message.reply("Queue is empty!");
  else {
    if (songQueue.length === 1) {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#0B1D46")
            .setAuthor({ name: `Requested by ${message.author.username}` })
            .addFields({
              name: "**Now Playing**",
              value: `[${songQueue[0].title}](${songQueue[0].url})`,
            })
            .addFields({ name: "**Queue**", value: "Queue empty!" }),
        ],
      });
    } else {
      const pagination = new Pagination(message, {
        idle: 60000,
      });
      const itemsPerPage = 7;
      const firstSong = songQueue[0];
      const remainderSongQueue = songQueue.slice(1);
      // -1 to account for the first song
      const embeds = embedGenerator(
        message,
        firstSong,
        remainderSongQueue,
        itemsPerPage - 1
      );

      pagination.setEmbeds(embeds, (embed, index, array) => {
        return embed.setFooter({
          text: `Page: ${index + 1}/${array.length} \tQueue Size: ${
            songQueue.length
          }`,
        });
      });
      pagination.render();
    }
  }
}

function embedGenerator(message, firstSong, songQueue, itemsPerPage) {
  const embeds = [];
  let counter = 0;
  const numberOfPages = Math.ceil(songQueue.length / itemsPerPage);
  for (let i = 0; i < numberOfPages; i++) {
    const newEmbed = new MessageEmbed()
      .setColor("#0B1D46")
      .setAuthor({ name: `Requested by ${message.author.username}` })
      .addFields({
        name: "**Now Playing**",
        value: `[${firstSong.title}](${firstSong.url})`,
      })
      .addFields({
        name: "**Queue**",
        value: `${songQueue
          .slice(counter, counter + itemsPerPage)
          .map(
            (item, index) =>
              `${index + 2 + counter}. [${item.title}](${item.url})`
          )
          .join("\n")}`,
      });
    embeds.push(newEmbed);
    counter += itemsPerPage;
  }
  return embeds;
}
