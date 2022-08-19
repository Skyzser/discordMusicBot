const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');

module.exports = async function play(message, parameters, songQueue, player) {
    const resource = createAudioResource('./src/test.mp3');  // Create an audio resource from a file path
    const userInChannel = await message.member.voice.channel;

    if(!userInChannel) {  // Check if user is in a voice channel
        message.reply('You are not in a voice channel!');
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
            // --------------------------------------------------------------------------------------------
            // Temporary fix for the fact that the search function is not yet implemented
            songQueue.push(parameters[0]);
            message.channel.send(`Added **${parameters[0]}** to queue!`);
            // Display embed only when current song from queue is playing
            // --------------------------------------------------------------------------------------------
            player.play(resource);

            connection.subscribe(player);
        }
    }
};