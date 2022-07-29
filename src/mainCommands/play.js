const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = async function play(message, parameters, songQueue) {
    const userInChannel = await message.member.voice.channel;
    if(!userInChannel) {  // Check if user is in a voice channel
        message.reply('Must join a voice channel first to use main commands!');
    } else {
        if(parameters[0] === undefined) {  // Check if user supplied a parameter to request a search for
            message.reply('Please supply a valid song request!');
        } else {
            const connection = joinVoiceChannel({
                channelId: userInChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            message.channel.send(`Searching **${parameters[0]}**...`);
            songQueue.push(parameters[0]);
            // If discord bot not playing anything, say the bot is now playing the current top of queue.
            // Else, just say bot added request to queue.
            message.channel.send(`Added **${parameters[0]}** to queue!`);  // Temporary
        }
    }
};