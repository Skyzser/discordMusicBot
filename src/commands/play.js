import { joinVoiceChannel, createAudioResource } from '@discordjs/voice';
import axios from 'axios';

export default async function play({ message, parameters, songQueue, player }) {
    const userInChannel = await message.member.voice.channel;
    // Check if user is in a voice channel
    if(!userInChannel) message.reply('You are not in a voice channel!');
    else {
        const searchQuery = parameters[0];
        if(searchQuery === undefined) {  // Check if user supplied a parameter to request a search for
            message.reply('Please supply a valid song request!');
        } else {
            const response = await fetchQuery(searchQuery);
            const firstResult = response[0];
            const videoId = firstResult.id.videoId;
            message.reply(`https://www.youtube.com/watch?v=${videoId}`);
            /*
            const connection = joinVoiceChannel({
                channelId: userInChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            message.channel.send(`Searching **${searchQuery}**...`);
            // --------------------------------------------------------------------------------------------
            // Temporary fix for the fact that the search function is not yet implemented
            songQueue.push(searchQuery);
            message.channel.send(`Added **${searchQuery}** to queue!`);
            // Display embed only when current song from queue is playing
            // --------------------------------------------------------------------------------------------
            const resource = createAudioResource('./src/test.mp3');  // Create an audio resource from a file path  (should be songQueue[0])
            player.play(resource);

            connection.subscribe(player);
            */
        }
    }
};

async function fetchQuery(query) {
    // Update to better querying system //
    const baseURL = 'https://www.googleapis.com/youtube/v3';
    const url = `${baseURL}/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&q=${query}`;
    const response = await axios.get(url);
    return response.data.items;
}