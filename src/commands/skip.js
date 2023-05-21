import { getVoiceConnection } from '@discordjs/voice';

export default async function Command({ message, songQueue, player }) {
    const botInChannel = await getVoiceConnection(message.guild.id);  // message.guild.id acts as the bot's id
    if(!botInChannel) message.reply('The bot is not in the voice channel!');
    else {
        if(songQueue.length === 0) message.reply('There are no songs in the queue!');
        else {
            const skippedSong = songQueue.shift();
            message.channel.send(`Skipped **${skippedSong.title}**`);

            if(songQueue.length === 0) player.stop();
            else {
                player.play(songQueue[0].resource);
                message.channel.send(`Now playing **${songQueue[0].title}**`);
            }
        }
    }
};