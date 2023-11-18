import { MessageEmbed } from 'discord.js';

export default function Help({ message }) {
    const embed = new MessageEmbed()
        .setColor('#0B1D46')  // Colour of sidebar
        .setTitle('Bot Commands')
        .setAuthor({ name: `Requested by ${message.author.username}` })
        .setDescription('\u200B')
        .addFields(
            { name: '**__List of all the commands the bot can use:__**', value: '\u200B' },
            { name: '• List of commands:', value: '`!help`' },
            { name: '• Bot joins a voice channel and plays music:', value: '`!play <name|URL>`' },
            { name: '• Pauses/unpauses the current song playing:', value: '`!pause`' },
            { name: '• Skips the current song or *x* amount of songs:', value: '`!skip | !skip <x>`' },
            { name: '• Allows to view the full list of songs queued:', value: '`!q`' },
            { name: '• Stops the music and leaves the voice channel:', value: '`!leave`' },
            { name: '\u200B', value: '\u200B' },
            { name: '• Displays general statistics of the bot:', value: '`!ping`' },
            { name: '• Roll *A* amount of *X* sided dice:', value: '`!roll <AdX>`' },
            { name: '• Purge *x* amount of messages before command:', value: '`!purge <x>`' },
            { name: '• Kick a user:', value: '`!kick @<user>`' },
            { name: '• Have bot pick an item from a list of items:', value: '`!decider <item1 item2 item3>`' }
        )
    message.channel.send( {embeds: [embed]} );
};