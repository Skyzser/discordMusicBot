import { MessageEmbed } from 'discord.js';

export default function q({ message, songQueue }) {
    if(songQueue.length < 1) message.channel.send('Queue is empty!');
    else {
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#0B1D46')
                .setTitle('Song Queue')
                .setAuthor({ name: `Requested by ${message.author.tag}` })
                .setDescription('\u200B')
                .addFields(songQueue.map((song, i) => {return {'name': `Song ${i + 1}: ${song}`, 'value': '<link>'}}))
            ]
        });
    }
};