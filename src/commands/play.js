import { joinVoiceChannel, createAudioResource } from "@discordjs/voice";
import axios from "axios";
import play from "play-dl";

export default async function Play({ message, parameters, songQueue, player }) {
  const userInChannel = await message.member.voice.channel;
  // Check if user is in a voice channel
  if (!userInChannel) message.reply("You are not in a voice channel!");
  else {
    const searchQuery = parameters.toString();
    // Check if user supplied a parameter to request a search for
    if (searchQuery === "")
      message.reply("Please supply a valid song request!");
    else {
      const response = await fetchQuery(searchQuery);
      // Check if video or playlist exists
      if (response.data === null || response.data.length === 0) {
        if (response.type === "video")
          message.reply("This video does not exist or is private!");
        else message.reply("This playlist does not exist or is private!");
        return;
      }

      // Join voice channel
      const connection = joinVoiceChannel({
        channelId: userInChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      if (response.type === "video") {
        await addResourceToQueue(message, songQueue, response.data[0]);
        if (songQueue.length === 1) {
          connection.subscribe(player);
          player.play(songQueue[0].resource);
        }
        message.reply(
          `${songQueue[songQueue.length - 1].url} added to queue at position: **${songQueue.length}**`
        );
      } else {
        console.log(response.data[0]);
        console.log(response.data[1]);
      }
    }
  }
}

async function fetchQuery(query) {
  const baseURL = "https://www.googleapis.com/youtube/v3";
  let url = "";
  let type = "";
  let response = null;

  // To handle playlists, otherwise it is a video
  if (query.includes("https://www.youtube.com/playlist?list=")) {
    const playlistID = query.split("playlist?list=")[1];
    url = `${baseURL}/playlistItems?key=${process.env.YT_API_KEY}&part=snippet&playlistId=${playlistID}&maxResults=50`;
    type = "playlist";
  } else {
    url = `${baseURL}/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&q=${query}`;
    type = "video";
  }

  // If the request fetch fails (such as fetching a video/playlist that doesn't exist or is private), return null for the data (still return the type (video or playlist))
  try {
    response = await axios.get(url);
    return {
      type: type,
      data: response.data.items,
    };
  } catch (e) {
    return {
      type: type,
      data: null,
    };
  }
}

async function addResourceToQueue(message, songQueue, response) {
  const videoURL = `https://www.youtube.com/watch?v=${response.id.videoId}`;

  // This is a workaround for the play-dl package not being able to play age restricted videos
  let stream = null;
  try {
    stream = await play.stream(videoURL, { quality: 2 });
  } catch (e) {
    message.reply("This video is age restricted and cannot be played!");
    return;
  }

  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });

  songQueue.push({
    title: response.snippet.title
      .replaceAll("&#39;", "'")
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"'),
    url: videoURL,
    resource: resource,
  });
}
