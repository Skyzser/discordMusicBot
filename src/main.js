import "dotenv/config.js";
import { Client, Intents } from "discord.js";
import {
  getVoiceConnection,
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} from "@discordjs/voice";

const PREFIX = "!";
let dictionary = [];

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(`${client.user.username} has logged in.`);
  client.user.setActivity("!help for commands", { type: "LISTENING" });
  client.guilds.cache.forEach((guild) => {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const songQueue = [];

    dictionary.push({
      guildID: guild.id,
      songQueue: songQueue, // Store the reference in the dictionary
      player: player,
    });

    player.on(AudioPlayerStatus.Idle, () => {
      if (songQueue.length === 0) return;
      else {
        try {
          songQueue.shift();
          player.play(songQueue[0].resource);
        } catch (err) {
          //console.log('queue autoplay error');
        }
      }
    });
  });
});

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    if (message.content.startsWith(PREFIX)) {
      // Spread Operator: E.g. const [commandName, ...parameters] = commandName, [parameter 1, parameter 2, etc...]
      const [commandName, ...parameters] = message.content
        .trim()
        .substring(1)
        .split(/\s+/); // The first element of the array destructured as the command, the other elements are the parameters

      // Object to store all parameters needed for all commands
      const params = {
        client: client,
        message: message,
        commandName: commandName,
        parameters: parameters,
        songQueue: dictionary.find(
          ({ guildID }) => guildID === message.guild.id
        ).songQueue,
        player: dictionary.find(({ guildID }) => guildID === message.guild.id)
          .player,
      };

      try {
        // Dynamically import the commands
        const command = await import(`./commands/${commandName}.js`).then(
          (module) => module.default
        );
        command(params);
      } catch (err) {
        //console.log('commands error');
      }
    }
  }
});

// For live updates to users in voice channel, such as clearing queue if bot gets disconnected through admin privileges
client.on("voiceStateUpdate", async (oldState, newState) => {
  // Old state is the voice state before any updates (e.g. joining the voice channel)
  // New state is the voice state after any updates (e.g. leaving the voice channel)
  let VC; // The current voice channel variable
  // Null signifies state does not exist. (i.e. let 1 = joining. If someone joins, oldState is null (since no history) and newState is 1)
  if (oldState.channelId === null)
    VC = await client.channels.cache.get(newState.channelId);
  else if (newState.channelId === null) {
    VC = await client.channels.cache.get(oldState.channelId);
    if (newState.id === client.user.id) {
      const songQueue = dictionary.find(
        ({ guildID }) => guildID === newState.guild.id
      ).songQueue;
      songQueue.splice(0, songQueue.length); // Empty the queue
    }
  } else VC = await client.channels.cache.get(oldState.channelId);
  // VC.members.filter returns the list of members with id equal to the client id. If that list is empty, must mean the bot is not in the list, so the bot is not in the voice channel
  if (
    VC.members.size <= 1 &&
    VC.members.filter((member) => member.id === client.user.id).size !== 0
  ) {
    const botInChannel = await getVoiceConnection(VC.guild.id);
    // Thus far, the only error that arises from this try/catch block of code is when the client is restarted while the bot is still in voice channel, and then the all users leave to try to get the bot to leave (the whole reason for the if condition above)
    try {
      botInChannel.destroy();
    } catch (err) {
      //console.log('voiceStateUpdate error');
    }
  }
});
