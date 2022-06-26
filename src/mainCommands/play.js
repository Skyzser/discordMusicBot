const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = async function play(message, parameters) {
    //message.reply('!play not implemented yet!');
    const channel = await message.member.voice.channel;
    if(!channel) {  // Check if user is in a voice channel
        message.reply('Must join a voice channel first!');
    } else {
        if(parameters[0] === undefined) {  // Check if user supplied a parameter to request a search for
            message.reply('Please supply a valid song request!');
        } else {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            message.channel.send(`Searching **${parameters[0]}**...`);
        }
    }
};