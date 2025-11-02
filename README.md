# Bolt — Discord AI Bot (OpenAI)

Made by Quited_devs — https://github.com/Quited-devs/Bolt

Bolt is a lightweight Discord bot that uses the OpenAI API to generate AI-powered replies in a single specified channel.

## Features

- Reads secrets from a `.env` file.
- Only responds to messages in a configured Discord channel.
- Ignores messages from bots and from other channels.
- Uses the OpenAI API to generate replies.
- Clear comments and error handling for maintainability.

---

## Requirements

- Node.js 16.9+ (LTS recommended). Download: https://nodejs.org/
- A Discord application and bot token (create in the Discord Developer Portal).
 - An OpenAI API key (create at https://platform.openai.com/).

## Project structure

```
bolt-discord-bot/
├─ src/
│  ├─ index.js           # bot entrypoint
│  └─ openaiClient.js    # OpenAI API helper
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
- `OPENAI_API_KEY` — your OpenAI API key.
- `OPENAI_MODEL` — optional model override (see `.env.example`).

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

Then, send a message in the configured channel. Bolt will respond using the OpenAI API.

## OpenAI notes

- The included `src/openaiClient.js` uses the official `openai` npm package and the Responses API. Provide `OPENAI_API_KEY` in `.env`.
- You may override the default model with `OPENAI_MODEL` in `.env` if you need to target a specific model.

If responses look wrong, open `src/openaiClient.js` and adjust parsing or model selection to match your OpenAI account and models.

## Troubleshooting

- "Missing DISCORD_BOT_TOKEN" or "Missing DISCORD_CHANNEL_ID": ensure `.env` is present and contains the required keys.
- If the bot does not see message content, ensure the `MESSAGE CONTENT INTENT` is enabled for the bot in the Discord Developer Portal and the bot has permission to read messages in the channel.
 - If OpenAI requests fail: verify `OPENAI_API_KEY` is correct and that your account has access to the model you selected.

## Extending Bolt

- Add message pre-processing to ignore commands or mentions.
- Add rate limiting to avoid hitting OpenAI API quotas.
- Use richer prompts with system messages and instruction tuning.

Branching note

If you're organizing this repo with branches, this main (default) branch has been updated to use OpenAI. You mentioned creating an `openai` branch — if you want, push these changes to that branch and keep `main` or another branch for alternate providers.

## License

This project is released under the MIT License. See the `LICENSE` file.
