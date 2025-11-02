/*
  Bolt — Discord AI bot entrypoint
  - Reads TOKEN, CHANNEL_ID, and OPENAI_API_KEY from .env
  - Only responds to messages in CHANNEL_ID
  - Ignores messages from other channels and from bots
  - Uses OpenAI via src/openaiClient.js to generate replies
*/

require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { sendPrompt } = require('./openaiClient');

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const ALLOWED_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // only respond in this channel
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!DISCORD_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN in .env');
  process.exit(1);
}
if (!ALLOWED_CHANNEL_ID) {
  console.error('Missing DISCORD_CHANNEL_ID in .env');
  process.exit(1);
}
if (!OPENAI_KEY) {
  console.error('Missing OPENAI_API_KEY in .env');
  process.exit(1);
}

// Create Discord client with necessary intents to read message content
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`Bolt is online as ${client.user.tag}`);
});

// Message handler
client.on('messageCreate', async (message) => {
  try {
    // Ignore DMs, webhooks, and other bots
    if (!message.guild) return; // skip DMs
    if (message.author.bot) return;
    if (!message.channel) return;

    // Only respond in the allowed channel
    if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

    // Optional: ignore very short messages
    const content = message.content?.trim();
    if (!content) return;

    console.log(`Received message from ${message.author.tag} in ${message.channel.id}: ${content}`);

    // Show typing indicator while we generate
    try { await message.channel.sendTyping(); } catch (e) { /* ignore sendTyping errors */ }

    // Build a prompt for the model — keep it simple. You can expand system instructions as needed.
    const prompt = `You are Bolt, a helpful, concise, and polite assistant in a Discord channel. User said: ${content}`;

    // Call OpenAI client
    let aiReply;
    try {
      aiReply = await sendPrompt(prompt, { maxTokens: 400 });
    } catch (apiErr) {
      console.error('Error from OpenAI API:', apiErr.message || apiErr);
      // Reply with a gentle error message so users know something went wrong
      await message.reply('Sorry, I had trouble generating a response right now. Please try again later.');
      return;
    }

    // Ensure reply is not empty
    if (!aiReply || typeof aiReply !== 'string' || !aiReply.trim()) {
      await message.reply("I couldn't think of a response. Try rephrasing your message.");
      return;
    }

    // Send reply — use reply() so it threads the message; adjust as desired
    await message.reply(aiReply);
  } catch (err) {
    // Catch-all to prevent the bot from crashing on unexpected errors
    console.error('Unhandled error processing message:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
client.login(DISCORD_TOKEN).catch(err => {
  console.error('Failed to login to Discord:', err);
  process.exit(1);
});
