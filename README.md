# discordMusicBot

## Description
A music bot developed with JavaScript using the Discord API Library, Discord.js, and the YouTube API. This bot allows you to play music in a voice channel by querying through user input.

## Features
- Full music functionality: Play, Pause, Skip.
- Other minor commands, such as kicking a user.
- For full list of commands:
    - Type <b>!help</b> in a channel while the bot is running.
- <b>P.S.</b> You can not query playlists, only individual videos/songs.

## Technology
- JavaScript
- Node.js

## Setup Guide
These instructions will help you set up the project on your local machine for running your own bot.

### Prerequisites
Before you begin, ensure you have the following prerequisites:

- <b>Node.js</b> (version >=18.16.0)
- <b>npm</b> (version >=9.5.1)
- Created a Discord application and bot: https://discord.com/developers/applications
- Created a Google Cloud project to allow the bot to interact with the YouTube API: https://console.cloud.google.com/ (You will need to enable the YouTube Data API v3)

### Installation
- Clone the repository: `git clone https://github.com/Skyzser/discordMusicBot.git`
- Navigate to the project directory: `cd discordMusicBot`
- Install all dependencies: `npm install`
- Create a <b>.env</b> file in your project directory to store the Discord Bot Token and YouTube API Key: 
```
BOT_TOKEN=<YOUR_DISCORD_BOT_TOKEN>
YT_API_KEY=<YOUR_YOUTUBE_API_KEY>
```

### Usage
There are two ways you can run the bot (need to be in the project directory):
- First method:
  - Type `node main.js` on the terminal to start running the bot.
- Second method:
  - Type `npm run dev` on the terminal to start running the bot.
    - You will most likely need <b>Nodemon</b> installed to run the bot using this script command (or just create a new script command).