import { MessageEmbed } from 'discord.js';

export default function Queue({ message, songQueue }) {
    if(songQueue.length === 0) message.channel.send('Queue is empty!');
    else {
        if(songQueue.length === 1) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#0B1D46')
                    .setAuthor({ name: `Requested by ${message.author.username}` })
                    .addFields({'name': '**Now Playing**', 'value': `[${songQueue[0].title}](${songQueue[0].url})`})
                    .addFields({'name': '**Queue**', 'value': 'Queue empty!'})
                ]
            });
        } else {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#0B1D46')
                    .setAuthor({ name: `Requested by ${message.author.username}` })
                    .addFields({'name': '**Now Playing**', 'value': `[${songQueue[0].title}](${songQueue[0].url})`})
                    .addFields({'name': '**Queue**', 'value': `${songQueue.slice(1).map((item, index) => `${index + 1}. [${item.title}](${item.url})`).join('\n')}`})
                ]
            });
        }
    }
};