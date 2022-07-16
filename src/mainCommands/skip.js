module.exports = function skip(message, songQueue) {
    var skippedSong = songQueue.shift();
    message.channel.send(`Skipped **${skippedSong}**`);
};