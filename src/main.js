require('dotenv').config();

const { Client, Intents } = require('discord.js');
// 'getVoiceConnection' is used to check if bot is in VC
// 'createAudioPlayer' is used to create a player for the bot to play music.
const { getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

const player = createAudioPlayer();  // Player for the music

client.on('ready', () => {
    console.log(`${client.user.tag} logged in!`);
    const Guilds = client.guilds.cache.map(guild => `Server name: ${guild.name} and server ID: ${guild.id}`);
    console.log(Guilds);
});

const PREFIX = '!';
let SONG_QUEUE = [];  // To store the list of songs as a queue
client.on('messageCreate', async (message) => {
    if(!message.author.bot) {
        if(message.content.startsWith(PREFIX)) {
            // Spread Operator: E.g. const [commandName, ...parameters] = commandName, [parameter 1, parameter 2, etc...]
            const [commandName, ...parameters] = message.content
            .trim()
            .substring(1)
            .split(/\s+/);  // The first element of the array destructured as the command, the other elements are the parameters

            // Object to store all parameters needed for all commands
            const params = {
                client: client,
                message: message,
                commandName: commandName,
                parameters: parameters,
                songQueue: SONG_QUEUE,
                player: player
            }
            
            // This replaces the whole switch statement for each command. Now you can just add a new command file in the commands folder and add a new parameter in the object above if needed
            try {
                // Dynamically import the commands
                const command = require(`./commands/${commandName}.js`);
                command(params);
            } catch(err) { console.log(err); }
        }
    }
});

// For live updates to users in voice channel, such as clearing queue if bot gets disconnected through admin privileges 
client.on('voiceStateUpdate', async (oldState, newState) => {
    // Old state is the voice state before any updates (e.g. joining the voice channel)
    // New state is the voice state after any updates (e.g. leaving the voice channel)
    let VC;  // The current voice channel variable
    if(oldState.channelId === null) {  // Null signifies state does not exist. (i.e. let 1 = joining. If someone joins, oldState is null (since no history) and newState is 1)
        console.log(`${oldState.member.user.tag} joined the voice channel`);
        VC = await client.channels.cache.get(newState.channelId);
    } else if(newState.channelId === null) {
        console.log(`${newState.member.user.tag} left the voice channel`);
        VC = await client.channels.cache.get(oldState.channelId);
        if(newState.id === client.user.id) {
            SONG_QUEUE.splice(0, SONG_QUEUE.length);  // Empty the queue
        }
    } else {
        VC = await client.channels.cache.get(oldState.channelId);
    }
    // VC.members.filter returns the list of members with id equal to the client id. If that list is empty, must means the bot is not in the list, so the bot is not in the voice channel
    if(VC.members.size <= 1 && VC.members.filter(member => member.id === client.user.id).size !== 0) {  // If the bot is the only member in the voice channel, leave the voice channel
        const botInChannel = await getVoiceConnection(VC.guild.id);
        // Thus far, the only error that arises from this try/catch block of code is when the client is restarted while the bot is still in voice channel, and then the all users leave to try get the bot to leave (the whole reason for the if condition above)
        try {
            botInChannel.destroy();
        } catch(err) {
            console.log('voiceStateUpdate error');
        }
    }
});

client.login(process.env.BOT_TOKEN);