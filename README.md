<h1>discordMusicBot</h1>

<h2>Description</h2>
A music bot developed with Javascript using the Discord API Library, Discord.js, and the YouTube API. This bot allows you to play music in a voice channel by querying through user input.
<hr>
<br>
<h2>Features</h2>

- Full music functionality: Play, Pause, Skip.
- Other minor commands, such as kicking a user.
- For full list of commands:
    - Type <b>!help</b> in a channel while the bot is running.
<hr>
<br>
<h2>Technology</h2>

- JavaScript
- Node.js
- Discord.js
<hr>
<br>
<h2>Setup Guide</h2>

- Create Discord application: https://discord.com/developers/applications
- Create a Google Cloud project to allow the bot to interact with the YouTube API: https://console.cloud.google.com/
- Create an API Key for the YouTube API.
- Type <b>npm install</b> on the terminal to install all dependencies.
- Create a <b>.env</b> file in your project directory to store the Discord Bot Token and YouTube API Key once the applications have been created.
- Type <b>npm run dev</b> on the terminal to start running the bot.
  - You will need <b>Nodemon</b> installed to run the bot using this script command (or just create a new script command).