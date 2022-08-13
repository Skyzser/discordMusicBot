const { getVoiceConnection } = require('@discordjs/voice');

module.exports = async function leave(message, songQueue) {
    const botInChannel = await getVoiceConnection(message.guild.id);
    if(!botInChannel) {  // Check if bot is in a voice channel
        message.reply('The bot is not in the voice channel!');
    } else {
        await message.channel.send('Leaving voice channel...')
        .then(msg => {
            setTimeout(() => msg.delete(), 500)
        });
        botInChannel.destroy();
        songQueue.splice(0, songQueue.length);  // Empty the queue
    }
};