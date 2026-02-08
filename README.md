# Hypixel Player Notifier

A Discord bot built with Discord.js and MongoDB to track the online/offline status of Hypixel players.

## Commands
- **/api-key [key]**: Link your Hypixel API key to the bot.
- **/status [username]**: Real-time lookup of a player's status, game mode, and discord link.
- **/notify [username]**: Add a player to your automated watch list (Max 10).
- **/notify-list**: Manage and view your current watch list.
- **/notify-remove [username]**: Remove a player from your watch list.

## Technical Architecture
- **Polling System**: A 60-second heartbeat loop that iterates through tracked players.
- **Rate Limiting**: Implements a 500ms staggered delay per request and monitors `RateLimit-Remaining` headers to prevent API 429 errors.
- **State Management**: Uses MongoDB to store player UUIDs and `lastStatus` to ensure notifications only trigger on state changes.
- **Validation**: Auto-detects invalid API keys (403 errors) and notifies the user to re-link their account.

## Setup
1. Define `TOKEN` and `MONGO_URI` in your `.env` file.
2. Run `npm install` to grab dependencies.
3. Start with `node index.js`.