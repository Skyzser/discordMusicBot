import { joinVoiceChannel, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";
import axios from "axios";

export default async function Play({
  message,
  parameters,
  songQueue,
  player,
  botDisconnected,
}) {
  const userInChannel = await message.member.voice.channel;
  // Check if user is in a voice channel
  if (!userInChannel) return message.reply("You are not in a voice channel!");

  const searchQuery = parameters.toString();
  // Check if user supplied a parameter to request a search for
  if (searchQuery === "")
    return message.reply("Please supply a valid song request!");

  const response = await fetchQuery(searchQuery);

  if (response.data === "quotaExceeded") {
    return message.reply(
      "The daily quota for the YouTube API has been exceeded, please try again tomorrow!"
    );
  }
  // Check if video/playlist exists
  if (response.data === null || response.data.length === 0)
    return message.reply("This video does not exist or is private!");
  if (response.data === "playlistNotFound")
    return message.reply("This playlist does not exist or is private!");

  // Reset botDisconnected flag when starting to play a new song
  botDisconnected.state = false;

  // Join voice channel
  const connection = joinVoiceChannel({
    channelId: userInChannel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  if (response.type === "video") {
    const result = await addResourceToQueue(
      message,
      songQueue,
      response.data[0],
      response.type
    );
    if (result) {
      if (songQueue.length === 1) {
        connection.subscribe(player);
        player.play(songQueue[0].resource);
      }
      message.reply(
        `${songQueue[songQueue.length - 1].url} added to queue at position: **${
          songQueue.length
        }**`
      );
    }
  } else {
    let faultyVideos = 0;
    message.reply(
      `Adding ${response.data.length} ${
        response.data.length === 1 ? "song" : "songs"
      } from playlist to queue...`
    );
    for (let i = 0; i < response.data.length; i++) {
      // Check if the bot has been disconnected before adding each song
      if (botDisconnected.state) {
        songQueue.splice(0, songQueue.length); // Precaution as !leave command doesn't clear the queue fully
        return;
      }
      const result = await addResourceToQueue(
        message,
        songQueue,
        response.data[i],
        response.type
      );
      if (!result) faultyVideos++;
    }
    const resLen = response.data.length - faultyVideos;
    // Check if songQueue is equal to the length of the playlist, otherwise there is already a song before it so don't skip that song
    if (resLen > 0 && songQueue.length === resLen) {
      connection.subscribe(player);
      player.play(songQueue[0].resource);
    }
    if (resLen !== 0) {
      message.reply(
        `${resLen} ${
          resLen === 1 ? "song" : "songs"
        } from playlist added to queue at position: **${
          songQueue.length - resLen + 1
        }** to **${songQueue.length}**`
      );
    } else {
      message.reply(`No songs from the playlist could be added to the queue!`);
    }
  }
}

async function handleResponseOutput(url, type) {
  let response = null;
  try {
    response = await axios.get(url);
  } catch (e) {
    return e.response.data.error.errors[0].reason;
  }

  // In the case of playlists, check if the playlist has more than 50 videos (keep cylcing through the pages until there are no more videos to fetch)
  if (type === "playlist") {
    while (response.data.nextPageToken) {
      const nextPage = await axios.get(
        `${url}&pageToken=${response.data.nextPageToken}`
      );
      response.data.items = response.data.items.concat(nextPage.data.items);
      response.data.nextPageToken = nextPage.data.nextPageToken;
    }
  }

  return response.data.items;
}

async function fetchQuery(query) {
  const baseURL = "https://www.googleapis.com/youtube/v3";
  let url = "";
  let type = "";

  // To handle playlists, otherwise it is a video
  if (query.includes("https://www.youtube.com/playlist?")) {
    const playlistID = query.split("list=")[1];
    url = `${baseURL}/playlistItems?key=${process.env.YT_API_KEY}&part=snippet&playlistId=${playlistID}&maxResults=50`;
    type = "playlist";
  } else {
    url = `${baseURL}/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&q=${query}`;
    type = "video";
  }

  return {
    type: type,
    data: await handleResponseOutput(url, type),
  };
}

async function generateStream(url) {
  // Can do reject(err) instead of resolve for the error, and then handle the error outside, but this solution is cleaner
  return new Promise((resolve, reject) => {
    let stream = ytdl(url, {
      filter: "audioonly",
      fmt: "mp3",
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      bitrate: 128,
      quality: "lowestaudio",
    })
      .on("error", (err) => {
        resolve(null);
      })
      .on("response", () => {
        resolve(stream);
      });
  });
}

async function addResourceToQueue(message, songQueue, response, type) {
  // Playlist items have a different structure than videos
  const ID =
    type === "video"
      ? response.id.videoId
      : response.snippet.resourceId.videoId;
  const videoURL = `https://www.youtube.com/watch?v=${ID}`;

  const stream = await generateStream(videoURL);
  if (!stream) {
    await message.channel
      .send(`The video: ${videoURL} cannot be played!`)
      .then((msg) => {
        setTimeout(() => msg.delete(), 3000);
      });
    return false;
  }

  const resource = createAudioResource(stream, {
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

  return true;
}
