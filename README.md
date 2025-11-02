# Bolt — Discord AI Bot (Gemini)

Made by Quited_devs — https://github.com/Quited-devs/Bolt

Bolt is a lightweight Discord bot that uses the Gemini API to generate AI-powered replies in a single specified channel.

## Features

- Reads secrets from a `.env` file.
- Only responds to messages in a configured Discord channel.
- Ignores messages from bots and from other channels.
- Uses the Gemini API to generate replies.
- Clear comments and error handling for maintainability.

---

## Requirements

- Node.js 16.9+ (LTS recommended). Download: https://nodejs.org/
- A Discord application and bot token (create in the Discord Developer Portal).
- A Gemini API token and endpoint (depends on your provider).

## Project structure

```
bolt-discord-bot/
├─ src/
│  ├─ index.js           # bot entrypoint
│  └─ geminiClient.js    # Gemini API helper
├─ .env.example
├─ package.json
├─ README.md
└─ LICENSE
```

## Setup

1. Clone or copy the project into a folder.
2. Install dependencies:

```powershell
# Windows PowerShell
npm install
```

3. Create a `.env` file at the project root. You can copy the example and fill in the values:

```powershell
copy .env.example .env
# Then edit .env with your token and IDs
```

Example `.env` keys:

- `DISCORD_BOT_TOKEN` — your Discord bot token.
- `DISCORD_CHANNEL_ID` — the exact channel ID Bolt should respond in.
- `GEMINI_API_URL` — the Gemini API endpoint (placeholder provided). Replace with your provider's URL.
- `GEMINI_API_TOKEN` — your Gemini API key/token.

Notes:
- If you don't have the channel ID: enable Developer Mode in Discord (User Settings → Advanced → Developer Mode), then right-click the channel and click "Copy ID".
- The bot uses the Message Content intent. Make sure this intent is enabled in your bot settings in the Discord Developer Portal.

## Running the bot

Start the bot with:

```powershell
npm start
```

If everything is correct the console should show a message like:

```
Bolt is online as YourBotName#1234
```

Then, send a message in the configured channel. Bolt will respond using the Gemini API.

## Gemini API notes

- The included `src/geminiClient.js` uses a generic POST format (`{ input: "..." }`) and sends `Authorization: Bearer <token>`.
- Different Gemini deployments/providers may expect a different request/response schema. If responses look wrong, open `src/geminiClient.js` and adapt the request body or response parsing to fit your provider's API docs.

## Troubleshooting

- "Missing DISCORD_BOT_TOKEN" or "Missing DISCORD_CHANNEL_ID": ensure `.env` is present and contains the required keys.
- If the bot does not see message content, ensure the `MESSAGE CONTENT INTENT` is enabled for the bot in the Discord Developer Portal and the bot has permission to read messages in the channel.
- If Gemini requests fail: verify `GEMINI_API_URL` and `GEMINI_API_TOKEN` are correct and that your provider allows the request origin.

## Extending Bolt

- Add message pre-processing to ignore commands or mentions.
- Add rate limiting to avoid hitting Gemini API quotas.
- Use richer prompts with system messages and instruction tuning.

## License

This project is released under the MIT License. See the `LICENSE` file.
