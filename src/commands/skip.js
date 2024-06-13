import { getVoiceConnection } from "@discordjs/voice";

export default async function Skip({ message, parameters, songQueue, player }) {
  const botInChannel = await getVoiceConnection(message.guild.id); // message.guild.id acts as the bot's id
  if (!botInChannel) message.reply("The bot is not in the voice channel!");
  else {
    if (songQueue.length === 0)
      message.reply("There are no songs in the queue!");
    else {
      // If you just type !skip, it will skip the current song
      if (parameters.length === 0) {
        const skippedSong = songQueue.shift();
        await message.channel
          .send(`Skipped **${regexChecker(skippedSong.title)}** :track_next:`)
          .then((msg) => {
            setTimeout(() => msg.delete(), 3000);
          });

        if (songQueue.length === 0) player.stop();
        else {
          player.play(songQueue[0].resource);
          await message.channel
            .send(
              `Now playing **${regexChecker(
                songQueue[0].title
              )}** :arrow_forward:`
            )
            .then((msg) => {
              setTimeout(() => msg.delete(), 3000);
            });
        }
      } else {
        const numberOfSongsToSkip = parameters[0];
        if (Number(numberOfSongsToSkip)) {
          if (numberOfSongsToSkip >= songQueue.length) {
            songQueue.splice(0, songQueue.length);
            await message.channel
              .send(`Skipped **all** songs in the queue :track_next:`)
              .then((msg) => {
                setTimeout(() => msg.delete(), 3000);
              });
          } else {
            songQueue.splice(
              0,
              songQueue.length - (songQueue.length - numberOfSongsToSkip)
            );
            await message.channel
              .send(
                `Skipped **${numberOfSongsToSkip}** songs in the queue :track_next:`
              )
              .then((msg) => {
                setTimeout(() => msg.delete(), 3000);
              });
          }

          if (songQueue.length === 0) player.stop();
          else {
            player.play(songQueue[0].resource);
            await message.channel
              .send(
                `Now playing **${regexChecker(
                  songQueue[0].title
                )}** :arrow_forward:`
              )
              .then((msg) => {
                setTimeout(() => msg.delete(), 3000);
              });
          }
        } else
          message.reply(
            "Please provide a valid number for the total number of songs to be skipped!\nFor help, type **!help**"
          );
      }
    }
  }
}

// To workaround Discord formatting when title of song includes special characters
function regexChecker(string) {
  let regex = /(\*|_|~|`|\\|\||\#)/g;
  return string.replaceAll(regex, "\\$1");
}
