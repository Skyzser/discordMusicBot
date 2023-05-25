import { joinVoiceChannel, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import axios from 'axios';
import play from 'play-dl';

export default async function Command({ message, parameters, songQueue, player }) {
    const userInChannel = await message.member.voice.channel;
    const botInChannel = getVoiceConnection(message.guild.id);
    // Check if user is in a voice channel
    if(!userInChannel) message.reply('You are not in a voice channel!');
    else {
        const searchQuery = parameters.toString();
        // Check if user supplied a parameter to request a search for
        if(searchQuery === '') message.reply('Please supply a valid song request!');
        else {
            const response = await fetchQuery(searchQuery);
            const videoURL = `https://www.youtube.com/watch?v=${response[0].id.videoId}`;
            const stream = await play.stream(videoURL, { quality: 2 });

            const connection = joinVoiceChannel({
                channelId: userInChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            songQueue.push({
                title: (response[0].snippet.title)
                    .replaceAll('&#39;', '\'')
                    .replaceAll('&amp;', '&')
                    .replaceAll('&quot;', '\"'),
                url: videoURL,
                resource: resource
            });

            if(songQueue.length === 1) {
                connection.subscribe(player);
                player.play(songQueue[0].resource);
            }
            message.reply(`${videoURL} added to queue at position: **${songQueue.length}**`);
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