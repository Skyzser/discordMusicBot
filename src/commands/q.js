import { MessageEmbed } from 'discord.js';

export default function Queue({ message, songQueue }) {
    if(songQueue.length === 0) message.channel.send('Queue is empty!');
    else {
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#0B1D46')
                .setTitle('Song Queue')
                .setAuthor({ name: `Requested by ${message.author.username}` })
                .setDescription('\u200B')
                .addFields(songQueue.map(({title, url}, i) => {return {'name': `• ${i + 1}: ${title}`, 'value': `${url}`}}))
            ]
        });
    }
};