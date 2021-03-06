const { MessageEmbed } = require('discord.js');

module.exports = function ping(client, message) {
    var uptime = client.uptime;  // The duration since the bot started running
    uptime = generateTimeframe(uptime);

    const embed = new MessageEmbed()
        .setColor('#0B1D46')  // Colour of sidebar
        .setTitle('General Bot Information')
        .setAuthor(`Requested by ${message.author.tag}`)
        .addFields(
            { name: '-Created by:', value: '<@352538460055273483>' },
            { name: '-GitHub:', value: 'https://github.com/Skyzser/discordMusicBot.git' },
            { name: '-Bot Uptime:', value: `${uptime}` },
            { name: '-Bot Latency:', value: `${client.ws.ping} ms` },
        )
    message.channel.send( {embeds: [embed]} );
};

function generateTimeframe(uptime) {
    let totalSeconds = (uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
};