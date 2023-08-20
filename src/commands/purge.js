export default async function Purge({ message, parameters }) {
    if(parameters.length === 0) message.reply('Please provide a value after the !purge command.\nFor help, type **!help**');
    else {
        var total = parameters[0];
        if(Number(total)) {
            if(total >= 2 && total <= 100) {
                await message.delete();  // To not include the command itself in the deleted messages
                message.channel.bulkDelete(total, true)
                    .then(messages => {
                        message.channel.send(`Deleted ${messages.size} messages!`)
                        .catch(err => console.log(err))
                        .then(msg => {
                            setTimeout(() => msg.delete(), 500)
                        });
                    });
            } else message.reply('Must provide a number between 2 and 100 (inclusive)!');
        } else message.reply('Please provide a valid number for the total number of messages to be deleted (0 not valid)!\nFor help, type **!help**');
    }
};