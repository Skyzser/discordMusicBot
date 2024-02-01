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
      /* ==========================  Make this a function that both video and playlist can use ==========================
      const videoURL = `https://www.youtube.com/watch?v=${response.id.videoId}`;

      // This is a workaround for the play-dl package not being able to play age restricted videos
      let stream = null;
      try {
        stream = await play.stream(videoURL, { quality: 2 });
      } catch (e) {
        message.reply("This video is age restricted and cannot be played!");
        return;
      }

      const connection = joinVoiceChannel({
        channelId: userInChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      songQueue.push({
        title: response[0].snippet.title
          .replaceAll("&#39;", "'")
          .replaceAll("&amp;", "&")
          .replaceAll("&quot;", '"'),
        url: videoURL,
        resource: resource,
      });

      if (songQueue.length === 1) {
        connection.subscribe(player);
        player.play(songQueue[0].resource);
      }
      message.reply(
        `${videoURL} added to queue at position: **${songQueue.length}**`
      );
      */
      console.log(response.type);
      console.log(response.data);
    }
  }
}

async function fetchQuery(query) {
  const baseURL = "https://www.googleapis.com/youtube/v3";
  let url = "";
  let response = null;
  let result = {
    type: "",
    data: null,
  };

  // To handle playlists, otherwise it is a video
  if (query.includes("https://www.youtube.com/playlist?list=")) {
    const playlistID = query.split("playlist?list=")[1];
    url = `${baseURL}/playlistItems?key=${process.env.YT_API_KEY}&part=snippet&playlistId=${playlistID}&maxResults=50`;
    response = await axios.get(url);
    // Check if playlist exists or is private
    // Get more than 50 videos from a playlist

    result.type = "playlist";
    result.data = response.data.items[5];
  } else {
    url = `${baseURL}/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&q=${query}`;
    response = await axios.get(url);
    // Check if video exists or is private

    result.type = "video";
    result.data = response.data.items[0];
  }
  return result;
}
