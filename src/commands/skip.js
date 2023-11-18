import { getVoiceConnection } from '@discordjs/voice';

export default async function Skip({ message, parameters, songQueue, player }) {
    const botInChannel = await getVoiceConnection(message.guild.id);  // message.guild.id acts as the bot's id
    if(!botInChannel) message.reply('The bot is not in the voice channel!');
    else {
        if(songQueue.length === 0) message.reply('There are no songs in the queue!');
        else {
            // If you just type !skip, it will skip the current song
            if(parameters.length === 0) {
                const skippedSong = songQueue.shift();
                message.channel.send(`Skipped **${skippedSong.title}**`);

                if(songQueue.length === 0) player.stop();
                else {
                    player.play(songQueue[0].resource);
                    message.channel.send(`Now playing **${songQueue[0].title}**`);
                }
            }
            else {
                const numberOfSongsToSkip = parameters[0];
                if(Number(numberOfSongsToSkip)) {
                    if(numberOfSongsToSkip >= songQueue.length) {
                        songQueue.splice(0, songQueue.length);
                        message.channel.send(`Skipped **all** songs in the queue!`);
                    } else {
                        songQueue.splice(0, songQueue.length - (songQueue.length - numberOfSongsToSkip));
                        message.channel.send(`Skipped **${numberOfSongsToSkip}** songs in the queue!`);
                    }

                    if(songQueue.length === 0) player.stop();
                    else {
                        player.play(songQueue[0].resource);
                        message.channel.send(`Now playing **${songQueue[0].title}**`);
                    }
                } else message.reply('Please provide a valid number for the total number of songs to be skipped!\nFor help, type **!help**');
            }
        }
    }
};