# discordMusicBot

## Description
A music bot developed with JavaScript using the Discord API Library, Discord.js, and the YouTube API. This bot allows you to play music in a voice channel by querying through user input.

> **Project Status (July 2026)**
>
> This project was originally developed in 2024, when all functionality (including music playback) was fully operational.
>
> The project is no longer maintained. While the bot itself still runs, the music functionality is now outdated and is not guaranteed to work reliably.
>
> The music system depends on several third-party libraries that have changed significantly over time, alongside frequent changes to YouTube's APIs and platform behaviour. In addition, this project was built using **Discord.js v13**, which is now outdated.
>
> Restoring full functionality would require:
> - Migrating the project from **Discord.js v13** to **Discord.js v14+**.
> - Updating the music playback system to work with the current YouTube API and any other relevant libraries.
>
> The repository is kept online as a reference project and an example of working with the Discord API.

## Features
- Full music functionality: Play, Pause, Skip.
- Other minor commands, such as kicking a user.
- For full list of commands:
    - Type <b>!help</b> in a channel while the bot is running.

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
  - Make sure to enable the Intents for the bot in the Discord Developer Portal.
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
There are two ways you can run the bot (need to be in the main project directory):
- First method:
  - Type `node src/main.js` on the terminal to start running the bot.
- Second method:
  - Type `npm run dev` on the terminal to start running the bot using the nodemon package, which will automatically restart the bot when changes are made to the code.