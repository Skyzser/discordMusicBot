import { getVoiceConnection } from '@discordjs/voice';

export default async function skip({ message, songQueue }) {
    const botInChannel = await getVoiceConnection(message.guild.id);  // message.guild.id acts as the bot's id
    if(!botInChannel) message.reply('The bot is not in the voice channel!');
    else {
        var skippedSong = songQueue.shift();
        message.channel.send(`Skipped **${skippedSong}**`);
    }
};