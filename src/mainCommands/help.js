const { MessageEmbed } = require('discord.js');

module.exports = function help(message) {
    const embed = new MessageEmbed()
        .setColor('#0B1D46')  // Colour of sidebar
        .setTitle('Bot Commands')
        .setAuthor(`Requested by ${message.author.tag}`)
        .setDescription('\u200B')
        .addFields(
            { name: '**List of all the commands the bot can use:**', value: '\u200B' },
            { name: '-List of commands:', value: '`!help`' },
            { name: '-Bot joins a voice channel and plays music:', value: '`!play <title>`' },
            { name: '-Pauses the current song playing:', value: '`!pause`' },
            { name: '-Skips the current song:', value: '`!skip`' },
            { name: '-Loops the current song/unloops the current song:', value: '`!loop`' },
            { name: '-Allows to view the full list of songs queued:', value: '`!q`' },
            { name: '-Stops the music and leaves the voice channel:', value: '`!leave`' },
            { name: '\u200B', value: '\u200B' },
            { name: '-Displays general statistics of the bot:', value: '`!ping`' },
            { name: '-Roll *A* amount of *X* sided dice:', value: '`!roll <AdX>`' },
            { name: '-Purge *x* amount of messages (command not included in *x* amount):', value: '`!purge <x>`' },
            { name: '-Kick a user:', value: '`!kick <@user>`' },
        )
    message.channel.send( {embeds: [embed]} );
};