import { MessageEmbed } from 'discord.js';

export default function Decider({ message, parameters }) {
    if(parameters.length === 0) message.reply('Please provide a value after the !decider command.\nFor help, type **!help**');
    else {
        const randomChoice = Math.floor(Math.random() * parameters.length);
        const embed = new MessageEmbed()
            .setColor('#0B1D46')  // Colour of sidebar
            .setTitle('Item Decider')
            .setAuthor({ name: `Requested by ${message.author.username}` })
            .addFields(
                { name: '**Item List**', value: `${parameters}` },
                { name: 'I choose:', value: `${parameters[randomChoice]}` }
            )
        message.channel.send( {embeds: [embed]} );
    }
};