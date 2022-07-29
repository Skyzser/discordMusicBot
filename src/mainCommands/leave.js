const { getVoiceConnection } = require('@discordjs/voice');

module.exports = async function leave(message, songQueue) {
    //message.reply('!leave not implemented yet!');
    const userInChannel = await message.member.voice.channel;
    const botInChannel = await getVoiceConnection(message.guild.id);  // message.guild.id acts as the bot's id
    if(!userInChannel) {  // Check if user is in a voice channel
        message.reply('Must join a voice channel first to use main commands!');
    } else {
        if(!botInChannel) {  // Check if bot is in a voice channel
            message.reply('I am not in the voice channel!');
        } else {
            await message.channel.send('Leaving voice channel...')
            .then(msg => {
                setTimeout(() => msg.delete(), 500)
            });
            botInChannel.destroy();
            songQueue.splice(0, songQueue.length);  // Empty the queue
        }
    }
};