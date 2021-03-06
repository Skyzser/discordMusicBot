require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on('ready', () => {
    console.log(`${client.user.tag} logged in!`);
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
            mainCommands(message, commandName, parameters, SONG_QUEUE);
            minorCommands(client, message, commandName, parameters);
        }
        //initialTest(message);  // Small test done at the start for learning purposes!
    }
});
client.login(process.env.BOT_TOKEN);

function mainCommands(message, commandName, parameters, songQueue) {
    switch(commandName) {
        case 'help': 
            const help = require('./mainCommands/help.js');
            help(message);
            break;
        case 'play':
            const play = require('./mainCommands/play.js');
            play(message, parameters, songQueue);
            break;
        case 'pause':
            const pause = require('./mainCommands/pause.js');
            pause(message);
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