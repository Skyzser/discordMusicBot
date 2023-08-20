import { Permissions } from 'discord.js';

export default async function Kick({ message, parameters }) {
    // Checks if the user has the permission to kick
    if(!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) message.reply('You do not have permissions to use this command!');
    else {
        if(parameters.length === 0) message.reply('Please provide a valid user tag!\nFor help, type **!help**');
        else {
            try {
                const userID = parameters[0].substring(2, parameters[0].length - 1);  // This converts the tag format: '<@id>' to just the id
                const member = await message.guild.members.fetch(userID);  // You want to get the member before moving on
                // Trying to get the member, but if it doesn't exist, throws error (must be inside try catch block)
                if(member) {  // If the member exists in the guild (server)
                    if(message.author.id === member.user.id) message.reply('You cannot kick yourself!');
                    else {
                        // Works as a promise
                        member
                            .kick()
                            .then((member) => message.channel.send(`${member} was kicked!`))
                            .catch((err) => message.reply('Permission denied to kick that user!'));
                    }
                }
            } catch(err) {
                message.reply('Member not found. Supply a valid user tag!\nFor help, type **!help**');
            }
        }
    }
};