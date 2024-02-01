/* 
    Based on the RPG dice rolling format: AdX. 
    A = # of dice to be rolled.
    X = # of sides of each dice.
    E.g. 1d4 = roll one 4-sided die.
    For more info: https://en.wikipedia.org/wiki/Dice_notation
*/

export default function Roll({ message, parameters }) {
  if (parameters.length === 0)
    message.reply(
      "Please provide a value after the !roll command.\nFor help, type **!help**"
    );
  else {
    if (!parameters[0].includes("d"))
      message.reply(
        "Please provide the valid format after the !roll command.\nFor help, type **!help**"
      );
    else {
      const dice = parameters[0].substring(0, parameters[0].indexOf("d"));
      const sides = parameters[0].substring(parameters[0].indexOf("d") + 1);
      if (Number(dice) && Number(sides)) {
        if (dice <= 0 || sides <= 0)
          message.reply("You cannot have less than 1 dice or sides!");
        else if (dice > 500 || sides > 500)
          message.reply("Number of dice/sides is too large!");
        else {
          let rolls = [];
          for (let i = 0; i < dice; i++) {
            let randomRoll = Math.floor(Math.random() * (sides - 1 + 1)) + 1; // Sides is the max number and 1 is the min number (the first +1 is to include the max number)
            rolls.push(randomRoll);
          }
          message.reply(`Rolled ${dice}, ${sides}-sided dice:\n${rolls} `);
        }
      } else
        message.reply(
          "Please provide a valid number for the amount of dice or sides (0 not valid)!\nFor help, type **!help**"
        );
    }
  }
}
