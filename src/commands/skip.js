const { getVoiceConnection } = require('@discordjs/voice');

module.exports = async function skip(params) {
    const message = params.message, songQueue = params.songQueue;
    
    const botInChannel = await getVoiceConnection(message.guild.id);  // message.guild.id acts as the bot's id
    if(!botInChannel) {  // Check if bot is in a voice channel
        message.reply('The bot is not in the voice channel!');
    } else {
        var skippedSong = songQueue.shift();
        message.channel.send(`Skipped **${skippedSong}**`);
    }
};