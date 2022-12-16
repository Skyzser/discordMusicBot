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
            mainCommands(message, commandName, parameters, SONG_QUEUE, player);
            minorCommands(client, message, commandName, parameters);
        }
        //initialTest(message);  // Small test done at the start for learning purposes!
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

function mainCommands(message, commandName, parameters, songQueue, player) {
    switch(commandName) {
        case 'help': 
            const help = require('./mainCommands/help.js');
            help(message);
            break;
        case 'play':
            const play = require('./mainCommands/play.js');
            play(message, parameters, songQueue, player);
            break;
        case 'pause':
            const pause = require('./mainCommands/pause.js');
            pause(player);
            break;
        case 'skip':
            const skip = require('./mainCommands/skip.js');
            skip(message, songQueue);
            break;
        case 'loop':
            const loop = require('./mainCommands/loop.js');
            loop(message, songQueue);
            break;
        case 'q':
            const q = require('./mainCommands/q.js');
            q(message, songQueue);
            break;
        case 'leave':
            const leave = require('./mainCommands/leave.js');
            leave(message, songQueue);
    }
};
function minorCommands(client, message, commandName, parameters) {
    switch(commandName) {
        case 'ping':
            const ping = require('./minorCommands/ping.js');
            ping(client, message);
            break;
        case 'roll':
            const roll = require('./minorCommands/roll.js');
            roll(message, parameters);
            break;
        case 'purge':
            const purge = require('./minorCommands/purge.js');
            purge(message, parameters);
            break;
        case 'kick':
            const kick = require('./minorCommands/kick.js');
            kick(message, parameters);
    }
};

function initialTest(message) {
    const welcomeMessage = ['hi', 'hello', 'hey'];
    for(var i = 0; i < welcomeMessage.length; i++) {
        if(message.content.toLowerCase() === welcomeMessage[i]) {
            //message.reply(Hi, ${message.author});  // To reply to a message
            message.channel.send(Hi, `${message.author}`);  // To send a message as a standalone message
        }
    }
};