const { MessageEmbed } = require('discord.js');

module.exports = function q(message, songQueue) {
    if(songQueue.length < 1) {
        message.channel.send('Queue is empty!');
    } else {
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#0B1D46')
                .setTitle('Song Queue')
                .setAuthor(`Requested by ${message.author.tag}`)
                .setDescription('\u200B')
                .addFields(
                    songQueue.map((song, i) => {return {'name': `Song ${i + 1}: ${song}`, 'value': '<link>'}})
                    // map(element, index)
                    // Basically song is the element (the song) in the songQueue array. It maps (converts) to the object {'name': `Song ${i + 1}: ${song}`, 'value': '<link>'}
                    // {return {object}} because JS cannot determine which is the function and which is the object, which is why you need return
                )
            ]
        });
    }
};