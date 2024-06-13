export default async function Shuffle({ message, songQueue }) {
  const userInChannel = await message.member.voice.channel;
  // Check if user is in a voice channel
  if (!userInChannel) message.reply("You are not in a voice channel!");
  else {
    if (songQueue.length === 0) message.reply("The queue is empty!");
    else if (songQueue.length <= 2)
      message.reply(
        "Cannot shuffle with only one song playing/one song in the queue!"
      );
    else {
      // Remove first song from queue
      const currentSong = songQueue.shift();
      // Shuffle the queue
      songQueue = arrayShuffle(songQueue);
      // Add the first song back to the queue
      songQueue.unshift(currentSong);
      await message.channel
        .send("Queue shuffled :twisted_rightwards_arrows:")
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    }
  }
}

function arrayShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    // Queue will always swap the songs if there is only two
    if (arr.length === 2) j = 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
